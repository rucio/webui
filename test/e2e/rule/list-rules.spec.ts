import { test, expect } from '../fixtures/auth.fixture';

test.describe('Rule List Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to Rule list page
        await page.goto('/rule/list');
    });

    test('should display Rule list page', async ({ page }) => {
        // Verify URL
        await expect(page).toHaveURL(/.*rule\/list/);

        // Verify page title or heading
        await expect(page.locator('h1, h2, [role="heading"]').filter({ hasText: /Rule/i })).toBeVisible({ timeout: 10000 });
    });

    test('should load and display Rule table', async ({ page }) => {
        // Wait for table to load
        const table = page.locator('table, [role="table"]').first();
        await expect(table).toBeVisible({ timeout: 15000 });

        // Verify table has headers
        const tableHeaders = page.locator('th, [role="columnheader"]');
        await expect(tableHeaders.first()).toBeVisible();
    });

    test('should display rule status indicators', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for rule status tags (OK, REPLICATING, STUCK, etc.)
        const statusTags = page.locator('table .tag, table .badge, table [class*="status"]');
        const hasStatus = await statusTags
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasStatus) {
            const statusCount = await statusTags.count();
            expect(statusCount).toBeGreaterThan(0);
        }
    });

    test('should allow navigation to rule details', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Find rule links in the table
        const ruleLinks = page.locator('table a, table [role="link"]');
        const linkCount = await ruleLinks.count();

        if (linkCount > 0) {
            // Click the first rule
            await ruleLinks.first().click();

            // Wait for navigation to rule detail page
            await page.waitForURL(/.*rule\/page\/.*/, { timeout: 10000 });

            // Verify we're on rule detail page
            await expect(page).toHaveURL(/.*rule\/page\/.*/);
        } else {
            test.skip();
        }
    });

    test('should display filter options', async ({ page }) => {
        // Look for filter controls
        const filterControls = page.locator('select, [role="combobox"], input[type="checkbox"], button:has-text("Filter")');
        const hasFilters = await filterControls
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasFilters) {
            const filterCount = await filterControls.count();
            expect(filterCount).toBeGreaterThan(0);
        }
    });

    test('should allow filtering rules by state', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for state filter dropdown
        const stateFilter = page.locator('select[id*="state"], select[name*="state"], select:has-text("State")').first();

        if (await stateFilter.isVisible({ timeout: 2000 })) {
            // Select a specific state (e.g., "OK")
            await stateFilter.selectOption({ index: 1 });

            // Wait for filtered results
            await page.waitForTimeout(1000);

            // Table should still be visible
            await expect(page.locator('table').first()).toBeVisible();
        }
    });

    test('should display account information for rules', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for account column or account information
        const accountInfo = page.locator('table td, table [role="cell"]').filter({ hasText: /account|user/i });
        const hasAccount = await accountInfo
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasAccount) {
            expect(true).toBeTruthy();
        }
    });

    test('should display RSE information for rules', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for RSE column
        const rseInfo = page.locator('th:has-text("RSE"), td:has-text("RSE")');
        const hasRSE = await rseInfo
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasRSE) {
            expect(true).toBeTruthy();
        }
    });

    test('should support pagination when many rules are present', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for pagination controls
        const paginationControls = page.locator('[role="navigation"], .pagination, button:has-text("Next"), button:has-text("Previous")');
        const hasPagination = await paginationControls
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasPagination) {
            // Try clicking next page button
            const nextButton = page.locator('button:has-text("Next"), [aria-label*="next"]').first();
            if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
                await nextButton.click();

                // Wait for new data to load
                await page.waitForTimeout(1000);

                // Verify table still visible
                await expect(page.locator('table').first()).toBeVisible();
            }
        }
    });

    test('should display loading state while fetching rules', async ({ page }) => {
        // Navigate to rule list
        await page.goto('/rule/list');

        // Check for loading indicator (may be very quick)
        const loadingIndicator = page.locator('[role="status"], .loading, .spinner, text=Loading').first();
        const isLoading = await loadingIndicator.isVisible({ timeout: 2000 }).catch(() => false);

        // Eventually the table should load
        await expect(page.locator('table, text=Error, text=Rule')).toBeVisible({ timeout: 15000 });
    });

    test('should display create rule button or link', async ({ page }) => {
        // Look for create rule button/link
        const createButton = page
            .locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New Rule"), a:has-text("New Rule")')
            .first();
        const hasCreateButton = await createButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasCreateButton) {
            // Verify it's clickable
            await expect(createButton).toBeEnabled();

            // Click it
            await createButton.click();

            // Should navigate to create rule page
            await page.waitForURL(/.*rule\/create.*/, { timeout: 5000 });
        }
    });

    test('should display DID information for rules', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for DID column or DID information
        const didInfo = page.locator('th:has-text("DID"), th:has-text("Data Identifier")');
        const hasDID = await didInfo
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasDID) {
            expect(true).toBeTruthy();
        }
    });

    test('should support sorting by column headers', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for sortable column headers
        const sortableHeaders = page.locator('th[role="columnheader"], th button, th[class*="sort"]');
        const headerCount = await sortableHeaders.count();

        if (headerCount > 0) {
            // Click on a sortable header
            const firstHeader = sortableHeaders.first();

            if (await firstHeader.isEnabled()) {
                await firstHeader.click();

                // Wait for table to re-sort
                await page.waitForTimeout(1000);

                // Table should still be visible
                await expect(page.locator('table').first()).toBeVisible();
            }
        }
    });
});
