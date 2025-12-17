import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken, decode } from 'next-auth/jwt';
import type { SessionUser } from './lib/core/entity/auth-models';

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth/* (auth pages)
         */
        '/((?!api/auth|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico|auth/.*).*)',
    ],
};

function reLogin(request: NextRequest, publicHost: string) {
    const signoutPage = new URL(`/api/auth/signout?callbackUrl=${request.nextUrl.pathname}`, `${publicHost}`);
    return NextResponse.redirect(signoutPage);
}

function initiateLogin(request: NextRequest, publicHost: string) {
    const loginPage = new URL(`/auth/login?callbackUrl=${request.nextUrl.pathname}`, `${publicHost}`);
    return NextResponse.redirect(loginPage);
}

/**
 * Validate that a Rucio token is not expired
 */
function isTokenExpired(user: SessionUser): boolean {
    const expirationTime = new Date(user.rucioAuthTokenExpires).getTime();
    const currentTime = new Date().getTime();
    return currentTime >= expirationTime;
}

/**
 * Determine if we should use secure cookies based on NEXTAUTH_URL
 */
function shouldUseSecureCookies(): boolean {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    return nextAuthUrl?.startsWith('https://') ?? false;
}

/**
 * Get the appropriate cookie name based on secure cookie setting
 */
function getSessionCookieName(): string {
    return shouldUseSecureCookies()
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token';
}

export async function middleware(request: NextRequest) {
    const publicHost = process.env.NEXT_PUBLIC_WEBUI_HOST || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const cookieName = getSessionCookieName();
    const secret = process.env.NEXTAUTH_SECRET;

    try {
        // Try getToken with explicit parameters
        const token = await getToken({
            req: request,
            secret: secret,
            secureCookie: shouldUseSecureCookies(),
            cookieName: cookieName,
            salt: cookieName,
        });

        console.log('[Middleware] getToken result:', {
            hasToken: !!token,
            hasUser: !!token?.user,
            cookieName,
            useSecure: shouldUseSecureCookies(),
        });

        // If getToken failed, try manual decode to see the error
        if (!token) {
            const cookieValue = request.cookies.get(cookieName)?.value;
            console.log('[Middleware] Cookie check:', {
                cookieName,
                hasCookie: !!cookieValue,
                cookieLength: cookieValue?.length,
            });

            if (cookieValue) {
                try {
                    const decoded = await decode({
                        token: cookieValue,
                        secret: secret!,
                        salt: cookieName,
                    });
                    console.log('[Middleware] Manual decode result:', {
                        success: !!decoded,
                        hasUser: !!decoded?.user,
                    });
                } catch (decodeError) {
                    console.error('[Middleware] Manual decode error:', decodeError);
                }
            }
        }

        // Check if token exists
        if (!token || !token.user) {
            return initiateLogin(request, publicHost);
        }

        const user = token.user as SessionUser;

        // Check if user is logged in and has a Rucio auth token
        if (!user.isLoggedIn || !user.rucioAuthToken) {
            return reLogin(request, publicHost);
        }

        // Check if rucio token is valid
        if (isTokenExpired(user)) {
            return reLogin(request, publicHost);
        }

        // All checks have passed, allow the request
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return new Response('Internal Server Error. Could not authenticate or redirect to login page', { status: 500 });
    }
}
