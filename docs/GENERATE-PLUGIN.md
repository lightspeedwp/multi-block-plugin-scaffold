---
title: Plugin Generation Guide
description: Comprehensive guide to generating WordPress multi-block plugins from the scaffold
category: Development
type: Guide
audience: Developers
date: 2025-12-05
---

This guide explains the complete plugin generation system for creating WordPress multi-block plugins with custom post types, taxonomies, and Secure Custom Fields integration.

## Overview

The Multi-Block Plugin Scaffold uses a **mustache template system** to generate customised WordPress plugins. All template files contain placeholder variables in the format `{{variable}}` that are replaced with your specific values during generation.

The scaffold includes three complementary generation methods:

1. **AI-Assisted Generation** - Interactive prompt-based workflow
2. **Agent-Based Generation** - Conversational agent specification
3. **CLI Script** - Direct command-line generation

All methods use the same **mustache template system** under the hood.

## Generator Components

The generator system consists of three main components that work together:

### 1. Generator Prompt (`.github/prompts/generate-plugin.prompt.md`)

Structured prompt template for AI-assisted plugin generation with:

- Multi-stage discovery process
- Stage-by-stage requirement gathering
- Generation command templates
- Comprehensive workflow guidance

### 2. Scaffold Generator Agent (`.github/agents/scaffold-generator.agent.md`)

Interactive agent specification defining:

- Conversation flow and validation rules
- Contextual help and examples
- Error handling and edge cases
- Integration with generator scripts

### 3. Generator Script (`.github/agents/scaffold-generator.agent.js`)

Executable implementation that:

- Processes mustache templates
- Validates configuration schemas
- Performs file system operations
- Generates complete plugin structure
- Creates SCF field groups and block files

## Configuration Schema System

The plugin generator uses a JSON Schema-based configuration system to ensure valid, consistent plugin configurations.

### Schema Files

All schema files are stored in `.github/schemas/` directory:

- **`plugin-config.schema.json`** - JSON Schema defining all configuration options
- **`plugin-config.example.json`** - Example configuration with realistic values

### Schema Structure

The plugin configuration schema (`plugin-config.schema.json`) defines:

1. **Required Fields** - Mandatory configuration options (slug, name, author)
2. **Optional Fields** - Additional customization options
3. **Validation Rules** - Patterns, constraints, and formats
4. **Field Descriptions** - Documentation for each property
5. **Default Values** - Sensible defaults for optional fields
6. **Examples** - Sample values for guidance

### Using Configuration Files

You can provide configuration via JSON file:

```bash
# Create your configuration file
cp .github/schemas/plugin-config.example.json my-plugin-config.json

# Edit with your values
nano my-plugin-config.json

# Generate plugin
node scripts/generate-plugin.js --config my-plugin-config.json
```

### Validating Configuration

Validate your configuration before generation:

```bash
# Validate configuration file
node scripts/validate-plugin-config.js my-plugin-config.json

# Validate schema only
node scripts/validate-plugin-config.js --schema-only
```

The validator checks:

- ✅ JSON syntax validity
- ✅ Schema compliance
- ✅ Field type validation
- ✅ WordPress compatibility
- ✅ Best practices
- ⚠️ Warnings for potential issues
- ℹ️ Suggestions for improvements

## Mustache Template System

### What are Mustache Templates?

Mustache is a logic-less template syntax that uses double curly braces `{{variable}}` as placeholders. During generation, these placeholders are replaced with actual values.

**Example:**

```php
// Template file
Plugin Name: {{name}}
Description: {{description}}
Author: {{author}}
```

```php
// After generation with values: name="Tour Operator", description="Tour booking plugin", author="LightSpeed"
Plugin Name: Tour Operator
Description: Tour booking plugin
Author: LightSpeed
```

### How Mustache Values Work

#### Standard Placeholders

All files in the scaffold use consistent mustache placeholder syntax:

| Placeholder | Usage | Example Value | Where Used |
|------------|-------|---------------|------------|
| `{{slug}}` | Plugin identifier | `tour-operator` | File names, URLs, function prefixes |
| `{{name}}` | Display name | `Tour Operator` | Plugin headers, UI labels |
| `{{namespace}}` | PHP/JS namespace | `tour_operator` | Classes, constants, CSS |
| `{{textdomain}}` | i18n domain | `tour-operator` | Translation functions |
| `{{version}}` | Version number | `1.0.0` | Plugin header, package.json |
| `{{author}}` | Author name | `LightSpeed` | Plugin header, credits |
| `{{description}}` | Plugin description | `Tour booking plugin` | Plugin header, README |
| `{{license}}` | License type | `GPL-2.0-or-later` | Plugin header, composer.json |

