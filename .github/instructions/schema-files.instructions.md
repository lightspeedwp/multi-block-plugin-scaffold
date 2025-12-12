---
name: Schema Files Instructions
description: >-
  Rules and standards for JSON Schema files and validation in the multi-block
  plugin scaffold
applyTo: '**/*.schema.json,**/schemas/**'
references:
  - ../custom-instructions.md
---

# Schema Files Instructions

You are a schema governance assistant. Follow our schema storage and validation patterns to manage JSON Schemas for the multi-block plugin scaffold. Avoid storing schemas outside approved locations or skipping validation steps.

## Overview

Use this guide when creating or updating JSON Schemas used by the scaffold. It covers storage, naming, and validation. It does not cover application-specific business logic outside schema validation.

## General Rules

- Store schemas under `.github/schemas/` or files matching `*.schema.json`; avoid root placement.
- Keep filenames descriptive and versioned when breaking changes occur.
- Include descriptions for all properties and keep `$schema` pointers accurate.
- Validate schemas and sample data before publishing.
- Avoid embedding secrets or environment-specific paths in schemas.

## Detailed Guidance

These instructions define standards for creating, storing, and validating JSON Schema files in the Multi-Block Plugin Scaffold. All AI agents, developers, and automation scripts must follow these guidelines.

## Core Principles

1. **Single Location**: All schema files MUST be stored in `.github/schemas/` directory
2. **Never Root**: Schema files NEVER go in the repository root
3. **Proper Naming**: Follow consistent naming conventions
4. **Validation Required**: All schema files must be validated before use
5. **Documentation**: Schema files must include descriptions for all properties

## Schema File Types

## Examples

- `.github/schemas/plugin-config.schema.json` describing `plugin-config.json`.
- `scf-json/fields.schema.json` for SCF JSON validation.

## Validation

- Validate schemas with `npx ajv validate -s schema.json -d sample.json` (or configured lint task).
- Run `npm run lint` to catch JSON format issues.
- Ensure CI workflows that consume schemas pass after updates.

### Configuration Schema Files

**Purpose**: Define the structure and validation rules for configuration files

**Naming**: `{purpose}-config.schema.json`

**Examples**:
- `.github/schemas/plugin-config.schema.json` - Plugin configuration schema
- `.github/schemas/block-config.schema.json` - Block configuration schema
- `.github/schemas/field-config.schema.json` - Field configuration schema

**Structure**:
```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://lightspeedwp.com/schemas/plugin-config.json",
    "title": "Human-readable title",
    "description": "Detailed description of purpose",
    "type": "object",
    "required": ["field1", "field2"],
    "properties": {
        "field1": {
            "type": "string",
            "description": "Field description",
            "pattern": "^[a-z0-9-]+$",
            "examples": ["example-value"]
        }
    }
}
```

### Example Configuration Files

**Purpose**: Provide working examples of valid configurations

**Naming**: `{purpose}-config.example.json`

**Examples**:
- `.github/schemas/plugin-config.example.json` - Example plugin configuration
- `.github/schemas/block-config.example.json` - Example block configuration

**Characteristics**:
- Must validate against corresponding schema
- Include helpful comments (use "_comment" field)
- Show realistic, production-ready values
- Demonstrate all common use cases

## File Organization

### Directory Structure

```
.github/schemas/
├── plugin-config.schema.json       # Plugin configuration schema
├── plugin-config.example.json      # Example plugin config
├── block-config.schema.json        # Block configuration schema (future)
├── block-config.example.json       # Example block config (future)
├── field-config.schema.json        # Field configuration schema (future)
├── field-config.example.json       # Example field config (future)
└── README.md                       # Schemas directory documentation
```

### Location Rules

✅ **ALWAYS**:
- Store all schema files in `.github/schemas/` directory
- Name schema files with `.schema.json` extension
- Name example files with `.example.json` extension
- Include JSON Schema `$schema` and `$id` fields
- Validate schemas using JSON Schema Draft 2020-12 or later

❌ **NEVER**:
- Create schema files in repository root
- Store schemas in `docs/` or other directories
- Mix schema files with source code
- Skip validation before committing
- Use outdated JSON Schema draft versions

## Schema Standards

### Required Fields

