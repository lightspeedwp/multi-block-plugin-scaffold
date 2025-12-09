---
title: Documentation Chain Reduction Task List
description: Remaining work to complete Phase 1 (chain reduction) and prepare Phase 2 (token consolidation)
category: Project Management
type: Task List
audience: Developers
date: 2025-12-09
status: Active
---

## Project Context

**Goal**: Reduce circular documentation reference chains from 56 active chains to <10 (>82% reduction)

**Current Status**:

- ✅ 39 of 56 chains eliminated (70% reduction achieved)
- 🔄 17 remaining chains (all flow through README.md hub)
- 💰 Token budget: 55K used, 110K remaining to 165K target

---

## Phase 1: Chain Reduction (In Progress)

### ✅ Completed Steps (Steps 1-2)

**Step 1: Critical File Fixes** ✅

- [x] CONTRIBUTING.md - Fixed support documentation ecosystem cycle
- [x] CODE_OF_CONDUCT.md - Fixed circular references
- [x] AGENTS.md - Established unidirectional hierarchy
- [x] Result: 2 major ecosystem cycles broken

**Step 2: Ecosystem Hierarchy** ✅

- [x] Support chain: SUPPORT.md → CONTRIBUTING.md → CODE_OF_CONDUCT.md (one-way)
- [x] Agent chain: agent specs → AGENTS.md → development docs (one-way)
- [x] Documentation: 20+ docs files now follow unidirectional patterns
- [x] Result: 39 of 56 chains eliminated

---

## 🔄 Current Step: Step 3 (5 mins remaining)

### README.md Hub Analysis

**Problem**: All 17 remaining chains flow through README.md as central hub

**Location**: `/Users/ash/Studio/tour-operator/wp-content/plugins/multi-block-plugin-scaffold/README.md`

**Tasks**:

- [ ] **Analyze README.md structure** (2 mins)
  - Count total references in README.md
  - Identify which references create back-links
  - Map the 17 chain patterns

- [ ] **Apply reduction strategy** (3 mins)
  - Option A: Convert some references to one-way (remove reciprocal links)
  - Option B: Group related docs under sections without individual links
  - Option C: Create sub-hubs (e.g., "Development Docs" section) with selective linking

**Expected Impact**:

- Reduce from 50 → 40-45 active chains
- Target: <10 chains remaining after this step

**Commands**:

```bash
# Analyze README.md references
grep -n "\.md\)" README.md | wc -l

# Check which docs link back to README
grep -r "\[README\]" docs/ .github/ | wc -l

# Run chain analysis
node bin/audit-frontmatter.js --summary
```

---

## ⏳ Next Steps: Steps 4-6 (Ready to Start)

### Step 4: Verification & Spot-Check (10 mins)

**Verify Support/Agent Hierarchy**:

- [ ] **Support chain validation** (3 mins)
  - Confirm: SECURITY.md → SUPPORT.md → CONTRIBUTING.md → CODE_OF_CONDUCT.md
  - Test: No backward references from CODE_OF_CONDUCT → SUPPORT
  - Test: No backward references from CONTRIBUTING → SECURITY

- [ ] **Agent chain validation** (3 mins)
  - Confirm: agent specs (`.github/agents/*.agent.md`) → AGENTS.md → docs
  - Test: AGENTS.md doesn't link back to individual agent specs
  - Test: docs/ files don't create cycles with AGENTS.md

- [ ] **Spot-check remaining docs** (4 mins)
  - Pick 5 random files from docs/ directory
  - Verify they follow unidirectional patterns
  - Check no new cycles introduced

**Commands**:

```bash
# Support chain check
grep -l "SUPPORT\|CONTRIBUTING\|CODE_OF_CONDUCT\|SECURITY" {SECURITY,SUPPORT,CONTRIBUTING,CODE_OF_CONDUCT}.md

# Agent chain check
grep -l "AGENTS.md" .github/agents/*.agent.md
grep -l "agents/" docs/*.md

# Random docs spot-check
ls docs/*.md | shuf -n 5 | xargs grep -l "\.md\)"
```

