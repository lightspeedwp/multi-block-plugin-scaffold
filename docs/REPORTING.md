---
title: Reporting System Guide
description: Comprehensive guide to the reporting system for analysis, migrations, and audit documentation
category: Documentation
type: Guide
audience: Developers, Agents
date: 2025-12-07
---

# Reporting System Guide

Comprehensive documentation for the reporting system used throughout the multi-block plugin scaffold. This guide explains how reports are created, organized, stored, and integrated with the logging and temporary file systems.

## Overview

The reporting system provides a structured, consistent approach to documenting:

- **Analysis Results** - Code audits, security findings, quality assessments
- **Migrations** - Tool and version upgrades, configuration changes
- **Performance Data** - Benchmarks, optimization results, testing findings
- **Consolidations** - Documentation restructuring, organizational changes
- **Validations** - Testing results, compliance verification

### Key Concept: Reports vs Documentation

| Aspect | Reports | Documentation |
|--------|---------|---------------|
| **Location** | `reports/` | `docs/` |
| **Purpose** | Historical record | How to use/develop |
| **Audience** | Developers, DevOps | All users |
| **Lifecycle** | Point-in-time | Evolving |
| **Format** | Markdown with frontmatter | Markdown with frontmatter |
| **Updates** | Rarely (create new) | Frequently updated |
| **Examples** | Migration history | API reference |

## Repository Structure

### Reports Directory

```
reports/
├── README.md                          # Reports index
├── STYLELINT-MIGRATION-13-16.md      # Completed migration
├── CONSOLIDATION-SUMMARY.md          # Documentation consolidation
├── LINK-VALIDATION-REPORT.md         # Link validation results
└── {TYPE}-{SUBJECT}-{TIMESTAMP}.md   # New reports follow pattern
```

### Supporting Directories

**Logs** (`logs/`):

- Detailed execution logs from report generation
- Named: `{source}-{type}-{timestamp}.log`
- Example: `logs/migration-stylelint-2025-12-07T10-30-00.log`

**Temporary Files** (`tmp/`):

- Analysis artifacts and working files
- Location: `tmp/reports/{type}/{date}/`
- Example: `tmp/reports/migration/stylelint-13-16/`
- Auto-cleaned after report completion

## Report Types

### 1. Analysis Reports

Document code analysis, audits, and findings.

**When to use**:

- Conducting security audits
- Code quality assessments
- Performance analysis
- Static analysis findings
- Architectural reviews

**Naming**: `ANALYSIS-{focus}-{date}.md`

**Examples**:

- `ANALYSIS-SECURITY-AUDIT-2025-12-07.md`
- `ANALYSIS-PERFORMANCE-2025-12-07.md`
- `ANALYSIS-CODE-QUALITY-2025-12-07.md`

**Key Sections**:

- Executive Summary
- Methodology
- Detailed Findings (by category)
- Recommendations
- Related Files

### 2. Migration Reports

Document tool and version upgrades.

**When to use**:

- Upgrading dependencies
- Updating tool configurations
- Changing major versions
- Structural changes

**Naming**: `{TOOL}-MIGRATION-{from}-{to}.md`

**Examples**:

- `STYLELINT-MIGRATION-13-16.md`
- `ESLINT-MIGRATION-8-9.md`
- `WEBPACK-MIGRATION-5-6.md`

**Key Sections**:

- Executive Summary
- Context (why upgrade)
- Migration Steps
- Breaking Changes
- Testing Results
- Recommendations

### 3. Performance Reports

Document benchmark results and optimization findings.

**When to use**:

- Running performance tests
- Optimizing build size
- Improving test speed
- Recording benchmarks

**Naming**: `PERFORMANCE-{focus}-{date}.md`

**Examples**:

- `PERFORMANCE-BUILD-SIZE-2025-12-07.md`
- `PERFORMANCE-TEST-SPEED-2025-12-07.md`
- `PERFORMANCE-BUNDLE-ANALYSIS-2025-12-07.md`

**Key Sections**:

