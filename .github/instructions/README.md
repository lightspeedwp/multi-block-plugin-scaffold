---
title: Instructions Directory
description: Developer and AI instruction files for WordPress block plugin development
category: Project
type: Index
audience: Developers, AI Assistants
date: 2025-12-10
last_updated: 2025-12-10
---

# Development Instructions

This directory contains comprehensive instructions and guidelines for AI-assisted WordPress block plugin development following LightSpeed and WordPress coding standards.

## 📚 Master Index

**→ See [_index.instructions.md](./_index.instructions.md) for the complete, categorized index of all instruction files.**

## 📊 Overview

- **Total Files:** 23 instruction files (excludes this README)
- **Categories:** WPCS Standards (7), Block Development (4), Testing (2), Scaffolding (2), Organization (3), Special Topics (4), Meta (1 index)
- **Last Consolidated:** 2025-12-10
- **Consolidation Reduction:** 32% fewer files (28 → 19 content files + 1 index + README + readme.instructions.md)

## 🚀 Quick Start

### For Block Development
1. [blocks-development.instructions.md](./blocks-development.instructions.md) — Core block development guide
2. [block-json.instructions.md](./block-json.instructions.md) — Block metadata reference
3. [javascript-react-development.instructions.md](./javascript-react-development.instructions.md) — React/JS patterns

### For Plugin Generation
1. [generate-plugin.instructions.md](./generate-plugin.instructions.md) — Mustache template generator
2. [scaffold-extensions.instructions.md](./scaffold-extensions.instructions.md) — Extending the scaffold

### For Coding Standards
- All `wpcs-*.instructions.md` files — WordPress PHP, JavaScript, CSS, HTML, Accessibility, and Documentation standards

## 📂 File Categories

### WordPress Coding Standards (wpcs-*)
7 protected files defining core WordPress standards:
- `wpcs-php.instructions.md` — PHP standards
- `wpcs-javascript.instructions.md` — JavaScript standards
- `wpcs-css.instructions.md` — CSS/SCSS standards
- `wpcs-html.instructions.md` — HTML standards
- `wpcs-accessibility.instructions.md` — Accessibility (WCAG 2.2 AA)
- `wpcs-php-docs.instructions.md` — PHP documentation (PHPDoc)
- `wpcs-js-docs.instructions.md` — JavaScript documentation (JSDoc)

### Block Development
4 files covering comprehensive block development:
- `blocks-development.instructions.md` — **NEW** Main block development guide
- `block-json.instructions.md` — Block metadata and configuration
- `patterns-and-templates.instructions.md` — **NEW** Pattern and template development
- `javascript-react-development.instructions.md` — **CONSOLIDATED** React/JS patterns

### Testing & Security
- `testing-e2e.instructions.md` — **RENAMED** Playwright E2E testing
- `security.instructions.md` — Security best practices

### Plugin Scaffolding
- `generate-plugin.instructions.md` — Plugin generation with mustache templates
- `scaffold-extensions.instructions.md` — **RENAMED** Scaffold extension patterns

### Project Organization
- `folder-structure.instructions.md` — File organization standards
- `schema-files.instructions.md` — Schema file structure
- `temp-files.instructions.md` — Temporary file handling

### Special Topics
- `a11y.instructions.md` — Accessibility for block plugins
- `i18n.instructions.md` — Internationalization
- `scf-fields.instructions.md` — Custom fields
- `reporting.instructions.md` — Reporting standards

## 🔍 Finding Instructions

### By Task
- **Creating a block?** → `blocks-development.instructions.md`
- **Creating a pattern?** → `patterns-and-templates.instructions.md`
- **Writing PHP?** → `wpcs-php.instructions.md`
- **Writing JavaScript?** → `wpcs-javascript.instructions.md` + `javascript-react-development.instructions.md`
- **Testing?** → `testing-e2e.instructions.md`
- **Security?** → `security.instructions.md`
- **Accessibility?** → `wpcs-accessibility.instructions.md` or `a11y.instructions.md`