#### Extended Placeholders

Additional placeholders for specific use cases:

| Placeholder | Purpose | Example | Auto-Generated From |
|------------|---------|---------|-------------------|
| `{{name_singular}}` | Singular CPT name | `Tour` | User input or `{{name}}` |
| `{{name_plural}}` | Plural CPT name | `Tours` | User input or `{{name}}` |
| `{{name_singular_lower}}` | Lowercase singular | `tour` | `{{name_singular}}` |
| `{{name_plural_lower}}` | Lowercase plural | `tours` | `{{name_plural}}` |
| `{{plugin_uri}}` | Plugin URL | `https://example.com/plugin` | User input |
| `{{author_uri}}` | Author URL | `https://example.com` | User input |
| `{{license_uri}}` | License URL | `https://www.gnu.org/licenses/gpl-2.0.html` | Auto-generated from `{{license}}` |
| `{{requires_wp}}` | Min WordPress | `6.5` | User input or default |
| `{{requires_php}}` | Min PHP | `8.0` | User input or default |
| `{{tested_up_to}}` | Tested WordPress | `6.7` | User input or default |

#### Filters (Transformations)

Mustache supports filters that transform values:

| Filter | Purpose | Example Input | Example Output |
|--------|---------|---------------|----------------|
| `{{namespace\|upper}}` | UPPERCASE | `tour_operator` | `TOUR_OPERATOR` |
| `{{namespace\|pascalCase}}` | PascalCase | `tour_operator` | `TourOperator` |
| `{{slug\|camelCase}}` | camelCase | `tour-operator` | `tourOperator` |

**Usage in code:**

```php
// PHP constants use UPPERCASE
define( '{{namespace|upper}}_VERSION', '{{version}}' );
// Output: define( 'TOUR_OPERATOR_VERSION', '1.0.0' );

// PHP classes use PascalCase
class {{namespace|pascalCase}}_Plugin {
// Output: class TourOperator_Plugin {
```

### Where Mustache Values Are Used

The mustache template system is used consistently across all file types in the scaffold. See [Generator Instructions](.github/instructions/generate-plugin.instructions.md) for the complete implementation reference.

#### Core PHP Files

Main plugin file `{{slug}}.php` uses placeholders for headers and constants:

```php
/**
 * Plugin Name:       {{name}}
 * Description:       {{description}}
 * Version:           {{version}}
 * Author:            {{author}}
 * Text Domain:       {{textdomain}}
 * @package {{namespace}}
 */
define( '{{namespace|upper}}_VERSION', '{{version}}' );
```

#### JavaScript/React Files

Block registration and components use namespace and textdomain:

```javascript
/**
 * @package {{namespace}}
 */
export default function PostSelector( { postType = '{{slug}}' } ) {
    return (
        <div className="{{namespace}}-post-selector">
            {__( 'Select Post', '{{textdomain}}' )}
        </div>
    );
}
```

#### CSS/SCSS Files

Styles use namespace for all class names and CSS custom properties:

```scss
:root {
    --{{namespace}}-primary-color: #333;
}

.{{namespace}}-slider {
    transition: transform var(--{{namespace}}-transition);
}
```

#### Configuration Files

JSON configuration files (`package.json`, `composer.json`, `block.json`) use placeholders:

```json
{
    "name": "{{namespace}}/{{slug}}",
    "version": "{{version}}",
    "textdomain": "{{textdomain}}"
}
```

## Generation Methods

### Method 1: AI-Assisted Generation (Recommended)

Use the workspace prompt for an interactive, guided experience:

```text
@workspace /generate-plugin
```

**Process:**

1. The AI assistant loads the generation prompt template
2. Guides you through 7 discovery stages
3. Collects all required information interactively
4. Validates input at each stage
5. Confirms configuration before generation
6. Generates the complete plugin structure
7. Provides post-generation setup instructions

**Benefits:**

- Interactive question-and-answer flow
- Contextual help and examples
- Validation at each step
- Smart defaults for common configurations
- Best for first-time users

**Stages:**

