# scripts/utils/ README

This folder contains general-purpose utility scripts for the multi-block-plugin-scaffold repository.

- Place non-block/dry-run/core logic helpers here.
- Add tests to `scripts/utils/__tests__/`.
- Update all imports to use this location for shared utilities.
- NOTE: Validation-style helpers now live in `scripts/validation/` (e.g., `audit-frontmatter.js`).
- `scripts/utils/dry-run-release.js` sanitizes release docs, agents, prompts, and instructions for dry-run validation by writing `dry-run-*` placeholders into `tmp/dry-run-release/` (see `scripts/utils/__tests__/dry-run-release.test.js`).
- Keep this folder for general utilities; if a script would naturally be named `validate-*`, `audit-*`, `test-*`, or `define-*`, it belongs under `scripts/validation/` instead so naming stays predictable.
- TODO: Document how to run each utility once the CLI entry points are restored.
