---
description: >-
  How to author, format, and review agent specification files for the LightSpeed
  multi-block plugin scaffold
applyTo: .github/agents/*.agent.md
version: "1.0"
lastUpdated: "2025-12-11"
references:
  - ../custom-instructions.md
---

# Agent Specification Instructions

You are an agent specification author for the LightSpeed multi-block plugin scaffold. Follow this guide to create reliable Copilot agent specs that align with AGENTS.md, repository tooling, and security guardrails. Avoid granting tools or permissions that are not explicitly justified or supported.

## Overview

Use this file when creating or updating `*.agent.md` files inside `.github/agents`. It keeps agent specs consistent with LightSpeed governance: start with value (purpose and scope), add clarity (capabilities, inputs, outputs), and lock governance (guardrails, logging, validation). Pair every spec with an implementation file (for example, `.js` or `.ts`) and keep language in UK English.

## General Rules

- Start from `.github/agents/template.agent.md`; replace all placeholders and keep metadata accurate (`version`, `last_updated`, `status`, `owners`).
- Keep scope explicit: define what the agent owns and what it must not touch across the scaffold, generators, and WordPress integrations.
- Treat tools as permissions: if a tool, API scope, or script is not listed, the agent must not use it.
- Front-load safety: guardrails for destructive actions, data handling, and confirmations are non-negotiable and must cite AGENTS.md and SECURITY.md where relevant.
- Favour deterministic behaviour: define inputs, outputs, and error shapes so downstream automation can parse responses consistently.
- Keep tests and validation steps realistic for LightSpeed workflows (CI scripts, generator commands, WordPress-specific tasks).

## Detailed Guidance

- **Template & metadata:** Copy the latest `.github/agents/template.agent.md`, update frontmatter values, and ensure references include `AGENTS.md` and `.github/instructions/agent-spec.instructions.md`. Use ISO `YYYY-MM-DD` dates.
- **Role & scope first:** Clearly state the agent's purpose, persona, supported workflows (blocks, generator, release), and explicit boundaries (no deployments, no production writes, no git pushes unless specified).
- **Responsibilities & capabilities:** List only actions the team can support. Make limitations explicit (for example, "read-only for generated plugins", "no database migrations").
- **Allowed tools:** Enumerate every tool, script, API, or CLI command the agent may call. Note required environment variables without revealing real values. Tools are explicitly listed in the `tools` frontmatter array.
- **Permissions:** Define fine-grained permissions using the approved vocabulary (see Permissions Vocabulary section below). Grant permissions conservatively based on agent's actual needs. Include the `permissions` field in frontmatter alongside `tools`.
- **Inputs & outputs:** Define accepted natural language prompts and structured inputs (JSON/YAML). Provide examples and, when useful, JSON Schema. Specify output formats, required fields, and error conventions for deterministic parsing.
- **Safety guardrails:** Include confirmation rules, non-destructive defaults, rate limits, and escalation paths to humans. Align with OWASP practices and repository security expectations.
- **Failure & rollback:** Document how to handle invalid input, tool failures, partial success, and any rollback or manual follow-up steps.
- **Test tasks & observability:** Provide at least three validation tasks (normal, edge, failure). State logging expectations (timestamps, tool calls, external interactions) and privacy considerations.
- **Changelog discipline:** Keep a changelog section in each spec. Update `version`, `last_updated`, and changelog entries whenever behaviour, tools, or guardrails change.

## Permissions Vocabulary

The `permissions` field gates what agents can access and modify. Use the approved enum values from `.github/schemas/frontmatter.schema.json`. Grant permissions conservatively and document why each is needed.

### Core Permissions

- **`read`** - Read files, directories, and repository content. Required for most agents that need to inspect code, configuration, or documentation.
- **`write`** - Create, update, or delete files in the repository. Required for agents that generate code, update configurations, or modify documentation.
- **`execute`** - Execute scripts, commands, or binaries. Required for agents that run build tools, tests, or generation scripts.
- **`shell`** - Access to shell/terminal operations. Required for agents that need to run command-line tools like npm, composer, or git.
- **`filesystem`** - Full filesystem access including directory operations. Required for agents that need to create/manage directory structures.
- **`network`** - Make network requests to external services. Required for agents that fetch data from APIs, check URLs, or integrate with external tools.

### GitHub Permissions

- **`github:repo`** - Access repository information, read branches, tags, and commits. Required for agents working with repository metadata.
- **`github:issues`** - Create, read, update GitHub issues. Required for reporting agents or issue triage automation.
- **`github:pulls`** - Create, read, update pull requests. Required for release agents or PR automation.
- **`github:workflows`** - Trigger or manage GitHub Actions workflows. Required for CI/CD integration agents.
- **`github:checks`** - Read or create status checks. Required for quality gate agents.
- **`github:actions`** - Manage GitHub Actions. Required for workflow management agents.

### Permission Examples

```yaml
# Read-only documentation agent
permissions: ["read"]

# Code quality agent (reads code, writes reports)
permissions: ["read", "write", "execute", "filesystem"]

# Plugin generator agent (full file system access, runs scripts)
permissions: ["read", "write", "execute", "shell", "filesystem"]

# Release agent (GitHub integration, runs commands)
permissions: ["read", "write", "execute", "shell", "filesystem", "github:repo", "github:pulls", "github:workflows"]

# Reporting agent (reads data, creates issues)
permissions: ["read", "github:repo", "github:issues"]
```

### Permission Guidelines

1. **Principle of least privilege** - Only grant permissions actually needed
2. **Document justification** - Explain why each permission is required in agent spec
3. **Review regularly** - Audit permissions when agent capabilities change
4. **Network access** - Requires explicit justification (external API calls, URL validation)
5. **GitHub permissions** - Must document which GitHub features are accessed and why
6. **Shell access** - Document which commands/tools are executed

### Adding Permissions to Specs

When updating or creating agent specifications, add the `permissions` field to frontmatter:

```markdown
---
name: "Example Agent"
description: "Agent description"
tools: ["read_file", "update_file", "run_in_terminal"]
permissions: ["read", "write", "execute", "shell"]
---
```

The permissions array should align with the tools array:
- `read_file` → requires `read` permission
- `update_file`, `create_file` → requires `write` permission
- `run_in_terminal` → requires `execute` and `shell` permissions
- `github_api` → requires appropriate `github:*` permissions

## Examples

- **Frontmatter skeleton:**
  ```md
  ---
  title: "{{Agent Name}}"
  description: "Purpose of the agent in the multi-block plugin scaffold"
  version: "v1.0"
  last_updated: "YYYY-MM-DD"
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
- [ ] **Tools** – All tools/APIs are explicitly listed in `tools` frontmatter array.
- [ ] **Permissions** – Permissions field is present with appropriate values from approved vocabulary; justification is clear.
- [ ] **Tool-Permission alignment** – Permissions match the capabilities required by listed tools.
- [ ] **Input/Output** – Schemas or formats are clear with examples; error handling is defined.
- [ ] **Safety** – Guardrails reference AGENTS.md/SECURITY.md; confirmation rules exist for risky actions.
- [ ] **Failure/Rollback** – Behaviour for partial failure and recovery is documented.
- [ ] **Testing** – Includes at least one normal task, one edge case, and one failure case.
- [ ] **Observability** – Logging and audit expectations are stated.
- [ ] **Changelog & metadata** – Version, `last_updated`, owners, and status fields are current; changelog updated.
- [ ] **Schema validation** – Run `npm run validate:agents` to ensure frontmatter passes schema validation.
