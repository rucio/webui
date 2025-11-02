/**
 * Mock for src/lib/infrastructure/auth/auth.ts
 * This mocks the NextAuth exports to avoid issues with ESM module resolution in tests
 */

export const handlers = {
    GET: jest.fn(),
    POST: jest.fn(),
};

export const auth = jest.fn(() => Promise.resolve(null));

export const signIn = jest.fn(() => Promise.resolve());

export const signOut = jest.fn(() => Promise.resolve());
