---
title: Testing Guide
description: Complete guide to running and writing tests for block plugins
category: Testing
type: Guide
audience: Developers
date: 2025-12-07
---

Complete guide to running and writing tests for the {{name}} block plugin scaffold.

## Overview

This scaffold includes comprehensive testing coverage with integrated logging:

- **JavaScript Unit Tests** (Jest) - Test individual JavaScript components and functions
- **PHP Unit Tests** (PHPUnit) - Test PHP functions and WordPress functionality
- **End-to-End Tests** (Playwright) - Test complete user workflows in a real browser
- **Dry Run Testing** - Test scaffold templates with mustache variable substitution
- **SCF Field Validation** - Validate field group JSON schemas

All tests automatically log to `logs/` directory. See [LOGGING.md](./LOGGING.md) for details.

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

## SCF Field Group Validation Testing

### Overview

The SCF (Secure Custom Fields) Local JSON feature stores field group configurations as JSON files in version control. Comprehensive validation testing ensures these field groups meet schema requirements before they're loaded into WordPress.

### Schema Validation

All SCF field groups must conform to the JSON Schema defined in:

```plaintext
scf-json/schema/scf-field-group.schema.json
```

**Key Validation Rules:**

- Field Group Key: Must start with `group_` and contain only lowercase alphanumeric characters and underscores
- Title: Required string field
- Fields Array: Must contain at least one field definition
- Location Rules: Must define where the field group displays in WordPress
- Field Keys: Non-layout fields must start with `field_` (layout fields: tab, accordion, message are exempted)

### Running SCF Validation Tests

```bash
# Run all SCF tests
npm run test -- tests/php/test-scf-json*.php

# Run specific SCF test file
npm run test:php -- tests/php/test-scf-json-schema-validation.php

# Run with coverage
npm run test -- tests/php/test-scf-json*.php --coverage-html coverage/php/
```

### Test Files

**Schema Validation Tests** — `test-scf-json-schema-validation.php`

- Validates JSON schema structure
- Checks required properties (key, title, fields, location)
- Validates field type enumerations (40+ field types)
- Tests location rule parameters
- Verifies container field structure (group, repeater, flexible_content)

**Save/Load Integration Tests** — `test-scf-json-save-load.php`

- Tests directory creation and file operations
- Validates JSON encoding/decoding round-trips
- Tests ACF filter integration
- Verifies special character handling

**Meta Setup/Reset Tests** — `test-scf-json-meta.php`

- Tests field group setup operations
- Validates state transitions (create → update → delete)
- Tests concurrent operations
- Verifies metadata preservation

**Fixture-Based Tests** — `test-scf-json-fixtures.php`

- Tests using real field group examples
- Validates comprehensive field group structure
- Tests error handling with invalid fixtures

### Test Fixtures

Located in `tests/fixtures/`:

**Valid Fixtures:**

- `group_valid_complete.json` — Complete field group with all field types (text, group, repeater, flexible_content)

**Invalid Fixtures:**

- `group_invalid_missing_title.json` — Missing required `title` property
- `group_invalid_bad_key.json` — Missing required `key` property
- `group_invalid_field_type.json` — Field with invalid type
- `group_invalid_no_location.json` — Missing required `location` array

### SCF Validation Class

The `{{namespace|pascalCase}}_SCF_JSON_Validator` class provides comprehensive validation:

```php
<?php
// Example usage
$validator = new {{namespace|pascalCase}}_SCF_JSON_Validator();

// Validate single file
$result = $validator->validate( '/path/to/group_example.json' );

if ( ! $result['valid'] ) {
    foreach ( $result['errors'] as $error ) {
        echo 'Error: ' . $error . "\n";
    }
}

// Validate all files in directory
$all_results = $validator->validate_all_files();
foreach ( $all_results as $filename => $result ) {
    if ( ! $result['valid'] ) {
        error_log( "Validation failed for $filename" );
    }
}
```

**Validation Result Structure:**

```php
array(
    'valid'    => true,              // Overall validation status
    'errors'   => array(),           // Critical validation errors
    'warnings' => array(),           // Non-blocking warnings
)
```

### Field Group Structure Example

**Minimal Valid Field Group:**

