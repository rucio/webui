import { getIronSession } from 'iron-session';
import { createMocks, createResponse, MockResponse } from 'node-mocks-http';
import { EventEmitter } from 'stream';
import { Response } from 'express';
import MockRucioServerFactory from './rucio-server';

/**
 * Creates mock HTTP request and response objects for testing. This is used to mock the requests to NextJS endpoints.
 * For mocking Gateway requests, use {@link MockRucioServerFactory}.
 * @param url The URL for the request.
 * @param method The HTTP method for the request.
 * @param body The request body.
 * @returns An object containing the mock request, response, and session objects.
 */
export async function createHttpMocks(url?: string, method?: 'GET' | 'POST', body: any = {}) {
    const { req, res } = createMocks({
        url: url ? url : 'http://testhost:3000/',
        method: method ? method : 'GET',
        body: body,
    });
    const session = await getIronSession(req, res, {
        password: 'passwordpasswordpasswordpasswordpassword',
        cookieName: 'test-request-session',
        cookieOptions: {
            secure: false,
        },
    });
    return { req, res, session };
}

/**
 * A factory for creating mock HTTP streamable responses.
 * This is used to capture the responses that will be received by the UI.
 * These are not the same as the mock responses used by the Gateway.
 * @see {@link MockRucioServerFactory} for mocking Gateway responses.
 */
export class MockHttpStreamableResponseFactory {
    /**
     * Creates a mock HTTP streamable response that emits 'data' and 'end' events.
     * @returns A mock HTTP streamable response.
     */
    static getMockResponse(): MockResponse<Response> {
        const response = createResponse<Response>({
            eventEmitter: EventEmitter,
        });
        const oldWrite = response.write;
        response.write = function (data: any, encoding: any, callback?: (error?: Error | null) => void) {
            oldWrite.call(response, data, encoding, callback);
            response.emit('data', data);
            return true;
        };
        return response;
    }
}
