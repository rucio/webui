import { Headers as NodeFetchHeaders } from 'node-fetch'
import { RequestInit, Headers } from 'node-fetch'
import { Agent } from 'https'
/**
 * @description Represents the headers of a HTTP request
 */
export type HTTPRequest = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    url: URL | string
    params?: { [key: string]: string }
    headers?: Headers | { [key: string]: string } | NodeFetchHeaders | HeadersInit | null
    body?: { [key: string]: string } | null
}

/**
* Prepares the request arguments for an HTTP request.
* @param {HTTPRequest} request - The HTTP request to prepare arguments for.
* @param {boolean} disableSSL - A boolean value that indicates whether SSL should be disabled.
* @returns {{ url: string | URL; requestArgs: RequestInit }} - An object containing the URL and request arguments.
*/
export function prepareRequestArgs(request: HTTPRequest, disableSSL: boolean = false): { url: string | URL; requestArgs: RequestInit } {
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
    
    if(disableSSL) {
        requestArgs.agent = new Agent({
            rejectUnauthorized: false
        })
    }
    return { url: request.url, requestArgs };
}
