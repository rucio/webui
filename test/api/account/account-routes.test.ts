import { NextRequest } from 'next/server';

// jsdom doesn't ship Response.json, which NextResponse.json relies on.
if (typeof (global.Response as { json?: unknown }).json !== 'function') {
    (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = (data, init) =>
        new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json' } });
}

import FeatureConfigGateway from '@/lib/infrastructure/gateway/feature-config-gateway';
import { Role } from '@/lib/core/entity/auth-models';

const mockGetSessionUser = jest.fn();
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => ({ getSessionUser: () => mockGetSessionUser() }));

// The guards are real; only the controller execution is stubbed so a request that gets past them is observable.
const mockExecute = jest.fn(async () => new Response('{}', { status: 200 }));
jest.mock('@/lib/infrastructure/adapters/app-router-controller-adapter', () => {
    const actual = jest.requireActual('@/lib/infrastructure/adapters/app-router-controller-adapter');
    return { __esModule: true, ...actual, executeAuthenticatedController: (...args: unknown[]) => (mockExecute as jest.Mock)(...args) };
});

type Handler = (request: NextRequest) => Promise<Response> | Response;

const MUTATION_ROUTES: [string, string, Handler][] = [
    ['create-account', 'POST', (r: NextRequest) => require('@/app/api/feature/create-account/route').POST(r)],
    ['update-account', 'PUT', (r: NextRequest) => require('@/app/api/feature/update-account/route').PUT(r)],
    ['delete-account', 'DELETE', (r: NextRequest) => require('@/app/api/feature/delete-account/route').DELETE(r)],
    ['add-account-attribute', 'POST', (r: NextRequest) => require('@/app/api/feature/add-account-attribute/route').POST(r)],
    ['delete-account-attribute', 'DELETE', (r: NextRequest) => require('@/app/api/feature/delete-account-attribute/route').DELETE(r)],
    ['add-account-identity', 'POST', (r: NextRequest) => require('@/app/api/feature/add-account-identity/route').POST(r)],
    ['delete-account-identity', 'DELETE', (r: NextRequest) => require('@/app/api/feature/delete-account-identity/route').DELETE(r)],
    ['set-account-limit', 'PUT', (r: NextRequest) => require('@/app/api/feature/set-account-limit/route').PUT(r)],
    ['delete-account-limit', 'DELETE', (r: NextRequest) => require('@/app/api/feature/delete-account-limit/route').DELETE(r)],
];

const ADMIN_ONLY_READ_ROUTES: [string, Handler][] = [['list-accounts', (r: NextRequest) => require('@/app/api/feature/list-accounts/route').GET(r)]];

const ACCOUNT_READ_ROUTES: [string, Handler][] = [
    ['get-account-info', (r: NextRequest) => require('@/app/api/feature/get-account-info/route').GET(r)],
    ['list-account-attributes', (r: NextRequest) => require('@/app/api/feature/list-account-attributes/route').GET(r)],
    ['list-account-identities', (r: NextRequest) => require('@/app/api/feature/list-account-identities/route').GET(r)],
    ['get-account-quotas', (r: NextRequest) => require('@/app/api/feature/get-account-quotas/route').GET(r)],
];

const request = (name: string, method: string, query = '') =>
    new NextRequest(`http://localhost/api/feature/${name}${query}`, {
        method,
        ...(method === 'GET' ? {} : { headers: { 'Content-Type': 'application/json' }, body: '{}' }),
    });

const asUser = () => mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' });
const asAdmin = () => mockGetSessionUser.mockResolvedValue({ isLoggedIn: true, role: Role.ADMIN, rucioAccount: 'root' });

describe('account routes: guards', () => {
    let isAnyEnabled: jest.SpyInstance;

    beforeEach(() => {
        mockExecute.mockClear();
        isAnyEnabled = jest.spyOn(FeatureConfigGateway.prototype, 'isAnyEnabled').mockResolvedValue(true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('mutation routes', () => {
        it.each(MUTATION_ROUTES)('%s returns 403 for a non-admin', async (name, method, handler) => {
            asUser();
            const response = await handler(request(name, method));
            expect(response.status).toBe(403);
            expect(mockExecute).not.toHaveBeenCalled();
        });

        it.each(MUTATION_ROUTES)('%s returns 404 when accounts.manage is off', async (name, method, handler) => {
            asAdmin();
            isAnyEnabled.mockImplementation(async flags => !flags.includes('accounts.manage'));
            const response = await handler(request(name, method));
            expect(response.status).toBe(404);
            expect(isAnyEnabled).toHaveBeenCalledWith(expect.arrayContaining(['accounts.manage']));
            expect(mockExecute).not.toHaveBeenCalled();
        });

        it.each(MUTATION_ROUTES)('%s lets an admin past the guards', async (name, method, handler) => {
            asAdmin();
            const response = await handler(request(name, method));
            // past the guards the handler validates the (empty) body
            expect(response.status).toBe(400);
        });
    });

    describe('read routes', () => {
        it.each(ADMIN_ONLY_READ_ROUTES)('%s returns 403 for a non-admin', async (name, handler) => {
            asUser();
            const response = await handler(request(name, 'GET'));
            expect(response.status).toBe(403);
            expect(mockExecute).not.toHaveBeenCalled();
        });

        it.each(ACCOUNT_READ_ROUTES)('%s returns 403 when a non-admin asks for another account', async (name, handler) => {
            asUser();
            const response = await handler(request(name, 'GET', '?account=root'));
            expect(response.status).toBe(403);
            expect(mockExecute).not.toHaveBeenCalled();
        });

        it.each(ACCOUNT_READ_ROUTES)('%s lets a non-admin read their own account', async (name, handler) => {
            asUser();
            const response = await handler(request(name, 'GET', '?account=jdoe'));
            expect(response.status).toBe(200);
        });

        // get-account-info is not flagged by design (the auth flow and the session use it).
        const FLAGGED_READ_ROUTES = [...ADMIN_ONLY_READ_ROUTES, ...ACCOUNT_READ_ROUTES.filter(([name]) => name !== 'get-account-info')];

        it.each(FLAGGED_READ_ROUTES)('%s returns 404 when accounts is off', async (name, handler) => {
            asAdmin();
            isAnyEnabled.mockImplementation(async flags => !flags.includes('accounts'));
            const response = await handler(request(name, 'GET', '?account=root'));
            expect(response.status).toBe(404);
            expect(isAnyEnabled).toHaveBeenCalledWith(expect.arrayContaining(['accounts']));
            expect(mockExecute).not.toHaveBeenCalled();
        });

        it('get-account-info stays available when accounts is off', async () => {
            asAdmin();
            isAnyEnabled.mockImplementation(async flags => !flags.includes('accounts'));
            const [, handler] = ACCOUNT_READ_ROUTES.find(([name]) => name === 'get-account-info')!;
            const response = await handler(request('get-account-info', 'GET', '?account=root'));
            expect(response.status).toBe(200);
        });
    });
});
