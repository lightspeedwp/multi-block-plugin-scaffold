---
title: Custom React Hooks
description: Reusable React hooks for data fetching and UI logic
category: Development
date: 2025-01-20
---

# Custom React Hooks

Hooks that wrap common data lookups and behaviours for the blocks (queries, taxonomies, SCF fields, sliders, repeaters).

## Data flow

```mermaid
flowchart LR
    Block[Block edit/save] --> Hooks
    Hooks --> WPData[@wordpress/data selectors]
    Hooks --> SCF[SCF/meta fields]
    WPData --> Hooks
    SCF --> Hooks
    Hooks --> UI[Components]

    classDef node fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class Hooks,WPData,SCF,UI,Block node;
```

## Current hooks

Exported via `src/hooks/index.js`:

- `usePostType` – Loads post type records
- `useTaxonomies` – Fetches taxonomies for the CPT
- `useFields` – Retrieves SCF/meta fields for a post
- `useRepeater` – Manages repeater field state
- `useSlider` – Slider autoplay/navigation helpers
- `useCollection` – Query + filter logic for collection listings

## Usage

```javascript
import { useCollection, useFields } from '../../hooks';

export default function Edit( { context } ) {
    const { items, isLoading } = useCollection( context?.postId );
    const { fields } = useFields( context?.postId );

    if ( isLoading ) return <p>Loading…</p>;

    return <pre>{ JSON.stringify( { items, fields }, null, 2 ) }</pre>;
}
```

## Guidelines

- Prefix with `use` and follow hook rules; keep side effects contained.
- Memoise expensive selectors and declare hook dependencies explicitly.
- Return objects (not arrays) for clarity when there are multiple values.
- Add unit coverage in `tests/js/hooks.test.js` when adding new hooks.
