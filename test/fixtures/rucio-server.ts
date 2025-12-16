import { HTTPRequest } from '@/lib/sdk/http';
import { Readable } from 'stream';
import { BaseViewModel } from '@/lib/sdk/view-models';

/**
 * Represents a mock HTTP request endpoint.
 */
export interface MockEndpoint extends HTTPRequest {
    /**
     * A string that the URL must end with to match this endpoint.
     */
    endsWith?: string | null;

    /**
     * A string that the URL must include to match this endpoint.
     */
    includes?: string | null;

    /**
     * The response to send when this endpoint is matched.
     */
    response: MockGatewayResponse;

    /**
     * Validate the request parameters, body, and headers.
     * @param req The request to validate.
     * @returns whether the request is valid
     */
    requestValidator?: (req: Request) => Promise<boolean>;
}

/**
 * Represents a mock HTTP response from the Gateway.
 */
export type MockGatewayResponse = {
    /**
     * The HTTP status code to return in the response.
     */
    status: number;

    /**
     * The headers to include in the response.
     */
    headers: Headers | { [key: string]: string } | null;

    /**
     * The body of the response.
     */
    body: string | Readable | null;
};

/**
 * Consume a Node.js Readable stream and return its content as a string
 * This is needed because jest-fetch-mock doesn't handle Node.js streams properly
 */
async function streamToString(nodeStream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        nodeStream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        nodeStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        nodeStream.on('error', reject);
    });
}

/**
 * A factory for creating mock Rucio servers.
 */
export default class MockRucioServerFactory {
    /**
     * A valid Rucio authentication token used by the Mock Rucio Server.
     */
    static VALID_RUCIO_TOKEN: string = 'rucio-ddmlab-askdjljioj';

    /**
     * The host URL for the Mock Rucio server.
     */
    static RUCIO_HOST: string = 'https://rucio-host.com';

    /**
     * Creates a mock Rucio server with the specified endpoints.
     * @param checkAuth Whether to check the authentication token for each request.
     * @param endpoints The endpoints to match against incoming requests.
     */
    static createMockRucioServer(checkAuth: boolean = true, endpoints: MockEndpoint[]) {
        // @ts-ignore
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, async req => {
            if (checkAuth) {
                const rucioToken = req.headers.get('X-Rucio-Auth-Token');
                if (rucioToken !== MockRucioServerFactory.VALID_RUCIO_TOKEN) {
                    return Promise.resolve(
                        new Response('Invalid Rucio Auth Token', {
                            status: 401,
                        }),
                    );
                }
            }
            const endpoint = endpoints.find(endpoint => {
                if (endpoint.url === req.url && endpoint.method === req.method) {
                    return true;
                }
                if (endpoint.endsWith && req.url.endsWith(endpoint.endsWith) && endpoint.method === req.method) {
                    return true;
                }
                if (endpoint.includes && req.url.includes(endpoint.includes) && endpoint.method === req.method) {
                    return true;
                }
                return false;
            });
            if (!endpoint) {
                return Promise.resolve(
                    new Response(JSON.stringify('Not found'), {
                        status: 404,
                    }),
                );
            }
            if (endpoint.requestValidator) {
                const isValid = await endpoint.requestValidator(req);
                if (!isValid) {
                    return Promise.resolve(
                        new Response(JSON.stringify('Bad request'), {
                            status: 400,
                        }),
                    );
                }
            }
            // Convert Node.js Readable streams to strings for jest-fetch-mock compatibility
            const { status, headers, body } = endpoint.response;
            let responseBody: string | null = null;

            if (body instanceof Readable) {
                responseBody = await streamToString(body);
            } else {
                responseBody = body;
            }

            const responseHeaders = headers instanceof Headers ? Object.fromEntries(headers.entries()) : headers || {};

            // Return a simple object format that jest-fetch-mock can handle
            return Promise.resolve({
                status,
                headers: responseHeaders,
                body: responseBody,
            });
        });
    }
}
