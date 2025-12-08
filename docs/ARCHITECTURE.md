---
title: Repository Architecture
description: Comprehensive folder structure and organization
category: Documentation
type: Architecture
audience: Developers
date: 2025-12-07
---

Comprehensive guide to the Multi-Block Plugin Scaffold repository structure, folder organization, and file conventions.

## Overview

This repository follows a structured organization with clear separation of concerns:

- **Source code** - `src/`, `inc/`, main plugin file
- **Build system** - `bin/`, `webpack.config.js`, configuration files
- **Tests** - `tests/` with unit, integration, and E2E tests
- **Documentation** - `docs/` for guides and references
- **Infrastructure** - `.github/` for workflows, agents, and instructions
- **Runtime data** - `logs/`, `tmp/`, `reports/` (excluded from Git)
- **Distribution** - `patterns/`, `templates/`, `parts/`, `scf-json/`

## Folder Structure

```text
multi-block-plugin-scaffold/
├── .github/                   # GitHub configuration and automation
│   ├── agents/               # AI agent specifications and scripts
│   ├── instructions/         # AI/Copilot coding instructions
│   ├── prompts/              # AI prompt templates
│   └── workflows/            # GitHub Actions CI/CD workflows
├── assets/                    # Development assets (not shipped)
├── bin/                       # Build scripts and utilities
├── docs/                      # Developer documentation
├── inc/                       # PHP classes and includes
├── languages/                 # Internationalization files
├── logs/                      # Log files (Git ignored)
├── parts/                     # Block template parts
├── patterns/                  # Block patterns
├── reports/                   # Point-in-time analysis reports
├── scf-json/                  # SCF field group definitions
├── src/                       # Source files (uncompiled)
│   ├── blocks/               # Block implementations
│   ├── components/           # Shared React components
│   ├── hooks/                # Custom React hooks
│   ├── scss/                 # Stylesheets
│   └── utils/                # Utility functions
├── templates/                 # Block templates
├── tests/                     # Test files
│   ├── agents/               # Agent tests
│   ├── e2e/                  # End-to-end tests
│   ├── js/                   # JavaScript unit tests
│   └── php/                  # PHP unit tests
├── tmp/                       # Temporary files (Git ignored)
├── vendor/                    # Composer dependencies
└── {{slug}}.php              # Main plugin file
```

## Directory Purposes

### Source Directories

#### `src/` - Uncompiled Source Files

**Purpose**: Contains all uncompiled source code that gets compiled/bundled during build.

**Contents**:

- `src/blocks/` - Block implementations (edit.js, save.js, block.json)
- `src/components/` - Shared React components
- `src/hooks/` - Custom React hooks
- `src/scss/` - SCSS stylesheets
- `src/utils/` - JavaScript utility functions
- `src/index.js` - Main entry point for webpack

**Characteristics**:

- Not included in distribution (`.distignore`)
- Compiled to `build/` directory
- Modern ES6+ JavaScript
- SCSS/CSS with PostCSS processing

**Example Block Structure**:

```text
src/blocks/{{slug}}-card/
├── block.json           # Block configuration
├── edit.js             # Editor component
├── save.js             # Frontend save
├── render.php          # Dynamic render
├── style.scss          # Frontend styles
└── editor.scss         # Editor-only styles
```

#### `inc/` - PHP Classes and Includes

**Purpose**: PHP class files following WordPress coding standards.

**Contents**:

- `inc/class-post-types.php` - Custom post type registration
- `inc/class-taxonomies.php` - Taxonomy registration
- `inc/class-fields.php` - SCF field groups
- `inc/class-repeater-fields.php` - Repeater field logic
- `inc/class-block-templates.php` - Block template assignment
- `inc/class-block-bindings.php` - Block bindings API
- `inc/class-patterns.php` - Pattern registration
- `inc/class-options.php` - Options pages
- `inc/class-scf-json.php` - SCF JSON sync
- `inc/class-scf-json-validator.php` - Field validation

