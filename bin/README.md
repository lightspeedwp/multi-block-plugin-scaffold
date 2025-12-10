---
title: Shell Scripts & System Utilities
description: Bash scripts for environment setup and CI helpers
category: Development
type: Directory Index
audience: Developers
date: 2025-01-20
---

# Shell Scripts & System Utilities

Bash utilities for system-level tasks (test environment setup, CI helpers). Keep shell scripts here; JavaScript automation belongs in `scripts/`.

## Flow

```mermaid
flowchart LR
    Script[bin/install-wp-tests.sh] --> WPTests[WordPress test suite]
    WPTests --> PHPUnit[PHPUnit integration]
    PHPUnit --> CI[CI/E2E pipelines]

    classDef node fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    class Script,WPTests,PHPUnit,CI node;
```

## Current script

- `install-wp-tests.sh` – Downloads the WordPress test suite and prepares the test database for PHPUnit.

**Usage:**

```bash
bash bin/install-wp-tests.sh <db-name> <db-user> <db-pass> [db-host] [wp-version]
```

Example:

```bash
bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
```

## Creating new shell scripts

1. Add the script under `bin/` with a `.sh` extension and `#!/usr/bin/env bash` shebang.
2. Make it executable (`chmod +x`).
3. Include `set -euo pipefail` and clear usage/help output.
4. Keep configuration via environment variables or arguments; avoid hard-coded paths.
5. Document the new script here and add tests or CI usage notes when relevant.
