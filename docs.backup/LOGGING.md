---
title: Logging Guide
description: Comprehensive logging implementation for tests, workflows, and agents
category: Development
type: Guide
audience: Developers
date: 2025-12-07
---

# Logging Guide

This document outlines the comprehensive logging solution implemented across all tests, workflows, and agents in the Multi-Block Plugin Scaffold.

## Overview

All logging follows a consistent structure:

- **Location**: All logs stored in `logs/` directory at repository root
- **Format**: Timestamped filenames with source and type identifiers
- **Levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **Rotation**: Manual cleanup (not automatic)
- **Exclusions**: Excluded from Git and distribution

## Log File Naming Convention

```text
<source>-<type>-<timestamp>.log
```

### Examples

- `test-unit-2025-12-07T10-30-00.log`
- `test-e2e-2025-12-07T14-15-30.log`
- `test-phpunit-2025-12-07T09-00-00.log`
- `build-webpack-2025-12-07T11-20-00.log`
- `agent-scaffold-generator-2025-12-07T16-45-00.log`
- `workflow-ci-cd-2025-12-07T08-30-00.log`
- `lint-js-2025-12-07T13-15-00.log`

## Log Levels

Use standard log levels consistently:

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | Failures, exceptions, critical issues | Test failures, build errors, fatal exceptions |
| **WARN** | Warnings, deprecations, potential issues | Deprecated usage, missing optional dependencies |
| **INFO** | General information, progress | Test start/completion, build stages |
| **DEBUG** | Detailed debugging information | Variable values, function calls |
| **TRACE** | Very verbose tracing | Step-by-step execution flow |

## JavaScript/Jest Logging

### Implementation

All Jest tests automatically log to `logs/` directory:

```javascript
// tests/setup-tests.js
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `test-unit-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

// Make globally available
global.testLog = log;

// Log at start
beforeAll(() => {
  log('INFO', 'Jest test suite starting');
  log('INFO', `Node version: ${process.version}`);
  log('INFO', `Working directory: ${process.cwd()}`);
});

// Log at end and close
afterAll(() => {
  log('INFO', 'Jest test suite completed');
  logStream.end();
});
```

### Usage in Tests

```javascript
describe('Component Tests', () => {
  it('renders correctly', () => {
    testLog('INFO', 'Testing component render');

    const result = render(<Component />);

    if (result) {
      testLog('DEBUG', 'Component rendered successfully');
    } else {
      testLog('ERROR', 'Component failed to render');
    }

    expect(result).toBeDefined();
  });
});
```

## PHP/PHPUnit Logging

### Implementation

All PHPUnit tests automatically log to `logs/` directory:

```php
<?php
// tests/bootstrap.php

// Create logs directory
$logsDir = __DIR__ . '/../logs';
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0755, true);
}

// Create log file with timestamp
$timestamp = date('Y-m-d\TH-i-s');
$logFile = $logsDir . "/test-phpunit-{$timestamp}.log";

// Define global log function
function test_log($level, $message) {
    global $logFile;
    $entry = sprintf(
        "[%s] [%s] %s\n",
        date('c'),
        $level,
        $message
    );
    file_put_contents($logFile, $entry, FILE_APPEND);
    echo $entry;
}

// Log bootstrap start
test_log('INFO', 'PHPUnit bootstrap starting');
test_log('INFO', 'PHP version: ' . PHP_VERSION);
test_log('INFO', 'Working directory: ' . getcwd());
```

### Usage in Tests

```php
<?php
class ExampleTest extends WP_UnitTestCase {
    public function test_example() {
        test_log('INFO', 'Testing example function');

        $result = example_function();

        if ($result) {
            test_log('DEBUG', 'Function returned expected value');
        } else {
            test_log('ERROR', 'Function returned unexpected value');
        }

        $this->assertTrue($result);
    }
}
```

## E2E/Playwright Logging

### Implementation

E2E tests log to dedicated files:

```javascript
// tests/e2e/setup.js
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `test-e2e-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Export log function
export function e2eLog(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

// Cleanup
process.on('exit', () => {
  logStream.end();
});
```

### Usage in Tests

```javascript
import { test, expect } from '@playwright/test';
import { e2eLog } from './setup';

test.describe('Homepage Tests', () => {
  test('loads successfully', async ({ page }) => {
    e2eLog('INFO', 'Testing homepage load');

    await page.goto('/');

    e2eLog('DEBUG', `Current URL: ${page.url()}`);

    const title = await page.title();
    e2eLog('INFO', `Page title: ${title}`);

    expect(title).toBeTruthy();
  });
});
```

## Agent Logging

### Implementation

All agents log their execution:

