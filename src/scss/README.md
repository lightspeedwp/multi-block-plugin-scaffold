---
title: SCSS Styles
description: Global SCSS variables, mixins, and functions
category: Development
date: 2025-12-01
---

# SCSS Styles

Global SCSS files for variables, mixins, functions, and utility styles.

## Overview

This directory contains SCSS partials that provide reusable styles, variables, and utilities across all blocks.

## File Structure

```
scss/
├── _variables.scss    # SCSS variables
├── _mixins.scss       # Reusable mixins
├── _functions.scss    # SCSS functions
└── _utilities.scss    # Utility classes
```

## Usage

Import in block SCSS files:

```scss
@import '../../scss/variables';
@import '../../scss/mixins';

.my-block {
    color: $primary-color;
    @include responsive-spacing;
}
```

## Best Practices

1. **Variables** - Define all colours, sizes, and breakpoints
2. **Mixins** - Create reusable style patterns
3. **Functions** - Calculate values programmatically
4. **BEM naming** - Use Block Element Modifier methodology
5. **Mobile-first** - Design for small screens, enhance for large

## References

- [Sass Documentation](https://sass-lang.com/documentation/)
- [BEM Methodology](https://getbem.com/)