**Naming Convention**:

- Prefix: `class-`
- Format: `class-{feature}.php`
- Class name: `{Namespace}_{Feature}`

**Example**:

```php
// File: inc/class-post-types.php
class Tour_Operator_Post_Types {
    public function register() {
        // Registration logic
    }
}
```

### Build & Configuration

#### `bin/` - Build Scripts and Utilities

**Purpose**: Node.js scripts for build, generation, and automation.

**Contents**:

- `bin/build.js` - Main build coordination
- `bin/update-version.js` - Version management
- `bin/dry-run-config.js` - Dry-run configuration
- `bin/dry-run-test.js` - Template testing
- `bin/generate-plugin.js` - Plugin generator (future)
- `bin/install-wp-tests.sh` - WordPress test setup

**Characteristics**:

- Excluded from distribution
- Executable scripts (`chmod +x`)
- Node.js or bash
- Well-documented with usage

**Example Structure**:

```javascript
#!/usr/bin/env node
/**
 * Script Name
 * Purpose and description
 *
 * Usage:
 *   node bin/script-name.js [options]
 */
```

#### Configuration Files (Root)

**Build Configuration**:

- `webpack.config.js` - Webpack bundling
- `package.json` - Node dependencies and scripts
- `composer.json` - PHP dependencies

**Code Quality**:

- `.eslint.config.cjs` - JavaScript linting
- `.stylelint.config.cjs` - CSS/SCSS linting
- `.prettier.config.cjs` - Code formatting
- `phpcs.xml` - PHP coding standards
- `phpstan.neon` - PHP static analysis

**Testing**:

- `jest.config.js` - JavaScript unit tests
- `phpunit.xml` - PHP unit tests
- `.wp-env.json` - WordPress environment

**Other**:

- `.editorconfig` - Editor configuration
- `.browserslistrc` - Browser targets
- `.nvmrc` - Node version
- `.npmrc` - NPM configuration

### Documentation

#### `docs/` - Developer Documentation

**Purpose**: Comprehensive guides, references, and governance documentation.

**Contents**:

**Architecture & Structure**:

- `docs/ARCHITECTURE.md` - This file (repository structure)
- `docs/FOLDER-STRUCTURE.md` - Source directory details

**Development Guides**:

- `docs/DEVELOPMENT.md` - Development setup and workflow
- `docs/BUILD-PROCESS.md` - Build system documentation
- `docs/TESTING.md` - Testing strategies and setup
- `docs/GENERATE-PLUGIN.md` - Plugin generation guide

**Reference Documentation**:

- `docs/API_REFERENCE.md` - PHP and JavaScript APIs
- `docs/BLOCK-SCHEMA-EVOLUTION.md` - Block schema versioning
- `docs/CONFIGS.md` - Configuration file reference

**Processes & Governance**:

- `docs/AGENTS-OVERVIEW.md` - AI agents documentation
- `docs/WORKFLOWS.md` - GitHub Actions workflows
- `docs/INTERNATIONALIZATION.md` - i18n implementation
- `docs/DEPRECATION.md` - Deprecation policy
- `docs/DRY-RUN-TESTING.md` - Dry-run testing system
- `docs/VALIDATION.md` - Template validation

**Characteristics**:

- Markdown format
- Frontmatter metadata
- Cross-referenced
- Kept up-to-date
- Version controlled

**Frontmatter Format**:

```markdown
---
title: Document Title
description: Short description
category: Development|Documentation|Reference|etc
type: Guide|Reference|Index|etc
audience: Developers|Users|Contributors
date: YYYY-MM-DD
---
```

### Infrastructure

#### `.github/` - GitHub Configuration

**Purpose**: GitHub-specific configuration, automation, and AI assistance.

**Structure**:

