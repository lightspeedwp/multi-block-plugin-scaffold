---
name: "Template: Agent Specification"
description: "Standard specification template for LightSpeed multi-block plugin scaffold agents, covering role, tooling, inputs, outputs, and guardrails."
version: "v1.1"
last_updated: "YYYY-MM-DD"
owners: ["LightSpeedWP Engineering"]
status: "draft"
apply_to: [".github/agents/*.agent.md"]
file_type: "template"
tags: ["agent", "spec", "template", "copilot"]
tools: ["Copilot Agents"]
metadata:
  guardrails: "Agents must never perform destructive or irreversible actions without explicit confirmation and must follow AGENTS.md."
---

# LightSpeed Agent Specification Template

Use this template when creating new agent specs for the `lightspeedwp/multi-block-plugin-scaffold` repository. Replace placeholder values before use, keep language in UK English, and ensure the spec pairs with an implementation file in `.github/agents/`.

## Usage Notes
- Save the completed spec as `.github/agents/{{agent_slug}}.agent.md`.
- Keep frontmatter metadata accurate; update `version` and `last_updated` with every change.
- Reference `AGENTS.md` and `.github/instructions/agent-spec.instructions.md` for shared guardrails and authoring rules.
- Treat tool lists as explicit permissions; do not assume unlisted capabilities or external access.

## 1. Role & Scope

Describe:
- The agent’s purpose and clear boundaries within the multi-block plugin scaffold.
- The persona or operating context (for example, CI helper, release assistant, block generator).
- The primary systems, workflows, or teams it supports (WordPress tooling, GitHub workflows, build scripts).

## 2. Responsibilities & Capabilities

List what the agent **can** do:
- Core functions (for example, CI checks, content linting, documentation generation, scaffold validation).
- Allowed transformations and automation rules.
- Explicit limitations (for example, “cannot deploy”, “read-only access to generated plugins”, “no git pushes”).

## 3. Allowed Tools & Integrations

Enumerate allowed tools **explicitly**:
- GitHub API scopes, WP-CLI commands, repository scripts, or external connectors.
- Any required environment variables or secrets (never include real values).
- Command-line interfaces or internal scripts the agent may invoke.

## 4. Input Specification

Define all accepted inputs:
- Natural language inputs (prompts, commands).
- Structured inputs (JSON, YAML, form objects), including JSON Schemas if applicable.
- Examples that match WordPress and scaffold workflows.

## 5. Output Specification

Describe:
- Expected response structure (success, warning, error).
- Required fields (status, summary, actions, logs, file paths).
- Formatting requirements (markdown, JSON block, tables) that downstream automations expect.

## 6. Safety Guardrails

Define what the agent must **never** do:
- Expose or request secrets, or bypass WordPress capability checks.
- Destroy or mutate production data, or run the scaffold generator in destructive modes without confirmation.
- Trigger deployments, billing, or external writes without explicit human approval.
- Perform tasks outside its scope or ignore confirmation prompts.
- Include escalation rules (flag for human review), rate limits, and moderation rules that match AGENTS.md and SECURITY.md.

## 7. Failure & Rollback Strategy

Document how the agent should behave when:
- Input is invalid or missing.
- External tools fail or respond slowly.
- Partial actions succeed and need reporting or reversal.
- State must be rolled back, including constraints and manual follow-up steps.

## 8. Test Tasks (for Validation)

Provide a minimal suite of tasks:
- Basic task → expected behaviour for the agent’s core workflow.
- Edge case → expected behaviour with WordPress or scaffold-specific nuance.
- Failure case → expected error response and recovery guidance.

## 9. Observability & Logging

Specify:
- Required logs (timestamp, tool calls, external interactions, file changes).
- How the agent reports metrics and how to trace actions for audits.
- Privacy considerations for any captured data.

## 10. Changelog

Maintain a simple audit trail inside the spec:
- `v1.1 – Updated guardrails; clarified rollback behaviour.`
- Add entries whenever the template changes; update `version` and `last_updated` accordingly.
