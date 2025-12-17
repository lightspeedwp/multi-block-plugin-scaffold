# Frontmatter Schema Reference

This reference matches `.github/schemas/frontmatter.schema.json` so every agent spec stays aligned with the live validator and automation tooling (including `scripts/validation/audit-frontmatter.js`). The schema is intentionally strict about the fields it checks: description is the only required property, everything else is optional but still validated for shape and constraints.

# Core Schema Fields

| Field | Type | Notes |
| --- | --- | --- |
| `description` | string | **Required.** Matches the schema’s `description` requirement: 10–500 characters summarising the agent’s purpose. |
| `name` | string | Optional display name (min 3, max 100 characters). Used when generating human-readable lists. |
| `version` | string | Optional semantic version (`v1.0`, `1.0.0`, etc.) constrained by `^v?\d+\.\d+(\.\d+)?$`. |
| `last_updated` | string | Optional ISO date (`YYYY-MM-DD`). Used by `scripts/validation/audit-frontmatter.js` to surface stale specs. |
| `owners` | array | Optional list of strings (min length 2). At least one entry when present. |
| `status` | string | Optional enum: `draft`, `active`, `deprecated`, `archived`. Defaults to `draft`. |
| `apply_to` | array | Optional glob list (strings) describing the files the agent governs. |
| `file_type` | string | Optional enum: `agent`, `template`, `instructions`, `schema`. Defaults to `agent`. |
| `tags` | array | Optional, unique lowercase `[-a-z0-9]` strings (e.g., `["release","automation"]`). |
| `tools` | array | Required when present; at least one tool string describing allowed capabilities (e.g., `run_in_terminal`). |
| `permissions` | array | Optional but constrained to the approved vocabulary under `.github/schemas/frontmatter.schema.json` (e.g., `read`, `write`, `github:repo`). |
| `runtime` | string | Optional, enumerated to `node`, `github-copilot`, `python`, `bash`, or `php`. |
| `entrypoint` | string | Optional script/command reference (min 3 characters). |
| `metadata.guardrails` | string | Optional but strongly recommended; if present, must be at least 10 characters summarising non-negotiable rules. |
| `metadata.requires_confirmation` | boolean | Optional switch indicating whether human confirmation is needed. Defaults to `false`. |
| `metadata.supports_dry_run` | boolean | Optional switch that should be set to `true` when the agent supports dry-run helpers. |
| `metadata.rate_limit` | object | Optional. Contains positive integers `max_requests` and `window_seconds` when included. |
| `references` | array | Optional list of strings; must include any related docs/tests/workflows such as `../instructions/agent-spec.instructions.md`. |

## Alignment Checklist

1. **Schema parity** – When you append a property here, update `.github/schemas/frontmatter.schema.json` and `scripts/validation/audit-frontmatter.js`. The schema drives `scripts/validation/audit-frontmatter.js` and the doc has to mirror its constraints.
2. **Validation tooling** – Run `npm run validate:frontmatter` to see if any `.agent.md` currently violates the schema. The script prints missing references and stale `last_updated` warnings.
3. **Dry-run readiness** – Mark `metadata.supports_dry_run` as `true` whenever the agent can operate with sanitized templates (see `scripts/utils/dry-run-release.js` for release helpers).

## Sample Frontmatter (aligned with schema)

```yaml
---
name: "Dry-run Release Agent"
description: "Validates release readiness without modifying templated files."
version: "v1.0.0"
last_updated: "2025-12-20"
owners: ["LightSpeedWP Engineering"]
status: "active"
apply_to:
  - ".github/agents/*.agent.md"
file_type: "agent"
tags: ["release","validation"]
tools:
  - read_file
  - run_in_terminal
  - execute
permissions:
  - read
  - write
  - shell
runtime: "node"
entrypoint: "scripts/agents/release.agent.js"
metadata:
  guardrails: "Always sanitise templates before touching release automation."
  supports_dry_run: true
references:
  - ".github/agents/agent.md"
  - ".github/instructions/release.instructions.md"
---
```
