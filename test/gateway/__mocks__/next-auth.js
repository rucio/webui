// Mock for next-auth
const mockNextAuth = jest.fn((configOrCallback) => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
    auth: jest.fn(() => Promise.resolve(null)),
    signIn: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
}));

// next-auth/jwt exports — shared because this file also catches `next-auth/*`
// subpaths via the moduleNameMapper.
const getToken = jest.fn();
const encode = jest.fn();
const decode = jest.fn();

module.exports = {
    __esModule: true,
    default: mockNextAuth,
    getToken,
    encode,
    decode,
};
