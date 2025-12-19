---
name: "Release Scaffold Agent"
description: "Wizard-based release automation for the lightspeedwp/block-theme-scaffold project"
target: "github-copilot"
version: "v1.1"
last_updated: "2025-12-15"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
file_type: "agent"
category: "release-management"
status: "active"
visibility: "public"
tags: ["release", "automation", "validation", "mustache-safe", "light-speed"]
owners: ["lightspeedwp/maintainers"]
metadata:
  guardrails: "Always run pre-release validation before tagging, treat {{mustache}} templates as read-only, never mutate prompt files, and rely on dry-run flows for files that contain placeholders."
---

# Release Scaffold Agent

## Overview

This agent prepares, validates, and (when requested) tags releases for the `lightspeedwp/block-theme-scaffold` repository. The agent is not a plugin release worker — it works on the scaffold itself, preserving every mustache placeholder (`{{...}}`) while orchestrating linting, testing, dry-run checks and git operations through a wizard-driven interface.

## Modes

### Pre-release validation mode (default)

- Loads `.github/prompts/pre-release-validation.prompt.md` as the initial context.
- Runs linting and tests through `npm run lint:dry-run` and `npm run dry-run:all` so files containing `{{mustache}}` placeholders stay untouched.
- Validates `scripts/mustache-variables-registry.json` with `node scripts/scan-mustache-variables.js --ci-fail`.
- Captures a documentation snapshot via `npm run dry-run:release-scaffold` to prove prompts and instructions remain up-to-date.
- Does **not** tag, commit, or push — it simply reports the blockers/warnings and marks the workspace as ready for the release mode.

### Full release mode

- Loads `.github/prompts/create-release-scaffold.prompt.md` first so planning, changelog, and tagging steps stay consistent with the release playbook.
- Executes the same validation suite as above, then finishes by updating `CHANGELOG.md`, bumping `package.json`, committing the change, tagging, and suggesting the git workflow (`develop → main`, pushes, tag push).
- Always respects `--dry-run` paths so templated files referenced by `{{mustache}}` stay unchanged.

## Wizard integration and prompts

- The agent collects user input via `scripts/lib/wizard.js` by calling `runPromptWizard` with `release-scaffold.questions.js`.
- Prompts are preloaded based on the workflow mode. Validation mode uses `.github/prompts/pre-release-validation.prompt.md` while release mode uses `.github/prompts/create-release-scaffold.prompt.md` before asking the question set.
- The wizard question set includes a `workflowMode` selector, plus the existing readiness checklist (version, changelog, lint/tests, advanced options, confirmation) so the agent can choose between validation-only or full release with a single run.

## Validation requirements

1. Git workspace must be clean (`git status --porcelain`).
2. Semantic version format (`X.Y.Z`).
3. Dry-run linting (`npm run lint:dry-run`).
4. Dry-run test suite (`npm run dry-run:all`).
5. Mustache registry sync (`node scripts/scan-mustache-variables.js --ci-fail`).
6. Release documentation snapshot (`npm run dry-run:release-scaffold`).

## Mustache safety

- **Never modify** the templated files (`{{slug}}.php`, block templates, `.github/prompts/*`, `.github/instructions/*`, etc.) during validation or release.
- All tests that touch files with `{{mustache}}` placeholders must run via the dry-run commands listed above so that placeholder replacements happen only in temporary directories.
- The agent logs the mustache guard message every validation run and refuses to tag until all checks pass.

## Implementation

- Script: `scripts/agents/release-scaffold.agent.js`
- Questions: `scripts/agents/release-scaffold.questions.js`
- Prompts: `.github/prompts/create-release-scaffold.prompt.md` and `.github/prompts/pre-release-validation.prompt.md`
- Dry-run helper: `scripts/utils/dry-run-release.js --mode=scaffold`

## Logging & Reporting

- Outputs a validation summary after each run and enumerates blockers when any step fails.
- During the release mode, the agent prints the git flow reminder (develop → main) and a checklist of remote pushes/tags.

## Error handling

- Any failure halts the workflow and exits with status `1`. The agent reports whether the workspace was clean, what check failed, and which file or command needs attention.

## Next steps

1. Fix blockers identified in the validation summary.
2. Re-run the agent in full release mode (choose "Full release" or use `--workflow-mode=release`).
3. Push `develop`, merge to `main`, and push the `vX.Y.Z` tag as guided by the final checklist.
