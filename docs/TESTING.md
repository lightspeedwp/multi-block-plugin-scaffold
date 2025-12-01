# Testing Guide

Complete guide to running and writing tests for the {{name}} block plugin scaffold.

## Overview

This theme includes comprehensive testing coverage:

- **JavaScript Unit Tests** (Jest) - Test individual JavaScript components and functions
- **PHP Unit Tests** (PHPUnit) - Test PHP functions and WordPress functionality
- **End-to-End Tests** (Playwright) - Test complete user workflows in a real browser

## Test Structure

```
block-theme-scaffold/
├── tests/
│   ├── js/              # JavaScript unit tests
│   ├── php/             # PHP unit tests
│   └── e2e/             # End-to-end tests
├── .jest.config.cjs     # Jest configuration
├── .playwright.config.cjs  # Playwright configuration
└── phpunit.xml          # PHPUnit configuration
```

## Running Tests

### All Tests

```bash
npm run test
```

### JavaScript Tests (Jest)

```bash
# Run once
npm run test:js

# Watch mode (re-run on file changes)
npm run test:js:watch

# With coverage report
npm run test:js -- --coverage
```

### PHP Tests (PHPUnit)

```bash
# Run all PHP tests
npm run test:php

# Run specific test file
npm run test:php -- tests/php/test-theme-setup.php

# With coverage
npm run test:php -- --coverage-html coverage/
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- tests/e2e/homepage.spec.js

# Debug mode
npm run test:e2e -- --debug
```

## Writing Tests

### JavaScript Test Examples

#### Component Test

```javascript
// tests/js/components/Header.test.js
import { render, screen } from '@testing-library/react';
import Header from '../../../src/js/components/Header';

describe( 'Header Component', () => {
 it( 'renders site title', () => {
  render( <Header title="Test Site" /> );
  expect( screen.getByText( 'Test Site' ) ).toBeInTheDocument();
 } );

 it( 'shows navigation menu', () => {
  render( <Header /> );
  expect( screen.getByRole( 'navigation' ) ).toBeInTheDocument();
 } );
} );
```

#### Utility Function Test

```javascript
// tests/js/utils/helpers.test.js
import { formatDate, sanitizeHTML } from '../../../src/js/utils/helpers';

describe( 'Helper Functions', () => {
 describe( 'formatDate', () => {
  it( 'formats date correctly', () => {
   const date = new Date( '2025-12-01' );
   expect( formatDate( date ) ).toBe( 'December 1, 2025' );
  } );
 } );

 describe( 'sanitizeHTML', () => {
  it( 'removes script tags', () => {
   const dirty = '<p>Hello</p><script>alert("xss")</script>';
   expect( sanitizeHTML( dirty ) ).toBe( '<p>Hello</p>' );
  } );
 } );
} );
```

### PHP Test Examples

#### Function Test

```php
<?php
// tests/php/test-theme-functions.php
class ThemeFunctionsTest extends WP_UnitTestCase {
 public function test_theme_setup() {
  // Test theme support
  $this->assertTrue( current_theme_supports( 'post-thumbnails' ) );
  $this->assertTrue( current_theme_supports( 'editor-styles' ) );
 }

 public function test_enqueue_scripts() {
  // Test script enqueuing
  do_action( 'wp_enqueue_scripts' );
  $this->assertTrue( wp_script_is( '{{textdomain}}-script', 'enqueued' ) );
 }
}
```

#### Template Test

```php
<?php
// tests/php/test-template-functions.php
class TemplateTest extends WP_UnitTestCase {
 public function test_custom_template_part() {
  $output = {{textdomain}}_get_custom_template_part( 'header' );
  $this->assertStringContainsString( 'site-header', $output );
 }
}
```

### E2E Test Examples

#### Page Test

```javascript
// tests/e2e/homepage.spec.js
import { test, expect } from '@playwright/test';

test.describe( 'Homepage', () => {
 test( 'loads successfully', async ( { page } ) => {
  await page.goto( '/' );
  await expect( page ).toHaveTitle( /{{name}}/ );
 } );

 test( 'displays header', async ( { page } ) => {
  await page.goto( '/' );
  const header = page.locator( '.site-header' );
  await expect( header ).toBeVisible();
 } );

 test( 'navigation works', async ( { page } ) => {
  await page.goto( '/' );
  await page.click( 'nav a:first-child' );
  await expect( page ).toHaveURL( /\/.+/ );
 } );
} );
```

#### User Interaction Test

