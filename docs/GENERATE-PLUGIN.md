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

## Operational Modes

### Template Mode vs Generator Mode

The scaffold supports two operational modes:

#### Template Mode (`--in-place`)

**Use when**: You want to use the scaffold as a starting point for your plugin.

- Processes files directly in the scaffold directory
- Replaces all mustache variables in-place
- Renames files and directories to match your slug
- **⚠️ Destructive**: Modifies the scaffold permanently
- Includes confirmation prompt to prevent accidents
- Best for GitHub template repositories

**Command:**

```bash
node scripts/generate-plugin.js --in-place
```

**Workflow:**

1. Clone/fork the scaffold repository
2. Run generator with `--in-place` flag
3. Confirm the operation (y/N prompt)
4. Scaffold is processed in-place
5. Install dependencies and build
6. Commit your customized plugin

#### Generator Mode (Default)

**Use when**: You want to create multiple plugins or keep the scaffold clean.

- Creates new plugin in `generated-plugins/<slug>/`
- Leaves scaffold directory unchanged
- Can generate multiple plugins
- Safe for repeated use
- Best for maintaining the scaffold as a tool

**Command:**

```bash
node scripts/generate-plugin.js
```

**Workflow:**

1. Clone the scaffold repository once
2. Run generator (no `--in-place` flag)
3. Generated plugin appears in `generated-plugins/<slug>/`
4. Move to WordPress plugins directory
5. Install dependencies and build
6. Generate another plugin anytime

## Generation Methods

### Method 1: Template Mode (In-Place Processing)

Use the scaffold as a GitHub template and process it directly:

```bash
# Interactive mode with confirmation
node scripts/generate-plugin.js --in-place

# With configuration file
node scripts/generate-plugin.js --in-place --config plugin-config.json

# Skip confirmation (automation only - use with caution)
node scripts/generate-plugin.js --in-place --yes
```

**Process:**

1. Prompts for plugin configuration (or reads from config file)
2. **Displays confirmation warning** about in-place modification
3. Waits for user confirmation (y/N)
4. Processes all files in the scaffold directory
5. Replaces mustache variables throughout
6. Renames files/directories to match your slug
7. Reports completion with next steps

**⚠️ Important Notes:**

- Always use on a fresh clone or template repository
- Cannot be undone without version control
- Confirmation prompt defaults to "No" for safety
- Use `--yes` flag only in automated workflows you trust

### Method 2: Generator Mode (Default)

Create a new plugin in a separate output directory:

```bash
# Interactive mode - prompts for all configuration
node scripts/generate-plugin.js

# With configuration file
node scripts/generate-plugin.js --config plugin-config.json

# With inline arguments
node scripts/generate-plugin.js \
  --slug tour-operator \
  --name "Tour Operator" \
  --description "Tour booking and display plugin" \
  --author "LightSpeed" \
  --author-uri "https://developer.lsdev.biz"
```

**Process:**

1. Reads configuration from prompts, file, or arguments
2. Validates configuration against schema
3. Creates `generated-plugins/<slug>/` directory
4. Copies and processes all scaffold files
5. Replaces mustache variables
6. Renames files/directories
7. Leaves scaffold directory unchanged

**Output Location:**

```bash
generated-plugins/
└── tour-operator/        # Your generated plugin
    ├── tour-operator.php
    ├── package.json
    ├── composer.json
    └── ... (complete plugin structure)
```

**Best for:**

- Creating multiple plugins from the same scaffold
- Keeping scaffold repository clean
- Testing different configurations
- CI/CD pipelines
- Advanced users comfortable with CLI tools

### Method 3: AI-Assisted Generation (Recommended)

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
6. Generates the complete plugin structure (uses generator mode by default)
7. Provides post-generation setup instructions

**Benefits:**

- Interactive question-and-answer flow
- Contextual help and examples
- Validation at each step
- Smart defaults for common configurations
- Best for first-time users
- Can use either template or generator mode

**Stages:**

1. **Plugin Identity** - Name, slug, description, author
2. **Custom Post Type** - CPT configuration and features
3. **Taxonomies** - Category and tag structures
4. **Custom Fields** - SCF field group definitions
5. **Blocks** - Which blocks to generate
6. **Templates & Patterns** - Template and pattern selection
7. **Version & Compatibility** - WordPress/PHP requirements

### Method 4: Agent-Based Generation

Request the scaffold generator agent directly:

```text
Generate a new multi-block plugin from scaffold
```

Or be more specific:

```text
Create a tour operator plugin with tours CPT, destination taxonomy, and booking fields
```

### Method 4: Agent-Based Generation

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
- Follows agent specification in `.github/agents/generate-plugin.agent.md`
- Best for experienced users who know their requirements
- Can use either template or generator mode

## Post-Generation Workflow

### 1. Review Generated Files

```bash
cd output-plugin/
tree -L 2
```

Expected structure:

```text
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
├── template-parts/           # Template parts
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
node bin/update-version.js 1.2.0
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

## Related Documentation

- [Generator Instructions](.github/instructions/generate-plugin.instructions.md) - Rules for using mustache values
- [Plugin Generator Agent](.github/agents/generate-plugin.agent.md) - Agent specification
- [Generation Prompt](.github/prompts/generate-plugin.prompt.md) - Interactive prompt template
- [SCF Fields Reference](.github/instructions/scf-fields.instructions.md) - Field types and usage
- [Build Process](BUILD-PROCESS.md) - Detailed build documentation
- [API Reference](API-REFERENCE.md) - PHP and JavaScript APIs

## Support

For issues or questions:

1. Check this documentation
2. Review [SUPPORT.md](../SUPPORT.md)
3. Check [CONTRIBUTING.md](../CONTRIBUTING.md)
4. Open an issue on GitHub
5. Use the [Development Assistant](.github/agents/development-assistant.agent.md)
