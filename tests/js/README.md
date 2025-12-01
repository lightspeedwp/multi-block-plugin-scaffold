---
title: JavaScript Unit Tests
description: Jest tests for React components, hooks, and utilities
category: Testing
date: 2025-12-01
---

# JavaScript Unit Tests

Jest-based unit tests for JavaScript code, React components, hooks, and utilities.

## Overview

JavaScript tests validate individual units of code in isolation using Jest and React Testing Library.

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Test Coverage

- ✅ React components
- ✅ Custom hooks
- ✅ Utility functions
- ✅ Block edit components
- ✅ Block save functions

## Writing Tests

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe( 'MyComponent', () => {
    test( 'renders with props', () => {
        render( <MyComponent title="Test" /> );
        expect( screen.getByText( 'Test' ) ).toBeInTheDocument();
    } );
} );
```

## Best Practices

1. **Test behaviour** - Test what users see/do
2. **Avoid implementation details** - Don't test internal state
3. **Use queries** - Prefer getByRole, getByLabelText
4. **Mock externals** - Mock API calls and WordPress functions
5. **Snapshot sparingly** - Use snapshots only when appropriate

## References

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [@wordpress/jest-preset-default](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-jest-preset-default/)
