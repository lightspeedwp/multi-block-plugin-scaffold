---
title: Project Management Directory
description: Central hub for active project work, task tracking, and completed projects
category: Project Management
type: Directory Index
audience: Maintainers, Contributors
date: 2025-12-09
---

# Central Hub for Project Management

Central repository for all active and completed project work, task tracking, and planning documentation.

## Directory Structure

```text
.github/project/
├── README.md              # This file
├── active/                # Currently active projects and sprint work
│   ├── CHAIN-REDUCTION-TASKS.md
│   ├── CONTEXT_REDUCTION_TASKS.md
│   └── ... (ongoing work)
└── completed/             # Archived completed projects
    └── ... (historical reference)
```

## Quick Reference

### Active Projects

**[CHAIN-REDUCTION-TASKS.md](./active/CHAIN-REDUCTION-TASKS.md)** (Phase 1, Step 3 in progress)

- Goal: Reduce documentation reference chains from 56 to <10
- Status: 70% complete (39 of 56 chains eliminated)
- Started: 2025-12-07
- Token budget: 55K used, 110K remaining

**[CONTEXT_REDUCTION_TASKS.md](./active/CONTEXT_REDUCTION_TASKS.md)** (Phase 1, audit complete)

- Goal: Reduce context bloat from 226K to <200K tokens
- Status: 5% complete (baseline measurements gathered)
- Started: 2025-12-08
- Baseline: 226,257 tokens measured

### Completed Projects

Archived projects are moved to `completed/` directory after completion. See individual project files for historical documentation.

## When to Create Project Files Here

### Use This Directory When

✅ DO create files here for

- Active sprint/phase tracking (numbered steps, progress checkboxes)
- Multi-week project planning with timeline
- Ongoing task lists with status tracking
- Project-specific issue tracking or milestone work
- Time-bounded work with completion criteria

### Don't Create Files Here For

❌ DON'T create files here for

- Point-in-time analysis results → Use `reports/` instead
- Permanent documentation → Use `docs/` instead
- Code rules/standards → Use `.github/instructions/` instead
- Reusable prompt templates → Use `.github/prompts/` instead
- AI agent specifications → Use `.github/agents/` instead

## File Format Standards

All project tracking files MUST follow this format:

### Frontmatter (Required)

```yaml
---
title: Project Title
description: One-sentence summary
category: Project Management
type: Task List|Project Plan|Sprint Tracking
audience: Maintainers|Contributors|Team
date: YYYY-MM-DD
status: Active|Planning|Paused|Completed
started: YYYY-MM-DD
target_completion: YYYY-MM-DD (if applicable)
---
```

### Structure

1. **Project Context** - Brief overview
2. **Status Summary** - Current state and progress
3. **Phases/Milestones** - Organized work breakdown
4. **Task Lists** - Checkboxes with clear status
5. **Timeline** - Estimated schedule
6. **Success Criteria** - Completion metrics
7. **Session Notes** - Progress tracking

### Status Indicators

- ✅ Complete
- 🔄 In Progress
- ⏳ Pending / Not Started
- 🔥 High Priority
- ⚠️ Blocked/At Risk
- 📋 Medium Priority
- 📌 Low Priority / Nice to Have

## Organizing Active Projects

### Naming Convention

```text
{SCOPE}-{DESCRIPTION}-TASKS.md
```

#### Examples

- `CHAIN-REDUCTION-TASKS.md` - Breaking documentation reference chains
- `CONTEXT_REDUCTION_TASKS.md` - Reducing overall context size
- `TOKEN-OPTIMIZATION-SPRINT.md` - Token budget optimization
- `DEPENDENCY-CLEANUP-TASKS.md` - Removing/consolidating dependencies

### File Size Guidelines

- **Recommended**: 2,000-8,000 tokens per file
- **Maximum**: 10,000 tokens (break into multiple files)
- **Minimum**: 1,000 tokens (consolidate with related work)

## Moving to Completed

When a project is finished:

1. ✅ Mark all tasks as complete
2. ✅ Add completion summary at top
3. ✅ Update `completed_date` in frontmatter
4. ✅ Move file from `active/` to `completed/`
5. ✅ Create completion report in `reports/` if significant work
6. ✅ Update this README with summary link

**Example Completion Summary:**

