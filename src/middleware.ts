import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions } from './lib/infrastructure/auth/session';
import { IronSession } from 'iron-session';
import { validateRucioToken } from './lib/infrastructure/auth/auth-utils';

const getSession = async (req: NextRequest, res: NextResponse): Promise<IronSession> => {
    const session = await getIronSession(req, res, sessionOptions);
    return session;
};

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico|auth/.*).*)',
    ],
};

async function reLogin(request: NextRequest, publicHost: string) {
    const logoutPage = new URL(`/api/auth/logout?callbackUrl=${request.nextUrl.pathname}`, `${publicHost}`);
    return NextResponse.redirect(logoutPage);
}

async function initiateLogin(request: NextRequest, publicHost: string) {
    const loginPage = new URL(`/api/auth/login?callbackUrl=${request.nextUrl.pathname}`, `${publicHost}`);
    return NextResponse.redirect(loginPage);
}

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const publicHost = process.env.NEXT_PUBLIC_WEBUI_HOST || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    try {
        const session = await getSession(request, response);

        // check session
        if (!session || !session.user) {
            return await initiateLogin(request, publicHost);
        }

        // check if user is logged in and token exists
        if (!session.user.isLoggedIn || !session.user.rucioAuthToken) {
            return await reLogin(request, publicHost);
        }
        // check if rucio token is valid
        try {
            validateRucioToken(session.user);
        } catch (error) {
            return await reLogin(request, publicHost);
        }

        // All checks have passed, redirect to the original request if it exists
        return response;
    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error. Could not authenticate or rediect to login page', { status: 500 });
    }
}
