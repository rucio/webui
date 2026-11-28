import { envKeyForFeature, findShadowedFeatureFlags, readFeatureEnv } from '@/lib/core/entity/feature-config';
import { getServerEnv } from './env.server';

/**
 * Called once when the Node.js server starts. Next.js only logs errors thrown from the
 * instrumentation hook and keeps serving, so exit instead: a deployment with an invalid
 * configuration should fail visibly rather than run with every request erroring.
 */
export function validateEnvOnBoot(): void {
    try {
        getServerEnv();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
    // A flag that is on while a parent is off is not an error, but it is most likely a mistake
    for (const { key, disabledAncestor } of findShadowedFeatureFlags(readFeatureEnv(process.env))) {
        console.warn(`[config] ${envKeyForFeature(key)} is true but has no effect because ${envKeyForFeature(disabledAncestor)} is false.`);
    }
}
