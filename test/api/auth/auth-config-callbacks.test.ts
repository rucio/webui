/**
 * Unit tests for NextAuth jwt() and session() callbacks defined in auth.config.ts.
 *
 * Coverage:
 * (a) OIDC sign-in stores account.refresh_token in token.rucioOidcRefreshToken (JWT only).
 * (b) session() callback does NOT expose rucioOidcRefreshToken — it must remain in the
 *     encrypted JWT and never be surfaced to the client-visible session object.
 * (c) session() callback does NOT add a separate rucioAuthX509DN field; the DN for an
 *     x509 user is already carried by session.user.rucioIdentity.
 * (d) trigger='update' with session.rucioOidcRefreshToken rotates the stored refresh token
 *     inside the JWT.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Module mocks — must be declared before any import so Jest can hoist them.
// ──────────────────────────────────────────────────────────────────────────────

jest.mock('@/lib/infrastructure/ioc/container-config', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

jest.mock('@/lib/infrastructure/auth/rucio-oidc-helper', () => ({
    getRucioAccountsForIdentity: jest.fn(),
    selectAccountFromMultiple: jest.fn(),
    IdentityNotMappedError: class IdentityNotMappedError extends Error {
        name = 'IdentityNotMappedError';
    },
    InvalidTokenError: class InvalidTokenError extends Error {
        name = 'InvalidTokenError';
    },
    RucioAPIError: class RucioAPIError extends Error {
        name = 'RucioAPIError';
    },
}));

jest.mock('@/lib/infrastructure/auth/oidc-providers', () => ({
    getIssuerFromEnv: jest.fn(),
}));

jest.mock('@/lib/core/services/resolve-account-role', () => ({
    resolveAccountRole: jest.fn(),
}));

jest.mock('@/lib/infrastructure/auth/nextauth-userpass-token-adapter', () => ({
    authorizeUserPassToken: jest.fn(),
}));

jest.mock('@/lib/infrastructure/auth/nextauth-x509-adapter', () => ({
    authorizeX509: jest.fn(),
}));

// ──────────────────────────────────────────────────────────────────────────────
// Real imports (after mocks)
// ──────────────────────────────────────────────────────────────────────────────

import { authConfig } from '@/lib/infrastructure/auth/auth.config';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import type { SessionUser } from '@/types/next-auth';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import { getRucioAccountsForIdentity, selectAccountFromMultiple } from '@/lib/infrastructure/auth/rucio-oidc-helper';
import { getIssuerFromEnv } from '@/lib/infrastructure/auth/oidc-providers';
import { resolveAccountRole } from '@/lib/core/services/resolve-account-role';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Builds a minimal fake JWT string whose payload can be decoded with
 * Buffer.from(parts[1], 'base64').  The signature segment is a placeholder.
 */
function makeFakeJwt(payload: Record<string, unknown>): string {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    return `${header}.${body}.fakesignature`;
}

function makeSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
    return {
        id: 'root@test',
        email: '',
        emailVerified: null,
        rucioIdentity: '/C=US/O=TestOrg/CN=Test User',
        rucioAccount: 'root',
        rucioAuthType: AuthType.x509,
        rucioAuthToken: 'rucio-test-token',
        rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
        rucioOIDCProvider: null,
        rucioVO: 'def',
        role: Role.USER,
        isLoggedIn: true,
        ...overrides,
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// jwt() callback tests
// ──────────────────────────────────────────────────────────────────────────────

describe('auth.config.ts — jwt() callback', () => {
    // Type assertion: NextAuthConfig.callbacks is defined in authConfig.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const jwtCallback = authConfig.callbacks!.jwt!;

    beforeEach(() => {
        jest.clearAllMocks();

        // Stub the IoC container so both ENV_CONFIG and ACCOUNT gateways resolve.
        (appContainer.get as jest.Mock).mockImplementation((symbol: symbol) => {
            if (symbol === GATEWAYS.ENV_CONFIG) {
                return {
                    oidcExpectedAudience: jest.fn().mockResolvedValue('test-audience'),
                    rucioHost: jest.fn().mockResolvedValue('https://rucio.example.com'),
                };
            }
            if (symbol === GATEWAYS.ACCOUNT) {
                return {
                    listAccountAttributes: jest.fn().mockResolvedValue({ attributes: [] }),
                };
            }
            return {};
        });

        (getRucioAccountsForIdentity as jest.Mock).mockResolvedValue(['testaccount']);
        (selectAccountFromMultiple as jest.Mock).mockReturnValue('testaccount');
        (getIssuerFromEnv as jest.Mock).mockResolvedValue('https://issuer.example.com');
        (resolveAccountRole as jest.Mock).mockReturnValue({
            role: Role.USER,
            country: undefined,
            countryRole: undefined,
        });
    });

    // ── Test (a) ────────────────────────────────────────────────────────────
    it('(a) OIDC sign-in stores account.refresh_token in token.rucioOidcRefreshToken', async () => {
        const accessToken = makeFakeJwt({
            sub: 'user-sub',
            iss: 'https://issuer.example.com',
            aud: 'test-audience',
            exp: Math.floor(Date.now() / 1000) + 3600,
        });

        const result = await jwtCallback({
            token: {} as any,
            user: null as any,
            account: {
                type: 'oauth',
                provider: 'test-oidc',
                access_token: accessToken,
                refresh_token: 'oidc-refresh-token-abc123',
                expires_at: Math.floor(Date.now() / 1000) + 3600,
            } as any,
            profile: {
                sub: 'user-sub',
                iss: 'https://issuer.example.com',
            } as any,
            trigger: 'signIn',
            session: null as any,
        });

        expect(result.rucioOidcRefreshToken).toBe('oidc-refresh-token-abc123');
    });

    // ── Test (d) ────────────────────────────────────────────────────────────
    it('(d) trigger=update with refresh payload updates user tokens and rotates refresh token', async () => {
        const existingUser = makeSessionUser({
            rucioAuthType: AuthType.OIDC,
            rucioOIDCProvider: 'test-oidc',
            rucioAuthToken: 'old-access-token',
            rucioAuthTokenExpires: '2025-01-01T00:00:00Z',
        });

        const result = await jwtCallback({
            token: {
                user: existingUser,
                allUsers: [existingUser],
                rucioOidcRefreshToken: 'old-refresh-token',
            } as any,
            user: null as any,
            account: null as any,
            profile: null as any,
            trigger: 'update',
            session: {
                rucioAuthToken: 'new-access-token',
                rucioAuthTokenExpires: '2030-06-01T00:00:00Z',
                rucioOidcRefreshToken: 'rotated-refresh-token',
            } as any,
        });

        expect(result.rucioOidcRefreshToken).toBe('rotated-refresh-token');
        expect(result.user?.rucioAuthToken).toBe('new-access-token');
        expect(result.user?.rucioAuthTokenExpires).toBe('2030-06-01T00:00:00Z');
        // allUsers entry for the active account should also be updated
        expect(result.allUsers?.[0].rucioAuthToken).toBe('new-access-token');
    });

    it('(d) trigger=update without rucioOidcRefreshToken preserves the existing refresh token', async () => {
        const existingUser = makeSessionUser({
            rucioAuthType: AuthType.OIDC,
            rucioOIDCProvider: 'test-oidc',
        });

        const result = await jwtCallback({
            token: {
                user: existingUser,
                allUsers: [existingUser],
                rucioOidcRefreshToken: 'preserved-refresh-token',
            } as any,
            user: null as any,
            account: null as any,
            profile: null as any,
            trigger: 'update',
            session: {
                rucioAuthToken: 'new-access-token',
                rucioAuthTokenExpires: '2030-06-01T00:00:00Z',
                // rucioOidcRefreshToken deliberately absent
            } as any,
        });

        expect(result.rucioOidcRefreshToken).toBe('preserved-refresh-token');
        expect(result.user?.rucioAuthToken).toBe('new-access-token');
    });

    // ── token.exp tied to Rucio token expiry ────────────────────────────────
    it('sets token.exp to the Unix timestamp of rucioAuthTokenExpires for non-OIDC sign-in', async () => {
        const user = makeSessionUser({
            rucioAuthType: AuthType.USERPASS,
            rucioAuthTokenExpires: '2030-06-15T12:00:00Z',
        });

        const result = await jwtCallback({
            token: {} as any,
            user: user as any,
            account: { type: 'credentials' } as any,
            profile: null as any,
            trigger: 'signIn',
            session: null as any,
        });

        const expectedExp = Math.floor(new Date('2030-06-15T12:00:00Z').getTime() / 1000);
        expect(result.exp).toBe(expectedExp);
    });

    it('caps token.exp at sessionStartedAt + 24h for OIDC when rucioAuthTokenExpires is beyond the ceiling', async () => {
        // Simulate an OIDC token that expires 48 hours from now — beyond the 24h ceiling.
        const sessionStartedAt = Math.floor(Date.now() / 1000);
        const farFutureExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        const existingUser = makeSessionUser({
            rucioAuthType: AuthType.OIDC,
            rucioOIDCProvider: 'test-oidc',
            rucioAuthTokenExpires: farFutureExpiry,
        });

        const result = await jwtCallback({
            token: {
                user: existingUser,
                allUsers: [existingUser],
                sessionStartedAt,
            } as any,
            user: null as any,
            account: null as any,
            profile: null as any,
            trigger: 'update',
            session: {
                rucioAuthToken: 'refreshed-token',
                rucioAuthTokenExpires: farFutureExpiry,
            } as any,
        });

        const hardCeil = sessionStartedAt + 24 * 60 * 60;
        expect(result.exp).toBe(hardCeil);
    });

    it('uses rucioAuthTokenExpires (not the ceiling) for OIDC when token expires before 24h', async () => {
        // Token expires in 1 hour — well within the 24h ceiling.
        const sessionStartedAt = Math.floor(Date.now() / 1000);
        const shortExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const existingUser = makeSessionUser({
            rucioAuthType: AuthType.OIDC,
            rucioOIDCProvider: 'test-oidc',
            rucioAuthTokenExpires: shortExpiry,
        });

        const result = await jwtCallback({
            token: {
                user: existingUser,
                allUsers: [existingUser],
                sessionStartedAt,
            } as any,
            user: null as any,
            account: null as any,
            profile: null as any,
            trigger: 'update',
            session: {
                rucioAuthToken: 'refreshed-token',
                rucioAuthTokenExpires: shortExpiry,
            } as any,
        });

        const expectedExp = Math.floor(new Date(shortExpiry).getTime() / 1000);
        expect(result.exp).toBe(expectedExp);
    });

    it('(a) OIDC sign-in without refresh_token does not set rucioOidcRefreshToken', async () => {
        const accessToken = makeFakeJwt({
            sub: 'user-sub',
            iss: 'https://issuer.example.com',
            aud: 'test-audience',
            exp: Math.floor(Date.now() / 1000) + 3600,
        });

        const result = await jwtCallback({
            token: {} as any,
            user: null as any,
            account: {
                type: 'oauth',
                provider: 'test-oidc',
                access_token: accessToken,
                // no refresh_token
                expires_at: Math.floor(Date.now() / 1000) + 3600,
            } as any,
            profile: {
                sub: 'user-sub',
                iss: 'https://issuer.example.com',
            } as any,
            trigger: 'signIn',
            session: null as any,
        });

        expect(result.rucioOidcRefreshToken).toBeUndefined();
    });
});

// ──────────────────────────────────────────────────────────────────────────────
// session() callback tests
// ──────────────────────────────────────────────────────────────────────────────

describe('auth.config.ts — session() callback', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sessionCallback = authConfig.callbacks!.session!;

    // ── Test (b) ────────────────────────────────────────────────────────────
    it('(b) session() does NOT expose rucioOidcRefreshToken even when token has it', async () => {
        const oidcUser = makeSessionUser({
            rucioAuthType: AuthType.OIDC,
            rucioOIDCProvider: 'test-oidc',
        });

        const result = await sessionCallback({
            session: { user: oidcUser, allUsers: [oidcUser], expires: '2030-01-01' } as any,
            token: {
                user: oidcUser,
                allUsers: [oidcUser],
                rucioOidcRefreshToken: 'super-secret-refresh-token',
            } as any,
        });

        // The refresh token must NOT leak into the client-visible session.
        expect((result as any).rucioOidcRefreshToken).toBeUndefined();
    });

    // ── Test (c) ────────────────────────────────────────────────────────────
    it('(c) session() sets session.user.rucioIdentity for x509 user; no separate rucioAuthX509DN field', async () => {
        const dn = '/C=DE/O=DESY/CN=Atlas User';
        const x509User = makeSessionUser({
            rucioAuthType: AuthType.x509,
            rucioIdentity: dn,
        });

        const result = await sessionCallback({
            session: { user: x509User, allUsers: [x509User], expires: '2030-01-01' } as any,
            token: {
                user: x509User,
                allUsers: [x509User],
            } as any,
        });

        // DN is accessible through the standard user identity field.
        expect(result.user.rucioIdentity).toBe(dn);
        // No redundant top-level field should be added.
        expect((result as any).rucioAuthX509DN).toBeUndefined();
    });

    it('session() populates session.user and session.allUsers from token', async () => {
        const user = makeSessionUser();

        const result = await sessionCallback({
            session: { user: {} as any, allUsers: [], expires: '2030-01-01' } as any,
            token: {
                user,
                allUsers: [user],
            } as any,
        });

        expect(result.user).toEqual(user);
        expect(result.allUsers).toEqual([user]);
    });

    it('session() forwards OIDC error fields from token to session', async () => {
        const result = await sessionCallback({
            session: { user: {} as any, allUsers: [], expires: '2030-01-01' } as any,
            token: {
                oidcError: 'Identity not mapped',
                oidcIdentity: 'SUB=abc, ISS=https://issuer.example.com',
                oidcProvider: 'test-oidc',
            } as any,
        });

        expect((result as any).oidcError).toBe('Identity not mapped');
        expect((result as any).oidcIdentity).toBe('SUB=abc, ISS=https://issuer.example.com');
        expect((result as any).oidcProvider).toBe('test-oidc');
    });

    it('session() does not set session.user when token has no user', async () => {
        const baseSession = { user: { rucioAccount: 'original' } as any, allUsers: [], expires: '2030-01-01' };

        const result = await sessionCallback({
            session: baseSession as any,
            token: {
                allUsers: [],
            } as any,
        });

        // user should remain unchanged (not overwritten to undefined)
        expect(result.user).toEqual({ rucioAccount: 'original' });
    });
});
