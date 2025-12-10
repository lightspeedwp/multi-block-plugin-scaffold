# Template Parts (Plugin Placeholder)

## Important: Template Parts are a Theme Concern

Template parts in WordPress are **primarily a theme concern**, not a plugin concern. There is currently no clean plugin API for registering template parts like there is for full templates.

## Why This Directory Exists

This directory serves as a **documentation placeholder** to clarify the distinction between:

- **Block templates** (full page templates) - Can be registered by plugins via `register_block_template()`
- **Template parts** (reusable sections like headers/footers) - Remain a theme responsibility

## Options for Plugin Authors

If your plugin needs to provide reusable content sections, you have several options:

### 1. Use Block Patterns Instead (Recommended)

The recommended approach is to register block patterns rather than template parts:

```php
register_block_pattern( 'my-plugin/header', array(
    'title'   => __( 'My Plugin Header', 'my-plugin' ),
    'content' => '<!-- wp:group -->...</div><!-- /wp:group -->',
) );
```

**Advantages:**
- Clean plugin API exists
- Can be inserted into any template or page
- Theme-independent

### 2. Ship as Theme Integration

If you need actual template parts:
- Document them as theme integration files
- Provide them as optional theme additions
- Let theme developers copy them into their theme's `parts/` directory

### 3. Wait for Future WordPress API

WordPress may add a plugin API for template parts in the future. For now, this directory documents the limitation.

## What's in This Directory

The template part files in this directory (if any) are:
- **Example/placeholder files** showing template part structure
- **NOT automatically registered** by the plugin
- **Available for theme developers** to copy into their themes

## References

- [Block Patterns](https://developer.wordpress.org/themes/features/block-patterns/)
- [Template Parts](https://developer.wordpress.org/themes/block-themes/templates-and-template-parts/)
- [Plugin Templates in WP 6.7+](https://make.wordpress.org/core/2024/10/01/plugin-template-registration/)
