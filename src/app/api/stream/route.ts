import 'reflect-metadata';
import { NextRequest } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import StreamGatewayOutputPort from '@/lib/core/port/secondary/stream-gateway-output-port';
import { HTTPRequest } from '@/lib/sdk/http';
import { nodeStreamToWebStream, createStreamingResponse, STREAMING_HEADERS } from '@/lib/infrastructure/adapters/streaming-adapter';
import { PassThrough } from 'node:stream';

/**
 * GET /api/stream
 * Generic streaming endpoint for NDJSON data
 * Demonstrates PassThrough stream conversion to Web ReadableStream
 */
export async function GET(request: NextRequest) {
    try {
        const streamingGateway = appContainer.get<StreamGatewayOutputPort>(GATEWAYS.STREAM);
        const url = 'http://localhost:8080/stream';

        const httpRequest: HTTPRequest = {
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
        };

        const { type, content } = await streamingGateway.getJSONChunks(httpRequest);

        // If error response, return immediately
        if (type === 'response') {
            const response = content as Response;
            return new Response(response.statusText, { status: response.status });
        }

        // Convert Node.js PassThrough stream to Web ReadableStream
        const responseStream: PassThrough = content as PassThrough;
        const webStream = nodeStreamToWebStream(responseStream);

        // Return streaming response with proper headers
        return createStreamingResponse(webStream);
    } catch (error) {
        console.error('Error in stream endpoint:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
