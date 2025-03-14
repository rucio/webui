import '@testing-library/jest-dom/extend-expect';
import 'reflect-metadata';
import fetchMock from 'jest-fetch-mock';
import '@inrupt/jest-jsdom-polyfills';

fetchMock.enableMocks();

if (typeof global.Request === 'undefined') {
    const { Request, Response, Headers } = require('node-fetch');
    global.Request = Request;
    global.Response = Response;
    global.Headers = Headers;
}
