import 'server-only';
import { cache } from 'react';
import { ClientEnv, clientEnvSchema } from './env.client';
import { getServerEnv } from './env.server';

/**
 * Configuration handed to client components through `RuntimeConfigProvider`.
 * Only keys declared in the client schema ever reach the browser.
 */
export type RuntimeConfig = ClientEnv;

/**
 * Reads the browser-safe configuration at request time. Callers must render dynamically
 * (e.g. `await connection()`) so the values come from the running server, not from the build.
 */
export const getRuntimeConfig = cache((): RuntimeConfig => {
    const env = getServerEnv();
    const keys = clientEnvSchema.keyof().options;
    return clientEnvSchema.parse(Object.fromEntries(keys.map(key => [key, env[key]])));
});
