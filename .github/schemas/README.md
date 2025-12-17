# Schema Library

This directory houses the canonical JSON schema assets that drive validation, documentation, and agent tooling for the scaffold.

## Contents

- `block.schema.json` – Core block metadata schema used by the scaffold (copied from Gutenberg/WordPress).
- `block.6.9.json` – WordPress 6.9 block metadata schema reference (`$id` matches `https://schemas.wordpress.org/block/6.9/block.json`).
- `frontmatter.schema.json` – YAML frontmatter schema for `.agent.md` specs and docs.
- `mustache-variables-registry.schema.json` – Schema for the mustache registry JSON.
- `mustache-variables.schema.json` – Schema for individual mustache variable entries.
- `plugin-config.schema.json` – JSON schema describing plugin configurations.
- `examples/` – Sample configuration files.

## Examples

- `examples/plugin-config.example.json` – Sample plugin configuration you can copy when generating a new plugin.

Use these schemas with `ajv`, `node scripts/validate-plugin-config.js`, or whenever you need to ensure the scaffold’s placeholder files stay predictable.
