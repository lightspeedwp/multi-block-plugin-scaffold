---
title: Generator System
description: Comprehensive generator system for creating WordPress block plugins
category: Development
type: Guide
audience: Developers
date: 2025-12-01
---

## Overview

The Multi Block Plugin Scaffold includes a comprehensive generator system that provides multiple ways to create new WordPress multi-block plugins with custom post types, taxonomies, and field groups. This system consists of three main components that work together to guide users through plugin creation.

## Components

### 1. Generator Prompt (`generate-plugin.prompt.md`)

Located in `.github/prompts/generate-plugin.prompt.md`, this file provides a structured prompt template for AI-assisted plugin generation.

**Features:**

- Multi-stage discovery process
- Stage-by-stage questions for gathering requirements
- Generation command templates
- Comprehensive requirement gathering workflow

**Stages:**

1. **Project Discovery** - Basic project information (name, slug, description)
2. **Plugin Configuration** - WordPress plugin settings and metadata
3. **Content Structure** - Custom post types and taxonomies
4. **Field Groups** - Secure Custom Fields (SCF) configuration
5. **Block Configuration** - Multiple block definitions and features
6. **Design System** - Colours, typography, and styling preferences
7. **Build Configuration** - Development tools and workflow preferences

### 2. Scaffold Generator Agent (`scaffold-generator.agent.md`)

Located in `.github/agents/scaffold-generator.agent.md`, this document defines the interactive agent specification for plugin generation.

**Features:**

- Interactive conversation flow
- Validation rules and error handling
- Integration with generator scripts
- Step-by-step guidance through the generation process

**Key Capabilities:**

- Validates user input at each stage
- Provides contextual help and examples
- Handles edge cases and common errors
- Ensures all required information is collected
- Validates custom post type and taxonomy configurations
- Ensures field group schemas are valid

### 3. Scaffold Generator Script (`scaffold-generator.agent.js`)

Located in `.github/agents/scaffold-generator.agent.js`, this is the executable implementation that performs the actual plugin generation.

**Features:**

- Interactive CLI prompts using inquirer
- Mustache template processing
- File system operations with validation
- Configuration schema validation
- Comprehensive error handling
- Taxonomy and CPT schema validation
- SCF field group generation

**Capabilities:**

- Creates complete plugin structure
- Processes template variables
- Generates multiple block.json files
- Sets up custom post types and taxonomies
- Creates SCF field group JSON files
- Configures options pages
- Sets up build configuration
- Creates initial block files for all blocks

## Usage Options

Users can start a new multi-block plugin project using any of these three methods:

### Option 1: Prompt-Based Generation

Use the workspace prompt to initiate generation:

```text
@workspace /generate-plugin
```

This triggers the AI assistant to use the generation prompt template and guide you through the process interactively.

### Option 2: Agent-Based Generation

Request the scaffold generator agent directly:

```text
Generate a new multi-block plugin from scaffold
```

The agent will follow the specification in `scaffold-generator.agent.md` to collect requirements and generate the plugin.

### Option 3: Direct Script Execution

Run the generator script directly from the command line:

```bash
node bin/generate-plugin.js
```

This provides a traditional CLI interface with interactive prompts.

## Updated Index Files

### prompts.md

The prompts index has been updated with a quick start section that presents all three usage options:

- **Quick Start** section added at the top
- Links to all three generation methods
- Clear descriptions of when to use each approach
- Cross-references to related documentation

### agent.md

The agent index now lists the Scaffold Generator first for better discoverability:

- **Scaffold Generator** listed at the top of the implementations section
- Links to both the agent specification (`.md`) and implementation (`.js`)
- Usage examples and common workflows
- Integration with other agents (e.g., Development Assistant)

## Workflow Integration

### Pre-Commit Process

The generator system integrates with the standard development workflow:

1. **Generation** - Use any of the three methods above
2. **Customisation** - Modify generated files as needed
3. **Validation** - Run linting and tests
4. **Commit** - Husky pre-commit hooks run automatically

### Linting

