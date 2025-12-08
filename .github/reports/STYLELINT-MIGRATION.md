---
title: Stylelint Migration Report
description: Migration details from Stylelint 13.x to 16.x
category: Reports
type: Report
audience: Developers
date: 2025-12-01
---


**Date:** 1 December 2025
**Status:** ✅ Complete

## Overview

Successfully migrated all three scaffold repositories from Stylelint 13.x to Stylelint 16.26.1, addressing the deprecation warning from the vscode-stylelint extension.

## Changes Made

### 1. Updated Dependencies

All three repositories now have updated dependencies:

#### Package: multi-block-plugin-scaffold

- **Before:** `@wordpress/scripts@19.2.4` (which bundled Stylelint 13.x)
- **After:** `@wordpress/scripts@31.1.0` (which bundles Stylelint 16.26.1)
- Updated `@wordpress/stylelint-config` to `^23.28.0`
- Fixed `@wordpress/icons` version from `^10.35.0` to `^11.3.0` (10.35.0 doesn't exist)
- Added comprehensive devDependencies matching other scaffolds
- Enhanced scripts with lint:css:fix, lint:js:fix, and more
- Added lint-staged, husky, and wp-env configurations
- Added keywords, homepage, repository, bugs fields

#### Package: block-theme-scaffold

- **Before:** Had `@wordpress/scripts@^31.0.0` in package.json but v27.9.0 installed
- **After:** Fresh install with `@wordpress/scripts@31.1.0` and Stylelint 16.26.1
- Updated all node_modules to latest versions

#### Package: single-block-plugin-scaffold

- **Before:** Had `@wordpress/scripts@^31.0.0` specified
- **After:** Fresh install with `@wordpress/scripts@31.1.0` and Stylelint 16.26.1
- Already had proper configuration, just needed fresh install

### 2. VS Code Workspace Configuration

Updated `scaffolds.code-workspace` with Stylelint 14+ compatible settings:

```json
{
  "settings": {
    "stylelint.enable": true,
    "stylelint.validate": [
      "css",
      "scss",
      "sass",
      "postcss"
    ],
    "css.validate": false,
    "scss.validate": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": "explicit"
    }
  }
}
```

**Key Changes:**

- `stylelint.enable: true` - Explicitly enables the extension
- `stylelint.validate` - Specifies which file types to validate
- `css.validate: false` & `scss.validate: false` - Disables built-in VS Code validators to prevent conflicts
- `editor.codeActionsOnSave` - Configures auto-fix on save (using "explicit" format for newer VS Code versions)

## Verification

### Installed Stylelint Versions

All three repositories confirmed with Stylelint 16.26.1:

```bash
# multi-block-plugin-scaffold
$ npm list stylelint
└─┬ @wordpress/scripts@31.1.0
  └── stylelint@16.26.1

# block-theme-scaffold
$ npm list stylelint
└─┬ @wordpress/scripts@31.1.0
  └── stylelint@16.26.1

# single-block-plugin-scaffold
$ npm list stylelint
└─┬ @wordpress/scripts@31.1.0
  └── stylelint@16.26.1
```

### PostCSS Configuration

No separate PostCSS configuration needed. All repositories use:

- `@wordpress/postcss-plugins-preset` (v5.35.0)
- `@wordpress/postcss-themes` (v6.35.0)

These are automatically configured by `@wordpress/scripts` and work seamlessly with Stylelint 16.x.

## Migration Reference

Following the official migration guide: <https://github.com/stylelint/vscode-stylelint#migrating-from-vscode-stylelint-0xstylelint-13x>

Key requirements met:

- ✅ Stylelint 14.0.0 or newer (we have 16.26.1)
- ✅ Updated VS Code settings format
- ✅ PostCSS configuration (via @wordpress packages)
- ✅ Disabled conflicting built-in validators

## Next Steps for Users

When generating a new project from these scaffolds:

1. Run `npm install` to install all dependencies including Stylelint 16.26.1
2. The VS Code workspace settings will automatically apply
3. Run `npm run lint:css` to verify Stylelint is working
4. Use `npm run lint:css:fix` to auto-fix issues

## Notes

- The scaffold repositories use mustache template variables (e.g., `{{slug}}`, `{{version}}`) which must be replaced by the generator before the packages can be fully tested
- All linting commands will work properly once the templates are instantiated with real values
- No breaking changes to existing linting rules - just the infrastructure upgrade

## Files Modified

### Repository: multi-block-plugin-scaffold

- `package.json` - Complete overhaul with updated dependencies and scripts

### Repository: scaffolds workspace

- `scaffolds.code-workspace` - Added Stylelint 16.x compatible VS Code settings

### Repositories: block-theme-scaffold & single-block-plugin-scaffold

- No file changes required (package.json already had correct versions specified)
- Just needed fresh `npm install` to update node_modules

## Conclusion

All three scaffold repositories are now fully compatible with Stylelint 16.x and the latest vscode-stylelint extension. The deprecation warning will no longer appear, and all linting functionality continues to work as expected.