```json
{
  "key": "group_example",
  "title": "Example Field Group",
  "fields": [
    {
      "key": "field_example",
      "name": "example_field",
      "type": "text"
    }
  ],
  "location": [
    [
      {
        "param": "post_type",
        "operator": "==",
        "value": "post"
      }
    ]
  ]
}
```

**Complete Field Group with Container Fields:**

```json
{
  "key": "group_advanced",
  "title": "Advanced Field Group",
  "fields": [
    {
      "key": "field_group_nested",
      "name": "nested_group",
      "type": "group",
      "sub_fields": [
        {
          "key": "field_nested_item",
          "name": "nested_item",
          "type": "text"
        }
      ]
    },
    {
      "key": "field_repeater_items",
      "name": "repeater_items",
      "type": "repeater",
      "sub_fields": [
        {
          "key": "field_item_name",
          "name": "item_name",
          "type": "text"
        }
      ]
    },
    {
      "key": "field_flexible_content",
      "name": "content_sections",
      "type": "flexible_content",
      "layouts": [
        {
          "key": "layout_text",
          "name": "text_section",
          "label": "Text Section",
          "sub_fields": [
            {
              "key": "field_section_text",
              "name": "section_text",
              "type": "textarea"
            }
          ]
        }
      ]
    }
  ],
  "location": [[]]
}
```

### Common Validation Issues

**Issue**: "Field group key must start with 'group_'"

**Solution**: Ensure your field group key follows the pattern:

```json
{
  "key": "group_my_fields",  // ✅ Correct
  "key": "my_fields"         // ❌ Incorrect
}
```

**Issue**: "Field key must start with 'field_'"

**Solution**: Non-layout fields require the `field_` prefix:

```json
{
  "fields": [
    {
      "key": "field_my_text",  // ✅ Correct for text field
      "type": "text"
    },
    {
      "key": "tab_section",    // ✅ Correct for tab (layout field)
      "type": "tab"
    }
  ]
}
```

**Issue**: "Missing required property: location"

**Solution**: All field groups must define location rules:

```json
{
  "location": [
    [
      {
        "param": "post_type",
        "operator": "==",
        "value": "post"
      }
    ]
  ]
}
```

### Validating During Development

Add validation to your build process:

```bash
# In npm scripts
"test:scf": "npm run test -- tests/php/test-scf-json*.php",
"validate:scf": "npm run test:scf -- --verbose"
```

Run before committing field group changes:

```bash
npm run validate:scf
```

### Integration with CI/CD

SCF validation runs automatically in GitHub Actions:

```yaml
- name: Validate SCF Field Groups
  run: npm run test:scf
```

All field group JSON files must pass validation before PRs can be merged.

## Coverage Reports

### JavaScript Coverage

```bash
npm run test:js -- --coverage
```

Report saved to: `coverage/js/`

### PHP Coverage

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

## Dry Run Testing

### Overview

The dry-run testing system allows you to test scaffold templates that contain mustache variables without needing to generate a complete plugin first. It temporarily substitutes mustache variables with test values during the testing phase.

### Why Dry Run Testing?

This scaffold uses mustache template variables like `{{slug}}`, `{{namespace}}`, and `{{version}}` throughout the codebase. These variables cause linting and testing to fail since they're not valid JavaScript/PHP syntax. The dry-run system solves this by:

1. **Detecting** files with mustache variables
2. **Creating backups** of those files
3. **Substituting** variables with test values
4. **Running** tests/linting
5. **Restoring** original files

### Quick Start

```bash
# Run all tests with variable substitution
npm run dry-run:all

# Run only linting
npm run dry-run:lint

# Run only unit tests
npm run dry-run:test

# Run specific tests with custom commands
npm run dry-run -- lint:js test:unit
```

### How It Works

The process:

1. Finds all files with mustache variables (e.g., `{{slug}}`)
2. Creates complete backups in `.dry-run-backup/` directory
3. Replaces variables in-place with test values
4. Runs the specified npm scripts (linting, tests, etc.)
5. Restores original files from backups
6. Cleans up backup directory

### Test Values

Default test values used during dry-run mode:

```javascript
{
  slug: 'example-plugin',
  name: 'Example Plugin',
  namespace: 'example_plugin',
  textdomain: 'example-plugin',
  version: '1.0.0',
  author: 'Example Author',
  // ... see bin/dry-run-config.js for complete list
}
```

