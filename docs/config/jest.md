---
title: Jest Configuration
description: JavaScript testing framework configuration and best practices
category: Configuration
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

Jest is a JavaScript testing framework used for unit and integration tests. This plugin uses Jest with the WordPress preset for testing blocks and components.

## Configuration File

Location: `.jest.config.cjs`

## WordPress Packages Used

- `@wordpress/jest-preset-default` - ^12.35.0
- `@wordpress/babel-preset-default` - ^8.35.0

## Configuration

```javascript
module.exports = {
  ...require('@wordpress/jest-preset-default'),
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.js'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/index.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js',
  ],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['@wordpress/babel-preset-default'] }],
  },
};
```

## Key Configuration Options

### Test Environment

```javascript
testEnvironment: 'jsdom'
```

Simulates browser environment for testing React components and DOM manipulation.

### Setup Files

```javascript
setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.js']
```

Runs setup before each test file. Create `tests/setup-tests.js`:

```javascript
// Setup WordPress test utilities
import '@testing-library/jest-dom';

// Mock WordPress globals
global.wp = {
  i18n: {
    __: (text) => text,
    _n: (single, plural, number) => (number === 1 ? single : plural),
    _x: (text) => text,
  },
  data: {
    useSelect: jest.fn(),
    useDispatch: jest.fn(),
  },
  blocks: {
    registerBlockType: jest.fn(),
  },
};
```

### Module Mapping

```javascript
moduleNameMapper: {
  '\\.(css|scss)$': 'identity-obj-proxy',
}
```

Mocks CSS imports for testing.

### Coverage Configuration

```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx}',           // Include all source files
  '!src/**/*.test.{js,jsx}',     // Exclude test files
  '!src/**/index.js',            // Exclude index files
  '!**/node_modules/**',         // Exclude dependencies
  '!**/vendor/**',               // Exclude PHP vendor
]
```

### Test Patterns

```javascript
testMatch: [
  '**/tests/**/*.test.js',       // Test directory
  '**/src/**/*.test.js',         // Co-located tests
]
```

## Available Scripts

```bash
# Run all tests
npm run test:js

# Watch mode
npm run test:js:watch

# With coverage
npm run test:js -- --coverage

# Single test file
npm test -- src/{{slug}}/edit.test.js

# Update snapshots
npm test -- -u
```

## Writing Tests

### Basic Test Structure

```javascript
import { render, screen } from '@testing-library/react';
import Edit from './edit';

describe('BlockName Edit', () => {
  it('renders without crashing', () => {
    const attributes = {};
    const setAttributes = jest.fn();

    render(<Edit attributes={attributes} setAttributes={setAttributes} />);

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('updates attribute on change', () => {
    const attributes = { content: 'Initial' };
    const setAttributes = jest.fn();

    render(<Edit attributes={attributes} setAttributes={setAttributes} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated' } });

    expect(setAttributes).toHaveBeenCalledWith({ content: 'Updated' });
  });
});
```

### Testing Block Components

```javascript
import { render } from '@testing-library/react';
import { useBlockProps } from '@wordpress/block-editor';
import Edit from './edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: jest.fn(() => ({ className: 'mock-class' })),
  RichText: ({ value, onChange, placeholder }) => (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  ),
}));

describe('Edit Component', () => {
  it('uses block props', () => {
    render(<Edit attributes={{}} setAttributes={jest.fn()} />);
    expect(useBlockProps).toHaveBeenCalled();
  });
});
```

### Testing with WordPress APIs

```javascript
import { useSelect } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
  useSelect: jest.fn(),
}));

describe('Block with data', () => {
  it('fetches posts', () => {
    useSelect.mockImplementation((callback) =>
      callback(() => ({
        getEntityRecords: () => [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' },
        ],
      }))
    );

    // Test component that uses posts
  });
});
```

### Snapshot Testing

```javascript
import { render } from '@testing-library/react';
import Save from './save';

describe('Save Component', () => {
  it('matches snapshot', () => {
    const attributes = {
      content: 'Test content',
      alignment: 'center',
    };

    const { container } = render(<Save attributes={attributes} />);
    expect(container).toMatchSnapshot();
  });
});
```

## Customization

### Custom Matchers

```javascript
// tests/setup-tests.js
expect.extend({
  toBeValidBlock(received) {
    const pass = received.name && received.attributes;
    return {
      pass,
      message: () => `Expected ${received} to be a valid block`,
    };
  },
});
```

### Module Aliases

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@blocks/(.*)$': '<rootDir>/src/{{slug}}/$1',
  '\\.(css|scss)$': 'identity-obj-proxy',
}
```

## Coverage Reports

### Generate Coverage

```bash
npm test -- --coverage
```

### View HTML Report

```bash
open coverage/index.html
```

### Coverage Thresholds

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## Debugging Tests

### Single Test

```bash
npm test -- --testNamePattern="renders correctly"
```

### VS Code Debugging

`.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Verbose Output

```bash
npm test -- --verbose
```

## Common Issues

### Module Not Found

**Solution**: Add to moduleNameMapper:

```javascript
moduleNameMapper: {
  '^@wordpress/(.*)$': '<rootDir>/node_modules/@wordpress/$1',
}
```

### React Hooks Errors

**Solution**: Ensure React version matches:

```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks
```

### Timeout Errors

**Solution**: Increase timeout:

```javascript
jest.setTimeout(10000);
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Best Practices

1. **Test Behavior**: Test what users see and interact with
2. **Mock WordPress APIs**: Use jest.mock for @wordpress packages
3. **Use Testing Library**: Prefer @testing-library/react queries
4. **Avoid Implementation Details**: Don't test internal state
5. **Coverage Goals**: Aim for 70%+ coverage
6. **Co-locate Tests**: Keep tests near components
7. **Setup File**: Use for common mocks and utilities
8. **Snapshots Sparingly**: Use for stable UI, not logic

## Resources

- [Jest Official Documentation](https://jestjs.io/)
- [WordPress Jest Preset](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-jest-preset-default/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Jest DOM](https://github.com/testing-library/jest-dom)
- [WordPress Block Testing](https://developer.wordpress.org/block-editor/contributors/develop/testing-overview/)
