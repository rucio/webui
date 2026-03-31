import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * E2E tests for the Approve Rules page (/rules/approve)
 *
 * Test categories:
 * 1. Permission guard – unauthenticated access redirects away
 * 2. Admin access – page loads, table renders, dialogs open  (requires auth state)
 */

// ── 1. Permission guard (no auth required) ────────────────────────────────────

test.describe('Approve Rules – permission guard', () => {
    test('unauthenticated user is redirected away from /rules/approve', async ({ page }) => {
        // Clear any existing session cookies so we are truly unauthenticated
        await page.context().clearCookies();

        const response = await page.goto('/rules/approve', { waitUntil: 'networkidle' });

        // The server should redirect to the login page (not stay on /rules/approve as a page).
        // The callbackUrl query param may contain "/rules/approve" but the *path* must not be it.
        const finalUrl = new URL(page.url());
        expect(finalUrl.pathname).not.toBe('/rules/approve');

        // Should NOT have rendered a 500 or crash page
        if (response) {
            expect(response.status()).not.toBe(500);
        }
    });

    test('/rules/approve does not return a 500 error', async ({ page }) => {
        const response = await page.goto('/rules/approve');
        if (response) {
            expect(response.status()).not.toBe(500);
        }
    });
});

// ── 2. Admin access (requires saved auth state) ───────────────────────────────

const authFile = path.join(__dirname, '..', '.auth', 'user.json');

test.describe('Approve Rules – admin access', () => {
    test.use({ storageState: authFile });

    test.beforeEach(async ({ page }) => {
        await page.goto('/rules/approve');
    });

    test('page loads without error', async ({ page }) => {
        // Should stay on /rules/approve (not redirected)
        await expect(page).toHaveURL(/.*rules\/approve/, { timeout: 15000 });

        // No console errors relating to the page components
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        // Page heading visible
        await expect(page.locator('h1')).toContainText('Approval Queue', { timeout: 10000 });

        expect(errors.filter(e => e.includes('TypeError') || e.includes('ReferenceError'))).toHaveLength(0);
    });

    test('Approve Rules nav item is visible for admin users', async ({ page }) => {
        // Nav item injected by HeaderClient for admins
        const approveNavItem = page.locator('a[href="/rules/approve"]').first();
        await expect(approveNavItem).toBeVisible({ timeout: 10000 });
    });

    test('table renders with waiting-state rows', async ({ page }) => {
        // AG Grid renders a div with role="grid" or a table inside the viewport
        const grid = page.locator('[role="grid"], .ag-root-wrapper').first();
        await expect(grid).toBeVisible({ timeout: 20000 });

        // Column headers: Approve and Deny should be present
        const approveHeader = page.locator('[role="columnheader"]').filter({ hasText: /^Approve$/ });
        const denyHeader = page.locator('[role="columnheader"]').filter({ hasText: /^Deny$/ });
        await expect(approveHeader).toBeVisible({ timeout: 10000 });
        await expect(denyHeader).toBeVisible({ timeout: 10000 });
    });

    test('clicking Approve button opens ApproveRuleDialog', async ({ page }) => {
        // Wait for at least one Approve button in a row
        const approveBtn = page.locator('button').filter({ hasText: /^Approve$/ }).first();

        // Only run if there are rows with waiting rules
        const hasBtns = await approveBtn.isVisible({ timeout: 10000 }).catch(() => false);
        if (!hasBtns) {
            test.skip();
            return;
        }

        await approveBtn.click();

        // Dialog should appear – look for "Approve Rule" dialog title
        const dialogTitle = page.locator('[role="dialog"]').filter({ hasText: /Approve Rule/ });
        await expect(dialogTitle).toBeVisible({ timeout: 5000 });
    });

    test('clicking Deny button opens DenyRuleDialog', async ({ page }) => {
        // Wait for at least one Deny button in a row
        const denyBtn = page.locator('button').filter({ hasText: /^Deny$/ }).first();

        const hasBtns = await denyBtn.isVisible({ timeout: 10000 }).catch(() => false);
        if (!hasBtns) {
            test.skip();
            return;
        }

        await denyBtn.click();

        // Deny dialog should appear
        const dialogTitle = page.locator('[role="dialog"]').filter({ hasText: /Deny Rule/ });
        await expect(dialogTitle).toBeVisible({ timeout: 5000 });
    });
});
