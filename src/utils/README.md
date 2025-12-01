---
title: Utility Functions
description: JavaScript utility functions and helpers
category: Development
date: 2025-12-01
---

# Utility Functions

JavaScript utility functions and helper modules used across blocks.

## Overview

This directory contains pure JavaScript utility functions for common operations like formatting, validation, and data transformation.

## Usage

```javascript
import { formatDate, sanitizeInput } from '../../utils';

const formatted = formatDate( new Date() );
const clean = sanitizeInput( userInput );
```

## Utility Guidelines

1. **Pure functions** - No side effects
2. **Single responsibility** - One function, one task
3. **Type safety** - Document parameters and return types
4. **Error handling** - Handle edge cases gracefully
5. **Testing** - Write comprehensive unit tests

## Example Utility

```javascript
/**
 * Formats a date string.
 *
 * @param {Date} date The date to format.
 * @return {string} Formatted date string.
 */
export function formatDate( date ) {
    return new Intl.DateTimeFormat( 'en-GB' ).format( date );
}
```

## References

- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Lodash](https://lodash.com/) - Utility library reference
