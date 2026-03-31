/**
 * Minimal Playwright config for tests that do NOT require authentication.
 * Used by the approve-rules QA step to verify the permission guard redirects
 * work correctly without needing a real Rucio backend account.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e',
    testMatch: '**/approve-rules.spec.ts',
    grep: /permission guard/,

    timeout: 30 * 1000,
    fullyParallel: false,
    retries: 0,

    reporter: [['list']],

    use: {
        baseURL: process.env.NEXT_PUBLIC_WEBUI_HOST || 'http://localhost:3000',
        trace: 'off',
        screenshot: 'only-on-failure',
        navigationTimeout: 15 * 1000,
        actionTimeout: 5 * 1000,
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
            },
        },
    ],

    // No globalSetup – intentionally omitted so we can run without credentials
});
