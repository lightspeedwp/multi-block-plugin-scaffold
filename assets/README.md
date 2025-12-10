---
title: Assets
description: Documentation and marketing assets (not shipped in plugin ZIP)
audience: Developers
category: Documentation
date: 2025-01-20
---

# Plugin Assets

Static assets used for documentation, demos, or marketing. These are **not bundled** into the distributed plugin.

## Flow

```mermaid
flowchart LR
    Assets[assets/*] --> Docs[Documentation & marketing]
    Assets -.excluded.-> Zip[Plugin ZIP]

    classDef node fill:#f3e5f5,stroke:#8e24aa,color:#4a148c;
    class Assets,Docs,Zip node;
```

## Current contents

- Placeholder directory only (no tracked assets yet).

## Recommendations

- Use optimised SVG/PNG for logos and diagrams; prefer web-friendly sizes.
- Keep animated GIF/MP4 demos short and under version control if small; otherwise reference from external storage.
- For WordPress.org banners/icons, use `.wordpress-org/` instead.
