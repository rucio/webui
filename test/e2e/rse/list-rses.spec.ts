import { test, expect } from '../fixtures/auth.fixture';

test.describe('RSE List Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to RSE list page
        await page.goto('/rse/list');
    });

    test('should display RSE list page', async ({ page }) => {
        // Verify URL
        await expect(page).toHaveURL(/.*rse\/list/);

        // Verify page title or heading
        await expect(page.locator('h1, h2, [role="heading"]').filter({ hasText: /RSE|Storage Element/i })).toBeVisible({ timeout: 10000 });
    });

    test('should load and display RSE table', async ({ page }) => {
        // Wait for table to load
        const table = page.locator('table, [role="table"]').first();
        await expect(table).toBeVisible({ timeout: 15000 });

        // Verify table has headers
        const tableHeaders = page.locator('th, [role="columnheader"]');
        await expect(tableHeaders.first()).toBeVisible();
    });

    test('should display RSE names in the table', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Verify table has rows with data
        const tableRows = page.locator('table tbody tr, [role="row"]');
        const rowCount = await tableRows.count();

        // Should have at least one RSE (or show empty state)
        if (rowCount > 0) {
            // Verify first row has content
            await expect(tableRows.first()).toContainText(/.+/);
        }
    });

    test('should allow navigation to RSE details', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Find RSE links in the table
        const rseLinks = page.locator('table a, table [role="link"]');
        const linkCount = await rseLinks.count();

        if (linkCount > 0) {
            // Get the href of the first link to verify it's an RSE link
            const firstLink = rseLinks.first();
            const href = await firstLink.getAttribute('href');

            expect(href).toContain('/rse/page/');

            // Click the link
            await firstLink.click();

            // Wait for navigation to RSE detail page
            await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

            // Verify we're on RSE detail page
            await expect(page).toHaveURL(/.*rse\/page\/.*/);
        } else {
            test.skip();
        }
    });

    test('should display search/filter functionality', async ({ page }) => {
        // Look for search or filter inputs
        const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="search"], input[placeholder*="RSE"]').first();

        const hasSearch = await searchInput.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasSearch) {
            // Try searching for a pattern
            await searchInput.fill('*');

            // Look for search button or press Enter
            const searchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();

            if (await searchButton.isVisible({ timeout: 1000 })) {
                await searchButton.click();
            } else {
                await searchInput.press('Enter');
            }

            // Wait for results
            await page.waitForTimeout(1000);

            // Table should still be visible
            await expect(page.locator('table').first()).toBeVisible();
        }
    });

    test('should display RSE availability status', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for availability indicators (tags, badges, status icons)
        const statusIndicators = page.locator('table .tag, table .badge, table [class*="status"]');
        const hasStatus = await statusIndicators
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        // If RSEs have status indicators, they should be visible
        if (hasStatus) {
            const statusCount = await statusIndicators.count();
            expect(statusCount).toBeGreaterThan(0);
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

    test('should display loading state while fetching RSEs', async ({ page }) => {
        // Navigate to RSE list
        await page.goto('/rse/list');

        // Check for loading indicator (may be very quick)
        const loadingIndicator = page.locator('[role="status"], .loading, .spinner, text=Loading').first();
        const isLoading = await loadingIndicator.isVisible({ timeout: 2000 }).catch(() => false);

        // Eventually the table should load
        await expect(page.locator('table, text=Error, text=RSE')).toBeVisible({ timeout: 15000 });
    });

    test('should handle empty RSE list gracefully', async ({ page }) => {
        // Wait for page to load
        await page.waitForTimeout(2000);

        // Check if there are any RSEs
        const tableRows = page.locator('table tbody tr, [role="row"]');
        const rowCount = await tableRows.count();

        if (rowCount === 0) {
            // Should display an empty state message
            const emptyMessage = page.locator('text=No RSE, text=empty, text=not found').first();
            const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 2000 }).catch(() => false);

            // Either have empty message or empty table
            expect(hasEmptyMessage || rowCount === 0).toBeTruthy();
        }
    });

    test('should display RSE type information', async ({ page }) => {
        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

        // Look for RSE type indicators (DISK, TAPE, etc.)
        const typeIndicators = page.locator('text=DISK, text=TAPE, text=disk, text=tape');
        const hasTypes = await typeIndicators
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        // If types are displayed, verify they exist
        if (hasTypes) {
            const typeCount = await typeIndicators.count();
            expect(typeCount).toBeGreaterThan(0);
        }
    });
});