- Executive Summary
- Baseline Metrics
- Current Measurements
- Changes/Improvements
- Optimization Opportunities

### 4. Consolidation Reports

Document organizational and structural changes.

**When to use**:

- Reorganizing documentation
- Consolidating files
- Merging duplicate content
- Restructuring projects

**Naming**: `{OPERATION}-SUMMARY.md` or `{OPERATION}-REPORT-{date}.md`

**Examples**:

- `CONSOLIDATION-SUMMARY.md`
- `REFACTORING-REPORT-2025-12-07.md`
- `REORGANIZATION-SUMMARY.md`

**Key Sections**:

- Executive Summary
- What Was Changed
- Why It Was Changed
- Files Affected
- Benefits
- Related Files

### 5. Validation Reports

Document testing and verification results.

**When to use**:

- Validating configurations
- Verifying template replacements
- Compliance checking
- Testing compliance

**Naming**: `{PROJECT}-VALIDATION-REPORT.md`

**Examples**:

- `LINK-VALIDATION-REPORT.md`
- `TEMPLATE-VALIDATION-REPORT.md`
- `SECURITY-VALIDATION-REPORT.md`

**Key Sections**:

- Executive Summary
- Validation Criteria
- Test Results
- Issues Found
- Recommendations

## Report Structure

### Frontmatter (Required)

All reports MUST begin with YAML frontmatter:

```yaml
---
title: Descriptive Report Title
description: One-sentence summary of findings
category: Analysis|Migration|Performance|Consolidation|Validation
type: Report
audience: Developers|DevOps|QA|All
date: YYYY-MM-DD
context: Why this report was created (optional)
tool: tool-name (if applicable)
from_version: x.y.z (if migration)
to_version: x.y.z (if migration)
---
```

**Field Descriptions**:

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| title | Yes | String | "Stylelint Migration (13 → 16)" |
| description | Yes | String | "Documentation of stylelint upgrade" |
| category | Yes | Enum | "Migration" |
| type | Yes | Fixed | "Report" |
| audience | Yes | Enum | "Developers" |
| date | Yes | ISO 8601 | "2025-12-07" |
| context | No | String | "Required for improved linting" |
| tool | If applicable | String | "stylelint" |
| from_version | If migration | Semver | "13.x" |
| to_version | If migration | Semver | "16.x" |

### Content Sections

#### 1. Executive Summary (Required)

High-level overview for quick scanning:

```markdown
## Executive Summary

**Status**: ✅ Completed / ⚠️ Findings / ❌ Critical Issues

**Key Finding**: Main discovery or result

**Impact**: What this means for the project

**Action Required**: Yes/No - if yes, list specific actions
```

#### 2. Context (Required)

Explain the background and motivation:

```markdown
## Context

Why was this analysis/migration/work needed? What triggered it?
```

#### 3. Methodology (If applicable)

How the analysis/testing was conducted:

```markdown
## Methodology

Tools used, scope of analysis, testing approach, sample size
```

#### 4. Findings/Results (Required)

Main content organized logically:

```markdown
## Findings

### Category 1
Detailed findings organized by topic

### Category 2
More findings with specific details
```

Or for migrations:

```markdown
## Breaking Changes
- Change A
- Change B

## Code Updates Required
- Update pattern 1
- Update pattern 2

## Testing Results
✅ All tests passing
```

#### 5. Recommendations (Required)

Actionable suggestions:

```markdown
## Recommendations

1. **Specific Action**
   Reasoning and impact

2. **Another Action**
   Priority level and details

3. **Optional Future Work**
   Lower priority suggestions
```

#### 6. Related Files (Required)

Reference supporting documentation:

```markdown
## Related Files

- [logs/migration-tool-2025-12-07T10-30-00.log](../logs/) - Execution log
- [tmp/reports/migration/tool-13-16/](../tmp/) - Temporary artifacts
- [PR #123](https://github.com/owner/repo/pull/123) - Related PR
- [MIGRATION.md](../../docs/MIGRATION.md) - Related documentation
```

