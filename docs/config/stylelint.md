# Stylelint Configuration

## Overview

Stylelint is a CSS linter that enforces consistent styling conventions. This plugin extends the WordPress Stylelint configuration with custom rules for block naming patterns and Tailwind CSS support.

## Configuration File

Location: `.stylelint.config.cjs`

## WordPress Package Used

- `@wordpress/stylelint-config` - ^23.27.0

## Configuration

```javascript
module.exports = {
 extends: [ '@wordpress/stylelint-config' ],
 rules: {
  'selector-class-pattern':
   '^wp-block-{{namespace}}-{{slug}}(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
  'at-rule-no-unknown': [
   true,
   {
    ignoreAtRules: [
     'apply',
     'layer',
     'responsive',
     'screen',
     'tailwind',
     'variants',
    ],
   },
  ],
 },
};
## Key Rules

### Block Naming Pattern

```javascript
"selector-class-pattern": "^wp-block-{{namespace}}-{{slug}}(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$"
```

Enforces BEM-style naming for block classes:

```css
/* ✓ Valid */
.wp-block-namespace-slug {}
.wp-block-namespace-slug__element {}
.wp-block-namespace-slug__element-name {}
.wp-block-namespace-slug--modifier {}
.wp-block-namespace-slug__element--modifier {}

/* ✗ Invalid */
.my-custom-class {}
.wpBlockNamespaceSlug {}
```

### Tailwind CSS Support

```javascript
"at-rule-no-unknown": [
  true,
  {
    "ignoreAtRules": [
      "apply",
      "layer",
      "responsive",
      "screen",
      "tailwind",
      "variants"
    ]
  }
]
```

Allows Tailwind directives:

```css
/* ✓ Valid with Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-4 py-2 bg-blue-500;
  }
}
```

## Available Presets

### @wordpress/stylelint-config

Default preset for standard CSS:

```json
{
  "extends": ["@wordpress/stylelint-config"]
}
```

### @wordpress/stylelint-config/scss

For SCSS syntax support:

```json
{
  "extends": ["@wordpress/stylelint-config/scss"]
}
```

## Available Scripts

```bash
# Lint all CSS/SCSS files
npm run lint:css

# Auto-fix CSS issues
npm run lint:css:fix

# Lint specific file
npx stylelint src/**/*.scss

# Lint and fix specific file
npx stylelint src/**/*.scss --fix
```

## Command Line Usage

```bash
# Lint all styles
npx stylelint "src/**/*.{css,scss}"

# Auto-fix issues
npx stylelint "src/**/*.{css,scss}" --fix

# Lint specific file
npx stylelint src/{{slug}}/style.scss

# Custom config
npx stylelint "src/**/*.scss" --config .stylelintrc.json
```

## VS Code Integration

### Install Extension

Install "Stylelint" extension by Stylelint

### Settings

Add to `.vscode/settings.json`:

```json
{
  "stylelint.enable": true,
  "stylelint.validate": ["css", "scss"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  },
  "css.validate": false,
  "scss.validate": false
}
```

## Block Style Conventions

### BEM Methodology

```css
/* Block */
.wp-block-namespace-slug {
  /* Block styles */
}

/* Element */
.wp-block-namespace-slug__title {
  /* Element styles */
}

/* Modifier */
.wp-block-namespace-slug--featured {
  /* Variant styles */
}

/* Element + Modifier */
.wp-block-namespace-slug__title--large {
  /* Modified element */
}
```

### Editor Styles

```css
/* Scoped to editor */
.editor-styles-wrapper .wp-block-namespace-slug {
  /* Editor-only styles */
}

/* Block list wrapper */
.block-editor-block-list__block .wp-block-namespace-slug {
  /* Editor context styles */
}
```

## Customization

### Relaxed Naming Pattern

```json
{
  "rules": {
    "selector-class-pattern": null
  }
}
```

### SCSS Support

Change extends to SCSS preset:

```json
{
  "extends": ["@wordpress/stylelint-config/scss"],
  "rules": {
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["tailwind", "apply", "layer"]
      }
    ]
  }
}
```

### Custom Rules

```json
{
  "extends": ["@wordpress/stylelint-config"],
  "rules": {
    "max-nesting-depth": 3,
    "selector-max-specificity": "0,4,0",
    "color-hex-length": "short",
    "declaration-property-unit-allowed-list": {
      "font-size": ["rem", "em", "px"],
      "line-height": []
    }
  }
}
```

## Ignoring Files

Create `.stylelintignore`:

```
build/
node_modules/
vendor/
**/*.min.css
public/
dist/
```

## Common WordPress Rules

### Indentation

```css
/* WordPress uses tabs */
.wp-block-namespace-slug {
 display: flex; /* Tab indented */
 padding: 1rem;
}
```

### Quotes

```css
/* Single quotes preferred */
.wp-block-namespace-slug {
 content: 'Hello';
 font-family: 'Arial', sans-serif;
}
```

### Color Format

```css
/* Lowercase hex colors */
.wp-block-namespace-slug {
 color: #fff;
 background: #f0f0f0;
}
```

## Integration with Prettier

Stylelint and Prettier work together. Prettier handles formatting, Stylelint handles code quality.

## Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{css,scss}": ["stylelint --fix", "git add"]
  }
}
```

## Disabling Rules

### Inline Comments

```css
/* stylelint-disable-next-line selector-class-pattern */
.custom-class {
  color: red;
}

/* stylelint-disable */
.another-custom {
  /* Rules disabled for this block */
}
/* stylelint-enable */
```

### Specific Rules

```css
/* stylelint-disable-line color-hex-length */
color: #ffffff;
```

## Common Issues

### Selector Pattern Errors

**Error**: "Expected class selector to match pattern"

**Solution**: Use BEM naming or disable rule:

```json
{
  "rules": {
    "selector-class-pattern": null
  }
}
```

### Unknown At-Rules (Tailwind)

**Error**: "Unknown at-rule @apply"

**Solution**: Already configured in plugin. If issue persists:

```json
{
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["tailwind", "apply", "layer", "screen", "responsive", "variants"]
      }
    ]
  }
}
```

### SCSS Syntax Errors

**Solution**: Use SCSS preset:

```json
{
  "extends": ["@wordpress/stylelint-config/scss"]
}
```

## Best Practices

1. **Follow BEM**: Use block-element--modifier pattern
2. **Namespace Blocks**: Prefix with `wp-block-namespace-slug`
3. **Use WordPress Config**: Start with `@wordpress/stylelint-config`
4. **SCSS Preset**: Use SCSS preset for `.scss` files
5. **Fix Automatically**: Run with `--fix` flag
6. **Pre-commit Hooks**: Lint before committing
7. **Editor Integration**: Install VS Code extension
8. **Document Overrides**: Comment why rules are disabled

## Resources

- [Stylelint Official Documentation](https://stylelint.io/)
- [WordPress Stylelint Config](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-stylelint-config/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/)
- [BEM Methodology](http://getbem.com/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
