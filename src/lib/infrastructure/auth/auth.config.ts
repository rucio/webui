import type { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import { SessionUser } from '@/types/next-auth';
import { authorizeUserPassToken } from './nextauth-userpass-token-adapter';
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
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { resolveAccountRole } from '@/lib/core/services/resolve-account-role';

/** Session max-age in seconds (24 hours). */
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

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
 * Reads the existing NextAuth session cookie and returns its decoded `allUsers` array.
 *
 * NextAuth v5 builds a fresh default token on every signIn (see
 * node_modules/@auth/core/lib/actions/callback/index.js where `defaultToken` is
 * constructed from `{ name, email, picture, sub }` and passed to the jwt callback).
 * The previous session's fields; including `allUsers`; are discarded unless we
 * re-read them ourselves. Without this, "sign in to another account" replaces the
 * current session instead of extending it.
 *
 * The cookie is chunked for large payloads using the suffix convention
 * `{name}`, `{name}.0`, `{name}.1`, … . The chunks are concatenated in numeric order.
 */
async function loadPreviousAllUsers(): Promise<SessionUser[] | undefined> {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return undefined;

    try {
        const cookieStore = await cookies();
        const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
        const cookieName = useSecureCookies ? '__Secure-authjs.session-token' : 'authjs.session-token';

        // Collect all chunks of the session cookie, sorted by numeric suffix.
        const chunks = cookieStore
            .getAll()
            .filter(c => c.name === cookieName || c.name.startsWith(`${cookieName}.`))
            .sort((a, b) => {
                const aSuffix = parseInt(a.name.split('.').pop() || '0');
                const bSuffix = parseInt(b.name.split('.').pop() || '0');
                return aSuffix - bSuffix;
            })
            .map(c => c.value);

        if (chunks.length === 0) return undefined;

        const rawCookie = chunks.join('');
        const decoded = await decode({ token: rawCookie, secret, salt: cookieName });
        if (decoded?.allUsers && Array.isArray(decoded.allUsers)) {
            return decoded.allUsers as SessionUser[];
        }
    } catch (error) {
        console.warn('[Auth] Failed to merge previous allUsers; existing session will be replaced:', error);
    }
    return undefined;
}

/**
 * Validates the audience claim in a JWT token payload
 * Logs a warning if validation fails but does NOT reject authentication
 *
 * @param payload - Decoded JWT token payload
 * @param expectedAudience - Expected audience value from configuration
 * @param providerName - Name of the OIDC provider (for logging)
 * @returns true if validation passes, false otherwise
 */
function validateAudienceClaim(payload: Record<string, unknown>, expectedAudience: string, providerName: string): boolean {
    const audience = payload.aud;

    if (!audience) {
        console.warn(`[OIDC] WARNING: No audience (aud) claim found in JWT token from ${providerName}. ` + `Expected audience: ${expectedAudience}`);
        return false;
    }

    // Handle both string and array audience claims
    // Some OIDC providers return a single string, others return an array
    let audienceMatches = false;
    if (Array.isArray(audience)) {
        audienceMatches = audience.includes(expectedAudience);
        if (!audienceMatches) {
            console.warn(
                `[OIDC] WARNING: Audience claim mismatch for ${providerName}. ` + `Expected: "${expectedAudience}", Found: [${audience.join(', ')}]`,
            );
        }
    } else {
        audienceMatches = audience === expectedAudience;
        if (!audienceMatches) {
            console.warn(`[OIDC] WARNING: Audience claim mismatch for ${providerName}. ` + `Expected: "${expectedAudience}", Found: "${audience}"`);
        }
    }

    if (audienceMatches) {
        console.log(`[OIDC] Audience validation passed for ${providerName}: ${expectedAudience}`);
    }

    return audienceMatches;
}

/**
 * NextAuth configuration for Rucio WebUI
 * Supports UserPass and x509 authentication with multi-account sessions
 */
export const authConfig: NextAuthConfig = {
    providers: [
        // UserPass authentication provider; pre-validated-token only.
        // The client probes Rucio's /auth/userpass via /api/auth/userpass/probe (the
        // browser cannot hit Rucio directly; CORS), then hands the resulting token
        // + chosen account back through signIn() to establish the session.
        Credentials({
            id: 'userpass',
            name: 'Rucio UserPass',
            credentials: {
                rucioAuthToken: { type: 'text' },
                rucioAccount: { type: 'text' },
                shortVOName: { type: 'text' },
                rucioTokenExpiry: { type: 'text' },
                // JSON-encoded `string[]` of every account mapped to the same identity
                // (lazy-mint design; no tokens, just names; see #628).
                linkedAccountNames: { type: 'text' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.rucioAuthToken || !credentials?.rucioAccount || !credentials?.shortVOName || !credentials?.rucioTokenExpiry) {
                    return null;
                }
                return await authorizeUserPassToken(
                    credentials.rucioAuthToken as string,
                    credentials.rucioAccount as string,
                    credentials.shortVOName as string,
                    credentials.rucioTokenExpiry as string,
                    (credentials.linkedAccountNames as string | undefined) ?? undefined,
                );
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
            // On a fresh signIn NextAuth discards the previous session JWT; seed
            // token.allUsers from the existing cookie so we accumulate across
            // sequential logins instead of overwriting them.
            if ((trigger === 'signIn' || trigger === 'signUp') && !token.allUsers) {
                const previousAllUsers = await loadPreviousAllUsers();
                if (previousAllUsers && previousAllUsers.length > 0) {
                    token.allUsers = previousAllUsers;
                }
            }

            // ==========================================
            // Handle OIDC Authentication (Dynamic Providers)
            // ==========================================
            if (account?.type === 'oauth' && account.access_token) {
                const providerName = account.provider;

                console.log(`[OIDC] Processing OAuth sign-in for provider: ${providerName}`);

                // The OIDC access_token IS the rucioAuthToken
                // No conversion needed - Rucio will validate it directly
                const rucioAuthToken = account.access_token;
                // Dev-only override: shorten the session expiry the client sees so the
                // SessionMonitor refresh flow can be exercised without waiting the full
                // provider-issued lifetime. The OIDC access token itself remains valid
                // for its real lifetime; only the client-tracked expiry is shortened.
                const devShortExpiry = process.env.DEV_SHORT_SESSION_SECONDS;
                const rucioAuthTokenExpires = devShortExpiry
                    ? new Date(Date.now() + Number(devShortExpiry) * 1000).toISOString()
                    : new Date(account.expires_at! * 1000).toISOString();

                // Decode and validate JWT token claims
                try {
                    const tokenParts = rucioAuthToken.split('.');
                    if (tokenParts.length === 3) {
                        // Decode the payload (second part of JWT)
                        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                        // Validate audience claim
                        const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
                        const expectedAudience = await envConfigGateway.oidcExpectedAudience();

                        const validationPassed = validateAudienceClaim(payload, expectedAudience, providerName);

                        // Note: We log warnings but don't reject authentication
                        // This allows for gradual rollout and doesn't break existing deployments
                        if (!validationPassed) {
                            console.warn(
                                `[OIDC] Continuing with authentication despite audience validation failure. ` +
                                    `Review your OIDC_EXPECTED_AUDIENCE_CLAIM configuration.`,
                            );
                        }
                    }
                } catch (e) {
                    console.error('[OIDC] Failed to decode or validate JWT token:', e);
                }

                // Create Rucio identity string (format: "SUB=xxx, ISS=xxx")
                // This matches the format expected in Rucio's identity_account_association table
                // The sub and iss claims come from the OIDC profile, not the mapped user object
                const sub = profile?.sub || user?.id;
                const iss = profile?.iss || (await getIssuerFromEnv(providerName));
                const rucioIdentity = `SUB=${sub}, ISS=${iss}`;

                console.log(`[OIDC] Created Rucio identity: ${rucioIdentity}`);

                // Query Rucio to get the actual account mapped to this OIDC identity
                // This uses Rucio's identity API: GET /identities/{identity}/OIDC/accounts
                let rucioAccount: string;
                let accountLookupError: string | undefined;
                let candidateAccounts: string[] = [];

                try {
                    // Get Rucio host from environment config
                    const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
                    const rucioHost = await envConfigGateway.rucioHost();

                    console.log(`[OIDC] Looking up Rucio account for identity via API...`);

                    // Call Rucio identity API (with caching)
                    candidateAccounts = await getRucioAccountsForIdentity(rucioIdentity, rucioHost, rucioAuthToken);

                    // #628: filter out accounts already signed in under THIS identity
                    // before deciding whether to defer to a modal. Matters when a
                    // user re-runs OIDC sign-in (e.g. via "Sign in to another
                    // account") while already authenticated as some/all of the
                    // candidates; the modal would otherwise show "all already
                    // signed in" and middleware would loop back to /auth/login
                    // because token.user is left undefined.
                    const alreadySignedIn = new Set(
                        (token.allUsers ?? [])
                            .filter(u => u.rucioAuthType === AuthType.OIDC && u.rucioIdentity === rucioIdentity)
                            .map(u => u.rucioAccount),
                    );
                    const fresh = candidateAccounts.filter(a => !alreadySignedIn.has(a));

                    if (fresh.length === 0 && alreadySignedIn.size > 0) {
                        // The user is already signed in to every account this
                        // identity maps to; re-auth is a no-op. Pick the
                        // first existing entry as the active user and skip the
                        // pending-selection modal entirely.
                        const existing = (token.allUsers ?? []).find(
                            u => u.rucioAuthType === AuthType.OIDC && u.rucioIdentity === rucioIdentity,
                        );
                        if (existing) {
                            token.user = { ...existing, identityAccounts: candidateAccounts };
                            // Refresh token + sessionStartedAt for the new sign-in event so the
                            // 24-hour ceiling resets and refresh-token rotation still works.
                            if (account.refresh_token) {
                                token.rucioOidcRefreshToken = account.refresh_token;
                            }
                            token.sessionStartedAt = Math.floor(Date.now() / 1000);
                            console.log(`[OIDC] Identity already fully authenticated; preserving active=${existing.rucioAccount}`);
                            return token;
                        }
                    }

                    if (fresh.length > 1) {
                        // Multiple new accounts: defer to the modal. The page reads
                        // session.pendingAccountSelection and finalises via
                        // update({ chosenPendingAccount }).
                        console.log(`[OIDC] Multiple new accounts (${fresh.length}); deferring to user selection.`);
                        token.pendingAccountSelection = {
                            authType: 'oidc',
                            providerName,
                            rucioIdentity,
                            accounts: fresh,
                            rucioAuthToken,
                            rucioAuthTokenExpires,
                            rucioVO: 'atl', // TODO: pull from callback URL state when VO selection is wired
                            rucioOidcRefreshToken: account.refresh_token ?? undefined,
                        };
                        // Don't set token.user; middleware will redirect to /auth/login,
                        // where the page picks up pendingAccountSelection from the session.
                        return token;
                    }

                    rucioAccount = fresh.length === 1 ? fresh[0] : selectAccountFromMultiple(candidateAccounts);
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

                // Resolve role from Rucio account attributes
                let oidcRole: Role = Role.USER;
                let oidcCountry: string | undefined;
                let oidcCountryRole: Role | undefined;
                try {
                    const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
                    const accountAttrs = await accountGateway.listAccountAttributes(rucioAccount, rucioAuthToken);
                    const resolved = resolveAccountRole(accountAttrs.attributes);
                    oidcRole = resolved.role ?? Role.USER;
                    oidcCountry = resolved.country;
                    oidcCountryRole = resolved.countryRole;
                } catch (error) {
                    console.error(`[OIDC] Failed to fetch account attributes for role resolution:`, error);
                }

                const oidcUser: SessionUser = {
                    id: `${rucioAccount}@${providerName}`,
                    email: user?.email || profile?.email || '',
                    emailVerified: null,
                    rucioIdentity: rucioIdentity,
                    rucioAccount: rucioAccount,
                    rucioAuthType: AuthType.OIDC,
                    rucioAuthToken: rucioAuthToken, // OIDC token IS the Rucio token
                    rucioAuthTokenExpires: rucioAuthTokenExpires,
                    rucioOIDCProvider: providerName,
                    rucioVO: 'atl', // TODO: Get from callback URL state parameter or default VO
                    role: oidcRole,
                    country: oidcCountry,
                    countryRole: oidcCountryRole,
                    isLoggedIn: true,
                    // #628: every account this OIDC identity is mapped to. The dropdown
                    // surfaces these as switch targets; OIDC tokens are identity-scoped
                    // (not per-account) so switching is a server-side repoint via
                    // update({ switchOidcAccount }); see the dedicated branch below.
                    identityAccounts: candidateAccounts,
                };

                // Store OIDC refresh token in the JWT so it can be used for session refresh
                if (account.refresh_token) {
                    token.rucioOidcRefreshToken = account.refresh_token;
                }

                // Record the original sign-in time so we can enforce a hard 24-hour
                // session ceiling even when OIDC tokens keep getting refreshed.
                token.sessionStartedAt = Math.floor(Date.now() / 1000);

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
                // Initialize allUsers if it doesn't exist
                if (!token.allUsers) {
                    token.allUsers = [];
                }

                // Dev-only: shorten the session expiry so the expiry/redirect flow
                // can be exercised without waiting for the real Rucio token lifetime.
                const devShortSeconds = process.env.DEV_SHORT_SESSION_SECONDS;
                let sessionUser = user as SessionUser;
                if (devShortSeconds) {
                    sessionUser = {
                        ...sessionUser,
                        rucioAuthTokenExpires: new Date(Date.now() + Number(devShortSeconds) * 1000).toISOString(),
                    };
                }

                // Add or update this account in allUsers[]
                const existingIndex = getSessionUserIndex(token.allUsers, sessionUser);
                if (existingIndex === -1) {
                    token.allUsers.push(sessionUser);
                } else {
                    token.allUsers[existingIndex] = sessionUser;
                }

                // Propagate identityAccounts across every allUsers[] entry that shares
                // this user's Rucio identity. When the user later re-auths into one of
                // the linked accounts (#628), the new SessionUser carries the same list
                //; keeping the dropdown's "switchable but unauthenticated" set in sync
                // for any user we render as active.
                if (sessionUser.identityAccounts && sessionUser.identityAccounts.length > 0) {
                    for (const peer of token.allUsers) {
                        if (peer.rucioIdentity === sessionUser.rucioIdentity && peer.rucioAuthType === sessionUser.rucioAuthType) {
                            peer.identityAccounts = sessionUser.identityAccounts;
                        }
                    }
                }

                // Set this user as the active user
                token.user = sessionUser;
            }

            // Handle account switching
            // When the frontend calls update({ account: 'someAccount' })
            if (trigger === 'update' && session?.account) {
                const switchUser = token.allUsers?.find(u => u.rucioAccount === session.account);
                if (switchUser) {
                    token.user = switchUser;
                }
            }

            // Handle OIDC pending-selection finalize
            // When the frontend calls update({ chosenPendingAccount: 'someAccount' }) after the
            // user picked from the multi-account modal. Build the final SessionUser from the
            // stashed Rucio token + chosen account, push to allUsers, and clear the pending state.
            if (trigger === 'update' && session?.chosenPendingAccount && token.pendingAccountSelection) {
                const pending = token.pendingAccountSelection;
                const chosen: string = session.chosenPendingAccount;

                if (!pending.accounts.includes(chosen)) {
                    console.error(`[OIDC] Rejected finalize: account "${chosen}" not in pending list ${pending.accounts.join(',')}`);
                } else {
                    let role: Role = Role.USER;
                    let country: string | undefined;
                    let countryRole: Role | undefined;
                    try {
                        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
                        const accountAttrs = await accountGateway.listAccountAttributes(chosen, pending.rucioAuthToken);
                        const resolved = resolveAccountRole(accountAttrs.attributes);
                        role = resolved.role ?? Role.USER;
                        country = resolved.country;
                        countryRole = resolved.countryRole;
                    } catch (error) {
                        console.error('[OIDC] Failed to fetch account attributes during finalize:', error);
                    }

                    const finalisedUser: SessionUser = {
                        id: `${chosen}@${pending.providerName}`,
                        email: '',
                        emailVerified: null,
                        rucioIdentity: pending.rucioIdentity,
                        rucioAccount: chosen,
                        rucioAuthType: AuthType.OIDC,
                        rucioAuthToken: pending.rucioAuthToken,
                        rucioAuthTokenExpires: pending.rucioAuthTokenExpires,
                        rucioOIDCProvider: pending.providerName,
                        rucioVO: pending.rucioVO,
                        role,
                        country,
                        countryRole,
                        isLoggedIn: true,
                        // #628: full identity-mapped account list captured during the
                        // pending-selection probe. Drives the dropdown's switch options
                        // (see the switchOidcAccount branch below).
                        identityAccounts: pending.accounts,
                    };

                    if (!token.allUsers) token.allUsers = [];
                    const existingIndex = getSessionUserIndex(token.allUsers, finalisedUser);
                    if (existingIndex === -1) {
                        token.allUsers.push(finalisedUser);
                    } else {
                        token.allUsers[existingIndex] = finalisedUser;
                    }
                    token.user = finalisedUser;
                    if (pending.rucioOidcRefreshToken) {
                        token.rucioOidcRefreshToken = pending.rucioOidcRefreshToken;
                    }
                    token.sessionStartedAt = Math.floor(Date.now() / 1000);
                    delete token.pendingAccountSelection;
                    console.log(`[OIDC] Finalised pending selection: account=${chosen}`);
                }
            }

            // Handle pending-selection abort: clear without finalising (user closed the modal).
            if (trigger === 'update' && session?.cancelPendingAccountSelection && token.pendingAccountSelection) {
                console.log('[OIDC] User cancelled pending account selection');
                delete token.pendingAccountSelection;
            }

            // #628: silent OIDC account switch.
            //
            // Invoked via update({ switchOidcAccount: 'someAccount' }) from the
            // AccountDropdown when the user picks an identity-mapped account that
            // isn't already in allUsers[]. Unlike userpass and x509 the OIDC token
            // is identity-scoped (Rucio validates the identity, not per-account),
            // so we can reuse the existing access token and just build a new
            // SessionUser for the chosen account; no provider round-trip needed.
            if (
                trigger === 'update' &&
                session?.switchOidcAccount &&
                token.user &&
                token.user.rucioAuthType === AuthType.OIDC &&
                token.user.rucioAuthToken
            ) {
                const target: string = session.switchOidcAccount;
                const allowed = token.user.identityAccounts ?? [];
                if (!allowed.includes(target)) {
                    console.error(`[OIDC] Rejected switchOidcAccount: "${target}" not in identityAccounts ${allowed.join(',')}`);
                } else {
                    let role: Role = Role.USER;
                    let country: string | undefined;
                    let countryRole: Role | undefined;
                    try {
                        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
                        const accountAttrs = await accountGateway.listAccountAttributes(target, token.user.rucioAuthToken);
                        const resolved = resolveAccountRole(accountAttrs.attributes);
                        role = resolved.role ?? Role.USER;
                        country = resolved.country;
                        countryRole = resolved.countryRole;
                    } catch (error) {
                        console.error(`[OIDC] Failed to fetch account attributes for switch target ${target}:`, error);
                    }

                    const switchedUser: SessionUser = {
                        ...token.user,
                        id: `${target}@${token.user.rucioOIDCProvider ?? 'oidc'}`,
                        rucioAccount: target,
                        role,
                        country,
                        countryRole,
                    };

                    if (!token.allUsers) token.allUsers = [];
                    const existingIndex = getSessionUserIndex(token.allUsers, switchedUser);
                    if (existingIndex === -1) {
                        token.allUsers.push(switchedUser);
                    } else {
                        token.allUsers[existingIndex] = switchedUser;
                    }
                    token.user = switchedUser;
                    console.log(`[OIDC] Switched active OIDC account: ${target}`);
                }
            }

            // Handle OIDC session refresh
            // Invoked via unstable_update() from the /api/auth/refresh route with
            // the fresh tokens and expiry returned by the OIDC provider.
            if (trigger === 'update' && session?.rucioAuthToken && session?.rucioAuthTokenExpires && token.user) {
                const refreshedUser: SessionUser = {
                    ...token.user,
                    rucioAuthToken: session.rucioAuthToken,
                    rucioAuthTokenExpires: session.rucioAuthTokenExpires,
                };
                token.user = refreshedUser;
                if (token.allUsers) {
                    const idx = getSessionUserIndex(token.allUsers, refreshedUser);
                    if (idx !== -1) {
                        token.allUsers[idx] = refreshedUser;
                    }
                }
                if (session.rucioOidcRefreshToken) {
                    token.rucioOidcRefreshToken = session.rucioOidcRefreshToken;
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

            // Tie the NextAuth session lifetime to the Rucio token expiry.
            // NextAuth reads token.exp (Unix seconds) to decide if the JWT cookie
            // is still valid; setting it here ensures that useSession(), auth(),
            // and the session cookie all expire exactly when the Rucio token does,
            // rather than after the fixed 24-hour maxAge.
            //
            // For OIDC: cap at sessionStartedAt + SESSION_MAX_AGE_SECONDS so that
            // repeated token refreshes cannot extend the session beyond 24 hours
            // from the original sign-in.
            if (token.user?.rucioAuthTokenExpires) {
                const rucioExpSec = Math.floor(new Date(token.user.rucioAuthTokenExpires).getTime() / 1000);
                if (token.user.rucioAuthType === AuthType.OIDC && token.sessionStartedAt) {
                    const hardCeilSec = (token.sessionStartedAt as number) + SESSION_MAX_AGE_SECONDS;
                    token.exp = Math.min(rucioExpSec, hardCeilSec);
                } else {
                    token.exp = rucioExpSec;
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

            // Pass OIDC errors to the session so the frontend can display them
            if (token.oidcError) {
                session.oidcError = token.oidcError as string;
                session.oidcIdentity = token.oidcIdentity as string;
                session.oidcProvider = token.oidcProvider as string;
            }

            // Expose pending account-selection state to the login page.
            // Note: never expose the underlying tokens; the page only needs
            // the account list and provider name to drive the modal.
            if (token.pendingAccountSelection) {
                session.pendingAccountSelection = {
                    authType: token.pendingAccountSelection.authType,
                    providerName: token.pendingAccountSelection.providerName,
                    rucioIdentity: token.pendingAccountSelection.rucioIdentity,
                    accounts: token.pendingAccountSelection.accounts,
                    rucioAuthToken: '',
                    rucioAuthTokenExpires: token.pendingAccountSelection.rucioAuthTokenExpires,
                    rucioVO: token.pendingAccountSelection.rucioVO,
                };
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
        maxAge: SESSION_MAX_AGE_SECONDS,
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === 'development',
};

// SECURITY: Example tokens and curl commands removed - do not commit sensitive data
