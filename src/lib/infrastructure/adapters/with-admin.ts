import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { Role, SessionUser } from '@/lib/core/entity/auth-models';
import type { RouteHandler } from './with-feature';

const forbidden = () => NextResponse.json({ status: 'error', errorType: 'permission_denied', message: 'Administrator role required' }, { status: 403 });
const unauthorized = () => NextResponse.json({ status: 'error', errorType: 'unauthorized', message: 'Not logged in' }, { status: 401 });

async function loggedInUser(): Promise<SessionUser | undefined> {
    const user = await getSessionUser();
    return user && user.isLoggedIn ? user : undefined;
}

/** Route guard: only WebUI admins (Role.ADMIN, resolved at login) may call the handler. */
export function withAdmin(handler: RouteHandler): RouteHandler {
    return async (request: NextRequest, ...rest: any[]) => {
        const user = await loggedInUser();
        if (!user) return unauthorized();
        if (user.role !== Role.ADMIN) return forbidden();
        return handler(request, ...rest);
    };
}

/** Route guard for account reads: admins read any account, others only their own (`?account=`, default own). */
export function withAccountReadAccess(handler: RouteHandler): RouteHandler {
    return async (request: NextRequest, ...rest: any[]) => {
        const user = await loggedInUser();
        if (!user) return unauthorized();
        const account = request.nextUrl.searchParams.get('account') || user.rucioAccount;
        if (user.role !== Role.ADMIN && account !== user.rucioAccount) return forbidden();
        return handler(request, ...rest);
    };
}
