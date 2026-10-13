import { NextRequest } from 'next/server';

// jsdom doesn't ship Response.json, which NextResponse.json relies on.
if (typeof (global.Response as { json?: unknown }).json !== 'function') {
    (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = function jsonPolyfill(
        data: unknown,
        init?: ResponseInit,
    ): Response {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: { 'content-type': 'application/json', ...((init?.headers as Record<string, string>) ?? {}) },
        });
    };
}

import { withAdmin, withAccountReadAccess } from '@/lib/infrastructure/adapters/with-admin';
import { Role } from '@/lib/core/entity/auth-models';

const mockGetSessionUser = jest.fn();
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => ({ getSessionUser: () => mockGetSessionUser() }));

const ok = jest.fn(async () => new Response('ok', { status: 200 }));
const req = (q = '') => new NextRequest(`http://localhost/api/feature/x${q}`);

describe('withAdmin', () => {
    beforeEach(() => ok.mockClear());
    it('401 without a session', async () => {
        mockGetSessionUser.mockResolvedValue(undefined);
        expect((await withAdmin(ok)(req())).status).toBe(401);
    });
    it('403 for a non-admin', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' });
        const res = await withAdmin(ok)(req());
        expect(res.status).toBe(403);
        expect(await res.json()).toMatchObject({ status: 'error', errorType: 'permission_denied' });
        expect(ok).not.toHaveBeenCalled();
    });
    it('passes admins through', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.ADMIN, rucioAccount: 'root' });
        expect((await withAdmin(ok)(req())).status).toBe(200);
    });
});

describe('withAccountReadAccess', () => {
    it('lets a non-admin read their own account', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' });
        expect((await withAccountReadAccess(ok)(req('?account=jdoe'))).status).toBe(200);
    });
    it('defaults to the session account when no account is given', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' });
        expect((await withAccountReadAccess(ok)(req())).status).toBe(200);
    });
    it('403 for a non-admin reading another account', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' });
        expect((await withAccountReadAccess(ok)(req('?account=root'))).status).toBe(403);
    });
    it('lets admins read any account', async () => {
        mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.ADMIN, rucioAccount: 'root' });
        expect((await withAccountReadAccess(ok)(req('?account=jdoe'))).status).toBe(200);
    });
});
