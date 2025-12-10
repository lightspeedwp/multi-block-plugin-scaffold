---
title: Translation Files
description: Internationalisation assets for the plugin
category: Development
date: 2025-01-20
---

# Translation Files

Internationalisation assets generated via `wp i18n` for PHP and JavaScript strings.

## Workflow

```mermaid
flowchart LR
    Source[PHP/JS strings] --> MakePot[`npm run makepot`]
    MakePot --> POT[{{textdomain}}.pot]
    POT --> Translators[PO/MO & JSON]
    Translators --> WordPress[Loaded at runtime]

    classDef node fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class Source,MakePot,POT,Translators,WordPress node;
```

## Current files

- `{{slug}}.pot` – Translation template generated from the scaffold

## Commands

```bash
npm run makepot    # Generate POT file
npm run makejson   # Generate JS translation JSON (if JS strings exist)
npm run i18n       # Combined task
```

## Notes

- Keep text domain consistent (`{{textdomain}}`) across PHP and block metadata.
- Exclude build/vendor directories when generating translation files (already handled in scripts).
