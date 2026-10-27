/**
 * Route handler test for `GET /api/feature/list-file-replicas`.
 * Checks that query options are parsed and that the browser IP is taken from x-forwarded-for.
 */
import { NextRequest } from 'next/server';

jest.mock('@/lib/infrastructure/adapters/app-router-controller-adapter', () => {
    const actual = jest.requireActual('@/lib/infrastructure/adapters/app-router-controller-adapter');
    return {
        __esModule: true,
        ...actual,
        executeAuthenticatedController: jest.fn(async () => new Response(null, { status: 200 })),
    };
});

import { GET } from '@/app/api/feature/list-file-replicas/route';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

const mockedExecute = executeAuthenticatedController as jest.Mock;

const get = (query: string, headers: Record<string, string> = {}) =>
    GET(new NextRequest(`http://localhost/api/feature/list-file-replicas?${query}`, { headers }));

describe('GET /api/feature/list-file-replicas', () => {
    beforeEach(() => mockedExecute.mockClear());

    it('passes only scope and name by default', async () => {
        await get('scope=test&name=file1');
        expect(mockedExecute).toHaveBeenCalledWith(expect.anything(), { scope: 'test', name: 'file1' }, true);
    });

    it('parses the CLI options and the first forwarded IP', async () => {
        await get('scope=test&name=file1&schemes=root&schemes=davs&domain=all&rseExpression=tier%3D1&allStates=false', {
            'x-forwarded-for': '188.184.21.108, 10.0.0.2',
        });
        expect(mockedExecute).toHaveBeenCalledWith(
            expect.anything(),
            {
                scope: 'test',
                name: 'file1',
                schemes: ['root', 'davs'],
                domain: 'all',
                rseExpression: 'tier=1',
                allStates: false,
                clientIp: '188.184.21.108',
            },
            true,
        );
    });

    it('accepts a comma separated schemes value and ignores an invalid forwarded IP', async () => {
        await get('scope=test&name=file1&schemes=root,%20davs&allStates=true', { 'x-forwarded-for': 'not-an-ip' });
        expect(mockedExecute).toHaveBeenCalledWith(
            expect.anything(),
            { scope: 'test', name: 'file1', schemes: ['root', 'davs'], allStates: true },
            true,
        );
    });
});
