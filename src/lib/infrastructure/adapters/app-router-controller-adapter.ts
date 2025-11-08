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

    constructor() {
        super({ objectMode: true });
    }

    status(code: number): this {
        this._statusCode = code;
        return this;
    }

    json(data: any): void {
        // For non-streaming presenters that call json()
        const jsonStr = JSON.stringify(data);
        if (this._controller) {
            this._controller.enqueue(this._encoder.encode(jsonStr));
        }
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

        // Immediately enqueue to ReadableStream if controller is available
        if (this._controller) {
            try {
                this._controller.enqueue(this._encoder.encode(chunkStr));
            } catch (error) {
                console.error('[StreamingResponseAdapter] Error enqueueing chunk:', error);
            }
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
                // Store the controller so _write() can enqueue chunks directly
                this._controller = controller;

                // If stream already finished before we created ReadableStream, close it
                if (this._finished) {
                    controller.close();
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
