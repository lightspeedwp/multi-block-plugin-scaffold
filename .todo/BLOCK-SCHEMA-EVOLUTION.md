---
title: WordPress Block.json Schema Evolution (6.6 → 6.9)
description: Analysis of schema changes and new features introduced across WordPress versions
category: Reference
type: Guide
audience: Block Developers
date: 2025-12-07
---

## WordPress Block.json Schema Evolution: 6.6 → 6.9

## Executive Summary

The WordPress block.json schema has evolved from 6.6 to 6.9 with improvements to validation, better API version handling, and new typography features for responsive text sizing.

---

## Version-by-Version Changes

### WordPress 6.6 → 6.7

**Schema Version Upgrade:**

```
6.6: "http://json-schema.org/draft-04/schema#"
6.7: "http://json-schema.org/draft-07/schema#"
```

This upgrade provides:

- Better keyword support for validation
- Improved format validation
- More accurate schema definitions

**New Feature: Attribute `role` Field**

```json
{
  "attributes": {
    "myAttribute": {
      "type": "string",
      "role": "content"
    }
  }
}
```

**Supported Roles:**

- `content` - User-editable content (saved in block markup)
- `local` - Temporary attribute (not persisted)

**Use Cases:**

- Mark which attributes contain core user content
- Mark temporary editor state (UI-only, not saved)
- Better semantic understanding of block data

### WordPress 6.7 → 6.8

**No Breaking Changes**

Version 6.8 maintained schema compatibility with 6.7. Focus was on Gutenberg improvements rather than schema changes.

### WordPress 6.8 → 6.9

**API Version Best Practice Update:**

```json
6.8: "apiVersion": { "type": "integer", "enum": [1, 2, 3], "default": 1 }
6.9: "apiVersion": { "type": "integer", "const": 3 }
```

Changed from `enum` with `default: 1` to `const: 3`, recommending all new blocks use API version 3.

**New Feature: Typography `fitText`**

```json
{
  "supports": {
    "typography": {
      "fitText": true
    }
  }
}
```

**What It Does:**

- Enables automatic font-size adjustment to fit container
- Responsive text sizing without manual breakpoints
- Useful for headlines, hero sections, dynamic content
- Respects theme-defined size constraints

**Use Cases:**

- Responsive hero blocks
- Title blocks that adapt to container width
- Dynamic content blocks (testimonials, quotes)
- Navigation with space constraints

---

## Feature Comparison Matrix

| Feature | 6.6 | 6.7 | 6.8 | 6.9 |
|---------|-----|-----|-----|-----|
| attributes.role | ❌ | ✅ | ✅ | ✅ |
| typography.fitText | ❌ | ❌ | ❌ | ✅ |
| $schema draft-07 | ❌ | ✅ | ✅ | ✅ |
| apiVersion as const | ❌ | ❌ | ❌ | ✅ |

---

## Implementation Guide

### Updating to 6.9 Schema

**1. Update $schema Reference**

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/block.json"
}
```

**2. Set API Version 3 (Recommended)**

```json
{
  "apiVersion": 3
}
```

Why API v3?

- Recommended for all new blocks
- Required for iframe block editor (planned future standard)
- Better security and isolation
- Supports latest block features

**3. Add role to Content Attributes**

For user-editable content:

```json
{
  "attributes": {
    "title": {
      "type": "string",
      "role": "content",
      "source": "text",
      "selector": "h2"
    },
    "description": {
      "type": "string",
      "role": "content",
      "source": "html",
      "selector": ".description"
    }
  }
}
```

For temporary editor state:

```json
{
  "attributes": {
    "isEditingTitle": {
      "type": "boolean",
      "role": "local",
      "default": false
    },
    "selectedImageId": {
      "type": "number",
      "role": "local"
    }
  }
}
```

**4. Add Typography Fit-Text Support**

For responsive headline/title blocks:

```json
{
  "supports": {
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "fitText": true
    }
  }
}
```

#### JavaScript/Edit Component Integration

When `fitText` is enabled:

1. WordPress adds a "Fit text" UI control in the typography sidebar
2. User can toggle responsive font sizing
3. Block receives `style.typography.fitText` attribute
4. Frontend CSS handles sizing automatically via theme

---

## Multi-Block Plugin Scaffold Updates

### Standard Block Configuration (6.9)

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/block.json",
  "apiVersion": 3,
  "name": "{{namespace}}/{{block-name}}",
  "title": "{{block-title}}",
  "category": "{{slug}}",
  "description": "{{block-description}}",
  "icon": "{{block-icon}}",
  "keywords": ["{{slug}}", "block"],

  "attributes": {
    "title": {
      "type": "string",
      "role": "content",
      "source": "text",
      "selector": "h2"
    },
    "description": {
      "type": "string",
      "role": "content",
      "source": "html",
      "selector": ".description"
    },
    "isEditingTitle": {
      "type": "boolean",
      "role": "local",
      "default": false
    }
  },

  "supports": {
    "align": ["wide", "full"],
    "anchor": true,
    "color": {
      "background": true,
      "text": true,
      "link": false
    },
    "dimensions": {
      "aspectRatio": true,
      "minHeight": true
    },
    "spacing": {
      "margin": ["top", "bottom"],
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "fitText": true
    }
  },

  "selectors": {
    "root": ".{{namespace}}-{{block-name}}",
    "color": {
      "text": ".{{namespace}}-{{block-name}}__text",
      "background": ".{{namespace}}-{{block-name}}"
    },
    "typography": {
      "fontSize": ".{{namespace}}-{{block-name}}__title"
    }
  }
}
```

