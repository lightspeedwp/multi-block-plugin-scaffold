---
title: Documentation Index
description: Comprehensive documentation index and navigation guide
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

Comprehensive documentation for the {{name}} single block plugin scaffold.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Getting["Getting Started"]
        Generate["GENERATE-PLUGIN.md<br/>Plugin Generation"]
        Validation["VALIDATION.md<br/>Template Validation"]
    end

    subgraph Development["Development"]
        Build["BUILD-PROCESS.md<br/>Build System"]
        Source["FOLDER-STRUCTURE.md<br/>Source Files"]
        I18n["INTERNATIONALIZATION.md<br/>Translations"]
    end

    subgraph Tools["Tools & Configuration"]
        ToolConfigs["CONFIGS.md<br/>Tool Overview"]
        Config["config/<br/>Detailed Configs"]
    end

    Generate --> Validation
    Validation --> Build
    Build --> Source
    Source --> I18n
    ToolConfigs --> Config
```

## Quick Start

New to this scaffold? Start here:

1. 📖 [Plugin Generation Guide](./GENERATE-PLUGIN.md) - How to create a plugin from this scaffold
2. 🎯 [Setup Summary](./SETUP-SUMMARY.md) - Overview of what's configured
3. ✅ [Template Validation](./VALIDATION.md) - Valid mustache templates
4. 🏗️ [Build Process](./BUILD-PROCESS.md) - Understanding the build system
5. 📚 [API Reference](./API_REFERENCE.md) - Complete API documentation

## Documentation Structure

### Getting Started

| Document | Description |
|----------|-------------|
| [GENERATE-PLUGIN.md](./GENERATE-PLUGIN.md) | Complete guide to generating a plugin from this scaffold |
| [SETUP-SUMMARY.md](./SETUP-SUMMARY.md) | Overview of completed setup tasks and configurations |
| [VALIDATION.md](./VALIDATION.md) | Validation report for mustache templates used in the scaffold |

### Development Guides

| Document | Description |
|----------|-------------|
| [BUILD-PROCESS.md](./BUILD-PROCESS.md) | Complete build process documentation with webpack, Babel, and asset compilation |
| [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) | Source directory structure and block file organization |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Translation and localization guide for blocks |

### wp-scripts Documentation

Detailed documentation for `@wordpress/scripts` build system:

| Document | Description |
|----------|-------------|
| [WP-SCRIPTS-SUMMARY.md](./WP-SCRIPTS-SUMMARY.md) | Overview of wp-scripts configuration and features |
| [WP-SCRIPTS-CONFIGURATION.md](./WP-SCRIPTS-CONFIGURATION.md) | Complete configuration guide for wp-scripts |
| [WP-SCRIPTS-QUICK-REFERENCE.md](./WP-SCRIPTS-QUICK-REFERENCE.md) | Quick reference for common commands and patterns |

### Tool Configuration

| Document | Description |
|----------|-------------|
| [CONFIGS.md](./CONFIGS.md) | Overview of all development tools and their purposes |
| [config/](./config/) | Detailed configuration guides for individual tools |

### Security & Best Practices

| Document | Description |
|----------|-------------|
| [SECURITY-NONCE.md](./SECURITY-NONCE.md) | Nonce utilities for secure AJAX and form handling |
| [SECURITY-HEADERS.md](./SECURITY-HEADERS.md) | Security headers and content security policies |
| [DEPRECATION.md](./DEPRECATION.md) | Deprecation workflow for functions and hooks |
| [DB-MIGRATION.md](./DB-MIGRATION.md) | Database migration system documentation |

### Performance & Quality

| Document | Description |
|----------|-------------|
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance monitoring with Lighthouse CI and bundle analysis |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference for PHP and JavaScript |

## Configuration Files

The `config/` directory contains detailed documentation for each tool:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Build["Build Tools"]
        Webpack["webpack.md"]
        Babel["babel.md"]
        PostCSS["postcss.md"]
    end

    subgraph Quality["Code Quality"]
        ESLint["eslint.md"]
        Stylelint["stylelint.md"]
        Prettier["prettier.md"]
        NPMLint["npm-package-json-lint.md"]
    end

    subgraph Testing["Testing Tools"]
        Jest["jest.md"]
        Playwright["playwright.md"]
    end

    Build --> Quality
    Quality --> Testing
```

### Available Configuration Guides

- [babel.md](./config/babel.md) - Babel transpilation configuration
- [eslint.md](./config/eslint.md) - JavaScript linting rules
- [jest.md](./config/jest.md) - JavaScript testing configuration
- [npm-package-json-lint.md](./config/npm-package-json-lint.md) - Package.json validation
- [playwright.md](./config/playwright.md) - End-to-end testing setup
- [postcss.md](./config/postcss.md) - CSS processing and optimization
- [prettier.md](./config/prettier.md) - Code formatting rules
- [stylelint.md](./config/stylelint.md) - CSS/SCSS linting configuration
- [webpack.md](./config/webpack.md) - Module bundling configuration

## Common Tasks

### Development Workflow

```bash
# Install dependencies
npm install

# Start development server with watch mode
npm run start

# Build for production
npm run build
```

### Code Quality