1. **Plugin Identity** - Name, slug, description, author
2. **Custom Post Type** - CPT configuration and features
3. **Taxonomies** - Category and tag structures
4. **Custom Fields** - SCF field group definitions
5. **Blocks** - Which blocks to generate
6. **Templates & Patterns** - Template and pattern selection
7. **Version & Compatibility** - WordPress/PHP requirements

### Method 2: Agent-Based Generation

Request the scaffold generator agent directly:

```text
Generate a new multi-block plugin from scaffold
```

Or be more specific:

```text
Create a tour operator plugin with tours CPT, destination taxonomy, and booking fields
```

**Features:**

- Conversational interface
- Can infer requirements from description
- Validates configuration automatically
- Follows agent specification in `.github/agents/scaffold-generator.agent.md`
- Best for experienced users who know their requirements

### Method 3: CLI Script

Run the generator script directly from the command line:

```bash
node scripts/generate-plugin.js
```

**Interactive Mode:**

```bash
# Prompts for all required information
node scripts/generate-plugin.js
```

**Direct Mode:**

```bash
# Provide all values via arguments
node scripts/generate-plugin.js \
  --slug tour-operator \
  --name "Tour Operator" \
  --description "Tour booking and display plugin" \
  --author "LightSpeed" \
  --author-uri "https://developer.lsdev.biz"
```

**Configuration File Mode** (Recommended):

```bashbash
# Start with example configuration
cp .github/schemas/plugin-config.example.json my-plugin.json

# Edit your configuration
nano my-plugin.json

# Validate configuration
node scripts/validate-plugin-config.js my-plugin.json

# Generate plugin
node scripts/generate-plugin.js --config my-plugin.json
```

**Best for:**

- Automation and CI/CD pipelines
- Batch plugin generation
- Advanced users comfortable with CLI tools

## Post-Generation Workflow

### 1. Review Generated Files

```bash
cd output-plugin/
tree -L 2
```

Expected structure:

```
tour-operator/
├── tour-operator.php         # Main plugin file (slug-based name)
├── package.json              # Node dependencies
├── composer.json             # PHP dependencies
├── inc/                      # PHP classes
├── src/                      # Source files
│   ├── blocks/               # Block implementations
│   ├── components/           # Shared React components
│   ├── hooks/                # Custom React hooks
│   └── scss/                 # Stylesheets
├── templates/                # Block templates
├── patterns/                 # Block patterns
├── parts/                    # Template parts
└── scf-json/                 # SCF field groups
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Composer dependencies
composer install
```

### 3. Build the Plugin

```bash
# Development build with watch mode
npm run start

# Production build
npm run build
```

### 4. Configure Field Groups

Edit generated SCF field group files in `scf-json/`:

```bash
# Example field group
scf-json/group_tour_operator_details.json
```

Add custom fields following the [SCF Fields Reference](.github/instructions/scf-fields.instructions.md).

### 5. Run Tests

```bash
# All tests
npm run test

# JavaScript unit tests
npm run test:unit

# PHP tests
composer run test

# E2E tests
npm run test:e2e
```

### 6. Run Linting

```bash
# All linters
npm run lint

# JavaScript
npm run lint:js

# CSS/SCSS
npm run lint:css

# PHP
composer run lint
```

### 7. Start Development Environment

```bash
# Start wp-env
npm run env:start

# Plugin is automatically activated
# Access at http://localhost:8888
```

## Build Scripts

### `bin/build.js`

Main build script coordinating webpack and asset compilation:

```bash
npm run build
```

### `bin/update-version.js`

Updates version across all files:

```bash
node scripts/update-version.js 1.2.0
```

Updates: `package.json`, `composer.json`, main plugin file, all `block.json` files, README.md

## Complete Mustache Variable Reference

### Core Variables (Always Required)

```javascript
{
  "slug": "tour-operator",              // URL-safe identifier
  "name": "Tour Operator",              // Human-readable name
  "namespace": "tour_operator",         // PHP/JS namespace (auto-generated)
  "textdomain": "tour-operator",        // i18n domain (auto-generated)
  "description": "Tour booking plugin", // One-line description
  "author": "LightSpeed",               // Author/org name
  "author_uri": "https://lsdev.biz",    // Author website
  "version": "1.0.0"                    // Semantic version
}
```

### Plugin Metadata Variables

```javascript
{
  "plugin_uri": "https://example.com/plugins/tour-operator",
  "license": "GPL-2.0-or-later",
  "license_uri": "https://www.gnu.org/licenses/gpl-2.0.html",
  "requires_wp": "6.5",
  "tested_up_to": "6.7",
  "requires_php": "8.0"
}
```

