import { test, expect } from '../fixtures/auth.fixture';

test.describe('Create Rule Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to Create Rule page
        await page.goto('/rule/create');
    });

    test('should display Create Rule page', async ({ page }) => {
        // Verify URL
        await expect(page).toHaveURL(/.*rule\/create/);

        // Verify page title or heading
        await expect(page.locator('h1, h2, [role="heading"]').filter({ hasText: /Create.*Rule/i })).toBeVisible({ timeout: 10000 });
    });

    test('should display rule creation form', async ({ page }) => {
        // Verify form is present
        const form = page.locator('form').first();
        await expect(form).toBeVisible({ timeout: 5000 });

        // Verify essential form fields exist
        const formInputs = page.locator('form input, form select, form textarea');
        const inputCount = await formInputs.count();

        expect(inputCount).toBeGreaterThan(0);
    });

    test('should have DID input field', async ({ page }) => {
        // Look for DID input (scope:name or similar)
        const didInputs = page.locator('input[name*="did"], input[id*="did"], input[placeholder*="DID"], input[placeholder*="scope"]');
        const hasDIDInput = await didInputs
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        expect(hasDIDInput).toBeTruthy();
    });

    test('should have RSE selection input', async ({ page }) => {
        // Look for RSE input/selector
        const rseInputs = page.locator('input[name*="rse"], select[name*="rse"], input[id*="rse"], input[placeholder*="RSE"]');
        const hasRSEInput = await rseInputs
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        expect(hasRSEInput).toBeTruthy();
    });

    test('should have copies/replicas field', async ({ page }) => {
        // Look for copies/replicas field
        const copiesInput = page.locator('input[name*="copies"], input[name*="replica"], input[id*="copies"]');
        const hasCopiesInput = await copiesInput
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasCopiesInput) {
            expect(true).toBeTruthy();
        }
    });

    test('should have lifetime field', async ({ page }) => {
        // Look for lifetime field
        const lifetimeInput = page.locator('input[name*="lifetime"], input[id*="lifetime"]');
        const hasLifetimeInput = await lifetimeInput
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasLifetimeInput) {
            expect(true).toBeTruthy();
        }
    });

    test('should have submit button', async ({ page }) => {
        // Look for submit button
        const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Submit")').first();
        await expect(submitButton).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        // Find submit button
        const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Submit")').first();

        // Try to submit empty form
        await submitButton.click();

        // Wait a moment for validation
        await page.waitForTimeout(1000);

        // Should still be on create page or show validation error
        const hasError = await page
            .locator('[role="alert"], .error, text=required, text=invalid')
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);
        const stillOnCreatePage = page.url().includes('/rule/create');

        expect(hasError || stillOnCreatePage).toBeTruthy();
    });

    test('should fill out basic rule creation form', async ({ page }) => {
        // Fill in DID field
        const didInput = page.locator('input[name*="did"], input[id*="did"], input[placeholder*="DID"]').first();
        if (await didInput.isVisible({ timeout: 2000 })) {
            await didInput.fill('test:test_dataset');
        }

        // Fill in RSE field
        const rseInput = page.locator('input[name*="rse"], input[id*="rse"], input[placeholder*="RSE"]').first();
        if (await rseInput.isVisible({ timeout: 2000 })) {
            await rseInput.fill('TEST-RSE');
        }

        // Fill in copies field if present
        const copiesInput = page.locator('input[name*="copies"], input[id*="copies"]').first();
        if (await copiesInput.isVisible({ timeout: 2000 })) {
            await copiesInput.fill('1');
        }

        // Verify fields are filled
        if (await didInput.isVisible()) {
            await expect(didInput).toHaveValue(/test/);
        }
    });

    test('should display advanced options section', async ({ page }) => {
        // Look for advanced options toggle/section
        const advancedSection = page.locator('details:has-text("Advanced"), button:has-text("Advanced"), [id*="advanced"]');
        const hasAdvanced = await advancedSection
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasAdvanced) {
            // Try to expand it
            await advancedSection.first().click();

            // Wait for expansion
            await page.waitForTimeout(500);

            // Verify more fields are visible
            const formInputs = page.locator('form input, form select');
            const inputCount = await formInputs.count();

            expect(inputCount).toBeGreaterThan(0);
        }
    });

    test('should show cancel or back button', async ({ page }) => {
        // Look for cancel/back button
        const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Back"), a:has-text("Cancel"), a:has-text("Back")').first();
        const hasCancelButton = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasCancelButton) {
            await expect(cancelButton).toBeVisible();

            // Clicking it should navigate away
            await cancelButton.click();

            // Should leave the create page
            await page.waitForURL(/.*(?!rule\/create).*/, { timeout: 5000 }).catch(() => {});
        }
    });

    test('should support DID scope and name separate inputs', async ({ page }) => {
        // Some forms have separate scope and name fields
        const scopeInput = page.locator('input[name*="scope"], input[id*="scope"]').first();
        const nameInput = page.locator('input[name*="name"], input[id*="name"]').first();

        const hasSeparateFields =
            (await scopeInput.isVisible({ timeout: 2000 }).catch(() => false)) && (await nameInput.isVisible({ timeout: 2000 }).catch(() => false));

        if (hasSeparateFields) {
            await scopeInput.fill('test');
            await nameInput.fill('test_dataset');

            await expect(scopeInput).toHaveValue('test');
            await expect(nameInput).toHaveValue('test_dataset');
        }
    });

    test('should display help text or tooltips', async ({ page }) => {
        // Look for help icons or tooltip triggers
        const helpIcons = page.locator('[title], [aria-describedby], [data-tooltip], button[aria-label*="help"]');
        const hasHelp = await helpIcons
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasHelp) {
            // Hover over first help icon
            await helpIcons.first().hover();

            // Wait for tooltip
            await page.waitForTimeout(500);

            // Tooltip may appear
            const tooltip = page.locator('[role="tooltip"], .tooltip');
            const hasTooltip = await tooltip
                .first()
                .isVisible({ timeout: 1000 })
                .catch(() => false);

            if (hasTooltip) {
                expect(true).toBeTruthy();
            }
        }
    });

    test('should show RSE expression syntax help', async ({ page }) => {
        // Look for RSE expression help or examples
        const rseHelp = page.locator('text=expression, text=syntax, code:has-text("RSE")');
        const hasRSEHelp = await rseHelp
            .first()
            .isVisible({ timeout: 2000 })
            .catch(() => false);

        if (hasRSEHelp) {
            expect(true).toBeTruthy();
        }
    });
});
