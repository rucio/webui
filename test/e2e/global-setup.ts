import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import { login } from './helpers/auth.helper';

/**
 * Global Setup for Playwright E2E Tests
 *
 * This runs once before all tests and creates an authenticated session
 * that can be reused across all tests to speed up execution.
 */
async function globalSetup(config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    const authFile = path.join(__dirname, '.auth', 'user.json');

    console.log('🔧 Setting up global authenticated session...');

    // Launch browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the application
        await page.goto(baseURL!);

        // Perform login
        await login(page, {
            username: process.env.E2E_TEST_USERNAME || 'testuser',
            password: process.env.E2E_TEST_PASSWORD || 'testpassword',
            account: process.env.E2E_TEST_ACCOUNT || 'testaccount',
        });

        // Wait for navigation to complete
        await page.waitForURL('**/dashboard', { timeout: 10000 });

        // Save authenticated state
        await context.storageState({ path: authFile });

        console.log('✅ Authenticated session saved to:', authFile);
    } catch (error) {
        console.error('❌ Failed to create authenticated session:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

export default globalSetup;
