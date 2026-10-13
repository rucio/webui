import { test, Page, BrowserContext } from '@playwright/test';
import { expect, nonAdminUser, loginInNewContext } from '../helpers/account.helper';

test.describe('Account pages (non-admin)', () => {
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        ({ context, page } = await loginInNewContext(browser, nonAdminUser));
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('has no Accounts entry and opens My account read-only', async () => {
        await page.goto('/dashboard');
        await expect(page.getByRole('link', { name: 'DIDs' }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: 'Accounts', exact: true })).toHaveCount(0);

        // The account menu button is an unlabeled icon button in the header.
        const headerButtons = page.getByRole('banner').locator('button:not([aria-label])');
        const myAccount = page.getByText('My account', { exact: true });
        for (let i = 0; i < (await headerButtons.count()) && !(await myAccount.isVisible()); i++) {
            await headerButtons.nth(i).click();
        }
        await myAccount.click();
        await page.waitForURL(`**/account/${nonAdminUser.account}*`, { timeout: 30000 });

        await expect(page.getByText('You', { exact: true }).first()).toBeVisible({ timeout: 20000 });
        for (const name of ['Edit', 'Suspend', 'Delete', 'Add identity', 'Add attribute', 'Set quota']) {
            await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
        }
        await expect(page.getByRole('link', { name: 'View rules' })).toBeVisible();
    });

    test('redirects away from the account list', async () => {
        await page.goto('/accounts');
        await page.waitForURL(/\/dashboard$/, { timeout: 30000 });
    });

    test('redirects other accounts to the own account page', async () => {
        await page.goto('/account/root');
        await page.waitForURL(`**/account/${nonAdminUser.account}*`, { timeout: 30000 });
    });

    test('rejects account mutations with 403', async () => {
        const response = await page.request.post('/api/feature/add-account-attribute', {
            data: { account: nonAdminUser.account, key: 'e2e-key', value: 'e2e-value' },
        });
        expect(response.status()).toBe(403);
    });
});