The generated plugin follows all LightSpeed coding standards:

- ESLint for JavaScript/JSX
- Prettier for code formatting
- PHPCS for PHP code standards
- Stylelint for CSS/SCSS
- PHPStan for static analysis

## Development Assistant Integration

The generator system works alongside the Development Assistant agent:

1. **Generator** creates the initial plugin structure
2. **Development Assistant** helps with ongoing development:
   - Code review and suggestions
   - Block development
   - Custom post type management
   - Field group configuration
   - Build process optimisation
   - Testing strategies

## Configuration Schema

The generator validates all configuration against defined schemas:

### Plugin Schema

```javascript
{
  name: String,           // Plugin name (required)
  slug: String,           // Plugin slug (required)
  description: String,    // Plugin description
  author: String,         // Plugin author
  authorUri: String,      // Author URI
  version: String,        // Version number
  textdomain: String,     // Text domain
  // ... additional fields
}
```

### Block Schema

```javascript
{
  title: String,          // Block title (required)
  slug: String,           // Block slug (required)
  description: String,    // Block description
  category: String,       // Block category
  icon: String,           // Block icon
  keywords: Array,        // Search keywords
  attributes: Object,     // Block attributes
  supports: Object,       // Block supports
  // ... additional fields
}
```

### Custom Post Type Schema

```javascript
{
  name: String,           // CPT name (required)
  slug: String,           // CPT slug (required)
  singular: String,       // Singular label
  plural: String,         // Plural label
  description: String,    // CPT description
  public: Boolean,        // Is public
  has_archive: Boolean,   // Has archive page
  supports: Array,        // Feature support
  taxonomies: Array,      // Associated taxonomies
  // ... additional fields
}
```

### Taxonomy Schema

```javascript
{
  name: String,           // Taxonomy name (required)
  slug: String,           // Taxonomy slug (required)
  singular: String,       // Singular label
  plural: String,         // Plural label
  hierarchical: Boolean,  // Is hierarchical
  post_types: Array,      // Associated CPTs
  // ... additional fields
}
```

### Field Group Schema

```javascript
{
  title: String,          // Field group title (required)
  key: String,            // Unique key (required)
  fields: Array,          // Field definitions
  location: Array,        // Location rules
  // ... additional fields
}
```

See `scaffold-generator.agent.js` for the complete schema definitions.

## Error Handling

The generator system includes comprehensive error handling:

- **Validation Errors** - Invalid input is caught early with helpful messages
- **File System Errors** - Prevents overwriting existing projects
- **Template Errors** - Validates mustache templates before processing
- **Configuration Errors** - Ensures all required settings are provided
- **Schema Errors** - Validates CPT, taxonomy, and field schemas
- **JSON Errors** - Validates all JSON files before writing

## Testing

The generator system includes comprehensive tests:

- **Unit Tests** - Located in `tests/agents/scaffold-generator.agent.test.js`
- **Integration Tests** - Validates end-to-end generation workflow
- **Validation Tests** - Ensures configuration schemas are enforced
- **Block Tests** - Validates generated block functionality
- **CPT/Taxonomy Tests** - Tests custom post type and taxonomy registration
- **Field Group Tests** - Validates SCF field group JSON
- **Options Page Tests** - Tests options page functionality

Run tests with:

```bash
npm run test:agents
```

## Secure Custom Fields (SCF) Integration

The multi-block scaffold includes full SCF support:

### Field Types Supported

- Text (text, textarea, wysiwyg, email, url, password)
- Content (image, file, gallery, oembed)
- Choice (select, checkbox, radio, button_group, true_false)
- Relational (link, post_object, relationship, taxonomy, user)
- jQuery (google_map, date_picker, color_picker)
- Layout (message, accordion, tab, group, repeater, flexible_content)

### Field Group Management

- **Local JSON** - Field groups stored in `scf-json/` directory
- **Schema Validation** - JSON Schema validation for field groups
- **Options Pages** - Automatic options page registration
- **Field Groups** - General settings, display settings, API settings

