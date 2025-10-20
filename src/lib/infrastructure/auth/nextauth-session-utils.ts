import { auth } from '@/lib/infrastructure/auth/auth';
import { SessionUser } from '@/lib/core/entity/auth-models';
import { RucioTokenExpiredError } from '@/lib/core/exceptions/auth-exceptions';

/**
 * Get the current NextAuth session (server-side)
 * Use this in Server Components and Server Actions
 */
export async function getSession() {
    return await auth();
}

/**
 * Get the current session user (server-side)
 * Returns the active SessionUser or undefined if not authenticated
 */
export async function getSessionUser(): Promise<SessionUser | undefined> {
    const session = await getSession();
    return session?.user;
}

/**
 * Get the Rucio auth token for the current session user
 * Returns the token or an empty string if not authenticated
 */
export async function getRucioAuthToken(): Promise<string> {
    const user = await getSessionUser();
    return user?.rucioAuthToken || '';
}

/**
 * Validate that a Rucio token is not expired
 * @throws RucioTokenExpiredError if the token has expired
 * @returns The valid token
 */
export function validateRucioToken(user: SessionUser): string {
    const rucioAuthToken = user.rucioAuthToken;
    const rucioAuthTokenExpiresAt = user.rucioAuthTokenExpires;
    const expirationTime = new Date(rucioAuthTokenExpiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeLeft = expirationTime - currentTime;

    if (timeLeft < 0) {
        throw new RucioTokenExpiredError('Rucio Auth Token expired');
    }

    return rucioAuthToken;
}

/**
 * Wrapper for API routes that require authentication
 * Use this in App Router route handlers
 *
 * @example
 * export async function GET(request: Request) {
 *   return withAuthenticatedSession(async (user, token) => {
 *     const data = await fetchData(token);
 *     return Response.json(data);
 *   });
 * }
 */
export async function withAuthenticatedSession<T>(handler: (user: SessionUser, token: string) => Promise<T>): Promise<T | Response> {
    const user = await getSessionUser();

    if (!user || !user.isLoggedIn) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const token = validateRucioToken(user);
        return await handler(user, token);
    } catch (error) {
        if (error instanceof RucioTokenExpiredError) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Rucio Token has expired' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ error: 'Unauthorized: Rucio Token is invalid' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
