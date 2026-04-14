/**
 * Session utilities for testing
 *
 * These functions provide pure transformations for session data.
 * They do not persist changes - that is handled by NextAuth's JWT callbacks.
 *
 * For production code, use the NextAuth session management:
 * - Client: useSession().update({ account: '...' })
 * - Server: auth() to get session, JWT callback handles persistence
 */

import { Role, SessionUser } from '@/lib/core/entity/auth-models';
import { RucioSession } from './session';

/**
 * Mock session interface for testing purposes
 * Includes save/destroy methods that can be mocked with jest.fn()
 */
export interface MockSession extends RucioSession {
    save(): Promise<void>;
    destroy(): Promise<void>;
}

/**
 * Set an empty {@link SessionUser} object in the session
 * Used in tests to initialize a session
 */
export function setEmptySession(session: RucioSession): void {
    const sessionUser: SessionUser = {
        rucioIdentity: '',
        rucioAccount: '',
        rucioAuthType: null,
        rucioAuthToken: '',
        rucioAuthTokenExpires: '',
        rucioOIDCProvider: null,
        rucioVO: '',
        role: Role.USER,
        isLoggedIn: false,
    };
    session.user = sessionUser;
    session.allUsers = [sessionUser];
}

/**
 * Checks if a {@link SessionUser} is in the session.
 * The check is based on the rucioIdentity, rucioAccount and rucioAuthType properties
 * @param session The session object
 * @param sessionUser The {@link SessionUser} object to check
 * @returns Index of the {@link SessionUser} in the session's allUsers list, -1 otherwise
 */
export function getSessionUserIndex(session: RucioSession, sessionUser: SessionUser): number {
    if (!session.allUsers) return -1;
    const userIndex = session.allUsers.findIndex(
        user =>
            user.rucioIdentity === sessionUser.rucioIdentity &&
            user.rucioAccount === sessionUser.rucioAccount &&
            user.rucioAuthType === sessionUser.rucioAuthType,
    );
    return userIndex;
}

/**
 * Adds a new {@link SessionUser} to the session or updates an existing one.
 * This is a pure transformation - it does not persist changes.
 */
export function addOrUpdateSessionUser(session: RucioSession, sessionUser: SessionUser): void {
    session.user = sessionUser;
    session.allUsers = session.allUsers ? session.allUsers : [];

    const sessionUserIndex = getSessionUserIndex(session, sessionUser);
    if (sessionUserIndex === -1) {
        session.allUsers.push(sessionUser);
    } else {
        session.allUsers[sessionUserIndex] = sessionUser;
    }
}

/**
 * Removes a {@link SessionUser} from the session.
 * If an active session user is removed, the first {@link SessionUser} in the allUsers list will be set as active
 * If no {@link SessionUser} is left in the allUsers list, the active session user will be set to undefined
 * This is a pure transformation - it does not persist changes.
 */
export function removeSessionUser(session: RucioSession, sessionUser: SessionUser): void {
    const sessionUserIndex = getSessionUserIndex(session, sessionUser);
    if (sessionUserIndex !== -1) {
        session.allUsers?.splice(sessionUserIndex, 1);
    }

    if (
        session.user?.rucioAccount === sessionUser.rucioAccount &&
        session.user?.rucioIdentity === sessionUser.rucioIdentity &&
        session.user?.rucioAuthType === sessionUser.rucioAuthType
    ) {
        session.user = session.allUsers?.length ? session.allUsers[0] : undefined;
    }
}

/**
 * Sets the current {@link SessionUser} as active in the session.
 * Creates or updates the {@link SessionUser} if necessary
 * This is a pure transformation - it does not persist changes.
 */
export function setActiveSessionUser(session: RucioSession, sessionUser: SessionUser): void {
    addOrUpdateSessionUser(session, sessionUser);
    session.user = sessionUser;
}

/**
 * Returns the active {@link SessionUser} object from the session
 */
export function getActiveSessionUser(session: RucioSession): SessionUser | undefined {
    return session.user;
}
