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

import { GET } from '@/app/api/feature/get-ami-tag-info/route';

const req = (query: string) => new NextRequest(`http://localhost/api/feature/get-ami-tag-info${query}`);

describe('GET /api/feature/get-ami-tag-info', () => {
    afterEach(() => {
        delete process.env.FEATURE_DIDS_AMI_TAGS;
    });

    it('returns 404 when dids.ami_tags is off (default)', async () => {
        const res = await GET(req('?tags=f1723'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it.each(['', '?tags=', '?tags=AOD', '?tags=f1723,v1'])('returns 400 for %p when enabled', async query => {
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const res = await GET(req(query));
        expect(res.status).toBe(400);
    });

    it('returns 404, not 500, when the flag is on at runtime but the feature was not loaded at startup', async () => {
        // container-config was imported with the flag unset, so the controller is unbound
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const res = await GET(req('?tags=f1723'));
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it('returns 400 for more than 10 tags when enabled', async () => {
        process.env.FEATURE_DIDS_AMI_TAGS = 'true';
        const tags = Array.from({ length: 11 }, (_, i) => `f${1000 + i}`).join(',');
        expect((await GET(req(`?tags=${tags}`))).status).toBe(400);
    });
});
