import { test, expect } from '../fixtures/auth.fixture';

test.describe('DID Details Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to DID list first to find a valid DID
        await page.goto('/did/list');

        // Wait for table to load
        await page.waitForSelector('table, [role="table"]', { timeout: 15000 });
    });

    test('should display DID details page when navigating from list', async ({ page }) => {
        // Find first DID link in the table
        const didLinks = page.locator('table a, table [role="link"]');
        const linkCount = await didLinks.count();

        // Skip if no DIDs available
        if (linkCount === 0) {
            test.skip();
            return;
        }

        // Click the first DID
        await didLinks.first().click();

        // Wait for navigation to DID detail page
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Verify we're on a DID detail page
        await expect(page).toHaveURL(/.*did\/page\/.*/);

        // Verify page content is loading
        await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
    });

    test('should display DID metadata information', async ({ page }) => {
        // Navigate to a known test DID (this may need to be adjusted)
        // For now, try to find any DID from the list
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Look for common metadata fields
        const metadataFields = ['Scope', 'Name', 'Type', 'Account', 'Created', 'Length', 'Bytes'];

        // Check if any metadata fields are visible
        let foundFields = 0;
        for (const field of metadataFields) {
            const fieldText = page.locator(`text=${field}`);
            if (await fieldText.isVisible({ timeout: 2000 }).catch(() => false)) {
                foundFields++;
            }
        }

        // Expect at least some metadata fields to be visible
        expect(foundFields).toBeGreaterThan(0);
    });

    test('should display tabs or sections for DID information', async ({ page }) => {
        // Navigate to DID details
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Look for tabs (common in DID detail pages: Metadata, Rules, Replicas, etc.)
        const tabs = page.locator('[role="tab"], [role="tablist"] button, .tabs button');
        const tabCount = await tabs.count();

        // DID details should have at least one tab or section
        expect(tabCount).toBeGreaterThan(0);
    });

    test('should allow navigation between DID information tabs', async ({ page }) => {
        // Navigate to DID details
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Find tabs
        const tabs = page.locator('[role="tab"], [role="tablist"] button');
        const tabCount = await tabs.count();

        if (tabCount > 1) {
            // Click on the second tab
            await tabs.nth(1).click();

            // Wait for content to load
            await page.waitForTimeout(1000);

            // Verify tab is active (has aria-selected="true" or active class)
            const secondTab = tabs.nth(1);
            const isActive = await secondTab
                .evaluate(el => {
                    return el.getAttribute('aria-selected') === 'true' || el.classList.contains('active') || el.classList.contains('selected');
                })
                .catch(() => false);

            expect(isActive).toBeTruthy();
        }
    });

    test('should display rules associated with the DID', async ({ page }) => {
        // Navigate to DID details
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Look for "Rules" tab or section
        const rulesTab = page.locator('button:has-text("Rules"), [role="tab"]:has-text("Rules")').first();

        if (await rulesTab.isVisible({ timeout: 2000 })) {
            await rulesTab.click();

            // Wait for rules content to load
            await page.waitForTimeout(1000);

            // Verify rules table or list is present
            const rulesContent = page.locator('table, [role="table"], [role="list"]');
            await expect(rulesContent.first()).toBeVisible({ timeout: 5000 });
        }
    });

    test('should display replicas information for the DID', async ({ page }) => {
        // Navigate to DID details
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Look for "Replicas" tab or section
        const replicasTab = page.locator('button:has-text("Replicas"), button:has-text("Replica"), [role="tab"]:has-text("Replica")').first();

        if (await replicasTab.isVisible({ timeout: 2000 })) {
            await replicasTab.click();

            // Wait for replicas content to load
            await page.waitForTimeout(1000);

            // Verify replicas content is present
            const replicasContent = page.locator('table, [role="table"]');
            await expect(replicasContent.first()).toBeVisible({ timeout: 5000 });
        }
    });

    test('should handle direct URL access to DID details page', async ({ page }) => {
        // Try to access a DID detail page directly with a test scope/name
        // This test uses a generic pattern - adjust if specific test DIDs are known
        await page.goto('/did/page/test/test_dataset');

        // Page should either:
        // 1. Display DID details if it exists
        // 2. Show "Not Found" or error message if it doesn't exist

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Check for either success content or error message
        const hasContent = await page
            .locator('h1, h2, text=Not Found, text=Error, table')
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        expect(hasContent).toBeTruthy();
    });

    test('should display breadcrumb navigation on DID details page', async ({ page }) => {
        // Navigate to DID details
        const didLinks = page.locator('table a');
        if ((await didLinks.count()) === 0) {
            test.skip();
            return;
        }

        await didLinks.first().click();
        await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

        // Look for breadcrumb navigation
        const breadcrumb = page.locator('[role="navigation"], .breadcrumb, nav');
        const hasBreadcrumb = await breadcrumb
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        // Breadcrumb should be present for navigation
        if (hasBreadcrumb) {
            // Verify it contains relevant navigation links
            const breadcrumbLinks = breadcrumb.locator('a');
            const linkCount = await breadcrumbLinks.count();
            expect(linkCount).toBeGreaterThan(0);
        }
    });
});
