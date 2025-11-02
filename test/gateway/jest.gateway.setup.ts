// Mock the auth.ts file BEFORE any imports
jest.mock('../../src/lib/infrastructure/auth/auth', () => ({
    __esModule: true,
    handlers: {
        GET: jest.fn(),
        POST: jest.fn(),
    },
    auth: jest.fn(() => Promise.resolve(null)),
    signIn: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
}));

import '@testing-library/jest-dom/extend-expect';
import 'reflect-metadata';
import '@inrupt/jest-jsdom-polyfills';
import fetchMock from 'jest-fetch-mock';

// Mock next-auth/react for client-side components
jest.mock('next-auth/react', () => ({
    __esModule: true,
    useSession: jest.fn(() => ({
        data: null,
        status: 'unauthenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Allow for fetch() mock to handle streams
// https://github.com/jefflau/jest-fetch-mock/issues/113#issuecomment-1418504168
// import { Readable } from "stream";
// class TempResponse extends Response {
//     constructor(...args: (Iterable<any> | AsyncIterable<any>)[]) {
//         if (args[0] instanceof ReadableStream) {
//             args[0] = Readable.from(args[0]);
//         }
//         super(...args);
//     }
// }
// Object.defineProperty(global, "Response", {
//     value: TempResponse,
// });

fetchMock.enableMocks();
