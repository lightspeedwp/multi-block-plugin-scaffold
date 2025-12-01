---
title: Translation Files
description: Internationalization (i18n) and localization (l10n) files for the plugin
category: Development
date: 2025-12-01
---

# Translation Files

This directory contains translation files for internationalizing and localizing the plugin.

## Overview

The `languages/` directory stores:

- **POT files** (Portable Object Template) - Source translation template
- **PO files** (Portable Object) - Human-readable translations
- **MO files** (Machine Object) - Compiled binary translations
- **JSON files** - Block editor translations

## File Structure

```
languages/
├── README.md                              # This file
├── {{textdomain}}.pot                     # Translation template
├── {{textdomain}}-{locale}.po             # Translation source (e.g., en_GB.po)
├── {{textdomain}}-{locale}.mo             # Compiled translation
└── {{textdomain}}-{locale}-{hash}.json    # Block editor translation
```

## Translation Files

### POT File (`.pot`)

The source template containing all translatable strings from the plugin.

**Generated from:**

- PHP files (`__()`, `_e()`, `esc_html__()`, etc.)
- JavaScript files (`__()`, `_x()` from `@wordpress/i18n`)
- Block.json files (`title`, `description`, `keywords`)

**Generation:**

```bash
# Automated via GitHub Actions
npm run makepot

# Or manually with WP-CLI
wp i18n make-pot . languages/{{textdomain}}.pot
```

**See:** [.github/workflows/i18n.yml](../.github/workflows/i18n.yml)

### PO Files (`.po`)

Human-readable translation files for specific locales.

**Example (`{{textdomain}}-en_GB.po`):**

```po
msgid "Hello World"
msgstr "Hello World"

msgid "Settings"
msgstr "Settings"
```

**Tools:**