Every schema file MUST include:

1. **`$schema`**: JSON Schema version URL
   ```json
   "$schema": "https://json-schema.org/draft/2020-12/schema"
   ```

2. **`$id`**: Unique schema identifier URL
   ```json
   "$id": "https://lightspeedwp.com/schemas/plugin-config.json"
   ```

3. **`title`**: Human-readable schema title
   ```json
   "title": "WordPress Multi-Block Plugin Configuration"
   ```

4. **`description`**: Detailed description of schema purpose
   ```json
   "description": "Pre-filled configuration for plugin generation wizard"
   ```

5. **`type`**: Root type (usually "object")
   ```json
   "type": "object"
   ```

6. **`required`**: Array of required property names
   ```json
   "required": ["slug", "name", "author"]
   ```

7. **`properties`**: Object defining all available properties
   ```json
   "properties": {
       "slug": { ... },
       "name": { ... }
   }
   ```

### Property Standards

Every property definition should include:

```json
{
    "property_name": {
        "type": "string",
        "description": "Clear, detailed description",
        "pattern": "^[a-z0-9-]+$",
        "minLength": 2,
        "maxLength": 50,
        "default": "default-value",
        "examples": [
            "example-1",
            "example-2"
        ]
    }
}
```

**Required fields for each property**:
- `type` - Data type (string, number, boolean, array, object)
- `description` - Clear explanation of purpose and format

**Recommended fields**:
- `pattern` - Regex pattern for string validation
- `minLength`/`maxLength` - String length constraints
- `minimum`/`maximum` - Number range constraints
- `default` - Default value if not provided
- `examples` - Array of valid example values
- `enum` - List of allowed values (for limited options)

### Pattern Examples

**Slug Pattern** (lowercase, hyphens only):
```json
{
    "pattern": "^[a-z][a-z0-9-]{1,48}[a-z0-9]$",
    "examples": ["plugin-name", "my-plugin-2024"]
}
```

**Namespace Pattern** (lowercase, underscores):
```json
{
    "pattern": "^[a-z][a-z0-9_]{1,48}[a-z0-9]$",
    "examples": ["plugin_name", "my_plugin"]
}
```

**Version Pattern** (semantic versioning):
```json
{
    "pattern": "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9.-]+)?$",
    "examples": ["1.0.0", "2.1.0", "1.0.0-beta.1"]
}
```

**URL Pattern**:
```json
{
    "format": "uri",
    "pattern": "^https?://",
    "examples": ["https://example.com", "http://localhost:8080"]
}
```

**Email Pattern**:
```json
{
    "format": "email",
    "examples": ["user@example.com"]
}
```

## Validation Requirements

### Schema Validation

All schema files must be validated using the validation script:

```bash
# Validate schema syntax only
node scripts/validate-plugin-config.js --schema-only

# This checks:
# - Valid JSON syntax
# - Proper JSON Schema structure
# - Required fields present
# - No syntax errors
```

### Example Configuration Validation

All example configuration files must validate against their schema:

```bash
# Validate example configuration
node scripts/validate-plugin-config.js .github/schemas/examples/plugin-config.example.json

# This checks:
# - Valid JSON syntax
# - Validates against schema
# - Field type validation
# - Best practices
# - WordPress compatibility
```

### Pre-Commit Validation

Schema and example files should be validated before commit:

```bash
# Add to pre-commit hook or CI/CD
npm run validate:schemas
```

## AI Agent Instructions

### When Creating Schema Files

**ALWAYS**:
- ✅ Create in `.github/schemas/` directory
- ✅ Use proper naming: `{purpose}-config.schema.json`
- ✅ Include all required JSON Schema fields
- ✅ Add descriptions for every property
- ✅ Include examples for complex properties
- ✅ Use proper patterns for validation
- ✅ Test with validation script before saving
- ✅ Create corresponding example file

**NEVER**:
- ❌ Create schemas in repository root
- ❌ Skip property descriptions
- ❌ Use outdated JSON Schema versions
- ❌ Forget to validate before committing
- ❌ Mix schemas with source code

### When Creating Example Files

**ALWAYS**:
- ✅ Store in `.github/schemas/` directory
- ✅ Use `.example.json` extension
- ✅ Include helpful "_comment" field
- ✅ Provide realistic, working values
- ✅ Validate against corresponding schema
- ✅ Show common use cases

