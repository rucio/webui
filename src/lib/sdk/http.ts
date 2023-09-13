import { Headers as NodeFetchHeaders } from 'node-fetch'
import { RequestInit, Headers } from 'node-fetch'

/**
 * @description Represents the headers of a HTTP request
 */
export type HTTPRequest = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: URL | string
    params?: { [key: string]: string }
    headers?: Headers | { [key: string]: string } | NodeFetchHeaders | HeadersInit | null
    body?: { [key: string]: any } | null
}

/**
* Prepares the request arguments for an HTTP request.
* @param {HTTPRequest} request - The HTTP request to prepare arguments for.
* @returns {{ url: string | URL; requestArgs: RequestInit }} - An object containing the URL and request arguments.
*/
export function prepareRequestArgs(request: HTTPRequest): { url: string | URL; requestArgs: RequestInit } {
    if (request.params) {
        const url = new URL(request.url);
        Object.keys(request.params).forEach((key) =>
            url.searchParams.append(key, request.params![key])
        );
        request.url = url.toString();
    }
    const requestArgs: RequestInit = {
        method: request.method || 'GET',
    };
    if (request.body) {
        requestArgs.body = JSON.stringify(request.body);
    }
    if (request.headers) {
        requestArgs.headers = request.headers as Headers;
    }
    return { url: request.url, requestArgs };
}


/**
 * A type that represents an error that occurred making a {@link BaseEndpoint} request.
 */
export type BaseHTTPError = {
    errorCode: number;
    errorName: string;
}

/**
 * A string literal type that represents the type of an error that occurred making a {@link HTTPRequest}.
 */
export class BaseHttpErrorTypes {
    static BAD_REQUEST: BaseHTTPError = {
        errorCode: 400,
        errorName: 'Bad Request'
    };
    static INVALID_AUTH_TOKEN: BaseHTTPError = {
        errorCode: 401,
        errorName: 'Invalid Auth Token'
    };
    static FORBIDDEN: BaseHTTPError = {
        errorCode: 403,
        errorName: 'Forbidden'
    };
    static NOT_FOUND: BaseHTTPError = {
        errorCode: 404,
        errorName: 'Not Found'
    };
    static NOT_ACCEPTABLE: BaseHTTPError = {
        errorCode: 406,
        errorName: 'Not Acceptable'
    };
    static SERVER_ERROR: BaseHTTPError = {
        errorCode: 500,
        errorName: 'Server Error'
    }
    static UNKNOWN_ERROR: BaseHTTPError = {
        errorCode: 0,
        errorName: 'Unknown Error'
    }
}