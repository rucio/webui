// `@/lib/infrastructure/auth/auth` is redirected to test/__mocks__/auth.ts
// via moduleNameMapper in jest.api.config.js — no explicit jest.mock needed.

import '@testing-library/jest-dom/extend-expect';
import 'reflect-metadata';
import fetchMock from 'jest-fetch-mock';
import '@inrupt/jest-jsdom-polyfills';

fetchMock.enableMocks();

// import { TextEncoder, TextDecoder } from 'util';
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;
