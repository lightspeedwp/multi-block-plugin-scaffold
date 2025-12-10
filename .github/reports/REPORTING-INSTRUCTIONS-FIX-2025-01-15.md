---
title: Reporting Instructions Fix - Location Path Correction
description: Fixed reporting.instructions.md to unambiguously specify .github/reports/ as the only correct location for reports
category: Consolidation
type: Report
audience: Developers, AI Agents
date: 2025-01-15
context: Critical fix to prevent AI agents from creating reports in root reports/ directory
---

## Executive Summary

**Status**: ✅ Completed

Fixed critical ambiguity in `.github/instructions/reporting.instructions.md` that was causing AI agents to create reports in the wrong location (root `reports/` instead of `.github/reports/`).

**Problem**: Instructions file contained contradictory and incorrect guidance with 8+ instances of wrong paths.

**Solution**: Rewrote key sections to make `.github/reports/` the ONLY correct location with explicit warnings against root `reports/` directory.

**Impact**: Prevents future AI agents from making the same location error.

## Root Cause Analysis

### The Error

During schema system implementation, an implementation report was created in the wrong location:

- **Created**: `/reports/SCHEMA-SYSTEM-IMPLEMENTATION-2025-01-15.md` ❌ (WRONG - root directory)
- **Should be**: `/.github/reports/SCHEMA-SYSTEM-IMPLEMENTATION-2025-01-15.md` ✅ (CORRECT)

### Why It Happened

The `.github/instructions/reporting.instructions.md` file contained:

1. **Contradictory statements** (lines 7-8):

   ```
   1. All reports MUST be stored in `reports/` directory
   2. Reports NEVER go in the repository root
   ```

   These contradict because `reports/` IS at the root level.

2. **Incorrect path examples** throughout the file:
   - Analysis Reports: `reports/ANALYSIS-{name}-{date}.md` ❌
   - Migration Reports: `{TOOL}-MIGRATION-{from}-{to}.md` (no path prefix) ❌
   - Performance Reports: `reports/PERFORMANCE-{focus}-{date}.md` ❌
   - Examples section: Showed `reports/` paths ❌

3. **Weak AI agent guidance**:
   - Didn't explicitly state `.github/reports/` as the ONLY correct location
   - Didn't show WRONG examples
   - Didn't include confirmation checks

### The Key Insight

The error wasn't a bug in the agent—it was following incorrect instructions. The solution is **fixing the instructions to be unambiguous**.

## Changes Made

### 1. Core Principles Section (Line 13)

**Before:**

```markdown
1. **Single Location**: All reports MUST be stored in `reports/` directory
2. **Never Root**: Reports NEVER go in the repository root
```

**After:**

```markdown
1. **Single Location**: All reports MUST be stored in `.github/reports/` directory
2. **Never Root**: Reports NEVER go in the repository root
3. **Never in reports/**: Do NOT create a root `reports/` directory - use `.github/reports/` only
```

✅ Now explicitly states `.github/reports/` and warns against root `reports/` directory.

### 2. Location Validation Section (Line 429)

**Added explicit CORRECT vs WRONG examples:**

```bash
# ✅ ABSOLUTELY CORRECT locations (ONLY these are acceptable)
.github/reports/STYLELINT-MIGRATION-13-16.md
.github/reports/CONSOLIDATION-SUMMARY.md
.github/reports/LINK-VALIDATION-REPORT.md

# ❌ INCORRECT locations (will be rejected immediately)
reports/REPORT.md                  # Root reports/ - WRONG - Do NOT create this
CONSOLIDATION-SUMMARY.md           # Root - WRONG
docs/REPORT.md                     # docs/ folder - WRONG
```

✅ Visual examples showing both correct and incorrect paths.

### 3. AI Agent Instructions Section (Line 521)

**Strengthened with explicit requirements:**

Added "ABSOLUTELY ALWAYS (NON-NEGOTIABLE)" section with:

1. Save to **`.github/reports/`** directory ONLY - this is the ONLY acceptable location
2. NEVER create reports in root `reports/` directory
3. NEVER create reports in repository root
4. Use absolute path `.github/reports/` in all references

