---
title: Project Overview
description: WordPress multi-block plugin scaffold with generator, tests, and documentation
category: Project
type: Index
audience: Developers, Users
date: 2025-01-20
---

# {{name}}

{{description}}

A production-ready scaffold for a multi-block WordPress plugin. It ships with generation scripts, opinionated defaults, and documentation so you can quickly create, validate, and ship blocks backed by Secure Custom Fields (SCF).

## What this scaffold includes

- **Multiple blocks** out of the box: Card, Collection, Slider, and Featured layouts
- **Registered data structures**: custom post type, taxonomies, options page, and SCF field groups (with repeater support)
- **Presentation assets**: block patterns, templates, template parts (for theme hand-off), and optional block styles
- **Tooling**: webpack via `@wordpress/scripts`, Jest, PHPUnit, Playwright, linting, Lighthouse/size-limit
- **Generators**: mustache-driven plugin generator with config and dry-run helpers

## How it works

```mermaid
flowchart LR
    Developer[Define plugin metadata<br/>{{slug}}, {{name}}, {{namespace}}] --> Mode{Generation mode}
    Mode -->|Template mode| InPlace[Process scaffold in-place]
    Mode -->|Generator mode| OutputDir[Generate to generated-plugins/<slug>]
    InPlace --> Customise[Replace mustache variables]
    OutputDir --> Customise
    Customise --> Build[Install deps & build assets]
    Build --> Test[Lint + JS/PHP/E2E tests]
    Test --> Deploy[Copy to wp-content/plugins]
    Deploy --> WordPress[Activate & iterate]

    classDef step fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    classDef branch fill:#e3f2fd,stroke:#1e88e5,color:#0d47a1;
    class Mode branch;
    class Developer,Build,Test,Deploy,WordPress step;
```

## Requirements

- WordPress 6.5+
- PHP 8.0+
- Node.js 18+
- [Secure Custom Fields](https://wordpress.org/plugins/secure-custom-fields/) plugin

## Using this scaffold

### Option 1: Template mode (process in place)

1. Create the repo from this template or clone it fresh.
2. Replace placeholders with your plugin details:

   ```bash
   node scripts/generate-plugin.js --in-place
   ```

3. Install and build:

   ```bash
   npm install
   composer install
   npm run build
   ```

4. Commit your customised plugin.

### Option 2: Generator mode (output to a new directory)

1. Clone/download this scaffold.
2. Generate a new plugin:

   ```bash
   node scripts/generate-plugin.js
   # or
   node scripts/generate-plugin.js --config my-plugin-config.json
   ```

3. Find the output in `generated-plugins/<your-slug>/` and move it into `wp-content/plugins/`.
4. Install dependencies and build in the generated plugin directory:

   ```bash
   npm install
   composer install
   npm run build
   ```

See `docs/GENERATE-PLUGIN.md` for full options and examples.

## Development workflow

```bash
# Install deps
npm install
composer install

# Start development (watch)
npm start

# Production build
npm run build

# Lint
npm run lint:js
npm run lint:css
composer phpcs

# Tests
npm run test:unit
npm run test:e2e
composer test
```

## Repository structure (current)

```
{{slug}}/
├── {{slug}}.php                 # Main plugin bootstrap
├── uninstall.php                # Cleanup routine
├── inc/                         # PHP services
│   ├── class-core.php           # Loader and service wiring
│   ├── class-post-types.php     # CPT registration
│   ├── class-taxonomies.php     # Taxonomy registration
│   ├── class-fields.php         # Base SCF field groups
│   ├── class-repeater-fields.php # Repeater/section field groups
│   ├── class-options.php        # Options page
│   ├── class-block-bindings.php # Block bindings sources
│   ├── class-block-templates.php # Template registration
│   ├── class-block-styles.php   # Optional block styles
│   ├── class-patterns.php       # Block patterns
│   ├── class-scf-json.php       # SCF local JSON integration
│   └── class-scf-json-validator.php # SCF JSON validation
├── src/                         # Block/editor source
│   ├── blocks/{{slug}}-{card,collection,slider,featured}/
│   ├── components/              # Shared React components
│   ├── hooks/                   # Custom hooks (data fetching, UI state)
│   ├── utils/                   # Shared utilities
│   └── scss/                    # Global/editor styles
├── patterns/                    # Registered block patterns
├── templates/                   # Plugin-registered templates
├── template-parts/              # Theme-facing template parts
├── styles/                      # Optional block style variations
├── scf-json/                    # SCF field group exports and schema
├── languages/                   # Translation templates
├── scripts/                     # Node.js automation scripts
├── bin/                         # Shell helpers
├── tests/                       # JS, PHP, and E2E tests
└── docs/                        # Documentation index
```

## Blocks

- **{{name}} Card** – Single post/card layout.
- **{{name}} Collection** – Queryable list/grid with filtering and pagination.
- **{{name}} Slider** – Carousel with autoplay, navigation, and touch support.
- **Featured {{name_plural}}** – Highlighted entries in grid/hero layouts.

## Custom fields (SCF)

- Subtitle (text)
- Featured (toggle)
- Gallery (image gallery)
- Related Posts (relationship)
- Slides (repeater for slider content)
- Sections (flexible page sections)

Bindings are exposed via `{{namespace}}/fields` for block metadata:

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

## Mustache variables

| Variable | Description |
|----------|-------------|
| `{{slug}}` | Plugin slug (kebab-case) |
| `{{name}}` | Plugin display name |
| `{{namespace}}` | Plugin namespace |
| `{{textdomain}}` | Text domain |

## Documentation

- `docs/README.md` – Documentation index
- `docs/GENERATE-PLUGIN.md` – Generator usage
- `docs/ARCHITECTURE.md` – High-level design and service wiring
- `docs/BUILD-PROCESS.md` – Build stack
- `docs/TESTING.md` – Test strategy and commands

## License

{{license}}
