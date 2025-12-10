---
title: JSON Schema
description: Schema files for validating SCF field group exports
category: Development
date: 2025-01-20
---

# JSON Schema Files

JSON Schema definitions used to validate SCF field group exports before they are consumed by the plugin or committed.

## Validation flow

```mermaid
flowchart LR
    Schema[scf-field-group.schema.json] --> Validator[npx ajv / PHPUnit]
    Validator --> Fixtures[../*.json]
    Fixtures --> CI[CI + tests/php/test-scf-json-schema-validation.php]

    classDef node fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class Schema,Validator,Fixtures,CI node;
```

## Current schema

- `scf-field-group.schema.json` – Draft-07 schema describing SCF field group exports (structure, field definitions, location rules).

## Usage

```bash
npx ajv-cli validate -s schema/scf-field-group.schema.json -d ../group_example_basic_fields.json
```

Run `npm run test:scf` to execute the bundled PHPUnit schema checks.

## Guidelines

- Keep the schema aligned with SCF export format changes.
- Treat schema updates as breaking changes; update fixtures and tests together.