Added "NEVER (CRITICAL VIOLATIONS)" section explicitly listing 8 things agents must NOT do.

✅ Crystal clear requirements with emphasis on critical locations.

### 4. Confirmation Check Section (Line 545)

**Added critical verification step:**

```
✅ LOCATION PATH: Does the full path contain `.github/reports/`?
   → If NOT, STOP and correct immediately
   → Example correct: /path/to/.github/reports/REPORT.md
   → Example WRONG: /path/to/reports/REPORT.md
   ❌ NEVER create root reports/ directory
```

✅ Explicit path validation that agents must perform before saving.

### 5. Examples Section

**Updated good report example path:**

```
**File**: `.github/reports/STYLELINT-MIGRATION-13-16.md`
```

**Enhanced bad report example:**

```
- ❌ Location: Root instead of `.github/reports/`
- ❌ CRITICAL: NOT in `.github/reports/` directory
```

✅ Both examples now clearly show correct location.

## Key Changes Summary

| Section | Change | Impact |
|---------|--------|--------|
| Core Principles | Explicit `.github/reports/` + warning against root | Prevents ambiguity |
| Location Validation | CORRECT/WRONG visual examples | Agents see both paths clearly |
| AI Instructions | NON-NEGOTIABLE + CRITICAL VIOLATIONS lists | Unmistakable requirements |
| Confirmation Check | Path validation before saving | Prevents accidental mistakes |
| Examples | Updated to show `.github/reports/` | Consistent guidance |

## How This Prevents Future Errors

### Before (Problematic)

Instructions said: "All reports MUST be stored in `reports/` directory"

- ❌ Ambiguous (could mean root or `.github/`)
- ❌ Contradicted by "never in repository root"
- ❌ Agent followed what seemed like instructions
- ❌ Result: Reports created in wrong location

### After (Fixed)

Instructions now:

1. **Explicitly state**: "Save to **`.github/reports/`** directory ONLY"
2. **Show examples**: CORRECT (.github/reports/) and WRONG (root reports/)
3. **Add warnings**: "NEVER create root `reports/` directory"
4. **Include checks**: Verify path contains `.github/reports/` before saving
5. **List violations**: Explicit list of 8 things agents must NOT do

✅ Now unambiguous and actionable.

## Verification

✅ Core principles section now clearly states `.github/reports/`
✅ Location validation section shows CORRECT vs WRONG paths
✅ AI agent instructions section marked with NON-NEGOTIABLE and CRITICAL
✅ Confirmation check section includes explicit path validation
✅ All examples reference `.github/reports/`
✅ Instructions file updated (674 lines, all critical sections fixed)

## Related Files

- [reporting.instructions.md](./.github/instructions/reporting.instructions.md) - Fixed instructions file
- [SCHEMA-SYSTEM-IMPLEMENTATION-2025-01-15.md](.github/reports/SCHEMA-SYSTEM-IMPLEMENTATION-2025-01-15.md) - Report that triggered this fix (now in correct location)
- [docs/REPORTING.md](../../docs/REPORTING.md) - User documentation for reporting system

## Recommendations

1. ✅ **Done**: Review this fix in pull request (document the error and solution)
2. **Future**: If similar instruction ambiguities found, apply same approach:
   - Explicit single correct location
   - CORRECT/WRONG visual examples
   - Strong language in agent instructions
   - Confirmation/validation checks

3. **Pattern**: This error pattern could apply to other instructions files:
   - Check if any other `.github/instructions/*.md` files have similar ambiguities
   - Apply same clarity improvements where found

## Summary

This fix transforms reporting instructions from **ambiguous guidance** into **unambiguous, actionable rules** that prevent AI agents from creating reports in the wrong location. Future agents will see:

- ✅ Explicit location: `.github/reports/` ONLY
- ✅ Visual examples: What's RIGHT and what's WRONG
- ✅ Confirmation checks: Verify path before saving
- ✅ Critical warnings: NON-NEGOTIABLE requirements

**Result**: The error cannot happen again because the instructions make it impossible to misunderstand.
