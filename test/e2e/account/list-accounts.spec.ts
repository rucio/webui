import { test, Page, BrowserContext } from '@playwright/test';
import { expect, adminUser, loginInNewContext, openCommandPalette } from '../helpers/account.helper';

test.describe('Account list (admin)', () => {
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        ({ context, page } = await loginInNewContext(browser, adminUser));
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('lists accounts and keeps filters in the URL across reload', async () => {
        await page.goto('/accounts');
        await expect(page.getByRole('row', { name: /\broot\b/ }).first()).toBeVisible({ timeout: 20000 });

        await page.getByRole('textbox', { name: 'Name', exact: true }).fill('root*');
        await page.getByRole('combobox', { name: 'Type' }).click();
        await page.getByRole('option', { name: 'Service' }).click();
        await page
            .getByRole('button', { name: /search/i })
            .first()
            .click();

        await expect.poll(() => page.url(), { timeout: 10000 }).toMatch(/[?&]account=root\*/);
        expect(page.url()).toMatch(/[?&]type=SERVICE/);
        await expect(page.getByRole('row', { name: /\broot\b/ }).first()).toBeVisible();

        await page.reload();
        await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('root*');
        await expect(page.getByRole('combobox', { name: 'Type' })).toContainText('Service');
        expect(page.url()).toMatch(/[?&]account=root\*/);
        expect(page.url()).toMatch(/[?&]type=SERVICE/);
        await expect(page.getByRole('row', { name: /\broot\b/ }).first()).toBeVisible({ timeout: 20000 });
    });

    test('shows Accounts in the header and in the command palette', async () => {
        await page.goto('/dashboard');
        await expect(page.getByRole('link', { name: 'Accounts', exact: true }).first()).toBeVisible();

        const palette = await openCommandPalette(page);
        await expect(palette.getByText('Accounts', { exact: true })).toBeVisible();
        await expect(palette.getByText('My account', { exact: true })).toBeVisible();

        await palette.locator('input').fill('root');
        await expect(palette.getByText("Open account 'root'")).toBeVisible();
        await page.keyboard.press('Escape');
    });
});
