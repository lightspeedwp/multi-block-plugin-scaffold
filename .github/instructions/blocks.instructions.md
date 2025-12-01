---
title: Blocks Instructions
description: Standards for WordPress block development
category: Project
type: Guide
audience: Developers
date: 2025-12-01
---

# Block Development Essentials

- Complete block.json; separate editor/front; prefer supports; i18n via `@wordpress/i18n`; efficient render callbacks.
- Use `usesInnerBlocks` and `templateLock` appropriately.
- Validate and sanitise attributes on save.
- Use variations and transforms for common starting points.

## Multi-Block Plugin Structure

- Place blocks in `src/blocks/{{slug}}-{block-name}/`
- Share components via `src/components/`
- Use custom hooks from `src/hooks/`
- Blocks are auto-registered via glob pattern

## Block Bindings

- Use Block Bindings API for dynamic field content
- Register binding source in `inc/class-block-bindings.php`
- Bind to SCF fields for dynamic content

## Related Instructions
- See also: [block-json.instructions.md](./block-json.instructions.md)
