---
title: Agent Validation Tests
description: Placeholder area for AI agent and generator validation tests
category: Testing
date: 2025-01-20
---

# Agent Validation Tests

Reserved for tests that exercise the generator agents and scaffold integrity. The directory currently contains only this README; add tests as agents mature.

## Intended coverage

```mermaid
flowchart TB
    Generator[Generator inputs] --> Validation[Template & schema validation]
    Validation --> Outputs[Generated plugin files]
    Outputs --> Agents[Agent behaviour tests]
    Agents --> CI[CI gate]

    classDef node fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class Generator,Validation,Outputs,Agents,CI node;
```

## When adding tests

- Cover generator input validation (slugs, namespaces, required fields).
- Assert mustache replacement and file renaming behave as expected.
- Validate JSON schema outputs (SCF field groups, block.json files).
- Keep tests idempotent so they can run safely in CI.
- Update this README with new test files and commands once added.
