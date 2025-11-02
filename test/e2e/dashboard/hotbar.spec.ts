import { test, expect, Page } from '@playwright/test';
import { login } from '../helpers/auth.helper';
import { primaryTestUser } from '../fixtures/test-users';

/**
 * E2E Tests for HotBar Widget on Dashboard
 *
 * Tests the complete user workflow for managing bookmarks:
 * - Adding bookmarks
 * - Editing bookmarks
 * - Deleting bookmarks
 * - URL type inference
 * - Validation
 * - Navigation
 * - Max cards limit
 * - Local storage persistence
 */

test.describe('HotBar Widget', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before each test
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        // Login and navigate to dashboard
        await login(page, primaryTestUser);
        await expect(page).toHaveURL(/.*dashboard/);

        // Wait for HotBar widget to be visible
        await expect(page.locator('text=HotBar')).toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async ({ page }) => {
        // Clean up: Clear localStorage after each test
        await page.evaluate(() => localStorage.clear());
    });

    test('should display HotBar widget with empty state', async ({ page }) => {
        // Verify HotBar heading is visible
        await expect(page.locator('text=HotBar')).toBeVisible();

        // Verify subtitle
        await expect(page.locator('text=Quick access to your bookmarks')).toBeVisible();

        // Verify empty state message
        await expect(page.locator('text=No bookmarks yet')).toBeVisible();

        // Verify "Add Your First Bookmark" button
        await expect(page.locator('button:has-text("Add Your First Bookmark")')).toBeVisible();

        // Verify card count shows 0/5
        await expect(page.locator('button:has-text("Add Card (0/5)")')).toBeVisible();
    });

    test('should open add dialog when Add Card button is clicked', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Verify dialog is open
        await expect(page.locator('text=Add Bookmark')).toBeVisible();

        // Verify form fields are present
        await expect(page.locator('label:has-text("Title")')).toBeVisible();
        await expect(page.locator('label:has-text("Description")')).toBeVisible();
        await expect(page.locator('label:has-text("URL")')).toBeVisible();

        // Verify action buttons
        await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
        await expect(page.locator('button:has-text("Add Bookmark")')).toBeVisible();
    });

    test('should add a new bookmark successfully', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Fill in form
        await page.locator('label:has-text("Title")').locator('..').locator('input').fill('My DID List');
        await page.locator('label:has-text("Description")').locator('..').locator('textarea').fill('Quick access to DID list');
        await page.locator('label:has-text("URL")').locator('..').locator('input').fill('/did/list');

        // Verify type is auto-detected
        await expect(page.locator('text=DID LIST')).toBeVisible();

        // Submit form
        await page.locator('button:has-text("Add Bookmark")').click();

        // Verify toast notification
        await expect(page.locator('text=Bookmark added')).toBeVisible({ timeout: 5000 });

        // Verify card is displayed
        await expect(page.locator('text=My DID List')).toBeVisible();
        await expect(page.locator('text=Quick access to DID list')).toBeVisible();

        // Verify card count updated
        await expect(page.locator('button:has-text("Add Card (1/5)")')).toBeVisible();
    });

    test('should show validation errors for empty required fields', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Submit form without filling fields
        await page.locator('button:has-text("Add Bookmark")').click();

        // Verify error messages
        await expect(page.locator('text=Title is required')).toBeVisible();
        await expect(page.locator('text=URL is required')).toBeVisible();
    });

    test('should validate same-host URLs', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Fill in form with external URL
        await page.locator('label:has-text("Title")').locator('..').locator('input').fill('External Link');
        await page.locator('label:has-text("URL")').locator('..').locator('input').fill('https://example.com/test');

        // Submit form
        await page.locator('button:has-text("Add Bookmark")').click();

        // Verify error toast
        await expect(page.locator('text=URL must be from the same host')).toBeVisible({ timeout: 5000 });
    });

    test('should infer correct type for different URLs', async ({ page }) => {
        const testCases = [
            { url: '/did/list', expectedType: 'DID LIST' },
            { url: '/did/page/scope:name', expectedType: 'DID' },
            { url: '/rule/list', expectedType: 'RULE LIST' },
            { url: '/rule/page/123', expectedType: 'RULE' },
            { url: '/rse/list', expectedType: 'RSE LIST' },
            { url: '/rse/page/CERN-PROD', expectedType: 'RSE' },
        ];

        for (const testCase of testCases) {
            // Click Add Card button
            await page.locator('button:has-text("Add Card")').first().click();

            // Fill URL
            await page.locator('label:has-text("URL")').locator('..').locator('input').fill(testCase.url);

            // Verify type is auto-detected
            await expect(page.locator(`text=${testCase.expectedType}`)).toBeVisible();

            // Close dialog
            await page.locator('button:has-text("Cancel")').click();
        }
    });

    test('should edit an existing bookmark', async ({ page }) => {
        // First, add a bookmark
        await addBookmark(page, {
            title: 'Original Title',
            description: 'Original Description',
            url: '/did/list',
        });

        // Hover over the card to show edit button
        await page.locator('text=Original Title').hover();

        // Click edit button (pencil icon)
        await page.locator('[aria-label="Edit bookmark"]').click();

        // Verify edit dialog is open
        await expect(page.locator('text=Edit Bookmark')).toBeVisible();

        // Update fields
        await page.locator('label:has-text("Title")').locator('..').locator('input').fill('Updated Title');
        await page.locator('label:has-text("Description")').locator('..').locator('textarea').fill('Updated Description');

        // Submit changes
        await page.locator('button:has-text("Save Changes")').click();

        // Verify toast notification
        await expect(page.locator('text=Bookmark updated')).toBeVisible({ timeout: 5000 });

        // Verify updated content is displayed
        await expect(page.locator('text=Updated Title')).toBeVisible();
        await expect(page.locator('text=Updated Description')).toBeVisible();
    });

    test('should delete a bookmark', async ({ page }) => {
        // First, add a bookmark
        await addBookmark(page, {
            title: 'To Be Deleted',
            description: 'This will be removed',
            url: '/rule/list',
        });

        // Verify bookmark is displayed
        await expect(page.locator('text=To Be Deleted')).toBeVisible();

        // Hover over the card to show delete button
        await page.locator('text=To Be Deleted').hover();

        // Click delete button (trash icon)
        await page.locator('[aria-label="Delete bookmark"]').click();

        // Verify toast notification
        await expect(page.locator('text=Bookmark deleted')).toBeVisible({ timeout: 5000 });

        // Verify bookmark is removed
        await expect(page.locator('text=To Be Deleted')).not.toBeVisible();

        // Verify empty state is shown again
        await expect(page.locator('text=No bookmarks yet')).toBeVisible();
    });

    test('should navigate to bookmarked URL when card is clicked', async ({ page }) => {
        // Add a bookmark
        await addBookmark(page, {
            title: 'DID List Page',
            url: '/did/list',
        });

        // Click the card
        await page.locator('text=DID List Page').click();

        // Verify navigation
        await expect(page).toHaveURL(/.*\/did\/list/);
    });

    test('should enforce maximum 5 bookmarks limit', async ({ page }) => {
        // Add 5 bookmarks
        for (let i = 1; i <= 5; i++) {
            await addBookmark(page, {
                title: `Bookmark ${i}`,
                url: `/test${i}`,
            });
        }

        // Verify count shows 5/5
        await expect(page.locator('button:has-text("Add Card (5/5)")')).toBeVisible();

        // Verify Add button is disabled
        await expect(page.locator('button:has-text("Add Card (5/5)")').first()).toBeDisabled();

        // Try to add another bookmark by clicking disabled button
        // This should show an error toast
        await page.locator('button:has-text("Add Card (5/5)")').first().click({ force: true });

        // Verify error toast
        await expect(page.locator('text=Maximum bookmarks reached, text=Maximum 5 bookmarks allowed')).toBeVisible({
            timeout: 5000,
        });
    });

    test('should persist bookmarks in localStorage after page reload', async ({ page }) => {
        // Add bookmarks
        await addBookmark(page, {
            title: 'Persistent Bookmark 1',
            url: '/did/list',
        });
        await addBookmark(page, {
            title: 'Persistent Bookmark 2',
            url: '/rule/list',
        });

        // Reload the page
        await page.reload();

        // Wait for HotBar to load
        await expect(page.locator('text=HotBar')).toBeVisible({ timeout: 10000 });

        // Verify bookmarks are still displayed
        await expect(page.locator('text=Persistent Bookmark 1')).toBeVisible();
        await expect(page.locator('text=Persistent Bookmark 2')).toBeVisible();

        // Verify count
        await expect(page.locator('button:has-text("Add Card (2/5)")')).toBeVisible();
    });

    test('should display bookmarks in responsive grid', async ({ page }) => {
        // Add multiple bookmarks
        for (let i = 1; i <= 3; i++) {
            await addBookmark(page, {
                title: `Bookmark ${i}`,
                url: `/test${i}`,
            });
        }

        // Get the grid container
        const grid = page.locator('.grid').first();
        await expect(grid).toBeVisible();

        // Verify grid has correct classes for responsive layout
        await expect(grid).toHaveClass(/grid-cols-1/);
        await expect(grid).toHaveClass(/md:grid-cols-2/);
        await expect(grid).toHaveClass(/lg:grid-cols-3/);
    });

    test('should show timestamps on bookmarks', async ({ page }) => {
        // Add a bookmark
        await addBookmark(page, {
            title: 'Timestamped Bookmark',
            url: '/did/list',
        });

        // Verify created timestamp is displayed
        await expect(page.locator('text=Created:')).toBeVisible();

        // Edit the bookmark
        await page.locator('text=Timestamped Bookmark').hover();
        await page.locator('[aria-label="Edit bookmark"]').click();
        await page.locator('label:has-text("Title")').locator('..').locator('input').fill('Updated Bookmark');
        await page.locator('button:has-text("Save Changes")').click();

        // Wait for update toast
        await expect(page.locator('text=Bookmark updated')).toBeVisible({ timeout: 5000 });

        // Verify updated timestamp appears
        await expect(page.locator('text=Updated:')).toBeVisible();
    });

    test('should cancel add operation when Cancel button is clicked', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Fill in some data
        await page.locator('label:has-text("Title")').locator('..').locator('input').fill('Will Be Cancelled');

        // Click Cancel
        await page.locator('button:has-text("Cancel")').click();

        // Verify dialog is closed
        await expect(page.locator('text=Add Bookmark')).not.toBeVisible();

        // Verify no bookmark was added
        await expect(page.locator('text=Will Be Cancelled')).not.toBeVisible();
        await expect(page.locator('text=No bookmarks yet')).toBeVisible();
    });

    test('should close dialog when close button (X) is clicked', async ({ page }) => {
        // Click Add Card button
        await page.locator('button:has-text("Add Card")').first().click();

        // Click close button (X icon)
        await page.locator('[aria-label="Close"]').click();

        // Verify dialog is closed
        await expect(page.locator('text=Add Bookmark')).not.toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
        // Add a bookmark
        await addBookmark(page, {
            title: 'Keyboard Test',
            url: '/did/list',
        });

        // Focus on the card using Tab key
        await page.keyboard.press('Tab');

        // Get the focused element
        const focusedElement = await page.locator(':focus');

        // Press Enter to navigate
        await page.keyboard.press('Enter');

        // Verify navigation occurred
        await expect(page).toHaveURL(/.*\/did\/list/);
    });
});

/**
 * Helper function to add a bookmark through the UI
 */
async function addBookmark(page: Page, data: { title: string; description?: string; url: string }): Promise<void> {
    // Click Add Card button
    await page.locator('button:has-text("Add Card")').first().click();

    // Wait for dialog
    await expect(page.locator('text=Add Bookmark')).toBeVisible();

    // Fill in form
    await page.locator('label:has-text("Title")').locator('..').locator('input').fill(data.title);

    if (data.description) {
        await page.locator('label:has-text("Description")').locator('..').locator('textarea').fill(data.description);
    }

    await page.locator('label:has-text("URL")').locator('..').locator('input').fill(data.url);

    // Submit
    await page.locator('button:has-text("Add Bookmark")').click();

    // Wait for success toast
    await expect(page.locator('text=Bookmark added')).toBeVisible({ timeout: 5000 });

    // Wait for dialog to close
    await expect(page.locator('text=Add Bookmark')).not.toBeVisible();
}