---

### Step 5: Final Audit & Documentation (30 mins)

**Run Comprehensive Chain Analysis**:

- [ ] **Execute audit script** (2 mins)

  ```bash
  node bin/audit-frontmatter.js --summary > docs/CHAIN-AUDIT-FINAL.md
  ```

- [ ] **Analyze results** (10 mins)
  - Count remaining active chains (target: <10)
  - Identify root causes of remaining chains
  - Classify: acceptable vs. needs fixing
  - Calculate total reduction percentage

- [ ] **Document chain patterns** (10 mins)
  - Create reference architecture diagram
  - Document acceptable chain patterns (e.g., index → content)
  - Document forbidden patterns (e.g., circular references)
  - Add examples of good vs. bad patterns

- [ ] **Update documentation** (8 mins)
  - Add "Reference Architecture" section to ARCHITECTURE.md
  - Update CONTRIBUTING.md with chain reduction guidelines
  - Create docs/DOCUMENTATION-PATTERNS.md guide
  - Update README.md with documentation hierarchy

**Expected Metrics**:

- Active chains: <10 (target achieved: >82% reduction from 56)
- Passive chains: Documented and acceptable
- Chain depth: Max 3 levels for any reference path
- Hub concentration: README.md as primary hub only

**Deliverables**:

- [ ] `docs/CHAIN-AUDIT-FINAL.md` - Final audit results
- [ ] `docs/DOCUMENTATION-PATTERNS.md` - Reference architecture guide
- [ ] Updated ARCHITECTURE.md with reference patterns
- [ ] Updated CONTRIBUTING.md with guidelines

---

### Step 6: Cleanup & Phase 2 Preparation (15 mins)

**Cleanup Backup Directories**:

- [ ] **Verify backups are safe to delete** (2 mins)

  ```bash
  # Compare file counts
  find .github.backup -type f | wc -l
  find .github -type f | wc -l
  find docs.backup -type f | wc -l
  find docs -type f | wc -l
  ```

- [ ] **Delete backup directories** (1 min)

  ```bash
  rm -rf .github.backup docs.backup
  ```

- [ ] **Final validation** (5 mins)
  - Run all linters: `npm run lint`
  - Run chain audit: `node bin/audit-frontmatter.js`
  - Check no broken links: Test key navigation paths
  - Verify Git status clean

**Prepare Phase 2 Work**:

- [ ] **Create token consolidation task list** (5 mins)
  - Identify duplicate content patterns
  - List redundant instruction files
  - Plan content merging strategy
  - Estimate token savings per file

- [ ] **Document Phase 1 completion** (2 mins)
  - Update this file with completion status
  - Commit Phase 1 changes
  - Tag release: `phase-1-chain-reduction-complete`

**Commands**:

```bash
# Cleanup
rm -rf .github.backup docs.backup

# Validation
npm run lint
node bin/audit-frontmatter.js --summary

# Git
git add -A
git commit -m "docs: complete Phase 1 chain reduction (>82% reduction achieved)"
git tag phase-1-chain-reduction-complete
```

---

## Phase 2: Token Consolidation (Future)

### Overview

**Goal**: Reduce token count from current ~140K to <100K (>28% reduction)

**Token Budget Remaining**: 110K tokens available for Phase 2 work

### Preliminary Task Categories

**High-Impact Consolidation** (Est. 20-30K tokens):

- [ ] Merge duplicate coding standards
  - `.github/instructions/wpcs-*.instructions.md` → single comprehensive guide
  - Remove redundancy between similar instruction files

- [ ] Consolidate block development docs
  - Merge `blocks.instructions.md` + `block-json.instructions.md` + `block-plugin-development.instructions.md`
  - Single source of truth for block development

- [ ] Merge JavaScript/React standards
  - Combine `js-react.instructions.md` + `javascript-react.instructions.md` + `wpcs-javascript.instructions.md`

**Medium-Impact Consolidation** (Est. 10-15K tokens):

- [ ] Reduce example duplication
  - Extract common examples to shared reference
  - Link to examples instead of repeating them

