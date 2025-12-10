---
project: "Instruction Files Consolidation"
created: 2025-12-10
status: active
priority: high
estimated_impact: "30-35% file reduction, 20-22% size reduction"
tags: [documentation, optimization, maintenance]
---

# Instruction Files Consolidation - Implementation Tasks

**Project Goal:** Consolidate 28 instruction files to 18-20 files, reducing duplication and improving maintainability.

**Related Report:** [.github/reports/instruction-consolidation-audit-2025-12-10.md](../reports/instruction-consolidation-audit-2025-12-10.md)

---

## Phase 1: High-Impact Consolidations (PRIORITY)

### Task Group 1: Block Development Files Consolidation
**Impact:** 6 files → 2-3 files (~33% reduction in this group)

#### Task 1.1: Create `blocks-development.instructions.md`
- [ ] Create new file: `.github/instructions/blocks-development.instructions.md`
- [ ] Add comprehensive YAML frontmatter
- [ ] Merge content from:
  - `blocks.instructions.md` (core block patterns)
  - `block-plugin-development.instructions.md` (development workflow)
  - Relevant sections from `block-plugin.instructions.md` (scaffolding)
- [ ] Structure sections:
  - Overview and core principles
  - Block registration with block.json
  - Edit component patterns
  - Save component patterns
  - Block supports and attributes
  - Block variations and transforms
  - Dynamic blocks and PHP rendering
  - Testing and validation
- [ ] Add clear examples from best file
- [ ] Cross-reference wpcs-* files appropriately
- [ ] Validate no content loss

**Estimated Time:** 2-3 hours

---

#### Task 1.2: Create `patterns-and-templates.instructions.md`
- [ ] Create new file: `.github/instructions/patterns-and-templates.instructions.md`
- [ ] Add YAML frontmatter with proper applyTo
- [ ] Merge content from:
  - `patterns.instructions.md`
  - `pattern-development.instructions.md`
- [ ] Structure sections:
  - Pattern structure and authoring
  - Pattern registration
  - Advanced pattern assignment (post types, templates, block types)
  - Template patterns vs page patterns
  - Pattern categories and organization
  - Best practices (accessibility, performance, reusability)
  - Usage in templates and template parts
- [ ] Consolidate examples (remove duplicates)
- [ ] Update references and links

**Estimated Time:** 1-2 hours

---

#### Task 1.3: Evaluate `block-json.instructions.md`
- [ ] Review if `block-json.instructions.md` should remain standalone
- [ ] Decision point:
  - **OPTION A:** Keep as focused block.json reference (RECOMMENDED)
  - **OPTION B:** Merge into `blocks-development.instructions.md`
- [ ] If keeping: ensure no duplication with new `blocks-development.instructions.md`
- [ ] If merging: move all content to appropriate sections

**Estimated Time:** 30 minutes - 1 hour

---

#### Task 1.4: Delete old block development files
- [ ] Backup files before deletion (git commit)
- [ ] Delete `block-plugin-development.instructions.md`
- [ ] Delete `block-plugin.instructions.md`
- [ ] Delete `blocks.instructions.md`
- [ ] Delete `patterns.instructions.md`
- [ ] Delete `pattern-development.instructions.md`
- [ ] Verify git history preserved

**Estimated Time:** 15 minutes

---

### Task Group 2: Security Files Consolidation
**Impact:** 2 files → 0-1 files

#### Task 2.1: Merge `wp-security.instructions.md` into `wpcs-php.instructions.md`
- [ ] Open `wpcs-php.instructions.md`
- [ ] Add new section: "Security Best Practices" (if not already comprehensive)
- [ ] Integrate content from `wp-security.instructions.md`:
  - Sanitize inputs (already covered, enhance if needed)
  - Escape outputs (already covered, enhance if needed)
  - Nonces & capabilities (already covered, enhance if needed)
  - SQL injection prevention (already covered, enhance if needed)
  - Client data validation (add if missing)
- [ ] Verify no content loss
- [ ] Delete `wp-security.instructions.md`

**Estimated Time:** 30 minutes - 1 hour

---

