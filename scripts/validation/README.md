# scripts/validation/ README

This folder centralises schema/metadata validation scripts for the multi-block-plugin-scaffold repository.

- Place all validation logic here (schema checks, frontmatter audits, registry verification).
- Tests should be in `scripts/validation/__tests__/`.
- Prefer the action-first `<verb>-<target>` naming rule. Choose the verb that matches the check—`validate-` for guardrails, `audit-` for reporting, `test-` for coverage suites, `define-` for schema generators—and append the subject/relevant target.
  Examples: `validate-theme-config.js`, `audit-frontmatter.js`, `test-mustache-schema.js`, `define-config-schema.js`, `validate-config-schema.js`.
- Keep validation scripts inside this folder. No other directories should host `validate-`, `audit-`, `test-`, or `define-` helpers that perform validation logic—move them here before adding functionality.
- Update all imports to reference this directory rather than `scripts/utils/`, and always treat the target portion as the shared focus object (e.g., `validate-mustache-registry.js`).
- TODO: Add usage notes once the validation CLI or runner is restored.

## Naming Guide

- `validate-*` &mdash; Schema guardrails, AJV checks, or configuration-wide validation runners.
- `audit-*` &mdash; Reporting-style checks that inspect frontmatter, docs, or generated output.
- `test-*` &mdash; Helper scripts or suites that assert schema integrity or validation coverage.
- `define-*` &mdash; Scripts that author new schema artifacts (e.g., generating JSON schema from metadata).

Keeping these prefixes consistent makes it second nature to find the right entry point for each type of check.

If you come across scripts outside this folder that use these prefixes (excluding supporting tests in `__tests__`), either move the file into `scripts/validation/` or flag it so the team can align the structure.
