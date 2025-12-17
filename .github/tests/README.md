
# Test Configuration Files

This directory contains centralized test configuration and helper files for the multi-block-plugin-scaffold project.

## Files

### `setup-tests.js`

Jest setup file that runs after the test framework is initialized (`setupFilesAfterEnv`).

**Purpose:** Configure Jest globals, timeouts, environment variables, and mock console output.

### `test-logger.js`

Test logging utilities providing both in-memory and file-based loggers.

**Exports:** `InMemoryTestLogger`, `FileLogger`, `createTestLogger(processName, options)`

### `test-utils.js`

Shared test utility functions for DOM manipulation, async operations, and test data generation.

**Exports:** `waitFor`, `createMockElement`, `generateTestPluginConfig`, `generateTestBlockConfig`, `createMockFs`, `suppressConsole`, `spyOnConsole`

### `test-helper.js`

Unified entry point that re-exports all utilities from `test-logger.js` and `test-utils.js`.

**Usage:**

```javascript
const {
    createTestLogger,
    waitFor,
    generateTestPluginConfig,
    spyOnConsole
} = require('../../.github/tests/test-helper');
```

## Mocks and Test Doubles

Mocks and test doubles are used to isolate unit tests from external dependencies (e.g., file system, network, or WordPress APIs). This ensures tests are deterministic, fast, and reliable.

### Location

- **.github/tests/mocks/**: Place reusable mock modules, fixtures, and test doubles here.
- **scripts/lib/**tests**/**: Use inline mocks for simple cases, or import from `.github/tests/mocks/` for shared logic.
- **scripts/fixtures/**: Use for static JSON or config fixtures, not for code mocks.

### Usage Patterns

- Use `jest.mock()` to mock Node.js modules (e.g., `fs`, `path`) or project utilities.
- For complex mocks, create a file in `.github/tests/mocks/` and import it in your test.
- Prefer explicit, minimal mocks over global overrides.
- Document any non-obvious mocking logic with comments in the test file.

#### Example

```js
// In a test file
jest.mock('fs', () => ({
 readFileSync: jest.fn(() => '{ "mock": true }'),
 writeFileSync: jest.fn(),
}));

// Or import a shared mock
describe('MyModule', () => {
 require('../../.github/tests/mocks/fs-mock');
 // ...tests...
});
```

### Best Practices

- Clean up mocks after each test using `jest.resetAllMocks()` or `afterEach()`.
- Avoid leaking state between tests.
- Use fixtures for static data, mocks for behaviour.
- Keep mocks up to date with real APIs.

### See Also

- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Jest Manual Mocks](https://jestjs.io/docs/manual-mocks)
