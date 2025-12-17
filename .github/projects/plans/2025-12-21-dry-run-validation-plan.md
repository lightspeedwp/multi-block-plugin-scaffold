---
title: Dry-run & Validation Consistency Plan
description: Align the validation/dry-run helpers, release agents, and documentation with the <verb>-<target> naming scheme while ensuring placeholder-driven builds remain testable.
audience: Maintainers
date: 2025-12-21
type: Plan
---

## Objectives

1. Update documentation, prompts, and schemas so the `<verb>-<target>` naming rule, plugin-config fixtures, and frontmatter constraints are clearly recorded and match the live validators.
2. Harden the dry-run helpers and release agents to sanitize `{{mustache}}` values across SCSS/JS builds and release templates, including explicit dry-run options.
3. Align Jest/CLI tests with the new validation exports, ensure the plugin-config fixture exists, and keep the dry-run test harness runnable via npm scripts.
4. Capture research, reporting, and tooling usage in `.github/reports/` so future maintainers can follow the evolution of dry-run/release workflows.

## Tasks

1. **Document & align**  
   - Refresh `scripts/validation/README.md` and `docs/FRONTMATTER_SCHEMA.md` with the `<verb>-<target>` naming guidance and actual schema constraints.  
   - Add `.github/prompts/generate-plugin.prompt.md` describing the wizard flow, required fields, mustache values, and outputs.  
   - Ensure `.github/reports/research/` contains notes on placeholder strategies and validation decisions; add example `active.md` and `completed.md` summaries for the dry-run/release tooling.  
   - Confirm a `plugin-config.mock.json` or `.test.json` exists and references `validate-config-schema.js` so tests/dry runs use a concrete fixture.

2. **Dry-run & release helpers**  
   - Extend `scripts/utils/placeholders.js`, `scripts/dry-run/dry-run-config.js`, and `scripts/utils/dry-run-release.js` to cover layout/metadata placeholders, upper filters, and safe fallbacks, and ensure npm scripts can invoke the dry-run harness (update `package.json`).  
   - Add dry-run switches to `release-scaffold.*` and `release.*` agents so they can run in scaffold and generated repositories with sanitized placeholders.

3. **Tests & fixtures**  
   - Update `scripts/agents/__tests__/config.test.js`, `scripts/agents/__tests__/release-scaffold.agent.test.js`, and `scripts/lib/__tests__/test-wizard.js` so they reference the new validation exports and mocked loggers; ensure `tests/test-helper.js` exports a valid module.  
   - Provide a shared `plugin-config.mock.json` fixture used by `scripts/validation/validate-config-schema.js` and share it with CLI/dry-run tooling.  
   - Make sure `npm run test:agents` and dry-run tests execute the proper files by updating Jest/glob configs as needed.

4. **Build/test readiness**  
   - Replace or cover all mustache-filled SCSS/JS files via dry-run replacements before `npm run build/start`, considering a dedicated dry-run build script if required.  
   - Install `puppeteer-core`, `phpunit`, and any other runtimes/dependencies, then ensure Docker is running for WordPress environment scripts (noted in README/logs).  
   - Run the requested commands (`npm run build`, `npm run lint`, `npm run test:js`, `npm run test:agents`, `npm install --force`, `composer install`, `composer run test`) and document blockers (dry-run placeholders, missing WP tests).

## Validation

- Confirm `npm run validate:config`, `npm run validate:schemas`, and `npm run validate:frontmatter` run without errors.  
- Execute the dry-run harness via `npm run dry-run` or the updated script to ensure placeholder substitutions work for SCSS/JS builds.  
- Re-run `npm run test:agents` so the updated tests pass and the `release-scaffold` suite covers missing-version scenarios.  
- Provide logs/reports inside `.github/reports/` per the reporting instructions.
