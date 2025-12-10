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

## Using This Scaffold

This scaffold can be used in two ways:

### Option 1: Template Mode (Modify Scaffold Directly)

Use the scaffold as a template repository and process it in-place:

1. **Create from template** on GitHub or clone the repository
2. **Process the scaffold** with your plugin details:

   ```bash
   node scripts/generate-plugin.js --in-place
   ```

   This will:
   - Prompt for confirmation (to prevent accidental overwrites)
   - Replace all `{{mustache}}` variables in files
   - Update file and directory names with your slug
   - Process the scaffold directory directly (no separate output)

3. **Install dependencies and build**:

   ```bash
   npm install
   composer install
   npm run build
   ```

4. **Commit your customized plugin** to your repository

**⚠️ Important**: Template mode modifies files in-place. Always use on a fresh clone or when you're certain you want to replace the scaffold content.

### Option 2: Generator Mode (Create New Plugin)

Generate a new plugin in a separate output directory:

1. **Clone or download** this scaffold repository
2. **Run the generator** to create a new plugin:

   ```bash
   node scripts/generate-plugin.js
   ```

   Or with a configuration file:

   ```bash
   node scripts/generate-plugin.js --config my-plugin-config.json
   ```

3. **Find your generated plugin** in:
   - `generated-plugins/<your-slug>/` - Complete plugin ready to use

4. **Move to WordPress plugins directory**:

   ```bash
   mv generated-plugins/my-plugin/ /path/to/wordpress/wp-content/plugins/
   cd /path/to/wordpress/wp-content/plugins/my-plugin/
   npm install
   composer install
   npm run build
   ```

**Benefits**: Keeps the scaffold repository clean and can generate multiple plugins.

See [docs/GENERATE-PLUGIN.md](docs/GENERATE-PLUGIN.md) for detailed usage instructions, configuration options, and examples.

## Installation (For Already-Generated Plugins)

If you've already processed the scaffold or received a generated plugin:

1. Ensure you're in your WordPress plugins directory:

   ```bash
   cd wp-content/plugins/your-plugin-name
   ```

2. Install dependencies:

   ```bash
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

Comprehensive documentation is available in the `docs/` directory:

- **[Build Process](docs/BUILD-PROCESS.md)** - Complete build system guide
- **[Testing Guide](docs/TESTING.md)** - Running and writing tests
- **[Internationalization](docs/INTERNATIONALIZATION.md)** - i18n and translation guide
- **[Tool Configuration](docs/TOOL-CONFIGS.md)** - Linting, formatting, and build tools
- **[Agents Guide](docs/AGENTS.md)** - AI agents and automation
- **[Workflows Guide](docs/WORKFLOWS.md)** - CI/CD workflows documentation
- **[API Reference](docs/API-REFERENCE.md)** - Plugin API documentation
- **[Performance](docs/PERFORMANCE.md)** - Performance optimization guide
- **[Security](docs/SECURITY-HEADERS.md)** - Security best practices

**Configuration Documentation** (`docs/config/`):

- [wp-scripts](docs/config/wp-scripts.md) - Complete @wordpress/scripts guide
- [Webpack](docs/config/webpack.md) - Bundling configuration
- [Babel](docs/config/babel.md) - JavaScript compilation
- [ESLint](docs/config/eslint.md) - JavaScript linting
- [Stylelint](docs/config/stylelint.md) - CSS/Sass linting
- [PostCSS](docs/config/postcss.md) - CSS processing
- [Jest](docs/config/jest.md) - Unit testing
- [Playwright](docs/config/playwright.md) - E2E testing
- [Prettier](docs/config/prettier.md) - Code formatting

## License

{{license}}
