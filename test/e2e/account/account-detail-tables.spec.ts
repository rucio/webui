import { test, Page, BrowserContext } from '@playwright/test';
import { expect, adminUser, loginInNewContext } from '../helpers/account.helper';

/**
 * Column filters of the account detail tables, run read-only against the admin's own account.
 * The assertions are derived from the rows the server returns, so they hold for any data set.
 */
test.describe('Account detail tables (admin)', () => {
    let context: BrowserContext;
    let page: Page;
    const pageErrors: string[] = [];
    const accountPath = `/account/${encodeURIComponent(adminUser.account)}`;

    const cells = (colId: string) => page.locator(`.ag-center-cols-container .ag-row [col-id="${colId}"]`);
    const cellTexts = async (colId: string) => (await cells(colId).allInnerTexts()).map(text => text.trim());

    /** Opens the multi-select filter of a column and keeps only the given option. */
    const keepOnlyOption = async (colId: string, label: string) => {
        await page.locator(`.ag-floating-filter[col-id="${colId}"] button`).click();
        const popup = page.locator('.ag-popup');
        await popup.locator('label', { hasText: '(Select all)' }).click();
        await popup.locator('label', { hasText: new RegExp(`^${label}$`) }).click();
        await page.keyboard.press('Escape');
    };

    test.beforeAll(async ({ browser }) => {
        ({ context, page } = await loginInNewContext(browser, adminUser));
        page.on('pageerror', error => pageErrors.push(error.message));
    });

    test.afterAll(async () => {
        await context.close();
    });

    test.beforeEach(() => {
        pageErrors.length = 0;
    });

    test('filters identities by type and identity', async () => {
        await page.goto(`${accountPath}?tab=identities`);
        await expect(cells('type').first()).toBeVisible({ timeout: 20000 });

        const types = await cellTexts('type');
        const identities = await cellTexts('identity');
        const chosenType = types.includes('X509') ? 'X509' : types[0];
        const expectedCount = types.filter(type => type === chosenType).length;

        await keepOnlyOption('type', chosenType);
        await expect(cells('type')).toHaveCount(expectedCount);
        expect(new Set(await cellTexts('type'))).toEqual(new Set([chosenType]));

        // Text filter on top of the type filter: narrow to the first identity of the chosen type.
        const target = identities[types.indexOf(chosenType)];
        await page.locator('.ag-floating-filter[col-id="identity"] input').fill(target);
        await expect
            .poll(() => cellTexts('identity'))
            .toEqual(identities.filter((identity, i) => types[i] === chosenType && identity.includes(target)));

        expect(pageErrors).toEqual([]);
    });

    test('filters quotas by state', async () => {
        await page.goto(`${accountPath}?tab=quotas`);
        await expect(cells('quotaState').first()).toBeVisible({ timeout: 20000 });

        const states = await cellTexts('quotaState');
        const chosenState = states[0];
        await keepOnlyOption('quotaState', chosenState);

        await expect(cells('quotaState')).toHaveCount(states.filter(state => state === chosenState).length);
        expect(new Set(await cellTexts('quotaState'))).toEqual(new Set([chosenState]));
        expect(pageErrors).toEqual([]);
    });
});
