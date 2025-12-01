# API Reference

Complete API documentation for the {{name}} single block plugin scaffold.

## PHP APIs

### LSWP_Nonce - Nonce Utilities

Secure AJAX and form submission handling.

```php
// Get nonce utilities instance
$nonce = new LSWP_Nonce( 'your-action-name' );

// Generate nonce for AJAX
$nonce_value = $nonce->create_nonce();

// Verify nonce (AJAX)
if ( ! $nonce->verify_ajax() ) {
    wp_send_json_error( 'Invalid nonce' );
}

// Verify nonce (POST)
if ( ! $nonce->verify_request() ) {
    wp_die( 'Security check failed' );
}
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `__construct()` | `$action = 'lswp-action'` | `void` | Initialize with action name |
| `create_nonce()` | - | `string` | Generate a new nonce |
| `verify_ajax()` | - | `bool` | Verify nonce from AJAX request |
| `verify_request()` | `$nonce_key = '_wpnonce'` | `bool` | Verify nonce from POST request |
| `get_action()` | - | `string` | Get the current action name |
| `render_nonce_field()` | `$referer = true` | `void` | Output nonce hidden field |

---

### LSWP_DB_Migration - Database Migrations

Handle database schema updates safely.

```php
// Initialize migration system
$migration = new LSWP_DB_Migration( '{{slug}}' );

// Run pending migrations
$migration->run_migrations();

// Check migration status
$status = $migration->get_migration_status();

// Rollback migrations
$migration->rollback( 2 ); // Rollback 2 migrations
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `__construct()` | `$plugin_slug` | `void` | Initialize migration system |
| `run_migrations()` | - | `array` | Run all pending migrations |
| `rollback()` | `$steps = 1` | `array` | Rollback migrations |
| `get_migration_status()` | - | `array` | Get current migration status |
| `has_pending()` | - | `bool` | Check for pending migrations |
| `get_current_version()` | - | `string` | Get current schema version |

---

### LSWP_Deprecation - Deprecation Utilities

Standard deprecation workflow for functions and hooks.

```php
// Deprecate a function
LSWP_Deprecation::deprecated_function(
    'old_function_name',
    '2.0.0',
    'new_function_name'
);

// Deprecate a hook
LSWP_Deprecation::deprecated_hook(
    'old_filter_name',
    '2.0.0',
    'new_filter_name'
);

// Deprecate a function argument
LSWP_Deprecation::deprecated_argument(
    'function_name',
    '2.0.0',
    'The $old_arg parameter is deprecated.'
);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deprecated_function()` | `$function, $version, $replacement` | `void` | Mark function as deprecated |
| `deprecated_hook()` | `$hook, $version, $replacement` | `void` | Mark hook as deprecated |
| `deprecated_argument()` | `$function, $version, $message` | `void` | Mark argument as deprecated |
| `get_log()` | - | `array` | Get all deprecation notices |
| `clear_log()` | - | `void` | Clear deprecation log |

---

## JavaScript APIs

### Block Registration

```javascript
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
    edit: Edit,
    save,
} );
```

### Deprecated JavaScript Functions

```javascript
import { deprecated } from '@wordpress/deprecated';

// Mark function as deprecated
deprecated( 'oldFunction', {
    since: '2.0.0',
    alternative: 'newFunction',
} );

// Deprecate with plugin info
deprecated( 'oldFunction', {
    since: '2.0.0',
    plugin: '{{name}}',
    alternative: 'newFunction',
    link: 'https://example.com/docs/migration',
} );
```

---

## Hooks Reference

### Actions

| Hook | Parameters | Description |
|------|------------|-------------|
| `lswp_before_block_init` | - | Fires before block initialization |
| `lswp_after_block_init` | - | Fires after block initialization |
| `lswp_migration_complete` | `$version` | Fires after migration completes |
| `lswp_deprecation_notice` | `$function, $version` | Fires when deprecation triggered |

### Filters

| Hook | Parameters | Default | Description |
|------|------------|---------|-------------|
| `lswp_block_attributes` | `$attributes` | `[]` | Filter block attributes |
| `lswp_block_supports` | `$supports` | `[]` | Filter block supports |
| `lswp_nonce_action` | `$action` | `'lswp-action'` | Filter nonce action name |
| `lswp_deprecation_should_trigger` | `$should_trigger, $function` | `true` | Control deprecation notices |

---

## CLI Commands

### Development

```bash
# Start development server
npm run start

# Build for production
npm run build

# Quick build (no cleaning)
npm run build:quick
```

### Testing

```bash
# All tests
npm run test

# JavaScript unit tests
npm run test:unit

# PHP unit tests
npm run test:php
composer run test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:e2e:a11y
```

### Code Quality

```bash
# Lint all
npm run lint

# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Lint PHP
composer run lint

# Format code
npm run format
```

### Internationalization

```bash
# Generate POT file
npm run makepot

# Generate JSON translations
npm run makejson

# Full i18n workflow
npm run i18n
```

### Version Management

```bash
# Update version number
npm run update-version -- --version=1.2.3

# Create plugin ZIP
npm run plugin-zip
```

### Performance

```bash
# Run Lighthouse CI
npm run lighthouse

# Check bundle size
npm run size-limit

# Analyze bundle
npm run analyze-bundle

# Full performance check
npm run performance
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WP_DEBUG` | `false` | Enable WordPress debug mode |
| `SCRIPT_DEBUG` | `false` | Use unminified scripts |
| `WP_DEBUG_LOG` | `false` | Log debug messages |
| `WP_DEBUG_DISPLAY` | `true` | Display debug messages |
| `SAVEQUERIES` | `false` | Save database queries |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `webpack.config.js` | Webpack bundling configuration |
| `postcss.config.js` | PostCSS processing |
| `eslint.config.js` | ESLint rules |
| `stylelint.config.js` | Stylelint rules |
| `jest.config.js` | Jest testing |
| `playwright.config.js` | E2E testing |
| `phpcs.xml` | PHP CodeSniffer rules |
| `phpstan.neon` | PHPStan analysis |
| `phpunit.xml` | PHPUnit configuration |
| `codecov.yml` | Code coverage settings |
| `.lighthouserc.js` | Lighthouse CI settings |
| `.size-limit.json` | Bundle size limits |

---

## Related Documentation

- [README](./README.md) - Main documentation index
- [Deprecation Guide](./DEPRECATION.md) - Deprecation workflow
- [Security Nonce](./SECURITY-NONCE.md) - Nonce utilities
- [Database Migration](./DB-MIGRATION.md) - Migration system
- [Performance](./PERFORMANCE.md) - Performance monitoring
