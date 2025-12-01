# Husky Git Hooks

This directory contains Git hook scripts managed by Husky.

## Hooks

- **pre-commit** - Runs before each commit to ensure code quality

## Purpose

Git hooks enforce:

- Code linting before commits (JS, CSS, PHP)
- Code formatting standards
- Block validation checks
- Preventing commits with errors

## Pre-commit Hook

The pre-commit hook typically runs:

- ESLint for JavaScript/JSX files
- Stylelint for CSS/SCSS files
- PHP_CodeSniffer for PHP files
- PHPStan for static analysis
- Prettier formatting checks

## Configuration

Hooks are automatically installed when running `npm install` and are configured through Husky settings in `package.json`.

## Bypassing Hooks

In special cases (like scaffold repositories), you can bypass hooks with:

```bash
git commit --no-verify -m "commit message"
```

**Note**: Only bypass hooks when absolutely necessary, such as in template repositories with placeholder variables.
