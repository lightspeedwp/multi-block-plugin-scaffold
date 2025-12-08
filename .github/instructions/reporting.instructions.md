---
name: Reporting Instructions
description: Rules and standards for report generation, storage, and management
applyTo: '**'
---

# Reporting Instructions

These instructions define standards for creating, storing, and managing reports in the Multi-Block Plugin Scaffold. All AI agents, developers, and automation scripts must follow these guidelines to maintain organized reporting infrastructure.

## Core Principles

1. **Single Location**: All reports MUST be stored in `reports/` directory
2. **Never Root**: Reports NEVER go in the repository root
3. **Proper Naming**: Follow consistent naming conventions with dates
4. **Metadata**: All reports MUST include frontmatter with context
5. **Point-in-Time**: Reports are historical records, not evolving documentation
6. **Integration**: Reports integrate with `logs/` and `tmp/` for supporting data

## Report Types

### Analysis Reports

**Purpose**: Code analysis, audit results, static analysis findings

**Examples**:
- Code quality audits
- Security analysis results
- Performance benchmarks
- Dependency analysis
- Migration feasibility studies

**Location**: `reports/ANALYSIS-{name}-{date}.md`

**Structure**:
```markdown
---
title: Analysis Report Title
description: What was analyzed
category: Analysis
type: Report
audience: Developers
date: YYYY-MM-DD
context: Why this analysis was needed
---

## Executive Summary
High-level findings

## Methodology
How the analysis was conducted

## Findings
Detailed results organized by category

## Recommendations
Suggested actions

## Related Files
- logs/analysis-{timestamp}.log (supporting log)
- tmp/analysis/{analysis-date}/ (temporary artifacts)
```

### Migration Reports

**Purpose**: Document dependency upgrades, tool migrations, structural changes

**Examples**:
- Stylelint version migration (e.g., "13 → 16")
- ESLint configuration updates
- Webpack upgrade documentation
- WordPress version compatibility
- Node.js/PHP version updates

**Location**: `reports/{TOOL}-MIGRATION-{from}-{to}.md`

**Examples**:
- `reports/STYLELINT-MIGRATION-13-16.md`
- `reports/ESLINT-MIGRATION-8-9.md`
- `reports/WEBPACK-MIGRATION-5-6.md`

**Structure**:
```markdown
---
title: {Tool} Migration ({from} → {to})
description: Migration changes and impact
category: Migration
type: Report
audience: Developers
date: YYYY-MM-DD
tool: {tool-name}
from_version: {old-version}
to_version: {new-version}
---

## Migration Summary
What changed and why

## Configuration Changes
Updated config files and settings

## Breaking Changes
Incompatible changes requiring updates

## Code Changes
Updates needed in codebase

## Testing
How to verify migration success

## Related Files
- logs/migration-{tool}-{timestamp}.log
```

### Performance Reports

**Purpose**: Benchmark results, performance testing, optimization opportunities

**Location**: `reports/PERFORMANCE-{focus}-{date}.md`

**Examples**:
- `reports/PERFORMANCE-BUILD-SIZE-2025-12-07.md`
- `reports/PERFORMANCE-TEST-SPEED-2025-12-07.md`
- `reports/PERFORMANCE-BUNDLE-ANALYSIS-2025-12-07.md`

### Consolidation & Audit Reports

**Purpose**: Documentation of major organizational changes, cleanup operations

**Location**: `reports/{OPERATION}-REPORT-{date}.md`

**Examples**:
- `reports/CONSOLIDATION-SUMMARY.md`
- `reports/LINK-VALIDATION-REPORT.md`
- `reports/AUDIT-DOCUMENTATION.md`

## Naming Conventions

### Format

```
{TYPE}-{SUBJECT}-{TIMESTAMP}.md
```

Or for specific types:

```
{TOOL}-{OPERATION}-{VERSION1}-{VERSION2}.md
{ANALYSIS}-{FOCUS}-{DATE}.md
{OPERATION}-SUMMARY.md
{PROJECT}-VALIDATION-REPORT.md
```

### Components

**TYPE** (Optional but recommended):
- `ANALYSIS` - Code/security analysis
- `MIGRATION` - Tool/version migration
- `PERFORMANCE` - Benchmark results
- `AUDIT` - Quality/security audit
- `CONSOLIDATION` - Organization changes
- `VALIDATION` - Testing/verification

