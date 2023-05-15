import { Role, SessionUser } from '@/lib/core/entity/auth-models'
import { IronSession, unsealData } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'
import { ReadonlyRequestCookies } from 'next/dist/server/app-render'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { sessionOptions } from '../config/session'

/**
 * Returns the {@link Ruciouser} object from the iron session
 * @param cookies {@link ReadOnlyRequestCookies} from the iron session object
 * @returns {@link RucioUser} object or null
 */
export const getSessionUser = async (
    cookies: ReadonlyRequestCookies,
): Promise<SessionUser | undefined> => {
    const cookieName =
        (process.env.NEXT_SESSION_COOKIE_NAME as string) ||
        'rucio_webui_session'
    const cookie = cookies.get(cookieName)
    if (!cookie)
        return new Promise<SessionUser | undefined>(resolve =>
            resolve(undefined),
        )

    const sessionData = await unsealData<any>(cookie.value, {
        password: process.env.SESSION_PASSWORD as string,
    })
    return new Promise<SessionUser | undefined>(resolve =>
        resolve(sessionData.user),
    )
}

/**
 * Get the rucioAuthToken from the {@link SessionUser} object in the iron session
 * @param cookies {@link ReadonlyRequestCookies} from the iron session object
 * @returns rucioAuthToken for the current {@link SessionUser} or an empty string
 */
export const getRucioAuthToken = async (
    cookies: RequestCookies | ReadonlyRequestCookies,
): Promise<string> => {
    let readOnlyCookies = cookies as unknown as ReadonlyRequestCookies
    const rucioUser = await getSessionUser(readOnlyCookies)
    if (!rucioUser) return new Promise<string>(resolve => resolve(''))
    const rucioAuthToken = rucioUser.rucioAuthToken
    return Promise.resolve(rucioAuthToken)
}

/**
 * Makes a iron session available to a NEXT.js API route via its req.session.user property
 * @param handler {@link NextApiHandler} or a NEXT.js API route
 * @returns wrapped {@link NextApiHandler} or a NEXT.js API route
 */
export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions)
}

/**
 * Set am empty {@link SessionUser} object in the iron session if login fails
 * @param session The {@link IronSession} object
 * @param saveSession If true, the session will be saved
 */
export async function setEmptySession(
    session: IronSession,
    saveSession: boolean = true,
) {
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
    }
    session.user = sessionUser
    session.allUsers = [sessionUser]
    saveSession ? await session.save() : null
}

/**
 * Checks if a {@link SessionUser} is in the iron session. The check is based on the rucioIdentity, rucioAccount and rucioAuthType properties
 * @param session The {@link IronSession} object
 * @param sessionUser The {@link SessionUser} object to check
 * @returns Index of the {@link SessionUser} is in the iron session's allUsers list, -1 otherwise
 */
export function getSessionUserIndex(
    session: IronSession,
    sessionUser: SessionUser,
): number {
    if (!session.allUsers) return -1
    const userIndex = session.allUsers.findIndex(
        user =>
            user.rucioIdentity === sessionUser.rucioIdentity &&
            user.rucioAccount === sessionUser.rucioAccount &&
            user.rucioAuthType === sessionUser.rucioAuthType,
    )
    return userIndex
}

/**
 * Adds a new {@link SessionUser} to the iron session or updates an existing one.
 * @param session The {@link IronSession} object
 * @param sessionUser The {@link SessionUser} object to add or update
 * @param saveSession If true, the session will be saved
 */
export async function addOrUpdateSessionUser(
    session: IronSession,
    sessionUser: SessionUser,
    saveSession: boolean = true,
) {
    session.user = sessionUser
    session.allUsers = session.allUsers ? session.allUsers : []

    const sessionUserIndex = getSessionUserIndex(session, sessionUser)
    if (sessionUserIndex === -1) {
        session.allUsers.push(sessionUser)
    } else {
        session.allUsers[sessionUserIndex] = sessionUser
    }
    saveSession ? await session.save() : null
}

/**
 * Removes a {@link SessionUser} from the iron session. 
 * If an active session user is removed, the first {@link SessionUser} in the allUsers list will be set as active in the iron session
 * If no {@link SessionUser} is left in the allUsers list, the active session user will be set to undefined
 * @param session The {@link IronSession} object
 * @param sessionUser The {@link SessionUser} object to remove
 * @param saveSession If true, the session will be saved
 **/

export async function removeSessionUser(
    session: IronSession,
    sessionUser: SessionUser,
    saveSession: boolean = true,
) {
    const sessionUserIndex = getSessionUserIndex(session, sessionUser)
    if (sessionUserIndex !== -1) {
        session.allUsers?.splice(sessionUserIndex, 1)
    }
    
    if(session.user?.rucioAccount === sessionUser.rucioAccount && session.user?.rucioIdentity === sessionUser.rucioIdentity && session.user?.rucioAuthType === sessionUser.rucioAuthType) {
        session.user = session.allUsers?.length ? session.allUsers[0] : undefined
    }


    saveSession ? await session.save() : null
}

/**
 * Sets the current {@link SessionUser} as active in the iron session. Creates or updates the {@link SessionUser} if necessary
 * @param session The {@link IronSession} object
 * @param sessionUser The {@link SessionUser} object to set as active
 * @param saveSession If true, the session will be saved
 */
export async function setActiveSessionUser(
    session: IronSession,
    sessionUser: SessionUser,
    saveSession: boolean = true,
) {
    await addOrUpdateSessionUser(session, sessionUser, false)
    session.user = sessionUser
    saveSession ? await session.save() : null
}

/**
 * Returns the active {@link SessionUser} object from the iron session
 * @param session The {@link IronSession} object
 * @returns SessionUser object of the active user or undefined
 */
export async function getActiveSessionUser(
    session: IronSession,
): Promise<SessionUser | undefined> {
    return new Promise<SessionUser | undefined>(resolve =>
        resolve(session.user),
    )
}
