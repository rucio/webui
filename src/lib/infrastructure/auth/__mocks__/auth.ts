/**
 * Manual mock for auth.ts to avoid NextAuth ESM issues in tests
 */

export const handlers = {
    GET: jest.fn(),
    POST: jest.fn(),
};

export const auth = jest.fn(() => Promise.resolve(null));

export const signIn = jest.fn(() => Promise.resolve());

export const signOut = jest.fn(() => Promise.resolve());