```text
.github/
├── agents/                    # AI agent system
│   ├── agent.md              # Main agent index
│   ├── scaffold-generator.agent.md
│   ├── scaffold-generator.agent.js
│   ├── development-assistant.agent.md
│   └── agent-script.js       # Template automation agent
├── instructions/              # AI/Copilot instructions
│   ├── instructions.md       # Main index
│   ├── generate-plugin.instructions.md
│   ├── scf-fields.instructions.md
│   └── theme-json.instructions.md
├── prompts/                   # AI prompt templates
│   ├── prompts.md            # Main index
│   └── generate-plugin.prompt.md
└── workflows/                 # GitHub Actions
    ├── code-quality.yml
    ├── ci-cd.yml
    ├── i18n.yml
    ├── performance.yml
    └── security.yml
```

**Agents** (`agents/`):

- AI agent specifications (`.md`)
- Agent implementations (`.js`)
- Automation scripts
- See [AGENTS-OVERVIEW.md](./AGENTS-OVERVIEW.md)

**Instructions** (`instructions/`):

- Rules for AI/Copilot
- Coding standards
- File-type specific rules
- Applied via `applyTo` patterns

**Prompts** (`prompts/`):

- Interactive prompt templates
- Generation workflows
- Consistent AI output

**Workflows** (`workflows/`):

- CI/CD automation
- Code quality checks
- Performance testing
- Security scanning
- See [WORKFLOWS.md](./WORKFLOWS.md)

### Runtime & Output

#### `logs/` - Log Files

**Purpose**: Log files from tests, builds, and automation.

**Contents**:

- Test execution logs
- Build process logs
- Agent execution logs
- Error traces
- Performance metrics

**Naming Convention**:

```text
<source>-<type>-<timestamp>.log
```

Examples:

- `test-unit-2025-12-07T10-30-00.log`
- `build-webpack-2025-12-07T14-15-30.log`
- `agent-scaffold-generator-2025-12-07T09-00-00.log`

**Characteristics**:

- Excluded from Git (`.gitignore`)
- Excluded from distribution (`.distignore`)
- Timestamped filenames
- Standard log levels (ERROR, WARN, INFO, DEBUG)
- See [logs/README.md](../logs/README.md)

#### `tmp/` - Temporary Files

**Purpose**: Ephemeral files and working directories.

**Contents**:

- Build artifacts
- Test fixtures
- Cache files
- Working directories
- Agent workspaces

**Subdirectories**:

- `tmp/build/` - Build process temporary files
- `tmp/test/` - Test execution temporary files
- `tmp/cache/` - Caching temporary data
- `tmp/agents/` - AI agent working files
- `tmp/downloads/` - Downloaded temporary files

**Characteristics**:

- Excluded from Git (`.gitignore`)
- Excluded from distribution (`.distignore`)
- Safe to delete entirely
- Auto-created by scripts
- See [tmp/README.md](../tmp/README.md)

#### `reports/` - Analysis Reports

**Purpose**: Point-in-time summaries and analysis documents.

**Contents**:

- Migration reports
- Analysis documents
- Performance benchmarks
- Audit results
- Setup decisions

**Difference from `docs/`**:

- **Documentation** (`docs/`) - How to use and develop
- **Reports** (`reports/`) - What was done, when, and why

**Format**:

- Include date
- Provide context
- Document findings
- Record actions
- Note outcomes

**Characteristics**:

- Version controlled (unlike `logs/` and `tmp/`)
- Historical records
- Point-in-time snapshots
- See [reports/README.md](../reports/README.md)

### Distribution

#### `patterns/` - Block Patterns

**Purpose**: Reusable block pattern definitions.

**Contents**:

- PHP pattern files
- Pattern categories
- Pattern metadata

**Naming Convention**: `{{slug}}-{pattern-name}.php`

Examples:

- `patterns/{{slug}}-card.php`
- `patterns/{{slug}}-grid.php`
- `patterns/{{slug}}-featured.php`

**Format**:

