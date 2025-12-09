---
title: Project Overview
description: WordPress multi-block plugin scaffold with comprehensive documentation
category: Project
type: Index
audience: Developers, Users
date: 2025-12-01
---

# {{name}}

{{description}}

## Key Features

A multi-block WordPress plugin scaffold with support for:

- **Multiple Gutenberg blocks** (Card, Collection, Slider, Featured)
- **Custom Post Types** with block templates
- **Custom Taxonomies**
- **Custom Fields** via Secure Custom Fields (SCF) with repeater support
- **Block Patterns** and Template Parts
- **Block Bindings** for dynamic content
- **Shared React components** (Slider, PostSelector, Gallery, etc.)

## Requirements

- WordPress 6.5+
- PHP 8.0+
- Node.js 18+
- [Secure Custom Fields](https://wordpress.org/plugins/secure-custom-fields/) plugin

## Installation

1. Clone this repository to your WordPress plugins directory:

   ```bash
   cd wp-content/plugins/
   git clone https://github.com/{{author}}/{{slug}}.git
   ```

2. Install dependencies:

   ```bash
   cd {{slug}}
   npm install
   composer install
   ```

3. Build the plugin:

   ```bash
   npm run build
   ```

4. Activate the plugin in WordPress admin.

## Development

### Start development server

```bash
npm start
```

### Build for production

```bash
npm run build
```

### Linting

```bash
npm run lint:js
npm run lint:css
composer phpcs
```

### Testing

```bash
# JavaScript tests
npm run test:unit

# PHP tests
composer test

# E2E tests (requires wp-env)
npm run test:e2e
```

### Local development with wp-env

```bash
npx @wordpress/env start
```

## Structure

```
{{slug}}/
├── {{slug}}.php          # Main plugin file
├── uninstall.php         # Cleanup on uninstall
├── inc/                  # PHP classes
│   ├── class-post-types.php
│   ├── class-taxonomies.php
│   ├── class-fields.php
│   ├── class-repeater-fields.php
│   ├── class-block-bindings.php
│   ├── class-block-templates.php
│   └── class-patterns.php
├── src/                  # Source files
│   ├── blocks/           # Block source
│   │   ├── {{slug}}-card/
│   │   ├── {{slug}}-collection/
│   │   ├── {{slug}}-slider/
│   │   └── {{slug}}-featured/
│   ├── components/       # Shared components
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utilities
├── patterns/             # Block patterns
├── templates/            # Block templates
├── parts/                # Template parts
└── tests/                # Test files
```

## Blocks

### {{name}} Card

Display a single post in a card layout.

### {{name}} Collection

Display a collection of posts with:

- Grid, list, or slider layout
- Taxonomy filtering
- Featured posts filter
- Pagination support

### {{name}} Slider

Display posts or custom slides in a carousel with:

- Autoplay
- Navigation dots and arrows
- Touch/swipe support
- Keyboard navigation

### Featured {{name_plural}}

Highlight featured posts with:

- Grid layout
- Featured-first layout
- Hero layout

## Custom Fields (SCF)

The plugin registers the following custom fields:

- **Subtitle** - Text field
- **Featured** - True/False toggle
- **Gallery** - Image gallery
- **Related Posts** - Post relationship
- **Slides** - Repeater field for slider content
- **Sections** - Flexible content for page sections

## Block Bindings

Use the `{{namespace}}/fields` binding source to display field values:

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

## Mustache Variables

This scaffold uses Mustache-style variables for customization:

| Variable | Description |
|----------|-------------|
| `{{slug}}` | Plugin slug (kebab-case) |
| `{{name}}` | Plugin display name |
| `{{namespace}}` | Plugin namespace |
| `{{textdomain}}` | Text domain |

## Documentation

Comprehensive documentation is available in the **[docs/](docs/)** directory. See **[docs/README.md](docs/README.md)** for complete navigation and documentation index.

### Quick Links

- **[Contributing](CONTRIBUTING.md)** - Contribution guidelines
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards
- **[Support](SUPPORT.md)** - Getting help
- **[Security](SECURITY.md)** - Security policy

## License

{{license}}
