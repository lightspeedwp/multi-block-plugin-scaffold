---
title: Utility Functions
description: Shared helpers for queries and SCF field handling
category: Development
date: 2025-01-20
---

# Utility Functions

Shared utilities that support blocks, hooks, and components. Exported via `src/utils/index.js`.

## Helper map

```mermaid
flowchart TB
    Query[query.js<br/>query helpers] --> Hooks[Hooks]
    Fields[fields.js<br/>SCF/meta helpers] --> Hooks
    Hooks --> Blocks
    Hooks --> Components

    classDef node fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class Query,Fields,Hooks,Blocks,Components node;
```

## Current files

- `query.js` – Helpers for WP data queries (ordering, pagination, filtering)
- `fields.js` – Helpers for safely reading SCF/meta fields
- `index.js` – Barrel export for all utilities

## Usage

```javascript
import { buildQueryArgs } from '../../utils/query';
import { getFieldValue } from '../../utils/fields';

const args = buildQueryArgs( { perPage: 6 } );
const subtitle = getFieldValue( fields, 'subtitle' );
```

## Guidelines

- Keep helpers pure and side-effect free.
- Prefer small, testable functions; add coverage in `tests/js/` when introducing new helpers.
- Avoid duplicating logic already available in WordPress data utilities.
