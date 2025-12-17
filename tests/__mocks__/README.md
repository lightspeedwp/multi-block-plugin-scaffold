# Jest Mocks

This directory contains Jest mock files for the multi-block-plugin-scaffold project.

## Purpose

Mocks isolate unit tests from external dependencies (file system, assets, WordPress APIs) to ensure tests are:

- **Deterministic**: Same result every time
- **Fast**: No real I/O operations
- **Reliable**: No network or external dependencies

## Files

### `fileMock.js`

Mocks file imports (images, fonts, etc.) in Jest tests.

**Usage:** Configured in `jest.config.js` via `moduleNameMapper`:

```javascript
moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js',
}
```

When tests import image files, they receive a mock string instead of the actual file.

### `styleMock.js`

Mocks CSS/SCSS imports in Jest tests.

**Usage:** Configured in `jest.config.js` via `moduleNameMapper`:

```javascript
moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
}
```

CSS imports return an empty object, preventing style-loader errors in tests.

### `verify-mocks.js` & `verify-mocks.test.js`

Validation script and tests to ensure mocks are correctly configured.

**Purpose:**

- Verify mock files exist and are properly exported
- Test that moduleNameMapper configuration works
- Ensure mocks don't break when upgrading dependencies

**Usage:**

```bash
npm run test:js tests/__mocks__/verify-mocks.test.js
```

## Adding New Mocks

### When to Add Mocks

Add mocks when tests encounter:

- File system operations (use `createMockFs` from `.github/tests/test-utils.js`)
- External API calls (mock fetch, axios, etc.)
- WordPress-specific APIs (@wordpress/data, @wordpress/blocks)
- Large dependencies that slow down tests

### How to Add Mocks

1. **Create mock file** in `tests/__mocks__/`

```javascript
// tests/__mocks__/apiMock.js
module.exports = {
    fetchData: jest.fn(() => Promise.resolve({ data: 'mock' })),
    postData: jest.fn(() => Promise.resolve({ success: true })),
};
```

2. **Use in tests**

```javascript
// Option 1: Manual mock in test file
jest.mock('../../lib/api', () => require('../__mocks__/apiMock'));

// Option 2: Automatic mock (if file structure matches)
// Place mock at: tests/__mocks__/lib/api.js
jest.mock('../../lib/api'); // Auto-discovers mock
```

3. **Clean up after tests**

```javascript
afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});
```

## Best Practices

### 1. Keep Mocks Simple

Mocks should return predictable data, not replicate complex logic:

```javascript
// ✅ Good: Simple, predictable
const mockFs = {
    readFileSync: jest.fn(() => '{"test": true}'),
};

// ❌ Bad: Too complex
const mockFs = {
    readFileSync: jest.fn((path) => {
        // Complex file system logic...
    }),
};
```

### 2. Mock at the Right Level

- **Unit tests**: Mock external dependencies
- **Integration tests**: Use real dependencies when possible
- **E2E tests**: No mocks (use real services)

### 3. Keep Mocks Updated

When real APIs change, update corresponding mocks to match:

```javascript
// If real API adds new method:
// Real: api.deleteData(id)
// Mock should also have:
mockApi.deleteData = jest.fn(() => Promise.resolve({ deleted: true }));
```

### 4. Avoid Global Mocks

Prefer explicit mocking in test files over global mocks:

```javascript
// ✅ Good: Explicit per test
test('handles API error', () => {
    const mockApi = require('../__mocks__/apiMock');
    mockApi.fetchData.mockRejectedValue(new Error('Network error'));
    // ... test code
});

// ❌ Bad: Global state can leak between tests
```

### 5. Document Mock Behavior

Add comments explaining what the mock does:

```javascript
/**
 * Mock WordPress @wordpress/data module
 * Returns empty arrays for selectors by default
 */
module.exports = {
    useSelect: jest.fn(() => []),
    useDispatch: jest.fn(() => ({})),
};
```

## Common Mocking Patterns

### Mock Node.js Modules

```javascript
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    existsSync: jest.fn(() => true),
}));
```

### Mock WordPress Packages

```javascript
jest.mock('@wordpress/blocks', () => ({
    registerBlockType: jest.fn(),
    getBlockTypes: jest.fn(() => []),
}));
```

### Mock Async Functions

```javascript
const mockAsyncFn = jest.fn(() => Promise.resolve('data'));
// Or with error:
mockAsyncFn.mockRejectedValue(new Error('Failed'));
```

### Partial Mocks

```javascript
jest.mock('../../lib/utils', () => ({
    ...jest.requireActual('../../lib/utils'), // Keep real functions
    specificFunction: jest.fn(), // Mock only this one
}));
```

## Troubleshooting

### Mock Not Working

1. Check `moduleNameMapper` in `jest.config.js`
2. Ensure mock file path is correct
3. Verify mock is called before import: `jest.mock()` must be hoisted
4. Clear module cache: `jest.resetModules()`

### Tests Failing After Adding Mock

1. Check mock return values match expected types
2. Ensure mock implements all required methods
3. Verify no typos in method names
4. Check mock is properly cleaned up in `afterEach`

### Mock Leaking Between Tests

Always clean up mocks:

```javascript
afterEach(() => {
    jest.clearAllMocks(); // Clear call history
    jest.resetModules();  // Reset module cache
});
```

## Resources

- [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Jest moduleNameMapper](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring)
- [.github/instructions/jest-tests.instructions.md](../../.github/instructions/jest-tests.instructions.md)