**SUBJECT** (Required):
- Tool name: `STYLELINT`, `ESLINT`, `WEBPACK`
- Operation: `MIGRATION`, `AUDIT`, `CONSOLIDATION`
- Focus: `BUILD-SIZE`, `TEST-SPEED`, `DOCUMENTATION`

**TIMESTAMP** (When applicable):
- Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH-MM-SS`
- Use full timestamp for same-day multiple reports

### Examples

✅ **Good naming**:
- `reports/STYLELINT-MIGRATION-13-16.md`
- `reports/PERFORMANCE-BUILD-SIZE-2025-12-07.md`
- `reports/CONSOLIDATION-SUMMARY.md`
- `reports/LINK-VALIDATION-REPORT.md`
- `reports/SECURITY-AUDIT-2025-12-07.md`

❌ **Bad naming**:
- `REPORT.md` (too generic)
- `root/REPORT.md` (wrong location)
- `reports/report_stylelint_update` (no extension, unclear)
- `docs/MIGRATION-REPORT.md` (wrong folder - should be reports/)

## Frontmatter Requirements

All reports MUST include YAML frontmatter:

```yaml
---
title: Report Title (descriptive, human-readable)
description: One sentence summary
category: Analysis|Migration|Performance|Audit|Consolidation|Validation
type: Report
audience: Developers|DevOps|QA|All
date: YYYY-MM-DD
context: Why this report was created (optional)
tool: tool-name (if applicable)
from_version: x.y.z (if migration report)
to_version: x.y.z (if migration report)
---
```

## Content Structure

All reports should follow this structure:

### 1. Executive Summary (Required)

Brief overview for quick scanning:

```markdown
## Executive Summary

**Status**: ✅ Completed / ⚠️ Findings / ❌ Critical Issues

**Key Finding**: Main discovery or result

**Impact**: What this means for the project

**Action Required**: Yes/No - if yes, list items
```

### 2. Context/Methodology (Required)

Explain why the report was created:

```markdown
## Context

Why this report was needed, what triggered it, related issues/PRs

## Methodology

How the analysis/audit/test was conducted, tools used, scope
```

### 3. Findings/Results (Required)

Main content organized logically:

```markdown
## Findings

### Category 1
- Finding A
- Finding B

### Category 2
- Finding C
- Finding D
```

### 4. Recommendations (When applicable)

Suggested actions:

```markdown
## Recommendations

1. Recommended Action 1
2. Recommended Action 2
3. Recommended Action 3
```

### 5. Related Files (Required)

Reference supporting files:

```markdown
## Related Files

