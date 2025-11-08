import { GlobalWithFetchMock } from 'jest-fetch-mock';

declare const fetchMock: GlobalWithFetchMock['fetchMock'];

declare global {
    const fetchMock: GlobalWithFetchMock['fetchMock'];
}
