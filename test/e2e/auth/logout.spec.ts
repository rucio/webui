import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth.helper';
import { primaryTestUser } from '../fixtures/test-users';

test.describe('Logout Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, primaryTestUser);
  });

  test('should logout and redirect to login page', async ({ page }) => {
    // Verify we're logged in
    await expect(page).toHaveURL(/.*dashboard/);

    // Perform logout
    await logout(page);

    // Verify redirect to login page
    await expect(page).toHaveURL(/.*auth\/login/);

    // Verify login form is visible
    await expect(page.locator('button:has-text("Userpass")')).toBeVisible();
  });

  test('should clear session after logout', async ({ page }) => {
    // Logout
    await logout(page);

    // Try to access dashboard directly
    await page.goto('/dashboard');

    // Should redirect to login page
    await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });
  });

  test('should allow re-login after logout', async ({ page }) => {
    // Logout
    await logout(page);

    // Login again
    await login(page, primaryTestUser);

    // Verify successful login
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should clear all authentication cookies on logout', async ({ page }) => {
    // Get cookies before logout
    const cookiesBeforeLogout = await page.context().cookies();
    const sessionCookieBefore = cookiesBeforeLogout.find(
      c => c.name.includes('session') || c.name.includes('rucio')
    );

    // Verify session cookie exists
    expect(sessionCookieBefore).toBeDefined();

    // Logout
    await logout(page);

    // Get cookies after logout
    const cookiesAfterLogout = await page.context().cookies();
    const sessionCookieAfter = cookiesAfterLogout.find(
      c => c.name === sessionCookieBefore?.name
    );

    // Verify session cookie is cleared or expired
    // It may still exist but should be expired or empty
    if (sessionCookieAfter) {
      expect(
        sessionCookieAfter.value === '' ||
        sessionCookieAfter.expires < Date.now() / 1000
      ).toBeTruthy();
    }
  });
});
