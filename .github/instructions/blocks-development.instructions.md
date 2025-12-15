---
file_type: instructions
title: WordPress Block Development Guidelines
description: >-
  Comprehensive guide for developing WordPress blocks using modern patterns,
  block.json-first approach, and WordPress best practices
applyTo: '**/*.{js,jsx,ts,tsx,php}'
version: v3.0
last_updated: '2025-12-10'
owners:
  - LightSpeedWP Team
tags:
  - wordpress
  - blocks
  - gutenberg
  - plugin
  - development
  - react
domain: wp-core
stability: stable
references:
  - ../custom-instructions.md
---

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block plugin repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress plugin code.

# WordPress Block Development Guidelines

You are a block development guide. Follow our multi-block plugin architecture and WordPress block editor standards to plan, build, and refactor blocks. Avoid bespoke build steps or one-off patterns that diverge from the shared scaffold and generator.

## Overview

Modern WordPress block development using `@wordpress/scripts`, block.json-first approach, and best practices for maintainability, accessibility, and performance. This guide covers core block development patterns, registration, and implementation strategies.

## General Rules

- Build blocks with `block.json` as the single source of truth; avoid bespoke registration.
- Keep blocks focused and composable; prefer multiple small blocks over one monolith.
- Separate editor and front-end concerns; ensure scripts/styles are correctly scoped.
- Follow accessibility, security, and localisation standards from the linked instructions.
- Keep generated assets out of source control; work from `src/` and rely on the build pipeline.

## Detailed Guidance

## 📂 Related Instruction Files

For comprehensive block development, reference these specialized instruction files:

| File | Purpose | When to Use |
|------|---------|-------------|
| [block-json.instructions.md](./block-json.instructions.md) | Block metadata, attributes, variations | When creating/editing `block.json` files |
| [patterns-and-templates.instructions.md](./patterns-and-templates.instructions.md) | Pattern and template development | When creating block patterns |
| [javascript-react-development.instructions.md](./javascript-react-development.instructions.md) | React/JS patterns and hooks | When writing block components |
| [wpcs-php.instructions.md](./wpcs-php.instructions.md) | PHP coding standards | When writing dynamic blocks or PHP registration |
| [wpcs-javascript.instructions.md](./wpcs-javascript.instructions.md) | JavaScript coding standards | When writing any JavaScript code |
| [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) | Accessibility standards | When designing block UI or output |
| [testing-e2e.instructions.md](./testing-e2e.instructions.md) | End-to-end testing | When writing Playwright tests |
| [security.instructions.md](./security.instructions.md) | Security best practices | When handling user input or REST APIs |

---

## 1. Plugin Structure

### Root Files
- **`plugin-main-file.php`** — Main plugin file with header and block registration
- **`readme.txt` or `README.md`** — Plugin documentation, usage, and build instructions
- **`package.json`** — Build scripts and dependencies

### Directory Structure

```
my-block-plugin/
├── plugin-main-file.php        # Main plugin file
├── package.json                # Build configuration
├── src/                        # Source files (edit here)
│   ├── blocks/                 # Block definitions
│   │   ├── my-block/
│   │   │   ├── block.json      # Block metadata
│   │   │   ├── index.js        # Block registration
│   │   │   ├── edit.js         # Editor component
│   │   │   ├── save.js         # Frontend markup
│   │   │   ├── style.scss      # Frontend + editor styles
│   │   │   ├── editor.scss     # Editor-only styles
│   │   │   └── view.js         # Frontend interactivity (optional)
│   │   └── another-block/
│   ├── components/             # Reusable React components
│   ├── utils/                  # Utility functions
│   └── index.js                # Entry point
├── build/                      # Compiled output (DO NOT EDIT)
├── assets/                     # Images, icons, SVGs
└── inc/                        # PHP includes
    └── blocks.php              # Block registration logic
```

### Best Practices

- **Never edit `build/` directly** — Always work in `src/` and rebuild
- Use `.gitignore` to exclude `node_modules/` and `build/`
- Keep one block per subdirectory under `src/blocks/`
- Separate editor and frontend assets
- Use semantic file naming

---

## 2. Build Process

### Recommended Tools

Use `@wordpress/scripts` for modern WordPress block development:

```json
{
  "scripts": {
    "dev": "wp-scripts start",
    "build": "wp-scripts build",
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "format": "wp-scripts format",
    "test:unit": "wp-scripts test-unit-js"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0"
  }
}
```

### Workflow

1. **Development**: Run `npm run dev` for live rebuilding
2. **Production**: Run `npm run build` for optimized output
3. **Linting**: Run `npm run lint:js` and `npm run lint:style`
4. **Formatting**: Run `npm run format` before committing

