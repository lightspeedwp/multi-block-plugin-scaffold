---
description: Interactive reporting system for analysis, migrations, audits, and consolidation documentation
---

# Report Generation System

I'll help you create well-structured reports stored in the `reports/` directory. All reports follow consistent naming, formatting, and metadata standards.

## What is a Report?

A report is a **point-in-time documentation** of:

- **Analysis**: Code quality audits, security findings, performance analysis
- **Migrations**: Tool/version upgrades, configuration changes, structural updates
- **Performance**: Benchmarks, optimization results, testing findings
- **Consolidation**: Documentation restructuring, file organization changes
- **Validation**: Testing results, compliance checks, verification reports

Key difference from documentation:
- **Reports**: Historical record of what was done, when, and why
- **Documentation** (`docs/`): How to use and develop with the project

## Quick Start

### What kind of report do you need?

1. **Analysis Report** - Audit, code quality, security analysis
2. **Migration Report** - Tool/version upgrade documentation
3. **Performance Report** - Benchmark results, optimization findings
4. **Consolidation Report** - Organizational changes, documentation restructuring
5. **Validation Report** - Testing results, verification findings

---

## Report Types & Templates

### Analysis Reports

**Use when**: Conducting code audits, security analysis, quality assessments

**Location**: `reports/ANALYSIS-{focus}-{date}.md`

**Information needed**:
- What was analyzed? (code section, security domain, performance area)
- Why was analysis needed?
- Key findings organized by category
- Recommendations for improvement

**Example**: "ANALYSIS-SECURITY-AUDIT-2025-12-07.md"

### Migration Reports

**Use when**: Upgrading tools, updating dependencies, changing configurations

**Location**: `reports/{TOOL}-MIGRATION-{from}-{to}.md`

**Information needed**:
- Which tool/library was upgraded?
- From version → To version
- What breaking changes occurred?
- What code changes were needed?
- How was the migration tested?

**Example**: "STYLELINT-MIGRATION-13-16.md"

### Performance Reports

**Use when**: Running benchmarks, optimizing build size, improving test speed

**Location**: `reports/PERFORMANCE-{focus}-{date}.md`

**Information needed**:
- What was being benchmarked?
- Current vs baseline measurements
- Performance improvements/regressions
- Recommendations for further optimization

**Example**: "PERFORMANCE-BUILD-SIZE-2025-12-07.md"

### Consolidation Reports

**Use when**: Reorganizing documentation, consolidating files, restructuring projects

**Location**: `reports/{OPERATION}-SUMMARY.md`

**Information needed**:
- What was consolidated/reorganized?
- Why was the change made?
- What was merged/moved/deleted?
- Impact of changes
- Files affected

**Example**: "CONSOLIDATION-SUMMARY.md"

### Validation Reports

**Use when**: Testing configurations, verifying template replacements, compliance checks

**Location**: `reports/{PROJECT}-VALIDATION-REPORT.md`

**Information needed**:
- What was being validated?
- Validation criteria
- Test results
- Any issues found
- Recommendations

**Example**: "LINK-VALIDATION-REPORT.md"

---

## Report Structure

All reports should follow this organization:

### 1. Frontmatter (Required)

```yaml
---
title: Human-readable report title
description: One sentence summary
category: Analysis|Migration|Performance|Consolidation|Validation
type: Report
audience: Developers|DevOps|QA|All
date: YYYY-MM-DD
context: Why this report was created
tool: tool-name (if applicable)
from_version: x.y.z (if migration)
to_version: x.y.z (if migration)
---
```

### 2. Executive Summary

Brief overview for quick scanning:

```markdown
## Executive Summary

**Status**: ✅ Completed / ⚠️ Findings / ❌ Critical Issues

**Key Finding**: Most important discovery

**Impact**: What this means for the project

**Action Required**: Yes/No - list specific actions if needed
```

### 3. Context/Methodology

Explain the background:

```markdown
## Context

Why this report was created, what triggered it, related work

## Methodology

How the analysis/test was conducted, tools used, scope
```

### 4. Findings/Results

Organized main content:

```markdown
## Findings

### Category 1
- Finding A
- Finding B

### Category 2
- Finding C with details
- Finding D with details
```

### 5. Recommendations

Actionable suggestions:

```markdown
## Recommendations

1. Specific action with reasoning
2. Another action with priority level
3. Optional action for future consideration
```

### 6. Related Files

Reference supporting documentation:

```markdown
## Related Files

- [logs/analysis-tool-2025-12-07T10-30-00.log](../logs/) - Execution log
- [tmp/reports/analysis/2025-12-07/](../tmp/) - Analysis artifacts
- [PR #123](https://github.com/owner/repo/pull/123) - Related PR
```

---

## Integration with Logs and Temp

### Supporting Logs

When creating a report from analysis:

**Logs are stored in**: `logs/{source}-{type}-{timestamp}.log`

**Include in report**:
```markdown
- [logs/migration-stylelint-2025-12-07T10-30-00.log](../logs/)
```

### Temporary Artifacts

For complex analysis, use `tmp/reports/`:

**Location**: `tmp/reports/{type}/{date}/`

**Subdirectories**:
- `tmp/reports/analysis/2025-12-07/` - Analysis data
- `tmp/reports/migration/stylelint-13-16/` - Migration artifacts
- `tmp/reports/validation/2025-12-07/` - Test data

