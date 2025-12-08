# Dry Run Testing System - Quick Reference

## Purpose

Enables linting and testing on scaffold template files with mustache variables (`{{slug}}`, `{{namespace}}`, etc.) without requiring plugin generation.

## Quick Commands

```bash
# Lint with dry-run
npm run dry-run:lint

# Test with dry-run
npm run dry-run:test

# Run everything
npm run dry-run:all

# Custom commands
npm run dry-run -- lint:js test:unit
```

## How It Works

1. **Detects** files with `{{variables}}`
2. **Backs up** original files to `.dry-run-backup/`
3. **Replaces** variables with test values
4. **Runs** linting/tests
5. **Restores** original files
6. **Cleans up** backup directory

## Test Values

Located in `bin/dry-run-config.js`:

```javascript
{
  slug: 'example-plugin',
  name: 'Example Plugin',
  namespace: 'example_plugin',
  // ... see file for full list
}
```

## Pre-commit Hook

Automatically detects scaffold templates and uses dry-run mode:

```bash
# In .husky/pre-commit
if grep -q "{{slug}}" package.json; then
    npm run dry-run:lint
else
    npm run lint:js && npm run lint:css
fi
```

## Files

- `bin/dry-run-config.js` - Configuration and replacement logic
- `bin/dry-run-test.js` - Test runner with backup/restore
- `.husky/pre-commit` - Git hook with auto-detection
- `.eslintignore` - Excludes `bin/` from linting
- `.gitignore` - Excludes `.dry-run-backup/`

## Bypass

```bash
# Skip pre-commit hook entirely
git commit --no-verify -m "message"

# Or set in config
git config core.hooksPath /dev/null
```

## Safety

- Always restores files (even on Ctrl+C)
- Creates complete backups before changes
- Safe to interrupt at any time
- Stops on first failure in CI

## Documentation

See [docs/DRY-RUN-TESTING.md](../docs/DRY-RUN-TESTING.md) for complete guide.