### What `@wordpress/scripts` Provides

- ✅ Webpack configuration
- ✅ Babel transpilation (ES6+ → ES5)
- ✅ SCSS → CSS compilation
- ✅ Asset optimization
- ✅ Dependency extraction
- ✅ ESLint & Stylelint setup
- ✅ Jest testing framework

---

## 3. Block Registration

### Using block.json (Modern Approach)

**Always use `block.json`** for block metadata and registration. See [block-json.instructions.md](./block-json.instructions.md) for comprehensive guidance.

**Minimal `block.json`:**

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "myplugin/my-block",
  "title": "My Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "A clear description of what this block does",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "version": "1.0.0",
  "textdomain": "myplugin",
  "editorScript": "file:./build/index.js",
  "editorStyle": "file:./build/index.css",
  "style": "file:./build/style-index.css"
}
```

### PHP Registration

Register blocks in PHP using `register_block_type()`:

```php
<?php
/**
 * Register blocks
 */
function myplugin_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/my-block' );
}
add_action( 'init', 'myplugin_register_blocks' );
```

### JavaScript Registration

```javascript
// src/blocks/my-block/index.js
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
    edit: Edit,
    save,
} );
```

---

## 4. Block Editor Component (edit.js)

### Functional Component Pattern

```javascript
/**
 * WordPress dependencies
 */
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
    RichText,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    ToolbarGroup,
    ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Edit component for the block
 *
 * @param {Object} props Block properties
 * @param {Object} props.attributes Block attributes
 * @param {Function} props.setAttributes Attribute setter
 * @param {string} props.clientId Block client ID
 * @returns {Element} Edit element
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
    const { content, showTitle, alignment } = attributes;

    const blockProps = useBlockProps( {
        className: `align-${ alignment }`,
    } );

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="align-left"
                        label={ __( 'Align Left', 'myplugin' ) }
                        isActive={ alignment === 'left' }
                        onClick={ () => setAttributes( { alignment: 'left' } ) }
                    />
                    <ToolbarButton
                        icon="align-center"
                        label={ __( 'Align Center', 'myplugin' ) }
                        isActive={ alignment === 'center' }
                        onClick={ () => setAttributes( { alignment: 'center' } ) }
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'myplugin' ) }>
                    <ToggleControl
                        label={ __( 'Show Title', 'myplugin' ) }
                        checked={ showTitle }
                        onChange={ ( value ) => setAttributes( { showTitle: value } ) }
                    />
                    <SelectControl
                        label={ __( 'Alignment', 'myplugin' ) }
                        value={ alignment }
                        options={ [
                            { label: __( 'Left', 'myplugin' ), value: 'left' },
                            { label: __( 'Center', 'myplugin' ), value: 'center' },
                            { label: __( 'Right', 'myplugin' ), value: 'right' },
                        ] }
                        onChange={ ( value ) => setAttributes( { alignment: value } ) }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                { showTitle && (
                    <RichText
                        tagName="h2"
                        value={ content }
                        onChange={ ( value ) => setAttributes( { content: value } ) }
                        placeholder={ __( 'Enter title...', 'myplugin' ) }
                    />
                ) }
            </div>
        </>
    );
}
```

### Best Practices for Edit Components

- ✅ Use `useBlockProps()` for wrapper attributes
- ✅ Organize controls: `BlockControls` (toolbar), `InspectorControls` (sidebar)
- ✅ Use `RichText` for user-editable content
- ✅ Validate and sanitize inputs
- ✅ Provide clear placeholders and labels
- ✅ Test with keyboard navigation
- ✅ Follow accessibility guidelines

---

## 5. Block Save Component (save.js)

### Static Rendering

```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Save component for the block
 *
 * @param {Object} props Block properties
 * @param {Object} props.attributes Block attributes
 * @returns {Element} Saved block element
 */
export default function save( { attributes } ) {
    const { content, showTitle, alignment } = attributes;

    const blockProps = useBlockProps.save( {
        className: `align-${ alignment }`,
    } );

    return (
        <div { ...blockProps }>
            { showTitle && (
                <RichText.Content tagName="h2" value={ content } />
            ) }
        </div>
    );
}
```

### Best Practices for Save Components

- ✅ Use `useBlockProps.save()` for wrapper attributes
- ✅ Keep markup minimal and semantic
- ✅ Match editor structure when possible
- ✅ Avoid logic — keep it presentational
- ✅ Use `RichText.Content` for rich text output
- ✅ Ensure valid HTML output

---

## 6. Dynamic Blocks (PHP Rendering)

For blocks that need server-side rendering or dynamic data:

### register with render callback

```json
{
  "render": "file:./render.php"
}
```

### PHP Render Callback

```php
<?php
/**
 * Render callback for dynamic block
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 * @return string Rendered block markup
 */

