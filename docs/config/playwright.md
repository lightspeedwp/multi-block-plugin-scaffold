````markdown
---
title: Playwright Configuration
description: End-to-end testing framework configuration and best practices
category: Configuration
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

Playwright is a modern end-to-end testing framework that enables reliable cross-browser testing. This plugin uses Playwright for E2E tests with WordPress integration.

## Configuration File

Location: `playwright.config.js`

## WordPress Package Used

- `@wordpress/e2e-test-utils-playwright@^1.35.0` - WordPress-specific Playwright utilities

## Configuration

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8888',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run env:start',
    port: 8888,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Key Configuration Options

### Test Directory

- **testDir**: `./tests/e2e`
- Location of all E2E test files
- Playwright finds all `.spec.js` files here

### Execution Settings

#### fullyParallel

- **Value**: `true`
- Runs all tests in parallel for speed
- Tests must be independent

#### forbidOnly

- **Value**: `!!process.env.CI`
- Prevents `.only` tests in CI
- Ensures all tests run in CI

#### retries

- **CI**: `2` retries (handles flaky tests)
- **Local**: `0` retries (faster feedback)

#### workers

- **CI**: `1` worker (sequential, more stable)
- **Local**: `undefined` (uses all CPU cores)

### Test Options

#### baseURL

- **Value**: `http://localhost:8888`
- Base URL for all navigation
- Matches wp-env default port

#### trace

- **Value**: `on-first-retry`
- Records trace on first retry
- Useful for debugging failures

#### screenshot

- **Value**: `only-on-failure`
- Takes screenshot when test fails
- Stored in `test-results/`

### Projects (Browsers)

Tests run on multiple browsers:

1. **Desktop Chrome** (Chromium)
2. **Desktop Firefox**
3. **Desktop Safari** (WebKit)

### Web Server

- **command**: `npm run env:start`
- Starts wp-env before tests
- **port**: `8888`
- **reuseExistingServer**: Reuses server if already running (local only)

## Available Scripts

```bash
# Run E2E tests
npm run test:e2e

# Run accessibility E2E tests
npm run test:e2e:a11y

# Run specific test file
npx playwright test tests/e2e/block.spec.js

# Run in UI mode (interactive)
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# Show report
npx playwright show-report
```

## Writing E2E Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Block Plugin', () => {
  test('block appears in inserter', async ({ page }) => {
    await page.goto('/wp-admin/post-new.php');
    await page.click('[aria-label="Add block"]');
    await page.fill('[placeholder="Search"]', '{{name}}');
    await expect(page.locator('button:has-text("{{name}}")')).toBeVisible();
  });
});
```

### Using WordPress Utilities

```javascript
import { test, expect } from '@playwright/test';
import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';

test.use({
  admin: async ({ page }, use) => {
    await use(new Admin({ page }));
  },
  editor: async ({ page }, use) => {
    await use(new Editor({ page }));
  },
});

test('can insert block', async ({ admin, editor }) => {
  await admin.createNewPost();
  await editor.insertBlock({ name: '{{namespace}}/{{slug}}' });
  await expect(
    editor.canvas.locator('.wp-block-{{namespace}}-{{slug}}')
  ).toBeVisible();
});
```

### Testing Block Functionality

```javascript
test('block saves correctly', async ({ admin, editor, page }) => {
  await admin.createNewPost();
  await editor.insertBlock({ name: '{{namespace}}/{{slug}}' });

  // Add content to block
  await page.keyboard.type('Test content');

  // Publish and view
  await editor.publishPost();
  await page.click('text=View Post');

  // Verify frontend
  await expect(page.locator('.wp-block-{{namespace}}-{{slug}}')).toContainText('Test content');
});
```

### Accessibility Testing

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('block is accessible', async ({ page }) => {
  await page.goto('/sample-post-with-block/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.wp-block-{{namespace}}-{{slug}}')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Debugging

### Interactive Mode

```bash
# UI Mode (recommended)
npx playwright test --ui

# Debug specific test
npx playwright test block.spec.js --debug

# Headed mode (see browser)
npx playwright test --headed
```

### Traces

```bash
# View trace from failed test
npx playwright show-trace test-results/.../trace.zip
```

### Screenshots and Videos

```javascript
// Take screenshot
await page.screenshot({ path: 'screenshot.png' });

// Record video
use: {
  video: 'on',
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run env:start
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Common Issues

### Port Already in Use

**Solution**: Stop existing wp-env instance:

```bash
npm run env:stop
```

### Tests Timing Out

**Solution**: Increase timeouts or check network conditions:

```javascript
test.setTimeout(120000); // 2 minutes
```

### Flaky Tests

**Solution**:

1. Add explicit waits
2. Use `waitForLoadState()`
3. Enable retries in CI

```javascript
await page.waitForLoadState('networkidle');
```

## Resources

- [Playwright Official Documentation](https://playwright.dev/docs/intro)
- [WordPress E2E Test Utils](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

````
