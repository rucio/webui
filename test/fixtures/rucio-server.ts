import { HTTPRequest } from '@/lib/sdk/http';
import { Headers } from 'node-fetch';
import { Readable } from 'stream';
import { Response } from 'node-fetch';
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
     * @returns undefined if the request is valid
     * @throws Error if the request is invalid
     */
    requestValidator?: (req: Request) => Promise<void>;
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
        fetchMock.mockIf(/^https?:\/\/rucio-host.com.*$/, req => {
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
                return Promise.resolve({
                    status: 404,
                    body: JSON.stringify('Not found'),
                } as MockGatewayResponse);
            }
            if (endpoint.requestValidator) {
                endpoint.requestValidator(req);
            }
            return Promise.resolve(endpoint.response);
        });
    }
}