- [logs/](../logs/) - Supporting logs
- [tmp/report-artifacts/](../tmp/report-artifacts/) - Temporary data
- [PR #123](https://github.com/owner/repo/pull/123) - Related PR
```

## Integration with Logs and Temp

### Logging from Reports

Reports often have supporting log files:

**Location**: `logs/{source}-{type}-{timestamp}.log`

**Log Level Usage**:
- **ERROR**: Critical findings that block progress
- **WARN**: Issues requiring attention but non-blocking
- **INFO**: General report progress and sections
- **DEBUG**: Detailed analysis data

**Example**:
```bash
# Report: STYLELINT-MIGRATION-13-16.md
# Supporting Log: logs/migration-stylelint-2025-12-07T10-30-00.log
```

### Temporary Artifacts

Reports may generate temporary files during analysis:

**Location**: `tmp/reports/{report-type}/{report-date}/`

**Subdirectories**:
- `tmp/reports/analysis/2025-12-07/` - Analysis artifacts
- `tmp/reports/migration/stylelint-13-16/` - Migration temp files
- `tmp/reports/validation/2025-12-07/` - Validation data

**Cleanup**: Scripts should remove temp files after report finalization

**Example**:
```javascript
const tmpDir = path.join(__dirname, '../tmp/reports/analysis/2025-12-07');
// Cleanup when done:
fs.rmSync(tmpDir, { recursive: true, force: true });
```

## Report Generation

### By Developers

1. **Create report** in `reports/` with proper naming
2. **Include frontmatter** with all required fields
3. **Follow structure** outlined above
4. **Reference logs** if applicable
5. **Version control**: Commit to Git
6. **Date field**: Use current date in ISO format

### By Scripts/Agents

1. **Verify location**: Always use `reports/` directory
2. **Create subdirectory** if needed (e.g., `tmp/reports/analysis/`)
3. **Log execution** to `logs/` directory
4. **Generate report** file with timestamp
5. **Include metadata**: Frontmatter with context
6. **Clean up temp files** after completion
7. **Return path**: Script should return report path

**Example Script**:
```javascript
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `analysis-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log function
function log(level, message) {
  const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  logStream.write(entry);
  console.log(entry.trim());
}

// Create report
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

log('INFO', 'Report generation starting');

// Generate report content
const reportContent = `---
title: Analysis Report
description: Example report
category: Analysis
type: Report
audience: Developers
date: ${new Date().toISOString().split('T')[0]}
context: Generated by script
---

## Executive Summary

Report findings here...
`;

// Write report
const reportFile = path.join(reportsDir, `ANALYSIS-EXAMPLE-${timestamp}.md`);
fs.writeFileSync(reportFile, reportContent);
log('INFO', `Report saved: ${reportFile}`);
logStream.end();
```

### By AI Agents (Copilot)

Agents MUST:

1. **Always use `reports/` location**: Never create reports in root
2. **Check date**: Use current date in frontmatter
3. **Follow naming**: Use proper naming convention
4. **Include context**: Explain why report is being created
5. **Reference sources**: Link to logs, PRs, related files
6. **Document assumptions**: Note any limitations or caveats
7. **Provide recommendations**: Include actionable suggestions

**Agent Prompt Template**:

```
When generating reports:

1. Always save to `reports/` directory, NEVER to repository root
2. Use naming format: {TYPE}-{SUBJECT}-{TIMESTAMP}.md
3. Include YAML frontmatter with title, description, category, audience, date
4. Organize content with Executive Summary, Context, Findings, Recommendations
5. Reference supporting logs from `logs/` directory
6. Reference temporary artifacts from `tmp/reports/` if applicable
7. Use proper Markdown formatting with headings, tables, code blocks
8. Keep language clear and professional
9. Provide actionable recommendations for each finding
```

## Validation Rules

### Location Validation

```bash
# ✅ CORRECT locations
reports/STYLELINT-MIGRATION-13-16.md
reports/CONSOLIDATION-SUMMARY.md
reports/LINK-VALIDATION-REPORT.md

# ❌ INCORRECT locations (will be rejected)
CONSOLIDATION-SUMMARY.md           # Root - WRONG
docs/REPORT.md                     # docs/ folder - WRONG
tmp/REPORT.md                      # tmp/ folder - WRONG
logs/REPORT.md                     # logs/ folder - WRONG
reports/missing-frontmatter.md     # No frontmatter - WRONG
```

### Frontmatter Validation

Required fields:
- ✅ `title` - Descriptive title
- ✅ `description` - One sentence summary
- ✅ `category` - One of allowed categories
- ✅ `type` - Must be "Report"
- ✅ `audience` - Who should read this
- ✅ `date` - ISO format (YYYY-MM-DD)

### Content Validation

- ✅ Markdown format (.md extension)
- ✅ Proper heading hierarchy (no skipped levels)
- ✅ Executive Summary section
- ✅ Related Files section
- ✅ Clear, professional language
- ✅ Actionable recommendations where applicable

## Workflow

### Creating a Report

```
1. Identify need (analysis result, migration, etc.)
   ↓
2. Determine type (Analysis, Migration, Performance, etc.)
   ↓
3. Choose name: {TYPE}-{SUBJECT}-{TIMESTAMP}.md
   ↓
4. Create in reports/ directory
   ↓
5. Add frontmatter with metadata
   ↓
6. Structure content (Summary, Context, Findings, Recommendations)
   ↓
7. Reference logs/ and tmp/reports/ files
   ↓
8. Commit to version control
   ↓
9. Update reports/README.md with entry if major
```

### Report Lifecycle

```
Analysis Phase
  ├─ Logs → logs/{source}-{type}-{timestamp}.log
  ├─ Temp Data → tmp/reports/{type}/{date}/
  └─ Script/Agent Runs

Report Generation
  ├─ Create: reports/{TYPE}-{SUBJECT}-{TIMESTAMP}.md
  ├─ Add Frontmatter: title, description, category, date
  └─ Structure: Summary, Context, Findings, Recommendations

Publication
  ├─ Version Control: git add, git commit
  ├─ Documentation: Reference in docs/ if needed
  └─ Update: reports/README.md entry

Archive
  ├─ Location: reports/ (permanent)
  ├─ Retention: Indefinite (historical record)
  └─ Cleanup: tmp/reports/{type}/ can be cleaned
```

## AI Agent Instructions

### For Copilot/Claude/Gemini

When asked to create or document reports:

**ALWAYS**:
1. Save to `reports/` directory ONLY
2. Use proper naming: `{TYPE}-{SUBJECT}-{TIMESTAMP}.md`
3. Include complete YAML frontmatter
4. Add Executive Summary section
5. Include Related Files section
6. Keep reports in root directory mentions OUT
7. Reference logs/ and tmp/ appropriately

**NEVER**:
1. Create reports in repository root
2. Create reports in other directories
3. Skip frontmatter metadata
4. Use generic names like "REPORT.md"
5. Put analysis/audit files in docs/
6. Forget date field in frontmatter

### Confirmation Check

Before saving any report, verify:

```
✓ Location: reports/ (not root, not docs/, not tmp/)
✓ Filename: {TYPE}-{SUBJECT}-{TIMESTAMP}.md pattern
✓ Frontmatter: title, description, category, type, audience, date
✓ Content: Executive Summary, Findings, Recommendations, Related Files
✓ Language: Professional, UK English, clear and concise
✓ Links: All references to logs/ and tmp/ are correct
```

## Examples

### Good Report

**File**: `reports/STYLELINT-MIGRATION-13-16.md`

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

Successfully migrated stylelint from v13 to v16. No breaking changes in existing codebase.

## Context

Stylelint 16 released with improved CSS parsing and new rule options. Upgrade improves security and maintainability.

## Changes Made

1. Updated .stylelint.config.cjs
2. Reviewed deprecated rules
3. Added new recommended rules
4. Updated CI/CD workflow

## Testing

All CSS/SCSS linting tests passing. No changes required in codebase.

## Recommendations

1. Enable new `selector-pseudo-element-no-unknown` rule
2. Document new rules in LINTING.md
3. Update development guide

## Related Files

- [logs/migration-stylelint-2025-12-07T10-30-00.log](../logs/) - Migration execution log
- [.stylelint.config.cjs](./.stylelint.config.cjs) - Updated configuration
```

### Bad Report

```markdown
# REPORT

Some analysis findings...
```

Problems:
- ❌ Location: Root instead of reports/
- ❌ Naming: Generic "REPORT" instead of specific type
- ❌ No frontmatter
- ❌ No structure
- ❌ No related files
- ❌ Missing date

## Related Documentation

- [folder-structure.instructions.md](./folder-structure.instructions.md) - Directory organization rules
- [logs/README.md](../../logs/README.md) - Logging infrastructure
- [tmp/README.md](../../tmp/README.md) - Temporary files management
- [REPORTING.md](../../docs/REPORTING.md) - User documentation for reporting system
- [reporting.agent.md](../agents/reporting.agent.md) - AI agent for report generation

## Validation Checklist

Before committing any report:

- ✅ File is in `reports/` directory
- ✅ Filename follows `{TYPE}-{SUBJECT}-{TIMESTAMP}.md` pattern
- ✅ YAML frontmatter present with all required fields
- ✅ Content organized with required sections
- ✅ All relative paths are correct
- ✅ Professional tone and UK English
- ✅ Actionable recommendations provided
- ✅ Related files referenced (logs, tmp, etc.)
- ✅ No placeholder text or TODO comments

## Summary

✅ **Single Location** - All reports stored in `reports/`

✅ **Proper Naming** - Consistent format with type, subject, timestamp

✅ **Complete Metadata** - YAML frontmatter with context

✅ **Clear Structure** - Executive Summary, Context, Findings, Recommendations

✅ **Integrated** - Links to logs/ and tmp/ supporting data

✅ **Enforced** - Rules apply to all developers and agents

Reports are historical records of analysis, migrations, and organizational work. Follow these guidelines to maintain clear, organized, and discoverable reporting infrastructure.
