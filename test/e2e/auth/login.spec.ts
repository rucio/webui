import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth.helper';
import { primaryTestUser, invalidTestUser } from '../fixtures/test-users';

test.describe('UserPass Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login page before each test
        await page.goto('/auth/login');
    });

    test('should display login page with Userpass button', async ({ page }) => {
        // Verify the Rucio logo is visible
        await expect(page.locator('text=Rucio')).toBeVisible();

        // Verify the Userpass button is present
        await expect(page.locator('button:has-text("Userpass")')).toBeVisible();
    });

    test('should show userpass form when Userpass button is clicked', async ({ page }) => {
        // Click the Userpass button
        await page.locator('button:has-text("Userpass")').click();

        // Verify the form is visible
        await expect(page.locator('#userpass-form')).toBeVisible();

        // Verify form fields are present
        await expect(page.locator('#username-input')).toBeVisible();
        await expect(page.locator('#password-input')).toBeVisible();
        await expect(page.locator('#account-input')).toBeVisible();
        await expect(page.locator('#userpass-form button:has-text("Login")')).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
        // Perform login
        await login(page, primaryTestUser);

        // Verify redirect to dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Verify dashboard content is loaded
        // This may need to be adjusted based on actual dashboard content
        await expect(page.locator('text=Dashboard, text=Rucio, text=Rules')).toBeVisible({ timeout: 10000 });
    });

    test('should show error message with invalid credentials', async ({ page }) => {
        // Click the Userpass button to show the form
        await page.locator('button:has-text("Userpass")').click();

        // Wait for the form to be visible
        await expect(page.locator('#userpass-form')).toBeVisible();

        // Fill in invalid credentials
        await page.locator('#username-input').fill(invalidTestUser.username);
        await page.locator('#password-input').fill(invalidTestUser.password);

        // Click the Login button
        await page.locator('#userpass-form button:has-text("Login")').click();

        // Verify error message is displayed
        // The actual error message may vary based on Rucio server response
        await expect(page.locator('[role="alert"], .alert, text=error, text=invalid')).toBeVisible({ timeout: 5000 });
    });

    test('should clear error message when dismissed', async ({ page }) => {
        // Click the Userpass button
        await page.locator('button:has-text("Userpass")').click();

        // Fill in invalid credentials
        await page.locator('#username-input').fill(invalidTestUser.username);
        await page.locator('#password-input').fill(invalidTestUser.password);

        // Submit the form
        await page.locator('#userpass-form button:has-text("Login")').click();

        // Wait for error to appear
        const errorAlert = page.locator('[role="alert"]').first();
        await expect(errorAlert).toBeVisible({ timeout: 5000 });

        // Close the error (look for close button)
        const closeButton = errorAlert.locator('button, [aria-label*="close"], [aria-label*="dismiss"]').first();
        if (await closeButton.isVisible({ timeout: 1000 })) {
            await closeButton.click();

            // Verify error is dismissed
            await expect(errorAlert).not.toBeVisible();
        }
    });

    test('should persist authentication after page reload', async ({ page }) => {
        // Login
        await login(page, primaryTestUser);

        // Reload the page
        await page.reload();

        // Verify still on dashboard (authenticated)
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should allow login without specifying account', async ({ page }) => {
        // Click the Userpass button
        await page.locator('button:has-text("Userpass")').click();

        // Fill in only username and password (no account)
        await page.locator('#username-input').fill(primaryTestUser.username);
        await page.locator('#password-input').fill(primaryTestUser.password);

        // Submit the form
        await page.locator('#userpass-form button:has-text("Login")').click();

        // Should either login successfully or show account selection modal
        // depending on server configuration
        await page.waitForTimeout(2000);

        // Check if we're on dashboard OR if account selection modal appeared
        const isDashboard = await page.url().includes('dashboard');
        const isAccountModal = await page
            .locator('text=Select Account, text=Multiple accounts')
            .isVisible({ timeout: 1000 })
            .catch(() => false);

        expect(isDashboard || isAccountModal).toBeTruthy();
    });
});
