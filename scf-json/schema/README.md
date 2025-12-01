---
title: JSON Schema
description: JSON Schema files for validating SCF field groups and plugin data
category: Development
date: 2025-12-01
---

# JSON Schema Files

JSON Schema definitions for validating SCF field groups and other plugin data structures.

## Overview

This directory contains [JSON Schema](https://json-schema.org/) files that define the structure and validation rules for plugin data, particularly SCF field group JSON exports.

## Schema Files

### `scf-field-group.schema.json`

Complete JSON Schema for Secure Custom Fields field group exports.

**Validates:**

- Field group structure and required properties
- Field definitions and types
- Location rules and conditional logic
- Field-specific properties (text, image, repeater, etc.)

**Usage:**

```bash
# Validate a field group JSON file
npx ajv-cli validate -s schema/scf-field-group.schema.json -d ../group_example.json
```

## Schema Structure

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://example.com/scf-field-group.schema.json",
  "title": "SCF Field Group",
  "type": "object",
  "required": ["key", "title", "fields", "location"],
  "properties": {
    "key": {
      "type": "string",
      "pattern": "^group_[a-z0-9_]+$"
    }
  }
}
```

## Validation

### Automated Validation

Field groups are automatically validated when:

1. **Generated** - Generator script validates schema
2. **Saved** - SCF_JSON class validates on save
3. **Tests** - PHPUnit tests validate fixtures
4. **CI/CD** - GitHub Actions validate all JSON files

### Manual Validation

```bash
# Install AJV validator
npm install -g ajv-cli

# Validate single file
ajv validate -s schema/scf-field-group.schema.json -d ../group_example.json

# Validate all field groups
for file in ../*.json; do
    ajv validate -s schema/scf-field-group.schema.json -d "$file"
done
```

### PHP Validation

The plugin includes a PHP validator using the schema:

```php
$scf_json = new {{namespace|pascalCase}}_SCF_JSON();
$result = $scf_json->validate_json_file( 'path/to/field-group.json' );

if ( ! $result['valid'] ) {
    foreach ( $result['errors'] as $error ) {
        echo $error . "\n";
    }
}
```

## Schema Properties

### Field Group Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | Yes | Unique identifier (must start with `group_`) |
| `title` | string | Yes | Human-readable title |
| `fields` | array | Yes | Array of field definitions |
| `location` | array | Yes | Location rules |
| `menu_order` | integer | No | Display order |
| `position` | string | No | Meta box position |
| `style` | string | No | Meta box style |
| `active` | boolean/integer | No | Whether field group is active |

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | Yes | Unique identifier (must start with `field_`) |
| `label` | string | Yes | Human-readable label |
| `name` | string | Yes | Machine name for storage |
| `type` | string | Yes | Field type (text, image, etc.) |
| `instructions` | string | No | Help text |
| `required` | boolean | No | Whether field is required |

### Supported Field Types

The schema validates all SCF field types:

- **Text:** text, textarea, number, email, url, password
- **Content:** wysiwyg, oembed, image, file, gallery
- **Choice:** select, checkbox, radio, button_group, true_false
- **Relational:** link, post_object, relationship, taxonomy, user
- **jQuery:** google_map, date_picker, color_picker
- **Layout:** message, accordion, tab, group, repeater, flexible_content

## Best Practices

1. **Validate early** - Check schema before committing
2. **Use patterns** - Field/group key patterns are enforced
3. **Required fields** - All required properties must be present
4. **Type safety** - Ensure correct data types
5. **Nested validation** - Sub-fields and layouts are recursively validated

## Extending the Schema

To add custom validation rules:

1. Copy `scf-field-group.schema.json`
2. Add custom properties to `definitions`
3. Update `properties` or `required` arrays
4. Test with sample JSON files
5. Document changes in this README

## Troubleshooting

### Validation Fails

**Issue:** JSON file fails validation

**Solutions:**

- Check required properties are present
- Verify field keys start with `field_`
- Verify group key starts with `group_`
- Ensure all fields have `type` property
- Check field types are supported
- Validate JSON syntax (use jsonlint.com)

### Schema Not Found

**Issue:** Validator cannot find schema file

**Solutions:**

- Verify schema file exists in `scf-json/schema/`
- Check file path is correct
- Ensure file has `.json` extension
- Verify file permissions are readable

## References

- [JSON Schema Specification](https://json-schema.org/)
- [AJV Validator](https://ajv.js.org/)
- [SCF Field Types](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/field-types)
- [SCF Documentation](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs)
