import { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * Context passed to every permission check function.
 * Contains the currently logged-in session user whose actions are being authorised.
 */
export interface PermissionContext {
    /** The session user performing the action */
    account: SessionUser;
}
