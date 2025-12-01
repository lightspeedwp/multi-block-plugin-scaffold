---
title: ESLint Configuration
description: JavaScript linting rules and code quality standards
category: Configuration
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

ESLint is a JavaScript linter that helps maintain code quality and consistency. This plugin uses the WordPress ESLint configuration to follow WordPress coding standards.

## Configuration File

Location: `.eslint.config.cjs`

## Configuration

This plugin extends the WordPress ESLint configuration.

## WordPress Package Used

- `@wordpress/eslint-plugin` - ^22.21.0

## Configuration

```javascript
module.exports = {
 extends: [ '@wordpress/eslint-plugin/recommended' ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    wp: 'readonly',
    wpApiSettings: 'readonly',
  }
}
```

## Creating Custom Configuration

To customize ESLint rules, create an `.eslintrc.js` file in the plugin root:

```javascript
module.exports = {
  extends: ['plugin:@wordpress/eslint-plugin/recommended'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true,
  },
  globals: {
    wp: 'readonly',
    wpApiSettings: 'readonly',
    ajaxurl: 'readonly',
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    '@wordpress/no-unused-vars-before-return': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/__tests__/**/*.js'],
      env: {
        jest: true,
      },
      globals: {
        page: 'readonly',
        browser: 'readonly',
        context: 'readonly',
      },
    },
  ],
};
```

## Available Presets

### @wordpress/eslint-plugin/recommended

Default preset with WordPress best practices:

```javascript
extends: ['plugin:@wordpress/eslint-plugin/recommended']
```

### @wordpress/eslint-plugin/recommended-with-formatting

Includes formatting rules (use if not using Prettier):

```javascript
extends: ['plugin:@wordpress/eslint-plugin/recommended-with-formatting']
```

### @wordpress/eslint-plugin/i18n

Internationalization rules:

```javascript
extends: [
  'plugin:@wordpress/eslint-plugin/recommended',
  'plugin:@wordpress/eslint-plugin/i18n',
]
```

## Available Scripts

```bash
# Lint all JavaScript files
npm run lint:js

# Auto-fix JavaScript issues
npm run lint:js:fix

# Lint specific file
npx eslint src/{{slug}}/edit.js

# Lint and fix specific file
npx eslint src/{{slug}}/edit.js --fix
```

## Usage

### Command Line

```bash
# Lint all JavaScript
npx eslint src

# Lint specific files
npx eslint src/**/*.js

# Auto-fix issues
npx eslint src --fix

# Check specific file
npx eslint src/index.js --fix
```

### VS Code Integration

Install the ESLint extension:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
```

## Key Rules for Blocks

### WordPress Specific

```javascript
{
  // Enforce translation function usage
  '@wordpress/i18n-text-domain': ['error', { allowedTextDomain: 'plugin-slug' }],

  // Require dependencies array
  '@wordpress/dependency-group': 'error',

  // No unused variables before return
  '@wordpress/no-unused-vars-before-return': 'error',

  // Data module naming
  '@wordpress/data-no-store-string-literals': 'error',
}
```

### React/JSX Rules

```javascript
{
  'react/jsx-uses-react': 'off', // Not needed in React 17+
  'react/react-in-jsx-scope': 'off', // Not needed in React 17+
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
}
```

### Block Development

```javascript
{
  // Prefer named exports for components
  'import/prefer-default-export': 'off',

  // Allow .js extension for JSX
  'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
}
```

## Customization

### Add Custom Globals

```javascript
globals: {
  wp: 'readonly',
  wpApiSettings: 'readonly',
  pluginSettings: 'readonly', // Custom global
}
```

### Override Rules

```javascript
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  '@wordpress/dependency-group': 'warn', // Downgrade to warning
}
```

### Ignore Patterns

Create `.eslintignore`:

```
build/
node_modules/
vendor/
*.min.js
```

## Integration with Prettier

ESLint and Prettier work together without conflicts. The WordPress ESLint plugin is compatible with Prettier.

```javascript
extends: [
  'plugin:@wordpress/eslint-plugin/recommended',
  // Prettier config should come last
],
```

## Pre-commit Hooks

Using Husky and lint-staged:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "git add"]
  }
}
```

## Common Issues

### "wp is not defined"

**Solution**: Add to globals:

```javascript
globals: {
  wp: 'readonly',
}
```

### React Hooks Warnings

**Solution**: Install and configure:

```bash
npm install --save-dev eslint-plugin-react-hooks
```

```javascript
{
  extends: ['plugin:@wordpress/eslint-plugin/recommended'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }
}
```

## Best Practices

1. **Use WordPress Preset**: Start with `@wordpress/eslint-plugin/recommended`
2. **Minimal Overrides**: Only customize rules you absolutely need
3. **Document Exceptions**: Add comments explaining rule disables
4. **Run Before Commit**: Use pre-commit hooks
5. **Fix Automatically**: Use `--fix` flag when possible
6. **Consistent Globals**: Define all WordPress globals used
7. **Test Files**: Add specific rules for test environments

## Resources

- [ESLint Official Documentation](https://eslint.org/)
- [WordPress ESLint Plugin](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-eslint-plugin/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [ESLint Rules](https://eslint.org/docs/rules/)