$alignment = $attributes['alignment'] ?? 'left';
$show_title = $attributes['showTitle'] ?? true;
$content = $attributes['content'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes( [
    'class' => 'align-' . esc_attr( $alignment ),
] );
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ( $show_title && ! empty( $content ) ) : ?>
        <h2><?php echo wp_kses_post( $content ); ?></h2>
    <?php endif; ?>
</div>
```

### When to Use Dynamic Blocks

- ✅ Fetching post data or custom queries
- ✅ User-specific content (requires authentication)
- ✅ Real-time data (latest posts, comments, etc.)
- ✅ Complex server-side logic
- ✅ SEO-critical content that must be in HTML

### Dynamic Block Best Practices

- ✅ Validate and sanitize attributes
- ✅ Escape all output (`esc_html`, `esc_attr`, `wp_kses_post`)
- ✅ Use efficient queries (avoid N+1 problems)
- ✅ Cache when appropriate
- ✅ Handle edge cases gracefully (empty data, missing posts, etc.)

---

## 7. Block Supports

Leverage WordPress core features instead of custom controls:

```json
{
  "supports": {
    "align": ["left", "center", "right", "wide", "full"],
    "alignWide": true,
    "anchor": true,
    "color": {
      "background": true,
      "text": true,
      "gradients": true,
      "link": true
    },
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true
    },
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "fontFamily": true,
      "fontWeight": true
    },
    "html": false,
    "inserter": true,
    "multiple": true,
    "reusable": true,
    "lock": true
  }
}
```

### Benefits of Block Supports

- ✅ Consistent UI across all blocks
- ✅ Automatic accessibility features
- ✅ Reduced custom code
- ✅ Theme.json integration
- ✅ Future WordPress compatibility

---

## 8. Block Variations

Define variations in `block.json`:

```json
{
  "variations": [
    {
      "name": "default",
      "title": "Default Style",
      "isDefault": true,
      "attributes": {
        "alignment": "left"
      }
    },
    {
      "name": "centered",
      "title": "Centered Style",
      "icon": "align-center",
      "attributes": {
        "alignment": "center",
        "showTitle": true
      },
      "scope": ["block", "inserter"]
    }
  ]
}
```

See [block-json.instructions.md](./block-json.instructions.md#block-variations) for comprehensive variation guidance.

---

## 9. Frontend Interactivity

### View Script (view.js)

For client-side interactivity on the frontend:

```javascript
import domReady from '@wordpress/dom-ready';

domReady( () => {
    const blocks = document.querySelectorAll( '.wp-block-myplugin-my-block' );

    blocks.forEach( ( block ) => {
        const button = block.querySelector( '.my-button' );
        if ( button ) {
            button.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                // Handle interaction
                block.classList.toggle( 'is-active' );
            } );
        }
    } );
} );
```

### Interactivity API (WordPress 6.5+)

For complex interactive blocks, use the WordPress Interactivity API:

```javascript
import { store, getContext } from '@wordpress/interactivity';

