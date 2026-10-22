import { test, Page, BrowserContext } from '@playwright/test';
import { expect, adminUser, deleteAccountQuietly, loginInNewContext, openCommandPalette, uniqueAccountName } from '../helpers/account.helper';

/**
 * Full admin lifecycle of one throwaway account. The tests share the account and run in order.
 * The account is deleted in afterAll even when a test fails half way.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Account management lifecycle (admin)', () => {
    test.setTimeout(60 * 1000);

    const account = uniqueAccountName();
    const password = 'E2e-Passw0rd-Zq7!';
    let context: BrowserContext;
    let page: Page;

    const dialog = () => page.getByRole('dialog');
    // Row actions live inside the grid; the page header has its own Edit and Delete buttons.
    const gridAction = (name: string) => page.locator('.ag-root-wrapper').getByRole('button', { name, exact: true });
    const accountApiRequests: string[] = [];

    test.beforeAll(async ({ browser }) => {
        ({ context, page } = await loginInNewContext(browser, adminUser));
        page.on('request', request => {
            if (request.url().includes('/api/feature/')) accountApiRequests.push(request.url());
        });
    });

    test.afterAll(async () => {
        await deleteAccountQuietly(page, account);
        await context.close();
    });

    test('creates an account and lands on its identities tab', async () => {
        await page.goto('/accounts');
        await page.getByRole('button', { name: 'Create account' }).first().click();
        await dialog().getByLabel('Account name').or(page.locator('#create-account-name')).fill(account);
        await page.locator('#create-account-email').fill('e2e@example.org');
        await dialog().getByRole('button', { name: 'Create account' }).click();

        await page.waitForURL(`**/account/${account}?tab=identities`, { timeout: 20000 });
        await expect(page.getByText('Account created').first()).toBeVisible();
    });

    test('adds a userpass and an X509 identity and removes the X509 one', async () => {
        await page.goto(`/account/${account}?tab=identities`);

        await page.getByRole('button', { name: 'Add identity' }).first().click();
        await page.locator('#add-identity-type').click();
        await page.getByRole('option', { name: 'Username and password' }).click();
        await page.locator('#add-identity-value').fill(account);
        await page.locator('#add-identity-email').fill('e2e@example.org');
        await page.locator('#add-identity-password').fill(password);
        await page.locator('#add-identity-confirm').fill(password);
        await dialog().getByRole('button', { name: 'Add identity' }).click();
        await expect(dialog()).toBeHidden();
        await expect(page.getByRole('row', { name: new RegExp(account) }).first()).toBeVisible();

        const x509 = `CN=E2E ${account}`;
        await page.getByRole('button', { name: 'Add identity' }).first().click();
        await page.locator('#add-identity-type').click();
        await page.getByRole('option', { name: 'X509 certificate' }).click();
        await page.locator('#add-identity-value').fill(x509);
        await page.locator('#add-identity-email').fill('e2e@example.org');
        await dialog().getByRole('button', { name: 'Add identity' }).click();
        await expect(dialog()).toBeHidden();
        const x509Row = page.getByRole('row', { name: new RegExp(x509) });
        await expect(x509Row).toBeVisible();

        await x509Row.getByRole('button', { name: 'Delete' }).click();
        await dialog().getByRole('button', { name: 'Remove identity' }).click();
        await expect(dialog()).toBeHidden();
        await expect(x509Row).toHaveCount(0);
    });

    test('filters identities by type with a multi-select filter', async () => {
        await page.goto(`/account/${account}?tab=identities`);
        await expect(page.getByRole('row', { name: new RegExp(account) }).first()).toBeVisible();

        const typeFloatingFilter = page.locator('.ag-floating-filter').filter({ has: page.getByRole('textbox', { name: 'Type Filter Input' }) });
        await typeFloatingFilter.getByRole('button').click();
        const filter = page.locator('.ag-popup');
        await expect(filter.getByText('(Select all)')).toBeVisible();
        // A multi-select offers several types at once, each with its own checkbox.
        expect(await filter.getByRole('checkbox').count()).toBeGreaterThan(2);
        await filter
            .getByLabel('Username and password')
            .or(filter.getByLabel(/userpass/i))
            .first()
            .click();
        await expect(page.getByRole('row', { name: new RegExp(account) }).first()).toBeVisible();
        await page.keyboard.press('Escape');
    });

    test('adds, edits and deletes an attribute', async () => {
        await page.goto(`/account/${account}?tab=attributes`);

        await page.getByRole('button', { name: 'Add attribute' }).click();
        await page.locator('#attr-key').fill('country-ch');
        await page.locator('#attr-value').fill('user');
        await dialog().getByRole('button', { name: 'Add attribute' }).click();
        await expect(dialog()).toBeHidden();
        // ag-grid renders pinned and scrolling columns as separate row elements, so assert on cells.
        // The throwaway account has a single attribute, so the row buttons are unambiguous.
        const keyCell = page.getByRole('gridcell').filter({ hasText: 'country-ch' });
        await expect(keyCell).toBeVisible();
        await expect(page.getByRole('gridcell', { name: 'user', exact: true })).toBeVisible();

        await gridAction('Edit').click();
        await expect(dialog().getByText(/deletes the attribute and creates it again/)).toBeVisible();
        await page.locator('#attr-value').fill('admin');
        await dialog().getByRole('button', { name: /^Save/ }).click();
        await expect(dialog()).toBeHidden();
        await expect(page.getByRole('gridcell', { name: 'admin', exact: true })).toBeVisible();

        await gridAction('Delete').click();
        await dialog()
            .getByRole('button', { name: /^Delete/ })
            .last()
            .click();
        await expect(dialog()).toBeHidden();
        await expect(keyCell).toHaveCount(0);
    });

    test('sets, edits and removes a local quota', async () => {
        await page.goto(`/account/${account}?tab=quotas`);
        const local = page.locator('section[aria-label^="Local"]');

        await page.getByRole('button', { name: 'Set quota' }).click();
        await page.locator('#limit-rse').click();
        const firstRse = page.getByRole('option').first();
        const rse = (await firstRse.innerText()).trim();
        await firstRse.click();
        await page.locator('#limit-amount').fill('1');
        await page.locator('#limit-unit').click();
        await page.getByRole('option', { name: 'TB', exact: true }).click();
        await dialog().getByRole('button', { name: 'Set limit' }).click();
        await expect(dialog()).toBeHidden();
        // Pinned columns render as a separate row element, so assert on the whole section, which holds this one quota.
        const rseCell = local.getByRole('gridcell', { name: rse, exact: true });
        await expect(rseCell).toBeVisible();
        await expect(local).toContainText('1 TB');

        // The numeric filter understands byte sizes with a unit.
        const quotaFilter = local.getByRole('textbox', { name: 'Quota Filter Input' });
        await quotaFilter.fill('1 TB');
        await expect(rseCell).toBeVisible();
        await quotaFilter.fill('');

        await local.getByRole('button', { name: 'Edit', exact: true }).click();
        await page.locator('#limit-unlimited').check();
        await dialog().getByRole('button', { name: 'Save limit' }).click();
        await expect(dialog()).toBeHidden();
        await expect(local).toContainText('Unlimited');

        await local.getByRole('button', { name: 'Remove', exact: true }).click();
        await dialog().getByRole('button', { name: 'Delete limit' }).click();
        await expect(dialog()).toBeHidden();
        await expect(rseCell).toHaveCount(0);
    });

    test('links to the rules of the account and records the page as recent', async () => {
        await page.goto(`/account/${account}`);
        await expect(page.getByRole('link', { name: 'View rules' })).toHaveAttribute('href', new RegExp(`autoSearch=true`));
        await expect(page.getByRole('link', { name: 'View rules' })).toHaveAttribute('href', new RegExp(`account=${account}`));

        await page.goto('/dashboard');
        const palette = await openCommandPalette(page);
        await expect(palette.getByText(`Account: ${account}`)).toBeVisible();
        await page.keyboard.press('Escape');
    });

    test('suspends, reactivates and deletes the account', async () => {
        await page.goto(`/account/${account}`);
        await expect(page.getByRole('button', { name: 'Suspend', exact: true })).toBeVisible();
        await page.waitForLoadState('networkidle');

        const before = accountApiRequests.length;
        await page.getByRole('button', { name: 'Suspend', exact: true }).click();
        await dialog().getByRole('button', { name: 'Suspend account' }).click();
        await expect(dialog()).toBeHidden();
        await expect(page.getByText(/This account is suspended/)).toBeVisible();
        await expect(page.getByRole('tab')).toHaveCount(1);
        await page.waitForLoadState('networkidle');
        const afterSuspend = accountApiRequests.slice(before).filter(url => /list-account-identities/.test(url));
        expect(afterSuspend).toEqual([]);

        await page.getByRole('button', { name: 'Reactivate', exact: true }).first().click();
        await dialog().getByRole('button', { name: 'Reactivate account' }).click();
        await expect(dialog()).toBeHidden();
        await expect(page.getByText(/This account is suspended/)).toHaveCount(0);
        await expect(page.getByRole('tab')).toHaveCount(4);

        await page.getByRole('button', { name: 'Delete', exact: true }).click();
        await page.locator('#delete-account-confirm').fill(account);
        await dialog().getByRole('button', { name: 'Delete account' }).click();
        await page.waitForURL('**/accounts', { timeout: 20000 });
        await expect(page.getByText('Account deleted').first()).toBeVisible();
    });
});
