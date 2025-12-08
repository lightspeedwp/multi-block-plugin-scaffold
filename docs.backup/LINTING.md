---
title: Linting Guide
description: Code quality and linting standards for the multi-block plugin scaffold
category: Development
type: Guide
audience: Developers
date: 2025-12-07
---

# Linting Guide

This document covers all linting tools, standards, and workflows for maintaining code quality in the Multi-Block Plugin Scaffold.

## Overview

The scaffold uses comprehensive linting for all file types:

- **JavaScript/JSX** - ESLint with WordPress coding standards
- **CSS/SCSS** - Stylelint with WordPress coding standards
- **PHP** - PHPCS with WordPress coding standards
- **JSON** - Package.json validation
- **Markdown** - Markdown linting for documentation

## Quick Reference

```bash
# Lint all
npm run lint

# Lint specific types
npm run lint:js          # JavaScript/JSX
npm run lint:css         # CSS/SCSS
composer run lint        # PHP

# Auto-fix
npm run lint:js:fix      # Fix JavaScript
npm run lint:css:fix     # Fix CSS
composer run lint:fix    # Fix PHP

# Dry run (for scaffold templates)
npm run lint:dry-run     # Lint with mustache substitution
```

## JavaScript/JSX Linting

### Configuration

**Files:**

- `.eslintrc.js` or `eslint.config.cjs` - ESLint configuration
- `.eslintignore` - Files to ignore

**Standards:**

- `@wordpress/eslint-plugin` - WordPress JavaScript coding standards
- ES6+ syntax
- React best practices
- JSX a11y rules

### Running

```bash
# Lint all JavaScript
npm run lint:js

# Fix automatically
npm run lint:js:fix

# Lint specific file
npx eslint src/blocks/example/edit.js

# Lint with verbose output
npm run lint:js -- --debug
```

### Common Rules

```javascript
// ✅ Good
import { __ } from '@wordpress/i18n';

export default function Component() {
  const [ value, setValue ] = useState( '' );
  return <div className="my-class">{__( 'Text', 'textdomain' )}</div>;
}

// ❌ Bad
import {__} from '@wordpress/i18n'; // No spacing
function Component() { // Missing export default
  const [value,setValue]=useState(''); // No spacing
  return <div class="my-class">{__('Text','textdomain')}</div>; // class not className, no spacing
}
```

### Disabling Rules

```javascript
// Disable for a line
// eslint-disable-next-line no-console
console.log( 'Debug info' );

// Disable for a block
/* eslint-disable no-console */
console.log( 'Debug 1' );
console.log( 'Debug 2' );
/* eslint-enable no-console */

// Disable for entire file (use sparingly)
/* eslint-disable */
```

## CSS/SCSS Linting

### Configuration

**Files:**

- `.stylelintrc.json` or `stylelint.config.cjs` - Stylelint configuration
- `.stylelintignore` - Files to ignore

**Standards:**

- `@wordpress/stylelint-config` - WordPress CSS coding standards
- SCSS syntax support
- BEM methodology encouraged

### Running

```bash
# Lint all CSS/SCSS
npm run lint:css

# Fix automatically
npm run lint:css:fix

# Lint specific file
npx stylelint src/blocks/**/*.scss

# Lint with custom config
npx stylelint "src/**/*.scss" --config stylelint.config.cjs
```

### Common Rules

```scss
// ✅ Good
.block-name {
  padding: 1rem;
  color: var( --wp--preset--color--primary );

  &__element {
    margin: 0;
  }

  &--modifier {
    font-weight: bold;
  }
}

// ❌ Bad
.block-name{padding:1rem;color:#333} // No spacing, hard-coded color
.block-name__element{margin:0px} // Use 0 not 0px
.block-name--modifier{font-weight:700} // Use bold not 700
```

### Disabling Rules

```scss
// Disable for a line
/* stylelint-disable-next-line selector-class-pattern */
.legacy-class-name {
  color: red;
}

// Disable for a block
/* stylelint-disable */
.custom-styles {
  // Non-standard styles
}
/* stylelint-enable */
```

## PHP Linting

### Configuration

**Files:**

- `phpcs.xml` - PHP CodeSniffer configuration
- `phpstan.neon` - PHPStan configuration

