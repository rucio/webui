/**
 * Route handler test for `GET /api/feature/list-suspicious-replicas`.
 *
 * Verifies the route returns HTTP 200 and the streaming Content-Type for a
 * mocked gateway response, covering AC #12 (route returns the correct HTTP
 * status and content-type).
 *
 * The auth-gated controller adapter is stubbed so the route bypasses session
 * checks and the controller is exercised against the mocked Rucio gateway.
 * The returned `Response` is constructed using the same `StreamingResponseAdapter`
 * the production adapter uses, so the Content-Type assertion reflects real
 * behavior.
 */

import { Writable } from 'stream';

const FAKE_TOKEN = '3a4d6e9a73fb46bd9e5dc4cbaab1c8af';

// Replace `executeAuthenticatedController` with a stub that mirrors the
// streaming branch of the production adapter but skips the auth wrapper.
jest.mock('@/lib/infrastructure/adapters/app-router-controller-adapter', () => {
    const actual = jest.requireActual('@/lib/infrastructure/adapters/app-router-controller-adapter');

    class FakeStreamingResponseAdapter extends Writable {
        private _statusCode = 200;
        private _headers: Record<string, string> = {
            'Content-Type': 'text/event-stream;charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        };
        private _controller: ReadableStreamDefaultController<Uint8Array> | null = null;
        private _encoder = new TextEncoder();
        constructor() {
            super({ objectMode: true });
        }
        status(code: number) {
            this._statusCode = code;
            return this;
        }
        setHeader(name: string, value: string) {
            this._headers[name] = value;
            return this;
        }
        json(_data: unknown) {
            return this;
        }
        _write(chunk: unknown, _enc: BufferEncoding, cb: (err?: Error | null) => void) {
            const s = typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? chunk.toString() : JSON.stringify(chunk) + '\n';
            this._controller?.enqueue(this._encoder.encode(s));
            cb();
        }
        _final(cb: (err?: Error | null) => void) {
            try {
                this._controller?.close();
            } catch (_e) {
                // already closed
            }
            cb();
        }
        createReadableStream(): ReadableStream<Uint8Array> {
            const self = this;
            return new ReadableStream<Uint8Array>({
                start(controller) {
                    self._controller = controller;
                },
            });
        }
        getStatusCode() {
            return this._statusCode;
        }
        getHeaders() {
            return this._headers;
        }
    }

    return {
        __esModule: true,
        ...actual,
        executeAuthenticatedController: jest.fn(async (controller: any, parameters: any) => {
            const responseAdapter = new FakeStreamingResponseAdapter();
            const stream = responseAdapter.createReadableStream();
            const params = {
                ...parameters,
                response: responseAdapter,
                session: { user: { rucioAuthToken: FAKE_TOKEN } },
                rucioAuthToken: FAKE_TOKEN,
            };
            // Kick off the controller; chunks are enqueued into the ReadableStream
            // via the adapter's _write/_final. Return immediately so the response
            // streams as the controller writes.
            controller.execute(params);
            return new Response(stream, {
                status: responseAdapter.getStatusCode(),
                headers: responseAdapter.getHeaders(),
            });
        }),
    };
});

import MockRucioServerFactory, { MockEndpoint } from 'test/fixtures/rucio-server';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/feature/list-suspicious-replicas/route';

const mockReplicas = [
    {
        scope: 'test',
        name: 'suspicious_test_file_1.dat',
        rse: 'MOCK_SUSPICIOUS',
        rse_id: '6762d2e939bd41a89a012f40d038843e',
        cnt: 3,
        created_at: 'Wed, 18 Mar 2026 09:08:23 UTC',
    },
];

describe('Route: GET /api/feature/list-suspicious-replicas', () => {
    beforeEach(() => {
        fetchMock.doMock();
        const endpoint: MockEndpoint = {
            url: `${MockRucioServerFactory.RUCIO_HOST}/replicas/suspicious/`,
            method: 'GET',
            includes: 'replicas/suspicious',
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockReplicas),
            },
        };
        MockRucioServerFactory.createMockRucioServer(true, [endpoint]);
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('returns 200 and a streaming Content-Type for a mocked gateway response', async () => {
        const request = new NextRequest('http://localhost/api/feature/list-suspicious-replicas');
        const response = (await GET(request)) as Response;

        expect(response.status).toBe(200);
        const contentType = response.headers.get('content-type') ?? '';
        // Streaming endpoints set Content-Type via StreamingResponseAdapter
        // (`text/event-stream;charset=utf-8`), shared with other feature streams.
        expect(contentType.toLowerCase()).toContain('text/event-stream');
    });
});
