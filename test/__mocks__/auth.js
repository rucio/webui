Object.defineProperty(exports, '__esModule', { value: true });
exports.handlers = { GET: jest.fn(), POST: jest.fn() };
exports.auth = jest.fn(() => Promise.resolve(null));
exports.signIn = jest.fn(() => Promise.resolve());
exports.signOut = jest.fn(() => Promise.resolve());
exports.update = jest.fn(() => Promise.resolve());
exports.banana = jest.fn(() => 'banana!');
