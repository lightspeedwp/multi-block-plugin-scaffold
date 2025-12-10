---
title: SCSS Styles
description: Global and shared SCSS for frontend and editor styling
category: Development
date: 2025-01-20
---

# SCSS Styles

Global and shared SCSS used by all blocks. Entry points are compiled by `@wordpress/scripts` into frontend and editor bundles.

## Style layers

```mermaid
flowchart TB
    Global[style.scss<br/>frontend + shared] --> Bundle[build/style.css]
    Editor[editor.scss<br/>editor-only] --> BundleEditor[build/editor.css]
    Slider[_slider.scss<br/>shared slider partial] --> Global
    Slider --> Editor

    classDef node fill:#f3e5f5,stroke:#8e24aa,color:#4a148c;
    class Global,Editor,Slider,Bundle,BundleEditor node;
```

## Files (current)

- `style.scss` – Frontend and shared styles across blocks
- `editor.scss` – Block editor-only styles
- `_slider.scss` – Shared slider helpers imported where needed

## Usage

Import the partials from block styles as needed:

```scss
@import '../../scss/slider';

.{{slug}}-slider {
    @include slider-wrapper;
}
```

## Guidelines

- Keep variables and mixins within partials to avoid repetition in blocks.
- Use BEM-inspired class naming and mobile-first breakpoints.
- Scope editor-only styles to block selectors to avoid bleeding into wp-admin.
- Update this README when adding new shared partials.