```php
<?php
/**
 * Title: Pattern Title
 * Slug: {{slug}}/pattern-name
 * Categories: {{slug}}
 * Description: Pattern description
 */
?>
<!-- Block markup -->
```

#### `templates/` - Block Templates

**Purpose**: HTML block templates for post types.

**Contents**:

- Single post templates
- Archive templates
- Custom page templates

**Naming Convention**: `{type}-{{slug}}.html`

Examples:

- `templates/single-{{slug}}.html`
- `templates/archive-{{slug}}.html`

**Format**: WordPress block HTML markup

#### `parts/` - Template Parts

**Purpose**: Reusable template parts.

**Contents**:

- Header parts
- Footer parts
- Sidebar parts
- Meta information parts

**Naming Convention**: `{{slug}}-{part-name}.html`

Examples:

- `parts/{{slug}}-header.html`
- `parts/{{slug}}-meta.html`
- `parts/{{slug}}-sidebar.html`

#### `scf-json/` - SCF Field Groups

**Purpose**: Secure Custom Fields (SCF) field group definitions in JSON format.

**Contents**:

- Field group JSON files
- Field schemas
- Validation rules

**Naming Convention**: `group_{{slug}}_{feature}.json`

Examples:

- `scf-json/group_{{slug}}_details.json`
- `scf-json/group_{{slug}}_metadata.json`

**Local JSON Sync**:

- Auto-imports on activation
- Syncs changes to files
- Version controlled

### Testing

#### `tests/` - Test Files

**Purpose**: Comprehensive test suite.

**Structure**:

```text
tests/
├── agents/                    # Agent tests
│   └── scaffold-generator.test.js
├── e2e/                      # End-to-end tests
│   ├── blocks/
│   └── fixtures/
├── js/                       # JavaScript unit tests
│   ├── blocks/
│   ├── components/
│   └── utils/
├── php/                      # PHP unit tests
│   ├── test-post-types.php
│   ├── test-taxonomies.php
│   └── test-fields.php
├── fixtures/                 # Test fixtures
├── bootstrap.php            # PHPUnit bootstrap
├── phpstan-bootstrap.php    # PHPStan bootstrap
└── setup-tests.js           # Jest setup
```

**Test Types**:

- **Unit tests** - Individual functions/classes
- **Integration tests** - Multiple components together
- **E2E tests** - Full user workflows
- **Agent tests** - AI agent validation

**Characteristics**:

- Excluded from distribution
- Mirror `src/` structure
- Use proper fixtures
- Log to `logs/` directory

## File Naming Conventions

### PHP Files

**Classes**:

- Format: `class-{feature}.php`
- Example: `class-post-types.php`
- Class: `{Namespace}_{Feature}`

**Functions**:

- Prefix: `{{namespace}}_`
- Format: `{{namespace}}_{function_name}`
- Example: `tour_operator_register_blocks()`

**Constants**:

- Prefix: `{{NAMESPACE|upper}}_`
- Format: `{{NAMESPACE|upper}}_{CONSTANT_NAME}`
- Example: `TOUR_OPERATOR_VERSION`

### JavaScript Files

**Components**:

- Format: `PascalCase.js`
- Example: `PostSelector.js`, `TaxonomyFilter.js`

**Utilities**:

- Format: `camelCase.js`
- Example: `formatDate.js`, `sanitizeTitle.js`

**Blocks**:

- Format: `{{slug}}-{block-name}/`
- Files: `edit.js`, `save.js`, `block.json`

### CSS/SCSS Files

**Block Styles**:

- `style.scss` - Frontend styles
- `editor.scss` - Editor-only styles

**Shared Styles**:

- `_variables.scss` - Variables
- `_mixins.scss` - Mixins
- `_utilities.scss` - Utility classes

**Class Names** (BEM):

- Block: `.{{namespace}}-component`
- Element: `.{{namespace}}-component__element`
- Modifier: `.{{namespace}}-component--modifier`