#### Task 2.2: Evaluate `security.instructions.md` standalone status
- [ ] Review if `security.instructions.md` should merge into `wpcs-php.instructions.md`
- [ ] Decision point:
  - **OPTION A:** Keep standalone as comprehensive security guide
  - **OPTION B:** Merge into `wpcs-php.instructions.md` (since it's PHP-focused)
  - **RECOMMENDATION:** Keep standalone - it's well-structured and block-plugin specific
- [ ] If keeping: ensure cross-reference to wpcs-php
- [ ] If merging: integrate all content carefully

**Estimated Time:** 30 minutes - 1 hour

---

### Task Group 3: JavaScript/React Files Consolidation
**Impact:** 2 files → 1 file (~35% reduction in this group)

#### Task 3.1: Analyze content overlap between JS files
- [ ] Create comparison matrix of `javascript-react.instructions.md` vs `js-react.instructions.md`
- [ ] Identify unique content in each file
- [ ] Identify best examples and patterns from each
- [ ] Document decision rationale

**Estimated Time:** 30 minutes

---

#### Task 3.2: Create consolidated `javascript-react.instructions.md`
- [ ] Determine which file to use as base (recommend `js-react.instructions.md` - more comprehensive)
- [ ] Merge unique content from other file
- [ ] Structure comprehensive sections:
  - Core principles and WordPress packages
  - File organization and naming
  - Block structure and registration
  - Component development (edit/save)
  - React hooks (useState, useEffect, useCallback, etc.)
  - WordPress hooks (useSelect, useDispatch)
  - State management
  - Internationalization (i18n)
  - Accessibility patterns
  - Security and escaping
  - Data fetching (REST API, data stores)
  - Testing (Jest, React Testing Library)
  - Performance optimization
  - Common patterns
- [ ] Remove duplicate examples
- [ ] Ensure consistent code style
- [ ] Add clear section navigation

**Estimated Time:** 2-3 hours

---

#### Task 3.3: Evaluate relationship with `wpcs-javascript.instructions.md`
- [ ] Review overlap with `wpcs-javascript.instructions.md`
- [ ] Decision point:
  - **OPTION A:** Keep both (wpcs = standards, js-react = patterns/implementation)
  - **OPTION B:** Merge React content into wpcs-javascript
  - **RECOMMENDATION:** Keep both - wpcs is coding standards, js-react is implementation patterns
- [ ] Ensure clear differentiation in frontmatter
- [ ] Add cross-references between files

**Estimated Time:** 30 minutes

---

#### Task 3.4: Delete redundant JS/React file
- [ ] Backup before deletion
- [ ] Delete `javascript-react.instructions.md` OR `js-react.instructions.md` (whichever wasn't used as base)
- [ ] Verify consolidated file has all content

**Estimated Time:** 15 minutes

---

## Phase 2: Medium-Impact Consolidations

### Task Group 4: Testing Files Consolidation
**Impact:** 2 files → 1 file

#### Task 4.1: Create `testing.instructions.md`
- [ ] Create new file: `.github/instructions/testing.instructions.md`
- [ ] Add comprehensive YAML frontmatter
- [ ] Merge content from:
  - `playwright.instructions.md` (overview)
  - `playwright-typescript.instructions.md` (detailed patterns)
- [ ] Structure sections:
  - Overview of testing strategy
  - **E2E Testing with Playwright**
    - Setup and configuration
    - Test structure and organization
    - Writing tests (TypeScript)
    - Locators and assertions
    - Best practices
    - Example test patterns
  - **Unit Testing** (if applicable - add Jest guidance)
    - Component testing
    - Utility function testing
  - Testing checklist
  - Quality standards
- [ ] Consolidate examples
- [ ] Add execution strategy

**Estimated Time:** 1-2 hours

---

#### Task 4.2: Delete old testing files
- [ ] Backup before deletion
- [ ] Delete `playwright.instructions.md`
- [ ] Delete `playwright-typescript.instructions.md`
- [ ] Verify consolidated file complete

**Estimated Time:** 15 minutes

---

## Phase 3: Validation & Documentation

### Task Group 5: Cross-Reference Updates

#### Task 5.1: Update internal file references
- [ ] Search all remaining instruction files for references to deleted files
- [ ] Update references to point to new consolidated files:
  - `block-plugin-development.instructions.md` → `blocks-development.instructions.md`
  - `blocks.instructions.md` → `blocks-development.instructions.md`
  - `patterns.instructions.md` → `patterns-and-templates.instructions.md`
  - `pattern-development.instructions.md` → `patterns-and-templates.instructions.md`
  - `javascript-react.instructions.md` / `js-react.instructions.md` → `javascript-react.instructions.md`
  - `playwright*.instructions.md` → `testing.instructions.md`
- [ ] Verify no broken links

**Estimated Time:** 1 hour

---

#### Task 5.2: Update README.md index
- [ ] Open `.github/instructions/README.md`
- [ ] Update file listing to reflect new structure
- [ ] Add categories if not present:
  - WordPress Coding Standards (wpcs-*)
  - Block Development
  - Testing
  - Security
  - Project Management
- [ ] Document consolidation changes

**Estimated Time:** 30 minutes

---

### Task Group 6: Testing & Validation

#### Task 6.1: Validate with AI assistant
- [ ] Test consolidated files with Claude/Copilot
- [ ] Verify context loading works correctly
- [ ] Check for any missing critical information
- [ ] Validate applyTo patterns work correctly

**Estimated Time:** 1 hour

---

#### Task 6.2: Manual content review
- [ ] Review each consolidated file for:
  - Completeness (no content loss)
  - Clarity (no confusing duplicates)
  - Structure (logical flow)
  - Examples (working code)
  - Cross-references (valid links)
- [ ] Fix any issues found

**Estimated Time:** 2 hours

---

## Phase 4: Optional Enhancements

### Task Group 7: Project Management Instructions (OPTIONAL)

#### Task 7.1: Create `project-management.instructions.md`
- [ ] Create new file: `.github/instructions/project-management.instructions.md`
- [ ] Add YAML frontmatter
- [ ] Document:
  - Task list file naming: `YYYY-MM-DD-task-name.md`
  - Required frontmatter structure
  - Task formatting standards
  - Active vs completed workflow
  - How to move tasks between folders
  - Integration points (if any)
- [ ] Add examples

**Estimated Time:** 1 hour

---

## Completion Checklist

Before marking this project complete:

- [ ] All Phase 1 tasks completed
- [ ] All Phase 2 tasks completed
- [ ] All Phase 3 validation tasks completed
- [ ] No broken references
- [ ] All deleted files backed up in git history
- [ ] File count reduced from 28 to 18-20
- [ ] Context size reduced by ~20-22%
- [ ] Team review completed (if applicable)
- [ ] This task list moved to `.github/projects/completed/`

---

## Rollback Plan

If issues arise:

1. **Git Rollback:**
   ```bash
   git log --oneline .github/instructions/
   git checkout <commit-hash> .github/instructions/
   ```

2. **Individual File Recovery:**
   ```bash
   git show <commit-hash>:.github/instructions/<file> > .github/instructions/<file>
   ```

3. **Verify restoration:**
   - Check file count
   - Validate content
   - Test with AI assistant

---

## Success Metrics

### Quantitative
- [x] File count: 28 → 18-20 (target: 18-20 files)
- [x] Total size: ~450KB → ~350-370KB (target: ~20-22% reduction)
- [x] Duplicate content eliminated: ~80KB duplicate content removed

### Qualitative
- [ ] Clearer file organization
- [ ] Reduced context load for AI
- [ ] Easier to maintain
- [ ] No loss of critical information
- [ ] Improved cross-referencing

---

## Notes & Decisions

### Decision Log

**Decision 1: Keep `block-json.instructions.md` separate**
- Rationale: Well-structured, focused reference
- Date: 2025-12-10
- Decided by: Initial audit

**Decision 2: Keep `security.instructions.md` separate from wpcs-php**
- Rationale: Block-plugin specific, comprehensive guide
- Date: 2025-12-10
- Decided by: Initial audit

**Decision 3: Keep `javascript-react.instructions.md` separate from wpcs-javascript**
- Rationale: Different purposes (standards vs patterns)
- Date: 2025-12-10
- Decided by: Initial audit

---

## Timeline Estimate

**Total Estimated Time:** 12-18 hours

### Breakdown
- **Phase 1 (High-Impact):** 6-9 hours
- **Phase 2 (Medium-Impact):** 2-3 hours
- **Phase 3 (Validation):** 4-5 hours
- **Phase 4 (Optional):** 1 hour

### Recommended Schedule
- **Day 1:** Phase 1, Task Groups 1-2 (block dev + security)
- **Day 2:** Phase 1, Task Group 3 (JS/React) + Phase 2 (testing)
- **Day 3:** Phase 3 (validation) + optional enhancements

---

**Status:** Active
**Last Updated:** 2025-12-10
**Next Review:** After Phase 1 completion
