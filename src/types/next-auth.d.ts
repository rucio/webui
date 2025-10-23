import { SessionUser as BaseSessionUser } from '@/lib/core/entity/auth-models';

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
 * Module augmentation for next-auth to extend the built-in types
 * This allows us to use our custom SessionUser type throughout the application
 */
declare module 'next-auth' {
    /**
     * Override the Session interface with our custom user type and multi-account support
     * We don't extend DefaultSession to avoid conflicts
     */
    interface Session {
        user: SessionUser;
        allUsers: SessionUser[];
        expires: string;
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
    }
}
