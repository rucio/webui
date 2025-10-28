import '@testing-library/jest-dom/extend-expect';
import 'reflect-metadata';
import fetchMock from 'jest-fetch-mock';
import '@inrupt/jest-jsdom-polyfills';
fetchMock.enableMocks();

import { loadEnvConfig } from '@next/env';

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

// Mock next-auth to avoid ESM import issues
jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
}));

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

const setupTests = async () => {
    const projectDir = process.cwd();
    loadEnvConfig(projectDir);
};

export default setupTests;
