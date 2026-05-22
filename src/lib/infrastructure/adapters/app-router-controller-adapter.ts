import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { Writable } from 'stream';
import { getSession, withAuthenticatedSession } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { BaseController, TAuthenticatedControllerParameters, TSimpleControllerParameters } from '@/lib/sdk/controller';
import { SessionUser } from '@/lib/core/entity/auth-models';
import { Signal } from '@/lib/sdk/web';

/**
 * Mock response object that captures data from controller execution
 * Compatible with NextApiResponse interface that controllers expect
 */
class ControllerResponseAdapter {
    private _statusCode: number = 200;
    private _data: any = null;
    private _headers: Record<string, string> = {};

    status(code: number): this {
        this._statusCode = code;
        return this;
    }

    json(data: any): this {
        this._data = data;
        return this;
    }

    send(data: any): this {
        this._data = data;
        return this;
    }

    setHeader(name: string, value: string): this {
        this._headers[name] = value;
        return this;
    }

    getStatusCode(): number {
        return this._statusCode;
    }

    getData(): any {
        return this._data;
    }

    getHeaders(): Record<string, string> {
        return this._headers;
    }
}

/**
 * Streaming response adapter that implements Writable stream and Signal interface
 * Used for streaming endpoints that use presenters with .pipe()
 *
 * This adapter bridges Node.js Writable streams to Web Streams API ReadableStream in real-time.
 */
class StreamingResponseAdapter extends Writable implements Signal {
    private _statusCode: number = 200;
    private _headers: Record<string, string> = {
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    };

    // Real-time streaming bridge
    private _controller: ReadableStreamDefaultController<Uint8Array> | null = null;
    private _encoder = new TextEncoder();
    private _finished = false;
    private _chunkCount = 0;
    // Chunks produced before createReadableStream() is called (e.g. when the
    // use case's error path runs synchronously inside controller.execute() and
    // resolves before the route can attach the readable). Flushed in start().
    private _pendingChunks: Uint8Array[] = [];

    constructor() {
        super({ objectMode: true });
    }

    status(code: number): this {
        this._statusCode = code;
        return this;
    }

    json(data: any): void {
        // Terminal call from streaming presenters' presentError() path: emit the
        // JSON body and close the ReadableStream so the HTTP response completes.
        // Without the close() the client's response.json() hangs (request shows
        // up as "pending" in DevTools forever).
        const encoded = this._encoder.encode(JSON.stringify(data));
        if (this._controller) {
            try {
                this._controller.enqueue(encoded);
                this._controller.close();
            } catch (error) {
                console.error('[StreamingResponseAdapter] Error finalizing json response:', error);
            }
            this._controller = null;
        } else {
            // No controller yet (route hasn't called createReadableStream).
            // Buffer the body; start() will flush it and then close immediately
            // because _finished is true.
            this._pendingChunks.push(encoded);
        }
        this._finished = true;
    }

    setHeader(name: string, value: string): this {
        this._headers[name] = value;
        return this;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        // Capture NDJSON chunks from streaming presenter and immediately enqueue to ReadableStream
        let chunkStr: string;
        if (typeof chunk === 'string') {
            chunkStr = chunk;
        } else if (Buffer.isBuffer(chunk)) {
            chunkStr = chunk.toString();
        } else {
            chunkStr = JSON.stringify(chunk) + '\n';
        }

        this._chunkCount++;
        const encoded = this._encoder.encode(chunkStr);

        if (this._controller) {
            try {
                this._controller.enqueue(encoded);
            } catch (error) {
                console.error('[StreamingResponseAdapter] Error enqueueing chunk:', error);
            }
        } else {
            // Buffer until createReadableStream() runs.
            this._pendingChunks.push(encoded);
        }

        callback();
    }

    _final(callback: (error?: Error | null) => void): void {
        this._finished = true;

        // Close the ReadableStream
        if (this._controller) {
            try {
                this._controller.close();
            } catch (error) {
                console.error('[StreamingResponseAdapter] Error closing controller:', error);
            }
        }

        callback();
    }

    getStatusCode(): number {
        return this._statusCode;
    }

    getHeaders(): Record<string, string> {
        return this._headers;
    }

    /**
     * Create a ReadableStream that will receive chunks in real-time as they're written
     */
    createReadableStream(): ReadableStream<Uint8Array> {
        return new ReadableStream<Uint8Array>({
            start: controller => {
                this._controller = controller;

                // Flush anything written before the stream was attached
                // (most commonly the JSON body from presentError()).
                for (const chunk of this._pendingChunks) {
                    try {
                        controller.enqueue(chunk);
                    } catch (error) {
                        console.error('[StreamingResponseAdapter] Error flushing pending chunk:', error);
                    }
                }
                this._pendingChunks = [];

                // If the producer already finished, close immediately.
                if (this._finished) {
                    try {
                        controller.close();
                    } catch (error) {
                        console.error('[StreamingResponseAdapter] Error closing controller on start:', error);
                    }
                    this._controller = null;
                }
            },

            cancel: () => {
                this._controller = null;
            },
        });
    }
}

/**
 * Execute a controller and return NextResponse
 * For controllers that don't require authentication (e.g., login endpoints)
 *
 * @param controller - The controller instance from IoC container
 * @param parameters - Controller parameters (without rucioAuthToken)
 * @param streaming - Whether this is a streaming endpoint
 * @returns NextResponse with the controller's output
 */
