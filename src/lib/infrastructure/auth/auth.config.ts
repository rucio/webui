import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SessionUser } from '@/types/next-auth';
import { authorizeUserPass, MultipleAccountsError } from './nextauth-userpass-adapter';
import { authorizeX509 } from './nextauth-x509-adapter';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import { getIssuerFromEnv } from './oidc-providers';

/**
 * Helper function to find user index in allUsers array
 */
function getSessionUserIndex(allUsers: SessionUser[] | undefined, user: SessionUser): number {
    if (!allUsers) return -1;
    return allUsers.findIndex(
        u =>
            u.rucioIdentity === user.rucioIdentity &&
            u.rucioAccount === user.rucioAccount &&
            u.rucioAuthType === user.rucioAuthType,
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
                if (!credentials?.username || !credentials?.password || !credentials?.vo) {
                    return null;
                }

                try {
                    return await authorizeUserPass(
                        credentials.username as string,
                        credentials.password as string,
                        (credentials.account as string) || '',
                        credentials.vo as string,
                    );
                } catch (error) {
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

                // Create Rucio identity string (format: "SUB=xxx, ISS=xxx")
                // This matches the format expected in Rucio's identity_account_association table
                // The sub and iss claims come from the OIDC profile, not the mapped user object
                const sub = profile?.sub || user?.id;
                const iss = profile?.iss || getIssuerFromEnv(providerName);
                const rucioIdentity = `SUB=${sub}, ISS=${iss}`;

                console.log(`[OIDC] Created Rucio identity: ${rucioIdentity}`);

                // Get Rucio account from profile
                // Note: The actual account may need to be queried from Rucio's whoami endpoint
                // or retrieved from the identity mapping in Rucio database
                // The user object here is the result of the profile() function we defined in oidc-providers.ts
                const rucioAccount = (profile?.preferred_username || user?.name || 'unknown') as string;

                console.log(`[OIDC] Rucio account: ${rucioAccount}`);

                // TODO: Optionally query Rucio to validate token and get account
                // This would make an API call to Rucio's /accounts/whoami endpoint
                // const rucioAccount = await getRucioAccountFromToken(rucioAuthToken);

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
            if (user && !account?.type) {
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
            if (token.user) {
                session.user = token.user;
            }
            session.allUsers = token.allUsers || [];
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
