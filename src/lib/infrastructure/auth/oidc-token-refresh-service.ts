import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';

/**
 * Typed output from the OIDC token refresh application service.
 */
export type OidcRefreshResult =
    | {
          success: true;
          /** New Rucio auth token (equal to the OIDC access token). */
          rucioAuthToken: string;
          /** ISO timestamp when the new token expires. */
          rucioAuthTokenExpires: string;
          /** New OIDC refresh token if the provider rotated it; otherwise undefined. */
          rucioOidcRefreshToken?: string;
      }
    | { success: false; error: string };

/**
 * Input parameters for the OIDC token refresh application service.
 */
export interface OidcRefreshParams {
    /** The OIDC refresh token read from the encrypted JWT cookie (never from the client). */
    refreshToken: string;
    /** The OIDC provider name as stored in the session (e.g. 'cern'). */
    providerName: string;
    /**
     * Injected EnvConfigGateway — resolved by the caller (route handler / composition root)
     * so this service does not depend on the IoC container directly.
     */
    envConfigGateway: EnvConfigGatewayOutputPort;
}

/**
 * Application service: OIDC session token refresh.
 *
 * Resolves the provider configuration, calls its token endpoint with
 * grant_type=refresh_token, and returns the refreshed token material.
 *
 * Cookie persistence is handled by the caller via NextAuth's `unstable_update`,
 * which invokes the `jwt` callback with `trigger='update'` and writes the
 * session cookie (with chunking) through NextAuth's own mechanism.
 */
export async function refreshOidcToken(params: OidcRefreshParams): Promise<OidcRefreshResult> {
    const { refreshToken, providerName, envConfigGateway } = params;

    // ── Step 1: Resolve the OIDC provider configuration ──────────────────
    let tokenEndpointUrl: string;
    let clientId: string;
    let clientSecret: string;

    try {
        const providers = await envConfigGateway.oidcProviders();
        const provider = providers.find(p => p.name.toLowerCase() === providerName.toLowerCase());

        if (!provider) {
            console.error(`[OidcRefresh] Provider '${providerName}' not found in env config`);
            return { success: false, error: `OIDC provider '${providerName}' not found in configuration` };
        }

        tokenEndpointUrl = provider.refreshTokenUrl || provider.tokenUrl || '';
        clientId = provider.clientId;
        clientSecret = provider.clientSecret;

        if (!tokenEndpointUrl) {
            console.error(`[OidcRefresh] No token endpoint URL for provider '${providerName}'`);
            return { success: false, error: `No token endpoint configured for OIDC provider '${providerName}'` };
        }
    } catch (error) {
        console.error('[OidcRefresh] Failed to load OIDC provider config from env:', error);
        return { success: false, error: 'Failed to load OIDC provider configuration' };
    }

    // ── Step 2: Exchange the refresh token for a new access token ─────────
    let newAccessToken: string;
    let newRefreshToken: string | undefined;
    let expiresIn: number;

    try {
        const tokenResponse = await fetch(tokenEndpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
            }).toString(),
        });

        if (!tokenResponse.ok) {
            const errBody = await tokenResponse.text().catch(() => '');
            console.error(`[OidcRefresh] OIDC token endpoint returned ${tokenResponse.status}: ${errBody}`);
            return { success: false, error: `OIDC token refresh failed with status ${tokenResponse.status}` };
        }

        const tokenData = await tokenResponse.json();
        newAccessToken = tokenData.access_token as string;
        newRefreshToken = tokenData.refresh_token as string | undefined;
        expiresIn = (tokenData.expires_in as number) ?? 3600;

        if (!newAccessToken) {
            console.error('[OidcRefresh] OIDC provider returned no access_token in response');
            return { success: false, error: 'OIDC provider returned no access token' };
        }
    } catch (error) {
        console.error('[OidcRefresh] Network/parse error during OIDC token exchange:', error);
        return { success: false, error: 'Network error during OIDC token refresh' };
    }

    // Dev-only override: shorten the refreshed session's expiry so the
    // SessionMonitor refresh cycle fires repeatedly during testing. The
    // provider's access token remains valid for its real lifetime.
    const devShortExpiry = process.env.DEV_SHORT_SESSION_SECONDS;
    const effectiveExpiresIn = devShortExpiry ? Number(devShortExpiry) : expiresIn;
    const rucioAuthTokenExpires = new Date(Date.now() + effectiveExpiresIn * 1000).toISOString();

    return {
        success: true,
        rucioAuthToken: newAccessToken,
        rucioAuthTokenExpires,
        rucioOidcRefreshToken: newRefreshToken,
    };
}
