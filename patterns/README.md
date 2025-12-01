---
title: Block Patterns
description: Predefined block layouts and content structures
category: Development
date: 2025-12-01
---

# Block Patterns

This directory contains block patterns - predefined combinations of blocks that users can insert and customise.

## Overview

Block patterns provide ready-to-use layouts and content structures. Users can insert patterns into posts/pages and customise them as needed.

## File Structure

```
patterns/
├── README.md                     # This file
├── example-pattern.php           # Example pattern
└── {pattern-name}.php            # Additional patterns
```

## Creating Patterns

Register patterns using `register_block_pattern()`:

```php
<?php
/**
 * Pattern Name: Example Pattern
 * Pattern Slug: {{slug}}/example-pattern
 * Pattern Categories: featured
 */

register_block_pattern(
    '{{slug}}/example-pattern',
    array(
        'title'       => __( 'Example Pattern', '{{textdomain}}' ),
        'description' => __( 'A pattern description.', '{{textdomain}}' ),
        'categories'  => array( 'featured' ),
        'content'     => '<!-- wp:heading --><h2>Pattern Content</h2><!-- /wp:heading -->',
    )
);
```

## Pattern Categories

Common categories:

- `featured` - Highlighted patterns
- `text` - Text-focused content
- `columns` - Multi-column layouts
- `buttons` - Button collections
- `header` - Header designs
- `footer` - Footer designs
- `call-to-action` - CTA sections
- `testimonials` - Testimonial layouts

## Best Practices

1. **Provide previews** - Include descriptive titles and keywords
2. **Use core blocks** - Prefer core blocks for compatibility
3. **Internationalise** - Wrap all text in i18n functions
4. **Test insertion** - Verify patterns work in editor
5. **Document patterns** - Add pattern headers for clarity

## References

- [Block Pattern Documentation](https://developer.wordpress.org/themes/features/block-patterns/)
- [Pattern Directory](https://wordpress.org/patterns/)
