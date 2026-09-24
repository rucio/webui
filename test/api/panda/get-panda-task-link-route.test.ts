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
