# Schema Files

This directory contains JSON Schema files and example configurations for plugin generation.

## Files

### Schema Files

- **`plugin-config.schema.json`** - JSON Schema defining plugin configuration structure
  - Validates plugin configuration files
  - Defines required and optional fields
  - Includes validation patterns and constraints
  - Provides examples and descriptions

### Example Configurations

- **`plugin-config.example.json`** - Example plugin configuration
  - Shows complete working configuration
  - Includes realistic values
  - Demonstrates common use cases
  - Validates against schema

## Usage

### Creating a Configuration File

```bash
# Start with example
cp .github/schemas/plugin-config.example.json my-plugin-config.json

# Edit with your values
nano my-plugin-config.json
```

### Validating Configuration

```bash
# Validate your configuration
node scripts/validate-plugin-config.js my-plugin-config.json

# Validate schema only
node scripts/validate-plugin-config.js --schema-only
```

### Generating Plugin

```bash
# Use validated configuration
node scripts/generate-plugin.js --config my-plugin-config.json
```

## Schema Structure

The plugin configuration schema includes:

### Required Fields

- `slug` - Plugin identifier (lowercase, hyphens)
- `name` - Display name
- `author` - Author name

### Optional Fields

- `description` - Plugin description
- `version` - Starting version (default: 1.0.0)
- `namespace` - PHP namespace (auto-generated)
- `textdomain` - i18n domain (auto-generated)
- `cpt_slug` - Custom post type slug
- `cpt_supports` - CPT features array
- `taxonomies` - Custom taxonomies array
- `fields` - SCF fields array
- `blocks` - Blocks to generate
- `templates` - Templates to generate

### Validation Rules

- **Slug**: `^[a-z][a-z0-9-]{1,48}[a-z0-9]$`
- **CPT Slug**: `^[a-z][a-z0-9_]{0,18}[a-z0-9]$` (max 20 chars)
- **Version**: Semantic versioning (e.g., 1.0.0)
- **URLs**: Must include protocol (http:// or https://)

## Adding New Schemas

When creating new schema files:

1. Store in `.github/schemas/` directory
2. Use naming convention: `{purpose}-config.schema.json`
3. Include JSON Schema metadata:
   - `$schema` - JSON Schema version
   - `$id` - Unique schema identifier
   - `title` - Human-readable title
   - `description` - Schema purpose
4. Validate with: `node scripts/validate-plugin-config.js --schema-only`
5. Create corresponding `.example.json` file
6. Update this README

## Related Documentation

- [GENERATE-PLUGIN.md](../../docs/GENERATE-PLUGIN.md) - Plugin generation guide
- [schema-files.instructions.md](../instructions/schema-files.instructions.md) - Schema file standards
- [generate-plugin.instructions.md](../instructions/generate-plugin.instructions.md) - Generator rules

## Validation Script

The validation script (`scripts/validate-plugin-config.js`) provides:

- ✅ JSON syntax validation
- ✅ Schema compliance checking
- ✅ Field type validation
- ✅ WordPress compatibility checks
- ⚠️ Warnings for potential issues
- ℹ️ Best practices suggestions

Run `node scripts/validate-plugin-config.js --help` for usage information.
