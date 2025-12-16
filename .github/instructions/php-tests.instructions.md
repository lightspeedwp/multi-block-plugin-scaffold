---
title: PHP Testing Instructions
description: How to write, organize, and run PHPUnit tests for WordPress plugins in the multi-block-plugin-scaffold
category: Testing
audience: Developers
created: 2025-12-16
updated: 2025-12-16
references:
  - ../custom-instructions.md
  - ./wpcs-php.instructions.md
  - ./testing-e2e.instructions.md
---

# PHP Testing Instructions

This document explains how PHPUnit tests are organized and written in the multi-block-plugin-scaffold repository, following WordPress testing standards and PHPUnit best practices.

## Table of Contents

- [Overview](#overview)
- [Test Environment Setup](#test-environment-setup)
- [Test File Organization](#test-file-organization)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [WordPress Test Framework](#wordpress-test-framework)
- [Mocking and Fixtures](#mocking-and-fixtures)
- [Code Coverage](#code-coverage)
- [Best Practices](#best-practices)
- [Integration with CI](#integration-with-ci)

## Overview

PHPUnit is the standard testing framework for PHP and WordPress plugin development. Tests verify that your PHP code, WordPress integrations, custom post types, taxonomies, and Secure Custom Fields (SCF) configurations work correctly.

### Test Types

1. **Unit Tests** - Test individual functions and methods in isolation
2. **Integration Tests** - Test how WordPress APIs and plugin components interact
3. **SCF Tests** - Test Secure Custom Fields JSON configurations and field registrations

## Test Environment Setup

### Prerequisites

```bash
# Install Composer dependencies
composer install

# Install WordPress test suite (one-time setup)
bin/install-wp-tests.sh wordpress_test root '' localhost latest

# Or with custom database
bin/install-wp-tests.sh wordpress_test dbuser dbpass localhost latest
```

### Environment Variables

Configure in your shell or `.env` file:

```bash
# WordPress test library location
export WP_TESTS_DIR=/tmp/wordpress-tests-lib

# Test database configuration
export WP_DB_NAME=wordpress_test
export WP_DB_USER=root
export WP_DB_PASS=''
export WP_DB_HOST=localhost
```

### PHPUnit Configuration

Located at `phpunit.xml` in repository root:

```xml
<?xml version="1.0"?>
<phpunit
	bootstrap="tests/bootstrap.php"
	backupGlobals="false"
	colors="true"
	convertErrorsToExceptions="true"
	convertNoticesToExceptions="true"
	convertWarningsToExceptions="true"
>
	<testsuites>
		<testsuite name="{{name}} Test Suite">
			<directory suffix=".php">./tests/php</directory>
		</testsuite>
	</testsuites>
	<coverage>
		<include>
			<directory suffix=".php">./inc</directory>
			<file>./{{slug}}.php</file>
		</include>
	</coverage>
</phpunit>
```

## Test File Organization

### Directory Structure

```
tests/
├── bootstrap.php              # PHPUnit bootstrap file
├── phpstan-bootstrap.php      # PHPStan static analysis bootstrap
├── php/                       # All PHPUnit test files
│   ├── test-plugin-basics.php     # Basic plugin functionality
│   ├── test-cpt-registration.php  # Custom post type tests
│   ├── test-taxonomy.php          # Taxonomy registration tests
│   ├── test-block-registration.php # Block registration tests
│   ├── test-scf-json-*.php        # SCF configuration tests
│   └── test-hooks.php             # WordPress hooks and filters
├── fixtures/                  # Test data and mock files
│   ├── sample-post.json
│   └── test-config.php
└── __mocks__/                # Mock implementations
    └── README.md
```

### Test File Naming

- Use `test-` prefix for all test files
- Match the feature or file being tested
- Use kebab-case naming

```
inc/class-cpt-registration.php   → tests/php/test-cpt-registration.php
inc/class-taxonomy.php           → tests/php/test-taxonomy.php
inc/class-block-registration.php → tests/php/test-block-registration.php
```

## Writing Tests

### Basic Test Structure

```php
<?php
/**
 * Class Test_My_Feature
 *
 * @package {{namespace}}
 */

/**
 * Test my feature functionality
 */
class Test_My_Feature extends WP_UnitTestCase {

	/**
	 * Setup before each test
	 */
	public function setUp(): void {
		parent::setUp();
		// Reset state, create test data, etc.
	}

	/**
	 * Teardown after each test
	 */
	public function tearDown(): void {
		// Clean up test data
		parent::tearDown();
	}

	/**
	 * Test basic functionality
	 */
	public function test_basic_functionality() {
		$result = my_function( 'input' );
		$this->assertEquals( 'expected output', $result );
	}

	/**
	 * Test edge cases
	 */
	public function test_edge_case() {
		$this->expectException( InvalidArgumentException::class );
		my_function( null );
	}
}
```

### Test Class Naming

- Class names must start with `Test_`
- Use underscores to separate words
- Extend `WP_UnitTestCase` for WordPress tests

```php
// ✅ Good
class Test_CPT_Registration extends WP_UnitTestCase {}
class Test_Taxonomy_Registration extends WP_UnitTestCase {}

// ❌ Bad
class CPTTest extends WP_UnitTestCase {}
class testTaxonomy extends WP_UnitTestCase {}
```

### Test Method Naming

- Method names must start with `test_`
- Use underscores to separate words
- Be descriptive about what is being tested

```php
// ✅ Good
public function test_cpt_registers_successfully() {}
public function test_cpt_has_correct_labels() {}
public function test_invalid_cpt_args_throw_exception() {}

// ❌ Bad
public function testCPT() {}
public function test1() {}
public function cptreg() {}
```

### PHPUnit Assertions

Common assertions for WordPress testing:

```php
// Equality
$this->assertEquals( $expected, $actual );
$this->assertSame( $expected, $actual );      // Strict comparison (===)
$this->assertNotEquals( $unexpected, $actual );

// Boolean
$this->assertTrue( $value );
$this->assertFalse( $value );
$this->assertNull( $value );
$this->assertNotNull( $value );

// Arrays
$this->assertIsArray( $value );
$this->assertArrayHasKey( 'key', $array );
$this->assertContains( 'item', $array );
$this->assertCount( 3, $array );

// Strings
$this->assertStringContainsString( 'needle', 'haystack' );
$this->assertStringStartsWith( 'prefix', $string );
$this->assertStringEndsWith( 'suffix', $string );
$this->assertMatchesRegularExpression( '/pattern/', $string );

// WordPress-specific
$this->assertInstanceOf( WP_Post::class, $post );
$this->assertInstanceOf( WP_Term::class, $term );
$this->assertInstanceOf( WP_Query::class, $query );

// Exceptions
$this->expectException( Exception::class );
$this->expectExceptionMessage( 'error message' );
```

### Testing Custom Post Types

```php
<?php
/**
 * Test CPT Registration
 *
 * @package {{namespace}}
 */

class Test_CPT_Registration extends WP_UnitTestCase {

	/**
	 * Test that custom post type is registered
	 */
	public function test_cpt_is_registered() {
		$post_type = '{{slug}}';
		$this->assertTrue( post_type_exists( $post_type ) );
	}

	/**
	 * Test CPT labels are correct
	 */
	public function test_cpt_labels() {
		$post_type_object = get_post_type_object( '{{slug}}' );

		$this->assertEquals( '{{name_plural}}', $post_type_object->labels->name );
		$this->assertEquals( '{{name_singular}}', $post_type_object->labels->singular_name );
	}

	/**
	 * Test CPT supports correct features
	 */
	public function test_cpt_supports() {
		$supports = get_all_post_type_supports( '{{slug}}' );

		$this->assertArrayHasKey( 'title', $supports );
		$this->assertArrayHasKey( 'editor', $supports );
		$this->assertArrayHasKey( 'thumbnail', $supports );
	}

	/**
	 * Test creating a post of this type
	 */
	public function test_create_cpt_post() {
		$post_id = $this->factory->post->create( array(
			'post_type'  => '{{slug}}',
			'post_title' => 'Test {{name_singular}}',
		) );

		$this->assertGreaterThan( 0, $post_id );
		$this->assertEquals( '{{slug}}', get_post_type( $post_id ) );
	}
}
```

### Testing Taxonomies

```php
<?php
/**
 * Test Taxonomy Registration
 *
 * @package {{namespace}}
 */

class Test_Taxonomy extends WP_UnitTestCase {

	/**
	 * Test taxonomy is registered
	 */
	public function test_taxonomy_is_registered() {
		$taxonomy = '{{slug}}-category';
		$this->assertTrue( taxonomy_exists( $taxonomy ) );
	}

	/**
	 * Test taxonomy is assigned to correct post type
	 */
	public function test_taxonomy_post_type_assignment() {
		$taxonomies = get_object_taxonomies( '{{slug}}' );
		$this->assertContains( '{{slug}}-category', $taxonomies );
	}

	/**
	 * Test creating a term
	 */
	public function test_create_term() {
		$term = wp_insert_term(
			'Test Category',
			'{{slug}}-category'
		);

		$this->assertIsArray( $term );
		$this->assertArrayHasKey( 'term_id', $term );
		$this->assertGreaterThan( 0, $term['term_id'] );
	}
}
```

### Testing Secure Custom Fields (SCF)

```php
<?php
/**
 * Test SCF JSON Configuration
 *
 * @package {{namespace}}
 */

class Test_SCF_JSON extends WP_UnitTestCase {

	/**
	 * Test SCF JSON files are valid
	 */
	public function test_scf_json_files_exist() {
		$json_dir = plugin_dir_path( dirname( __FILE__, 2 ) ) . 'scf-json';
		$this->assertDirectoryExists( $json_dir );

		$json_files = glob( $json_dir . '/*.json' );
		$this->assertNotEmpty( $json_files, 'No SCF JSON files found' );
	}

	/**
	 * Test SCF JSON is valid JSON
	 */
	public function test_scf_json_is_valid() {
		$json_dir = plugin_dir_path( dirname( __FILE__, 2 ) ) . 'scf-json';
		$json_files = glob( $json_dir . '/*.json' );

		foreach ( $json_files as $file ) {
			$content = file_get_contents( $file );
			$decoded = json_decode( $content, true );

			$this->assertNotNull(
				$decoded,
				sprintf( 'Invalid JSON in %s', basename( $file ) )
			);
			$this->assertEquals(
				JSON_ERROR_NONE,
				json_last_error(),
				sprintf( 'JSON error in %s: %s', basename( $file ), json_last_error_msg() )
			);
		}
	}

	/**
	 * Test SCF field group structure
	 */
	public function test_scf_field_group_structure() {
		$json_dir = plugin_dir_path( dirname( __FILE__, 2 ) ) . 'scf-json';
		$json_files = glob( $json_dir . '/*.json' );

		foreach ( $json_files as $file ) {
			$content = file_get_contents( $file );
			$group = json_decode( $content, true );

			// Test required keys
			$this->assertArrayHasKey( 'key', $group );
			$this->assertArrayHasKey( 'title', $group );
			$this->assertArrayHasKey( 'fields', $group );
			$this->assertArrayHasKey( 'location', $group );

			// Test field structure
			$this->assertIsArray( $group['fields'] );
			foreach ( $group['fields'] as $field ) {
				$this->assertArrayHasKey( 'key', $field );
				$this->assertArrayHasKey( 'label', $field );
				$this->assertArrayHasKey( 'name', $field );
				$this->assertArrayHasKey( 'type', $field );
			}
		}
	}
}
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test:php

# Or use phpunit directly
phpunit

# Run specific test file
phpunit tests/php/test-cpt-registration.php

# Run specific test class
phpunit --filter Test_CPT_Registration

# Run specific test method
phpunit --filter test_cpt_is_registered

# Run with verbose output
phpunit --verbose

# Run with debug output
phpunit --debug
```

### Specialized Test Commands

```bash
# Run SCF tests only
npm run test:scf

# Run SCF tests with verbose output
npm run test:scf:verbose

# Run with code coverage
npm run validate:scf
```

### Test Groups

Use PHPUnit groups to categorize tests:

```php
/**
 * Test CPT registration
 *
 * @group cpt
 * @group registration
 */
public function test_cpt_registers() {
	// Test code
}

/**
 * Test slow operation
 *
 * @group slow
 */
public function test_slow_operation() {
	// Test code
}
```

Run specific groups:

```bash
# Run only CPT tests
phpunit --group cpt

# Exclude slow tests
phpunit --exclude-group slow
```

## WordPress Test Framework

### Factory Functions

WordPress provides factory methods for creating test data:

```php
// Create posts
$post_id = $this->factory->post->create( array(
	'post_type'  => '{{slug}}',
	'post_title' => 'Test Post',
) );

// Create users
$user_id = $this->factory->user->create( array(
	'role' => 'editor',
) );

// Create terms
$term_id = $this->factory->term->create( array(
	'taxonomy' => '{{slug}}-category',
	'name'     => 'Test Category',
) );

// Create comments
$comment_id = $this->factory->comment->create( array(
	'comment_post_ID' => $post_id,
) );

// Create multiple items
$post_ids = $this->factory->post->create_many( 5, array(
	'post_type' => '{{slug}}',
) );
```

### WordPress Assertions

```php
// Test WordPress functions
$this->assertTrue( is_plugin_active( '{{slug}}/{{slug}}.php' ) );
$this->assertTrue( post_type_exists( '{{slug}}' ) );
$this->assertTrue( taxonomy_exists( '{{slug}}-category' ) );

// Test post meta
$this->assertEquals( 'value', get_post_meta( $post_id, 'meta_key', true ) );

// Test options
$this->assertEquals( 'value', get_option( 'option_name' ) );

// Test capabilities
$this->assertTrue( current_user_can( 'edit_posts' ) );
```

### Mocking WordPress Functions

```php
// Mock wp_mail
add_filter( 'pre_wp_mail', function( $null, $atts ) {
	// Prevent actual email sending
	return true;
}, 10, 2 );

// Mock HTTP requests
add_filter( 'pre_http_request', function( $preempt, $args, $url ) {
	return array(
		'response' => array( 'code' => 200 ),
		'body'     => '{"status":"success"}',
	);
}, 10, 3 );
```

## Mocking and Fixtures

### Test Fixtures

Store test data in `tests/fixtures/`:

```php
// tests/fixtures/sample-config.php
<?php
return array(
	'plugin_name' => 'Test Plugin',
	'version'     => '1.0.0',
	'features'    => array(
		'cpt'       => true,
		'taxonomy'  => true,
		'blocks'    => true,
	),
);
```

Load in tests:

```php
public function test_with_fixture() {
	$config = include __DIR__ . '/../fixtures/sample-config.php';
	$this->assertArrayHasKey( 'plugin_name', $config );
}
```

### Mocking ACF Functions

The bootstrap file provides mock ACF functions for testing without ACF installed:

```php
// Mock ACF functions are automatically available
$value = get_field( 'field_name', $post_id );
$has_rows = have_rows( 'repeater_field', $post_id );
```

## Code Coverage

### Generating Coverage Reports

```bash
# Generate HTML coverage report
phpunit --coverage-html coverage/php

# Generate text coverage report
phpunit --coverage-text

# Generate Clover XML (for CI)
phpunit --coverage-clover coverage/clover.xml
```

### Coverage Configuration

Defined in `phpunit.xml`:

```xml
<coverage>
	<include>
		<directory suffix=".php">./inc</directory>
		<file>./{{slug}}.php</file>
	</include>
</coverage>
```

### Viewing Coverage

```bash
# Open HTML report in browser
open coverage/php/index.html
```

## Best Practices

### Test Independence

Each test should be independent and not rely on other tests:

```php
// ✅ Good - Creates own test data
public function test_cpt_creation() {
	$post_id = $this->factory->post->create( array(
		'post_type' => '{{slug}}',
	) );
	$this->assertGreaterThan( 0, $post_id );
}

// ❌ Bad - Relies on previous test
public function test_cpt_update() {
	// Assumes $post_id exists from previous test
	wp_update_post( array( 'ID' => $post_id ) );
}
```

### Setup and Teardown

Use `setUp()` and `tearDown()` for common operations:

```php
class Test_My_Feature extends WP_UnitTestCase {
	private $post_id;

	public function setUp(): void {
		parent::setUp();
		// Run before each test
		$this->post_id = $this->factory->post->create();
	}

	public function tearDown(): void {
		// Run after each test
		wp_delete_post( $this->post_id, true );
		parent::tearDown();
	}

	public function test_something() {
		// $this->post_id is available here
		$this->assertGreaterThan( 0, $this->post_id );
	}
}
```

### Data Providers

Use data providers for testing multiple scenarios:

```php
/**
 * Data provider for testing validation
 */
public function validation_scenarios() {
	return array(
		'valid slug'     => array( 'my-plugin', true ),
		'invalid spaces' => array( 'my plugin', false ),
		'invalid caps'   => array( 'MyPlugin', false ),
		'empty string'   => array( '', false ),
	);
}

/**
 * Test slug validation
 *
 * @dataProvider validation_scenarios
 */
public function test_slug_validation( $slug, $expected ) {
	$result = validate_slug( $slug );
	$this->assertEquals( $expected, $result );
}
```

### Test Documentation

Document what each test verifies:

```php
/**
 * Test that CPT is registered with correct arguments
 *
 * Verifies:
 * - Post type exists
 * - Has correct labels
 * - Supports required features
 * - Has public visibility
 */
public function test_cpt_registration() {
	// Test implementation
}
```

### Avoid Hard-Coded Values

Use variables and constants:

```php
// ❌ Bad
$this->assertEquals( 'tour-operator', get_post_type( $post_id ) );

// ✅ Good
$post_type = '{{slug}}';
$this->assertEquals( $post_type, get_post_type( $post_id ) );
```

## Integration with CI

### GitHub Actions

Example workflow for running PHPUnit tests:

```yaml
name: PHP Tests

on: [push, pull_request]

jobs:
  phpunit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          extensions: mysqli, mbstring
          coverage: xdebug

      - name: Install dependencies
        run: composer install

      - name: Setup WordPress test environment
        run: bash bin/install-wp-tests.sh wordpress_test root '' localhost latest

      - name: Run PHPUnit
        run: phpunit --coverage-clover coverage.xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
```

## Additional Resources

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [WordPress Plugin Unit Tests](https://make.wordpress.org/cli/handbook/misc/plugin-unit-tests/)
- [WP_UnitTestCase Reference](https://developer.wordpress.org/reference/classes/wp_unittestcase/)
- [WordPress Test Suite](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)
- [Repository CONTRIBUTING.md](../../CONTRIBUTING.md)
- [Jest Tests Instructions](./jest-tests.instructions.md)
- [E2E Testing Instructions](./testing-e2e.instructions.md)

## Examples from This Repository

### Plugin Tests

See `tests/php/test-plugin-basics.php` for examples of:
- Testing plugin activation
- Testing plugin constants
- Testing plugin file structure

### CPT Tests

See `tests/php/test-cpt-registration.php` for examples of:
- Testing post type registration
- Testing post type labels and arguments
- Testing post type capabilities

### SCF Tests

See `tests/php/test-scf-json-*.php` for examples of:
- Validating JSON structure
- Testing field group registration
- Testing field configuration
