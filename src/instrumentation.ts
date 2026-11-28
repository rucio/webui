/**
 * Validates the configuration when the server starts, so a misconfigured deployment stops
 * immediately with a readable list of problems instead of failing on the first request.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }
    const { validateEnvOnBoot } = await import('@/lib/infrastructure/config/validate-env-on-boot');
    validateEnvOnBoot();
}
