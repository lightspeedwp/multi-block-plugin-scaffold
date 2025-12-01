---
title: End-to-End Tests
description: Browser-based integration tests using Playwright
category: Testing
date: 2025-12-01
---

# End-to-End Tests

Browser-based integration tests using Playwright for full user workflows.

## Overview

E2E tests validate complete user workflows in a real browser environment, testing the interaction between frontend, backend, database, and WordPress core.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test
npm run test:e2e -- --grep "block renders"

# Debug mode
npm run test:e2e:debug
```

## Test Coverage

- ✅ Block editor integration
- ✅ Block rendering (frontend)
- ✅ Custom post type creation
- ✅ Taxonomy assignment
- ✅ SCF field group functionality
- ✅ Options page interaction
- ✅ User workflows

## Writing E2E Tests

```javascript
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'My Block', () => {
    test( 'inserts and renders', async ( { admin, editor } ) => {
        await admin.createNewPost();
        await editor.insertBlock( { name: 'my-plugin/my-block' } );

        const block = editor.canvas.getByRole( 'document', {
            name: /My Block/,
        } );

        await expect( block ).toBeVisible();
    } );
} );
```

## Best Practices

1. **User perspective** - Test as a user would interact
2. **Stable selectors** - Use data attributes, not classes
3. **Wait for elements** - Use Playwright's auto-waiting
4. **Independent tests** - Each test should be isolated
5. **Clean up** - Delete test data after tests

## References

- [Playwright Documentation](https://playwright.dev/)
- [@wordpress/e2e-test-utils-playwright](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/)
