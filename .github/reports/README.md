---
title: Reports Index
description: Point-in-time summaries and analysis documents
category: Reports
type: Index
audience: Developers
date: 2025-12-01
---


This directory contains summaries, migration reports, and analysis documents that are **point-in-time** records rather than ongoing developer documentation.

## Contents

- Migration reports - Records of dependency upgrades and migrations
- Analysis documents - Code analysis and audit reports
- Performance reports - Performance benchmarks and optimization reports

## Purpose

Reports differ from documentation in `docs/`:

- **Documentation** (`docs/`) - How to use, configure, and develop with the plugin
- **Reports** (`reports/`) - What was done, when, and why (historical records)

## Structure

- Base path: `.github/reports/`
- Categories: `analysis/`, `audits/`, `configuration/`, `consolidation/`, `implementation/`, `migration/`, `performance/`, `testing/`, `validation/`
- Archived/legacy: `.github/reports/.archived/`
- Keep the root of `.github/reports/` clean (README and explicitly required indexes only)

## Naming

Use `{CATEGORY}-{SUBJECT}-{YYYY-MM-DD}.md` (uppercase, hyphenated, date last) within the matching category directory.

**Examples**:

- `.github/reports/consolidation/CONSOLIDATION-SESSION-COMPLETION-2025-12-09.md`
- `.github/reports/audits/AUDIT-INSTRUCTION-CONSOLIDATION-2025-12-10.md`
- `.github/reports/migration/MIGRATION-TASKS-DIRECTORY-REMOVAL-2025-12-09.md`

## When to Add Reports

Add reports here when:

- Completing a major dependency migration (e.g., Stylelint 13 → 16)
- Documenting setup or configuration decisions
- Recording analysis or audit results
- Benchmarking performance changes

## Format

Reports should include:

- **Date**: When the report was created
- **Context**: What prompted the report
- **Findings**: Key information or results
- **Actions**: What was done or recommended
- **Outcome**: Results or current status
