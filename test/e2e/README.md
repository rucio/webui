# Playwright E2E Tests

End-to-End tests for Rucio WebUI using Playwright.

## Quick Start

1. **Configure test environment**:
   ```bash
   # Edit .env.e2e with your test server and credentials
   vim .env.e2e
   ```

2. **Install Playwright browsers** (if not already done):
   ```bash
   npx playwright install chromium
   ```

3. **Run tests**:
   ```bash
   npm run test:e2e
   ```

## Available Commands

```bash
npm run test:e2e          # Run all tests (headless)
npm run test:e2e:ui       # Run with UI mode (interactive)
npm run test:e2e:headed   # Run with visible browser
npm run test:e2e:debug    # Run with debugger
npm run test:e2e:report   # Show test report
```

## Test Coverage

### ✅ Authentication (auth/)
- UserPass login with valid credentials
- Login with invalid credentials (error handling)
- Logout functionality
- Session persistence

### ✅ DIDs (did/)
- List DIDs with filters and pagination
- View DID details and metadata
- Navigate between DID information tabs

### ✅ RSEs (rse/)
- List RSEs with status indicators
- View RSE details, attributes, and usage
- Navigate between RSE information sections

### ✅ Rules (rule/)
- List rules with filtering and status
- Create new rules with form validation
- View rule details

## Configuration

Tests are configured in `playwright.config.ts`:
- **Browser**: Chromium only (fast, single browser)
- **Target**: Real Rucio server (as per .env.e2e)
- **Auth**: UserPass authentication
- **Workers**: Parallel execution enabled
- **Retries**: 2 retries in CI, 0 locally

## Test Structure

```
test/e2e/
├── fixtures/           # Test fixtures and helpers
│   ├── auth.fixture.ts   # Authenticated page fixture
│   └── test-users.ts     # Test user credentials
├── helpers/            # Helper functions
│   └── auth.helper.ts    # Login/logout utilities
├── auth/              # Authentication tests
├── did/               # DID feature tests
├── rse/               # RSE feature tests
└── rule/              # Rule feature tests
```

## Writing New Tests

### For authenticated pages (most features):

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test('should do something', async ({ page }) => {
  // Page is already authenticated!
  await page.goto('/your-page');
  await expect(page.locator('selector')).toBeVisible();
});
```

### For login/auth-specific tests:

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth.helper';
import { primaryTestUser } from '../fixtures/test-users';

test('should login', async ({ page }) => {
  await login(page, primaryTestUser);
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Documentation

For comprehensive documentation, see:
- [E2E Testing Guide](../../docs/testing/e2e-testing.md) - Complete guide
- [Playwright Docs](https://playwright.dev/) - Official documentation

## Troubleshooting

### Tests timeout
- Increase timeout: `test.setTimeout(60000)`
- Check selectors are correct
- Verify application is running

### Authentication fails
- Check credentials in `.env.e2e`
- Delete auth cache: `rm -rf .auth/`
- Verify Rucio server is accessible

### Browser not found
- Run: `npx playwright install chromium`
- Check system dependencies: `npx playwright install-deps` (Linux)

## Next Steps

1. ✅ Configure `.env.e2e` with your test server
2. ✅ Run tests: `npm run test:e2e:ui` (interactive mode)
3. ✅ Add new tests for your features
4. ✅ Set up CI integration (see docs)

---

**Need help?** Check the [E2E Testing Guide](../../docs/testing/e2e-testing.md)
