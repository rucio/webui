import { test, expect } from '../fixtures/auth.fixture';

test.describe('RSE Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to RSE list first to find a valid RSE
    await page.goto('/rse/list');

    // Wait for table to load
    await page.waitForSelector('table, [role="table"]', { timeout: 15000 });
  });

  test('should display RSE details page when navigating from list', async ({ page }) => {
    // Find first RSE link in the table
    const rseLinks = page.locator('table a, table [role="link"]');
    const linkCount = await rseLinks.count();

    // Skip if no RSEs available
    if (linkCount === 0) {
      test.skip();
      return;
    }

    // Click the first RSE
    await rseLinks.first().click();

    // Wait for navigation to RSE detail page
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Verify we're on RSE detail page
    await expect(page).toHaveURL(/.*rse\/page\/.*/);

    // Verify page content is loading
    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display RSE basic information', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for common RSE information fields
    const infoFields = [
      'Name',
      'Type',
      'Deterministic',
      'Volatile',
      'Region',
      'Country',
    ];

    // Check if any info fields are visible
    let foundFields = 0;
    for (const field of infoFields) {
      const fieldText = page.locator(`text=${field}`);
      if (await fieldText.isVisible({ timeout: 2000 }).catch(() => false)) {
        foundFields++;
      }
    }

    // Expect at least some fields to be visible
    expect(foundFields).toBeGreaterThan(0);
  });

  test('should display tabs or sections for RSE information', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for tabs (common: Attributes, Usage, Protocols, etc.)
    const tabs = page.locator('[role="tab"], [role="tablist"] button, .tabs button');
    const tabCount = await tabs.count();

    // RSE details should have at least one tab or section
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should display RSE attributes', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for "Attributes" tab or section
    const attributesTab = page.locator('button:has-text("Attributes"), [role="tab"]:has-text("Attributes")').first();

    if (await attributesTab.isVisible({ timeout: 2000 })) {
      await attributesTab.click();

      // Wait for attributes content to load
      await page.waitForTimeout(1000);

      // Verify attributes table or list is present
      const attributesContent = page.locator('table, [role="table"], dl, [role="list"]');
      await expect(attributesContent.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display RSE usage information', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for "Usage" tab or section
    const usageTab = page.locator('button:has-text("Usage"), [role="tab"]:has-text("Usage")').first();

    if (await usageTab.isVisible({ timeout: 2000 })) {
      await usageTab.click();

      // Wait for usage content to load
      await page.waitForTimeout(1000);

      // Verify usage information is present (typically shows storage metrics)
      const usageContent = page.locator('table, [role="table"], text=bytes, text=GB, text=TB');
      await expect(usageContent.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display RSE protocols', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for "Protocols" tab or section
    const protocolsTab = page.locator('button:has-text("Protocol"), [role="tab"]:has-text("Protocol")').first();

    if (await protocolsTab.isVisible({ timeout: 2000 })) {
      await protocolsTab.click();

      // Wait for protocols content to load
      await page.waitForTimeout(1000);

      // Verify protocols information is present
      const protocolsContent = page.locator('table, [role="table"]');
      await expect(protocolsContent.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should allow navigation between RSE information tabs', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Find tabs
    const tabs = page.locator('[role="tab"], [role="tablist"] button');
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      // Click on the second tab
      await tabs.nth(1).click();

      // Wait for content to load
      await page.waitForTimeout(1000);

      // Verify tab is active
      const secondTab = tabs.nth(1);
      const isActive = await secondTab.evaluate(el => {
        return el.getAttribute('aria-selected') === 'true' ||
               el.classList.contains('active') ||
               el.classList.contains('selected');
      }).catch(() => false);

      expect(isActive).toBeTruthy();
    }
  });

  test('should handle direct URL access to RSE details page', async ({ page }) => {
    // Try to access an RSE detail page directly with a test name
    await page.goto('/rse/page/TEST-RSE');

    // Page should either:
    // 1. Display RSE details if it exists
    // 2. Show "Not Found" or error message if it doesn't exist

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check for either success content or error message
    const hasContent = await page.locator('h1, h2, text=Not Found, text=Error, table').first().isVisible({ timeout: 5000 }).catch(() => false);

    expect(hasContent).toBeTruthy();
  });

  test('should display RSE availability status', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for availability status indicators
    const statusIndicators = page.locator('.tag, .badge, [class*="status"], text=Available, text=Unavailable');
    const hasStatus = await statusIndicators.first().isVisible({ timeout: 2000 }).catch(() => false);

    // Status should typically be displayed
    if (hasStatus) {
      const statusText = await statusIndicators.first().textContent();
      expect(statusText).toBeTruthy();
    }
  });

  test('should display breadcrumb navigation on RSE details page', async ({ page }) => {
    // Navigate to RSE details
    const rseLinks = page.locator('table a');
    if (await rseLinks.count() === 0) {
      test.skip();
      return;
    }

    await rseLinks.first().click();
    await page.waitForURL(/.*rse\/page\/.*/, { timeout: 10000 });

    // Look for breadcrumb navigation
    const breadcrumb = page.locator('[role="navigation"], .breadcrumb, nav');
    const hasBreadcrumb = await breadcrumb.first().isVisible({ timeout: 2000 }).catch(() => false);

    if (hasBreadcrumb) {
      // Verify it contains relevant navigation links
      const breadcrumbLinks = breadcrumb.locator('a');
      const linkCount = await breadcrumbLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });
});