### Markdown Files

**Documentation**:

- Format: `UPPERCASE.md` or `lowercase.md`
- Index files: `README.md`
- Root docs: `UPPERCASE.md` (e.g., `CONTRIBUTING.md`)
- Nested docs: Can be either (prefer `UPPERCASE.md`)

**Frontmatter Required**:

```yaml
---
title: Document Title
description: Short description
category: Category
type: Type
audience: Audience
date: YYYY-MM-DD
---
```

## File Organization Best Practices

### 1. Separation of Concerns

- **Source** (`src/`) - Uncompiled code
- **Build** (`build/`) - Compiled assets
- **Distribution** (`patterns/`, `templates/`) - Shipped files
- **Development** (`tests/`, `bin/`, `docs/`) - Not shipped

### 2. Mirror Structures

Test directories mirror source directories:

```text
src/blocks/{{slug}}-card/
tests/js/blocks/{{slug}}-card.test.js
```

### 3. Clear Naming

- Descriptive names
- Consistent prefixes/suffixes
- Namespace everything
- Use mustache variables

### 4. Proper Exclusions

**Never commit**:

- `node_modules/`
- `vendor/`
- `logs/`
- `tmp/`
- `.env` files

**Never ship**:

- `src/`
- `tests/`
- `docs/`
- `bin/`
- Development configs

### 5. Documentation Proximity

- README in every major directory
- Frontmatter in all markdown
- Comments in complex code
- Usage examples in bin/ scripts

## Mustache Template System

The scaffold uses mustache variables for customization:

### Core Variables

- `{{slug}}` - Plugin slug (`tour-operator`)
- `{{name}}` - Display name (`Tour Operator`)
- `{{namespace}}` - PHP namespace (`tour_operator`)
- `{{textdomain}}` - i18n domain (`tour-operator`)
- `{{version}}` - Version number (`1.0.0`)

### Usage

**PHP**:

```php
// Constants
define( '{{namespace|upper}}_VERSION', '{{version}}' );

// Functions
function {{namespace}}_init() {}

// Classes
class {{namespace|pascalCase}}_Plugin {}
```

**JavaScript**:

```javascript
registerBlockType( '{{namespace}}/block-name', {
    title: __( 'Block Title', '{{textdomain}}' ),
} );
```

**CSS**:

```css
.{{namespace}}-block {
    /* Styles */
}
```

See [.github/instructions/generate-plugin.instructions.md](../.github/instructions/generate-plugin.instructions.md) for complete mustache variable reference.

## Related Documentation

- **[AGENTS-OVERVIEW.md](./AGENTS-OVERVIEW.md)** - AI agents system
- **[WORKFLOWS.md](./WORKFLOWS.md)** - GitHub Actions CI/CD
- **[GENERATE-PLUGIN.md](./GENERATE-PLUGIN.md)** - Plugin generation
- **[BUILD-PROCESS.md](./BUILD-PROCESS.md)** - Build system
- **[TESTING.md](./TESTING.md)** - Testing guide
- **[FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md)** - Source details
- **[logs/README.md](../logs/README.md)** - Logging documentation
- **[tmp/README.md](../tmp/README.md)** - Temporary files
- **[reports/README.md](../reports/README.md)** - Reports documentation

## Summary

✅ **Clear Structure** - Well-organized directories with specific purposes

✅ **Separation of Concerns** - Source, build, distribution, and development clearly separated

✅ **Proper Exclusions** - Git and distribution ignore files properly configured

✅ **Comprehensive Documentation** - README in major directories with frontmatter

✅ **Naming Conventions** - Consistent naming with namespace prefixing

✅ **Mustache Templates** - Variable system for customization

✅ **Runtime Data Management** - logs/, tmp/, reports/ for different data types

✅ **Testing Infrastructure** - Comprehensive test structure with logging

This architecture ensures maintainability, scalability, and ease of use for both human developers and AI agents.
