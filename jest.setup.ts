import '@testing-library/jest-dom/extend-expect'
import "reflect-metadata"
import fetchMock from 'jest-fetch-mock'
import "@inrupt/jest-jsdom-polyfills"
fetchMock.enableMocks()

// import { TextEncoder, TextDecoder } from 'util';
// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;