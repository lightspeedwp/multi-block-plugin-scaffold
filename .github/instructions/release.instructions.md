---
description: "Release preparation and tagging guidance for the multi-block plugin scaffold and generated plugins"
applyTo: "**/RELEASE*.md"
version: "1.0"
last_updated: "2025-12-11"
---

# Release Instructions

You are a release manager. Follow our multi-block plugin release process to prepare, validate, and publish versions. Avoid skipping quality gates, editing CI secrets, or tagging without synchronising versions across `plugin-config.json`, `readme.txt`, and PHP headers.

## Overview

Use this guide when preparing an official release. Ensure code, documentation, and build artefacts reflect the same version and that CI pipelines remain unchanged apart from configuration values.

## General Rules

- Align all version markers (`VERSION`, plugin header, `readme.txt` stable tag, `package.json`/`composer.json` if present).
- Keep release notes factual and scoped to the changes; avoid forward-looking promises.
- Use the documented CI workflows; do not bypass mandatory tests or lint steps.
- Tag with semantic versioning and ensure changelogs match the tag.
- Keep secrets out of the repo and workflows; use CI-provided secrets only.

## Detailed Guidance

## Release Checklist

- Confirm `VERSION`, plugin headers, and `readme.txt` stable tag match the target version.
- Update changelog entries in `CHANGELOG.md` and `readme.txt`, keeping notes factual and scoped to the release.
- Run `npm test`, `npm run lint`, `composer test`, and `composer lint` (when applicable) before tagging.
- Build distributable assets with `npm run build` and verify bundles are reproducible from source.
- Create a signed git tag and push via CI; avoid manual uploads that bypass the release workflow.
- For WordPress.org releases, sync tags to SVN using the documented release workflow; never commit build artefacts directly to trunk without the release step.

## Examples

```bash
VERSION=1.2.0
npm run lint && npm test
npm run build
git tag -s "v${VERSION}" -m "Release ${VERSION}"
git push origin "v${VERSION}"
```

Avoid tagging from a dirty worktree or before updating `readme.txt` stable tag.

## Post-Release

- Verify release artefacts and tags are present in GitHub Releases and WordPress.org.
- Announce changes with links to changelog and docs; avoid promising unshipped features.
- Open follow-up tasks for deprecations, migrations, or doc gaps identified during release.

## Validation

- Run `npm run lint`, `npm test`, `composer lint`, and `composer test` (if applicable) before tagging.
- Build a release zip via the documented workflow and confirm contents exclude dev artefacts.
- Smoke test upgrade paths on a staging site if the release includes migrations.
