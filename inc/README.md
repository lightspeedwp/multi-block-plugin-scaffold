---
title: Plugin Includes
description: PHP services that register post types, taxonomies, fields, bindings, templates, patterns, and styles
category: Development
date: 2025-01-20
---

# Plugin Includes

PHP services that wire the plugin together: registration of data structures, field groups, block artefacts, and validation helpers.

## Service map

```mermaid
flowchart TB
    Main[{{slug}}.php] --> Core[class-core.php]
    Core --> PostTypes[class-post-types.php]
    Core --> Taxonomies[class-taxonomies.php]
    Core --> Fields[class-fields.php]
    Fields --> Repeater[class-repeater-fields.php]
    Core --> Options[class-options.php]
    Core --> Bindings[class-block-bindings.php]
    Core --> Templates[class-block-templates.php]
    Core --> Styles[class-block-styles.php]
    Core --> Patterns[class-patterns.php]
    Core --> SCFJSON[class-scf-json.php]
    SCFJSON --> Validator[class-scf-json-validator.php]

    classDef svc fill:#e3f2fd,stroke:#1565c0,color:#0d47a1;
    class Core,PostTypes,Taxonomies,Fields,Repeater,Options,Bindings,Templates,Styles,Patterns,SCFJSON,Validator svc;
```

## Key files (current)

- `class-core.php` – Bootstraps all services and hooks into WordPress lifecycle
- `class-post-types.php` – Registers the custom post type for the scaffolded blocks
- `class-taxonomies.php` – Registers supporting taxonomies
- `class-fields.php` – Declares base SCF field groups
- `class-repeater-fields.php` – Adds repeater/flexible content field groups
- `class-options.php` – Registers the plugin options page and settings
- `class-block-bindings.php` – Exposes SCF/meta data to blocks via block bindings
- `class-block-templates.php` – Registers plugin-provided templates
- `class-block-styles.php` – Optional block style variations
- `class-patterns.php` – Registers block patterns shipped in `patterns/`
- `class-scf-json.php` – Integrates SCF Local JSON loading/saving
- `class-scf-json-validator.php` – Validates SCF JSON exports against the schema

## Working with services

- Keep classes single-responsibility and free of side effects until hooked by `class-core.php`.
- Inject dependencies through constructors when adding new services; register them in `class-core.php`.
- Keep translatable strings using the `{{textdomain}}` text domain.
- When adding new classes, document them here and add coverage in `tests/php/`.

## Related documentation

- `docs/ARCHITECTURE.md` – Service wiring
- `docs/TESTING.md` – PHP test coverage and bootstrap
- `docs/BUILD-PROCESS.md` – How PHP assets pair with built JS/CSS
