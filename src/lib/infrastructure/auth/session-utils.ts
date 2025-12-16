/**
 * Session utilities for testing and backwards compatibility
 *
 * Note: For production code, use nextauth-session-utils.ts instead.
 * This file is kept primarily for test fixtures.
 *
 * Session management is now handled by NextAuth.
 */

import { Role, SessionUser } from '@/lib/core/entity/auth-models';
import { RucioSession } from './session';

/**
 * Mock session interface for testing purposes
 * Extends RucioSession to ensure type compatibility
 */
export interface MockSession extends RucioSession {}

/**
 * Set an empty {@link SessionUser} object in the session
 * Used in tests to initialize a session
 */
export async function setEmptySession(session: RucioSession, saveSession: boolean = true) {
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
    if (saveSession) {
        await session.save();
    }
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
 * Used in tests to populate sessions
 */
export async function addOrUpdateSessionUser(session: RucioSession, sessionUser: SessionUser, saveSession: boolean = true) {
    session.user = sessionUser;
    session.allUsers = session.allUsers ? session.allUsers : [];

    const sessionUserIndex = getSessionUserIndex(session, sessionUser);
    if (sessionUserIndex === -1) {
        session.allUsers.push(sessionUser);
    } else {
        session.allUsers[sessionUserIndex] = sessionUser;
    }
    if (saveSession) {
        await session.save();
    }
}

/**
 * Removes a {@link SessionUser} from the session.
 * If an active session user is removed, the first {@link SessionUser} in the allUsers list will be set as active
 * If no {@link SessionUser} is left in the allUsers list, the active session user will be set to undefined
 */
export async function removeSessionUser(session: RucioSession, sessionUser: SessionUser, saveSession: boolean = true) {
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

    if (saveSession) {
        await session.save();
    }
}

/**
 * Sets the current {@link SessionUser} as active in the session.
 * Creates or updates the {@link SessionUser} if necessary
 */
export async function setActiveSessionUser(session: RucioSession, sessionUser: SessionUser, saveSession: boolean = true) {
    await addOrUpdateSessionUser(session, sessionUser, false);
    session.user = sessionUser;
    if (saveSession) {
        await session.save();
    }
}

/**
 * Returns the active {@link SessionUser} object from the session
 */
export async function getActiveSessionUser(session: RucioSession): Promise<SessionUser | undefined> {
    return Promise.resolve(session.user);
}
