// Polyfill ReadableStream for jest-environment-jsdom + undici v6 compatibility.
// jest-environment-jsdom strips web stream globals, but undici v6 requires
// ReadableStream at module load time. This must run via `setupFiles` (before
// setupFilesAfterEnv) so it executes before @inrupt/jest-jsdom-polyfills
// imports undici.
const { ReadableStream, TransformStream, WritableStream } = require('web-streams-polyfill');

if (typeof globalThis.ReadableStream === 'undefined') {
    globalThis.ReadableStream = ReadableStream;
}
if (typeof globalThis.TransformStream === 'undefined') {
    globalThis.TransformStream = TransformStream;
}
if (typeof globalThis.WritableStream === 'undefined') {
    globalThis.WritableStream = WritableStream;
}
