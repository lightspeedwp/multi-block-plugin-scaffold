---
title: Prettier Configuration
description: Code formatter configuration and best practices
category: Configuration
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

Prettier is an opinionated code formatter that ensures consistent code style. This plugin extends the WordPress Prettier configuration with custom overrides for PHP and CSS files.

## Configuration File

Location: `.prettier.config.cjs`

## WordPress Package Used

- `@wordpress/prettier-config` - ^4.35.0

## Configuration

```javascript
module.exports = {
 ...require( '@wordpress/prettier-config' ),
 overrides: [
  {
   files: [ '*.php' ],
   options: {
    parser: 'php',
    phpVersion: '8.0',
    tabWidth: 4,
    useTabs: true,
   },
  },
  {
   files: [ '*.scss', '*.css' ],
   options: {
    tabWidth: 2,
    useTabs: false,
   },
  },
 ],
};
## WordPress Default Settings

The `@wordpress/prettier-config` provides:

```javascript
{
  printWidth: 80,        // Line length
  tabWidth: 4,           // Tab size
  useTabs: true,         // Use tabs (not spaces)
  semi: true,            // Semicolons required
  singleQuote: true,     // Single quotes preferred
  trailingComma: 'es5',  // Trailing commas where valid in ES5
  bracketSpacing: true,  // Spaces in object literals
  arrowParens: 'always', // Always parentheses in arrow functions
  endOfLine: 'lf',       // Unix line endings
}
```

## Custom Overrides

### PHP Files

```json
{
  "files": ["*.php"],
  "options": {
    "parser": "php",
    "phpVersion": "8.0",
    "tabWidth": 4,
    "useTabs": true
  }
}
```

Features:

- PHP 8.0 syntax support
- WordPress PHP coding standards
- Tab indentation (4 spaces width)

### CSS/SCSS Files

```json
{
  "files": ["*.scss", "*.css"],
  "options": {
    "tabWidth": 2,
    "useTabs": false
  }
}
```

Features:

- 2-space indentation for styles
- Uses spaces instead of tabs
- Follows CSS formatting conventions

## Supported File Types

- **JavaScript**: `.js`, `.jsx`
- **TypeScript**: `.ts`, `.tsx`
- **JSON**: `.json`
- **Markdown**: `.md`
- **YAML**: `.yml`, `.yaml`
- **CSS**: `.css`
- **SCSS**: `.scss`
- **HTML**: `.html`
- **PHP**: `.php`

## Available Scripts

```bash
# Format all files
npm run format

# Format specific directory
npx prettier --write src/

# Check formatting without changing
npx prettier --check src/

# Format specific file
npx prettier --write src/{{slug}}/edit.js
```

## Command Line Usage

```bash
# Format all JavaScript
npx prettier --write "src/**/*.js"

# Format all styles
npx prettier --write "src/**/*.scss"

# Check if files are formatted
npx prettier --check "src/**/*.{js,scss}"

# Format PHP files
npx prettier --write "*.php"
```

## VS Code Integration

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[php]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Customization

### Additional Overrides

```json
{
  "extends": ["@wordpress/prettier-config"],
  "overrides": [
    {
      "files": ["*.json"],
      "options": {
        "tabWidth": 2,
        "useTabs": false
      }
    },
    {
      "files": ["*.md"],
      "options": {
        "proseWrap": "always"
      }
    }
  ]
}
```

### Create .prettierrc.js

For dynamic configuration:

```javascript
module.exports = {
  ...require('@wordpress/prettier-config'),
  overrides: [
    ...require('@wordpress/prettier-config').overrides,
    {
      files: ['*.php'],
      options: {
        parser: 'php',
        phpVersion: '8.0',
        tabWidth: 4,
        useTabs: true,
      },
    },
  ],
};
```

## Ignoring Files

Create `.prettierignore`:

```
# Build output
build/
dist/
public/

# Dependencies
node_modules/
vendor/

# WordPress
languages/
*.pot
*.po
*.mo

# Minified files
*.min.js
*.min.css

# Third-party
assets/vendor/
```

## Integration with ESLint

Prettier and ESLint work together seamlessly with WordPress configs. No additional plugins needed.

## Pre-commit Formatting

### Using Husky and lint-staged

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "git add"],
    "*.{css,scss}": ["prettier --write", "git add"],
    "*.php": ["prettier --write", "git add"],
    "*.{json,md,yml}": ["prettier --write", "git add"]
  }
}
```

## Common Patterns

### Disable for Block

```javascript
// prettier-ignore
const obj = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
```

### Disable for Range

```javascript
// prettier-ignore-start
const matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];
// prettier-ignore-end
```

### PHP Formatting

```php
<?php
// prettier-ignore
$array = array(
    'key1' => 'value1',
    'key2' => 'value2',
);
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Check code formatting
  run: npm run format:check

# Or create custom script:
- name: Format check
  run: npx prettier --check "src/**/*.{js,scss,php}"
```

## Common Issues

### PHP Formatting Not Working

**Solution**: Install PHP plugin for Prettier:

```bash
npm install --save-dev @prettier/plugin-php
```

### Different Line Endings

**Solution**: Ensure consistent line endings:

```json
{
  "endOfLine": "lf"
}
```

Add to `.gitattributes`:

```
* text=auto eol=lf
```

### Conflicts with ESLint

**Solution**: WordPress configs are compatible. No action needed.

## Best Practices

1. **Use WordPress Config**: Start with `@wordpress/prettier-config`
2. **Format on Save**: Enable in your editor
3. **Consistent Overrides**: Keep PHP and CSS overrides
4. **Pre-commit Hooks**: Format before committing
5. **Ignore Build Files**: Add to `.prettierignore`
6. **Team Agreement**: Ensure team uses same config
7. **Document Ignores**: Comment why code is ignored

## Resources

- [Prettier Official Documentation](https://prettier.io/)
- [WordPress Prettier Config](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-prettier-config/)
- [Prettier PHP Plugin](https://github.com/prettier/plugin-php)
- [Prettier Options](https://prettier.io/docs/en/options.html)
