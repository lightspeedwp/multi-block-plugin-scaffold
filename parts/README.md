---
title: Block Template Parts
description: Reusable template parts for WordPress block themes
category: Development
date: 2025-12-01
---

# Block Template Parts

Reusable template parts that can be included in block templates and patterns.

## Overview

This directory stores template parts following the WordPress block theme specification. Template parts are reusable sections that appear across multiple templates (e.g., header, footer, sidebar).

## File Structure

```
parts/
├── README.md           # This file
├── header.html         # Site header
├── footer.html         # Site footer
└── {name}.html         # Additional template parts
```

## Creating Template Parts

Template parts use HTML files with block markup:

```html
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:site-title /-->
    <!-- wp:navigation /-->
</div>
<!-- /wp:group -->
```

## Usage

### In Templates

Reference template parts using the Template Part block:

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- Main content -->

<!-- wp:template-part {"slug":"footer"} /-->
```

### In PHP

```php
// Output a template part
block_template_part( 'header' );
```

## Best Practices

1. **Keep parts focused** - One responsibility per part
2. **Use semantic HTML** - Proper HTML5 structure
3. **Include areas** - Define template part areas in theme.json
4. **Test responsively** - Ensure parts work on all devices
5. **Version control** - Commit template part changes

## References

- [Block Theme Handbook](https://developer.wordpress.org/themes/block-themes/)
- [Template Parts Documentation](https://developer.wordpress.org/themes/templates/template-parts/)
