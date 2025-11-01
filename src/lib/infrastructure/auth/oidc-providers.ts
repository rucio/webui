import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import { OIDCProvider } from '@/lib/core/entity/auth-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';

/**
 * Profile data returned from OIDC provider
 */
interface OIDCProfile {
    sub: string;
    email?: string;
    name?: string;
    preferred_username?: string;
    iss?: string;
    [key: string]: unknown;
}

/**
 * User data returned from profile callback
 * This extends the base User type with additional OIDC-specific fields
 */
interface OIDCUser {
    id: string;
    email: string;
    name: string;
    sub?: string;
    iss?: string;
    preferred_username?: string;
}

/**
 * Converts a Rucio OIDC provider configuration to a NextAuth OAuth provider
 *
 * This function takes the OIDC provider configuration from environment variables
 * (loaded via EnvConfigGateway) and creates a NextAuth-compatible OAuth provider config.
 *
 * @param oidcProvider - OIDC provider configuration from environment
 * @returns NextAuth OAuth provider configuration
 */
export function createNextAuthOAuthProvider(oidcProvider: OIDCProvider): OAuthConfig<OIDCProfile> {
    const providerName = oidcProvider.name.toLowerCase();

    // Parse scopes (default to 'openid profile email' if not specified)
    const scopes = oidcProvider.scopes?.join(' ') || 'openid profile email';

    // Build the OAuth provider configuration
    const oauthProvider: OAuthConfig<OIDCProfile> = {
        id: providerName,
        name: oidcProvider.name,
        type: 'oauth',
        clientId: oidcProvider.clientId,
        clientSecret: oidcProvider.clientSecret,
        issuer: oidcProvider.issuer, // OIDC issuer for token validation
        authorization: {
            url: oidcProvider.authorizationUrl,
            params: {
                scope: scopes,
                // Audience is required by Rucio for token validation
                // Rucio expects tokens to have aud: "rucio" claim
                audience: 'rucio',
            }
        },
        token: {
            url: oidcProvider.tokenUrl,
        },
        // UserInfo endpoint is optional but recommended for getting user profile
        userinfo: oidcProvider.userInfoUrl ? {
            url: oidcProvider.userInfoUrl,
        } : undefined,
        profile(profile: OIDCProfile) {
            // Extract user info from OIDC profile response
            // This data will be available in the JWT callback as 'user' and 'profile'
            // The profile parameter in JWT callback will have the full OIDC claims
             
            return {
                id: profile.sub, // Subject - unique user identifier
                email: profile.email || '',
                name: profile.name || profile.preferred_username || '',
                // Store additional OIDC claims for later use in JWT callback
                sub: profile.sub,
                iss: profile.iss,
                preferred_username: profile.preferred_username,
            } as any;
        },
    };

    // If a well-known OpenID configuration endpoint can be derived, add it
    // Most OIDC providers support /.well-known/openid-configuration
    // This allows NextAuth to auto-discover endpoints
    // Note: We're not using this since we have explicit URLs from env config
    // But it's here as a reference for future improvements

    return oauthProvider;
}

/**
 * Loads OIDC providers from environment variables and creates NextAuth OAuth providers
 *
 * This function:
 * 1. Uses EnvConfigGateway to load OIDC provider configs from environment
 * 2. Converts each provider to a NextAuth OAuth provider configuration
 * 3. Returns an array of providers ready to be used by NextAuth
 *
 * The OIDC providers are configured via environment variables following the pattern:
 * - OIDC_ENABLED=true
 * - OIDC_PROVIDERS=cern,indigo,keycloak
 * - OIDC_PROVIDER_{NAME}_CLIENT_ID=...
 * - OIDC_PROVIDER_{NAME}_CLIENT_SECRET=...
 * - etc.
 *
 * @returns Promise resolving to array of NextAuth OAuth provider configurations
 */
export async function loadOIDCProviders(): Promise<OAuthConfig<OIDCProfile>[]> {
    try {
        // Get the environment config gateway from IoC container
        const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);

        // Check if OIDC is enabled
        const oidcEnabled = await envConfigGateway.oidcEnabled();
        if (!oidcEnabled) {
            console.log('[OIDC] OIDC is not enabled, skipping provider loading');
            return [];
        }

        // Load OIDC providers from environment variables
        // This uses the existing EnvConfigGateway.oidcProviders() method
        // which reads OIDC_PROVIDERS and parses all provider configurations
        const oidcProviders: OIDCProvider[] = await envConfigGateway.oidcProviders();

        console.log(`[OIDC] Loaded ${oidcProviders.length} OIDC provider(s):`, oidcProviders.map(p => p.name).join(', '));

        // Convert each Rucio OIDC provider to NextAuth OAuth provider
        const nextAuthProviders = oidcProviders.map(provider => {
            console.log(`[OIDC] Creating NextAuth provider for: ${provider.name}`);
            return createNextAuthOAuthProvider(provider);
        });

        return nextAuthProviders;
    } catch (error) {
        console.error('[OIDC] Failed to load OIDC providers:', error);
        // Return empty array on error to prevent breaking the auth system
        // This allows the application to continue with other auth methods (userpass, x509)
        return [];
    }
}

/**
 * Synchronous version of loadOIDCProviders for use in module-level initialization
 *
 * Note: This is a workaround for NextAuth v5 which may not support async config.
 * It wraps the async function and stores the result.
 *
 * Usage:
 * const providers = loadOIDCProvidersSync();
 *
 * @returns Array of NextAuth OAuth provider configurations (may be empty if still loading)
 */
export function loadOIDCProvidersSync(): OAuthConfig<OIDCProfile>[] {
    let providers: OAuthConfig<OIDCProfile>[] = [];

    // Call async function and store result
    // This will execute immediately and update providers when complete
    loadOIDCProviders()
        .then(loadedProviders => {
            providers = loadedProviders;
        })
        .catch(error => {
            console.error('[OIDC] Failed to load OIDC providers synchronously:', error);
        });

    return providers;
}

/**
 * Helper to get issuer URL from environment for a given provider
 *
 * This is used in the JWT callback when we need to construct the Rucio identity string
 * Format: "SUB={sub}, ISS={issuer}"
 *
 * @param providerName - Name of the OIDC provider (e.g., 'cern', 'indigo')
 * @returns Issuer URL or empty string if not found
 */
export function getIssuerFromEnv(providerName: string): string {
    try {
        // Try to get authorization URL and extract the issuer from it
        const authUrlKey = `OIDC_PROVIDER_${providerName.toUpperCase()}_AUTHORIZATION_URL`;
        const authUrl = process.env[authUrlKey];

        if (authUrl) {
            // Extract base URL from authorization endpoint
            // For example: https://auth.cern.ch/auth/realms/cern/protocol/openid-connect/auth
            // Should return: https://auth.cern.ch/auth/realms/cern
            const url = new URL(authUrl);
            const pathParts = url.pathname.split('/');

            // Remove '/protocol/openid-connect/auth' or similar suffixes
            const protocolIndex = pathParts.indexOf('protocol');
            if (protocolIndex > 0) {
                const issuerPath = pathParts.slice(0, protocolIndex).join('/');
                return `${url.protocol}//${url.host}${issuerPath}`;
            }

            // Fallback: just return the origin
            return url.origin;
        }

        console.warn(`[OIDC] Could not determine issuer for provider: ${providerName}`);
        return '';
    } catch (error) {
        console.error(`[OIDC] Error getting issuer for provider ${providerName}:`, error);
        return '';
    }
}
