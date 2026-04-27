/**
 * Unit tests for refreshOidcToken()
 * (src/lib/infrastructure/auth/oidc-token-refresh-service.ts).
 *
 * The service is responsible for calling the OIDC provider's token endpoint
 * and returning the refreshed token material. Cookie persistence is handled
 * by the route via NextAuth's unstable_update and is NOT this service's job.
 *
 * Coverage:
 * (a) Provider not found in env config → success:false
 * (b) No token endpoint URL configured for provider → success:false
 * (c) OIDC token endpoint returns an HTTP error status → success:false
 * (d) Network failure (fetch throws) → success:false
 * (e) Successful refresh returns new access token and rotated refresh token
 * (f) Successful refresh without new refresh_token leaves rucioOidcRefreshToken undefined
 * (g) DEV_SHORT_SESSION_SECONDS override shortens expiry
 */

import { refreshOidcToken } from '@/lib/infrastructure/auth/oidc-token-refresh-service';
import type { OIDCProvider } from '@/lib/core/entity/auth-models';

function makeOIDCProvider(overrides: Partial<OIDCProvider> = {}): OIDCProvider {
    return {
        name: 'cern',
        clientId: 'rucio-client',
        clientSecret: 'super-secret',
        authorizationUrl: 'https://sso.cern.ch/authorize',
        redirectUrl: 'https://rucio.example.com/callback',
        tokenUrl: 'https://sso.cern.ch/token',
        refreshTokenUrl: 'https://sso.cern.ch/token',
        ...overrides,
    };
}

function mockEnvConfig(providers: OIDCProvider[]) {
    return {
        oidcProviders: jest.fn().mockResolvedValue(providers),
    };
}

function makeParams(providers: OIDCProvider[] = [makeOIDCProvider()]) {
    return {
        refreshToken: 'initial-refresh-token',
        providerName: 'cern',
        envConfigGateway: mockEnvConfig(providers) as any,
    };
}

describe('refreshOidcToken()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
        delete process.env.DEV_SHORT_SESSION_SECONDS;
    });

    it('(a) returns success:false when the provider is not found in env config', async () => {
        const result = await refreshOidcToken(makeParams([]));

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toMatch(/cern/);
        }
    });

    it('(b) returns success:false when no token endpoint URL is configured for the provider', async () => {
        const provider = makeOIDCProvider({ tokenUrl: '', refreshTokenUrl: undefined });
        const result = await refreshOidcToken(makeParams([provider]));

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toMatch(/token endpoint/i);
        }
    });

    it('(c) returns success:false when the OIDC token endpoint returns an HTTP error', async () => {
        fetchMock.mockResponse('Unauthorized', { status: 401 });

        const result = await refreshOidcToken(makeParams());

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toMatch(/401/);
        }
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('(d) returns success:false on a network/fetch failure', async () => {
        fetchMock.mockReject(new Error('Network error'));

        const result = await refreshOidcToken(makeParams());

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toMatch(/network/i);
        }
    });

    it('(e) returns success:true with new access and rotated refresh tokens', async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                access_token: 'new-access-token',
                refresh_token: 'rotated-refresh-token',
                expires_in: 3600,
            }),
        );

        const result = await refreshOidcToken(makeParams());

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.rucioAuthToken).toBe('new-access-token');
            expect(result.rucioOidcRefreshToken).toBe('rotated-refresh-token');
            expect(Date.parse(result.rucioAuthTokenExpires)).toBeGreaterThan(Date.now());
        }
    });

    it('(f) returns success:true with undefined rucioOidcRefreshToken when the provider does not rotate it', async () => {
        fetchMock.mockResponse(
            JSON.stringify({
                access_token: 'new-access-token',
                expires_in: 3600,
            }),
        );

        const result = await refreshOidcToken(makeParams());

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.rucioOidcRefreshToken).toBeUndefined();
        }
    });

    it('(g) uses DEV_SHORT_SESSION_SECONDS to shorten expiry when set', async () => {
        process.env.DEV_SHORT_SESSION_SECONDS = '90';
        fetchMock.mockResponse(
            JSON.stringify({
                access_token: 'new-access-token',
                expires_in: 3600,
            }),
        );

        const before = Date.now();
        const result = await refreshOidcToken(makeParams());
        const after = Date.now();

        expect(result.success).toBe(true);
        if (result.success) {
            const expiry = Date.parse(result.rucioAuthTokenExpires);
            // Expiry should be ~90s from now, not the 3600s the provider advertised.
            expect(expiry).toBeGreaterThanOrEqual(before + 90_000);
            expect(expiry).toBeLessThanOrEqual(after + 90_000 + 100);
        }
    });
});
