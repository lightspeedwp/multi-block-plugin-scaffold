---
title: Scaffold Release Process
description: How to release the block theme scaffold while preserving mustache placeholders and keeping release templates ready for generated themes
category: Development
type: Guide
audience: Maintainers
date: 2025-12-12
---

# Scaffold Release Process

This guide applies **only** to the **block theme scaffold repository**. Generated themes follow `docs/RELEASE_PROCESS.md` after the mustache placeholders are rewritten.

## Key Differences from Theme Releases

1. **Placeholder preservation:** WordPress files (`style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, `parts/`) must retain `{{mustache}}` placeholders.
2. **Version updates are meta-only:** Update `VERSION`, `package.json`, `composer.json`, and `CHANGELOG.md`. Do **not** hardcode versions into template files.
3. **Release templates stay templated:** `.github/agents/release.agent.md`, `.github/prompts/release.prompt.md`, `.github/instructions/release.instructions.md`, and `docs/GENERATE_THEME.md` must keep `{{mustache}}` tokens so generated themes can rewrite them.
4. **Scaffold-only files are temporary:** `release-scaffold.*` files and this document are for the scaffold and should be **deleted by the generator** in new theme repositories.
5. **Use dry-run gates:** Prefer `lint:dry-run`, `format --check`, `test:dry-run:all`, and targeted audits to avoid touching template files.

## File Responsibilities

| Action | Files |
| --- | --- |
| Update versions | `VERSION`, `package.json` (`version`), `composer.json` (`version`), `CHANGELOG.md` |
| Keep templated for generated themes | `.github/agents/release.agent.md`, `.github/prompts/release.prompt.md`, `.github/instructions/release.instructions.md`, `docs/GENERATE_THEME.md` |
| Preserve placeholders (never replace) | `style.css`, `functions.php`, `theme.json`, `inc/`, `patterns/`, `templates/`, `parts/` |
| Delete in generated themes | `.github/agents/release-scaffold.agent.md`, `.github/prompts/release-scaffold.prompt.md`, `.github/instructions/release-scaffold.instructions.md`, `docs/RELEASE_PROCESS_SCAFFOLD.md` |

## Pre-Release Checklist (Scaffold)

- [ ] `{{...}}` placeholders present in WordPress files (spot-check with `grep -R "{{"`).
- [ ] `VERSION`, `package.json`, and `composer.json` versions aligned (SemVer).
- [ ] `CHANGELOG.md` updated with release entry and links.
- [ ] **Schema validation passes:** `npm run test:schema` (all 89 mustache variables documented and synced).
- [ ] Release templates still contain `{{mustache}}`.
- [ ] `docs/RELEASE_PROCESS_SCAFFOLD.md` current.
- [ ] Dry-run gates pass: `npm run lint:dry-run`, `npm run format -- --check`, `npm run test:dry-run:all`.
- [ ] `npm audit --audit-level=high` clean or mitigated.
- [ ] Generation smoke test passes; output theme has no placeholders and builds.
- [ ] **Phase 1 cleanup verified:** scaffold-specific files deleted in generated theme.
- [ ] **Generation log created:** `logs/generate-theme-{slug}.log` exists with success status.

## Step-by-Step Scaffold Release

1. **Set the target version**
   - Update `VERSION`, `package.json`, `composer.json`.
   - Convert `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD` in `CHANGELOG.md` and refresh comparison links.

2. **Protect placeholders**
   - Run `grep -R "{{" style.css functions.php theme.json inc patterns templates parts`.
   - If any expected placeholder is missing, restore before continuing.

3. **Validate schema**

   ```bash
   npm run test:schema
   ```

   Ensures all 89 mustache variables are documented and no undocumented variables exist in templates.

4. **Run quality gates (dry-run)**
   ```bash
   npm run lint:dry-run
   npm run format -- --check
   npm run test:dry-run:all
   npm audit --audit-level=high
   ```

   Run the scaffold dry-run release helper so the agent sees sanitized docs:
   ```bash
   npm run dry-run:release-scaffold
   ```

5. **Generation smoke test (required)**

   ```bash
   node scripts/generate-theme.js \
     --slug "scaffold-release-check" \
     --name "Scaffold Release Check" \
     --author "Scaffold QA" \
     --author_uri "https://example.com" \
     --version "$(cat VERSION)"

   # Verify Phase 1 cleanup
   test ! -f output-theme/.github/agents/release-scaffold.agent.md && echo "✓ Phase 1 cleanup verified"
   test ! -f output-theme/docs/RELEASE_PROCESS_SCAFFOLD.md && echo "✓ Scaffold docs deleted"

   # Verify logging
   test -f logs/generate-theme-scaffold-release-check.log && echo "✓ Log created"
   grep -q '"status":"success"' logs/generate-theme-scaffold-release-check.log && echo "✓ Success logged"

   # Verify no placeholders remain
   ! grep -R "{{" output-theme && echo "✓ No placeholders remain"

   # Test build
   cd output-theme
   npm install
   npm run lint
   npm run build
   cd ..
   rm -rf output-theme logs
   ```

6. **Review documentation**

   - Ensure this document and `docs/GENERATE_THEME.md` reflect the current process and placeholder expectations.

7. **Commit and branch**
   - Commit only meta files, CHANGELOG, and documentation updates.
   - Follow governance for release branches, tagging, and merging.

## Generation Hand-off Rules

- The theme generator must **delete** `release-scaffold.*` files and `docs/RELEASE_PROCESS_SCAFFOLD.md` in new theme repositories.
- Explicit delete list for the generator:
  - `.github/agents/release-scaffold.agent.md`
  - `.github/prompts/release-scaffold.prompt.md`
  - `.github/instructions/release-scaffold.instructions.md`
  - `docs/RELEASE_PROCESS_SCAFFOLD.md`
- The templated release files (`release.agent.md`, `release.prompt.md`, `release.instructions.md`, `docs/RELEASE_PROCESS.md`) must remain with `{{mustache}}` placeholders so the generator can rewrite them with the new theme name/slug/version.
- After generation, run the standard release process documented in `docs/RELEASE_PROCESS.md` (now rewritten for the generated theme).

### Workflow Safeguards

To prevent accidental use of generated theme workflows in the scaffold repository, the following workflows include verification checks:

**`.github/workflows/release.yml` (for generated themes):**
- Checks for presence of `release-scaffold.agent.md`, `RELEASE_PROCESS_SCAFFOLD.md`, or `scripts/generate-theme.js`
- Exits with error if any scaffold-specific files are found
- Verifies `{{theme_name}}` placeholder has been replaced in workflow

**`.github/workflows/agent-release.yml` (for generated themes):**
- Checks for presence of scaffold-specific files
- Exits with error if this is the scaffold repository

These safeguards ensure you cannot accidentally trigger a generated theme release workflow in the scaffold repository.

## Troubleshooting

### Placeholders were overwritten
- Restore from git: `git checkout -- style.css functions.php theme.json inc patterns templates parts`
- Re-run placeholder scan to confirm restoration.

### Versions out of sync
- Re-align `VERSION`, `package.json`, `composer.json`; do not touch templated WordPress files.

### Generation smoke test fails
- Review CLI output for missing replacements or build errors.
- Fix the scaffold templates, re-run the generator, and repeat validation.
