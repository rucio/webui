/**
 * Session configuration for the Rucio WebUI
 *
 * Session management is handled by NextAuth.
 * See auth.ts and auth.config.ts for the NextAuth configuration.
 *
 * The RucioSession interface is the base type for session data.
 * NextAuth's Session type extends this in src/types/next-auth.d.ts
 */

import { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * RucioSession interface represents the session data structure.
 * This is a data-only interface (no methods) - session persistence
 * is handled by NextAuth's JWT callbacks.
 *
 * NextAuth's Session type extends this interface in next-auth.d.ts
 */
export interface RucioSession {
    user?: SessionUser;
    allUsers?: SessionUser[];
    expires?: string;
    // OIDC error handling
    oidcError?: string;
    oidcIdentity?: string;
    oidcProvider?: string;
}
