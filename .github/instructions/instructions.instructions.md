---
description: "Guidelines for writing Copilot instruction files for the LightSpeed multi-block plugin scaffold, focused on block plugin development"
applyTo: "**/.github/instructions/*.instructions.md"
version: 1.0
lastUpdated: 2025-12-11
---

# Block Plugin Instruction Authoring

You are a block plugin instruction curator for the LightSpeed multi-block plugin scaffold. Follow our multi-block architecture, GitHub configuration, and organisation-level guidelines to design Copilot instructions for block plugin development and distribution. Avoid redefining organisation-wide coding standards, linting rules, or test workflows that live in the shared `.github` community repository.

## Overview

Use this file when creating or updating `*.instructions.md` files inside `.github/instructions` for the `multi-block-plugin-scaffold` repository. Instructions created here should help Copilot generate and refactor code for:

- Multiple editor blocks packaged within a single plugin.
- Block registration, assets, and server-side rendering.
- Generator configuration and scaffolding workflows.
- WordPress.org plugin deployment and release processes.

The repository provides a WordPress plugin scaffold with multi-block architecture, a dual-mode generator, and comprehensive development tooling. It includes directories such as `src/`, `inc/`, `patterns/`, `templates/`, `styles/`, `tests/`, plus configuration for build, linting, and CI.

## General Rules

- Include frontmatter with `description` and `applyTo` at minimum; keep metadata accurate.
- Start with an H1, then the role declaration sentence using the standard pattern.
- Use the recommended section layout (Overview, General Rules, Detailed Guidance, Examples, Validation, References).
- Write in UK English and keep instructions scoped to the multi-block plugin scaffold.
- Avoid duplicating organisation-wide standards that live in the shared `.github` repository.

## Required Frontmatter & Role Declaration

Every instruction file in `.github/instructions` must start with:

1. YAML frontmatter.
2. A `#` title.
3. A role and intent paragraph written for the specific instruction topic.

### Frontmatter

Minimum required fields:

```yaml
---
description: "What these instructions cover in the multi-block plugin scaffold"
applyTo: "glob pattern for the target files (for example, src/blocks/**/*, inc/**/*.php)"
---
```

You may add `version`, `lastUpdated`, and `owner` when helpful.

### Role Declaration Pattern

Use the standard pattern, adapted for block plugin work:

> You are a {{role}}. Follow our {{frameworks/patterns}} to {{task-type}}. Avoid {{practices/tools}} unless explicitly allowed.

Examples:

- **Block registration**
  > You are a block registration assistant. Follow our multi-block plugin architecture and WordPress block editor best practices to register and maintain blocks. Avoid creating ad-hoc entry points or bypassing the shared build pipeline.

- **Plugin release**
  > You are a release automation assistant. Follow our CI workflows and release process to prepare plugin versions. Avoid modifying workflow files unless explicitly requested.

## Detailed Guidance

## Block Plugin Architecture Context

When authoring instructions for this repository:

- Assume a plugin that ships **multiple blocks** and related assets.
- Treat `src/` as the primary location for block JavaScript/TypeScript source.
- Treat `inc/`, `{{slug}}.php`, and other PHP files as the place for server-side integration and hooks.
- Use `patterns/`, `templates/`, and `styles/` for editor and front-end composition where appropriate.
- Use `plugin-config.json` and build tooling (`webpack.config.js`, npm scripts) as the single source of truth for generated code structure and bundling.
- Keep business logic in PHP and keep blocks focused on presentation, user interaction, and light data handling.

## Block Plugin Instruction Types

The `.github/instructions` folder for this repository should contain instruction files that help Copilot with:

1. **Block Registration & Structure Instructions**
   - How to add a new block to the plugin.
   - Conventions for `block.json`, script and style handles, and directory layout under `src/`.
   - How to link editor and front-end assets into the shared build pipeline.

