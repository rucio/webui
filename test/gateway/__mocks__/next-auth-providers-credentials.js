// Mock for next-auth/providers/credentials
const mockCredentials = jest.fn((config) => ({
    ...config,
    id: config?.id || 'credentials',
    name: config?.name || 'Credentials',
    type: 'credentials',
}));

module.exports = {
    __esModule: true,
    default: mockCredentials,
};
