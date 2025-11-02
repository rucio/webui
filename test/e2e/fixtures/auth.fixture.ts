import { test as base } from '@playwright/test';
import path from 'path';

/**
 * Extended Playwright test with authenticated fixtures
 *
 * This fixture extends the base Playwright test to provide
 * pre-authenticated page instances, allowing tests to skip
 * the login process and focus on feature testing.
 *
 * Usage:
 * ```typescript
 * import { test } from '../fixtures/auth.fixture';
 *
 * test('should display dashboard', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/dashboard');
 *   // ... test code
 * });
 * ```
 */

type AuthFixtures = {
    authenticatedPage: any;
};

export const test = base.extend<AuthFixtures>({
    // Use the authenticated storage state for this fixture
    storageState: path.join(__dirname, '..', '.auth', 'user.json'),

    // Authenticated page fixture
    authenticatedPage: async ({ page }, use) => {
        // The page will automatically use the authenticated storage state
        await use(page);
    },
});

export { expect } from '@playwright/test';
