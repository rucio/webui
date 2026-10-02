import { NextRequest } from 'next/server';

// jsdom doesn't ship Response.json, which NextResponse.json relies on.
if (typeof (global.Response as { json?: unknown }).json !== 'function') {
    (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = function jsonPolyfill(
        data: unknown,
        init?: ResponseInit,
    ): Response {
        return new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json' } });
    };
}

// Signed-in session for the success-path tests; executeAuthenticatedController,
// the controller, use case and presenter all run for real.
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => {
    const user = { rucioIdentity: 'root', rucioAccount: 'root', isLoggedIn: true };
    return {
        __esModule: true,
        ...jest.requireActual('@/lib/infrastructure/auth/nextauth-session-utils'),
        getSession: jest.fn(async () => ({ user })),
        withAuthenticatedSession: jest.fn(async (handler: (user: unknown, token: string) => Promise<unknown>) => handler(user, 'test-token')),
    };
});

import { GET } from '@/app/api/feature/get-panda-task-link/route';

const req = (query: string) => new NextRequest(`http://localhost/api/feature/get-panda-task-link${query}`);

describe('GET /api/feature/get-panda-task-link', () => {
    afterEach(() => {
        delete process.env.FEATURE_DIDS_PANDA_TASK;
    });

    it('returns 404 when dids.panda_task is off (default)', async () => {
        const res = await GET(req('?taskId=34870879'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it.each(['', '?taskId=', '?taskId=abc', '?taskId=-1', '?taskId=1234567890123'])('returns 400 for %p when enabled', async query => {
        process.env.FEATURE_DIDS_PANDA_TASK = 'true';
        expect((await GET(req(query))).status).toBe(400);
    });

    it('returns 404, not 500, when the flag is on at runtime but the feature was not loaded at startup', async () => {
        process.env.FEATURE_DIDS_PANDA_TASK = 'true';
        const res = await GET(req('?taskId=34870879'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });
});

describe('GET /api/feature/get-panda-task-link (feature loaded)', () => {
    let loadedGET: typeof GET;

    beforeAll(() => {
        // The IoC feature is only bound when the flag is on at startup
        process.env.FEATURE_DIDS_PANDA_TASK = 'true';
        jest.isolateModules(() => {
            loadedGET = require('@/app/api/feature/get-panda-task-link/route').GET;
        });
    });

    afterAll(() => {
        delete process.env.FEATURE_DIDS_PANDA_TASK;
    });

    afterEach(() => {
        delete process.env.PANDA_BASE_URL;
    });

    it('returns 200 with the BigPanDA task link', async () => {
        const res = await loadedGET(req('?taskId=34870879'));

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({
            status: 'success',
            taskId: '34870879',
            url: 'https://bigpanda.cern.ch/task/?jeditaskid=34870879',
        });
    });

    it('builds the link from PANDA_BASE_URL', async () => {
        process.env.PANDA_BASE_URL = 'https://panda.example.org/';

        const res = await loadedGET(req('?taskId=1'));

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toMatchObject({ url: 'https://panda.example.org/task/?jeditaskid=1' });
    });
});
