import { Browser, BrowserContext, Locator, Page, expect as baseExpect } from '@playwright/test';
import { LoginCredentials, login } from './auth.helper';

/** The dev server compiles pages on first hit, so account pages get a longer expect timeout. */
export const expect = baseExpect.configure({ timeout: 15000 });

/**
 * Credentials for the account management specs.
 *
 * The admin user must be allowed to manage accounts, the non-admin user must not.
 * Both default to the generic E2E users and can be overridden per environment.
 */
export const adminUser: Required<LoginCredentials> = {
    username: process.env.E2E_ADMIN_USERNAME || process.env.E2E_TEST_USERNAME || 'testuser',
    password: process.env.E2E_ADMIN_PASSWORD || process.env.E2E_TEST_PASSWORD || 'testpassword',
    account: process.env.E2E_ADMIN_ACCOUNT || process.env.E2E_TEST_ACCOUNT || 'testaccount',
};

export const nonAdminUser: Required<LoginCredentials> = {
    username: process.env.E2E_NONADMIN_USERNAME || process.env.E2E_TEST_USERNAME_2 || 'testuser2',
    password: process.env.E2E_NONADMIN_PASSWORD || process.env.E2E_TEST_PASSWORD_2 || 'testpassword2',
    account: process.env.E2E_NONADMIN_ACCOUNT || process.env.E2E_TEST_ACCOUNT_2 || 'testaccount2',
};

/**
 * Rucio never frees the name of a deleted account, so every run needs a fresh one.
 * Matches ^[a-z0-9-_]{1,25}$.
 */
export function uniqueAccountName(prefix = 'e2e-acct'): string {
    return `${prefix}-${Date.now().toString(36)}`;
}

/** Opens a fresh browser context and logs the given user in. The caller closes the context. */
export async function loginInNewContext(browser: Browser, credentials: LoginCredentials): Promise<{ context: BrowserContext; page: Page }> {
    const context = await browser.newContext({ baseURL: process.env.NEXT_PUBLIC_WEBUI_HOST || 'http://localhost:3000' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);
    await login(page, credentials);
    return { context, page };
}

/** Best-effort cleanup through the feature API using the page's session. Never throws. */
export async function deleteAccountQuietly(page: Page, account: string): Promise<void> {
    try {
        await page.request.delete('/api/feature/delete-account', { data: { account } });
    } catch {
        // The account may already be gone.
    }
}

/**
 * Opens the command palette with the keyboard shortcut. Right after navigation the shortcut handler
 * may not be attached yet, so the key press is retried until the palette shows up.
 */
export async function openCommandPalette(page: Page): Promise<Locator> {
    const palette = page.getByRole('dialog', { name: 'Command Palette' });
    await expect(async () => {
        if (!(await palette.isVisible())) await page.keyboard.press('ControlOrMeta+k');
        await expect(palette).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });
    return palette;
}