### Example Field Groups

The generator can create example field groups:

```bash
node bin/generate-plugin.js --with-example-fields
```

This creates comprehensive field group examples demonstrating all field types.

## Best Practices

### For Users

1. **Start with the Prompt** - Use `@workspace /generate-plugin` for AI-guided generation
2. **Review Generated Code** - Always review generated files before committing
3. **Plan Content Structure** - Define CPTs and taxonomies before starting
4. **Design Field Groups** - Map out field requirements early
5. **Customise Gradually** - Start with defaults, then customise as needed
6. **Follow Standards** - Generated code follows LightSpeed standards automatically

### For Contributors

1. **Update All Three Components** - Keep prompt, agent spec, and script in sync
2. **Validate Changes** - Run tests after modifying generator code
3. **Document New Features** - Update this file when adding capabilities
4. **Maintain Backwards Compatibility** - Ensure existing projects aren't affected
5. **Test CPT/Taxonomy Code** - Validate registration and query functionality
6. **Validate Field Groups** - Ensure SCF JSON is valid

## Block Categories

The generator supports the following block categories:

- `text` - Text-based blocks (paragraphs, headings, lists)
- `media` - Media blocks (images, videos, audio)
- `design` - Design and layout blocks
- `widgets` - Widget-style blocks (search, categories, tags)
- `theme` - Theme-specific blocks (site logo, navigation)
- `embed` - Embed blocks for external content

## Custom Post Types & Taxonomies

### Supported Features

**Post Type Supports:**

- title
- editor
- author
- thumbnail
- excerpt
- trackbacks
- custom-fields
- comments
- revisions
- page-attributes
- post-formats

**Taxonomy Types:**

- Hierarchical (like categories)
- Non-hierarchical (like tags)

### Registration

Custom post types and taxonomies are automatically registered via:

- `inc/class-post-types.php`
- `inc/class-taxonomies.php`

## Troubleshooting

### Common Issues

**Generator script not found:**

```bash
# Ensure you're in the scaffold directory
cd /path/to/multi-block-plugin-scaffold
node bin/generate-plugin.js
```

**Validation errors:**

- Check that all required fields are provided
- Ensure slug uses lowercase letters and hyphens only
- Verify version numbers follow semver format
- Ensure block category is valid
- Validate CPT and taxonomy slug uniqueness

**Template errors:**

- Ensure mustache variables are properly formatted
- Check that all required template variables are defined
- Validate JSON files (block.json, field groups) after generation

**Build errors:**

- Run `npm install` after generation
- Ensure Node.js version matches .nvmrc (24.x)
- Check webpack configuration for syntax errors
- Run `composer install` for PHP dependencies

**SCF errors:**

- Ensure field group JSON is valid
- Check that field keys are unique
- Validate location rules syntax
- Ensure `scf-json/` directory is writable

## Related Documentation

- [Scaffold Generator Agent Specification](.github/agents/scaffold-generator.agent.md)
- [Generation Prompt Template](.github/prompts/generate-plugin.prompt.md)
- [Agent Index](.github/agents/agent.md)
- [Prompts Index](.github/prompts/prompts.md)
- [Development Assistant Agent](.github/agents/development-assistant.agent.md)
- [SCF Fields Reference](.github/instructions/scf-fields.instructions.md)
- [Build Process](BUILD-PROCESS.md)
- [API Reference](API-REFERENCE.md)

## Version History

- **v1.0.0** - Initial generator system with three usage options
- Added multi-stage discovery process
- Integrated with Development Assistant agent
- Updated index files for better discoverability
- Added CPT and taxonomy support
- Integrated SCF field group generation
- Added options page configuration
- Added comprehensive test coverage

## Support

For issues or questions about the generator system:

1. Check the [SUPPORT.md](../SUPPORT.md) file
2. Review the [CONTRIBUTING.md](../CONTRIBUTING.md) guidelines
3. Open an issue on the repository
4. Consult the [Development Assistant](.github/agents/development-assistant.agent.md) for AI-guided help
