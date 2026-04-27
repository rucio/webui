import { SessionUser as BaseSessionUser } from '@/lib/core/entity/auth-models';
import { RucioSession } from '@/lib/infrastructure/auth/session';

/**
 * Extended SessionUser that includes AdapterUser properties required by NextAuth
 * id is required and is created from rucioAccount@vo
 * email is required but set to empty string since we don't use email-based authentication
 * emailVerified is set to null since we don't use email verification
 */
export interface SessionUser extends BaseSessionUser {
    id: string;
    email: string;
    emailVerified: Date | null;
}

/**
 * Stashed state when an auth flow yielded a valid Rucio token but the user must
 * still pick from multiple candidate accounts (currently only OIDC — userpass
 * and x509 resolve this client-side before signIn). The session is "logged in"
 * to NextAuth but has no active SessionUser; the login page reads this and
 * shows the account-selection modal, then finalises via update().
 */
export interface PendingAccountSelection {
    authType: 'oidc';
    providerName: string;
    rucioIdentity: string;
    accounts: string[];
    rucioAuthToken: string;
    rucioAuthTokenExpires: string;
    rucioVO: string;
    rucioOidcRefreshToken?: string;
}

/**
 * Module augmentation for next-auth to extend the built-in types
 * This allows us to use our custom SessionUser type throughout the application
 */
declare module 'next-auth' {
    /**
     * Override the Session interface extending RucioSession
     * Makes user and allUsers required (not optional) for authenticated sessions
     */
    interface Session extends RucioSession {
        user: SessionUser;
        allUsers: SessionUser[];
        expires: string;
        pendingAccountSelection?: PendingAccountSelection;
    }

    /**
     * Extend the User interface to match our SessionUser
     */
    interface User extends SessionUser {}
}

/**
 * Module augmentation for @auth/core/jwt to add our custom fields to the JWT token
 */
declare module '@auth/core/jwt' {
    /**
     * Extend the JWT interface to store user data and multi-account sessions
     */
    interface JWT {
        user?: SessionUser;
        allUsers?: SessionUser[];
        // OIDC error handling
        oidcError?: string;
        oidcIdentity?: string;
        oidcProvider?: string;
        // OIDC refresh token — stored when rucioAuthType is oidc
        rucioOidcRefreshToken?: string;
        // OIDC: present when the identity maps to multiple Rucio accounts and the
        // user must pick one. Cleared by the finalize update.
        pendingAccountSelection?: import('./next-auth').PendingAccountSelection;
    }
}