**NEVER**:
- ❌ Use placeholder values like "xxx" or "TODO"
- ❌ Skip validation
- ❌ Create examples that don't pass schema validation
- ❌ Use sensitive or production data

### Prompt for Schema Creation

```markdown
When creating a JSON Schema file:

1. Create in .github/schemas/ directory (NOT root)
2. Use naming: {purpose}-config.schema.json
3. Include required JSON Schema fields ($schema, $id, title, description)
4. Add detailed descriptions for all properties
5. Include validation patterns (regex, min/max, enums)
6. Provide examples for each property
7. Use JSON Schema Draft 2020-12
8. Create corresponding .example.json file
9. Validate with: node scripts/validate-plugin-config.js --schema-only
10. Commit both schema and example files together

DO NOT create schemas in the repository root.
DO NOT skip property descriptions.
DO NOT forget to validate.
```

## Best Practices

### 1. Comprehensive Descriptions

```json
{
    "slug": {
        "type": "string",
        "description": "URL-safe plugin identifier used in file names, function prefixes, and URLs. Must be lowercase with hyphens only. Example: 'tour-operator' becomes 'tour_operator' namespace.",
        "pattern": "^[a-z][a-z0-9-]{1,48}[a-z0-9]$"
    }
}
```

### 2. Use Enums for Limited Options

```json
{
    "license": {
        "type": "string",
        "description": "Plugin license identifier (SPDX format)",
        "enum": [
            "GPL-2.0-or-later",
            "GPL-3.0-or-later",
            "MIT",
            "Apache-2.0"
        ],
        "default": "GPL-2.0-or-later"
    }
}
```

### 3. Provide Multiple Examples

```json
{
    "cpt_menu_icon": {
        "type": "string",
        "pattern": "^dashicons-[a-z0-9-]+$",
        "examples": [
            "dashicons-palmtree",
            "dashicons-calendar-alt",
            "dashicons-portfolio",
            "dashicons-admin-post"
        ]
    }
}
```

### 4. Use Proper Validation Patterns

```json
{
    "email": {
        "type": "string",
        "format": "email",
        "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    }
}
```

### 5. Document Complex Objects

```json
{
    "taxonomies": {
        "type": "array",
        "description": "Custom taxonomies for the post type. Each taxonomy requires slug, singular, and plural labels. Hierarchical taxonomies work like categories (parent/child), non-hierarchical work like tags (flat list).",
        "items": {
            "type": "object",
            "required": ["slug", "singular", "plural"],
            "properties": { ... }
        }
    }
}
```

## Validation Script Usage

### Basic Validation

```bash
# Validate a configuration file
node scripts/validate-plugin-config.js .github/schemas/plugin-config.example.json

# Output:
# ✅ Configuration is valid according to schema
# ✅ All field types are properly configured
# ✅ All taxonomies are properly configured
# ℹ️  Best practices suggestions...
```

### Schema-Only Validation

```bash
# Validate schema file syntax
node scripts/validate-plugin-config.js --schema-only

# Output:
# ✅ Schema file is valid JSON
# ℹ️  Schema ID: https://lightspeedwp.com/schemas/plugin-config.json
# ℹ️  Required fields: slug, name, author
```

### Integration in Workflow

```bash
# In package.json
"scripts": {
    "validate:schemas": "node scripts/validate-plugin-config.js --schema-only && node scripts/validate-plugin-config.js .github/schemas/plugin-config.example.json"
}

# Run validation
npm run validate:schemas
```

## Summary

✅ **Single Location** - All schemas in `.github/schemas/`

✅ **Proper Naming** - `{purpose}-config.schema.json` and `.example.json`

✅ **Complete Metadata** - $schema, $id, title, description

✅ **Comprehensive Validation** - Patterns, examples, constraints

✅ **Validated** - Use validation script before committing

✅ **Documented** - Clear descriptions for all properties

✅ **Enforced** - Rules apply to all developers and agents

Follow these guidelines to maintain a robust, well-validated schema system for plugin configuration.

## See Also

- docs/CONFIGS.md
- instructions.instructions.md
- .github/instructions/README.md
