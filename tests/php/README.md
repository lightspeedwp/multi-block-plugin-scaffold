---
title: PHP Unit Tests
description: PHPUnit tests for PHP classes, functions, and WordPress integration
category: Testing
date: 2025-12-01
---

# PHP Unit Tests

PHPUnit-based unit tests for PHP classes, functions, and WordPress integration.

## Overview

PHP tests validate server-side functionality using the WordPress test suite and PHPUnit framework.

## Directory Structure

```
php/
├── README.md                # This file
├── bootstrap.php            # Test bootstrap
├── inc/                     # Tests for inc/ classes
│   ├── test-class-*.php    # Class tests
│   └── test-*.php          # Function tests
└── fixtures/                # Test fixtures and data
```

## Running Tests

```bash
# Run all tests
composer test

# Run specific test
composer test -- --filter test_my_function

# Coverage report
composer test -- --coverage-html coverage/php
```

## Test Coverage

- ✅ Custom post type registration
- ✅ Taxonomy registration
- ✅ SCF JSON validation
- ✅ Block bindings
- ✅ Options pages
- ✅ Helper functions

## Writing Tests

```php
class Test_My_Class extends WP_UnitTestCase {
    public function setUp(): void {
        parent::setUp();
        // Setup code
    }

    public function test_my_method() {
        $instance = new My_Class();
        $result = $instance->my_method( 'input' );

        $this->assertEquals( 'expected', $result );
    }
}
```

## Best Practices

1. **Extend WP_UnitTestCase** - Use WordPress test case class
2. **Clean up** - Delete test data in tearDown()
3. **Use factories** - Create test posts, users efficiently
4. **Test WordPress hooks** - Verify filters and actions
5. **Mock external calls** - Don't make real API requests

## References

- [PHPUnit Documentation](https://phpunit.de/)
- [WordPress Unit Tests](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)
- [WP_UnitTestCase](https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/)
