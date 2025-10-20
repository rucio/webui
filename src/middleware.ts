import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
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

async function reLogin(request: NextRequest, publicHost: string) {
    const signoutPage = new URL(`/api/auth/signout?callbackUrl=${request.nextUrl.pathname}`, `${publicHost}`);
    return NextResponse.redirect(signoutPage);
}

async function initiateLogin(request: NextRequest, publicHost: string) {
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

export async function middleware(request: NextRequest) {
    const publicHost = process.env.NEXT_PUBLIC_WEBUI_HOST || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    try {
        // Get the JWT token from the request
        // This works in Edge Runtime without heavy dependencies
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // Check if token exists
        if (!token || !token.user) {
            return await initiateLogin(request, publicHost);
        }

        const user = token.user as SessionUser;

        // Check if user is logged in and has a Rucio auth token
        if (!user.isLoggedIn || !user.rucioAuthToken) {
            return await reLogin(request, publicHost);
        }

        // Check if rucio token is valid
        if (isTokenExpired(user)) {
            return await reLogin(request, publicHost);
        }

        // All checks have passed, allow the request
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return new Response('Internal Server Error. Could not authenticate or redirect to login page', { status: 500 });
    }
}
