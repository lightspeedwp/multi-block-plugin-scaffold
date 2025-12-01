# Gemini AI Usage for {{name}}

This repository supports Gemini for advanced code generation, refactoring, and documentation in WordPress multi-block plugin development. Use Gemini for:

- Generating block components, attributes, and block.json configurations
- Refactoring PHP, JS, and SCSS for performance and security
- Writing Playwright/Jest/PHPUnit tests for blocks and plugin features
- Explaining complex code and suggesting best practices

## Best Practices

- Always review and test Gemini-generated code before merging
- Use mustache variables (`{{name}}`, `{{slug}}`, `{{namespace}}`, etc.) in all output
- Reference `.github/instructions/` for standards and schema
- Prefer modular, reusable code and minimal dependencies
- Document all changes in PRs and commit messages
- Follow WordPress coding standards and block editor best practices

## Prompt Examples

- "Generate a block.json with custom attributes and supports for {{name}}."
- "Refactor this PHP render function for security and performance."
- "Create a Playwright E2E test for the {{slug}} block."
- "Add a dark mode style variation to the block styles."
- "Generate Jest unit tests for the edit component."

## Related Files

- [Custom Instructions](.github/custom-instructions.md) — main AI/Copilot and plugin instructions
- [Prompts](.github/prompts/prompts.md) — prompt templates for consistent output
- [Chat Modes](.github/chatmodes/chatmodes.md) — context-specific Copilot prompts
- [Main Agent Index](.github/agents/agent.md) — agent specs and usage
- [Global AI Rules (AGENTS.md)](AGENTS.md) — org-wide agent rules and coding standards

**Dynamic References:**

- All instruction files: [`*.instructions.md`](.github/instructions/)
- All agent files: [`*.agent.md`](.github/agents/) and [`*.agent.js`](.github/agents/)
- All prompt files: [`*.prompt.md`](.github/prompts/)
- All chatmode files: [`*.md`](.github/chatmodes/)
