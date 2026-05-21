/**
 * Tests for the declare-bad-replicas feature.
 *
 * Two layers:
 *  - Controller-level: exercises the use case + presenter through the IoC
 *    container against a mocked Rucio /replicas/bad/dids endpoint.
 *  - Route-level: confirms `POST /api/feature/declare-bad-replicas` returns
 *    200 + JSON on success and 400 on a malformed body, with the auth
 *    wrapper stubbed.
 */

import { Writable } from 'stream';

// jsdom doesn't ship Response.json, which NextResponse.json relies on for
// short-circuit validation errors. Polyfill it before importing the route.
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

import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import DeclareBadReplicasController, {
    DeclareBadReplicasControllerParameters,
} from '@/lib/infrastructure/controller/declare-bad-replicas-controller';
import { DeclareBadReplicasRequest } from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { MockHttpStreamableResponseFactory } from 'test/fixtures/http-fixtures';
import { NextApiResponse } from 'next';
import { DeclareBadReplicasViewModel } from '@/lib/infrastructure/data/view-model/replica';

const makeEndpoint = (status: number, body: unknown): MockEndpoint => ({
    url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/bad/dids/`,
    method: 'POST',
    includes: 'replicas/bad/dids',
    response: {
        status,
        headers: { 'Content-Type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    },
});

describe('Feature: DeclareBadReplicas (controller)', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('returns a success view model with an empty notDeclared list on full acceptance', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(201, [])]);
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: DeclareBadReplicasController = appContainer.get(CONTROLLERS.DECLARE_BAD_REPLICAS);

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            dids: [{ scope: 'test', name: 'susp_1.dat' }],
            rse: 'MOCK_SUSPICIOUS',
            reason: 'checksum mismatch',
        });

        expect(res.statusCode).toBe(200);
        const viewModel = res._getJSONData() as DeclareBadReplicasViewModel;
        expect(viewModel.status).toBe('success');
        expect(viewModel.notDeclared).toEqual([]);
    });

    it('surfaces replicas the server refused via notDeclared', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [
            makeEndpoint(201, [{ scope: 'test', name: 'missing.dat', rse: 'MOCK_SUSPICIOUS', reason: 'No such replica' }]),
        ]);
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<DeclareBadReplicasControllerParameters, DeclareBadReplicasRequest> = appContainer.get(
            CONTROLLERS.DECLARE_BAD_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            dids: [{ scope: 'test', name: 'missing.dat' }],
            rse: 'MOCK_SUSPICIOUS',
            reason: 'checksum mismatch',
        });

        const viewModel = res._getJSONData() as DeclareBadReplicasViewModel;
        expect(viewModel.status).toBe('success');
        expect(viewModel.notDeclared).toHaveLength(1);
        expect(viewModel.notDeclared[0].name).toBe('missing.dat');
        expect(viewModel.notDeclared[0].reason).toBe('No such replica');
    });

    it('propagates a gateway 500 as an error view model', async () => {
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(500, { error: 'boom' })]);
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<DeclareBadReplicasControllerParameters, DeclareBadReplicasRequest> = appContainer.get(
            CONTROLLERS.DECLARE_BAD_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            dids: [{ scope: 'test', name: 'x' }],
            rse: 'MOCK_SUSPICIOUS',
            reason: 'r',
        });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        const viewModel = res._getJSONData() as DeclareBadReplicasViewModel;
        expect(viewModel.status).toBe('error');
        expect(viewModel.errorType).toBe('gateway_error');
    });

    it('rejects requests with missing reason via the use case validator', async () => {
        // No endpoint mock — the validator should short-circuit before hitting Rucio.
        const res = MockHttpStreamableResponseFactory.getMockResponse();
        const controller: BaseController<DeclareBadReplicasControllerParameters, DeclareBadReplicasRequest> = appContainer.get(
            CONTROLLERS.DECLARE_BAD_REPLICAS,
        );

        await controller.execute({
            response: res as unknown as NextApiResponse,
            rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
            dids: [{ scope: 'test', name: 'x' }],
            rse: 'MOCK_SUSPICIOUS',
            reason: '   ',
        });

        const viewModel = res._getJSONData() as DeclareBadReplicasViewModel;
        expect(viewModel.status).toBe('error');
        expect(viewModel.errorType).toBe('validation_error');
        expect(res.statusCode).toBe(400);
    });
});

describe('Route: POST /api/feature/declare-bad-replicas', () => {
    // Stub the auth-gated controller adapter so the route bypasses session
    // checks and the controller executes against the mocked gateway.
    let POST: typeof import('@/app/api/feature/declare-bad-replicas/route').POST;
    let NextRequest: typeof import('next/server').NextRequest;

    beforeAll(() => {
        jest.doMock('@/lib/infrastructure/adapters/app-router-controller-adapter', () => {
            const actual = jest.requireActual('@/lib/infrastructure/adapters/app-router-controller-adapter');

            class FakeBufferingResponseAdapter extends Writable {
                private _statusCode = 200;
                private _headers: Record<string, string> = { 'Content-Type': 'application/json' };
                private _data: unknown = null;
                constructor() {
                    super({ objectMode: true });
                }
                status(code: number) {
                    this._statusCode = code;
                    return this;
                }
                json(data: unknown) {
                    this._data = data;
                    return this;
                }
                setHeader(name: string, value: string) {
                    this._headers[name] = value;
                    return this;
                }
                _write(_chunk: unknown, _enc: BufferEncoding, cb: (e?: Error | null) => void) {
                    cb();
                }
                getStatusCode() {
                    return this._statusCode;
                }
                getData() {
                    return this._data;
                }
                getHeaders() {
                    return this._headers;
                }
            }

            return {
                __esModule: true,
                ...actual,
                executeAuthenticatedController: jest.fn(async (controller: any, parameters: any) => {
                    const responseAdapter = new FakeBufferingResponseAdapter();
                    await controller.execute({
                        ...parameters,
                        response: responseAdapter,
                        rucioAuthToken: MockRucioServerFactory.VALID_RUCIO_TOKEN,
                    });
                    const body = responseAdapter.getData();
                    return new Response(body !== null ? JSON.stringify(body) : '{}', {
                        status: responseAdapter.getStatusCode(),
                        headers: responseAdapter.getHeaders(),
                    });
                }),
            };
        });

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        POST = require('@/app/api/feature/declare-bad-replicas/route').POST;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        NextRequest = require('next/server').NextRequest;
    });

    beforeEach(() => {
        fetchMock.doMock();
        MockRucioServerFactory.createMockRucioServer(true, [makeEndpoint(201, [])]);
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('returns 200 + application/json for a valid body', async () => {
        const request = new NextRequest('http://localhost/api/feature/declare-bad-replicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dids: [{ scope: 'test', name: 'susp_1.dat' }],
                rse: 'MOCK_SUSPICIOUS',
                reason: 'checksum mismatch',
            }),
        });
        const response = (await POST(request)) as Response;
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')?.toLowerCase()).toContain('application/json');
    });

    it('returns 400 when the body fails Zod validation', async () => {
        const request = new NextRequest('http://localhost/api/feature/declare-bad-replicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rse: 'MOCK_SUSPICIOUS', reason: 'missing-dids' }),
        });
        const response = (await POST(request)) as Response;
        expect(response.status).toBe(400);
    });
});