### Configuration

The dry-run system consists of two files:

**bin/dry-run-config.js** - Configuration and mustache replacement logic:

```bash
# Get full configuration
node bin/dry-run-config.js config

# Get specific value
node bin/dry-run-config.js value slug

# List files with mustache variables
node bin/dry-run-config.js files

# Replace variables in a file and output
node bin/dry-run-config.js replace src/index.js
```

**bin/dry-run-test.js** - Test runner with backup/restore:

- Finds all files with mustache variables
- Creates `.dry-run-backup/` directory with copies
- Replaces variables in-place
- Runs specified npm scripts
- Restores original files
- Cleans up backup directory

### Safety Features

- Always restores files, even on interrupt (Ctrl+C)
- Creates complete backups before any changes
- Provides colored output for easy debugging
- Stops on first failure in CI environments

### Automatic Integration

The dry-run system is automatically integrated into the pre-commit hook. When you commit changes:

1. The hook detects if this is a scaffold template (checks for `{{slug}}` in package.json)
2. If detected, it runs `npm run dry-run:lint` instead of regular linting
3. Variables are temporarily replaced, tests run, and originals are restored

### Bypassing Dry-Run

```bash
# Skip pre-commit hook entirely
git commit --no-verify -m "message"

# Run standard linting (will fail on scaffold templates)
npm run lint:js
npm run lint:css
```

### Customizing Test Values

Edit `bin/dry-run-config.js` to change default values:

```javascript
const DRY_RUN_VALUES = {
  slug: 'my-test-plugin',
  name: 'My Test Plugin',
  // ... update other values
};
```

### Troubleshooting Dry Run

**Backup Not Restored:**

If files aren't restored (e.g., after force-kill):

```bash
# Manual restoration from backup
cp -R .dry-run-backup/* .
rm -rf .dry-run-backup
```

**Variables Not Replaced:**

Check that your file pattern is included in `dry-run-test.js`:

```javascript
const patterns = [
  'src/**/*.{js,jsx}',
  // Add your pattern here
];
```

**Linting Still Fails:**

1. Check that test values in `dry-run-config.js` are valid
2. Ensure `.eslintignore` doesn't exclude needed files
3. Try running with verbose output: `node bin/dry-run-test.js lint:js --verbose`

### Post-Generation

Once you generate a plugin from this scaffold:

1. Mustache variables are replaced with actual values
2. The dry-run system is no longer needed
3. Standard linting and testing work normally
4. Pre-commit hook automatically uses standard mode

### Dry Run Best Practices

1. **Always use dry-run for scaffold development** - Ensures code quality without generating plugins
2. **Test before committing** - Run `npm run dry-run:all` before commits
3. **Keep test values realistic** - Use valid plugin identifiers in `DRY_RUN_VALUES`
4. **Don't commit backup directory** - Already in `.gitignore` as `.dry-run-backup/`
5. **Update test values when adding new variables** - Add to `DRY_RUN_VALUES` in `dry-run-config.js`

### Related Files

- [bin/dry-run-config.js](../bin/dry-run-config.js) - Configuration and variable replacement
- [bin/dry-run-test.js](../bin/dry-run-test.js) - Test runner with backup/restore
- [.husky/pre-commit](../.husky/pre-commit) - Pre-commit hook
- [.gitignore](../.gitignore) - Backup directory exclusion

## Test Logging

All tests automatically log to `logs/` directory:

- `logs/test-unit-<timestamp>.log` - Jest unit tests
- `logs/test-phpunit-<timestamp>.log` - PHPUnit tests
- `logs/test-e2e-<timestamp>.log` - E2E tests
- `logs/dry-run-<timestamp>.log` - Dry run operations

### Using Logs

```javascript
// JavaScript
testLog('INFO', 'Test starting');
```

```php
// PHP
test_log('INFO', 'Test starting');
```

For comprehensive logging documentation, see [LOGGING.md](./LOGGING.md).

## Related Documentation

- **[BUILD-PROCESS.md](./BUILD-PROCESS.md)** - Build system prerequisite
- **[README.md](./README.md)** - Documentation index
