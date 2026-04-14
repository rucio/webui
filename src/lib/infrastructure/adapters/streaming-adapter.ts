import { PassThrough, Readable } from 'node:stream';
import { withAuthenticatedSession } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * Standard headers for NDJSON streaming responses
 */
export const STREAMING_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream;charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
} as const;

/**
 * Convert a Node.js Readable stream to a Web ReadableStream
 * Useful for adapting existing streaming endpoints to App Router
 *
 * @param nodeStream - Node.js Readable stream (e.g., PassThrough, fs.ReadStream)
 * @returns Web ReadableStream compatible with Response API
 */
export function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();

    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', (chunk: Buffer | string) => {
                const data = chunk.toString();
                controller.enqueue(encoder.encode(data));
            });

            nodeStream.on('end', () => {
                controller.close();
            });

            nodeStream.on('error', error => {
                console.error('Stream error:', error);
                controller.error(error);
            });
        },
        cancel() {
            nodeStream.destroy();
        },
    });
}

/**
 * Convert a Web ReadableStream to a Node.js Readable stream
 * Useful for adapting fetch responses to existing Node.js stream infrastructure
 *
 * @param webStream - Web ReadableStream (e.g., from fetch response.body)
 * @returns Node.js PassThrough stream
 */
export function webStreamToNodeStream(webStream: ReadableStream<Uint8Array> | Readable | Buffer): PassThrough {
    const passThrough = new PassThrough();

    // Check if it's a Web ReadableStream (has getReader method)
    if (typeof (webStream as ReadableStream<Uint8Array>).getReader === 'function') {
        // Handle Web ReadableStream
        const reader = (webStream as ReadableStream<Uint8Array>).getReader();

        const pump = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        passThrough.end();
                        break;
                    }
                    if (!passThrough.write(value)) {
                        await new Promise(resolve => passThrough.once('drain', resolve));
                    }
                }
            } catch (error) {
                passThrough.destroy(error as Error);
            }
        };

        pump();
    } else if (webStream instanceof Readable || typeof (webStream as unknown as Readable).pipe === 'function') {
        // If it's already a Node.js Readable stream (e.g., in test environments with mocked fetch),
        // just pipe it through
        (webStream as unknown as Readable).pipe(passThrough);
    } else if (Buffer.isBuffer(webStream)) {
        // Handle Buffer (common in test environments with jest-fetch-mock)
        passThrough.write(webStream);
        passThrough.end();
    } else {
        // Unknown stream type
        console.error('webStreamToNodeStream: Unknown stream type received', typeof webStream);
        passThrough.end();
    }

    return passThrough;
}

/**
 * Convert an array of objects to NDJSON ReadableStream
 * Useful for streaming arrays as newline-delimited JSON
 *
 * @param data - Array of objects to stream
 * @returns Web ReadableStream with NDJSON format
 */
export function arrayToNDJSONStream<T>(data: T[]): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    let index = 0;

    return new ReadableStream({
        pull(controller) {
            if (index < data.length) {
                const line = JSON.stringify(data[index]) + '\n';
                controller.enqueue(encoder.encode(line));
                index++;
            } else {
                controller.close();
            }
        },
    });
}

/**
 * Convert an async generator to NDJSON ReadableStream
 * Useful for streaming data from async generators
 *
 * @param generator - Async generator yielding objects
 * @returns Web ReadableStream with NDJSON format
 */
export function asyncGeneratorToNDJSONStream<T>(generator: AsyncGenerator<T>): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();

    return new ReadableStream({
        async pull(controller) {
            try {
                const { value, done } = await generator.next();
                if (done) {
                    controller.close();
                } else {
                    const line = JSON.stringify(value) + '\n';
                    controller.enqueue(encoder.encode(line));
                }
            } catch (error) {
                controller.error(error);
            }
        },
        async cancel() {
            await generator.return(undefined);
        },
    });
}

/**
 * Create a streaming Response with NDJSON headers
 *
 * @param stream - ReadableStream to send
 * @param additionalHeaders - Additional headers to include
 * @returns Response object ready for App Router
 */
export function createStreamingResponse(stream: ReadableStream<Uint8Array>, additionalHeaders?: Record<string, string>): Response {
    return new Response(stream, {
        headers: {
            ...STREAMING_HEADERS,
            ...additionalHeaders,
        },
    });
}

/**
 * Execute a streaming operation with authentication
 * Wraps the streaming logic with authentication check
 *
 * @param streamHandler - Function that generates the stream
 * @returns Response with stream or error
 *
 * @example
 * export async function GET(request: Request) {
 *   return executeAuthenticatedStream(async (user, token) => {
 *     const data = await fetchStreamingData(token);
 *     const stream = arrayToNDJSONStream(data);
 *     return createStreamingResponse(stream);
 *   });
 * }
 */
export async function executeAuthenticatedStream(streamHandler: (user: SessionUser, token: string) => Promise<Response>): Promise<Response> {
    return withAuthenticatedSession(streamHandler) as Promise<Response>;
}

/**
 * Adapter class for PassThrough streams (used in current codebase)
 * Provides a bridge between existing streaming gateway and App Router
 */
export class PassThroughStreamAdapter {
    private passThrough: PassThrough;

    constructor() {
        this.passThrough = new PassThrough();
    }

    /**
     * Get the Node.js PassThrough stream
     * Use this with existing streaming gateways
     */
    getNodeStream(): PassThrough {
        return this.passThrough;
    }

    /**
     * Get the Web ReadableStream for App Router Response
     */
    getWebStream(): ReadableStream<Uint8Array> {
        return nodeStreamToWebStream(this.passThrough);
    }

    /**
     * Write data to the stream
     */
    write(chunk: string | Buffer): void {
        this.passThrough.write(chunk);
    }

    /**
     * End the stream
     */
    end(): void {
        this.passThrough.end();
    }

    /**
     * Destroy the stream
     */
    destroy(): void {
        this.passThrough.destroy();
    }
}

/**
 * Helper for creating mock response object for streaming endpoints
 * Some controllers write directly to response, this adapter captures that
 */
export class StreamingResponseAdapter {
    private headers: Map<string, string> = new Map();
    private statusCode: number = 200;
    private writeCallback?: (chunk: string) => void;
    private endCallback?: () => void;

    setHeader(name: string, value: string): this {
        this.headers.set(name, value);
        return this;
    }

    status(code: number): this {
        this.statusCode = code;
        return this;
    }

    write(chunk: string): void {
        if (this.writeCallback) {
            this.writeCallback(chunk);
        }
    }

    end(): void {
        if (this.endCallback) {
            this.endCallback();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    json(_data: any): this {
        // For error responses in streaming endpoints
        return this;
    }

    onWrite(callback: (chunk: string) => void): void {
        this.writeCallback = callback;
    }

    onEnd(callback: () => void): void {
        this.endCallback = callback;
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    getHeaders(): Record<string, string> {
        return Object.fromEntries(this.headers);
    }
}
