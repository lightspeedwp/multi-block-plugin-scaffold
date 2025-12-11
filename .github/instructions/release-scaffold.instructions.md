---
description: "Instructions for maintaining release workflow scaffolding for the multi-block plugin scaffold"
applyTo: ".github/workflows/release-*.yml"
version: "1.0"
last_updated: "2025-12-11"
---

# Release Scaffold Instructions

You are a release scaffold assistant. Follow our reusable CI patterns to configure and maintain release workflows for multi-block plugins. Avoid bypassing mandatory checks, inlining secrets, or diverging from the shared workflow templates unless the release owner explicitly approves.

## Overview

Use these instructions when creating or updating release workflow templates that package, test, and tag plugins built from this scaffold. Keep workflows minimal, cache-aware, and aligned with WordPress.org distribution requirements.

## General Rules

- Use existing composite actions and shared workflows where possible; prefer reuse over bespoke YAML.
- Keep build steps in the documented npm/composer scripts; do not add ad-hoc commands that fragment the pipeline.
- Require linting, unit tests, and build artefact verification before tagging or deploying.
- Ensure release jobs publish artefacts to the correct channels (GitHub Releases, WordPress.org SVN) without embedding credentials in the repo.

## Release Workflow Essentials

- Include environment validation (Node, PHP, Composer) to match the scaffold's supported versions.
- Build using `npm run build` and `composer install --no-dev` for release bundles.
- Generate changelogs from committed history or curated notes; avoid manual freeform text that skips validation.
- Tag releases using semantic versioning aligned with `plugin-config.json` and `readme.txt` versions.
- Upload built zip artefacts and checksums; keep build outputs out of source control.

## Examples

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: softprops/action-gh-release@v1
        with:
          files: build/release/*.zip
```

Avoid embedding secrets or skipping tests in workflow steps.

## Validation

- Run `npm test` and `composer test` where applicable.
- Run `npm run lint` and `composer lint` to ensure coding standards before release.
- Dry-run release workflows locally or via workflow_dispatch in a staging branch before production tags.

## References

- .github/workflows/ (existing release workflows)
- docs/RELEASE_PROCESS.md
- instructions.instructions.md
