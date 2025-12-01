---
title: SCF Configuration
description: Secure Custom Fields JSON definitions
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

# SCF JSON Field Groups

This directory contains JSON exports of Secure Custom Fields (SCF) field groups for the plugin.

## Overview

SCF's [Local JSON](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/local-json.md) feature allows you to save field group configurations as JSON files. This provides:

- **Version control**: Track field group changes in Git
- **Performance**: Reduces database queries on load
- **Portability**: Easy deployment across environments
- **Team collaboration**: Merge field changes like code

## Directory Structure

```
scf-json/
├── README.md                              # This file
├── group_{{slug}}_example.json           # Example field group
├── group_{{slug}}_post_meta.json         # Post meta fields
├── group_{{slug}}_options.json           # Options page fields
└── schema/
    └── scf-field-group.schema.json       # JSON Schema for validation
```

## How Local JSON Works

### Automatic Saving

When you create or modify a field group in the WordPress admin, SCF automatically saves a JSON file to this directory (if properly configured).

### Configuration

In your plugin, enable Local JSON saving by adding:

```php
add_filter( 'acf/settings/save_json', function( $path ) {
    return plugin_dir_path( __FILE__ ) . 'scf-json';
} );

add_filter( 'acf/settings/load_json', function( $paths ) {
    $paths[] = plugin_dir_path( __FILE__ ) . 'scf-json';
    return $paths;
} );
```

### Loading Priority

SCF loads field groups from JSON files first, then checks the database. This means:

1. JSON files take precedence over database entries
2. Changes made in admin UI are saved to JSON (if save path is configured)
3. Database entries are only used if no JSON file exists for that field group

## Field Group Files

### group_{{slug}}_example.json

An example field group demonstrating various field types. Use this as a reference for creating your own field groups.

### group_{{slug}}_post_meta.json

Field group for custom post type meta fields. Attached to the `{{slug}}` post type.

### group_{{slug}}_options.json

Field group for the plugin options page. Contains site-wide settings.

## Creating New Field Groups

### Method 1: Admin UI Export

1. Create your field group in WordPress admin (SCF → Field Groups)
2. The JSON file will be saved automatically to this directory
3. Commit the new JSON file to version control

### Method 2: Manual Creation

1. Copy an existing JSON file as a template
2. Update the `key`, `title`, and `name` values (must be unique)
3. Modify the `fields` array to define your fields
4. Ensure all field `key` values are unique across your plugin

### Method 3: PHP Registration

For programmatic field registration, use the inc/ class files instead of JSON:

```php
acf_add_local_field_group( array(
    'key'    => 'group_unique_key',
    'title'  => 'My Field Group',
    'fields' => array( /* ... */ ),
    'location' => array( /* ... */ ),
) );
```

## JSON Schema Validation

Use the provided JSON Schema to validate your field group files:

```bash
# Using ajv-cli
npx ajv validate -s schema/scf-field-group.schema.json -d group_*.json
```

This helps catch:

- Missing required properties
- Invalid field types
- Incorrect structure

## Field Types Reference

For a complete list of SCF field types and their properties, see:

- [SCF Field Types Documentation](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/field-types)
- [.github/instructions/scf-fields.instructions.md](../.github/instructions/scf-fields.instructions.md)

## Best Practices

1. **Unique keys**: Always use globally unique keys (prefix with your plugin slug)
2. **Descriptive names**: Use clear, descriptive field names
3. **Instructions**: Add helpful instructions for content editors
4. **Conditional logic**: Use sparingly to keep forms simple
5. **Field order**: Organise fields logically using tabs or accordion
6. **Validation**: Add required validation where appropriate

## Troubleshooting

### Field group not loading

- Check the `key` is unique
- Verify the JSON file is valid (use schema validation)
- Ensure the load_json filter is configured correctly

### Changes not saving to JSON

- Verify the save_json filter is configured
- Check directory permissions (must be writable)
- Clear any caching plugins

### Duplicate field groups

- Each field group must have a unique `key`
- Remove duplicates from either JSON or database
- Consider using `acf/settings/json_save_format` to customise output

## References

- [SCF Local JSON Tutorial](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/local-json.md)
- [SCF API Reference](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/api/index.md)
- [WordPress Plugin Dependencies](https://make.wordpress.org/core/2024/03/05/introducing-plugin-dependencies-in-wordpress-6-5/)