**Include in report**:
```markdown
- [tmp/reports/analysis/2025-12-07/](../tmp/) - Temporary analysis files
```

**Important**: Clean up temp files after creating the final report

---

## Naming Convention

**Format**: `{TYPE}-{SUBJECT}-{TIMESTAMP}.md`

Or for specific patterns:

**Analysis**: `ANALYSIS-{focus}-{date}.md`
- `ANALYSIS-SECURITY-AUDIT-2025-12-07.md`
- `ANALYSIS-PERFORMANCE-2025-12-07.md`

**Migration**: `{TOOL}-MIGRATION-{from}-{to}.md`
- `STYLELINT-MIGRATION-13-16.md`
- `ESLINT-MIGRATION-8-9.md`

**Performance**: `PERFORMANCE-{focus}-{date}.md`
- `PERFORMANCE-BUILD-SIZE-2025-12-07.md`
- `PERFORMANCE-TEST-SPEED-2025-12-07.md`

**Consolidation**: `{OPERATION}-SUMMARY.md` or `{OPERATION}-REPORT-{date}.md`
- `CONSOLIDATION-SUMMARY.md`
- `REFACTORING-REPORT-2025-12-07.md`

**Validation**: `{PROJECT}-VALIDATION-REPORT.md`
- `LINK-VALIDATION-REPORT.md`
- `TEMPLATE-VALIDATION-REPORT.md`

---

## Key Rules

### Location Rules

✅ **ALWAYS**:
- `reports/` directory
- Proper naming format
- Complete frontmatter
- Git version control

❌ **NEVER**:
- Repository root (e.g., `REPORT.md`)
- `docs/` folder
- `logs/` or `tmp/` folders
- Generic names without type/subject

### Content Rules

- Professional, UK English language
- Clear heading hierarchy
- Actionable recommendations
- References to supporting files
- Proper Markdown formatting

### Metadata Rules

Every report MUST have:
- `title` - Descriptive, human-readable
- `description` - One sentence summary
- `category` - Type of report
- `type` - Must be "Report"
- `audience` - Who should read this
- `date` - ISO format (YYYY-MM-DD)

---

## Starting Your Report

### Answer These Questions

1. **What type of report?** (Analysis, Migration, Performance, Consolidation, Validation)

2. **What is the focus?** (Which tool, code area, process?)

3. **Why create this report?** (What triggered it, what problem does it solve?)

4. **When was this done?** (Today's date: YYYY-MM-DD)

5. **Who should read it?** (Developers, DevOps, QA, All?)

### Build Your Filename

Based on your answers:

**Type** + **Subject** + **Timestamp** = Filename

Examples:
- Analysis of security → `ANALYSIS-SECURITY-AUDIT-2025-12-07.md`
- Stylelint upgrade → `STYLELINT-MIGRATION-13-16.md`
- Build size results → `PERFORMANCE-BUILD-SIZE-2025-12-07.md`

### Provide Your Content

Tell me:
1. The report type and filename
2. Key findings or results
3. Recommendations or actions
4. Any supporting logs or files
5. Related PRs or documentation

---

## Example Report

### File: `reports/STYLELINT-MIGRATION-13-16.md`

```markdown
---
title: Stylelint Migration (13 → 16)
description: Documentation of stylelint major version upgrade
category: Migration
type: Report
audience: Developers
date: 2025-12-07
tool: stylelint
from_version: 13.x
to_version: 16.x
---

## Executive Summary

**Status**: ✅ Completed

Successfully migrated stylelint from v13 to v16. No breaking changes in existing codebase required.

**Key Changes**: Configuration format unchanged, deprecated rules removed

**Impact**: Improved CSS validation rules, better error messages

**Action Required**: Yes - Enable new rules in configuration

## Context

Stylelint 16.0 released October 2025 with improved CSS parsing and new rule options. Upgrade improves code quality and maintainability while maintaining backward compatibility.

## Migration Steps

1. Updated stylelint dependency in package.json
2. Reviewed `.stylelint.config.cjs` for deprecated rules
3. Tested against entire codebase
4. Updated CI/CD linting workflow
5. Verified all tests pass

## Testing Results

✅ All CSS/SCSS files lint successfully
✅ No new errors introduced
✅ CI/CD pipeline validation passed
✅ Pre-commit hooks functional

## Recommendations

1. **Enable new rule**: `selector-pseudo-element-no-unknown`
   - Catches common pseudo-element mistakes
   - Recommended for new projects

2. **Update documentation**: LINTING.md should reference v16
   - Current docs reference v13

3. **Future optimization**: Review new performance rules
   - Consider for next maintenance cycle

## Related Files

- [logs/migration-stylelint-2025-12-07T10-30-00.log](../logs/)
- [.stylelint.config.cjs](../../.stylelint.config.cjs)
- [LINTING.md](../../docs/LINTING.md)
```

---

## How to Request a Report

Simply say:

- "Create an analysis report for [subject]"
- "Document the [tool] migration from [version] to [version]"
- "Create a performance benchmark report"
- "Generate a consolidation summary for [what was consolidated]"
- "Create a validation report for [what was validated]"

I'll create it with proper location, naming, structure, and all required metadata. ✅