```bash
# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Lint PHP
npm run lint:php

# Format all files
npm run format

# Run all linters
npm run lint
```

### Testing

```bash
# Run all tests
npm run test

# JavaScript unit tests
npm run test:js

# End-to-end tests
npm run test:e2e

# PHP tests
npm run test:php
```

### Internationalization

```bash
# Generate .pot file for translations
npm run makepot

# Generate JSON translations for JavaScript
npm run make-json
```

## Development Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
sequenceDiagram
    participant Dev as Developer
    participant Files as Source Files
    participant Build as Build System
    participant Tests as Tests
    participant WP as WordPress

    Dev->>Files: Edit src/ files
    Files->>Build: npm run start (watch mode)
    Build->>Build: Compile & Bundle
    Build->>WP: Output to build/
    Dev->>Tests: npm run test
    Tests->>Dev: Test results
    Dev->>Build: npm run build (production)
    Build->>WP: Optimized build/
    WP->>Dev: Plugin ready
```

## Build System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Source["Source Files (src/)"]
        Index["index.js<br/>Entry Point"]
        Block["{{slug}}/<br/>Block Files"]
        SCSS["scss/<br/>Stylesheets"]
    end

    subgraph Build["Build Process"]
        Babel["Babel<br/>ES6+ → ES5"]
        Webpack["Webpack<br/>Bundle"]
        Sass["Sass<br/>SCSS → CSS"]
        PostCSS["PostCSS<br/>Optimize"]
    end

    subgraph Output["Build Output (build/)"]
        JSOut["index.js"]
        CSSOut["index.css"]
        Assets["*.asset.php"]
    end

    Index --> Babel
    Block --> Babel
    Babel --> Webpack
    SCSS --> Sass
    Sass --> PostCSS
    Webpack --> JSOut
    PostCSS --> CSSOut
    Webpack --> Assets
```

## Block Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Metadata["Block Metadata"]
        JSON["block.json<br/>Configuration"]
    end

    subgraph Editor["Block Editor"]
        Edit["edit.js<br/>Edit Component"]
        EditorStyle["editor.scss<br/>Editor Styles"]
    end

    subgraph Frontend["Frontend"]
        Save["save.js<br/>Static Render"]
        Render["render.php<br/>Dynamic Render"]
        View["view.js<br/>Interactivity"]
        Style["style.scss<br/>Frontend Styles"]
    end

    JSON --> Edit
    JSON --> Save
    JSON --> Render
    Edit --> EditorStyle
    Save --> Style
    Render --> Style
    Save --> View
    Render --> View
```

## Plugin Structure

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Core["Core Files"]
        Main["{{slug}}.php<br/>Main Plugin File"]
        Readme["readme.txt<br/>WordPress.org Readme"]
    end

    subgraph Source["Source Files"]
        Src["src/<br/>Block Source"]
        Index["src/index.js<br/>Registration"]
        BlockFiles["src/{{slug}}/<br/>Block Files"]
    end

    subgraph Build["Build Output"]
        BuildJS["build/index.js"]
        BuildCSS["build/index.css"]
        Assets["build/*.asset.php"]
    end

    subgraph Scripts["Build Scripts"]
        BuildScript["bin/build.sh"]
        TestScript["bin/test.sh"]
        UpdateVer["bin/update-version.js"]
    end

    Main --> Src
    Src --> Index
    Index --> BlockFiles
    Src --> Build
    BuildScript --> Build
```

## Prerequisites

- **Node.js**: 18.0+ and npm 9.0+
- **PHP**: 8.0+
- **WordPress**: 6.0+
- **Composer**: 2.0+ (for PHP dependencies)

## Support Resources

### Official WordPress Documentation

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)

### WordPress Packages

- [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts)
- [@wordpress/blocks](https://www.npmjs.com/package/@wordpress/blocks)
- [@wordpress/block-editor](https://www.npmjs.com/package/@wordpress/block-editor)
- [@wordpress/components](https://www.npmjs.com/package/@wordpress/components)

## Block Development Resources

### Key Concepts

- **block.json**: Block metadata and configuration
- **edit.js**: Block editor interface (React component)
- **save.js**: Static HTML output (or null for dynamic blocks)
- **render.php**: Server-side dynamic rendering
- **view.js**: Frontend JavaScript for interactivity

### WordPress Block Editor

- [Block Tutorial](https://developer.wordpress.org/block-editor/getting-started/tutorial/)
- [Create a Block Tutorial](https://developer.wordpress.org/block-editor/getting-started/create-block/)
- [Block Attributes](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/)
- [Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)

## Contributing

When contributing to this scaffold:

1. Follow WordPress coding standards
2. Update relevant documentation
3. Test with the generation script
4. Validate all mustache templates
5. Ensure all linters pass
6. Update version numbers appropriately

## License

This scaffold is licensed under {{license}}. Generated plugins inherit this license unless modified.

## Related Documentation

- **[inc/README.md](../inc/README.md)** - PHP class files documentation
- **[src/README.md](../src/README.md)** - Source files documentation
- **[tests/README.md](../tests/README.md)** - Testing documentation
- **[bin/README.md](../bin/README.md)** - Build script documentation