**Standards:**

- `WordPress` - WordPress PHP coding standards
- `WordPress-Core` - Core code standards
- PHPStan level 8 - Static analysis

### Running

```bash
# Lint all PHP
composer run lint

# Fix automatically
composer run lint:fix

# Lint specific file
./vendor/bin/phpcs inc/class-example.php

# PHPStan analysis
composer run phpstan

# Detailed output
./vendor/bin/phpcs inc/ -v
```

### Common Rules

```php
<?php
// ✅ Good
function example_function( $arg ) {
 if ( ! empty( $arg ) ) {
  return esc_html( $arg );
 }
 return '';
}

// ❌ Bad
function example_function($arg){ // No spacing
  if(!empty($arg)){ // Wrong indentation, no spacing
    return $arg; // Not escaped
  }
  return ''; }
```

### Disabling Rules

```php
<?php
// Disable for a line
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
echo $allowed_html;

// Disable for a block
// phpcs:disable WordPress.NamingConventions.ValidVariableName
$legacyVariableName = 'value';
// phpcs:enable WordPress.NamingConventions.ValidVariableName
```

## Dry Run Linting

For scaffold templates with mustache variables, use dry-run linting:

### What is Dry Run?

Dry run temporarily replaces mustache variables (like `{{slug}}`, `{{namespace}}`) with test values, runs linting, then restores the original files. This allows you to lint template files without generating a complete plugin.

### Usage

```bash
# Lint JavaScript and CSS with variable substitution
npm run lint:dry-run

# Run all linting (JS, CSS, package.json)
npm run dry-run:lint

# Run custom lint commands
npm run dry-run -- lint:js lint:css lint:pkg-json

# Run tests and linting together
npm run dry-run:all
```

### How It Works

1. **Finds files** with mustache variables (`{{variable}}`)
2. **Creates backup** in `.dry-run-backup/` directory
3. **Replaces variables** with test values from `bin/dry-run-config.js`
4. **Runs linting** commands
5. **Restores originals** from backup
6. **Cleans up** backup directory

### Test Values

Default test values used during dry run:

```javascript
{
  slug: 'example-plugin',
  name: 'Example Plugin',
  namespace: 'example_plugin',
  textdomain: 'example-plugin',
  version: '1.0.0',
  author: 'Example Author',
  // ... more in bin/dry-run-config.js
}
```

### When to Use Dry Run

- ✅ **Developing scaffold templates** - Lint without generating plugin
- ✅ **Pre-commit checks** - Automated in husky hooks
- ✅ **CI/CD pipelines** - Validate templates in workflows
- ❌ **Generated plugins** - Use normal linting after generation

### Configuration

Edit `bin/dry-run-config.js` to customize test values:

```javascript
const DRY_RUN_VALUES = {
  slug: 'my-test-plugin',
  name: 'My Test Plugin',
  // Add more values as needed
};
```

### Logging

Dry run creates detailed logs in `logs/dry-run-<timestamp>.log`:

```bash
# View dry run logs
tail -f logs/dry-run-*.log

# Check for errors
grep "ERROR" logs/dry-run-*.log
```

## Pre-commit Hooks

Linting runs automatically on commit via Husky:

### Configuration

**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check if this is a scaffold template
if grep -q "{{slug}}" package.json 2>/dev/null; then
    echo "🔍 Scaffold template detected - running dry-run linting..."
    npm run dry-run:lint
else
    echo "🔍 Running standard linting..."
    npm run lint:js
    npm run lint:css
fi
```

### Bypassing Hooks

```bash
# Skip pre-commit hook entirely
git commit --no-verify -m "message"

# Or set environment variable
HUSKY=0 git commit -m "message"
```

## CI/CD Integration

Linting runs automatically in GitHub Actions:

### Workflow Configuration

```yaml
# .github/workflows/ci-cd.yml
jobs:
  lint-and-test:
    steps:
      - name: Lint JavaScript
        run: npm run lint:js

      - name: Lint CSS
        run: npm run lint:css

      - name: Lint PHP
        run: composer run lint

      - name: Upload logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: workflow-logs
          path: logs/