### Custom Post Type Variables

```javascript
{
  "name_singular": "Tour",
  "name_plural": "Tours",
  "name_singular_lower": "tour",
  "name_plural_lower": "tours",
  "cpt_slug": "tour",
  "cpt_icon": "dashicons-palmtree",
  "cpt_supports": ["title", "editor", "thumbnail"]
}
```

### Taxonomy Variables

```javascript
{
  "taxonomy_singular": "Destination",
  "taxonomy_plural": "Destinations",
  "taxonomy_slug": "destination"
}
```

## Troubleshooting

### Common Issues

**Validation Errors:**

- Slug format: Use `my-plugin-name` (lowercase, hyphens only)
- Version format: Use `1.0.0` (major.minor.patch)

**Generation Errors:**

- Template not found: Run from scaffold directory
- Directory exists: Remove `output-plugin/` or use `--force`

**Build Errors:**

- Node.js version: Use Node.js 18+ or run `nvm use`
- Webpack errors: Run `npm install` again

**SCF Field Errors:**

- Invalid JSON: Validate syntax and field types
- Duplicate keys: Ensure all field keys are unique

## Best Practices

### Naming Conventions

- **Plugin Slug:** Lowercase, hyphens, under 50 chars (`tour-operator`)
- **CPT Slug:** Max 20 chars, singular (`tour` not `tours`)
- **Namespace:** Auto-generated, underscores (`tour_operator`)
- **Text Domain:** Matches slug (`tour-operator`)

### Field Naming

- **Field Keys:** Prefix with slug (`tour_operator_subtitle`)
- **Field Labels:** Human-readable, title case ("Subtitle", "Price per Person")

## Secure Custom Fields (SCF) Integration

The scaffold includes full SCF support for all field types:

### Field Types Supported

- **Text** - text, textarea, wysiwyg, email, url, password
- **Content** - image, file, gallery, oembed
- **Choice** - select, checkbox, radio, button_group, true_false
- **Relational** - link, post_object, relationship, taxonomy, user
- **jQuery** - google_map, date_picker, date_time_picker, time_picker, color_picker
- **Layout** - message, accordion, tab, group, repeater, flexible_content

### Field Group Management

- **Local JSON** - Field groups stored in `scf-json/` directory
- **Schema Validation** - JSON Schema validation for all field groups
- **Options Pages** - Automatic options page registration
- **Block Bindings** - Integration with WordPress 6.5+ Block Bindings API

### Example Field Groups

Generate example field groups demonstrating all field types:

```bash
node scripts/generate-plugin.js --with-example-fields
```

See [SCF Fields Reference](.github/instructions/scf-fields.instructions.md) for complete documentation.

## Custom Post Types & Taxonomies

### Supported CPT Features

The generator supports all standard WordPress CPT features:

- title, editor, author, thumbnail, excerpt
- trackbacks, custom-fields, comments, revisions
- page-attributes, post-formats

### Taxonomy Types

- **Hierarchical** - Like categories (parent/child structure)
- **Non-hierarchical** - Like tags (flat list)

### Automatic Registration

Custom post types and taxonomies are automatically registered via:

- `inc/class-post-types.php` - CPT registration
- `inc/class-taxonomies.php` - Taxonomy registration
- `inc/class-block-templates.php` - Block template assignments

## Block Categories

The generator supports these block categories:

- `text` - Text-based blocks (paragraphs, headings, lists)
- `media` - Media blocks (images, videos, audio)
- `design` - Design and layout blocks
- `widgets` - Widget-style blocks (search, categories, tags)
- `theme` - Theme-specific blocks (site logo, navigation)
- `embed` - Embed blocks for external content

## Development Workflow Integration

### Pre-Commit Hooks

The generator integrates with Husky pre-commit hooks:

1. **Generation** - Use any generation method
2. **Customisation** - Modify generated files
3. **Validation** - Automatic linting and tests
4. **Commit** - Hooks validate before commit

### Linting Standards

Generated plugins follow all LightSpeed coding standards:

- **ESLint** - JavaScript/JSX with WordPress rules
- **Prettier** - Code formatting
- **PHPCS** - PHP WordPress coding standards
- **Stylelint** - CSS/SCSS linting
- **PHPStan** - PHP static analysis

### Development Assistant

Works alongside the [Development Assistant](.github/agents/development-assistant.agent.md):

