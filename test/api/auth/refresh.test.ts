/**
 * Unit tests for POST /api/auth/refresh (src/app/api/auth/refresh/route.ts).
 *
 * The route reads the active session, delegates OIDC provider-token exchange
 * to refreshOidcToken(), and persists the refreshed tokens via NextAuth's
 * unstable_update (exported as `update` from auth.ts). Cookie writing is
 * NextAuth's responsibility — we assert that `update` is invoked with the
 * correct payload.
 *
 * Coverage:
 * (a) Unauthenticated request → 401
 * (b) Missing NEXTAUTH_SECRET → 500
 * (c) Userpass auth type → 200 success:false; update NOT called
 * (d) x509 auth type → 200 success:false; update NOT called
 * (e) OIDC — JWT cannot be decoded from cookie → 200 success:false
 * (f) OIDC — no refresh token in JWT → 200 success:false; service NOT called
 * (g) OIDC — service reports failure → 200 success:false; update NOT called
 * (h) OIDC — successful refresh: update called with refreshed payload → 200 success:true
 */

// `@/lib/infrastructure/auth/auth` and `next-auth/*` are globally aliased to
// shared mocks via moduleNameMapper (see jest.api.config.js). We only need to
// override their default behavior per-test via jest.fn().mockResolvedValue.

jest.mock('@/lib/infrastructure/auth/oidc-token-refresh-service', () => ({
    refreshOidcToken: jest.fn(),
}));

// Route resolves EnvConfigGateway from the IoC container and passes it to
// refreshOidcToken.  Since refreshOidcToken is fully mocked, the gateway
// value is unused — only need get() to return a non-null object.
jest.mock('@/lib/infrastructure/ioc/container-config', () => ({
    __esModule: true,
    default: { get: jest.fn().mockReturnValue({ oidcProviders: jest.fn().mockResolvedValue([]) }) },
}));

// ──────────────────────────────────────────────────────────────────────────────
// Polyfill Response.json for jsdom (NextResponse.json delegates to it).
// ──────────────────────────────────────────────────────────────────────────────

if (typeof (global.Response as any).json !== 'function') {
    (global.Response as any).json = function jsonPolyfill(data: unknown, init?: ResponseInit): Response {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: {
                'content-type': 'application/json',
                ...(init?.headers instanceof Headers
                    ? Object.fromEntries((init.headers as Headers).entries())
                    : (init?.headers ?? {})),
            },
        });
    };
}

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/refresh/route';
import { auth } from '@/lib/infrastructure/auth/auth';
import { getToken } from 'next-auth/jwt';
import { refreshOidcToken } from '@/lib/infrastructure/auth/oidc-token-refresh-service';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import type { SessionUser } from '@/lib/core/entity/auth-models';

// `update` (NextAuth's unstable_update) is exported via a renamed destructure
// in auth.ts, which SWC doesn't wire up for named ESM imports. Access it via
// require so the mock's live binding is used.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { update } = require('@/lib/infrastructure/auth/auth') as { update: jest.Mock };

function makeSessionUser(overrides: Partial<SessionUser> = {}): SessionUser {
    return {
        rucioIdentity: 'ddmlab',
        rucioAccount: 'root',
        rucioVO: 'def',
        rucioAuthToken: 'rucio-test-token',
        rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
        rucioAuthType: AuthType.OIDC,
        rucioOIDCProvider: 'cern',
        role: Role.USER,
        isLoggedIn: true,
        ...overrides,
    };
}

function makeRequest(): NextRequest {
    return new NextRequest('http://localhost:3000/api/auth/refresh', { method: 'POST' });
}

