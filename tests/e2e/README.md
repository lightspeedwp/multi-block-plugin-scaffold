---
title: End-to-End Tests
description: Playwright specs covering editor and frontend flows
category: Testing
date: 2025-01-20
---

# End-to-End Tests

Playwright-based browser tests that exercise full user workflows across editor and frontend.

## Coverage map

```mermaid
flowchart TB
    Setup[tests/e2e/setup.js] --> Blocks[blocks.spec.js]
    Setup --> Collection[collection.spec.js]
    Setup --> Slider[slider.spec.js]
    Setup --> PostType[post-type.spec.js]
    Blocks --> Editor[Editor interactions]
    Collection --> Frontend[Frontend rendering]
    Slider --> Frontend
    PostType --> Admin[Admin CPT flows]

    classDef node fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class Setup,Blocks,Collection,Slider,PostType,Editor,Frontend,Admin node;
```

## Running tests

```bash
npm run test:e2e           # Full suite via wp-scripts test-e2e
npm run test:e2e:a11y      # Accessibility-focused spec (see package.json)
```

Use `-- --grep "text"` to target a single scenario, or append `-- --headed`/`-- --debug` for interactive debugging.

## Writing tests

- Use stable selectors (data attributes) instead of class names.
- Keep tests isolated; create and clean up data per spec.
- Prefer the helpers provided by `@wordpress/e2e-test-utils-playwright`.
- Mirror new block behaviours with matching E2E assertions.
