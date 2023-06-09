import { getIronSession } from "iron-session";
import { createMocks, createResponse, MockResponse } from "node-mocks-http";
import { EventEmitter } from "stream";
import { Response } from "express";

export async function createHttpMocks(url?: string, method?: 'GET' | 'POST', body: any = {}){
    const { req, res } = createMocks({
        url: url? url: 'http://testhost:3000/',
        method: method? method: 'GET',
        body: body,
    });
    const session = await getIronSession(req, res, {
        password: 'passwordpasswordpasswordpasswordpassword',
        cookieName: 'test-request-session',
        cookieOptions: {
            secure: false,
        },
    })
    return { req, res, session }
}

export class MockHttpStreamableResponseFactory {
    static getMockResponse(): MockResponse<Response> {
        const response = createResponse<Response>({
            eventEmitter: EventEmitter,
        })
        const oldWrite = response.write;
        response.write = function(data: any, encoding: any, callback?: (error?: Error | null) => void) {
            oldWrite.call(response, data, encoding, callback)
            response.emit('data', data)
            return true;
        }
        return response;
    }
} 