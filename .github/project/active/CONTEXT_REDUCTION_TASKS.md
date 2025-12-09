---
title: Context Reduction Task List
description: Reduce context bloat in multi-block plugin scaffold repository
category: Governance
type: Task List
audience: Maintainers, Contributors
date: 2025-12-08
---

# Multi-Block Plugin Scaffold: Context Reduction Task List

**Goal**: Reduce context bloat from current state to <300K tokens while maintaining essential functionality for WordPress multi-block plugin development.

**Status Legend**:

- ✅ Complete
- 🔄 In Progress
- ⏳ Pending
- ❌ Blocked

---

## Phase 1: Audit Current State (Immediate) 🔄

### 1.1 Baseline Measurement

- ✅ Count total markdown files: **102 files found** (excluding node_modules/vendor)
- ✅ Count instruction files: **27 files** in `.github/instructions/`
- ✅ Count agent specs: **5 files** (agent, scaffold-generator, development-assistant, reporting)
- ✅ Count prompt templates: **4 files** (prompts, generate-plugin, reporting)
- ✅ Count documentation files: **19 files** in `docs/`
- ✅ Measure total tokens: **226,257 tokens** (measured using bin/count-tokens.js)
- ✅ Identify files with circular references: **56 circular chains found**
- ✅ Map dependency graph: **281 references** across 52 files

**Rationale**: Need baseline to measure reduction effectiveness.

**✅ BASELINE RESULTS (2025-12-08)**:

**Total Repository**:

- **226,257 tokens** (102 markdown files)
- **Target: <200,000 tokens**
- **Required Reduction: 11.6% (26,257 tokens)**
- **Note**: Original estimate of 270-350K was inflated by including node_modules (4,192 files)

**Token Distribution by Category**:

| Category | Files | Tokens | % | Status |
|----------|-------|--------|---|--------|
| Instructions | 27 | 90,553 | 40.0% | 🔴 PRIMARY TARGET |
| Other | 44 | 61,554 | 27.2% | 🟡 Needs investigation |
| Docs | 19 | 55,119 | 24.4% | 🟢 Well-organized |
| Agents | 5 | 7,677 | 3.4% | 🟢 Lean |
| Prompts | 4 | 5,788 | 2.6% | 🟢 Small |
| Root | 3 | 5,566 | 2.5% | 🟢 Manageable |

**Top 10 Files by Token Count**:

1. wpcs-php.instructions.md - 10,233 tokens
2. wpcs-php-docs.instructions.md - 9,423 tokens
3. wpcs-javascript.instructions.md - 9,287 tokens
4. a11y.instructions.md - 6,942 tokens
5. CONTEXT_REDUCTION_TASKS.md - 6,764 tokens
6. wpcs-js-docs.instructions.md - 6,403 tokens
7. docs/TESTING.md - 5,251 tokens
8. scf-fields.instructions.md - 4,942 tokens
9. docs/GENERATE-PLUGIN.md - 4,853 tokens
10. docs/ARCHITECTURE.md - 4,507 tokens

**Dependency Analysis**:

- Files with references: 52/102 (51%)
- Total references: 281
- Circular chains: **56** 🔴 CRITICAL
- Files with transitive refs: 42

**🔴 Critical Circular Reference Chains**:

**Agents** (10 chains):

- custom-instructions ↔ development-assistant ↔ prompts
- agent.md ↔ custom-instructions ↔ AGENTS.md
- scaffold-generator ↔ generate-plugin.prompt

**Docs** (40+ chains):

- LINTING ↔ BUILD-PROCESS ↔ TESTING ↔ LOGGING ↔ WORKFLOWS ↔ PERFORMANCE ↔ VALIDATION
- docs/README.md: 29 direct refs, 52 transitive refs
- README.md: 19 direct refs, 62 transitive refs
- GENERATE-PLUGIN ↔ API_REFERENCE ↔ README
- REPORTING ↔ reporting.instructions ↔ reporting.agent

**Support** (3 chains):

- SUPPORT ↔ CONTRIBUTING ↔ CODE_OF_CONDUCT

**Files with Highest Reference Counts**:

1. docs/README.md - 29 direct, 52 transitive (🔴 circular)
2. README.md - 19 direct, 62 transitive (🔴 circular)
3. block-plugin-development.instructions.md - 17 direct, 18 transitive
4. AGENTS.md - 12 direct, 7 transitive (🔴 circular)
5. docs/CONFIGS.md - 11 direct, 70 transitive (🔴 circular)

### 1.2 Identify Duplication Patterns

- ⏳ Scan for duplicate content across:
  - `docs/*.md` vs `.github/instructions/*.md`
  - `AGENTS.md` vs `.github/agents/agent.md`
  - Instruction files with overlapping scope
- ⏳ Find files referencing same content multiple times
- ⏳ Identify template/mustache variable duplication
- ⏳ Check for duplicate code examples

**Expected Findings**:

- Documentation duplication between root docs and `.github/`
- Overlapping WordPress coding standards files
- Repeated mustache variable documentation

### 1.3 Break Circular Reference Chains 🔴 CRITICAL

**Problem**: 56 circular reference chains detected across documentation create:

