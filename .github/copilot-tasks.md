# Copilot Tasklist - Multi-Block Plugin Scaffold

> **Status**: 🔄 Initial scaffold setup

## 1. Core Plugin Files

**Status**: ✅ COMPLETED

- [x] **{{slug}}.php** - Main plugin file
  - Location: [{{slug}}.php](../{{slug}}.php)
  - Handles: Plugin registration, block auto-loading
  - Implementation: Multi-block architecture

- [x] **uninstall.php** - Required for proper plugin cleanup
  - Location: [uninstall.php](../uninstall.php)
  - Handles: Options, transients, user/post meta, cron hooks
  - Implementation: Safe cleanup with `function_exists()` guards

---

## 2. Post Type & Taxonomy Registration

**Status**: ✅ COMPLETED

- [x] **Custom Post Types**
  - Location: [inc/class-post-types.php](../inc/class-post-types.php)
  - Registers: {{slug}} post type with block editor support

- [x] **Custom Taxonomies**
  - Location: [inc/class-taxonomies.php](../inc/class-taxonomies.php)
  - Registers: {{slug}}_category taxonomy

---

## 3. Custom Fields Integration

**Status**: ✅ COMPLETED

- [x] **SCF Field Registration**
  - Location: [inc/class-fields.php](../inc/class-fields.php)
  - Features: Subtitle, featured flag, gallery, related posts

- [x] **Repeater Fields**
  - Location: [inc/class-repeater-fields.php](../inc/class-repeater-fields.php)
  - Features: Slider/gallery repeater, flexible content sections

---

## 4. Block Templates & Bindings

**Status**: ✅ COMPLETED

- [x] **Block Templates**
  - Location: [inc/class-block-templates.php](../inc/class-block-templates.php)
  - Templates: Single and archive templates

- [x] **Block Bindings**
  - Location: [inc/class-block-bindings.php](../inc/class-block-bindings.php)
  - Features: Dynamic field binding via Block Bindings API

- [x] **Patterns Registration**
  - Location: [inc/class-patterns.php](../inc/class-patterns.php)
  - Features: Auto-registers patterns from patterns/ directory

---

## 5. Block Development

**Status**: 📋 TODO

- [ ] **Card Block** - Single post card display
  - Location: `src/blocks/{{slug}}-card/`
  - Features: Post preview with featured image, title, excerpt

- [ ] **Collection Block** - Post query/collection
  - Location: `src/blocks/{{slug}}-collection/`
  - Features: Grid/list/slider layouts, taxonomy filtering

- [ ] **Slider Block** - Carousel/slider display
  - Location: `src/blocks/{{slug}}-slider/`
  - Features: ACF repeater integration, navigation, autoplay

- [ ] **Featured Block** - Featured posts display
  - Location: `src/blocks/{{slug}}-featured/`
  - Features: Highlight featured {{name_plural_lower}}

---

## 6. Shared Components

**Status**: 📋 TODO

- [ ] **Slider Component**
  - Location: `src/components/Slider/`
  - Features: Reusable carousel with accessibility

- [ ] **PostSelector Component**
  - Location: `src/components/PostSelector/`
  - Features: Post selection UI for blocks

- [ ] **TaxonomyFilter Component**
  - Location: `src/components/TaxonomyFilter/`
  - Features: Taxonomy-based filtering

---

## 7. Templates & Patterns

**Status**: 📋 TODO

- [ ] **Block Templates**
  - Location: `templates/`
  - Files: single-{{slug}}.html, archive-{{slug}}.html

- [ ] **Template Parts**
  - Location: `parts/`
  - Files: {{slug}}-header.html, {{slug}}-meta.html, {{slug}}-sidebar.html

- [ ] **Block Patterns**
  - Location: `patterns/`
  - Files: {{slug}}-archive.php, {{slug}}-card.php, {{slug}}-grid.php

---

## 8. Test Coverage

**Status**: 📋 TODO

- [ ] **PHP Unit Tests**
  - Post type registration tests
  - Taxonomy tests
  - Block registration tests

- [ ] **JavaScript Tests**
  - Component unit tests
  - Block editor tests

- [ ] **E2E Tests**
  - Block insertion tests
  - Collection block tests
  - Slider functionality tests

---

## Summary

| Category | Status | Priority |
|----------|--------|----------|
| Core Files | ✅ Completed | High |
| Post Types | ✅ Completed | High |
| Fields | ✅ Completed | High |
| Templates | ✅ Completed | High |
| Blocks | 📋 TODO | High |
| Components | 📋 TODO | Medium |
| Patterns | 📋 TODO | Medium |
| Tests | 📋 TODO | High |

---

## Quick Commands

```bash
# Development
npm run start                    # Watch mode
npm run build                    # Production build

# Testing
npm run test                    # All tests
npm run test:unit              # JavaScript unit tests
npm run test:php               # PHP unit tests
npm run test:e2e               # End-to-end tests

# Code Quality
npm run lint                    # All linters
npm run lint:js                # JavaScript linter
npm run lint:css               # CSS linter
npm run format                 # Format code

# Environment
npm run env:start              # Start WordPress environment
npm run env:stop               # Stop environment
```

---

## Documentation Index

- [README.md](../README.md) - Main plugin documentation
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Developer guide
- [USAGE.md](../USAGE.md) - User guide