```markdown
## Completion Summary

**Status**: ✅ COMPLETED

**Date Completed**: 2025-12-15
**Total Duration**: 6 days
**Effort**: 28 hours
**Results**: 
- 56 circular reference chains → 0 (100% elimination)
- 39 of 56 chains broken in Phase 1
- Remaining work prepared for Phase 2

**Deliverables**:
- Breaking circular reference chains complete
- Documentation hierarchy established
- Token budget target achieved: 226K → 200K tokens

**See Also**: [CHAIN-REDUCTION-REPORT.md](../../reports/CHAIN-REDUCTION-REPORT.md)
```

## Project Management Workflow

### For Project Creators (Copilot/Contributors)

1. **Planning Phase**

   - [ ] Create feature branch: `git checkout -b feature/project-name`
   - [ ] Create file in `.github/project/active/`
   - [ ] Use template format above
   - [ ] Commit: `git add .github/project/active/filename.md && git commit -m "project: add task list for [project]"`

2. **Execution Phase**

   - [ ] Update progress daily/weekly
   - [ ] Update timestamps and metrics
   - [ ] Commit changes regularly: `git commit -am "project: update progress on [project]"`

3. **Completion Phase**

   - [ ] Mark all tasks complete
   - [ ] Add completion summary
   - [ ] Move to `completed/` directory
   - [ ] Create final report in `reports/` if significant
   - [ ] Commit and merge to main

### For Project Reviewers

- Review projects weekly in `active/` directory
- Check for stalled projects (no updates > 1 week)
- Move completed projects to `completed/`
- Archive old projects (>3 months) to archive structure

## Related Documentation

- **[reports/README.md](../../reports/README.md)** - Point-in-time analysis documents
- **[docs/README.md](../../docs/README.md)** - Permanent documentation
- **[.github/instructions/](../instructions/)** - Coding standards and rules
- **[.github/agents/README.md](../agents/README.md)** - AI agent specifications
- **[CONTRIBUTING.md](../../CONTRIBUTING.md)** - Contribution guidelines

## Guidelines for AI Agents (Copilot)

### When Creating Project Files

### Always Do This

- ✅ Create in `.github/project/active/` directory (NOT root, NOT docs/)
- ✅ Include complete frontmatter with all required fields
- ✅ Use proper status indicators from list above
- ✅ Structure with clear phases/milestones
- ✅ Include success criteria and completion metrics
- ✅ Add session notes for progress tracking
- ✅ Reference this README for guidance

### Never Do This

- ❌ Create task lists in repository root
- ❌ Create in `docs/` directory (reserved for permanent documentation)
- ❌ Create in `reports/` directory (reserved for analysis reports)
- ❌ Skip frontmatter metadata
- ❌ Use ambiguous file names without context
- ❌ Mix project files with permanent documentation

### When Updating Project Files

- Update status section at top with current progress
- Add session notes with timestamps
- Commit changes frequently with descriptive messages
- Move to `completed/` when finished (don't leave in active/)

### Example Prompt for Project Creation

```markdown
When I ask you to create a task list or project plan:

1. Create the file in .github/project/active/ (NOT root)
2. Use the naming convention: {SCOPE}-{DESCRIPTION}-TASKS.md
3. Include complete YAML frontmatter
4. Structure with: Context, Status, Phases, Tasks, Timeline, Criteria
5. Use status indicators (✅, 🔄, ⏳, etc.)
6. Reference this README for format guidelines
7. Commit with message: "project: add task list for [project]"

DO NOT create files in the repository root.
DO NOT skip frontmatter.
DO NOT mix with permanent documentation.
```

---

## Quick Start Examples

### Creating a New Project

```bash
# Create file in correct location
touch .github/project/active/MY-PROJECT-TASKS.md

# Add frontmatter and structure
# See template above

# Commit
git add .github/project/active/MY-PROJECT-TASKS.md
git commit -m "project: add task list for my project"
```

### Completing a Project

```bash
# Move to completed
mv .github/project/active/MY-PROJECT-TASKS.md .github/project/completed/

# Update frontmatter status: Active → Completed
# Add completion summary

# Commit
git add -A
git commit -m "project: mark MY-PROJECT as completed"
```

---

---

**Last Updated**: 2025-12-09
**Version**: 1.0
**Maintainer**: Project Management System

