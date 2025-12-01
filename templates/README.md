---
title: Block Templates
description: Full-page block templates for WordPress
category: Development
date: 2025-12-01
---

# Block Templates

Full-page templates defining the structure and layout of different page types.

## Overview

This directory contains block templates that define the complete structure for various WordPress templates (home, single, archive, etc.).

## File Structure

```
templates/
├── README.md                  # This file
├── index.html                 # Fallback template
├── home.html                  # Homepage template
├── single.html                # Single post template
├── archive.html               # Archive template
└── {template-name}.html       # Additional templates
```

## Creating Templates

Templates use HTML files with block markup:

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:post-title /-->
    <!-- wp:post-content /-->
</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

## Template Hierarchy

WordPress follows this template hierarchy:

1. **Custom template** - Assigned via editor
2. **Specific template** - `single-{post-type}.html`
3. **General template** - `single.html`
4. **Fallback** - `index.html`

## Best Practices

1. **Use template parts** - Reuse header/footer parts
2. **Test all contexts** - Verify templates work for all content
3. **Responsive design** - Ensure mobile compatibility
4. **Semantic structure** - Use proper HTML5 landmarks
5. **Performance** - Optimise for speed

## References

- [Block Templates](https://developer.wordpress.org/themes/templates/)
- [Template Hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/)