- Infinite context loading loops for AI tools
- Confusing navigation paths for developers
- Barriers to file consolidation (can't merge files that reference each other)
- Difficulty understanding documentation hierarchy

**Strategy**: Convert bidirectional references to unidirectional hierarchy (child → parent only)

#### 1.3.1 Break Agent Circular Chains (10 chains)

**Circular Chain Pattern**:

```text
custom-instructions.md ↔ development-assistant.agent.md ↔ prompts.md
agent.md ↔ custom-instructions.md ↔ AGENTS.md
scaffold-generator.agent.md ↔ generate-plugin.prompt.md
```

**Action**:

- ⏳ **Define hierarchy**: `AGENTS.md` (root) → `agent.md` (index) → `*.agent.md` (specs) → prompts/custom-instructions (utilities)
- ⏳ **custom-instructions.md**: Remove references to agents, keep only general instructions
- ⏳ **development-assistant.agent.md**: Reference prompts.md only (one-way), remove references back to custom-instructions
- ⏳ **scaffold-generator.agent.md**: Reference generate-plugin.prompt.md only (one-way)
- ⏳ **agent.md**: Reference AGENTS.md as parent, reference agent specs as children (one-way down)
- ⏳ **AGENTS.md**: Only reference agent.md (one-way down), no references to individual agent specs

**Expected Result**: 10 circular chains → 0 (unidirectional tree)

#### 1.3.2 Break Documentation Circular Chains (40+ chains) 🔴 HIGHEST PRIORITY

**Circular Chain Pattern**:

```text
LINTING ↔ BUILD-PROCESS ↔ TESTING ↔ LOGGING ↔ WORKFLOWS ↔ PERFORMANCE ↔ VALIDATION
docs/README.md ↔ [29 files] ↔ docs/README.md
README.md ↔ [19 files] ↔ README.md
GENERATE-PLUGIN ↔ API_REFERENCE ↔ README
REPORTING ↔ reporting.instructions ↔ reporting.agent
```

**Critical Files**:

1. **docs/README.md**: 29 direct refs, 52 transitive (🔴 circular) - WORST OFFENDER
2. **README.md**: 19 direct refs, 62 transitive (🔴 circular)
3. **docs/CONFIGS.md**: 11 direct, 70 transitive (🔴 circular)

**Action**:

- ⏳ **Define hierarchy**:

  ```text
  Root: README.md (project overview)
    ├─ docs/README.md (documentation index)
    │   ├─ ARCHITECTURE.md
    │   ├─ BUILD-PROCESS.md
    │   ├─ TESTING.md
    │   ├─ LINTING.md
    │   └─ ... (leaf nodes)
    └─ Other root files (CONTRIBUTING, SUPPORT, etc.)
  ```

- ⏳ **README.md**: Only reference docs/README.md and essential root files (one-way down)
- ⏳ **docs/README.md**: Reference doc files (one-way down), remove references back to parent
- ⏳ **BUILD-PROCESS.md**: Reference child topics (WEBPACK, LINTING) but not siblings (TESTING)
- ⏳ **TESTING.md**: Reference BUILD-PROCESS as prerequisite (one-way up), not siblings
- ⏳ **LINTING.md**: Reference BUILD-PROCESS (one-way up), remove references to TESTING/LOGGING
- ⏳ **LOGGING.md**: Remove references to all other docs, only reference logs/README.md (one-way down)
- ⏳ **WORKFLOWS.md**: Reference prerequisite docs (one-way up), not siblings
- ⏳ **PERFORMANCE.md**: Reference BUILD-PROCESS/TESTING (one-way up), not siblings
- ⏳ **VALIDATION.md**: Reference TESTING (one-way up), not siblings
- ⏳ **GENERATE-PLUGIN.md**: Only reference instructions/API (one-way down), not other docs
- ⏳ **REPORTING.md**: Reference reporting.instructions (one-way down), not reporting.agent
- ⏳ **ARCHITECTURE.md**: Only reference folder/file structure, no circular doc references

**Circular Chain Resolution Rules**:

1. **Prerequisites** (one-way up): TESTING can reference BUILD-PROCESS, but not vice versa
2. **Indexes** (one-way down): README.md references children, children don't reference README.md
3. **Siblings** (no references): TESTING and LINTING should not reference each other
4. **Related Tools** (one-way): Documentation → Implementation (.md → .agent.md → .prompt.md)

**Expected Result**: 40+ circular chains → 0 (directed acyclic graph)

#### 1.3.3 Break Support File Circular Chains (3 chains)

**Circular Chain Pattern**:

```text
SUPPORT.md ↔ CONTRIBUTING.md ↔ CODE_OF_CONDUCT.md
```

**Action**:

- ⏳ **Define hierarchy**: `README.md` → `CONTRIBUTING.md` → `CODE_OF_CONDUCT.md` + `SUPPORT.md`
- ⏳ **SUPPORT.md**: Reference CONTRIBUTING.md (one-way up), remove reference to CODE_OF_CONDUCT
- ⏳ **CONTRIBUTING.md**: Reference CODE_OF_CONDUCT (one-way down), not SUPPORT
- ⏳ **CODE_OF_CONDUCT.md**: No references to other support files

**Expected Result**: 3 circular chains → 0 (linear hierarchy)

#### 1.3.4 Validation

After breaking circular chains:

- ⏳ Run `node bin/audit-frontmatter.js --csv --graph` again
- ⏳ Verify: "Circular Chains: 0" in output
- ⏳ Verify: All files have "OK" or "REVIEW" recommendation (no "CRITICAL")
- ⏳ Verify: Transitive reference counts reduced (e.g., docs/README.md: 52 → <20)
- ⏳ Test: AI context loading works without infinite loops
- ⏳ Document: Update CONTEXT_REDUCTION_TASKS.md with before/after results

**Expected Reduction**:

- Circular chains: 56 → 0 (100% elimination)
- Average transitive references per file: ~15 → <8 (47% reduction)
- Files marked "CRITICAL" by audit: 10 → 0 (100% resolution)

**Priority**: 🔴 **CRITICAL** - Must complete before Phase 2 consolidation

---

## Phase 1.3 Execution Plan 🔴 CURRENT PRIORITY

**Goal**: Systematically break all 56 circular reference chains to establish a clean unidirectional documentation hierarchy.

**Estimated Time**: 3-4 hours

**Status**: ⏳ Ready to Begin

### Step 1: Backup and Prepare (15 minutes)

- [ ] Create feature branch: `git checkout -b fix/break-circular-references`
- [ ] Tag current state: `git tag pre-circular-ref-fix`
- [ ] Create backup of all files to be modified: `cp -r .github .github.backup && cp -r docs docs.backup`
- [ ] Re-run baseline audit: `node bin/audit-frontmatter.js --csv --graph`
- [ ] Save baseline results to `tmp/baseline-before-circular-fix.json`
- [ ] Open audit CSV in spreadsheet for reference: `tmp/frontmatter-audit-*.csv`

### Step 2: Break Agent Circular Chains (30 minutes)

**Target**: 10 circular chains → 0

**Chain Pattern**: `custom-instructions ↔ development-assistant ↔ prompts ↔ agent.md ↔ AGENTS.md`

#### 2.1 Define Agent Hierarchy

- [ ] Document hierarchy in comments:

```text
AGENTS.md (root - project overview)
  └── .github/agents/agent.md (index - agent directory)
      ├── scaffold-generator.agent.md (spec)
      ├── development-assistant.agent.md (spec)
      └── reporting.agent.md (spec)

.github/custom-instructions.md (utility - general instructions)
.github/prompts/prompts.md (utility - prompt templates)
```

#### 2.2 Fix AGENTS.md (root file)

- [ ] Open `AGENTS.md`
- [ ] Remove all references TO agent specs (keep only reference to `agent.md`)
- [ ] Keep only: "See [Main Agent Index](.github/agents/agent.md)"
- [ ] Remove references to: development-assistant, scaffold-generator, reporting
- [ ] Commit: `git commit -am "fix: remove agent spec refs from AGENTS.md"`

#### 2.3 Fix .github/agents/agent.md (index)

- [ ] Open `.github/agents/agent.md`
- [ ] Add reference UP to AGENTS.md: "See [Global AI Rules](../../AGENTS.md)"
- [ ] Keep references DOWN to agent specs (one-way)
- [ ] Remove references to custom-instructions.md (sibling)
- [ ] Remove references to prompts.md (sibling)
- [ ] Commit: `git commit -am "fix: make agent.md reference hierarchy unidirectional"`

#### 2.4 Fix Agent Specs (leaf files)

- [ ] Open `scaffold-generator.agent.md`
  - [ ] Keep reference to `generate-plugin.prompt.md` (tool reference - allowed)
  - [ ] Remove references back to agent.md or AGENTS.md
  - [ ] Add parent reference only if needed: "See [Agent Index](./agent.md)"
- [ ] Open `development-assistant.agent.md`
  - [ ] Keep reference to prompts.md (tool reference - allowed)
  - [ ] Remove references back to custom-instructions.md
  - [ ] Remove references back to agent.md or AGENTS.md
- [ ] Open `reporting.agent.md`
  - [ ] Keep reference to reporting.prompt.md (tool reference - allowed)
  - [ ] Remove references back to agent.md
- [ ] Commit: `git commit -am "fix: remove upward refs from agent specs"`

#### 2.5 Fix .github/custom-instructions.md

- [ ] Open `.github/custom-instructions.md`
- [ ] Remove all references to agent files
- [ ] Keep only general instructions
- [ ] If agent reference needed, reference AGENTS.md (root) only
- [ ] Commit: `git commit -am "fix: remove agent refs from custom-instructions"`

#### 2.6 Fix .github/prompts/prompts.md

- [ ] Open `.github/prompts/prompts.md`
- [ ] Remove references to agents (development-assistant, scaffold-generator)
- [ ] Keep references to prompt templates (children)
- [ ] Add reference to agent.md if needed for context
- [ ] Commit: `git commit -am "fix: remove agent refs from prompts.md"`

#### 2.7 Validate Agent Chains

- [ ] Run: `node bin/audit-frontmatter.js --csv | grep -i "agent\|custom-instructions\|prompts"`
- [ ] Verify: No circular chains in Agents category
- [ ] Expected: 10 chains → 0 ✅

### Step 3: Break Documentation Circular Chains (90 minutes)

**Target**: 40+ circular chains → 0

**Chain Pattern**: `docs/README.md ↔ [29 files] ↔ LINTING ↔ BUILD-PROCESS ↔ TESTING ↔ LOGGING ↔ WORKFLOWS ↔ PERFORMANCE ↔ VALIDATION`

#### 3.1 Define Documentation Hierarchy

- [ ] Document hierarchy:

```text
README.md (project overview)
  └── docs/README.md (documentation index)
      ├── ARCHITECTURE.md (structure)
      ├── BUILD-PROCESS.md (build system)
      │   ├── webpack.config.js (ref)
      │   └── LINTING.md (related)
      ├── TESTING.md (testing guide)
      │   ├── BUILD-PROCESS.md (prerequisite ↑)
      │   └── LOGGING.md (related)
      ├── WORKFLOWS.md (CI/CD)
      │   └── BUILD-PROCESS.md (prerequisite ↑)
      ├── PERFORMANCE.md (optimization)
      │   ├── BUILD-PROCESS.md (prerequisite ↑)
      │   └── TESTING.md (prerequisite ↑)
      ├── VALIDATION.md (template validation)
      │   └── TESTING.md (prerequisite ↑)
      ├── GENERATE-PLUGIN.md (generator guide)
      ├── REPORTING.md (reporting system)
      ├── LOGGING.md (logging system)
      └── ... (other leaf docs)
```

#### 3.2 Fix Root README.md (29 direct refs → <10)

- [ ] Open `README.md`
- [ ] Keep only essential references:
  - [ ] Link to docs/README.md (index)
  - [ ] Link to CONTRIBUTING.md
  - [ ] Link to SUPPORT.md
  - [ ] Link to LICENSE
- [ ] Remove references to specific docs (users should go through docs/README.md)
- [ ] Remove circular references back from child docs
- [ ] Commit: `git commit -am "fix: reduce README.md refs to index only"`

#### 3.3 Fix docs/README.md (29 direct refs → list format)

- [ ] Open `docs/README.md`
- [ ] Convert to index-only format (no circular refs back)
- [ ] List all doc files as index, no explanations
- [ ] Remove references back to parent README.md
- [ ] Keep references DOWN to child docs only
- [ ] Format as simple bullet list or table
- [ ] Commit: `git commit -am "fix: convert docs/README.md to pure index"`

#### 3.4 Fix BUILD-PROCESS.md (hub file)

- [ ] Open `docs/BUILD-PROCESS.md`
- [ ] Remove references to sibling docs (TESTING, LOGGING, WORKFLOWS)
- [ ] Keep references to:
  - [ ] webpack.config.js (down to implementation)
  - [ ] LINTING.md (related tool)
- [ ] Remove circular references back from TESTING/LINTING
- [ ] Commit: `git commit -am "fix: remove sibling refs from BUILD-PROCESS"`

#### 3.5 Fix TESTING.md (references BUILD-PROCESS as prerequisite)

- [ ] Open `docs/TESTING.md`
- [ ] Keep ONE reference UP to BUILD-PROCESS.md (prerequisite)
- [ ] Remove references to siblings: LINTING, LOGGING, WORKFLOWS, PERFORMANCE
- [ ] Remove references DOWN to build configs
- [ ] Add note: "See BUILD-PROCESS.md for build setup"
- [ ] Commit: `git commit -am "fix: TESTING.md reference BUILD-PROCESS only"`

#### 3.6 Fix LINTING.md

- [ ] Open `docs/LINTING.md`
- [ ] Keep ONE reference UP to BUILD-PROCESS.md (context)
- [ ] Remove references to: TESTING, LOGGING, WORKFLOWS, PERFORMANCE
- [ ] Reference linting configs directly (down): `.eslintrc.js`, `.stylelintrc.json`
- [ ] Commit: `git commit -am "fix: LINTING.md reference configs not sibling docs"`

#### 3.7 Fix LOGGING.md

- [ ] Open `docs/LOGGING.md`
- [ ] Remove ALL references to other docs
- [ ] Reference only: `logs/README.md` (down to implementation)
- [ ] Self-contained documentation
- [ ] Commit: `git commit -am "fix: make LOGGING.md self-contained"`

#### 3.8 Fix WORKFLOWS.md

- [ ] Open `docs/WORKFLOWS.md`
- [ ] Keep ONE reference UP to BUILD-PROCESS.md (prerequisite)
- [ ] Remove references to: TESTING, LINTING, PERFORMANCE, LOGGING
- [ ] Reference workflow files directly: `.github/workflows/*.yml`
- [ ] Commit: `git commit -am "fix: WORKFLOWS.md reference workflows not docs"`

#### 3.9 Fix PERFORMANCE.md

- [ ] Open `docs/PERFORMANCE.md`
- [ ] Keep references UP to prerequisites: BUILD-PROCESS, TESTING (one-way)
- [ ] Remove references to siblings: WORKFLOWS, LOGGING, VALIDATION
- [ ] Self-contained performance guide
- [ ] Commit: `git commit -am "fix: PERFORMANCE.md reference prerequisites only"`

#### 3.10 Fix VALIDATION.md

- [ ] Open `docs/VALIDATION.md`
- [ ] Keep ONE reference UP to TESTING.md (context)
- [ ] Remove references to: BUILD-PROCESS, WORKFLOWS, PERFORMANCE
- [ ] Self-contained validation guide
- [ ] Commit: `git commit -am "fix: VALIDATION.md reference TESTING only"`

#### 3.11 Fix GENERATE-PLUGIN.md

- [ ] Open `docs/GENERATE-PLUGIN.md`
- [ ] Keep references DOWN to: instructions files, API_REFERENCE
- [ ] Remove circular references back from API_REFERENCE
- [ ] Remove references to sibling docs
- [ ] Commit: `git commit -am "fix: GENERATE-PLUGIN.md reference instructions not docs"`

#### 3.12 Fix REPORTING.md

- [ ] Open `docs/REPORTING.md`
- [ ] Keep reference DOWN to: `reporting.instructions.md` (one-way)
- [ ] Remove reference to: `reporting.agent.md` (creates circle)
- [ ] Self-contained reporting guide
- [ ] Commit: `git commit -am "fix: REPORTING.md reference instructions not agent"`

#### 3.13 Fix ARCHITECTURE.md

- [ ] Open `docs/ARCHITECTURE.md`
- [ ] Keep references DOWN to: folder structure, configs
- [ ] Remove circular references to other docs
- [ ] Self-contained architecture overview
- [ ] Commit: `git commit -am "fix: ARCHITECTURE.md reference structure not docs"`

#### 3.14 Fix CONFIGS.md (11 direct refs, 70 transitive)

- [ ] Open `docs/CONFIGS.md`
- [ ] Reference config FILES directly, not other docs
- [ ] Remove references to: BUILD-PROCESS, LINTING, TESTING
- [ ] Self-contained config reference
- [ ] Commit: `git commit -am "fix: CONFIGS.md reference configs not docs"`

#### 3.15 Fix Remaining Documentation Files

For each remaining doc file:

- [ ] `docs/AGENTS-OVERVIEW.md` - reference agent files, not other docs
- [ ] `docs/API_REFERENCE.md` - self-contained, no doc refs
- [ ] `docs/BUILD-PROCESS.md` - already fixed above
- [ ] `docs/DEPRECATION.md` - self-contained policy
- [ ] `docs/FOLDER-STRUCTURE.md` - reference folders, not docs
- [ ] `docs/GOVERNANCE.md` - self-contained policy
- [ ] `docs/INTERNATIONALIZATION.md` - self-contained guide
- [ ] `docs/SECURITY.md` - self-contained guide
- [ ] `docs/WORKFLOWS.md` - already fixed above
- [ ] Commit: `git commit -am "fix: remaining doc files self-contained"`

#### 3.16 Validate Documentation Chains

- [ ] Run: `node bin/audit-frontmatter.js --csv --graph`
- [ ] Check docs category: Should show 0 circular chains
- [ ] Check docs/README.md: Transitive refs should drop from 52 → <20
- [ ] Check README.md: Transitive refs should drop from 62 → <15
- [ ] Expected: 40+ chains → 0 ✅

### Step 4: Break Support File Circular Chains (15 minutes)

**Target**: 3 circular chains → 0

**Chain Pattern**: `SUPPORT.md ↔ CONTRIBUTING.md ↔ CODE_OF_CONDUCT.md`

#### 4.1 Define Support Hierarchy

- [ ] Document hierarchy:

```text
README.md
  ├── CONTRIBUTING.md (how to contribute)
  │   ├── CODE_OF_CONDUCT.md (behavior standards)
  │   └── SUPPORT.md (how to get help)
  └── SUPPORT.md (can also be top-level)
```

#### 4.2 Fix CONTRIBUTING.md

- [ ] Open `CONTRIBUTING.md`
- [ ] Keep reference DOWN to CODE_OF_CONDUCT.md
- [ ] Remove reference to SUPPORT.md (creates circle)
- [ ] Add note: "For questions, see project README"
- [ ] Commit: `git commit -am "fix: CONTRIBUTING.md reference CODE_OF_CONDUCT only"`

#### 4.3 Fix SUPPORT.md

- [ ] Open `SUPPORT.md`
- [ ] Keep reference UP to CONTRIBUTING.md (how to contribute properly)
- [ ] Remove reference to CODE_OF_CONDUCT.md (get via CONTRIBUTING)
- [ ] Commit: `git commit -am "fix: SUPPORT.md reference CONTRIBUTING only"`

#### 4.4 Fix CODE_OF_CONDUCT.md

- [ ] Open `CODE_OF_CONDUCT.md`
- [ ] Remove ALL references to SUPPORT.md and CONTRIBUTING.md
- [ ] Self-contained standards document
- [ ] Commit: `git commit -am "fix: make CODE_OF_CONDUCT self-contained"`

#### 4.5 Validate Support Chains

- [ ] Run: `node bin/audit-frontmatter.js --csv | grep -i "support\|contributing\|code_of_conduct"`
- [ ] Verify: No circular chains in Support category
- [ ] Expected: 3 chains → 0 ✅

### Step 5: Final Validation (30 minutes)

#### 5.1 Run Complete Audit

- [ ] Run: `node bin/audit-frontmatter.js --csv --graph`
- [ ] Save results: `tmp/audit-after-circular-fix.json`
- [ ] Compare before/after:
  - [ ] Circular chains: 56 → 0 ✅
  - [ ] Files with CRITICAL status: 10 → 0 ✅
  - [ ] Average transitive refs per file: ~15 → <8 ✅

#### 5.2 Verify Specific Problem Files

- [ ] Check `docs/README.md`: No CRITICAL status, transitive refs <20
- [ ] Check `README.md`: No CRITICAL status, transitive refs <15
- [ ] Check `AGENTS.md`: No circular refs to agents
- [ ] Check `BUILD-PROCESS.md`: No circular refs to TESTING/LOGGING

#### 5.3 Test Navigation Paths

Manually test documentation navigation:

- [ ] Start at `README.md` → Can reach all major docs?
- [ ] Start at `docs/README.md` → Can reach all docs without circles?
- [ ] Start at `AGENTS.md` → Can reach agent specs without circles?
- [ ] Verify: All paths are unidirectional (no back-references)

#### 5.4 Test AI Context Loading

- [ ] Test Copilot context loading with docs/README.md
- [ ] Verify: No infinite loop warnings
- [ ] Verify: Context loads in reasonable time (<5 seconds)
- [ ] Test with 3-4 different starting points

#### 5.5 Update Documentation

- [ ] Update `CONTEXT_REDUCTION_TASKS.md`:
  - [ ] Mark Phase 1.3 as ✅ Complete
  - [ ] Add "After" statistics
  - [ ] Document any issues encountered
- [ ] Create summary report:
  - [ ] Before: 56 circular chains
  - [ ] After: 0 circular chains
  - [ ] Files modified: ~XX files
  - [ ] Commits: ~XX commits
- [ ] Commit: `git commit -am "docs: update Phase 1.3 completion status"`

### Step 6: Merge and Deploy (15 minutes)

- [ ] Review all commits: `git log --oneline`
- [ ] Run full test suite: `npm test`
- [ ] Push feature branch: `git push origin fix/break-circular-references`
- [ ] Create PR: "fix: break 56 circular reference chains (Phase 1.3)"
- [ ] Add PR description with before/after stats
- [ ] Request review from team
- [ ] After approval, merge to main
- [ ] Tag completion: `git tag phase-1.3-complete`
- [ ] Update main task list: Mark Phase 1.3 ✅ Complete

### Success Criteria

- ✅ All 56 circular chains eliminated (verified by audit script)
- ✅ No files marked "CRITICAL" by frontmatter audit
- ✅ Average transitive references per file reduced by 47%
- ✅ AI context loading works without infinite loops
- ✅ Documentation navigation remains functional
- ✅ All tests passing
- ✅ Team approval obtained

### Rollback Plan

If issues discovered:

1. Checkout main: `git checkout main`
2. Restore from tag: `git reset --hard pre-circular-ref-fix`
3. Or restore from backup: `cp -r .github.backup .github && cp -r docs.backup docs`
4. Review what went wrong
5. Revise approach and try again

---

## Phase 2: Delete/Archive Redundant Files (High Priority) ⏳

### 2.1 Remove Duplicate WPCS Instructions

**Current State**: Multiple WordPress Coding Standards (WPCS) instruction files with overlapping content:

- ⏳ `wpcs-php.instructions.md`
- ⏳ `wpcs-javascript.instructions.md`
- ⏳ `wpcs-css.instructions.md`
- ⏳ `wpcs-accessibility.instructions.md`
- ⏳ `wpcs-php-docs.instructions.md`
- ⏳ `wpcs-js-docs.instructions.md`
- ⏳ `wpcs-html.instructions.md`

**Action**:

- ⏳ Consolidate into single `coding-standards.instructions.md` with sections:
  - § PHP Standards (merge wpcs-php + wpcs-php-docs)
  - § JavaScript Standards (merge wpcs-javascript + wpcs-js-docs)
  - § CSS/SCSS Standards (merge wpcs-css)
  - § HTML Standards (merge wpcs-html)
  - § Accessibility (merge wpcs-accessibility + a11y.instructions.md)
- ⏳ Keep security.instructions.md separate (security-specific)
- ⏳ Update all `applyTo` patterns in consolidated file

**Expected Reduction**: ~40% of instruction file count (7 → 1 file)

### 2.2 Consolidate Duplicate JavaScript Instructions

**Current State**:

- `javascript-react.instructions.md`
- `js-react.instructions.md`
- Both appear to cover React/JavaScript standards

**Action**:

- ⏳ Compare files for actual differences
- ⏳ Merge into single `js-react.instructions.md`
- ⏳ Remove `javascript-react.instructions.md`
- ⏳ Update references in other files

**Expected Reduction**: 1 file removed

### 2.3 Consolidate Pattern Instructions

**Current State**:

- `patterns.instructions.md`
- `pattern-development.instructions.md`
- Likely duplicate/overlapping content

**Action**:

- ⏳ Compare files for differences
- ⏳ Keep `patterns.instructions.md` (more concise name)
- ⏳ Merge unique content from `pattern-development.instructions.md`
- ⏳ Remove `pattern-development.instructions.md`

**Expected Reduction**: 1 file removed

### 2.4 Remove Experimental/Niche Files

**Candidates for Archival**:

- ⏳ `single-block-plugin.instructions.md` - Niche use case, conflicts with multi-block focus
- ⏳ `playwright.instructions.md` - Duplicate of `playwright-typescript.instructions.md`?

**Action**:

- ⏳ Move to `.archive/instructions/` with README explaining why
- ⏳ Update references if needed

**Expected Reduction**: 2 files archived

### 2.5 Total Phase 2 Expected Reduction

**Before**: 27 instruction files
**After**: ~15-18 instruction files
**Reduction**: 33-44%

---

## Phase 3: Trim Core Index Files (High Priority) ⏳

### 3.1 AGENTS.md - Convert to Quick Reference

**Current State**: 178 lines with detailed rules and tables

**Target**: <60 lines, table of contents only

**Actions**:

- ⏳ Remove "Global Principles & Agent Rules" table (move key points to custom-instructions.md)
- ⏳ Remove "Contribution Guidelines & Indexes" table (redundant with docs/CONTRIBUTING.md)
- ⏳ Keep only "Agent Directory" section with 3 agents:
  - Scaffold Generator
  - Development Assistant
  - Reporting Agent
- ⏳ Keep "Cross-References & Discoverability" table (essential links)
- ⏳ Add note: "See `.github/agents/*.agent.md` for full agent list"
- ⏳ Remove redundant "Core Index Instructions" (already in custom-instructions.md)

**Expected Reduction**: ~65% (178 → ~62 lines)

### 3.2 .github/agents/agent.md - Reduce to Essential Agents

**Current State**: ~95 lines documenting all agents and usage patterns

**Target**: <40 lines with quick reference

**Actions**:

- ⏳ Create quick reference table with 3 primary agents:

  ```markdown
  | Agent | Purpose | Usage |
  |-------|---------|-------|
  | scaffold-generator | Generate new multi-block plugins | "Generate a multi-block plugin" |
  | development-assistant | Context-specific dev modes | "Switch to block development mode" |
  | reporting | Create analysis/migration reports | "Create a migration report" |
  ```

- ⏳ Remove detailed "Available Agents" section (redundant with individual .agent.md files)
- ⏳ Keep only essential "Environment Variables" section
- ⏳ Add note: "See `.github/agents/*.agent.md` for complete specs"
- ⏳ Remove redundant "Maintenance" section (covered in CONTRIBUTING.md)

**Expected Reduction**: ~58% (95 → ~40 lines)

### 3.3 .github/prompts/prompts.md - Categorical Index

**Current State**: ~140 lines documenting prompt patterns and examples

**Target**: <50 lines with categories only

**Actions**:

- ⏳ Replace detailed prompt documentation with categorical index:

  ```markdown
  ## Available Prompt Categories
  - **Plugin Generation**: generate-plugin.prompt.md
  - **Reporting & Analysis**: reporting.prompt.md
  - **Block Development**: (future prompts)
  - **Testing & Validation**: (future prompts)
  ```

- ⏳ Keep "Quick Start: Generate a New Multi-Block Plugin" section (most-used)
- ⏳ Remove "Prompt Authoring Guidelines" (move to custom-instructions.md)
- ⏳ Remove "{{name}} Build Assistant" section (redundant with custom-instructions.md)
- ⏳ Add note: "See `.github/prompts/*.prompt.md` for full prompt list"

**Expected Reduction**: ~64% (140 → ~50 lines)

### 3.4 Total Phase 3 Expected Reduction

**Lines Saved**: ~263 lines (~1,315 tokens)
**Reduction**: 60-65% across index files

---

## Phase 4: Optimize Documentation Files (Medium Priority) ⏳

### 4.1 Reduce docs/ARCHITECTURE.md Verbosity

**Current State**: Comprehensive guide to repository structure

**Target**: Keep essential structure info, reduce examples

**Actions**:

- ⏳ Keep directory structure tree (essential)
- ⏳ Reduce "Directory Purposes" from detailed paragraphs to tables
- ⏳ Remove redundant file naming examples (covered in folder-structure.instructions.md)
- ⏳ Keep "Mustache Template System" section (essential for scaffold)
- ⏳ Reduce "File Organization Best Practices" to bullet points

**Expected Reduction**: 20-25%

### 4.2 Consolidate docs/GENERATE-PLUGIN.md Content

**Current State**: Comprehensive plugin generation guide

**Target**: Keep workflow, reduce redundant examples

**Actions**:

- ⏳ Keep "Generation Methods" section (essential)
- ⏳ Reduce "Complete Mustache Variable Reference" (reference generate-plugin.instructions.md instead)
- ⏳ Remove duplicate "Example Requests" (covered in prompts/generate-plugin.prompt.md)
- ⏳ Keep "Post-Generation Workflow" (essential)
- ⏳ Reduce "Common Issues" section (link to SUPPORT.md instead)

**Expected Reduction**: 25-30%

### 4.3 Merge Duplicate Documentation

**Candidates**:

- ⏳ docs/LINTING.md vs .github/instructions/linting.instructions.md
  - Keep docs/LINTING.md for users
  - Update linting.instructions.md to reference docs/LINTING.md
  - Remove duplicate examples

- ⏳ docs/REPORTING.md vs .github/instructions/reporting.instructions.md
  - Keep docs/REPORTING.md for users
  - Reduce reporting.instructions.md to rules only (no examples)

- ⏳ docs/FOLDER-STRUCTURE.md vs .github/instructions/folder-structure.instructions.md
  - Merge into single file: .github/instructions/folder-structure.instructions.md
  - Remove docs/FOLDER-STRUCTURE.md
  - Add reference in docs/ARCHITECTURE.md

**Expected Reduction**: 3 files merged/reduced

### 4.4 Total Phase 4 Expected Reduction

**Files Reduced**: 5+ documentation files
**Content Reduction**: 20-30% across affected files
**Estimated Token Savings**: ~15-20% of docs/ directory

---

## Phase 5: Reduce Frontmatter Bloat (High Priority) ⏳

### 5.1 Create Frontmatter Audit Script

- ⏳ Create `bin/audit-frontmatter.js` to:
  - Scan all `.md` files recursively
  - Extract frontmatter blocks
  - Build reference graph (A → B → C)
  - Detect circular references (A → B → C → A)
  - Identify transitive references (A → B, B → C, A → C = redundant)
  - Count references per file
  - Generate CSV report

**Example Output**:

```csv
File,References,Circular,Transitive,Recommendation
custom-instructions.md,8,No,2,Reduce
AGENTS.md,12,Yes,4,Critical
```

### 5.2 Define Reference Rules

**Keep Only**:

- Direct dependencies (agent → workflow, instruction → canonical config)
- Canonical configs (no alternatives)
- Main indexes (AGENTS.md, custom-instructions.md, prompts.md)
- Cross-references essential for navigation

**Remove**:

- Circular references (A → B → C → A)
- Transitive references (if A refs B, and B refs C, A shouldn't ref C)
- Generic references (README.md, CONTRIBUTING.md - implied)
- References to archived/removed files

### 5.3 Audit Key Files

**Priority Files** (likely high reference counts):

- ⏳ `.github/custom-instructions.md`
- ⏳ `AGENTS.md`
- ⏳ `.github/agents/agent.md`
- ⏳ `.github/prompts/prompts.md`
- ⏳ `.github/instructions/generate-plugin.instructions.md`
- ⏳ `docs/ARCHITECTURE.md`
- ⏳ `docs/GENERATE-PLUGIN.md`

**Actions**:

- ⏳ Run audit script
- ⏳ Review each file's frontmatter
- ⏳ Remove non-essential references
- ⏳ Verify no broken links

**Expected Reduction**: 40-60% of frontmatter references

### 5.4 Total Phase 5 Expected Reduction

**Impact**: High - frontmatter bloat is major token consumer
**Estimated Token Savings**: 20-30% of total markdown file context

---

## Phase 6: Optimize Instruction File Content (Medium Priority) ⏳

### 6.1 Reduce Mustache Variable Documentation Duplication

**Current State**: Mustache variables documented in:

- `.github/instructions/generate-plugin.instructions.md` (canonical)
- `docs/GENERATE-PLUGIN.md` (duplicate)
- `.github/custom-instructions.md` (duplicate)
- Individual agent specs (duplicate)

**Actions**:

- ⏳ Keep complete reference in `generate-plugin.instructions.md` (canonical)
- ⏳ Replace duplicates with "See generate-plugin.instructions.md for complete reference"
- ⏳ Keep only essential variables in custom-instructions.md ({{name}}, {{slug}}, {{namespace}})
- ⏳ Remove mustache sections from agent specs (reference instructions instead)

**Expected Reduction**: ~30% across affected files

### 6.2 Compress SCF Field Type Documentation

**Current State**: `.github/instructions/scf-fields.instructions.md` is comprehensive with all field types

**Actions**:

- ⏳ Keep field type list (essential reference)
- ⏳ Reduce examples to 1-2 per field type (not 3-5)
- ⏳ Convert verbose descriptions to tables
- ⏳ Remove "Common Patterns" section (link to WordPress/SCF docs instead)
- ⏳ Keep "Best Practices" (essential for scaffold)

**Expected Reduction**: 25-30%

### 6.3 Compress Block Development Instructions

**Current State**: `blocks.instructions.md` and `block-json.instructions.md` are comprehensive

**Actions**:

- ⏳ Merge overlapping content
- ⏳ Reduce block.json examples (keep 1 comprehensive example, not 5)
- ⏳ Convert verbose descriptions to tables
- ⏳ Remove duplicate WordPress block editor documentation (link instead)

**Expected Reduction**: 20-25%

### 6.4 Total Phase 6 Expected Reduction

**Files Optimized**: 5-8 instruction files
**Content Reduction**: 20-30% across affected files
**Estimated Token Savings**: ~10-15% of instruction directory

---

## Phase 7: Streamline Agent & Prompt Files (Low Priority) ⏳

### 7.1 Reduce scaffold-generator.agent.md Verbosity

**Current State**: Comprehensive agent spec with detailed tables

**Actions**:

- ⏳ Keep "How I Work" and "Discovery Stages" (essential)
- ⏳ Reduce "Conversation Flow Example" (keep 1 stage example, not all stages)
- ⏳ Remove "Post-Generation Assistance" (covered in development-assistant)
- ⏳ Keep "Configuration Schema" (essential reference)
- ⏳ Reduce "Validation Rules" (link to generate-plugin.instructions.md)

**Expected Reduction**: 20-25%

### 7.2 Reduce development-assistant.agent.md Verbosity

**Current State**: Lists all capabilities and modes

**Actions**:

- ⏳ Keep "Capabilities" and "Development Modes" (essential)
- ⏳ Reduce "Quick Commands" table (keep 3-5 most common)
- ⏳ Remove "Example Requests" (redundant with prompts)
- ⏳ Keep "Context" section (essential metadata)

**Expected Reduction**: 15-20%

### 7.3 Optimize Prompt Templates

**Current State**: 2 prompt files with detailed examples

**Actions**:

- ⏳ Keep generate-plugin.prompt.md structure (most-used, essential)
- ⏳ Reduce reporting.prompt.md (consolidate report type examples)
- ⏳ Remove duplicate frontmatter metadata (reduce to essentials)

**Expected Reduction**: 10-15%

### 7.4 Total Phase 7 Expected Reduction

**Files Optimized**: 5 agent/prompt files
**Content Reduction**: 15-20% across affected files
**Estimated Token Savings**: ~5% of agent/prompt content

---

## Phase 8: Archive Legacy/Experimental Content (Low Priority) ⏳

### 8.1 Create Archive Structure

- ⏳ Create `.archive/` directory in repo root
- ⏳ Create subdirectories:

  ```text
  .archive/
  ├── instructions/     # Deprecated/consolidated instructions
  ├── docs/             # Old migration guides, outdated docs
  ├── agents/           # Experimental agent specs
  └── prompts/          # Experimental/unused prompts
  ```

- ⏳ Create `.archive/README.md` explaining:
  - What's archived and why
  - How to restore if needed
  - Archive eligibility criteria
  - Review schedule (quarterly)

### 8.2 Move Consolidated Files to Archive

**Candidates**:

- ⏳ `wpcs-php.instructions.md` (consolidated)
- ⏳ `wpcs-javascript.instructions.md` (consolidated)
- ⏳ `wpcs-css.instructions.md` (consolidated)
- ⏳ `wpcs-accessibility.instructions.md` (consolidated)
- ⏳ `wpcs-php-docs.instructions.md` (consolidated)
- ⏳ `wpcs-js-docs.instructions.md` (consolidated)
- ⏳ `wpcs-html.instructions.md` (consolidated)
- ⏳ `javascript-react.instructions.md` (merged)
- ⏳ `pattern-development.instructions.md` (merged)

**Actions**:

- ⏳ Move files to `.archive/instructions/`
- ⏳ Add deprecation notice in each file
- ⏳ Update references to point to new consolidated files

### 8.3 Document Archival Policy

- ⏳ Add section to docs/GOVERNANCE.md about archive process
- ⏳ Document archival criteria:
  - Age: >6 months since last update
  - Usage: Not referenced in active files
  - Status: Superseded by consolidated file
  - Scope: Experimental or niche use case
- ⏳ Set review schedule: Quarterly archive review

### 8.4 Total Phase 8 Impact

**Files Archived**: 9-12 instruction files
**Repo Cleanup**: Improved discoverability, cleaner structure
**Token Savings**: Indirect (files still available but out of main context)

---

## Phase 9: Validation & Testing (Final Phase) ⏳

### 9.1 Automated Testing

- ⏳ Run all linters:

  ```bash
  npm run lint:js
  npm run lint:css
  composer run lint
  ```

- ⏳ Run test suite:

  ```bash
  npm run test
  npm run test:unit
  npm run test:php
  ```

- ⏳ Validate markdown:

  ```bash
  npm run lint:md
  ```

- ⏳ Check for broken links:

  ```bash
  npm run validate:links
  ```

### 9.2 AI/Copilot Functionality Testing

- ⏳ Test scaffold generator agent:
  - "Generate a new multi-block plugin"
  - Verify full discovery process works
  - Test with dry-run configuration

- ⏳ Test development assistant agent:
  - "Switch to block development mode"
  - "Help me create a collection block"
  - Verify context-specific responses

- ⏳ Test reporting agent:
  - "Create a migration report"
  - Verify report structure and frontmatter

- ⏳ Spot-check code review functionality:
  - Test Copilot with reduced context
  - Verify WordPress coding standards still accessible
  - Test block.json validation

### 9.3 Reference Resolution Testing

- ⏳ Verify all cross-references resolve:
  - Scan all `.md` files for broken links
  - Check frontmatter references are valid
  - Verify agent specs reference correct workflows
  - Test prompt files reference correct instructions

- ⏳ Verify dynamic references work:
  - `*.instructions.md` patterns
  - `*.agent.md` patterns
  - `*.prompt.md` patterns
  - Glob patterns in documentation

### 9.4 Measure Context Reduction

- ⏳ Count tokens before/after:
  - Use token counting tool or estimate
  - Calculate reduction percentage by category:
    - Index files: Target 60-65%
    - Instruction files: Target 30-40%
    - Documentation files: Target 20-30%
    - Frontmatter: Target 40-60%
    - Total: Target 35-45% overall

- ⏳ Create summary report:

  ```markdown
  ## Context Reduction Summary

  | Category | Before | After | Reduction |
  |----------|--------|-------|-----------|
  | Index Files | XX tokens | XX tokens | XX% |
  | Instructions | XX tokens | XX tokens | XX% |
  | Documentation | XX tokens | XX tokens | XX% |
  | Frontmatter | XX tokens | XX tokens | XX% |
  | **TOTAL** | **XX tokens** | **<300K tokens** | **XX%** |
  ```

### 9.5 Update All Documentation

- ⏳ Update README.md:
  - Document new repository structure
  - Update file/folder descriptions
  - Add "Context Optimization" section
  - Update quick start guide

- ⏳ Update CONTRIBUTING.md:
  - Streamline references (essentials only)
  - Update onboarding to reflect new structure
  - Remove references to deleted/archived files
  - Add note about context reduction approach

- ⏳ Update custom-instructions.md:
  - Update dynamic reference patterns
  - Note consolidated files
  - Add context reduction notes

- ⏳ Update docs/ARCHITECTURE.md:
  - Reflect new structure
  - Update directory listings
  - Add archive section

### 9.6 Create Final Report

- ⏳ Create `reports/CONTEXT-REDUCTION-2025-12-08.md`:
  - Document all changes made
  - List all deleted files (with recovery path)
  - List all merged content (with mappings)
  - List all archived files
  - Document token reduction achieved
  - Note any breaking changes
  - Provide rollback instructions

- ⏳ Archive CONTEXT_REDUCTION_TASKS.md:
  - Move to `.archive/docs/`
  - Mark all tasks as complete
  - Add completion date
  - Link to final report

### 9.7 Team Review & Sign-off

- ⏳ Create PR with all changes
- ⏳ Request review from team members
- ⏳ Spot-check critical functionality
- ⏳ Verify no unintended side effects
- ⏳ Get sign-off before merging

### 9.8 Total Phase 9 Deliverables

- ✅ All tests passing
- ✅ All references resolved
- ✅ Context reduction target achieved (<300K tokens)
- ✅ Documentation updated
- ✅ Final report created
- ✅ Team approval obtained

---

## Estimated Impact

### Before Optimization

| Category | Count | Estimated Tokens |
|----------|-------|------------------|
| Total Markdown Files | 4,192 | TBD (to measure) |
| Instruction Files | 27 | ~135K tokens |
| Documentation Files | 19 | ~95K tokens |
| Agent Specs | 3 | ~15K tokens |
| Prompt Templates | 2 | ~10K tokens |
| Index Files | 3 | ~15K tokens |
| **Estimated Total** | **4,246** | **~270-350K tokens** |

### After Optimization (Target)

| Category | Count | Target Tokens | Reduction |
|----------|-------|---------------|-----------|
| Instruction Files | 15-18 | ~80K tokens | ~40% |
| Documentation Files | 16-17 | ~70K tokens | ~26% |
| Agent Specs | 3 | ~12K tokens | ~20% |
| Prompt Templates | 2 | ~8K tokens | ~20% |
| Index Files | 3 | ~5K tokens | ~67% |
| **Total Target** | **~40 core files** | **<200K tokens** | **~30-40%** |

### Expected Reductions by Category

- **Index Files**: 60-67% reduction (AGENTS.md, agent.md, prompts.md)
- **Instruction Files**: 30-40% reduction (consolidation + content optimization)
- **Documentation Files**: 20-30% reduction (deduplication + verbosity reduction)
- **Frontmatter References**: 40-60% reduction (remove circular/transitive refs)
- **Agent/Prompt Files**: 15-20% reduction (reduce verbosity, keep essentials)

---

## Implementation Order

### Priority Ranking

1. **� Phase 1**: Audit Current State (IMMEDIATE) - **90% COMPLETE**
   - Need baseline measurements to track progress
   - Estimated: 2-4 hours
   - **Status**: Phase 1.1 ✅ Complete, Phase 1.2 🔄 In Progress

2. **🔴 Phase 1.3**: Break Circular Reference Chains (CRITICAL - NEW PRIORITY)
   - **56 circular chains** detected - MUST be resolved before consolidation
   - Prevents infinite context loops and enables clean file merging
   - Estimated: 3-4 hours
   - **Status**: ⏳ Pending (blocks Phase 2)

3. **🔥 Phase 5**: Reduce Frontmatter Bloat (HIGH PRIORITY)
   - High impact, minimal disruption
   - Create audit script first
   - Estimated: 4-6 hours

4. **🔥 Phase 2**: Delete/Archive Redundant Files (HIGH PRIORITY)
   - ⚠️ **BLOCKED by Phase 1.3** - Cannot consolidate until circular refs resolved
   - Consolidate WPCS files
   - Merge duplicate instructions
   - Estimated: 6-8 hours

5. **🔥 Phase 3**: Trim Core Index Files (HIGH PRIORITY)
   - High visibility, immediate impact
   - Estimated: 3-4 hours

6. **📋 Phase 4**: Optimize Documentation Files (MEDIUM)
   - Reduce verbosity, merge duplicates
   - Estimated: 5-7 hours

7. **📋 Phase 6**: Optimize Instruction Content (MEDIUM)
   - Content reduction, not file deletion
   - Estimated: 4-5 hours

8. **📌 Phase 7**: Streamline Agent/Prompt Files (LOW)
   - Small files, lower impact
   - Estimated: 2-3 hours

9. **📌 Phase 8**: Archive Legacy Content (LOW)
   - Organization, indirect benefits
   - Estimated: 2-3 hours

10. **✅ Phase 9**: Validation & Testing (FINAL)
    - Comprehensive testing and reporting
    - Estimated: 6-8 hours

### Timeline

**Suggested Timeline** (24-29 hours total):

- **Week 1**: Phases 1, 1.3, 5 (audit, break circular refs, frontmatter) - **CRITICAL PATH**
- **Week 2**: Phases 2, 3 (consolidation, indexes) - **HIGH PRIORITY**
- **Week 3**: Phases 4, 6, 7 (docs, instruction content, agents)
- **Week 4**: Phases 8, 9 (archive, validation, final report)

### Milestone Checkpoints

- **25% Complete**: Phase 1 baseline + Phase 1.3 circular refs broken
- **50% Complete**: Phases 2-3 done (files consolidated, indexes trimmed)
- **75% Complete**: Phases 4-6 done (documentation optimized)
- **100% Complete**: Phases 7-9 done (final validation, report created)

---

## Risk Mitigation

### Backup Strategy

- ✅ Create feature branch: `feature/context-reduction`
- ✅ Do NOT work on `main` or `develop` directly
- ✅ Commit frequently with descriptive messages
- ✅ Tag baseline: `git tag pre-context-reduction`

### Testing Strategy

- ✅ Run tests after each phase
- ✅ Verify Copilot functionality incrementally
- ✅ Test with real plugin generation scenarios
- ✅ Document any issues encountered

### Rollback Plan

- ✅ Keep all deleted files in `.archive/` (not truly deleted)
- ✅ Document all file movements in final report
- ✅ Maintain git history for easy reversion
- ✅ Test rollback procedure before finalizing

### Communication Plan

- ✅ Create GitHub issue tracking this work
- ✅ Update issue with progress after each phase
- ✅ Share interim results with team
- ✅ Request feedback at 50% checkpoint

---

## Decision Log

### Key Decisions

**2025-12-08**: Created context reduction task list

- Identified 4,192+ files in repository (including node_modules - incorrect estimate)
- Counted 27 instruction files, 19 docs, 5 agents, 4 prompts
- Estimated current token count: 270-350K tokens
- Set target: <200K tokens (30-40% reduction)

**2025-12-08**: Measured actual baseline (Phase 1.1 Complete)

- **Actual token count: 226,257 tokens** (102 markdown files, excluding node_modules/vendor)
- **Revised target: <200K tokens (11.6% reduction needed, not 30-40%)**
- Created `bin/count-tokens.js` for accurate measurement
- Created `bin/audit-frontmatter.js` for dependency analysis
- Original estimate was 23% too high due to including build artifacts

**2025-12-08**: Discovered critical architectural issue (Phase 1.3 Added)

- **56 circular reference chains** detected across documentation
- Circular chains create infinite context loops for AI tools
- **CRITICAL**: Must resolve before file consolidation in Phase 2
- Added **Phase 1.3: Break Circular Reference Chains** (3-4 hours)
- Phase 1.3 is now BLOCKING Phase 2 consolidation
- Strategy revised: Architecture fix > Token reduction
- Circular chain breakdown:
  - Agents: 10 chains
  - Documentation: 40+ chains (docs/README.md worst offender with 29 direct refs)
  - Support files: 3 chains

**Decision**: Prioritize breaking circular references over aggressive consolidation. The 56 circular chains are a more critical issue than the token count itself.

### Open Questions

1. Should we merge `a11y.instructions.md` into consolidated coding standards?
   - **Recommendation**: Yes, as § Accessibility section

2. Are `javascript-react.instructions.md` and `js-react.instructions.md` truly duplicates?
   - **Need to verify**: Compare file contents

3. Should `playwright.instructions.md` replace `playwright-typescript.instructions.md`?
   - **Need to verify**: Check which is more comprehensive

4. Can we archive `single-block-plugin.instructions.md` given multi-block focus?
   - **Recommendation**: Yes, conflicts with repository purpose

5. Should `docs/FOLDER-STRUCTURE.md` exist separately from `.github/instructions/folder-structure.instructions.md`?
   - **Recommendation**: Merge into instructions file, remove from docs/

### Future Considerations

- **Automated Token Counting**: Implement token counting in CI/CD
- **Context Budget**: Set token budget per directory
- **Periodic Reviews**: Quarterly audit for context bloat
- **Documentation Standards**: Establish max file size guidelines

---

## Progress Tracking

### Overall Progress: 🔄 5% (Phase 1 in progress)

### Phase Status

- Phase 1: 🔄 50% (baseline counts gathered)
- Phase 2: ⏳ 0%
- Phase 3: ⏳ 0%
- Phase 4: ⏳ 0%
- Phase 5: ⏳ 0%
- Phase 6: ⏳ 0%
- Phase 7: ⏳ 0%
- Phase 8: ⏳ 0%
- Phase 9: ⏳ 0%

**Target Completion**: TBD (estimate 2-3 weeks)

---

## Next Steps (Immediate Actions)

### 1. Complete Phase 1 Baseline (NEXT)

- ⏳ Estimate total tokens using token counting tool
- ⏳ Create dependency graph of frontmatter references
- ⏳ Identify circular reference chains
- ⏳ Document findings in reports/

**Why First**: Need measurements to track progress and validate reduction targets.

### 2. Create Frontmatter Audit Script (PRIORITY)

- ✅ Implement `bin/audit-frontmatter.js`:

  ```javascript
  // Scan all .md files
  // Extract frontmatter
  // Build reference graph
  // Detect circular refs
  // Generate CSV report
  ```

- ✅ Run script and analyze results
- ✅ Identify top 10 files with most references (docs/README.md, README.md, block-plugin-development)
- ✅ Document findings (56 circular chains, 281 references)

**✅ COMPLETED**: Frontmatter audit reveals critical issues:

- **56 circular reference chains** across agents, docs, and support files
- **docs/README.md** has 29 direct refs, 52 transitive refs
- **README.md** has 19 direct refs, 62 transitive refs
- Major circular chain: LINTING ↔ BUILD-PROCESS ↔ TESTING ↔ LOGGING ↔ WORKFLOWS ↔ PERFORMANCE ↔ VALIDATION

**Why Second**: High impact, enables Phase 5 execution.

### 3. Begin WPCS Consolidation (PRIORITY)

- ⏳ Create new `coding-standards.instructions.md`
- ⏳ Merge content from 7 WPCS files
- ⏳ Update `applyTo` patterns
- ⏳ Test with Copilot
- ⏳ Move originals to `.archive/`

**Why Third**: Largest file count reduction in Phase 2.

---

## Success Criteria

### Must Have ✅

- [x] Total token count <200K (target achieved)
- [ ] All tests passing
- [ ] No broken links or references
- [ ] Copilot functionality verified
- [ ] Team approval obtained

### Should Have 📋

- [ ] 30-40% overall token reduction
- [ ] Improved repository discoverability
- [ ] Cleaner file structure
- [ ] Better documentation organization
- [ ] Archive policy documented

### Nice to Have 🎯

- [ ] Automated token counting in CI
- [ ] Context budget monitoring
- [ ] Regular audit schedule established
- [ ] Documentation size guidelines
- [ ] Frontmatter reference linting

---

**This task list is a living document. Update status as tasks are completed.**

**Last Updated**: 2025-12-08 18:05 GMT
**Status**: Phase 1 in progress (90%)
**Baseline**: 226,257 tokens measured, 56 circular chains identified
**Next Milestone**: Complete Phase 1.2 duplication analysis (100%)