### By File Type
- `*.php` → `wpcs-php.instructions.md`, `wpcs-php-docs.instructions.md`
- `*.js, *.jsx, *.ts, *.tsx` → `wpcs-javascript.instructions.md`, `javascript-react-development.instructions.md`, `wpcs-js-docs.instructions.md`
- `*.css, *.scss` → `wpcs-css.instructions.md`
- `*.html` → `wpcs-html.instructions.md`
- `block.json` → `block-json.instructions.md`
- `patterns/*.php` → `patterns-and-templates.instructions.md`

## 📈 Recent Changes (2025-12-10)

### Consolidation Complete ✅

**Files Consolidated (9 eliminated):**
1. `block-plugin-development.instructions.md` → merged into `blocks-development.instructions.md`
2. `blocks.instructions.md` → merged into `blocks-development.instructions.md`
3. `patterns.instructions.md` → merged into `patterns-and-templates.instructions.md`
4. `pattern-development.instructions.md` → merged into `patterns-and-templates.instructions.md`
5. `javascript-react.instructions.md` → merged into `javascript-react-development.instructions.md`
6. `js-react.instructions.md` → merged into `javascript-react-development.instructions.md`
7. `playwright.instructions.md` → merged into `testing-e2e.instructions.md`
8. `playwright-typescript.instructions.md` → renamed to `testing-e2e.instructions.md`
9. `wp-security.instructions.md` → deleted (redundant)

**Files Renamed (1):**
- `block-plugin.instructions.md` → `scaffold-extensions.instructions.md`

**New Files Created (4):**
1. `blocks-development.instructions.md` — Comprehensive block development guide
2. `patterns-and-templates.instructions.md` — Pattern and template guide
3. `javascript-react-development.instructions.md` — Consolidated JS/React guide
4. `_index.instructions.md` — Master index with navigation

### Impact
- **32% file reduction** (28 → 19 content files)
- **~14% size reduction** (~450KB → ~389KB)
- **Zero duplicate content** (~80KB eliminated)
- **Improved organization** with master index
- **Clearer file purposes** with better naming

## 🎯 Purpose

These instructions help AI tools and developers understand:

- **WordPress block plugin development** — Modern patterns and best practices
- **Block API standards** — Comprehensive block.json and component guidance
- **WordPress Coding Standards** — PHP, JavaScript, CSS, HTML, and accessibility
- **Plugin scaffolding** — Mustache templates and generator patterns
- **Testing strategies** — E2E testing with Playwright
- **Security practices** — Sanitization, escaping, nonces, and capability checks
- **Documentation standards** — PHPDoc and JSDoc conventions
- **Accessibility requirements** — WCAG 2.2 AA compliance

## 📖 Usage

### For AI Assistants
Instructions are automatically loaded to provide context-aware assistance throughout the development process. The `applyTo` frontmatter field specifies which file patterns each instruction applies to.

### For Developers
Reference these files when:
- Starting new block development
- Reviewing code for standards compliance
- Implementing new features
- Writing documentation
- Setting up testing
- Ensuring accessibility

## 🔗 Related Resources

### Internal
- [.github/reports/instruction-consolidation-audit-2025-12-10.md](../reports/instruction-consolidation-audit-2025-12-10.md) — Consolidation audit report
- [.github/projects/active/2025-12-10-instruction-consolidation.md](../projects/active/2025-12-10-instruction-consolidation.md) — Implementation tasks

### External
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## ⚠️ Important Notes

- **Protected Files:** All `wpcs-*` files are protected and should not be deleted
- **Flat Structure:** All files remain in one directory for easy discovery
- **Version Control:** All changes are tracked in git history
- **Cross-References:** Files reference each other — update links when renaming
- **Scope:** Instructions are for WordPress block plugin repositories only

## 📝 Maintenance

### Adding New Instructions
1. Check if topic fits in existing file
2. Consider if new file is truly needed
3. Update `_index.instructions.md` if creating new file
4. Update this README

### Updating Instructions
1. Make changes to instruction file(s)
2. Update `last_updated` in frontmatter
3. Update version number if significant changes
4. Update cross-references if needed

### Reporting Issues
- Create issue with file name and specific problem
- Reference `_index.instructions.md` for context

---

**For complete navigation and detailed file descriptions, see [_index.instructions.md](./_index.instructions.md)**
