import type { IronSessionOptions } from 'iron-session'
import type { RucioUser } from '@/lib/core/entity/auth-models'

/**
 * Iron session options
 */
export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: 'rucio-ui-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

/**
 * Extend the default session type with the user property
 * @property user - The current user, if a user is logged in
 * @property redirectAfterLogin - The path to redirect to after login
 */
declare module 'iron-session' {
    interface IronSessionData {
        user?: RucioUser
        redirectAfterLogin?: string
    }
}

