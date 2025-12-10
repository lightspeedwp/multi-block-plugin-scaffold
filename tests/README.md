---
title: Plugin Tests
description: Test suites for JavaScript, PHP, and Playwright, plus fixtures and mocks
category: Development
date: 2025-01-20
---

# Plugin Tests

Full test suite covering JavaScript, PHP, and end-to-end behaviour. Bootstrap files and fixtures live here alongside the tests.

## Test matrix

```mermaid
flowchart TB
    JS[tests/js/*<br/>Jest] --> UnitCmd[`npm run test:unit`]
    PHP[tests/php/*<br/>PHPUnit] --> PHPCmd[`composer test` / `npm run test:php`]
    E2E[tests/e2e/*<br/>Playwright via wp-scripts] --> E2ECmd[`npm run test:e2e`]
    Fixtures[fixtures/*] --> JS
    Fixtures --> PHP
    Mocks[__mocks__/*] --> JS

    classDef node fill:#e3f2fd,stroke:#1565c0,color:#0d47a1;
    class JS,PHP,E2E,Fixtures,Mocks,UnitCmd,PHPCmd,E2ECmd node;
```

## Structure (current)

```
tests/
├── __mocks__/            # Jest mocks
├── agents/               # Agent validation placeholder
├── e2e/                  # Playwright specs + setup
├── fixtures/             # Shared fixtures
├── js/                   # JS unit tests
├── php/                  # PHPUnit tests
├── bootstrap.php         # PHPUnit bootstrap
├── phpstan-bootstrap.php # PHPStan bootstrap
└── setup-tests.js        # Jest setup
```

## Commands

```bash
npm run test:unit    # JS unit tests (Jest)
npm run test:e2e     # Playwright E2E suite
npm run test         # JS unit + E2E
composer test        # PHPUnit suite
npm run test:php     # PHPUnit via npm script
npm run test:scf     # SCF-focused PHPUnit tests
```

## Notes

- Use fixtures for repeatable data; avoid hitting external services.
- Keep selectors stable in E2E tests (`data-testid` over class names).
- Update this README and subdirectory READMEs when adding new test types or tooling.
