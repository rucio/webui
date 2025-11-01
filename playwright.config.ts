import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load E2E-specific environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.e2e') });

/**
 * Playwright Configuration for Rucio WebUI E2E Tests
 *
 * This configuration is optimized for testing against a real Rucio server
 * with UserPass authentication and Chromium browser only.
 */
export default defineConfig({
  // Test directory
  testDir: './test/e2e',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: process.env.NEXT_PUBLIC_WEBUI_HOST || 'http://localhost:3000',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: 10 * 1000,

    // Action timeout
    actionTimeout: 5 * 1000,
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directory for test artifacts
  outputDir: 'test-results/',

  // Global setup/teardown
  globalSetup: require.resolve('./test/e2e/global-setup.ts'),
});