export async function executeController<TParams extends TSimpleControllerParameters>(
    controller: BaseController<TParams, any>,
    parameters: Omit<TParams, 'response' | 'session'>,
    streaming: boolean = false,
): Promise<NextResponse | Response> {
    try {
        const session = await getSession();
        const responseAdapter = streaming ? new StreamingResponseAdapter() : new ControllerResponseAdapter();

        const controllerParams = {
            ...parameters,
            response: responseAdapter,
            session: session,
        } as unknown as TParams;

        await controller.execute(controllerParams);

        // Handle streaming response
        if (streaming && responseAdapter instanceof StreamingResponseAdapter) {
            const stream = responseAdapter.createReadableStream();
            const headers = responseAdapter.getHeaders();
            return new Response(stream, {
                status: responseAdapter.getStatusCode(),
                headers: headers,
            });
        }

        // Handle regular response
        if (responseAdapter instanceof ControllerResponseAdapter) {
            const data = responseAdapter.getData();
            const statusCode = responseAdapter.getStatusCode();
            const headers = responseAdapter.getHeaders();

            if (data !== null) {
                return NextResponse.json(data, {
                    status: statusCode,
                    headers: Object.keys(headers).length > 0 ? headers : undefined,
                });
            }
        }

        // Fallback if no data was captured
        return NextResponse.json(
            {
                status: 'error',
                error: 'no-data',
                message: 'Controller did not return data',
                code: 500,
            },
            { status: 500 },
        );
    } catch (error) {
        console.error('Error executing controller:', error);
        return NextResponse.json(
            {
                status: 'error',
                error: 'internal-server-error',
                message: error instanceof Error ? error.message : 'Internal server error',
                code: 500,
            },
            { status: 500 },
        );
    }
}

/**
 * Execute an authenticated controller and return NextResponse
 * For controllers that require authentication and rucioAuthToken
 *
 * @param controller - The controller instance from IoC container
 * @param parameters - Controller parameters (without response, session, and rucioAuthToken)
 * @param streaming - Whether this is a streaming endpoint
 * @returns NextResponse with the controller's output
 *
 * @example
 * export async function GET() {
 *   const controller = appContainer.get<ListRulesController>(CONTROLLERS.LIST_RULES);
 *   return executeAuthenticatedController(controller, { filters: { account: 'test' } });
 * }
 */
export async function executeAuthenticatedController<TParams extends TAuthenticatedControllerParameters>(
    controller: BaseController<TParams, any>,
    parameters: Omit<TParams, 'response' | 'session' | 'rucioAuthToken'>,
    streaming: boolean = false,
): Promise<NextResponse | Response> {
    return withAuthenticatedSession(async (user: SessionUser, token: string) => {
        try {
            const session = await getSession();
            const responseAdapter = streaming ? new StreamingResponseAdapter() : new ControllerResponseAdapter();

            const controllerParams = {
                ...parameters,
                response: responseAdapter,
                session: session,
                rucioAuthToken: token,
            } as unknown as TParams;

            await controller.execute(controllerParams);

            // Handle streaming response
            if (streaming && responseAdapter instanceof StreamingResponseAdapter) {
                const stream = responseAdapter.createReadableStream();
                const headers = responseAdapter.getHeaders();
                return new Response(stream, {
                    status: responseAdapter.getStatusCode(),
                    headers: headers,
                });
            }

            // Handle regular response
            if (responseAdapter instanceof ControllerResponseAdapter) {
                const data = responseAdapter.getData();
                const statusCode = responseAdapter.getStatusCode();
                const headers = responseAdapter.getHeaders();

                if (data !== null) {
                    return NextResponse.json(data, {
                        status: statusCode,
                        headers: Object.keys(headers).length > 0 ? headers : undefined,
                    });
                }
            }

            // Fallback if no data was captured
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'no-data',
                    message: 'Controller did not return data',
                    code: 500,
                },
                { status: 500 },
            );
        } catch (error) {
            console.error('Error executing authenticated controller:', error);
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'internal-server-error',
                    message: error instanceof Error ? error.message : 'Internal server error',
                    code: 500,
                },
                { status: 500 },
            );
        }
    }) as Promise<NextResponse | Response>;
}

/**
 * Parse and validate query parameters from Request URL
 *
 * @param request - The incoming Request object
 * @returns Object with query parameters
 */
export function parseQueryParams(request: Request): Record<string, string | string[]> {
    const url = new URL(request.url);
    const params: Record<string, string | string[]> = {};

    url.searchParams.forEach((value, key) => {
        if (params[key]) {
            // Handle multiple values for same key
            if (Array.isArray(params[key])) {
                (params[key] as string[]).push(value);
            } else {
                params[key] = [params[key] as string, value];
            }
        } else {
            params[key] = value;
        }
    });

    return params;
}

/**
 * Parse and validate request body
 *
 * @param request - The incoming Request object
 * @returns Parsed JSON body or null
 */
export async function parseRequestBody(request: Request): Promise<any> {
    try {
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await request.json();
        }
        return null;
    } catch (error) {
        console.error('Error parsing request body:', error);
        return null;
    }
}
