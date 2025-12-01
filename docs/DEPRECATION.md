# Deprecation Workflow

This document outlines the standardized process for deprecating functions, hooks, and features in a way that provides clear migration paths and sufficient warning to developers.

## Overview

Deprecation is a critical part of maintaining a healthy codebase. When done properly, it:

- Gives developers time to update their code
- Provides clear migration paths
- Maintains backward compatibility during transition periods
- Documents the evolution of the API

## Deprecation Utilities

Include the deprecation utilities in your code:

```php
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/deprecation.php';
```

## Functions Available

### `lswp_deprecated( $function_name, $version, $replacement, $message )`

Logs a deprecation notice for functions, methods, or features.

```php
// Example: Deprecating a function
function old_function_name() {
    lswp_deprecated(
        'old_function_name',
        '1.5.0',
        'new_function_name',
        'The return type has changed from array to object.'
    );

    // Call the new function for backward compatibility
    return new_function_name();
}
```

### `lswp_deprecated_hook( $hook, $version, $replacement, $message )`

Logs a deprecation notice for action and filter hooks.

```php
// Example: Deprecating a filter hook
add_filter( 'old_filter_name', function( $value ) {
    lswp_deprecated_hook(
        'old_filter_name',
        '1.5.0',
        'new_filter_name',
        'The filter now passes an additional parameter.'
    );

    // Apply the old filter value to the new one
    return apply_filters( 'new_filter_name', $value, null );
} );
```

### `lswp_deprecated_argument( $function, $argument, $version, $message )`

Logs a deprecation notice for function arguments.

```php
// Example: Deprecating a function argument
function some_function( $new_arg, $old_arg = null ) {
    if ( null !== $old_arg ) {
        lswp_deprecated_argument(
            'some_function',
            '$old_arg',
            '1.5.0',
            'Pass the value as part of $new_arg instead.'
        );
    }

    // Handle the old argument for backward compatibility
    // ...
}
```

### `lswp_deprecated_file( $file, $version, $replacement, $message )`

Logs a deprecation notice for deprecated files.

```php
// At the top of a deprecated file
lswp_deprecated_file(
    __FILE__,
    '1.5.0',
    'new-file.php',
    'This file has been split into multiple modules.'
);
```

## Deprecation Timeline

Follow this timeline when deprecating features:

### Phase 1: Announcement (Version X.0)

1. Add deprecation notice to code using `lswp_deprecated()`
2. Update documentation with deprecation warning
3. Add entry to CHANGELOG.md
4. Keep old functionality working

### Phase 2: Warning Period (Versions X.1 - X.9)

1. Deprecation notices appear in debug mode
2. Old functionality continues to work
3. Documentation prominently displays migration guide
4. Consider adding admin notices for critical deprecations

### Phase 3: Removal (Version X+1.0)

1. Remove deprecated code entirely
2. Update documentation to remove old references
3. Add "Breaking Changes" section to CHANGELOG.md
4. Major version bump signals breaking changes

## Example Timeline

```
v1.4.0 - Feature works normally
v1.5.0 - Deprecation notice added, old function still works
v1.6.0 - Warning period continues
v1.7.0 - Warning period continues
v1.8.0 - Warning period continues
v1.9.0 - Warning period continues, final warning in changelog
v2.0.0 - Deprecated function removed (breaking change)
```

## Tracking Deprecations

Register all deprecations for documentation generation:

```php
add_filter( 'lswp_deprecations', function( $deprecations ) {
    $deprecations[] = array(
        'type'        => 'function',
        'name'        => 'old_function_name',
        'version'     => '1.5.0',
        'replacement' => 'new_function_name',
        'message'     => 'The function signature has changed.',
        'removed_in'  => '2.0.0',
    );

    return $deprecations;
} );
```

Retrieve all deprecations programmatically:

```php
$all_deprecations = lswp_get_deprecations();

foreach ( $all_deprecations as $item ) {
    printf(
        "%s '%s' deprecated in %s, use '%s' instead. Will be removed in %s.\n",
        $item['type'],
        $item['name'],
        $item['version'],
        $item['replacement'],
        $item['removed_in']
    );
}
```