## Creating Reports

### Process Overview

```
1. Identify Need
   ↓
2. Determine Type
   ↓
3. Choose Name: {TYPE}-{SUBJECT}-{TIMESTAMP}.md
   ↓
4. Create in reports/
   ↓
5. Add Frontmatter
   ↓
6. Structure Content
   ↓
7. Reference Logs/Temp Files
   ↓
8. Commit to Git
```

### For Developers

1. **Create the file** in `reports/` with proper naming
2. **Add frontmatter** with complete metadata
3. **Write content** following the structure
4. **Reference logs** and temporary files
5. **Commit to Git** for version control
6. **Optional**: Update `reports/README.md` with entry

### For Scripts/Automation

```javascript
const fs = require('fs');
const path = require('path');

// Create directories
const logsDir = path.join(__dirname, '../logs');
const reportsDir = path.join(__dirname, '../reports');
const tmpDir = path.join(__dirname, '../tmp/reports/migration/tool-13-16');

[logsDir, reportsDir, tmpDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `migration-tool-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Logging helper
function log(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

log('INFO', 'Migration starting');

// ... perform migration analysis ...

// Generate report
const reportContent = `---
title: Tool Migration (13 → 16)
description: Documentation of tool upgrade
category: Migration
type: Report
audience: Developers
date: ${new Date().toISOString().split('T')[0]}
tool: tool
from_version: 13.x
to_version: 16.x
---

## Executive Summary

**Status**: ✅ Completed

...

## Related Files

- [logs/migration-tool-${timestamp}.log](../logs/) - Execution log
- [tmp/reports/migration/tool-13-16/](../tmp/) - Artifacts
`;

const reportFile = path.join(reportsDir, `TOOL-MIGRATION-13-16.md`);
fs.writeFileSync(reportFile, reportContent);
log('INFO', `Report saved: ${reportFile}`);

// Cleanup temp files
fs.rmSync(tmpDir, { recursive: true, force: true });
logStream.end();
```

### For AI Agents (Copilot)

When creating reports:

1. ✅ **ALWAYS** use `reports/` directory
2. ✅ **ALWAYS** include complete frontmatter
3. ✅ **ALWAYS** follow naming convention
4. ✅ **ALWAYS** organize with required sections
5. ✅ **ALWAYS** reference logs/temp files
6. ❌ **NEVER** create reports in root
7. ❌ **NEVER** skip frontmatter
8. ❌ **NEVER** use generic names

## Integration Examples

### Logs Integration

When analysis generates logs:

**Logs** → `logs/analysis-{type}-{timestamp}.log`
**Report** → `reports/ANALYSIS-{focus}-{date}.md`
**Reference**:

```markdown
## Related Files

- [logs/analysis-security-2025-12-07T10-30-00.log](../logs/) - Security audit log
```

### Temporary Files Integration

For complex analysis:

**Temp Files** → `tmp/reports/analysis/2025-12-07/`
**Report** → `reports/ANALYSIS-{focus}-2025-12-07.md`
**Reference**:

```markdown
## Related Files

- [tmp/reports/analysis/2025-12-07/](../tmp/) - Analysis artifacts
```

**Cleanup** after reporting:

```javascript
fs.rmSync('tmp/reports/analysis/2025-12-07', { recursive: true });
```

## Naming Conventions

### Format

```
{TYPE}-{SUBJECT}-{TIMESTAMP}.md
```

### Examples

**Analysis**:

```
ANALYSIS-SECURITY-AUDIT-2025-12-07.md
ANALYSIS-PERFORMANCE-2025-12-07.md
```

**Migration**:

```
STYLELINT-MIGRATION-13-16.md
ESLINT-MIGRATION-8-9.md
```

**Performance**:

```
PERFORMANCE-BUILD-SIZE-2025-12-07.md
PERFORMANCE-TEST-SPEED-2025-12-07.md
```

**Consolidation**:

```
CONSOLIDATION-SUMMARY.md
REFACTORING-REPORT-2025-12-07.md
```

**Validation**:

```
LINK-VALIDATION-REPORT.md
TEMPLATE-VALIDATION-REPORT.md
```

### Good vs Bad Naming

✅ **Good**:

- `STYLELINT-MIGRATION-13-16.md`
- `ANALYSIS-SECURITY-AUDIT-2025-12-07.md`
- `CONSOLIDATION-SUMMARY.md`
- `PERFORMANCE-BUILD-SIZE-2025-12-07.md`

❌ **Bad**:

- `REPORT.md` (too generic)
- `report-something.md` (wrong format)
- `ReportWithoutDate.md` (wrong casing)
- `Root/CONSOLIDATION.md` (wrong location - should be reports/)

## Common Tasks

### Creating an Analysis Report

```bash
# 1. Create file in reports/
# 2. Add frontmatter
# 3. Write sections:
#    - Executive Summary
#    - Context
#    - Findings (organized by category)
#    - Recommendations
#    - Related Files
```

### Creating a Migration Report

```bash
# 1. Create file: {TOOL}-MIGRATION-{from}-{to}.md
# 2. Add frontmatter with tool and versions
# 3. Write sections:
#    - Executive Summary
#    - Context/Motivation
#    - Migration Steps
#    - Breaking Changes
#    - Code Updates
#    - Testing Results
#    - Recommendations
```

### Creating a Performance Report

```bash
# 1. Create file: PERFORMANCE-{focus}-{date}.md
# 2. Add frontmatter
# 3. Write sections:
#    - Executive Summary
#    - Baseline Metrics
#    - Current Measurements
#    - Improvements
#    - Optimization Opportunities
```

### Creating a Consolidation Report

```bash
# 1. Create file: {OPERATION}-SUMMARY.md
# 2. Add frontmatter
# 3. Write sections:
#    - Executive Summary
#    - What Was Changed
#    - Why It Changed
#    - Files Affected
#    - Benefits
#    - Statistics
```

## Validation Checklist

Before finalizing a report:

- ✅ File is in `reports/` directory (not root)
- ✅ Filename follows `{TYPE}-{SUBJECT}-{TIMESTAMP}.md` pattern
- ✅ YAML frontmatter present with all required fields
- ✅ Content organized with required sections
- ✅ Proper Markdown heading hierarchy (no skips)
- ✅ Professional tone, UK English
- ✅ Actionable recommendations provided
- ✅ Related Files section complete
- ✅ All relative paths correct
- ✅ No placeholder text or TODO comments

## File Locations

### Reports Must Be In

```
✅ reports/STYLELINT-MIGRATION-13-16.md
✅ reports/ANALYSIS-SECURITY-2025-12-07.md
✅ reports/CONSOLIDATION-SUMMARY.md
```

### Reports Must NOT Be In

```
❌ CONSOLIDATION-SUMMARY.md (root)
❌ docs/REPORT.md
❌ logs/REPORT.md
❌ tmp/REPORT.md
```

## Related Documentation

- **[README.md](./README.md)** - Documentation index
- **[../.github/instructions/reporting.instructions.md](../.github/instructions/reporting.instructions.md)** - Rules and standards
- **[logs/README.md](../logs/README.md)** - Logging documentation
- **[tmp/README.md](../tmp/README.md)** - Temporary files documentation
- **[reports/README.md](../reports/README.md)** - Reports directory index

## Summary

✅ **Single Location** - All reports in `reports/`

✅ **Consistent Naming** - `{TYPE}-{SUBJECT}-{TIMESTAMP}.md`

✅ **Complete Metadata** - YAML frontmatter with context

✅ **Clear Structure** - Executive Summary, Context, Findings, Recommendations

✅ **Integrated** - References to logs/ and tmp/ supporting files

✅ **Enforced** - Rules apply to all developers and agents

The reporting system provides consistent, discoverable, well-organized documentation of analysis, migrations, performance work, and organizational changes throughout the plugin scaffold.