```javascript
// .github/agents/scaffold-generator.agent.js
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `agent-scaffold-generator-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function agentLog(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

// Log at start
agentLog('INFO', 'Scaffold generator agent starting');
agentLog('INFO', `Node version: ${process.version}`);

// Use throughout agent
agentLog('INFO', 'Gathering plugin requirements...');
agentLog('DEBUG', 'User input: ' + JSON.stringify(input));
agentLog('WARN', 'Using default value for missing field');
agentLog('ERROR', 'Validation failed: ' + error.message);

// Cleanup
process.on('exit', () => {
  agentLog('INFO', 'Agent execution completed');
  logStream.end();
});
```

## Workflow Logging

### GitHub Actions Integration

Workflows automatically create logs for CI/CD runs:

```yaml
# .github/workflows/ci-cd.yml
jobs:
  lint-and-test:
    steps:
      - name: Setup logging
        run: |
          mkdir -p logs
          echo "[$(date -Iseconds)] [INFO] CI/CD workflow starting" >> logs/workflow-ci-cd-$(date +%Y-%m-%dT%H-%M-%S).log

      - name: Run tests with logging
        run: |
          npm run test:unit 2>&1 | tee -a logs/workflow-ci-cd-*.log

      - name: Upload logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: workflow-logs
          path: logs/
```

## Build Process Logging

### Webpack Logging

Build processes log to dedicated files:

```javascript
// bin/build.js
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `build-webpack-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function buildLog(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

// Use throughout build
buildLog('INFO', 'Build process starting');
buildLog('INFO', 'Running webpack...');
buildLog('DEBUG', 'Config: ' + JSON.stringify(config));
buildLog('INFO', 'Build completed successfully');
```

## Dry Run Logging

Dry run tests log to dedicated files:

```javascript
// bin/dry-run-test.js
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(__dirname, '../logs', `dry-run-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function dryRunLog(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

dryRunLog('INFO', 'Dry run test starting');
dryRunLog('INFO', 'Found X files with mustache variables');
dryRunLog('INFO', 'Creating backups...');
dryRunLog('INFO', 'Running tests...');
dryRunLog('INFO', 'Restoring files...');
```

## Log Management

### Viewing Logs

```bash
# View latest log
tail -f logs/*.log

# View specific log type
tail -f logs/test-unit-*.log

# Search logs for errors
grep "ERROR" logs/*.log

# Count warnings
grep -c "WARN" logs/*.log
```

### Cleaning Logs

```bash
# Remove logs older than 7 days
find logs/ -name "*.log" -mtime +7 -delete

# Remove all logs
rm -rf logs/*.log

# Remove logs by type
rm logs/test-unit-*.log
```

### Log Rotation Script

```bash
#!/bin/bash
# bin/rotate-logs.sh

# Keep logs for 7 days
DAYS=7

echo "Rotating logs older than $DAYS days..."

# Count files before
BEFORE=$(find logs/ -name "*.log" | wc -l)

# Remove old logs
find logs/ -name "*.log" -mtime +$DAYS -delete

# Count files after
AFTER=$(find logs/ -name "*.log" | wc -l)

REMOVED=$((BEFORE - AFTER))
echo "Removed $REMOVED log files"
echo "Remaining: $AFTER log files"
```

## Best Practices

### 1. Always Create Logs Directory

```javascript
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
```

### 2. Use Consistent Timestamps

```javascript
// ISO 8601 format, safe for filenames
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
// Result: 2025-12-07T10-30-00
```

### 3. Include Context

```javascript
log('INFO', 'Test starting');
log('INFO', `Environment: ${process.env.NODE_ENV}`);
log('INFO', `Node version: ${process.version}`);
```

### 4. Log Entry and Exit

```javascript
beforeAll(() => {
  log('INFO', 'Test suite starting');
});

afterAll(() => {
  log('INFO', 'Test suite completed');
  logStream.end();
});
```

### 5. Use Appropriate Levels

```javascript
// ✅ Good
log('ERROR', 'Test failed: assertion error');
log('WARN', 'Using fallback value');
log('INFO', 'Test completed');
log('DEBUG', 'Variable value: ' + JSON.stringify(value));

// ❌ Bad
log('INFO', 'FATAL ERROR!!!'); // Use ERROR level
log('DEBUG', 'Test completed'); // Use INFO level
```

### 6. Close Streams

```javascript
// Always close streams when done
process.on('exit', () => {
  logStream.end();
});

afterAll(() => {
  logStream.end();
});
```

## CI/CD Integration

### Upload Logs as Artifacts

```yaml
- name: Upload test logs
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-logs
    path: logs/
    retention-days: 7
```

### Download Logs

```bash
# From GitHub Actions UI
# 1. Go to workflow run
# 2. Scroll to Artifacts section
# 3. Download test-logs.zip

# Extract and view
unzip test-logs.zip
cat logs/test-unit-*.log
```

## Debugging with Logs

### Finding Errors

```bash
# Find all errors
grep "ERROR" logs/*.log

# Find errors in specific test
grep "ERROR" logs/test-unit-*.log

# Show context around errors
grep -A 5 -B 5 "ERROR" logs/*.log
```

### Analyzing Test Runs

```bash
# Count test runs
ls logs/test-unit-*.log | wc -l

# Find slowest tests
grep "took" logs/*.log | sort -n

# Find most common errors
grep "ERROR" logs/*.log | sort | uniq -c | sort -rn
```

## Related Documentation

- [BUILD-PROCESS.md](./BUILD-PROCESS.md) - Build process with logging
- [TESTING.md](./TESTING.md) - Testing with integrated logging
- [LINTING.md](./LINTING.md) - Linting with dry-run logging
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD logging in GitHub Actions
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance testing and logging
- [logs/README.md](../logs/README.md) - Logs directory management
- [DEVELOPMENT.md](../DEVELOPMENT.md) - Development workflow

## Summary

✅ **Consistent Location** - All logs in `logs/` directory

✅ **Standard Naming** - `<source>-<type>-<timestamp>.log`

✅ **Unified Levels** - ERROR, WARN, INFO, DEBUG, TRACE

✅ **Complete Coverage** - Tests, workflows, agents, builds

✅ **CI/CD Integration** - Automatic artifact upload

✅ **Easy Management** - Simple rotation and cleanup

This logging solution provides comprehensive visibility into all aspects of the plugin development, testing, and deployment process.