describe('POST /api/auth/refresh', () => {
    const originalSecret = process.env.NEXTAUTH_SECRET;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXTAUTH_SECRET = 'test-nextauth-secret';
    });

    afterEach(() => {
        process.env.NEXTAUTH_SECRET = originalSecret;
    });

    it('(a) returns 401 when auth() returns null', async () => {
        (auth as jest.Mock).mockResolvedValue(null);

        const res = await POST(makeRequest());

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/session/i);
        expect(update).not.toHaveBeenCalled();
    });

    it('(a) returns 401 when session user is not logged in', async () => {
        (auth as jest.Mock).mockResolvedValue({ user: makeSessionUser({ isLoggedIn: false }) });

        const res = await POST(makeRequest());

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.success).toBe(false);
    });

    it('(b) returns 500 when NEXTAUTH_SECRET is absent', async () => {
        delete process.env.NEXTAUTH_SECRET;
        (auth as jest.Mock).mockResolvedValue({ user: makeSessionUser() });

        const res = await POST(makeRequest());

        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/configuration/i);
    });

    it('(c) returns 200 success:false for userpass and does not call update', async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: makeSessionUser({ rucioAuthType: AuthType.USERPASS }),
        });

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/userpass/i);
        expect(update).not.toHaveBeenCalled();
        expect(refreshOidcToken).not.toHaveBeenCalled();
    });

    it('(d) returns 200 success:false for x509 and does not call update', async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: makeSessionUser({ rucioAuthType: AuthType.x509 }),
        });

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/x509/i);
        expect(update).not.toHaveBeenCalled();
        expect(refreshOidcToken).not.toHaveBeenCalled();
    });

    it('(e) returns 200 success:false when JWT cannot be decoded from cookie', async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: makeSessionUser({ rucioAuthType: AuthType.OIDC, rucioOIDCProvider: 'cern' }),
        });
        (getToken as jest.Mock).mockResolvedValue(null);

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/session token/i);
        expect(update).not.toHaveBeenCalled();
    });

    it('(f) returns 200 success:false when no OIDC refresh token is stored in the JWT', async () => {
        (auth as jest.Mock).mockResolvedValue({
            user: makeSessionUser({ rucioAuthType: AuthType.OIDC, rucioOIDCProvider: 'cern' }),
        });
        (getToken as jest.Mock).mockResolvedValue({ user: makeSessionUser() });

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/refresh token/i);
        expect(refreshOidcToken).not.toHaveBeenCalled();
        expect(update).not.toHaveBeenCalled();
    });

    it('(g) returns 200 success:false when the service reports a failure; update not called', async () => {
        const user = makeSessionUser({ rucioAuthType: AuthType.OIDC, rucioOIDCProvider: 'cern' });
        (auth as jest.Mock).mockResolvedValue({ user });
        (getToken as jest.Mock).mockResolvedValue({ rucioOidcRefreshToken: 'valid-refresh-token' });
        (refreshOidcToken as jest.Mock).mockResolvedValue({
            success: false,
            error: 'OIDC token refresh failed with status 401',
        });

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/401/);
        expect(update).not.toHaveBeenCalled();
    });

    it('(h) returns 200 success:true and calls update with refreshed payload on success', async () => {
        const user = makeSessionUser({ rucioAuthType: AuthType.OIDC, rucioOIDCProvider: 'cern' });
        (auth as jest.Mock).mockResolvedValue({ user });
        (getToken as jest.Mock).mockResolvedValue({ user, rucioOidcRefreshToken: 'valid-refresh-token' });
        (refreshOidcToken as jest.Mock).mockResolvedValue({
            success: true,
            rucioAuthToken: 'brand-new-access-token',
            rucioAuthTokenExpires: '2030-06-01T00:00:00.000Z',
            rucioOidcRefreshToken: 'rotated-refresh-token',
        });

        const res = await POST(makeRequest());

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body.newExpiry).toBe('2030-06-01T00:00:00.000Z');

        // Cookie persistence is delegated to NextAuth's unstable_update
        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({
                rucioAuthToken: 'brand-new-access-token',
                rucioAuthTokenExpires: '2030-06-01T00:00:00.000Z',
                rucioOidcRefreshToken: 'rotated-refresh-token',
            }),
        );
    });

    it('(h) passes the correct parameters to the refresh service', async () => {
        const user = makeSessionUser({ rucioAuthType: AuthType.OIDC, rucioOIDCProvider: 'cern' });
        (auth as jest.Mock).mockResolvedValue({ user });
        (getToken as jest.Mock).mockResolvedValue({ user, rucioOidcRefreshToken: 'my-refresh-token' });
        (refreshOidcToken as jest.Mock).mockResolvedValue({
            success: true,
            rucioAuthToken: 'new-token',
            rucioAuthTokenExpires: '2030-06-01T00:00:00.000Z',
        });

        await POST(makeRequest());

        expect(refreshOidcToken).toHaveBeenCalledWith(
            expect.objectContaining({
                refreshToken: 'my-refresh-token',
                providerName: 'cern',
            }),
        );
    });
});
