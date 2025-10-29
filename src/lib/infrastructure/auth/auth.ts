import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { loadOIDCProviders } from './oidc-providers';

/**
 * Load OIDC providers and create the complete NextAuth configuration
 *
 * This function dynamically loads OIDC provider configurations from environment variables
 * and adds them to the static authConfig (which already includes userpass and x509 providers).
 *
 * This enables flexible, zero-code addition of new OIDC providers via environment variables.
 */
async function getAuthConfigWithOIDCProviders() {
    console.log('[Auth] Loading dynamic OIDC providers...');

    // Load OIDC providers from environment
    const oidcProviders = await loadOIDCProviders();

    console.log(`[Auth] Loaded ${oidcProviders.length} OIDC provider(s)`);

    // Combine static providers (userpass, x509) with dynamic OIDC providers
    return {
        ...authConfig,
        providers: [
            ...authConfig.providers, // userpass and x509
            ...oidcProviders,        // dynamic OIDC providers (cern, indigo, etc.)
        ],
    };
}

/**
 * Export the NextAuth handlers and utilities
 * This file re-exports the auth functions for easy importing throughout the app
 *
 * Note: NextAuth v5 supports passing an async function to load config dynamically.
 * This allows us to load OIDC providers from environment at runtime.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(async (req) => {
    const config = await getAuthConfigWithOIDCProviders();
    return config;
});
