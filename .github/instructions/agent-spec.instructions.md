---
description: "How to author, format, and review agent specification files for the LightSpeed multi-block plugin scaffold"
applyTo: ".github/agents/*.agent.md"
version: 1.0
lastUpdated: 2025-12-11
---

# Agent Specification Instructions

You are an agent specification author for the LightSpeed multi-block plugin scaffold. Follow this guide to create reliable Copilot agent specs that align with AGENTS.md, repository tooling, and security guardrails. Avoid granting tools or permissions that are not explicitly justified or supported.

## Overview

Use this file when creating or updating `*.agent.md` files inside `.github/agents`. It keeps agent specs consistent with LightSpeed governance: start with value (purpose and scope), add clarity (capabilities, inputs, outputs), and lock governance (guardrails, logging, validation). Pair every spec with an implementation file (for example, `.js` or `.ts`) and keep language in UK English.

## General Rules

- Start from `.github/agents/template.agent.md`; replace all placeholders and keep metadata accurate (`version`, `lastUpdated`, `status`, `owners`).
- Keep scope explicit: define what the agent owns and what it must not touch across the scaffold, generators, and WordPress integrations.
- Treat tools as permissions: if a tool, API scope, or script is not listed, the agent must not use it.
- Front-load safety: guardrails for destructive actions, data handling, and confirmations are non-negotiable and must cite AGENTS.md and SECURITY.md where relevant.
- Favour deterministic behaviour: define inputs, outputs, and error shapes so downstream automation can parse responses consistently.
- Keep tests and validation steps realistic for LightSpeed workflows (CI scripts, generator commands, WordPress-specific tasks).

## Detailed Guidance

- **Template & metadata:** Copy the latest `.github/agents/template.agent.md`, update frontmatter values, and ensure references include `AGENTS.md` and `.github/instructions/agent-spec.instructions.md`. Use ISO `YYYY-MM-DD` dates.
- **Role & scope first:** Clearly state the agent’s purpose, persona, supported workflows (blocks, generator, release), and explicit boundaries (no deployments, no production writes, no git pushes unless specified).
- **Responsibilities & capabilities:** List only actions the team can support. Make limitations explicit (for example, “read-only for generated plugins”, “no database migrations”).
- **Allowed tools:** Enumerate every tool, script, API, or CLI command the agent may call. Note required environment variables without revealing real values.
- **Inputs & outputs:** Define accepted natural language prompts and structured inputs (JSON/YAML). Provide examples and, when useful, JSON Schema. Specify output formats, required fields, and error conventions for deterministic parsing.
- **Safety guardrails:** Include confirmation rules, non-destructive defaults, rate limits, and escalation paths to humans. Align with OWASP practices and repository security expectations.
- **Failure & rollback:** Document how to handle invalid input, tool failures, partial success, and any rollback or manual follow-up steps.
- **Test tasks & observability:** Provide at least three validation tasks (normal, edge, failure). State logging expectations (timestamps, tool calls, external interactions) and privacy considerations.
- **Changelog discipline:** Keep a changelog section in each spec. Update `version`, `lastUpdated`, and changelog entries whenever behaviour, tools, or guardrails change.

## Examples

- **Frontmatter skeleton:**
  ```md
  ---
  title: "{{Agent Name}}"
  description: "Purpose of the agent in the multi-block plugin scaffold"
  version: "v1.0"
  lastUpdated: "YYYY-MM-DD"
  owners: ["LightSpeedWP Engineering"]
  status: "draft"
  references:
    - "../../AGENTS.md"
    - "../instructions/agent-spec.instructions.md"
  metadata:
    guardrails: "Summarise the non-negotiable safety rules."
  ---
  ```
- **Safety guardrail example:** “Never run `scripts/generate-plugin.js --in-place` without explicit confirmation and validated config.”

## Validation

Use this checklist before merging a new or updated agent spec:

- [ ] **Role & scope** – Purpose is unambiguous; boundaries are clear.
- [ ] **Capabilities** – Actions are supportable; no implied powers.
- [ ] **Tools** – All tools/APIs are explicitly listed with required permissions noted.
- [ ] **Input/Output** – Schemas or formats are clear with examples; error handling is defined.
- [ ] **Safety** – Guardrails reference AGENTS.md/SECURITY.md; confirmation rules exist for risky actions.
- [ ] **Failure/Rollback** – Behaviour for partial failure and recovery is documented.
- [ ] **Testing** – Includes at least one normal task, one edge case, and one failure case.
- [ ] **Observability** – Logging and audit expectations are stated.
- [ ] **Changelog & metadata** – Version, `lastUpdated`, owners, and status fields are current; changelog updated.

## References

- [AGENTS.md](../../AGENTS.md)
- [.github/agents/template.agent.md](../agents/template.agent.md)
- [instructions.instructions.md](./instructions.instructions.md)
- [coding-standards.instructions.md](./coding-standards.instructions.md)
- [SECURITY.md](../../SECURITY.md)