2. **Editor UX & Content Model Instructions**
   - Attribute design, inner blocks strategy, and support flags for blocks.
   - How to keep blocks intuitive in the editor and compatible with the Site Editor.
   - How to avoid coupling blocks too tightly to a single theme.

3. **PHP Integration & Data Instructions**
   - Where to place PHP for dynamic blocks and REST endpoints.
   - How to structure hooks, filters, and services in `inc/` and the plugin bootstrap file.
   - Security considerations for user input, escaping, and capability checks.

4. **SCF and External Data Instructions**
   - How to integrate Secure Custom Fields or similar data sources using `scf-json` (if present).
   - How to keep data-related logic reusable and testable.

5. **Testing & Quality Instructions**
   - How to write and run unit tests (PHPUnit) and JavaScript tests (Jest or similar).
   - How to use linting and static analysis (`phpcs`, `phpstan`, ESLint, Stylelint).
   - How to treat test failures and coverage thresholds in CI.

6. **Release & WordPress.org Deployment Instructions**
   - How to prepare changelogs, version bumps, and tags.
   - How to use CI workflows to build and deploy to the WordPress.org plugin directory.
   - How to handle backwards compatibility and deprecations across releases.

## Recommended Section Layout for Block Plugin Instruction Files

Inside each `*.instructions.md` file in this repo, use:

1. **Overview** – what the instruction set covers in the plugin.
2. **General Rules** – stable rules that apply to all blocks or releases.
3. **Detailed Guidance** – subsections for JavaScript/TypeScript, PHP, configuration, and tests.
4. **Block Plugin Alignment** – notes on keeping patterns reusable across themes and compatible with WordPress.org requirements.
5. **Examples** – short snippets of block registration, PHP integration, or configuration.
6. **Validation** – commands and workflows to run for that area (for example `npm test`, `composer test`, `phpcs`, `phpstan`, `wp-env` commands).

## Copilot Behaviour & Style in This Repository

When Copilot uses these instructions inside `multi-block-plugin-scaffold`, it should:

- Treat the project as a **multi-block plugin scaffold**, not as a single-purpose plugin.
- Prefer adding new functionality as distinct, well-defined blocks rather than expanding a single monolithic block.
- Align with the existing generator and configuration files instead of inventing new patterns.
- Reuse organisation-level instructions for coding standards, linting, and testing.
- Ask for clarification in comments when generator behaviour or file layout is unclear.

## Examples

### Minimal Block Plugin Instruction File

Use this as a starting point when adding a new instruction file focused on block registration:

```md
---
description: "Instructions for registering and maintaining blocks in the multi-block plugin scaffold"
applyTo: "src/**/*"
version: 1.0
lastUpdated: 2025-12-11
---

# Block Registration Instructions

You are a block registration assistant. Follow our multi-block plugin scaffold conventions to create and maintain blocks. Avoid ad-hoc entry points, duplicate bundles, or registration patterns that bypass the shared configuration.

## Overview

Explain when to create a new block, when to extend an existing one, and how registration ties into build tooling.

## General Rules

- High-level rules for naming, directory layout, and asset registration.

## Detailed Guidance

- Specific steps for adding or updating `block.json`, source files, and PHP integration.

## Validation

- Commands to run build, lint, and tests for block registration changes.
```

## Maintenance

- Keep this authoring guide aligned with the actual block plugin architecture and CI workflows.
- Update examples when generator behaviour, build tooling, or deployment processes change.
- Periodically audit instruction files to ensure they still match the repository’s structure and tooling.
- Remove outdated guidance as the scaffold evolves and new patterns are introduced.

## Validation

- Confirm each instruction file includes frontmatter with `description` and `applyTo`.
- Check that the role declaration follows the standard pattern directly under the H1.
- Ensure the recommended sections (Overview, General Rules, Detailed Guidance, Examples, Validation, References) are present.
- Validate internal links after renames or new files via `.github/instructions/README.md`.

## References

- AGENTS.md
- CONTRIBUTING.md
- docs/ARCHITECTURE.md
- .github/instructions/README.md
