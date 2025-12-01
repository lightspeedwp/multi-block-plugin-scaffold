---
title: Source Files
description: JavaScript, CSS, and SCSS source files for blocks and components
category: Development
date: 2025-12-01
---

# Source Files

This directory contains all source JavaScript, CSS, and SCSS files that are compiled into the plugin's frontend and editor assets.

## Overview

The `src/` directory organises source code by blocks, components, utilities, and styles. Files are compiled using [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/).

## Directory Structure

```
src/
├── README.md              # This file
├── blocks/                # Block-specific code
│   └── {block-name}/     # Individual block files
├── components/            # Shared React components
├── hooks/                 # Custom React hooks
├── scss/                  # Global SCSS styles
└── utils/                 # Utility functions
```

## Sub-directories

### `blocks/`

Each block has its own directory with editor and frontend files:

```
blocks/
└── example-block/
    ├── index.js          # Block registration
    ├── edit.js           # Editor component
    ├── save.js           # Save component
    ├── style.scss        # Frontend & editor styles
    └── editor.scss       # Editor-only styles
```

### `components/`

Shared React components used across multiple blocks:

```javascript
import { MyComponent } from '../../components/MyComponent';
```

### `hooks/`

Custom React hooks for reusable logic:

```javascript
import { useCustomHook } from '../../hooks/useCustomHook';
```

### `scss/`

Global SCSS files for theme-wide styles:

- `_variables.scss` - SCSS variables
- `_mixins.scss` - Reusable mixins
- `_functions.scss` - SCSS functions

### `utils/`

JavaScript utility functions:

```javascript
import { formatDate } from '../../utils/formatters';
```

## Build Process

```mermaid
flowchart LR
    subgraph Source["Source Files"]
        Blocks[blocks/**/*.js]
        Comp[components/**/*.js]
        SCSS[scss/**/*.scss]
        Utils[utils/**/*.js]
    end

    subgraph Build["Build Pipeline"]
        Webpack[Webpack]
        Babel[Babel]
        PostCSS[PostCSS]
        Terser[Terser]
    end

    subgraph Output["Build Output"]
        JS[build/**/*.js]
        CSS[build/**/*.css]
        Assets[build/**/*.asset.php]
    end

    Blocks --> Webpack
    Comp --> Webpack
    SCSS --> Webpack
    Utils --> Webpack

    Webpack --> Babel
    Webpack --> PostCSS
    Webpack --> Terser

    Babel --> JS
    PostCSS --> CSS
    Terser --> JS
    Webpack --> Assets

    style Source fill:#e3f2fd
    style Build fill:#fff3e0
    style Output fill:#e8f5e9
```

Source files are compiled using webpack via @wordpress/scripts:

```bash
# Development (watch mode)
npm run start

# Production build
npm run build
```

**Output:** Compiled files go to `build/` directory

## Best Practices

1. **Modular code** - Keep files small and focused
2. **Component reuse** - Extract shared components
3. **Proper imports** - Use ES6 modules
4. **Type safety** - Add JSDoc comments or TypeScript
5. **Code splitting** - Lazy load heavy components

## References

- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
