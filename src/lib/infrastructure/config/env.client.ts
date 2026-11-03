import { z } from 'zod';
import { optionalUrl } from './env-schema-helpers';

/**
 * Configuration that is safe to expose to the browser.
 *
 * These values are NOT inlined by `next build`. The server reads them from the environment at request
 * time and hands them to client components through `RuntimeConfigProvider`, so one image can be
 * configured per deployment by setting environment variables when the container starts.
 * Client components must read them with `useRuntimeConfig()`, never from `process.env`.
 */
export const clientEnvSchema = z.object({
    // Public URL of the WebUI. When unset, the host of the incoming request is used.
    NEXT_PUBLIC_WEBUI_HOST: optionalUrl,
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
