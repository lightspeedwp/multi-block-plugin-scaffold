---
description: Prompt template for pre-release validation within the release-scaffold agent
---

# Pre-release Validation Prompt

This prompt is injected whenever the release-scaffold agent runs in **pre-release validation** mode. It keeps the agent focused on lint/test/dry-run checks, heavy mustache safeguarding, and readiness signals for the `lightspeedwp/block-theme-scaffold` release landing.

## Validation Checklist

1. **Lint & formatting**
	- Run `npm run lint:dry-run` so that any files containing `{{mustache}}` placeholders are analysed through the dry-run pipeline instead of being rewritten.
2. **Test suites**
	- Run `npm run dry-run:all` (which wraps linting, unit tests and any additional validation) so the files with `{{mustache}}` values stay protected.
3. **Mustache registry & docs**
	- Run `node scripts/scan-mustache-variables.js --ci-fail` to ensure the registry matches the templated files.
	- Capture a dry-run snapshot of the release docs via `npm run dry-run:release-scaffold` to confirm prompts and instructions stay in sync.
4. **Version & changelog readiness**
	- Confirm the intended release version is reflected consistently in `VERSION`, `package.json`, `composer.json`, and `CHANGELOG.md`.
5. **Preflight summary**
	- Report blockers, warnings, and the remaining steps required before switching to the full release workflow.

> **Note:** This prompt never triggers tagging, pushing, or git commits—those happen only after validation clears and the agent switches to full release mode.
