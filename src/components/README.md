---
title: React Components
description: Shared React components used across blocks
category: Development
date: 2025-12-01
---

# React Components

Reusable React components shared across multiple blocks.

## Overview

This directory contains shared React components that can be imported and used in any block's `edit.js` or other components.

## Usage

```javascript
import { MyComponent } from '../../components/MyComponent';

export default function Edit() {
    return <MyComponent />;
}
```

## Component Guidelines

1. **Single responsibility** - One component, one purpose
2. **PropTypes** - Document expected props
3. **Reusability** - Design for reuse across blocks
4. **Composition** - Build complex UIs from simple components
5. **Testing** - Write unit tests for components

## Example Component

```javascript
/**
 * Example reusable component.
 *
 * @param {Object} props Component props.
 * @param {string} props.title The title to display.
 * @return {Element} Component element.
 */
export function ExampleComponent( { title } ) {
    return <h2>{title}</h2>;
}
```

## References

- [React Documentation](https://react.dev/)
- [@wordpress/components](https://developer.wordpress.org/block-editor/reference-guides/components/)
