import type { IronSessionOptions } from 'iron-session'
import type { RucioUser } from '@/lib/core/entity/auth-models'

export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: 'rucio-ui-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}


declare module 'iron-session' {
    interface IronSessionData {
        user?: RucioUser
    }
}

