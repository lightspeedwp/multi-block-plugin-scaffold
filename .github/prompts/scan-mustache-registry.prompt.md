---
title: "Initiate Mustache Variable Registry Scan"
description: "Prompt for running a new scan and updating the mustache variable registry with wizard support."
category: "registry"
date: 2025-12-18
---

# Mustache Variable Registry Scan Wizard

You are about to run a full scan of the repository for mustache template variables.

**This process will:**

- Discover all `{{mustache}}` placeholders in source, config, and docs.
- Compare results to the current registry.
- Identify undocumented, unused, or changed variables.
- Guide you through reviewing and updating the registry.

## Steps

1. **Scan**: Run the scan to auto-discover all variables.
2. **Review**: For each new or changed variable, the wizard will prompt you to:
   - Confirm or edit the variable name.
   - Assign a type and category.
   - Add a description and example value.
3. **Validate**: The wizard will validate the updated registry against the schema.
4. **Diff & Report**: Optionally, generate a diff/markdown report for review or PRs.
5. **Save**: Confirm and write the updated registry.

## Usage

Run:

```sh
npm run scan:mustache-registry
```

Or, for wizard mode:

```sh
npm run scan:mustache-registry -- --wizard
```

---

**Tip:** Use the wizard to ensure all variables are well-documented and categorized for future maintainers.
