import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SessionUser } from '@/types/next-auth';
import { authorizeUserPass } from './nextauth-userpass-adapter';
import { MultipleAccountsError } from '@/lib/core/entity/auth-errors';
import { authorizeX509 } from './nextauth-x509-adapter';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import { getIssuerFromEnv } from './oidc-providers';
import {
    getRucioAccountsForIdentity,
    selectAccountFromMultiple,
    IdentityNotMappedError,
    InvalidTokenError,
    RucioAPIError,
} from './rucio-oidc-helper';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';

/**
 * Helper function to find user index in allUsers array
 */
function getSessionUserIndex(allUsers: SessionUser[] | undefined, user: SessionUser): number {
    if (!allUsers) return -1;
    return allUsers.findIndex(
        u => u.rucioIdentity === user.rucioIdentity && u.rucioAccount === user.rucioAccount && u.rucioAuthType === user.rucioAuthType,
    );
}

/**
 * NextAuth configuration for Rucio WebUI
 * Supports UserPass and x509 authentication with multi-account sessions
 */
export const authConfig: NextAuthConfig = {
    providers: [
        // UserPass authentication provider
        Credentials({
            id: 'userpass',
            name: 'Rucio UserPass',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                account: { label: 'Account', type: 'text', optional: true },
                vo: { label: 'VO', type: 'text' },
            },
            async authorize(credentials): Promise<User | null> {
                console.log('[LOGIN FLOW 5] NextAuth authorize called', {
                    username: credentials?.username,
                    vo: credentials?.vo,
                    account: credentials?.account || '(none)',
                    hasPassword: !!credentials?.password,
                });

                if (!credentials?.username || !credentials?.password || !credentials?.vo) {
                    return null;
                }

                try {
                    console.log('[LOGIN FLOW 6] Calling authorizeUserPass adapter');
                    return await authorizeUserPass(
                        credentials.username as string,
                        credentials.password as string,
                        (credentials.account as string) || '',
                        credentials.vo as string,
                    );
                } catch (error) {
                    console.log('[LOGIN FLOW 7] authorizeUserPass threw error', {
                        errorName: error instanceof Error ? error.name : 'Unknown',
                        isMultipleAccounts: error instanceof MultipleAccountsError,
                        message: error instanceof Error ? error.message : String(error),
                    });
                    // If it's a MultipleAccountsError, we need to handle it specially
                    if (error instanceof MultipleAccountsError) {
                        // NextAuth doesn't have a built-in way to return custom errors
                        // So we throw the error to be caught by the frontend
                        throw error;
                    }
                    return null;
                }
            },
        }),

        // x509 authentication provider
        Credentials({
            id: 'x509',
            name: 'Rucio x509',
            credentials: {
                rucioAuthToken: { type: 'text' },
                rucioAccount: { type: 'text' },
                shortVOName: { type: 'text' },
                rucioTokenExpiry: { type: 'text' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.rucioAuthToken || !credentials?.rucioAccount || !credentials?.shortVOName || !credentials?.rucioTokenExpiry) {
                    return null;
                }

                return await authorizeX509(
                    credentials.rucioAuthToken as string,
                    credentials.rucioAccount as string,
                    credentials.shortVOName as string,
                    credentials.rucioTokenExpiry as string,
                );
            },
        }),
    ],

    pages: {
        signIn: '/auth/login',
    },

    callbacks: {
        /**
         * JWT callback: Manages the JWT token with multi-account support
         * This is called whenever a JWT is created or updated
         */
        async jwt({ token, user, account, profile, trigger, session }) {
            console.log('[LOGIN FLOW 17] JWT callback triggered', {
                hasUser: !!user,
                accountType: account?.type,
                trigger,
                currentUserAccount: token.user?.rucioAccount,
            });

            // ==========================================
            // Handle OIDC Authentication (Dynamic Providers)
            // ==========================================
            if (account?.type === 'oauth' && account.access_token) {
                const providerName = account.provider;

                console.log(`[OIDC] Processing OAuth sign-in for provider: ${providerName}`);

                // The OIDC access_token IS the rucioAuthToken
                // No conversion needed - Rucio will validate it directly
                const rucioAuthToken = account.access_token;
                const rucioAuthTokenExpires = new Date(account.expires_at! * 1000).toISOString();

                // Decode and log JWT token claims (for debugging)
                try {
                    const tokenParts = rucioAuthToken.split('.');
                    if (tokenParts.length === 3) {
                        // Decode the payload (second part of JWT)
                        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                        console.log('[OIDC] JWT Token Claims:', JSON.stringify(payload, null, 2));
                        console.log(`[OIDC] Audience (aud) claim: ${JSON.stringify(payload.aud)}`);
                        console.log(`[OIDC] Issuer (iss) claim: ${payload.iss}`);
                        console.log(`[OIDC] Subject (sub) claim: ${payload.sub}`);
                    }
                } catch (e) {
                    console.error('[OIDC] Failed to decode JWT token:', e);
                }

                // Log the full token for manual testing (on separate line for easy extraction)
                console.log('=== OIDC TOKEN FOR MANUAL TESTING ===');
                const tokenPreview = `${rucioAuthToken.substring(0, 50)}...${rucioAuthToken.substring(rucioAuthToken.length - 20)}`;
                console.log(`[OIDC] Access Token (truncated): ${tokenPreview}`);
                console.log(`[OIDC] Full token length: ${rucioAuthToken.length} characters`);
                console.log(`[OIDC] Extract full token from the line below (search for [OIDC_TOKEN]):`);
                console.log(`[OIDC_TOKEN] ${rucioAuthToken}`);
                console.log('=====================================');

                // Create Rucio identity string (format: "SUB=xxx, ISS=xxx")
                // This matches the format expected in Rucio's identity_account_association table
                // The sub and iss claims come from the OIDC profile, not the mapped user object
                const sub = profile?.sub || user?.id;
                const iss = profile?.iss || getIssuerFromEnv(providerName);
                const rucioIdentity = `SUB=${sub}, ISS=${iss}`;

                console.log(`[OIDC] Created Rucio identity: ${rucioIdentity}`);

                // Query Rucio to get the actual account mapped to this OIDC identity
                // This uses Rucio's identity API: GET /identities/{identity}/OIDC/accounts
                let rucioAccount: string;
                let accountLookupError: string | undefined;

                try {
                    // Get Rucio host from environment config
                    const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
                    const rucioHost = await envConfigGateway.rucioHost();

                    console.log(`[OIDC] Looking up Rucio account for identity via API...`);

                    // Call Rucio identity API (with caching)
                    const accounts = await getRucioAccountsForIdentity(rucioIdentity, rucioHost, rucioAuthToken);

                    // Handle multiple accounts (use first one for now)
                    rucioAccount = selectAccountFromMultiple(accounts);
                    console.log(`[OIDC] Successfully mapped to Rucio account: ${rucioAccount}`);
                } catch (error) {
                    if (error instanceof IdentityNotMappedError) {
                        // Identity is not registered in Rucio
                        console.error(`[OIDC] Identity not mapped: ${rucioIdentity}`);
                        accountLookupError = `Your OIDC identity from ${providerName} is not registered in Rucio. Please contact your administrator to map identity: ${rucioIdentity}`;
                        rucioAccount = 'unknown'; // Placeholder - session will be invalid
                    } else if (error instanceof InvalidTokenError) {
                        // Token is invalid
                        console.error(`[OIDC] Invalid token:`, error);
                        accountLookupError = `Invalid OIDC token from ${providerName}. Please try logging in again.`;
                        rucioAccount = 'unknown';
                    } else if (error instanceof RucioAPIError) {
                        // Rucio API error
                        console.error(`[OIDC] Rucio API error:`, error);
                        accountLookupError = `Could not verify your identity with Rucio. Please try again later.`;
                        rucioAccount = 'unknown';
                    } else {
                        // Unknown error - fallback to preferred_username with warning
                        console.error(`[OIDC] Unexpected error during account lookup:`, error);
                        rucioAccount = (profile?.preferred_username || user?.name || 'unknown') as string;
                        console.warn(`[OIDC] Falling back to preferred_username: ${rucioAccount}`);
                        accountLookupError = `Warning: Could not verify account mapping. Using username from OIDC provider.`;
                    }
                }

                // If there was an error looking up the account, store it in the token
                // This will be passed to the session callback and shown to the user
                if (accountLookupError) {
                    console.error(`[OIDC] Storing error in token: ${accountLookupError}`);
                    token.oidcError = accountLookupError;
                    token.oidcIdentity = rucioIdentity; // Store identity for error message
                    token.oidcProvider = providerName;
                    // Do not create a valid session
                    console.log(`[OIDC] OIDC authentication failed for ${providerName}: ${accountLookupError}`);
                    return token;
                }

                const oidcUser: SessionUser = {
                    id: `${rucioAccount}@${providerName}`,
                    email: user?.email || profile?.email || '',
                    emailVerified: null,
                    rucioIdentity: rucioIdentity,
                    rucioAccount: rucioAccount,
                    rucioAuthType: AuthType.OIDC,
                    rucioAuthToken: rucioAuthToken, // ✅ OIDC token IS the Rucio token
                    rucioAuthTokenExpires: rucioAuthTokenExpires,
                    rucioOIDCProvider: providerName,
                    rucioVO: 'atl', // TODO: Get from callback URL state parameter or default VO
                    role: Role.USER, // TODO: Query Rucio for user role from account attributes
                    isLoggedIn: true,
                };

                // Initialize allUsers array if needed
                if (!token.allUsers) {
                    token.allUsers = [];
                }

                // Check if user already exists in allUsers
                const existingIndex = getSessionUserIndex(token.allUsers, oidcUser);

                if (existingIndex === -1) {
                    // New user: add to allUsers
                    console.log(`[OIDC] Adding new OIDC user to session: ${oidcUser.rucioAccount}`);
                    token.allUsers.push(oidcUser);
                } else {
                    // Existing user: update their info
                    console.log(`[OIDC] Updating existing OIDC user in session: ${oidcUser.rucioAccount}`);
                    token.allUsers[existingIndex] = oidcUser;
                }

                // Set as active user
                token.user = oidcUser;

                console.log(`[OIDC] OIDC authentication complete for ${providerName}`);
            }

            // ==========================================
            // Handle UserPass/x509 Authentication (Existing)
            // ==========================================
            // On sign in: add or update the user in allUsers array
            // Note: Credentials provider sets account.type to 'credentials'
            if (user && (!account?.type || account?.type === 'credentials')) {
                console.log('[LOGIN FLOW 18] Adding/updating user in JWT token', {
                    rucioAccount: (user as SessionUser).rucioAccount,
                    rucioAuthType: (user as SessionUser).rucioAuthType,
                    isLoggedIn: (user as SessionUser).isLoggedIn,
                    existingUsersCount: token.allUsers?.length || 0,
                });

                // Initialize allUsers if it doesn't exist
                if (!token.allUsers) {
                    token.allUsers = [];
                }

                // Check if user already exists in allUsers
                const existingIndex = getSessionUserIndex(token.allUsers, user as SessionUser);

                if (existingIndex === -1) {
                    // New user: add to allUsers
                    token.allUsers.push(user as SessionUser);
                } else {
                    // Existing user: update their info
                    token.allUsers[existingIndex] = user as SessionUser;
                }

                // Set this user as the active user
                token.user = user as SessionUser;
            }

            // Handle account switching
            // When the frontend calls update({ account: 'someAccount' })
            if (trigger === 'update' && session?.account) {
                const switchUser = token.allUsers?.find(u => u.rucioAccount === session.account);
                if (switchUser) {
                    token.user = switchUser;
                }
            }

            // Handle user removal
            // When the frontend calls update({ removeAccount: 'someAccount' })
            if (trigger === 'update' && session?.removeAccount) {
                const removeIndex = token.allUsers?.findIndex(u => u.rucioAccount === session.removeAccount);
                if (removeIndex !== undefined && removeIndex !== -1 && token.allUsers) {
                    token.allUsers.splice(removeIndex, 1);

                    // If we removed the active user, switch to the first available user
                    if (token.user?.rucioAccount === session.removeAccount) {
                        token.user = token.allUsers.length > 0 ? token.allUsers[0] : undefined;
                    }
                }
            }

            return token;
        },

        /**
         * Session callback: Populates the session object from the JWT token
         * This is called whenever getSession() or useSession() is used
         */
        async session({ session, token }) {
            console.log('[LOGIN FLOW 19] Session callback triggered', {
                hasTokenUser: !!token.user,
                allUsersCount: token.allUsers?.length || 0,
                activeAccount: token.user?.rucioAccount,
            });

            if (token.user) {
                session.user = token.user;
            }
            session.allUsers = token.allUsers || [];

            // Pass OIDC errors to the session so the frontend can display them
            if (token.oidcError) {
                session.oidcError = token.oidcError as string;
                session.oidcIdentity = token.oidcIdentity as string;
                session.oidcProvider = token.oidcProvider as string;
            }

            return session;
        },

        /**
         * Authorized callback: Checks if the user is authorized to access a page
         * This is used by middleware to protect routes
         */
        authorized({ auth, request }) {
            const { pathname } = request.nextUrl;

            // Allow auth pages
            if (pathname.startsWith('/auth')) {
                return true;
            }

            // Check if user is authenticated
            if (!auth?.user) {
                return false;
            }

            // Check if user is logged in and has a valid token
            if (!auth.user.isLoggedIn || !auth.user.rucioAuthToken) {
                return false;
            }

            // Check if token is expired
            const expirationTime = new Date(auth.user.rucioAuthTokenExpires).getTime();
            const currentTime = new Date().getTime();
            if (currentTime >= expirationTime) {
                return false;
            }

            return true;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === 'development',
};

// export TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJWYUQzRDBQUm5QVzB5MXpBLTBieVIxZkhsSFVqalNFZzAxNngyY3JjaHljIn0.eyJleHAiOjE3NjE4MzQxNDksImlhdCI6MTc2MTgzMjk0OSwianRpIjoiYjM0ZGI3NjctYTg0ZS00YWVhLWE0MzQtZjQ2ODNjYTc2ZDQ5IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmNlcm4uY2gvYXV0aC9yZWFsbXMvY2VybiIsImF1ZCI6ImF0bGFzLXJ1Y2lvLXdlYnVpIiwic3ViIjoibWF5YW5rIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXRsYXMtcnVjaW8td2VidWkiLCJzaWQiOiIwMWNkNTc4OS1jNzUzLTRiYWYtYjFkMy04ZTE2MGI5MjllMjIiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9hdGxhcy1ydWNpby13ZWJ1aS5jZXJuLmNoIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiMmZhLW1pZ3JhdGVkIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYXRsYXMtcnVjaW8td2VidWkiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImNlcm5fcGVyc29uX2lkIjoiODAxNjU5IiwibmFtZSI6Ik1heWFuayBTaGFybWEiLCJjZXJuX21haWxfdXBuIjoibWF5YW5rQGNlcm4uY2giLCJjZXJuX2lkZW50aXR5X2lkIjoiMWEwZTI0YjItNWFhYy00ZDJkLTg2MWUtMjBkOGY4NDY1ZmZlIiwicHJlZmVycmVkX3VzZXJuYW5rIjoibWF5YW5rIiwiZ2l2ZW5fbmFtZSI6Ik1heWFuayIsImNlcm5fcm9sZXMiOlsiZGVmYXVsdC1yb2xlIl0sImNlcm5fcHJlZmVycmVkX2xhbmd1YWdlIjoiRU4iLCJmYW1pbHlfbmFtZSI6IlNoYXJtYSIsImVtYWlsIjoibWF5YW5rLnNoYXJtYUBjZXJuLmNoIiwiY2Vybl91cG4iOiJtYXlhbmsifQ.Xkoi10W-UfUJI-0jgrCbuYYBaW34w6PdX7ETMqvK8fHOMLxA8QnU2yxbTKvBa1OnzwclQBLwiYpoHQzF_vkzcgTs8cQwaz15-LOnwRJ-NywP_MBchwQu2zNfaAVDYbj8xb_s_smVHukzNTApIwPypQwIerezWH72vs6dpRRmicgZYqcUd_-EXAoL2zuX3c9oym7ueksdIquiOJEaUfeDr4FI1Nv-uL9dosZy-SGTNo8In65X-W3zqwL-k9VBPKCvgk4yPn6SlLKbojgItm65Q6RYqQT3gjy4pLCL8W2oGIPKWp3YY8l8g1lURI5TQ393j6vU14SImcfeilR65DHdCg"

// export IDENTITY_ENCODED="SUB%3Dmayank%2C%20ISS%3Dhttps%3A%2F%2Fauth.cern.ch%2Fauth%2Frealms%2Fcern"

// curl -v \
//     -H "X-Rucio-Auth-Token: $TOKEN" \
//     -H "Content-Type: application/json" \
//     "https://mayank-ops.cern.ch/identities/${IDENTITY_ENCODED}/OIDC/accounts"
