---
title: Block Modules
description: Individual block implementations for the plugin
category: Development
date: 2025-12-01
---

# Block Modules

Individual block implementations, each in its own directory with editor, save, and style files.

## Overview

Each block is a self-contained module with all necessary files for registration, editing, rendering, and styling.

## Block Structure

```
blocks/
└── example-block/
    ├── index.js       # Block registration and configuration
    ├── edit.js        # Editor component (React)
    ├── save.js        # Save component (static HTML output)
    ├── style.scss     # Frontend + editor styles
    ├── editor.scss    # Editor-only styles
    └── block.json     # Block metadata
```

## File Purposes

### `index.js`

Registers the block with WordPress:

```javascript
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
    edit,
    save,
} );
```

### `edit.js`

React component for the block editor interface:

```javascript
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
    const blockProps = useBlockProps();

    return (
        <div { ...blockProps }>
            {/* Editor UI */}
        </div>
    );
}
```

### `save.js`

Defines the static HTML saved to the database:

```javascript
import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const blockProps = useBlockProps.save();

    return (
        <div { ...blockProps }>
            {/* Saved HTML */}
        </div>
    );
}
```

### `style.scss`

Styles loaded on both frontend and editor.

### `editor.scss`

Styles loaded only in the block editor.

### `block.json`

Block metadata and configuration - the source of truth for block definition.

## Best Practices

1. **Use block.json** - Define all block config in block.json
2. **Dynamic blocks** - Use `render_callback` for server-side rendering
3. **Attributes** - Keep attributes minimal and semantic
4. **InnerBlocks** - Use for nested block support
5. **Accessibility** - Follow WCAG guidelines

## References

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [block.json Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
