---
title: Template Validation Report
description: Template validation and health check report
category: Testing
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

This document validates that all mustache templates used in the single-block plugin scaffold are properly defined in the generation script and will be replaced during plugin generation.

## Valid Mustache Templates

The following templates are defined in `bin/generate-single-block-plugin.js`:

### Core Plugin Information

| Template | Default Value | Sanitization | Description |
|----------|---------------|--------------|-------------|
| `{{slug}}` | `my-block` | slug | Plugin slug (lowercase, hyphens) |
| `{{name}}` | `My Block` | name | Plugin display name |
| `{{description}}` | `A single block plugin.` | text | Plugin description |
| `{{author}}` | `Author Name` | name | Plugin author name |
| `{{author_uri}}` | `https://example.com` | url | Author website URL |
| `{{version}}` | `1.0.0` | version | Plugin version (semver) |

### Plugin Header Fields

| Template | Default Value | Description |
|----------|---------------|-------------|
| `{{textdomain}}` | Same as slug | WordPress text domain |
| `{{namespace}}` | Slug with underscores | Plugin namespace |
| `{{plugin_uri}}` | GitHub URL | Plugin homepage URL |
| `{{requires_wp}}` | `6.0` | Minimum WordPress version |
| `{{requires_php}}` | `8.0` | Minimum PHP version |
| `{{license}}` | `GPL-2.0-or-later` | License identifier |
| `{{license_uri}}` | GPL license URL | License URL |
| `{{update_uri}}` | GitHub URL | Update URI |
| `{{copyright_year}}` | Current year | Copyright year |
| `{{copyright_holder}}` | Same as author | Copyright holder |

### WordPress.org Readme Fields

| Template | Default Value | Description |
|----------|---------------|-------------|
| `{{contributors}}` | Sanitized author | WordPress.org usernames |
| `{{donate_url}}` | Author URI | Donation link |
| `{{tag1-5}}` | Various | Plugin tags (max 5) |
| `{{tested_up_to}}` | `6.7` | Latest WordPress tested |
| `{{short_description}}` | Truncated description | 150 char description |
| `{{support_url}}` | WordPress.org URL | Support forum URL |
| `{{github_url}}` | GitHub repository | GitHub repository URL |
| `{{docs_url}}` | GitHub wiki | Documentation URL |
| `{{block_name}}` | Same as name | Block display name |
| `{{block_category}}` | `common` | Block category |
| `{{block_supports}}` | Feature list | Block supports |
| `{{release_date}}` | Current date | Release date |
| `{{use_case_1-3}}` | Default text | Use case descriptions |
| `{{block_features}}` | Feature list | Block features |
| `{{new_feature_1-2}}` | Default text | New features in changelog |
| `{{improvement_1-2}}` | Default text | Improvements in changelog |
| `{{bug_fix_1-2}}` | Default text | Bug fixes in changelog |
| `{{dev_note_1-2}}` | Default text | Developer notes |
| `{{upgrade_notice}}` | Default text | Upgrade notice |

## Template Usage by File

### Plugin Files

#### `{{slug}}.php` (Main Plugin File)

- ✅ All core plugin header fields
- ✅ Copyright and license information
- ✅ Package documentation

#### `readme.txt` (WordPress.org Readme)

- ✅ All readme header fields
- ✅ Changelog placeholders
- ✅ FAQ and documentation links
- ✅ Technical details

### Bin Scripts

#### `bin/build.sh`

- ✅ `{{slug}}` - Line 3 (comment)
- ✅ `{{name}}` - Line 8 (echo message)

#### `bin/test.sh`

- ✅ `{{slug}}` - Line 3 (comment)
- ✅ `{{name}}` - Line 8 (echo message)

#### `bin/update-version.js`

- ✅ `{{slug}}` - Lines 4, 85, 90
- ✅ `{{name}}` - Lines 61, 125

### Configuration Files

#### `webpack.config.js`

- ✅ `{{slug}}` - Lines 3, 13, 14, 22
- Used in entry points, paths, and aliases for build process

### Test Files

#### `tests/bin/generate-single-block-plugin.test.js`

- ✅ Uses `{{slug}}` in package header (line 4)
- ✅ No template usage in test logic (uses literal values)

#### `tests/bin/update-version.test.js`

- ✅ Uses `{{slug}}` in package header (line 4)
- ✅ No template usage in test logic (uses literal values like `test-plugin.php`)

## Removed Invalid Templates

The following templates were found in early versions but are NOT defined in the generation script and have been removed/replaced:

| Invalid Template | Replacement Strategy |
|------------------|---------------------|
| `{{name}}` | Replaced with `{{name}}` |
| `{{namespace}}` | Not needed in tests (use literal values) |
| `{{textdomain}}` | Not needed in tests |
| `{{license}}` | Not needed in tests |
| `{{namespace\|upper}}` | Not needed in tests |
| `{{namespace\|pascalCase}}` | Not needed in tests |
| `{{slug\|snakeCase}}` | Not needed in tests |

## Validation Status

### ✅ Bin Scripts

All bin scripts (`build.sh`, `test.sh`, `update-version.js`) now use only valid mustache templates that are defined in `generate-single-block-plugin.js`.

### ✅ Configuration Files

The `webpack.config.js` file uses valid mustache templates for entry points, paths, and aliases that will be properly replaced during plugin generation.

### ✅ Test Files

All test files use valid templates in their package headers and use literal values in test logic (which is correct - tests should not have dynamic placeholders that need replacement).

### ✅ Generation Script

The `generate-single-block-plugin.js` script properly:

- Defines 6 mustache placeholders with defaults
- Sanitizes all input values
- Replaces placeholders in copied files
- Renames `{{slug}}.php` to the actual slug value

## Recommendations

1. **For Plugin Scaffold Files**: Only use the 6 valid templates listed above
2. **For Test Files**: Use literal values in test logic, templates only in file headers
3. **For Future Templates**: If new templates are needed:
   - Add to `placeholders` object in `generate-single-block-plugin.js`
   - Add sanitization logic
   - Update this validation document

## Testing

To test that templates are properly replaced:

```bash
# Generate a test plugin
node bin/generate-single-block-plugin.js \
  --slug="test-plugin" \
  --name="Test Plugin" \
  --description="A test plugin" \
  --author="Test Author" \
  --author_uri="https://example.com" \
  --version="1.0.0"

# Verify no unreplaced templates remain
grep -r "{{" ../test-plugin/ --exclude-dir=node_modules --exclude-dir=vendor
```

If the grep command returns no results, all templates were successfully replaced.

## Related Documentation

- [BUILD-PROCESS.md](./BUILD-PROCESS.md) - Build process and template usage
- [TESTING.md](./TESTING.md) - Testing with template validation
- [LINTING.md](./LINTING.md) - Code quality standards
- [LOGGING.md](./LOGGING.md) - Validation logging
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD validation checks
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance considerations

## Validation Date

Last validated: 2025-01-23
