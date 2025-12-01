---
title: "{{name}} - Instructions for Agents"
version: "{{version}}"
last_updated: "2024-10-18"
author: "{{author}}"
description: "Comprehensive instructions for AI agents working with {{name}}"
type: "documentation"
---

# Agent Instructions for {{name}}

This document provides comprehensive instructions for AI agents (like GitHub Copilot, ChatGPT, Claude, etc.) when working with the {{name}} multi-block plugin codebase.

## Overview & Related Files

**Related Files:**

- [Custom Instructions](../custom-instructions.md) — main AI/Copilot and plugin instructions
- [Chat Modes](../chatmodes/chatmodes.md) — context-specific Copilot prompts
- [Prompts](../prompts/prompts.md) — prompt templates for consistent output
- [Main Agent Index](../agents/agent.md) — agent specs and usage
- [Global AI Rules (AGENTS.md)](../../AGENTS.md) — org-wide agent rules and coding standards

**Dynamic References:**

- All instruction files: [`*.instructions.md`](../instructions/) (current directory)
- All agent files: [`*.agent.md`](../agents/) and [`*.agent.js`](../agents/)
- All prompt files: [`*.prompt.md`](../prompts/)
- All chatmode files: [`*.md`](../chatmodes/)

---

## Project Overview

{{name}} is a WordPress multi-block plugin that provides {{description}}. The plugin follows WordPress and LightSpeed development standards and uses modern development practices.

### Key Technologies

- **WordPress 6.5+** - Block Editor (Gutenberg), Block Bindings API
- **React 18+** - Frontend framework for block components
- **PHP 8.0+** - Server-side functionality
- **SCSS** - Styling with WordPress design system
- **Jest** - JavaScript unit testing
- **PHPUnit** - PHP unit testing
- **Playwright** - End-to-end testing
- **Secure Custom Fields** - Field management

## Template System

This is a mustache-template-based scaffold. All files contain placeholders that should be replaced when creating a new plugin:

### Placeholder Mapping

```javascript
const placeholders = {
 '{{slug}}': 'my-awesome-plugin',           // Plugin slug (kebab-case)
 '{{namespace}}': 'mycompany',              // Namespace (kebab-case)
 '{{author}}': 'John Doe',                  // Author name
 '{{description}}': 'An awesome plugin',    // Plugin description
 '{{license}}': 'GPL-3.0-or-later',         // Licence identifier
 '{{textdomain}}': 'my-awesome-plugin',     // WordPress text domain
 '{{version}}': '1.0.0',                    // Plugin version
 '{{name}}': 'My Awesome Plugin',           // Human-readable name
 '{{name_singular}}': 'Item',               // Singular post type name
 '{{name_plural}}': 'Items',                // Plural post type name
 '{{taxonomy_singular}}': 'Category',       // Taxonomy singular
 '{{taxonomy_plural}}': 'Categories',       // Taxonomy plural
};
```

## File Structure Understanding

```
{{slug}}/
├── src/                        # Source files
│   ├── blocks/                # Block source directories
│   │   ├── {{slug}}-card/
│   │   ├── {{slug}}-collection/
│   │   ├── {{slug}}-slider/
│   │   └── {{slug}}-featured/
│   ├── components/            # Shared React components
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   └── scss/                  # Global styles
├── inc/                       # PHP includes
│   ├── class-post-types.php
│   ├── class-taxonomies.php
│   ├── class-fields.php
│   ├── class-repeater-fields.php
│   ├── class-block-templates.php
│   ├── class-block-bindings.php
│   └── class-patterns.php
├── patterns/                  # Block patterns
├── templates/                 # Block templates
├── parts/                     # Template parts
├── bin/                       # Build scripts
├── tests/                     # Test files
├── .github/                   # GitHub configuration
├── docs/                      # Documentation
└── [config files]            # Various configuration files
```

## Development Guidelines for Agents

### When Creating New Files

1. **Always use mustache placeholders** in new files
2. **Follow WordPress coding standards** strictly
3. **Include proper file headers** with package information
4. **Add appropriate comments** and documentation
5. **Ensure accessibility** compliance (WCAG 2.1 AA)

### File Header Templates

#### PHP Files

```php
<?php
/**
 * Brief description of file purpose.
 *
 * @package {{namespace}}
 * @since   {{version}}
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
 exit;
}
```

#### JavaScript Files

```javascript
/**
 * Brief description of file purpose.
 *
 * @package {{namespace}}
 */
```

### Security Best Practices

#### Input Sanitisation

```php
// Sanitise text input
$text = sanitize_text_field( $input );

// Sanitise HTML content
$html = wp_kses_post( $input );

// Sanitise URLs
$url = esc_url( $input );
```

#### Output Escaping

```php
// Escape HTML output
echo esc_html( $content );

// Escape attributes
echo '<div class="' . esc_attr( $class ) . '">';

// Escape URLs
echo '<a href="' . esc_url( $url ) . '">';
```

### Internationalisation (i18n)

#### JavaScript

```javascript
import { __ } from '@wordpress/i18n';

// Basic translation
const text = __( 'Hello World', '{{textdomain}}' );

// With context
const text = _x( 'Post', 'noun', '{{textdomain}}' );
```

#### PHP

```php
// Basic translation
$text = __( 'Hello World', '{{textdomain}}' );

// Escaped output
echo esc_html__( 'Hello World', '{{textdomain}}' );
```

## Common Tasks and How to Handle Them

### Adding a New Block

1. Create block directory in `src/blocks/{{slug}}-{block-name}/`
2. Add block.json with metadata
3. Create edit.js, save.js, render.php, style.scss
4. Register block in main index.js (auto-registered via glob)
5. Test in Block Editor

### Adding Custom Fields

1. Add field group in `inc/class-fields.php`
2. Use `acf_add_local_field_group()` API
3. For repeaters, use `inc/class-repeater-fields.php`
4. Implement block binding if displaying in blocks
5. Test field functionality

### Adding a Block Pattern

1. Create pattern file in `patterns/{{slug}}-{pattern-name}.php`
2. Include proper header comments (Title, Slug, Categories, etc.)
3. Pattern is auto-registered via `inc/class-patterns.php`
4. Test pattern insertion

## Success Criteria

A successful implementation should:

✅ **Follow WordPress coding standards** completely
✅ **Work across all supported browsers** and devices
✅ **Be fully accessible** (WCAG 2.1 AA)
✅ **Include comprehensive tests** (unit, integration, E2E)
✅ **Have complete documentation** with examples
✅ **Use mustache placeholders** consistently
✅ **Handle errors gracefully** with user feedback
✅ **Perform well** on slower devices/connections

Remember: When in doubt, prioritise accessibility, security, and following WordPress best practices!
