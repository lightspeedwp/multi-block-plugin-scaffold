# Multi-Block Plugin Scaffold: Main Agent Index

## Overview & Related Files

This file documents the primary automation agent(s) for this repository, their purpose, usage, and integration with workflows. Reference this file for agent specs, triggers, and environment variables.

**Related Files:**

- [Custom Instructions](../custom-instructions.md) — main AI/Copilot and plugin instructions
- [Prompts](../prompts/prompts.md) — prompt templates for consistent output
- [Global AI Rules (AGENTS.md)](../../AGENTS.md) — org-wide agent rules, coding standards, and cross-references

**Dynamic References:**

- All instruction files: [`*.instructions.md`](../instructions/)
- All agent files: [`*.agent.md`](../agents/) and [`*.agent.js`](../agents/) (current directory)
- All prompt files: [`*.prompt.md`](../prompts/)

---

## Available Agents

### Scaffold Generator Agent

- **Agent Spec:** `.github/agents/scaffold-generator.agent.md`
- **Purpose:** Comprehensive interactive agent that guides you through creating a new multi-block WordPress plugin from this scaffold. Collects detailed requirements for custom post types, taxonomies, SCF fields, blocks, and templates through a multi-stage conversation.
- **Usage:** Say "Generate a new multi-block plugin" or "Create CPT plugin from scaffold"
- **Related Prompt:** [generate-plugin.prompt.md](../prompts/generate-plugin.prompt.md)

### Development Assistant Agent

- **Agent Spec:** `.github/agents/development-assistant.agent.md`
- **Purpose:** AI-powered development assistant for multi-block plugin development, providing guidance on blocks, CPT, SCF fields, and best practices.
- **Modes:** WordPress Development, Block Development, Post Type, Fields, Testing, Security Audit, Performance, Accessibility

### General Automation Agent

- **Agent Script:** `.github/agents/agent-script.js`
- **Workflow:** `.github/workflows/agent-workflow.yml`
- **Purpose:** Demonstrates a functional Node.js agent and workflow for file listing, environment echo, and artifact upload. Use as a template for new automation agents.

### Usage

- **GitHub Actions:** See `.github/workflows/agent-workflow.yml` for triggers and environment variables
- **Local:** `node .github/agents/agent-script.js --example`

### Environment Variables

- `DRY_RUN` (default: `false`)
- `VERBOSE` (default: `false`)
- Additional secrets per workflow (e.g., `GITHUB_TOKEN` for label operations)

### Maintenance

- Keep all agents aligned with repo tooling (linters, build, tests)
- Update documentation and scripts as workflows evolve
- Use `.github/agents/agent-script.js` and `.github/workflows/agent-workflow.yml` as a starting point for new automation agents
- Update references in this file and in all AI ops/instruction files as new agents are added

---

> **Note:** The files `.github/agents/agent-script.js` and `.github/workflows/agent-workflow.yml` are functional examples. Use them as templates for new agents. All AI ops and instruction files (see Related Files above) should reference these agents and workflows as appropriate for discoverability and onboarding.

For more information on agent usage, see [Custom Instructions](../custom-instructions.md), [Workflows](../workflows/), and [Global AI Rules (AGENTS.md)](../../AGENTS.md).