- [ ] Streamline agent documentation
  - Merge similar agent specs
  - Remove redundant context sections

**Low-Impact Cleanup** (Est. 5-10K tokens):

- [ ] Remove verbose comments
- [ ] Tighten prose without losing clarity
- [ ] Remove redundant frontmatter explanations

### Phase 2 Execution Plan (Future Session)

**Step 1**: Content audit and duplication analysis (30 mins)
**Step 2**: High-impact consolidations (60 mins)
**Step 3**: Medium-impact consolidations (30 mins)
**Step 4**: Validation and testing (15 mins)
**Step 5**: Low-impact cleanup (optional, if time/budget allows)

---

## Quick Reference

### Key Commands

```bash
# Chain analysis
node bin/audit-frontmatter.js --summary

# Find all markdown files
find . -name "*.md" -not -path "./node_modules/*" -not -path "./vendor/*"

# Count references in a file
grep -o "\.md\)" filename.md | wc -l

# Find files that reference a specific doc
grep -r "\[Title\](path/to/file.md)" .

# Token counting (if available)
node bin/count-tokens.js
```

### File Locations

**Key Documentation**:

- Main index: `/README.md`
- Architecture: `/docs/ARCHITECTURE.md`
- Contributing: `/CONTRIBUTING.md`
- Agents: `/AGENTS.md`

**Tools**:

- Audit script: `/bin/audit-frontmatter.js`
- Token counter: `/bin/count-tokens.js` (if exists)

**Backups** (to be deleted in Step 6):

- `.github.backup/`
- `docs.backup/`

---

## Success Criteria

### Phase 1 Complete When

- ✅ Active chains reduced from 56 to <10 (>82% reduction)
- ✅ All ecosystem cycles broken (support, agent, core docs)
- ✅ Unidirectional hierarchy established
- ✅ No critical reference loops remain
- ✅ Documentation patterns guide created
- ✅ Cleanup completed (backups removed)
- ✅ Changes committed and tagged

### Ready for Phase 2 When

- ✅ Phase 1 criteria met
- ✅ Token baseline established
- ✅ Consolidation targets identified
- ✅ Sufficient token budget confirmed (>50K remaining)

---

## Session Notes

### Session 1 (2025-12-09)

**Time**: ~55 mins
**Token Usage**: ~55K tokens
**Achievements**:

- Steps 1-2 completed
- 39 of 56 chains eliminated (70% reduction)
- 2 major ecosystem cycles broken
- Unidirectional hierarchy established for 20+ files

**Status at Session End**:

- Step 3 in progress (README.md hub analysis)
- 17 chains remaining (all through README.md)
- Steps 4-6 ready to start next session

---

## Next Session Quick Start

### If Continuing from Step 3

1. **Analyze README.md** (2 mins):

   ```bash
   grep -n "\.md\)" README.md
   node bin/audit-frontmatter.js --summary
   ```

2. **Apply reduction strategy** (3 mins):
   - Identify back-linking docs
   - Convert to one-way references
   - Group docs under sections

3. **Verify impact** (2 mins):

   ```bash
   node bin/audit-frontmatter.js --summary
   # Target: <10 chains remaining
   ```

### If Starting Step 4

1. **Validate hierarchies** (10 mins):

   ```bash
   # Support chain
   grep -l "SUPPORT\|CONTRIBUTING" {SECURITY,SUPPORT,CONTRIBUTING,CODE_OF_CONDUCT}.md

   # Agent chain
   grep -l "AGENTS.md" .github/agents/*.agent.md

   # Spot-check docs
   ls docs/*.md | shuf -n 5 | xargs grep -l "\.md\)"
   ```

2. **Proceed to Step 5** for final audit

---

## Related Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Repository structure
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [AGENTS.md](./AGENTS.md) - AI agent system overview
- [docs/README.md](./docs/README.md) - Documentation index

---

**Last Updated**: 2025-12-09
**Current Phase**: Phase 1, Step 3 (in progress)
**Next Action**: Complete README.md hub analysis (5 mins)
**Token Budget**: 110K remaining (to 165K target)
