import type { IronSessionOptions } from 'iron-session'
import type { SessionUser } from '@/lib/core/entity/auth-models'

/**
 * Iron session options
 */
export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: process.env.NEXT_SESSION_COOKIE_NAME as string || "rucio_webui_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

/**
 * Extend the default session type with the user property
 * @property user - The current user, if a user is logged in
 * @property allUsers - All users that are logged in
 * @property redirectAfterLogin - The path to redirect to after login
 */
declare module 'iron-session' {
    interface IronSessionData {
        user?: SessionUser
        allUsers?: SessionUser[]
        redirectAfterLogin?: string
    }
}