store( 'myplugin/my-block', {
    actions: {
        toggle: () => {
            const context = getContext();
            context.isOpen = ! context.isOpen;
        },
    },
    callbacks: {
        logIsOpen: () => {
            const { isOpen } = getContext();
            console.log( 'Is open:', isOpen );
        },
    },
} );
```

---

## 10. Asset Handling

### Version Assets for Cache Busting

```php
<?php
function myplugin_enqueue_block_assets() {
    $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

    wp_enqueue_script(
        'myplugin-block-editor',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version'],
        true
    );

    wp_enqueue_style(
        'myplugin-block-editor',
        plugins_url( 'build/index.css', __FILE__ ),
        [],
        $asset_file['version']
    );
}
add_action( 'enqueue_block_editor_assets', 'myplugin_enqueue_block_assets' );
```

### Conditional Enqueuing

Only load assets when the block is present:

```php
<?php
function myplugin_enqueue_frontend_assets() {
    if ( has_block( 'myplugin/my-block' ) ) {
        wp_enqueue_style(
            'myplugin-block-style',
            plugins_url( 'build/style-index.css', __FILE__ ),
            [],
            filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
        );

        wp_enqueue_script(
            'myplugin-block-view',
            plugins_url( 'build/view.js', __FILE__ ),
            [],
            filemtime( plugin_dir_path( __FILE__ ) . 'build/view.js' ),
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'myplugin_enqueue_frontend_assets' );
```

---

## 11. Internationalization (i18n)

### JavaScript Translations

```javascript
import { __ } from '@wordpress/i18n';

// Simple translation
__( 'Hello World', 'myplugin' );

// With sprintf
sprintf( __( 'Welcome, %s!', 'myplugin' ), userName );

// Plural forms
_n( 'One item', '%d items', count, 'myplugin' );

// With context
_x( 'Post', 'noun', 'myplugin' );
```

### PHP Translations

```php
<?php
// Simple translation
esc_html__( 'Hello World', 'myplugin' );

// Echo translation
esc_html_e( 'Save Changes', 'myplugin' );

// With context
esc_html_x( 'Post', 'noun', 'myplugin' );
```

### Load Script Translations

```php
<?php
function myplugin_set_script_translations() {
    wp_set_script_translations(
        'myplugin-block-editor',
        'myplugin',
        plugin_dir_path( __FILE__ ) . 'languages'
    );
}
add_action( 'enqueue_block_editor_assets', 'myplugin_set_script_translations' );
```

---

## 12. Accessibility & Performance

### Accessibility

- ✅ Use semantic HTML elements (`<button>`, `<nav>`, `<article>`)
- ✅ Provide ARIA attributes when needed
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers
- ✅ Follow WCAG 2.2 AA standards
- ✅ Provide descriptive labels and titles

See [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) for comprehensive guidance.

### Performance

- ✅ Minimize bundle size (code splitting, tree shaking)
- ✅ Optimize images and assets
- ✅ Lazy load heavy dependencies
- ✅ Use efficient queries (avoid N+1)
- ✅ Cache when appropriate
- ✅ Test on various devices

---

## 13. Testing

### Manual Testing Checklist

- [ ] Block inserts without errors
- [ ] Attributes save and load correctly
- [ ] Block supports work as expected
- [ ] Variations display properly
- [ ] Accessibility requirements met (keyboard, screen reader)
- [ ] RTL layout works correctly
- [ ] Mobile responsive
- [ ] Performance acceptable

### Automated Testing

See [testing-e2e.instructions.md](./testing-e2e.instructions.md) for Playwright E2E testing guidance.

---

## 14. Security

### Input Validation & Sanitization

- ✅ Validate all attribute values
- ✅ Sanitize user input on save
- ✅ Check user capabilities
- ✅ Use nonces for AJAX requests
- ✅ Escape output appropriately

### Output Escaping

```php
<?php
// Text content
echo esc_html( $text );

// HTML content (preserving safe tags)
echo wp_kses_post( $html );

// Attributes
echo esc_attr( $attribute );

// URLs
echo esc_url( $url );
```

See [security.instructions.md](./security.instructions.md) for comprehensive security guidance.

---

## 15. Example Build Scripts (package.json)

```json
{
  "name": "my-block-plugin",
  "version": "1.0.0",
  "scripts": {
    "dev": "wp-scripts start",
    "build": "wp-scripts build",
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "format": "wp-scripts format",
    "test:unit": "wp-scripts test-unit-js",
    "plugin-zip": "wp-scripts plugin-zip"
  },
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0"
  }
}
```

---

## ⚠️ Important Reminders

- **Never edit built files directly** — Always keep source and build output separate
- **This instruction set is for WordPress repositories only** — Do not apply to non-WordPress projects
- **Always check for updates** — Reference the dynamic file paths for the latest instruction files
- **Follow WordPress coding standards** — See wpcs-* files for detailed standards
- **Test thoroughly** — Manual and automated testing prevents issues

---

## Examples

Use the patterns below as reference implementations.

### Common Block Patterns

```javascript
// 1. Simple static block
registerBlockType( metadata.name, {
    edit: Edit,
    save,
} );

// 2. Dynamic block (server-rendered)
registerBlockType( metadata.name, {
    edit: Edit,
    save: () => null, // No save function for dynamic blocks
} );

// 3. Block with InnerBlocks
import { InnerBlocks } from '@wordpress/block-editor';

function Edit() {
    return <InnerBlocks />;
}

function save() {
    return <InnerBlocks.Content />;
}
```

### Common Hooks

```javascript
// WordPress hooks
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';

// React hooks
import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
```

## Validation

- Run `npm run lint` and `npm test` for JS/TS and PHP linting/tests referenced by blocks.
- Run `npm run build` to ensure assets compile and block.json file handles exist.
- Use `npm run format` (or equivalent) to maintain formatting consistency.
- For dynamic blocks, hit render endpoints or E2E tests to confirm server output.

---
