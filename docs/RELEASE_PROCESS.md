---
title: Release Process
description: Complete guide for preparing and releasing new versions of the multi-block plugin scaffold
category: Development
type: Guide
audience: Maintainers
date: 2025-12-10
---

# Release Process Guide

This guide covers the release process for the **Multi-Block Plugin Scaffold**, following semantic versioning and the governance standards defined in [GOVERNANCE.md](GOVERNANCE.md).

## Table of Contents

- [Overview](#overview)
- [Version Numbering](#version-numbering)
- [Release Agent](#release-agent)
- [Manual Release Process](#manual-release-process)
- [Pre-Release Checklist](#pre-release-checklist)
- [Post-Release Tasks](#post-release-tasks)

## Overview

The release process follows these key principles:

1. **Semantic Versioning**: MAJOR.MINOR.PATCH format
2. **Quality Gates**: All tests and lints must pass
3. **Documentation**: Release notes/readme entries are current
4. **Version Consistency**: All files updated together
5. **Git Flow**: Release branches → main + develop → tags

## Version Numbering

Follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (1.x.x): Breaking changes, incompatible API changes
- **MINOR** (x.1.x): New features, backward compatible
- **PATCH** (x.x.1): Bug fixes, backward compatible

### Pre-release Versions

- **Alpha**: `1.0.0-alpha.1` - Internal testing
- **Beta**: `1.0.0-beta.1` - Public testing
- **RC**: `1.0.0-rc.1` - Release candidate

## Release Agent

Use the Release Agent to validate the repository before tagging a release.

### Usage

```bash
# Full validation
npm run release:validate

# Quick status
npm run release:status
```

### What the Agent Checks

1. ✅ Version alignment across `VERSION`, `package.json`, plugin header/constant, `readme.txt` stable tag, and `src/blocks/**/block.json`
2. ✅ Linting (dry-run) and formatting check
3. ✅ Dry-run tests plus PHP unit tests
4. ✅ Generator validation (`npm run validate:config`)
5. ✅ Documentation presence and unreplaced mustache variables
6. ✅ Security audit for high/critical npm vulnerabilities

### Example Output

```
============================================================
ℹ Preparing release validation
ℹ Release version: 1.0.0
============================================================

✅ Version files match: 1.0.0
✅ Linting: PASSED
⚠️  Formatting: needs attention
✅ Dry-run tests: PASSED
⚠️  PHP unit tests: FAILED
✅ Generator validation: PASSED
✅ Security audit: No high/critical vulnerabilities

============================================================
❌ RELEASE BLOCKED
Critical Issues:
- PHP unit tests failed (see logs)

Next steps:
  1. Fix blockers and re-run: npm run release:validate
  2. Review diffs: git diff
  3. Follow git flow in this document
============================================================
```

## Manual Release Process

If you prefer manual control or need to handle edge cases:

### Step 1: Create Release Branch

```bash
# From develop branch
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/1.0.0
```

### Step 2: Update Version Files

Update these files with the new version:

#### VERSION

```
1.0.0
```

#### package.json

```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  ...
}
```

#### Main plugin file (`{{slug}}.php` or your generated plugin file)

```php
/**
 * Plugin Name:       Example Plugin
 * Version:           1.0.0
 */
define( 'EXAMPLE_PLUGIN_VERSION', '1.0.0' );
```

#### readme.txt

```
Stable tag: 1.0.0
```

#### Block metadata

```json
{
  "apiVersion": 3,
  "version": "1.0.0"
}
```

### Step 3: Update release notes

Maintain a changelog entry in `readme.txt` or `CHANGELOG.md` (if present). Example for `CHANGELOG.md`:

```markdown
## [1.0.0] - 2025-12-10

### Added

- Initial multi-block plugin scaffold
- Block patterns, generator, and SCF integration

[Unreleased]: https://github.com/lightspeedwp/multi-block-plugin-scaffold/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases/tag/v1.0.0
```

### Step 4: Run Quality Checks

```bash
// Linting
npm run lint:dry-run

// Formatting
npm run format -- --check

// Testing
npm run dry-run:all
npm run test:php

// Security
npm audit --audit-level=high

// Generator validation
npm run validate:config
```

### Step 5: Commit Changes

```bash
git add VERSION package.json *.php readme.txt src/blocks/**/block.json CHANGELOG.md
git commit -m "chore: prepare release v1.0.0"
```

### Step 6: Merge to Main and Develop

```bash
# Merge to main
git checkout main
git merge release/1.0.0
git push origin main

# Merge to develop
git checkout develop
git merge release/1.0.0
git push origin develop

# Delete release branch
git branch -d release/1.0.0
git push origin --delete release/1.0.0
```

### Step 7: Tag Release

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag
git push origin v1.0.0

# Or push all tags
git push origin --tags
```

### Step 8: Create GitHub Release

**Using GitHub CLI:**

```bash
gh release create v1.0.0 \
  --title "v1.0.0" \
  --notes "See release notes in readme.txt or CHANGELOG.md"
```

**Using GitHub UI:**

1. Go to <https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases/new>
2. Select tag: `v1.0.0`
3. Title: `v1.0.0`
4. Description: Copy from release notes
5. Attach any assets if needed
6. Click "Publish release"

## Pre-Release Checklist

Before tagging a release, verify:

### 1. Code Quality ✅

- [ ] `npm run lint:dry-run` passes with zero errors
- [ ] `npm run dry-run:all` passes
- [ ] `npm run test:php` passes
- [ ] `npm run format -- --check` clean
- [ ] No console errors or warnings during build/tests

### 2. Version Files ✅

- [ ] VERSION file updated
- [ ] package.json version updated
- [ ] Plugin main file header and constant updated
- [ ] readme.txt stable tag updated
- [ ] Block metadata (`src/blocks/**/block.json`) updated
- [ ] CHANGELOG/readme release notes updated

### 3. Documentation ✅

- [ ] README.md features/requirements current
- [ ] CONTRIBUTING.md workflow up to date
- [ ] readme.txt updated for stable tag and changelog
- [ ] All documentation reviewed
- [ ] Links and references working

### 4. Testing ✅

- [ ] JavaScript tests (dry-run) pass
- [ ] PHP unit tests pass
- [ ] E2E tests (if applicable) pass
- [ ] Generator validation passes: `npm run validate:config`
- [ ] Mustache variables properly replaced in dry-run

### 5. Performance & Security ✅

- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Lighthouse score acceptable (if applicable)
- [ ] Bundle size within limits
- [ ] No deprecated dependencies

### 6. Git & Branches ✅

- [ ] Working directory clean
- [ ] All changes committed
- [ ] Release branch merged to main
- [ ] Release branch merged to develop
- [ ] No merge conflicts

## Post-Release Tasks

After releasing:

### 1. Verify Release

- [ ] Tag visible on GitHub: `https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases`
- [ ] Release note links work
- [ ] Release notes complete
- [ ] Assets attached (if any)

### 2. Communications

- [ ] Update project status
- [ ] Notify contributors
- [ ] Update documentation sites
- [ ] Announce on social media (if major release)

### 3. Planning

- [ ] Create milestone for next version
- [ ] Review and prioritize issues
- [ ] Update roadmap
- [ ] Plan next release cycle

## Troubleshooting

### Version Conflicts

If version files get out of sync:

```bash
# Check current versions
cat VERSION
grep '"version"' package.json
grep 'Version:' *.php
grep 'Stable tag:' readme.txt

# Re-run version checks
npm run release:status
```

### Failed Tests

If tests fail during release:

```bash
# Run specific test suite
npm run test:js          # JavaScript only
npm run test:php         # PHP only
npm run test:e2e         # E2E only

# Check test logs
cat logs/test/$(ls -t logs/test/ | head -1)

# Fix issues and re-run
npm run test
```

### Git Issues

If merge conflicts occur:

```bash
# Abort merge
git merge --abort

# Resolve conflicts manually
git checkout main
git merge release/1.0.0
# Fix conflicts
git add .
git commit -m "chore: merge release/1.0.0 into main"
```

## Related Documentation

- [GOVERNANCE.md](GOVERNANCE.md) - Project governance and policies
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [VALIDATION.md](VALIDATION.md) - Quality validation reference
- [TESTING.md](TESTING.md) - Testing guide

## Version History

| Date | Change |
|------|--------|
| 2025-12-10 | Initial release process documentation (adapted for plugin scaffold) |
