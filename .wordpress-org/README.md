---
title: WordPress.org Assets
description: WordPress plugin directory assets
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

# WordPress.org Assets

This directory contains assets for the WordPress.org plugin directory.

## Required Files

| File | Size | Required | Description |
|------|------|----------|-------------|
| `banner-772x250.png` | 772×250 | Yes | Small banner for plugin page |
| `banner-1544x500.png` | 1544×500 | Recommended | Retina banner |
| `icon-256x256.png` | 256×256 | Yes | Plugin icon |
| `icon-128x128.png` | 128×128 | Recommended | Small icon |
| `screenshot-1.png` | Any | Optional | Screenshots (numbered) |

## Screenshot Guidelines

- Name screenshots sequentially: `screenshot-1.png`, `screenshot-2.png`, etc.
- Add descriptions in `readme.txt` under `== Screenshots ==`
- Maximum recommended width: 1200px
- Use PNG format for quality

## Deployment

These assets are automatically deployed to WordPress.org via the `deploy-wporg.yml` workflow:

1. Create a GitHub release
2. Workflow copies assets to SVN `/assets/` directory
3. Assets appear on plugin page

## Manual Deployment

```bash
# Checkout SVN assets directory
svn checkout https://plugins.svn.wordpress.org/{{slug}}/assets wporg-assets

# Copy assets
cp .wordpress-org/* wporg-assets/

# Commit
cd wporg-assets
svn add *.png 2>/dev/null
svn commit -m "Update plugin assets"
```

## Asset Guidelines

- Use PNG format for all images
- Optimize images for web (TinyPNG, ImageOptim)
- Keep file sizes under 1MB each
- Use consistent branding across all assets

## Related Documentation

- [WordPress Plugin Assets](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)
- [Plugin Headers](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/)