```javascript
// tests/e2e/search.spec.js
import { test, expect } from '@playwright/test';

test.describe( 'Search Functionality', () => {
 test( 'search form works', async ( { page } ) => {
  await page.goto( '/' );

  // Type in search
  await page.fill( 'input[type="search"]', 'test query' );
  await page.click( 'button[type="submit"]' );

  // Verify results page
  await expect( page ).toHaveURL( /\?s=test\+query/ );
  await expect( page.locator( '.search-results' ) ).toBeVisible();
 } );
} );
```

## Test Coverage

### Viewing Coverage Reports

#### JavaScript Coverage

```bash
npm run test:js -- --coverage
```

Report saved to: `coverage/js/`

#### PHP Coverage

```bash
npm run test:php -- --coverage-html coverage/php/
```

Report saved to: `coverage/php/index.html`

### Coverage Goals

- **JavaScript**: Aim for >80% coverage
- **PHP**: Aim for >80% coverage
- **Critical paths**: 100% coverage for security-related code

## Continuous Integration

Tests run automatically on GitHub Actions for:

- Every pull request
- Every push to `develop` and `main` branches
- Nightly builds

See [WORKFLOWS.md](./WORKFLOWS.md) for CI/CD documentation.

## Best Practices

### 1. Test Organization

- Group related tests with `describe()` blocks
- Use clear, descriptive test names
- One assertion per test when possible

### 2. Test Independence

```javascript
// ✅ Good - each test is independent
describe( 'Counter', () => {
 it( 'starts at zero', () => {
  const counter = new Counter();
  expect( counter.value ).toBe( 0 );
 } );

 it( 'increments correctly', () => {
  const counter = new Counter();
  counter.increment();
  expect( counter.value ).toBe( 1 );
 } );
} );

// ❌ Bad - tests depend on each other
describe( 'Counter', () => {
 const counter = new Counter();

 it( 'starts at zero', () => {
  expect( counter.value ).toBe( 0 );
 } );

 it( 'increments correctly', () => {
  counter.increment(); // Depends on previous test
  expect( counter.value ).toBe( 1 );
 } );
} );
```

### 3. Mock External Dependencies

```javascript
// Mock WordPress API
jest.mock( '@wordpress/api-fetch' );
import apiFetch from '@wordpress/api-fetch';

test( 'fetches posts', async () => {
 apiFetch.mockResolvedValue( [ { id: 1, title: 'Test Post' } ] );
 const posts = await getPosts();
 expect( posts ).toHaveLength( 1 );
} );
```

### 4. Test User Behavior, Not Implementation

```javascript
// ✅ Good - tests what user sees
it( 'shows error message', () => {
 render( <LoginForm /> );
 fireEvent.click( screen.getByText( 'Login' ) );
 expect( screen.getByText( /invalid credentials/i ) ).toBeVisible();
} );

// ❌ Bad - tests implementation details
it( 'sets error state', () => {
 const { result } = renderHook( () => useLogin() );
 result.current.login( 'bad', 'credentials' );
 expect( result.current.error ).toBe( true );
} );
```

## Troubleshooting

### Tests Not Running

**Problem**: `Cannot find module 'jest'`

**Solution**:

```bash
npm install
```

### WordPress Tests Not Working

**Problem**: `Class 'WP_UnitTestCase' not found`

**Solution**: Install WordPress test suite:

```bash
bin/install-wp-tests.sh wordpress_test root '' localhost latest
```

### Playwright Tests Failing

**Problem**: `browserType.launch: Executable doesn't exist`

**Solution**: Install browsers:

```bash
npx playwright install
```

### Slow Tests

**Problem**: E2E tests take too long

**Solutions**:

1. Run tests in parallel: `npm run test:e2e -- --workers=4`
2. Run only changed tests: `npm run test:js -- --onlyChanged`
3. Use watch mode during development: `npm run test:js:watch`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [PHPUnit Documentation](https://phpunit.de/)
- [WordPress Testing Handbook](https://make.wordpress.org/core/handbook/testing/)
- [React Testing Library](https://testing-library.com/react)

## Summary

✅ **Three testing levels** - Unit, integration, and E2E
✅ **Automated CI/CD** - Tests run on every commit
✅ **High coverage** - Aim for >80% coverage
✅ **Best practices** - Independent, descriptive, behavior-focused tests

For CI/CD workflows, see [WORKFLOWS.md](./WORKFLOWS.md).
For development setup, see [BUILD-PROCESS.md](./BUILD-PROCESS.md).
