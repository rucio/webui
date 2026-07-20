import { NextRequest } from 'next/server';

// jsdom doesn't ship Response.json, which NextResponse.json relies on for
// short-circuit validation errors. Polyfill it before importing the module.
if (typeof (global.Response as { json?: unknown }).json !== 'function') {
    (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = function jsonPolyfill(
        data: unknown,
        init?: ResponseInit,
    ): Response {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: {
                'content-type': 'application/json',
                ...(init?.headers instanceof Headers
                    ? Object.fromEntries((init.headers as Headers).entries())
                    : (init?.headers ?? {})),
            },
        });
    };
}

import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

describe('withFeature', () => {
    afterEach(() => {
        delete process.env['FEATURE_RULES'];
        delete process.env['FEATURE_RULES_CREATE'];
    });

    const makeReq = () => new NextRequest('http://localhost/api/feature/create-rule', { method: 'POST' });

    it('returns 404 when the feature is disabled', async () => {
        process.env['FEATURE_RULES'] = 'false'; // cascades to rules.create
        const handler = withFeature(CONTROLLERS.CREATE_RULE, async () => new Response('ok', { status: 200 }));
        const res = await handler(makeReq());
        expect(res.status).toBe(404);
        await expect(res.json()).resolves.toEqual({ error: 'Not found' });
    });

    it('calls the wrapped handler when the feature is enabled', async () => {
        const handler = withFeature(CONTROLLERS.CREATE_RULE, async () => new Response('ok', { status: 200 }));
        const res = await handler(makeReq());
        expect(res.status).toBe(200);
    });

    it('OR-logic: enabled when any provided key is enabled', async () => {
        process.env['FEATURE_RULES_CREATE'] = 'false';
        const handler = withFeature(CONTROLLERS.LIST_ALL_RSES, async () => new Response('ok', { status: 200 }));
        const res = await handler(makeReq()); // rses defaults on
        expect(res.status).toBe(200);
    });

    it('is ungated when the controller declares no flag', async () => {
        const handler = withFeature(CONTROLLERS.DID_META, async () => new Response('ok', { status: 200 }));
        const res = await handler(makeReq());
        expect(res.status).toBe(200);
    });
});
