---
title: Release Process
description: Combined release playbook for the multi-block plugin scaffold and generated themes.
category: Development
type: Guide
audience: Maintainers
date: 2025-12-10
---

# Release Process Guide

This document tracks the release flow for the multi-block plugin scaffold itself and for the plugins that get generated from it. The first half of this guide covers the scaffold release workflow, while the second half outlines the release process that ships inside generated themes. The generated section keeps {{mustache}} placeholders intact so template builds can substitute values like `{{theme_name}}` and `{{version}}` when they are created.

## Quick Navigation

- [Release Paths](#release-paths)
- [Release Agent](#release-agent)
- [Scaffold Release Workflow](#scaffold-release-workflow)
- [Generated Theme Release Workflow](#generated-theme-release-workflow)
- [Reporting & Planning](#reporting--planning)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)
- [Version History](#version-history)

## Release Paths

Each new version of the project takes one of two routes:

### Scaffold release path

The multi-block plugin scaffold is released from this repository. Use `develop` → `main` flow, the release agent, and the dedicated `docs/RELEASE_PROCESS_SCAFFOLD.md` checklist when preparing scaffold updates. These releases keep the generator, documentation, and supporting infrastructure (agents, instructions, workflows) aligned.

### Generated theme release path

When you generate a plugin or theme from this scaffold, the generated repository needs its own release workflow. The remainder of this guide (the "Generated Theme Release Workflow" section) is emitted directly into generated documentation with `{{mustache}}` placeholders so that the final plugin can replace values such as `{{theme_repo_url}}`, `{{slug}}`, and `{{description}}` during generation.

## Release Agent

Use `scripts/agents/release.agent.js` whenever you prepare a release, whether you are working on the scaffold or a generated project. It validates all the quality gates before any tagging steps.

### Usage

```bash
npm run release:validate
npm run release:status
```

### What the agent checks

1. ✅ Version alignment across `VERSION`, `package.json`, `composer.json` (if present), the plugin header/constant, `style.css` stable tag, `readme.txt` (if present), and block metadata files.
2. ✅ Linting and formatting (dry-run mode) for JavaScript, CSS, and PHP.
3. ✅ Dry-run tests plus PHP unit suites.
4. ✅ Generator validation (`npm run validate:config`) and mustache variable integrity.
5. ✅ Documentation completeness and absence of unreplaced `{{mustache}}` values.
6. ✅ Security audit results (no high/critical npm vulnerabilities).

### Example output

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

## Scaffold Release Workflow

### Git Flow Workflow

This repository follows Git Flow conventions:

- `develop` hosts active development.
- `main` remains stable and only receives release merges.
- Feature branches branch from and merge back into `develop`.
- Release branches are created off `develop`, merged into `main`, tagged, and finally merged back into `develop`.

### Creating a Release

#### 1. Prepare on `develop`

```bash
git checkout develop
git pull origin develop
git status  # clean working directory
```

#### 2. Run the release agent

```bash
# Dry run to preview changes
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z --dry-run

# Execute the release
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z
```

Before invoking the release agent, sanitise the templated release docs:

```bash
npm run dry-run:release-scaffold
```

The agent performs the following tasks:

- ✅ Confirms the working directory is clean.
- ✅ Validates the version string follows semantic versioning.
- ✅ Runs linting for JavaScript and CSS (respecting dry-run guards).
- ✅ Runs all test suites.
- ✅ Updates `CHANGELOG.md` (moves `Unreleased` to `vX.Y.Z`).
- ✅ Bumps `package.json` version.
- ✅ Creates a commit: `chore: Release vX.Y.Z`.
- ✅ Tags `vX.Y.Z`.

#### 3. Push to `develop`

```bash
git push origin develop
```

#### 4. Merge to `main`

**Option A (Direct merge — preferred for patch releases)**

```bash
git checkout main
git pull origin main
git merge develop --no-ff -m "Release vX.Y.Z"
git push origin main
git push origin vX.Y.Z
git checkout develop
```

**Option B (Pull request — preferred for major/minor releases)**

```bash
# Create PR from develop → main
gh pr create --base main --head develop --title "Release vX.Y.Z"

# After PR merge:
git push origin vX.Y.Z
```

#### 5. Verify the release

GitHub automatically creates a release from the `vX.Y.Z` tag, builds assets, and publishes if configured. Visit `https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases/tag/vX.Y.Z` to confirm the release notes and assets look correct.

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) for breaking changes.
- **MINOR** (0.X.0) for backwards-compatible features.
- **PATCH** (0.0.X) for backwards-compatible fixes.

Examples:

- `1.0.0` → `1.0.1` (bug fix).
- `1.0.1` → `1.1.0` (feature).
- `1.1.0` → `2.0.0` (breaking).

### Post-Release

1. **Announce** – Share release notes with the team.
2. **Monitor** – Watch for issues related to the new version.
3. **Document** – Update any external documentation impacted by the release.
4. **Plan** – Start planning the next release milestone.

### Dry‑run release documentation

Before executing any release agent run or automated checks that read templated release specs, generate a sanitized copy of the agent docs, prompts, and release instructions using `node scripts/utils/dry-run-release.js`. The script mirrors `.github/agents/release.agent.md`, `.github/prompts/create-release*.prompt.md`, `.github/instructions/release*.instructions.md`, and both release process guides into `tmp/dry-run-release/`, replacing every `{{mustache}}` token with `dry-run-*` placeholders so validation suites and CI jobs can run without template parsing errors. Review the sanitized output, run your dry‑run commands against it, and delete the temporary directory (`rm -rf tmp/dry-run-release/`) once the gate passes.

### Emergency Hotfix

For critical fixes directly on `main`:

```bash
git checkout main
git checkout -b hotfix/X.Y.Z
# Make fixes
git add .
git commit -m "fix: Emergency fix description"
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z

git checkout main
git merge hotfix/X.Y.Z --no-ff
git push origin main
git push origin vX.Y.Z

git checkout develop
git merge hotfix/X.Y.Z --no-ff
git push origin develop
git branch -d hotfix/X.Y.Z
git push origin --delete hotfix/X.Y.Z
```

---

## ⚠️ PART 2: GENERATED PLUGIN RELEASE WORKFLOW

> **IMPORTANT:** Everything below this line is for GENERATED PLUGINS ONLY.
>
> This section contains mustache placeholders (`{{variable}}`) that will be replaced during plugin generation. If you're reading this in the **scaffold repository**, you should follow `RELEASE_PROCESS_SCAFFOLD.md` instead.

If you're reading this in a **generated plugin repository**, all placeholders below should have been replaced with your plugin's actual values.

---

## Generated Theme Release Workflow

### Scope & Mustache placeholders

The generated theme release workflow is embedded in the plugin that `generate-plugin` produces. All of the following sections remain untouched by the scaffold so that `{{mustache}}` variables like `{{theme_slug}}`, `{{theme_name}}`, `{{version}}`, and `{{theme_repo_url}}` can be replaced when a developer runs the generator.

### Overview

Key principles:

1. **Semantic Versioning** – Strict MAJOR.MINOR.PATCH increments.
2. **Quality Gates** – All linting, formatting, and tests must pass before tagging.
3. **Documentation** – CHANGELOG, README, and release notes must reflect the new version.
4. **Version Consistency** – Every version file is updated in a single commit.
5. **Git Flow** – Release branches are cut from `develop`, merged into `main`, tagged, and merged back.

### Version Numbering

Follow [Semantic Versioning 2.0.0](https://semver.org/).

- **MAJOR** (`1.x.x`) – Breaking changes.
- **MINOR** (`x.1.x`) – New backwards-compatible features.
- **PATCH** (`x.x.1`) – Bug fixes.

Pre-release suffixes:

- **Alpha**: `1.0.0-alpha.1` – Internal testing.
- **Beta**: `1.0.0-beta.1` – Public testing.
- **RC**: `1.0.0-rc.1` – Release candidate.

### Automated Release Validation

The release agent (`scripts/release.agent.js`) validates:

1. ✅ Version alignment (`VERSION`, `package.json`, `composer.json`, `style.css`, `readme.txt`, `theme.json`, `block.json`).
2. ✅ Linting/formatting/tests (dry-run mode plus PHP suites).
3. ✅ Documentation checks for README/CHANGELOG/CONTRIBUTING.
4. ✅ Theme generation dry-run and manifest validation.
5. ✅ Security audit (`npm audit`).

Commands:

```bash
npm run release:version      # Check version consistency
npm run release:validate     # Full validation suite
npm run release:status       # Quick readiness status
npm run dry-run:release      # Sanitize templated release docs before running agents
```

### Manual Release Process

#### Step 1: Create release branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
```

#### Step 2: Update version files

Update the following with `{{version}}` (use real values before tagging):

**VERSION**
```
{{version}}
```

**package.json**
```json
{
  "name": "{{theme_slug}}",
  "version": "{{version}}",
  ...
}
```

**composer.json**
```json
{
  "name": "{{author_username}}/{{theme_slug}}",
  "version": "{{version}}",
  ...
}
```

**style.css**
```css
/*
Theme Name: {{theme_name}}
Version: {{version}}
...
*/
```

#### Step 3: Update CHANGELOG

Move the `[Unreleased]` section to the released version and link to the release.

```markdown
## [Unreleased]

### Changed

- Placeholder for future changes

## [{{version}}] - YYYY-MM-DD

### Added

- Initial release of {{theme_name}}
- Full Site Editing support

[Unreleased]: {{theme_repo_url}}/compare/v{{version}}...HEAD
[{{version}}]: {{theme_repo_url}}/releases/tag/v{{version}}
```

#### Step 4: Run quality checks

```bash
npm run lint
npm run format
npm run test:js
npm run test:php
npm run test:e2e
npm audit
npm run test:dry-run:all
```

#### Step 5: Commit changes

```bash
git add VERSION package.json composer.json style.css CHANGELOG.md
git commit -m "chore: prepare release v{{version}}"
```

#### Step 6: Merge to main and develop

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

#### Step 7: Tag release

```bash
git tag -a v{{version}} -m "Release v{{version}}"
git push origin v{{version}}
```

#### Step 8: Create GitHub Release

**GitHub CLI**

```bash
gh release create v{{version}} \
  --title "v{{version}}" \
  --notes-file CHANGELOG.md
```

**GitHub UI**

1. Visit `{{theme_repo_url}}/releases/new`.
2. Choose tag `v{{version}}`.
3. Title: `v{{version}}`.
4. Paste release notes from `CHANGELOG.md`.
5. Attach assets if needed and publish.

### Pre-Release Checklist

#### 1. Code Quality ✅

- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run test` passes with 80%+ coverage.
- [ ] `npm run format` applied.
- [ ] No console errors or warnings.

#### 2. Version Files ✅

- [ ] `VERSION` updated.
- [ ] `package.json` version updated.
- [ ] `composer.json` version updated.
- [ ] `style.css` header updated.
- [ ] `CHANGELOG.md` completed with release date.

#### 3. Documentation ✅

- [ ] `README.md` features/requirements up to date.
- [ ] `CONTRIBUTING.md` workflow current.
- [ ] All documentation reviewed.
- [ ] Links and references validated.

#### 4. Testing ✅

- [ ] JavaScript unit tests pass.
- [ ] PHP unit tests pass.
- [ ] E2E tests pass.
- [ ] Generator validation passes: `npm run validate:config`.
- [ ] Mustache variables replaced in dry-run outputs.

#### 5. Performance & Security ✅

- [ ] `npm audit` reports no high/critical vulnerabilities.
- [ ] Lighthouse score acceptable if applicable.
- [ ] Bundle size within limits.
- [ ] No deprecated dependencies.

#### 6. Git & Branches ✅

- [ ] Working directory clean.
- [ ] All changes committed.
- [ ] Release branch merged into `main`.
- [ ] Release branch merged into `develop`.
- [ ] No merge conflicts.

### Post-Release Tasks

#### 1. Verify Release

- [ ] Tag visible on GitHub: `{{theme_repo_url}}/releases`.
- [ ] CHANGELOG references function.
- [ ] Release notes complete.
- [ ] Assets attached if necessary.
- [ ] Template repository shows "Use this template" button.
- [ ] Topics and description present in the About panel.

#### 2. Communications

- [ ] Update project status.
- [ ] Notify contributors.
- [ ] Update any documentation sites.
- [ ] Announce on social media when appropriate.

#### 3. Planning

- [ ] Create a milestone for the next version.
- [ ] Review and prioritise issues.
- [ ] Update the roadmap.
- [ ] Plan the next release cycle.

### Release Notes Template

Use the following Markdown when drafting GitHub release notes. Replace sections with the current highlights.

```markdown
## 🎉 Initial Release: Multi-Block Plugin Scaffold

A comprehensive WordPress plugin scaffold with dual-mode generation, mustache templating, and complete development infrastructure.

### ✨ Key Features

#### Core Generator System
- Dual-mode generator: template mode (`--in-place`) or output folder mode
- Mustache templating with transformation filters
- JSON Schema validation for plugin configuration
- CLI interface with JSON mode for automation

#### Example Blocks
- Card Block - Single item display with custom fields
- Collection Block - Grid/list with pagination and filtering
- Slider Block - Responsive carousel with autoplay
- Featured Block - Highlighted items with custom layouts

#### Development Tools
- Unit tests across multiple suites
- Comprehensive linting: ESLint, Stylelint, PHPCS, PHPStan
- Build system: Webpack 5, Babel, PostCSS
- Local environment: wp-env integration
- Pre-commit hooks: Husky for code quality

#### Architecture
- Custom post type and taxonomy scaffolding
- Secure Custom Fields integration with local JSON
- Block patterns and templates with automatic assignment
- Repeater fields with nested data
- Block bindings API (WordPress 6.5+)

### 📚 Documentation
- [docs/GENERATE_PLUGIN.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/GENERATE_PLUGIN.md)
- [docs/ARCHITECTURE.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/ARCHITECTURE.md)
- [docs/TESTING.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/TESTING.md)
- [Documentation index](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/README.md)

### 🚀 Getting Started
- Use as template: click **Use this template**, then `npm install && composer install`, run `node scripts/generate-plugin.js --in-place`
- Generate plugin: clone repo, run `node scripts/generate-plugin.js`

### 📋 Requirements
- WordPress 6.5+
- PHP 8.0+
- Node.js 18+

### 📝 Full Changelog
See [CHANGELOG.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/CHANGELOG.md) for details.

### 🙏 Credits
Developed by [LightSpeed](https://lightspeedwp.agency) for the WordPress community.
```

## Reporting & Planning

- **Release reporting**: Follow `.github/instructions/reporting.instructions.md` and keep all release readiness/validation reports inside `.github/reports/<category>/`. Every report must include YAML frontmatter and reference supporting logs in `logs/` and temporary data in `tmp/` before committing.
- **Plans**: Store workplans under `.github/projects/plans/` (per `.github/instructions/task-planner.instructions.md`). Old plan files have been moved out of `docs/plans/`. Use descriptive, date-stamped filenames and mention the associated issue or goal.
- **Research outputs**: Capture research findings in `.github/reports/research/` alongside frontmatter summaries (see `.github/instructions/task-researcher.instructions.md`).
- **Temporary data**: Any temporary artifacts or generated helpers belong in `tmp/` (see `.github/instructions/temp-files.instructions.md`). The directory is ignored by Git, and scripts should clean up after themselves.

## Troubleshooting

### Working directory is not clean

Commit or stash changes before releasing:

```bash
git status
git add .
git commit -m "Your commit message"
```

### Tests failed

Fix failing tests before releasing:

```bash
npm test
npm run lint:js
npm run lint:css
```

### Version already exists

If a tag already exists, either bump the version or delete the existing tag (not recommended).

### Version conflicts (generated themes)

If version files go out of sync:

```bash
cat VERSION
grep '"version"' package.json
grep 'Version:' style.css
npm run release:version
```

### Failed tests (generated themes)

When validation fails:

```bash
npm run test:js
npm run test:php
npm run test:e2e
cat logs/test/$(ls -t logs/test/ | head -1)
npm run test
```

### Git issues (generated themes)

If a merge creates conflicts:

```bash
git merge --abort
git checkout main
git merge release/{{version}}
# Fix conflicts
git add .
git commit -m "chore: merge release/{{version}} into main"
```

## Related Documentation

- `docs/RELEASE_PROCESS_SCAFFOLD.md` – Scaffold-specific release checklist.
- `docs/GENERATE_PLUGIN.md` – Generator guide that powers plugin output.
- `CHANGELOG.md` – Release history and comparison links.
- `VALIDATION.md`, `TESTING.md` – Quality validation references.
- `.github/instructions/reporting.instructions.md` – Report storage rules.
- `.github/instructions/task-planner.instructions.md` – Planning workflow guidance (plans live in `.github/projects/plans/`).
- `.github/instructions/task-researcher.instructions.md` – Research results go into `.github/reports/research/`.
- `.github/instructions/temp-files.instructions.md` – Temporary data must stay in `tmp/`.
- `.github/instructions/folder-structure.instructions.md` – Directory expectations for this repository.

## Version History

| Date | Change |
|------|--------|
| 2025-12-10 | Initial release process documentation adapted for the scaffold. |
| 2025-12-18 | Consolidated scaffold and generated theme workflows, added reporting/plan guidance, and updated all release references. |
