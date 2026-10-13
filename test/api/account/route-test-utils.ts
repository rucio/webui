import { NextRequest } from 'next/server';

/**
 * Loads an /api/feature route handler with the feature and admin guards passed through and the
 * authenticated controller adapter replaced by a spy, so tests can assert on request validation
 * and on the parameters handed to the controller.
 */
export function loadRoute<M extends Record<string, unknown>>(routeModule: string): { route: M; execute: jest.Mock } {
    // jsdom has no Response.json, which NextResponse.json relies on
    if (typeof (global.Response as { json?: unknown }).json !== 'function') {
        (global.Response as unknown as { json: (data: unknown, init?: ResponseInit) => Response }).json = (data, init) =>
            new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json' } });
    }
    const execute = jest.fn(async () => new Response('{}', { status: 200 }));
    jest.resetModules();
    jest.doMock('@/lib/infrastructure/adapters/with-feature', () => ({
        __esModule: true,
        withFeature: (_symbol: symbol, handler: unknown) => handler,
    }));
    jest.doMock('@/lib/infrastructure/adapters/with-admin', () => ({
        __esModule: true,
        withAdmin: (handler: unknown) => handler,
        withAccountReadAccess: (handler: unknown) => handler,
    }));
    jest.doMock('@/lib/infrastructure/adapters/app-router-controller-adapter', () => {
        const actual = jest.requireActual('@/lib/infrastructure/adapters/app-router-controller-adapter');
        return { __esModule: true, ...actual, executeAuthenticatedController: execute };
    });
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const route = require(routeModule) as M;
    return { route, execute };
}

export function jsonRequest(method: string, body: unknown): NextRequest {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NextRequest: Request } = require('next/server') as typeof import('next/server');
    return new Request('http://localhost/api/feature/test', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
