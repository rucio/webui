/**
 * Session configuration for the Rucio WebUI
 *
 * Note: Session management is now handled by NextAuth.
 * See auth.ts and auth.config.ts for the NextAuth configuration.
 *
 * Session types are extended in src/types/next-auth.d.ts
 * Use `import { Session } from 'next-auth'` to get the session type.
 */

import { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * RucioSession interface for session management in use cases and controllers.
 * This interface is used throughout the application for session manipulation.
 *
 * In tests, MockSession from session-utils.ts implements this interface.
 * In production, this is implemented by the session wrapper in App Router routes.
 */
export interface RucioSession {
    user?: SessionUser;
    allUsers?: SessionUser[];
    save(): Promise<void>;
    destroy(): Promise<void>;
}

/**
 * Session options (kept for backwards compatibility with tests)
 * @deprecated Use NextAuth session configuration instead
 */
export const sessionOptions = {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: (process.env.NEXT_SESSION_COOKIE_NAME as string) || 'rucio_webui_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};
