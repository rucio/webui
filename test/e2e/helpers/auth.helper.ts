import { Page, expect } from '@playwright/test';

export interface LoginCredentials {
    username: string;
    password: string;
    account?: string;
}

/**
 * Performs UserPass authentication on the Rucio WebUI
 *
 * @param page - Playwright page object
 * @param credentials - User credentials (username, password, optional account)
 */
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
    const { username, password, account } = credentials;

    // Navigate to login page
    await page.goto('/auth/login');

    // Wait for the login form to be visible
    await expect(page.locator('text=Rucio')).toBeVisible({ timeout: 5000 });

    // Click on the "Userpass" button to show the login form
    await page.locator('button:has-text("Userpass")').click();

    // Wait for the userpass form to be visible
    await expect(page.locator('#userpass-form')).toBeVisible();

    // Fill in the username
    await page.locator('#username-input').fill(username);

    // Fill in the password
    await page.locator('#password-input').fill(password);

    // Fill in the account if provided
    if (account) {
        await page.locator('#account-input').fill(account);
    }

    // Click the Login button
    await page.locator('#userpass-form button:has-text("Login")').click();

    // Wait for successful login - should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
}

/**
 * Performs logout from the Rucio WebUI
 *
 * @param page - Playwright page object
 */
export async function logout(page: Page): Promise<void> {
    // Look for the logout button in the header/navigation
    // This may need to be adjusted based on actual UI implementation
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');

    if (await logoutButton.isVisible({ timeout: 1000 })) {
        await logoutButton.click();
    } else {
        // Alternative: navigate to logout endpoint directly
        await page.goto('/api/auth/logout');
    }

    // Verify we're logged out - should redirect to login page
    await page.waitForURL('**/auth/login', { timeout: 5000 });
}

/**
 * Checks if the user is currently authenticated
 *
 * @param page - Playwright page object
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
    try {
        // Check if we can access the dashboard
        const response = await page.goto('/dashboard');
        return response?.status() === 200;
    } catch {
        return false;
    }
}

/**
 * Waits for a specific element to be visible on the page
 *
 * @param page - Playwright page object
 * @param selector - CSS selector or text selector
 * @param timeout - Maximum wait time in milliseconds
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
}

/**
 * Takes a screenshot with a descriptive name
 *
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}