- [Poedit](https://poedit.net/) - Desktop translation editor
- [Loco Translate](https://wordpress.org/plugins/loco-translate/) - WordPress plugin
- [GlotPress](https://wordpress.org/plugins/glotpress/) - Collaborative translation

### MO Files (`.mo`)

Compiled binary translation files loaded by WordPress.

**Generation:**

```bash
# With WP-CLI
wp i18n make-mo languages/{{textdomain}}-en_GB.po languages/

# With msgfmt
msgfmt -o {{textdomain}}-en_GB.mo {{textdomain}}-en_GB.po
```

### JSON Files (`.json`)

Block editor translations in JSON format.

**Naming:** `{textdomain}-{locale}-{hash}.json`

**Example:**

```json
{
  "locale_data": {
    "{{textdomain}}": {
      "Block Title": ["Translated Block Title"],
      "Block Description": ["Translated Block Description"]
    }
  }
}
```

**Generation:**

```bash
wp i18n make-json languages/ --no-purge
```

## Internationalization Workflow

```mermaid
flowchart TB
    subgraph Development["Development Phase"]
        Code[Write Code with<br/>i18n Functions]
        Extract[Extract Strings]
        POT[Generate POT File]
    end

    subgraph Translation["Translation Phase"]
        Dist[Distribute to<br/>Translators]
        PO[Receive PO Files]
        Review[Review Translations]
    end

    subgraph Compilation["Compilation Phase"]
        MO[Compile to<br/>MO Files]
        JSON[Generate JSON<br/>for Blocks]
        Validate[Validate Strings]
    end

    subgraph Deployment["Deployment Phase"]
        Test[Test Translations]
        Deploy[Deploy to Production]
        Monitor[Monitor Usage]
    end

    Code --> Extract
    Extract --> POT
    POT --> Dist
    Dist --> PO
    PO --> Review
    Review --> MO
    MO --> JSON
    JSON --> Validate
    Validate --> Test
    Test --> Deploy
    Deploy --> Monitor

    style Development fill:#e3f2fd
    style Translation fill:#fff3e0
    style Compilation fill:#f3e5f5
    style Deployment fill:#e8f5e9

The plugin uses the text domain: **`{{textdomain}}`**

**Usage in PHP:**

```php
__( 'Text to translate', '{{textdomain}}' );
_e( 'Text to translate', '{{textdomain}}' );
esc_html__( 'Text to translate', '{{textdomain}}' );
esc_html_e( 'Text to translate', '{{textdomain}}' );
_x( 'Text', 'context', '{{textdomain}}' );
_n( 'Singular', 'Plural', $count, '{{textdomain}}' );
```

**Usage in JavaScript:**

```javascript
import { __ } from '@wordpress/i18n';

const text = __( 'Text to translate', '{{textdomain}}' );
```

**Usage in block.json:**

```json
{
  "title": "Block Title",
  "description": "Block Description",
  "textdomain": "{{textdomain}}"
}
```

## Best Practices

### String Guidelines

1. **Use full sentences** - Don't break sentences into multiple strings
2. **Provide context** - Use `_x()` when the same word has different meanings
3. **Avoid concatenation** - Don't concatenate translated strings
4. **Include punctuation** - Keep punctuation inside translation strings
5. **Use placeholders** - Use sprintf() for dynamic content

**Good:**

```php
/* translators: %s: post title */
sprintf( __( 'Editing: %s', '{{textdomain}}' ), $post_title );
```

**Bad:**

```php
__( 'Editing', '{{textdomain}}' ) . ': ' . $post_title;
```

### Developer Comments

Add translator comments for context:

```php
/* translators: %1$s: number of items, %2$s: item type */
sprintf(
    _n(
        'You have %1$s %2$s',
        'You have %1$s %2$s',
        $count,
        '{{textdomain}}'
    ),
    number_format_i18n( $count ),
    $item_type
);
```

### Escaping

Always escape translated output:

```php
echo esc_html__( 'Safe Text', '{{textdomain}}' );
echo esc_attr__( 'Attribute Text', '{{textdomain}}' );
echo wp_kses_post( __( 'HTML Content', '{{textdomain}}' ) );
```

### Block Editor

Load text domain for JavaScript:

```php
wp_set_script_translations(
    'my-block-script',
    '{{textdomain}}',
    plugin_dir_path( __FILE__ ) . 'languages'
);
```

## Locale Codes

Common locale codes:

| Locale | Language         |
|--------|------------------|
| en_GB  | English (UK)     |
| en_US  | English (US)     |
| de_DE  | German           |
| fr_FR  | French           |
| es_ES  | Spanish (Spain)  |
| it_IT  | Italian          |
| nl_NL  | Dutch            |
| pt_BR  | Portuguese (Brazil) |
| ja     | Japanese         |
| zh_CN  | Chinese (Simplified) |

## Validation

### Automated Checks

The i18n workflow validates:

- ✅ All translatable strings use text domain
- ✅ No hardcoded strings in templates
- ✅ POT file is up to date
- ✅ All blocks have textdomain in block.json

**See:** [.github/workflows/i18n.yml](../.github/workflows/i18n.yml)

### Manual Testing

1. **Install a translation plugin** (Loco Translate)
2. **Switch WordPress language** (Settings → General)
3. **Verify translations appear** in admin and frontend
4. **Test RTL languages** if applicable

## Troubleshooting

### Translations Not Loading

**Issue:** Translations not appearing in WordPress

**Solutions:**

1. Verify MO file exists in `languages/` directory
2. Check file naming: `{textdomain}-{locale}.mo`
3. Ensure text domain matches in all functions
4. Clear WordPress and plugin caches
5. Check `load_plugin_textdomain()` is called

### Missing Strings in POT

**Issue:** Some strings not extracted to POT file

**Solutions:**

1. Verify i18n functions are used correctly
2. Check strings are not in commented code
3. Ensure files are in src/, inc/, or templates/
4. Run `npm run makepot` to regenerate
5. Check for syntax errors in PHP/JS files

### Block Editor Not Translated

**Issue:** Block editor strings not translating

**Solutions:**

1. Generate JSON files: `wp i18n make-json languages/`
2. Call `wp_set_script_translations()` for block scripts
3. Verify JSON file hash matches compiled script
4. Check browser console for loading errors
5. Clear browser cache

## Contributing Translations

### For Developers

1. Ensure all user-facing text is wrapped in i18n functions
2. Add translator comments for context
3. Run `npm run makepot` before committing
4. Test with a translation plugin
5. Commit POT file with code changes

### For Translators

1. Download the latest POT file
2. Create PO file for your locale
3. Translate strings using Poedit or similar tool
4. Test translations in WordPress
5. Submit PO file via GitHub or email

## References

- [WordPress I18n Handbook](https://developer.wordpress.org/apis/handbook/internationalization/)
- [Plugin I18n](https://developer.wordpress.org/plugins/internationalization/)
- [WP-CLI i18n Commands](https://developer.wordpress.org/cli/commands/i18n/)
- [GlotPress](https://wordpress.org/plugins/glotpress/)
- [Poedit](https://poedit.net/)
