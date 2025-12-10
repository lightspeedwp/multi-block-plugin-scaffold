---
title: Block Modules
description: Individual Gutenberg block implementations for the scaffold
category: Development
date: 2025-01-20
---

# Block Modules

Self-contained block implementations for the scaffold. Each block ships with metadata, editor UI, save output, and styles.

## Block lifecycle

```mermaid
flowchart LR
    BlockJSON[block.json] --> Index[index.js<br/>registerBlockType]
    Index --> Edit[edit.js]
    Index --> Save[save.js]
    Edit --> Styles[editor.scss]
    Save --> Styles
    Styles --> Bundle[build/*]

    classDef node fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class BlockJSON,Index,Edit,Save,Styles,Bundle node;
```

## Current blocks

- `{{slug}}-card` – Renders a single post card
- `{{slug}}-collection` – Queryable collection with filters/pagination
- `{{slug}}-featured` – Highlights featured entries
- `{{slug}}-slider` – Carousel/slideshow presentation

## File layout

```
blocks/
└── {{slug}}-block-name/
    ├── block.json      # Metadata
    ├── index.js        # Registration and settings
    ├── edit.js         # Editor component
    ├── save.js         # Frontend markup
    ├── style.scss      # Frontend + shared styles
    └── editor.scss     # Editor-only styles
```

## Guidelines

- Keep `block.json` authoritative for titles, category, and supports.
- Use shared hooks/components where possible; avoid duplicate logic between blocks.
- Bind dynamic data via `{{namespace}}/fields` where appropriate instead of ad-hoc fetches.
- Add tests to `tests/js/blocks.test.js` and E2E coverage in `tests/e2e/*.spec.js` when altering block behaviour.