## Documentation Requirements

When deprecating any feature, update these files:

### 1. Inline Documentation

```php
/**
 * Old function description.
 *
 * @since      1.0.0
 * @deprecated 1.5.0 Use new_function_name() instead.
 * @see        new_function_name()
 *
 * @param string $param Description.
 * @return string Description.
 */
function old_function_name( $param ) {
    lswp_deprecated( 'old_function_name', '1.5.0', 'new_function_name' );
    return new_function_name( $param );
}
```

### 2. CHANGELOG.md

```markdown
## [1.5.0] - 2024-01-15

### Deprecated
- `old_function_name()` - Use `new_function_name()` instead. Will be removed in v2.0.0.
- `old_filter_hook` filter - Use `new_filter_hook` instead.
```

### 3. Migration Guide

Create a dedicated migration document when making significant changes:

```markdown
# Migrating from 1.x to 2.0

## Breaking Changes

### old_function_name() Removed

**Before (1.x):**
```php
$result = old_function_name( $value );
```

**After (2.0+):**

```php
$result = new_function_name( $value );
```

**Migration Steps:**

1. Search your codebase for `old_function_name`
2. Replace with `new_function_name`
3. Update any type hints (return type changed from array to object)

```

## Admin Notices for Critical Deprecations

For deprecations that require immediate attention:

```php
add_action( 'admin_notices', function() {
    // Only show to administrators
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // Check if deprecated feature is in use
    if ( ! lswp_deprecated_feature_in_use() ) {
        return;
    }

    ?>
    <div class="notice notice-warning is-dismissible">
        <p>
            <strong><?php esc_html_e( '{{name}} Notice:', '{{textdomain}}' ); ?></strong>
            <?php
            printf(
                /* translators: %s: documentation URL */
                esc_html__( 'You are using a deprecated feature that will be removed in version 2.0. Please update your code. %s', '{{textdomain}}' ),
                '<a href="' . esc_url( '{{docs_url}}/migration' ) . '">' . esc_html__( 'View migration guide', '{{textdomain}}' ) . '</a>'
            );
            ?>
        </p>
    </div>
    <?php
} );
```

## JavaScript Deprecations

For JavaScript code, use the `@wordpress/deprecated` package:

```javascript
import deprecated from '@wordpress/deprecated';

// Deprecate a function
export function oldFunction() {
    deprecated( 'oldFunction', {
        since: '1.5.0',
        alternative: 'newFunction',
        hint: 'The return value has changed.',
    } );

    return newFunction();
}

// Deprecate a hook
deprecated( 'hookName', {
    since: '1.5.0',
    alternative: 'newHookName',
    plugin: '{{name}}',
} );
```

## Best Practices

1. **Maintain Backward Compatibility**: Deprecated code should continue working during the warning period
2. **Clear Migration Path**: Always provide a replacement and migration instructions
3. **Adequate Warning Time**: Allow at least one major version cycle before removal
4. **Document Everything**: Update all relevant documentation immediately
5. **Test Deprecation Notices**: Verify notices appear correctly in debug mode
6. **Semantic Versioning**: Increment major version when removing deprecated features
7. **Communicate Changes**: Announce deprecations in release notes and changelogs

## Monitoring Deprecations

Hook into deprecation notices for monitoring:

```php
add_action( 'lswp_deprecated_notice', function( $function, $version, $replacement, $message ) {
    // Log to external monitoring service
    if ( function_exists( 'your_monitoring_log' ) ) {
        your_monitoring_log( 'deprecation', array(
            'function'    => $function,
            'version'     => $version,
            'replacement' => $replacement,
            'message'     => $message,
            'backtrace'   => wp_debug_backtrace_summary(),
        ) );
    }
}, 10, 4 );
```

## Resources

- [WordPress Coding Standards - Deprecation](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/#deprecated-functions)
- [Semantic Versioning](https://semver.org/)
- [@wordpress/deprecated Package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-deprecated/)
