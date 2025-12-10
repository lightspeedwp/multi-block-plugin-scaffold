---
title: Block Patterns
description: Predefined block layouts and content structures for plugin patterns
category: Development
type: Guide
audience: Developers
date: 2025-12-09
---

# Block Patterns for Multi-Block Plugin Scaffold

Comprehensive guide to creating, registering, and managing block patterns in WordPress plugins.

## Quick Navigation

- [Plugin vs Theme Patterns](#plugin-vs-theme-patterns)
- [Pattern File Format](#pattern-file-format)
- [Pattern Properties Reference](#pattern-properties-reference)
- [Creating Patterns](#creating-patterns)
- [Best Practices](#best-practices)
- [Block Bindings](#block-bindings-integration)
- [Accessibility](#accessibility-requirements)
- [Testing](#testing-patterns)

## Overview

**Block patterns** are predefined block layouts users can insert with a single click. In plugins, patterns are:

✅ Registered programmatically via PHP (not theme.json)
✅ Returned as associative arrays (not file headers)
✅ Namespaced with plugin slug
✅ Integrated with custom fields via block bindings

## Plugin vs Theme Patterns

### ❌ Theme Method (File Headers) - DO NOT USE IN PLUGINS

```php
<?php
/**
 * Title: Header Navigation
 * Slug: mytheme/header
 * Categories: header
 */
?>
<!-- Block markup -->
```

### ✅ Plugin Method (Array Return) - CORRECT

```php
<?php
return array(
 'title'      => __( 'Header Navigation', 'textdomain' ),
 'categories' => array( 'my-plugin' ),
 'content'    => '<!-- Block markup -->',
);
```

**Why arrays?** Programmatic control, internationalization, validation, flexibility.

## Pattern File Format

### Required Structure

Every pattern file MUST:

1. Return a PHP array
2. Include `title` and `content` properties
3. Internationalize all visible text
4. Prevent direct access

### Template

```php
<?php
/**
 * Pattern Name
 *
 * @package    {{namespace}}
 * @subpackage Patterns
 * @since      1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit;
}

return array(
 'title'       => __( 'Pattern Title', '{{textdomain}}' ),
 'description' => __( 'Pattern description', '{{textdomain}}' ),
 'categories'  => array( '{{slug}}' ),
 'content'     => '<!-- Block markup -->',
);
```

## Pattern Properties Reference

### Required Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `title` | string | Pattern name in inserter | `__( 'Card', '{{textdomain}}' )` |
| `content` | string | Block HTML markup | `'<!-- wp:group -->...'` |

### Optional Properties

| Property | Type | Description |
|----------|------|-------------|
| `description` | string | Search text |
| `categories` | array | Category slugs |
| `keywords` | array | Search terms |
| `blockTypes` | array | Applicable block types |
| `postTypes` | array | Applicable post types |
| `templateTypes` | array | Template types (WP 6.2+) |
| `viewportWidth` | int | Preview width (px) |
| `inserter` | bool | Show in inserter |

### Viewport Width Guidelines

- **400px** - Card patterns
- **720px** - Content sections
- **1200px** - Full-width layouts
- **1400px** - Hero sections

## Creating Patterns

### Step-by-Step Process

1. **Design in Block Editor** - Create layout with real content
2. **Copy Block Markup** - Switch to Code Editor, copy HTML
3. **Create Pattern File** - `patterns/{{slug}}-feature.php`
4. **Add Structure** - Return array with all properties
5. **Internationalize** - Replace text with `esc_html__()`
6. **Add Metadata** - Include pattern name/categories in block attributes
7. **Test** - Insert pattern in editor, verify layout

### Example Pattern

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
 exit;
}

return array(
 'title'         => __( 'Feature Section', '{{textdomain}}' ),
 'description'   => __( 'Three-column feature layout', '{{textdomain}}' ),
 'categories'    => array( '{{slug}}' ),
 'keywords'      => array(
  __( 'features', '{{textdomain}}' ),
  __( 'columns', '{{textdomain}}' ),
 ),
 'viewportWidth' => 1200,
 'content'       => '<!-- wp:group {"metadata":{"name":"' . esc_attr__( 'Features', '{{textdomain}}' ) . '"}} -->
 <div class="wp-block-group">
  <!-- wp:heading {"level":2} -->
  <h2>' . esc_html__( 'Our Features', '{{textdomain}}' ) . '</h2>
  <!-- /wp:heading -->
 </div>
 <!-- /wp:group -->',
);
```

## Best Practices

### Semantic HTML

✅ **Use proper elements:**

```php
'content' => '<!-- wp:heading {"level":2} -->
<h2>' . esc_html__( 'Title', '{{textdomain}}' ) . '</h2>
<!-- /wp:heading -->',
```

### CSS Variables with Fallbacks

✅ **Always provide fallbacks:**

```php
'content' => '<!-- wp:group {"style":{"spacing":{"padding":"var(--wp--preset--spacing--40, 2rem)"}}} -->
<div style="padding:var(--wp--preset--spacing--40, 2rem)">...</div>
<!-- /wp:group -->',
```

### Accessibility

✅ **Add ARIA labels:**

```php
'content' => '<!-- wp:group {"ariaLabel":"' . esc_attr__( 'Feature Cards', '{{textdomain}}' ) . '"} -->
<div aria-label="' . esc_attr__( 'Feature Cards', '{{textdomain}}' ) . '">...</div>
<!-- /wp:group -->',
```

### Internationalization

✅ **All visible text:**

```php
'content' => '<!-- wp:button -->
<div class="wp-block-button">
 <a>' . esc_html__( 'Learn More', '{{textdomain}}' ) . '</a>
</div>
<!-- /wp:button -->',
```

## Block Bindings Integration

Display custom field data using Block Bindings API (WordPress 6.5+):

```php
'content' => '<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}}} -->
<p></p>
<!-- /wp:paragraph -->',
```

**Supported attributes:** content, url, alt, title

## Accessibility Requirements

All patterns must meet **WCAG 2.2 Level AA**:

- ✅ Semantic HTML (h1-h6, lists, nav)
- ✅ ARIA labels on containers
- ✅ 4.5:1 text contrast
- ✅ Meaningful image alt text
- ✅ Descriptive link text
- ✅ Keyboard accessible

## Testing Patterns

### Manual Testing

1. Insert pattern in block inserter
2. Verify layout and spacing
3. Test responsive behavior
4. Check keyboard navigation
5. Validate bound fields
6. Test internationalization

### Automated Testing

```bash
composer run lint      # PHP linting
npm run validate       # Pattern validation
npm run test:a11y      # Accessibility tests
```

## Examples

- **[example-card.php](./example-card.php)** - Comprehensive example with full documentation
- **[{{slug}}-card.php](./{{slug}}-card.php)** - Basic card pattern
- **[{{slug}}-archive.php](./{{slug}}-archive.php)** - Archive grid pattern

## Registration

Patterns are automatically registered via `inc/class-patterns.php`:

1. **Pattern Category**: Registered as `{{slug}}` in the block inserter
2. **Auto-Discovery**: All `.php` files in `patterns/` are loaded on `init`
3. **Slug Generation**: Derived from filename (e.g., `{{slug}}-card.php` → `{{slug}}/card`)
4. **No Manual Registration**: Just create a file returning an array - it's automatically registered

The `Patterns` class (namespaced as `example_plugin\classes\Patterns`):
- Registers the pattern category
- Loads all pattern files from this directory
- Registers each pattern using `register_block_pattern()`

## References

- [Pattern Development Instructions](../.github/instructions/pattern-development.instructions.md)
- [WordPress Block Patterns](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
- [Block Bindings API](../docs/BLOCK-BINDINGS.md)
- [Accessibility Standards](../.github/instructions/a11y.instructions.md)
