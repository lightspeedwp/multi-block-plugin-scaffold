---
title: Agent Validation Tests
description: Tests for AI agents, generators, and scaffold validation
category: Testing
date: 2025-12-01
---

# Agent Validation Tests

Tests for validating AI agents, generator scripts, and scaffold integrity.

## Overview

This directory contains tests that validate:

- Generator script functionality
- Scaffold template integrity
- Mustache variable processing
- JSON schema validation
- Agent specifications

## Test Files

```
agents/
├── README.md                          # This file
├── scaffold-generator.agent.test.js   # Generator tests
└── template-validation.test.js        # Template validation
```

## Running Tests

```bash
npm run test:agents
```

## Test Coverage

- ✅ Generator input validation
- ✅ Template variable replacement
- ✅ File structure generation
- ✅ JSON schema compliance
- ✅ Block.json validation
- ✅ Custom post type schemas
- ✅ Taxonomy schemas
- ✅ Field group schemas

## Writing Agent Tests

```javascript
describe( 'Scaffold Generator', () => {
    test( 'validates plugin slug', () => {
        const result = validateSlug( 'valid-slug' );
        expect( result.valid ).toBe( true );
    } );
} );
```

## References

- [Generator Documentation](../../docs/GENERATOR-SYSTEM.md)
- [Agent Specifications](../../.github/agents/)
