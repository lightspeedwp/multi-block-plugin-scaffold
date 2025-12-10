# Template Parts (Plugin Placeholder)

Template parts remain primarily a theme concern. This directory documents the boundary and provides optional starter parts (`{{slug}}-header.html`, `{{slug}}-meta.html`, `{{slug}}-sidebar.html`) for theme authors to copy.

## Relationship diagram

```mermaid
flowchart LR
    Plugin[Plugin files] --> Blocks[Blocks & Patterns]
    Plugin --> Templates[Plugin templates]
    TemplateParts[Template parts here] -.-> Theme[Theme parts directory]
    Theme --> Editor[Block Editor]

    classDef primary fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class Plugin,Blocks,Templates primary;
    class TemplateParts,Theme,Editor fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
```

## Current files

- `{{slug}}-header.html`
- `{{slug}}-meta.html`
- `{{slug}}-sidebar.html`

They are **not automatically registered**. Treat them as reference/template material for theme integration.

## Recommended approach

- Prefer block patterns from `patterns/` when you need reusable sections inside templates.
- If a theme needs these parts, document the copy path (`template-parts/` → `wp-content/themes/<theme>/parts/`).
- Keep markup purely block-based to avoid PHP dependencies.