### Collection Block with Query (6.9)

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/block.json",
  "apiVersion": 3,
  "name": "{{namespace}}/{{collection-block}}",
  "title": "{{name}} Collection",

  "attributes": {
    "query": {
      "type": "object",
      "role": "content",
      "default": {
        "postType": "{{cpt-slug}}",
        "perPage": 9,
        "pages": 0,
        "offset": 0,
        "orderBy": "date",
        "order": "desc"
      }
    },
    "layout": {
      "type": "object",
      "role": "local",
      "default": {
        "type": "grid",
        "columnCount": 3
      }
    }
  },

  "supports": {
    "layout": {
      "default": {
        "type": "grid",
        "columnCount": 3
      }
    }
  }
}
```

### Slider Block with FitText (6.9)

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/block.json",
  "apiVersion": 3,
  "name": "{{namespace}}/{{slider-block}}",
  "title": "{{name}} Slider",

  "attributes": {
    "sliderHeight": {
      "type": "string",
      "role": "local",
      "default": "500px"
    },
    "autoplay": {
      "type": "boolean",
      "role": "content",
      "default": false
    }
  },

  "supports": {
    "dimensions": {
      "aspectRatio": true,
      "minHeight": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    },
    "typography": {
      "fontSize": true,
      "fitText": true
    }
  }
}
```

---

## Migration Checklist

- [ ] Update $schema to `https://schemas.wp.org/wp/6.9/block.json`
- [ ] Verify apiVersion is set to 3
- [ ] Add `role: "content"` to user-editable attributes
- [ ] Add `role: "local"` to editor state attributes
- [ ] Add `typography.fitText: true` to text-based blocks
- [ ] Test blocks in block editor
- [ ] Validate block.json files against 6.9 schema
- [ ] Update block documentation with new features
- [ ] Test responsive typography on different screen sizes

---

## Testing New Features

### FitText Support

```php
// In render.php or edit.js
if ( isset( $attributes['style']['typography']['fitText'] ) && $attributes['style']['typography']['fitText'] ) {
    $class_name = $block->classname . ' has-fit-text';
}
```

### CSS Support

```css
.wp-block-{{namespace}}-{{block}} {
    /* FitText automatically handles sizing */
    /* Respects theme.json typography settings */
}

.wp-block-{{namespace}}-{{block}}.has-fit-text {
    /* User enabled fit-text via UI */
    resize: both;
}
```

---

## Related Documentation

- [WordPress Block API Versions](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/)
- [Block Metadata Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [Schema Reference Files](../docs/config/)

---

## Summary

The 6.9 schema evolution introduces:

1. **Better Semantic Understanding** - `role` field clarifies attribute purpose
2. **Responsive Typography** - `fitText` enables adaptive font sizing
3. **API v3 Recommendation** - Clear guidance for modern block development
4. **Improved Validation** - draft-07 JSON Schema for more robust checking

Implementing these features enhances block flexibility, improves user experience, and future-proofs your blocks for WordPress 7.0+.