```

### Logs

All workflow linting is logged to `logs/workflow-ci-cd-<timestamp>.log` and uploaded as artifacts.

## IDE Integration

### VS Code

**Extensions:**

- ESLint (`dbaeumer.vscode-eslint`)
- Stylelint (`stylelint.vscode-stylelint`)
- PHP Intelephense (`bmewburn.vscode-intelephense-client`)

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "stylelint.validate": [
    "css",
    "scss"
  ]
}
```

### PHPStorm

1. **Preferences → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint**
   - Enable: Automatic ESLint configuration

2. **Preferences → Languages & Frameworks → Style Sheets → Stylelint**
   - Enable: Enable Stylelint

3. **Preferences → Languages & Frameworks → PHP → Quality Tools**
   - Enable: PHP CodeSniffer
   - Path: `vendor/bin/phpcs`

## Linting Best Practices

### 1. Fix Errors Before Warnings

```bash
# Show only errors
npm run lint:js -- --quiet

# Fix errors first, then warnings
npm run lint:js:fix
```

### 2. Lint Early and Often

```bash
# Lint on file save (VS Code)
"editor.codeActionsOnSave": {
  "source.fixAll": true
}

# Or run watch mode
npm run start  # Watches and lints on change
```

### 3. Understand Errors

```bash
# Get rule documentation
npx eslint src/index.js --print-config

# Search for rule details
# Visit: https://eslint.org/docs/rules/
# Visit: https://github.com/WordPress/gutenberg/tree/trunk/packages/eslint-plugin
```

### 4. Team Standards

- **Don't disable rules without discussion**
- **Document exceptions** with comments
- **Update configs** when patterns change
- **Review lint errors** in PRs

### 5. Performance

```bash
# Cache results for faster linting
npm run lint:js -- --cache

# Lint only changed files
git diff --name-only --diff-filter=ACMR | grep '\.js$' | xargs npm run lint:js --
```

## Common Issues

### Issue: "Parsing error: Unexpected token"

**Cause:** ESLint parser doesn't understand syntax

**Solution:**

```javascript
// Add to .eslintrc.js
parserOptions: {
  ecmaVersion: 2021,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
}
```

### Issue: "Unknown rule"

**Cause:** Plugin not installed or outdated

**Solution:**

```bash
npm install --save-dev @wordpress/eslint-plugin@latest
```

### Issue: "PHPCS executable not found"

**Cause:** Composer dependencies not installed

**Solution:**

```bash
composer install
./vendor/bin/phpcs --version
```

### Issue: "Too many errors" in dry run

**Cause:** Test values don't match expected format

**Solution:** Update `bin/dry-run-config.js` with valid values

## Troubleshooting

### Clear Caches

```bash
# ESLint cache
rm .eslintcache

# Stylelint cache
rm .stylelintcache

# PHP CodeSniffer cache
rm .phpcs-cache
```

### Verbose Output

```bash
# ESLint
npm run lint:js -- --debug

# Stylelint
npm run lint:css -- --formatter verbose

# PHPCS
./vendor/bin/phpcs -v
```

### Logs

All linting generates logs in `logs/`:

```bash
# View lint logs
cat logs/lint-js-*.log
cat logs/lint-css-*.log

# Search for specific errors
grep "error" logs/lint-*.log
```

## Related Documentation

- [BUILD-PROCESS.md](./BUILD-PROCESS.md) - Build system and webpack configuration
- [TESTING.md](./TESTING.md) - Testing strategies and dry-run testing
- [LOGGING.md](./LOGGING.md) - Comprehensive logging for all tools and processes
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD automation and GitHub Actions
- [VALIDATION.md](./VALIDATION.md) - Template validation
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance monitoring and optimization

## Summary

✅ **Comprehensive Coverage** - JavaScript, CSS, PHP, JSON, Markdown

✅ **WordPress Standards** - Official WordPress coding standards

✅ **Dry Run Support** - Lint templates with mustache variables

✅ **Auto-fixing** - Automated fixes for common issues

✅ **CI/CD Integration** - Automated checks in workflows

✅ **Pre-commit Hooks** - Catch errors before commit

✅ **Detailed Logging** - All lint runs logged to `logs/`

✅ **IDE Integration** - Works with VS Code, PHPStorm

Maintain high code quality with consistent linting across the entire codebase.
