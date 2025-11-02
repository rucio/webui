// Mock for next-auth
const mockNextAuth = jest.fn((configOrCallback) => ({
    handlers: { GET: jest.fn(), POST: jest.fn() },
    auth: jest.fn(() => Promise.resolve(null)),
    signIn: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
}));

module.exports = {
    __esModule: true,
    default: mockNextAuth,
};