- **Generator** creates initial structure
- **Assistant** helps with ongoing development:
  - Code review and suggestions
  - Block development
  - Custom post type management
  - Field group configuration
  - Testing strategies

## Configuration Schemas

The generator validates all configuration:

### Plugin Schema

```javascript
{
  name: String,           // Required
  slug: String,           // Required (kebab-case)
  description: String,
  author: String,
  authorUri: String,
  version: String,        // Semver (e.g., 1.0.0)
  textdomain: String,     // Auto-generated from slug
}
```

### Block Schema

```javascript
{
  title: String,          // Required
  slug: String,           // Required
  description: String,
  category: String,       // text, media, design, widgets, theme, embed
  icon: String,           // Dashicon name
  keywords: Array,
  attributes: Object,
  supports: Object,
}
```

### Custom Post Type Schema

```javascript
{
  name: String,           // Required
  slug: String,           // Required (max 20 chars)
  singular: String,
  plural: String,
  public: Boolean,
  has_archive: Boolean,
  supports: Array,        // title, editor, thumbnail, etc.
  taxonomies: Array,
}
```

### Taxonomy Schema

```javascript
{
  name: String,           // Required
  slug: String,           // Required
  singular: String,
  plural: String,
  hierarchical: Boolean,  // true=categories, false=tags
  post_types: Array,
}
```

### Field Group Schema

```javascript
{
  title: String,          // Required
  key: String,            // Required (unique)
  fields: Array,          // Field definitions
  location: Array,        // Location rules
}
```

## Error Handling

Comprehensive error handling for:

- **Validation Errors** - Invalid input caught early with helpful messages
- **File System Errors** - Prevents overwriting existing projects
- **Template Errors** - Validates mustache templates before processing
- **Configuration Errors** - Ensures all required settings provided
- **Schema Errors** - Validates CPT, taxonomy, and field schemas
- **JSON Errors** - Validates all JSON files before writing

## Testing

The generator system includes tests:

```bash
# All tests
npm run test

# Generator-specific tests
npm run test:agents

# Validate generated plugin
cd output-plugin
npm run lint
npm run test
```

## Configuration Schema Reference

The complete schema documentation is available in `.github/schemas/plugin-config.schema.json`. Key configuration sections:

### Core Configuration

```json
{
  "slug": "plugin-name",              // Required: URL-safe identifier
  "name": "Plugin Name",              // Required: Display name
  "author": "Your Name",              // Required: Author name
  "description": "Plugin description", // Optional: Brief description
  "version": "1.0.0",                 // Optional: Starting version
  "namespace": "plugin_name",         // Auto-generated from slug
  "textdomain": "plugin-name"         // Auto-generated from slug
}
```

### Custom Post Type Configuration

```json
{
  "cpt_slug": "item",                 // Max 20 chars
  "cpt_supports": [                    // CPT features
    "title",
    "editor",
    "thumbnail"
  ],
  "cpt_has_archive": true,             // Enable archive page
  "cpt_menu_icon": "dashicons-admin-post"
}
```

### Taxonomies Configuration

```json
{
  "taxonomies": [
    {
      "slug": "category",
      "singular": "Category",
      "plural": "Categories",
      "hierarchical": true            // Categories vs tags
    }
  ]
}
```

### Fields Configuration (SCF)

```json
{
  "fields": [
    {
      "name": "price",
      "label": "Price",
      "type": "number",
      "required": false,
      "instructions": "Enter the price"
    }
  ]
}
```

### Blocks Configuration

```json
{
  "blocks": ["card", "collection", "slider"],
  "templates": ["single", "archive"]
}
```

For complete schema details, see:

- `.github/schemas/plugin-config.schema.json` - Full schema definition
- `.github/schemas/plugin-config.example.json` - Working example

## Related Documentation

- **[README.md](./README.md)** - Documentation index
- **[../.github/instructions/generate-plugin.instructions.md](../.github/instructions/generate-plugin.instructions.md)** - Mustache template rules
- **[../.github/instructions/schema-files.instructions.md](../.github/instructions/schema-files.instructions.md)** - Schema file standards
- **[../.github/instructions/scf-fields.instructions.md](../.github/instructions/scf-fields.instructions.md)** - SCF field types

## Support

For issues or questions:

1. Check this documentation
2. Review [SUPPORT.md](../SUPPORT.md)
3. Check [CONTRIBUTING.md](../CONTRIBUTING.md)
4. Open an issue on GitHub
