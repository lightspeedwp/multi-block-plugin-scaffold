---
file_type: "instructions"
description: "Playwright test generation instructions"
applyTo: "**"
license: "GPL-3.0"
version: 1.0
lastUpdated: 2025-12-11
---

# End-to-End Testing Instructions

You are an end-to-end testing guide. Follow our Playwright patterns to design resilient tests for multi-block plugins. Avoid brittle selectors, arbitrary waits, or deviating from the documented test runner configuration.

## Overview

Use this guide when writing or updating Playwright E2E tests. It covers locator strategy, structure, and assertions. It does not cover unit/integration tests or CI configuration beyond Playwright basics.

## General Rules

- Prefer user-facing locators (`getByRole`, `getByLabel`, `getByText`).
- Avoid hard waits; rely on Playwright auto-wait and retries.
- Keep tests deterministic and scoped; reset state between tests.
- Use UK English naming and descriptive `test.describe`/`test` titles.
- Group steps with `test.step` for clarity and reporting.

## Detailed Guidance

## Test Writing Guidelines

### Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.

### Test Structure

- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.

### File Organization

- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.

### Assertion Best Practices

- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.

## Example Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Movie Search Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto("https://debs-obrien.github.io/playwright-movies-app");
  });

  test("Search for a movie by title", async ({ page }) => {
    await test.step("Activate and perform search", async () => {
      await page.getByRole("search").click();
      const searchInput = page.getByRole("textbox", { name: "Search Input" });
      await searchInput.fill("Garfield");
      await searchInput.press("Enter");
    });

    await test.step("Verify search results", async () => {
      // Verify the accessibility tree of the search results
      await expect(page.getByRole("main")).toMatchAriaSnapshot(`
        - main:
          - heading "Garfield" [level=1]
          - heading "search results" [level=2]
          - list "movies":
            - listitem "movie":
              - link "poster of The Garfield Movie The Garfield Movie rating":
                - /url: /playwright-movies-app/movie?id=tt5779228&page=1
                - img "poster of The Garfield Movie"
                - heading "The Garfield Movie" [level=2]
      `);
    });
  });
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyse test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented

## Examples

```ts
import { test, expect } from '@playwright/test';

test.describe( 'Hero block', () => {
    test( 'allows editing heading', async ( { page } ) => {
        await page.goto( '/wp-admin/post-new.php' );
        await page.getByRole( 'button', { name: 'Add block' } ).click();
        await page.getByRole( 'option', { name: 'Hero' } ).click();
        await page.getByRole( 'textbox', { name: 'Heading' } ).fill( 'Explore tours' );
        await expect( page.getByRole( 'heading', { name: 'Explore tours' } ) ).toBeVisible();
    } );
} );
```

Avoid `page.waitForTimeout` and CSS-only selectors unless necessary.

## Validation

- Run `npm run test:e2e` (or the configured Playwright script) locally before PRs.
- Use `npx playwright test --list` to confirm discovery and focus scopes.
- Capture traces/screenshots on failure (`PWDEBUG=1` or `--trace on`) and review.

## References

- [docs/TESTING.md](../../docs/TESTING.md)
- [javascript-react-development.instructions.md](./javascript-react-development.instructions.md)
- [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md)
