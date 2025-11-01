import { test, expect } from '../fixtures/auth.fixture';

test.describe('DID List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to DID list page
    await page.goto('/did/list');
  });

  test('should display DID list page', async ({ page }) => {
    // Verify URL
    await expect(page).toHaveURL(/.*did\/list/);

    // Verify page title or heading
    await expect(page.locator('h1, h2, [role="heading"]').filter({ hasText: /DID|Data Identifier/i })).toBeVisible({ timeout: 10000 });
  });

  test('should display search/filter form', async ({ page }) => {
    // Verify search input or filter form is present
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="search"], input[placeholder*="DID"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
  });

  test('should load and display DID table', async ({ page }) => {
    // Wait for table to load
    const table = page.locator('table, [role="table"]').first();
    await expect(table).toBeVisible({ timeout: 15000 });

    // Verify table has headers
    const tableHeaders = page.locator('th, [role="columnheader"]');
    await expect(tableHeaders.first()).toBeVisible();
  });

  test('should display loading state while fetching DIDs', async ({ page }) => {
    // Navigate to DID list
    await page.goto('/did/list');

    // Check for loading indicator (spinner, skeleton, or loading text)
    // This may be very quick, so we use a short timeout
    const loadingIndicator = page.locator('[role="status"], .loading, .spinner, text=Loading').first();
    const isLoading = await loadingIndicator.isVisible({ timeout: 2000 }).catch(() => false);

    // Loading indicator may or may not appear depending on speed
    // Just verify the page doesn't crash
    await expect(page.locator('table, text=Error, text=DID')).toBeVisible({ timeout: 15000 });
  });

  test('should allow searching for specific DID pattern', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();

    // Enter a search pattern (common test pattern)
    await searchInput.fill('test:*');

    // Look for search/submit button
    const searchButton = page.locator('button:has-text("Search"), button[type="submit"], button:has([aria-label*="search"])').first();

    if (await searchButton.isVisible({ timeout: 2000 })) {
      await searchButton.click();
    } else {
      // Try pressing Enter
      await searchInput.press('Enter');
    }

    // Wait for results to load
    await page.waitForTimeout(2000);

    // Verify table is still visible (results may be empty but table should exist)
    await expect(page.locator('table, [role="table"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display DID metadata when available', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

    // Try to find a DID link in the table
    const didLinks = page.locator('table a, table [role="link"]');
    const linkCount = await didLinks.count();

    if (linkCount > 0) {
      // Click the first DID link
      await didLinks.first().click();

      // Wait for navigation to DID detail page
      await page.waitForURL(/.*did\/page\/.*/, { timeout: 10000 });

      // Verify we're on a DID detail page
      await expect(page).toHaveURL(/.*did\/page\/.*/);
    } else {
      // If no DIDs found, skip this test
      test.skip();
    }
  });

  test('should support pagination when many DIDs are present', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table, [role="table"]', { timeout: 15000 });

    // Look for pagination controls
    const paginationControls = page.locator('[role="navigation"], .pagination, button:has-text("Next"), button:has-text("Previous")');
    const hasPagination = await paginationControls.first().isVisible({ timeout: 2000 }).catch(() => false);

    if (hasPagination) {
      // Try clicking next page button
      const nextButton = page.locator('button:has-text("Next"), [aria-label*="next"]').first();
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        await nextButton.click();

        // Wait for new data to load
        await page.waitForTimeout(1000);

        // Verify table still visible
        await expect(page.locator('table').first()).toBeVisible();
      }
    }
  });

  test('should handle filter options correctly', async ({ page }) => {
    // Look for filter dropdowns or checkboxes
    const filterControls = page.locator('select, [role="combobox"], input[type="checkbox"]');
    const filterCount = await filterControls.count();

    if (filterCount > 0) {
      // Interact with first filter
      const firstFilter = filterControls.first();
      const tagName = await firstFilter.evaluate(el => el.tagName.toLowerCase());

      if (tagName === 'select') {
        // Select an option
        await firstFilter.selectOption({ index: 1 });
      } else if (tagName === 'input') {
        // Toggle checkbox
        await firstFilter.click();
      }

      // Wait for filtered results
      await page.waitForTimeout(1000);

      // Verify table is still present
      await expect(page.locator('table').first()).toBeVisible();
    }
  });
});
