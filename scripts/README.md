---
title: JavaScript Build Scripts & Utilities
description: Node.js scripts for generation, validation, release, and automation
audience: Developers
category: Development
date: 2025-01-20
---

# JavaScript Build Scripts & Utilities

Node.js scripts that power generation, validation, release automation, and dry-run tooling for the scaffold.

## Script families

```mermaid
flowchart TB
    subgraph Generation
        Generator[generate-plugin.js]
        GeneratorAgent[generate-plugin.agent.js]
        DryConfig[dry-run-config.js]
        DryTest[dry-run-test.js]
    end

    subgraph Validation
        ValidateConfig[validate-plugin-config.js]
        AuditFrontmatter[audit-frontmatter.js]
        TestDryRun[test-dry-run.js]
    end

    subgraph Release
        ReleaseAgent[release.agent.js]
        UpdateVersion[update-version.js]
    end

    subgraph Utility
        BuildScript[build.js]
        CountTokens[count-tokens.js]
    end

    Generator --> BuildScript
    BuildScript --> npm[npm scripts]
    ValidateConfig --> CI[CI workflows]
    ReleaseAgent --> CI
    UpdateVersion --> CI

    classDef node fill:#e3f2fd,stroke:#1565c0,color:#0d47a1;
    class Generator,GeneratorAgent,DryConfig,DryTest,ValidateConfig,AuditFrontmatter,TestDryRun,ReleaseAgent,UpdateVersion,BuildScript,CountTokens,node;
```

## Key scripts (current)

- `generate-plugin.js` – Interactive generator to replace mustache variables and optionally output to `generated-plugins/`
- `generate-plugin.agent.js` – Agent entry point for automated generation
- `dry-run-config.js` – Provides config fixtures and file lists for dry runs
- `dry-run-test.js` / `test-dry-run.js` – Runs npm scripts in dry-run mode
- `build.js` – Orchestrates dependency install, lint, test, and build steps
- `validate-plugin-config.js` – Validates plugin config against bundled schemas
- `audit-frontmatter.js` – Checks documentation front matter consistency
- `update-version.js` – Synchronises version across files
- `count-tokens.js` – Utility for measuring token counts (agent usage)
- `release.agent.js` – Release helper (status/validate)

Tests for these scripts live in `scripts/__tests__/`.

## Usage examples

```bash
node scripts/generate-plugin.js --in-place
node scripts/validate-plugin-config.js
node scripts/dry-run-config.js files
node scripts/build.js
npm run update-version
```

## Guidelines

- Keep new automation scripts in `scripts/` (not `bin/`).
- Prefer composable modules under `scripts/lib/` when adding shared logic.
- Mirror npm script names in `package.json` when exposing new tasks.
- Document new scripts here with a one-line description and usage example.
