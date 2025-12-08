---
title: PHP Instruction Files Consolidation Analysis
description: Analysis of overlap and consolidation opportunities in PHP instruction files
category: Analysis
type: Report
audience: Developers
date: 2025-12-07
context: Review of redundancy in .github/instructions/ PHP-related files
---

# PHP Instruction Files Consolidation Analysis

## Executive Summary

**Status**: Analysis complete - Consolidation strategy clarification needed

**Key Finding**: Four PHP-related instruction files contain significant overlap in content and scope. User preference to keep "all wpcs-* files separate" contradicts request to merge wpcs-php-docs.instructions.md, requiring clarification.

**Files Analyzed**:

- `php-block.instructions.md` (~200 lines) - Block/pattern-specific PHP
- `php-wordpress.instructions.md` (~500 lines) - General WordPress PHP
- `wpcs-php.instructions.md` (~670 lines) - WordPress PHP Coding Standards (main)
- `wpcs-php-docs.instructions.md` (~930 lines) - PHP DocBlock/inline documentation

**Recommendation**: Clarify consolidation scope before proceeding with file merges.

---

## File Analysis

### 1. php-block.instructions.md

**Purpose**: Block and theme pattern-specific PHP development guidance

**Scope** (~200 lines):

- Pattern registration with `register_block_pattern()`
- Naming conventions (e.g., `lsx/[category]-[name]`)
- Translation/i18n for patterns
- Security and escaping in pattern context
- Asset management for blocks
- Performance considerations

**Key Content**:

- Pattern registration syntax and examples
- Block pattern best practices
- Consistent naming for discoverability
- Viewport sizing guidelines
- Translation domain usage

**Status**: Highly specialized - covers ONLY block patterns and theme setup

**Overlap with**:

- `wpcs-php.instructions.md` - General pattern registration section
- `php-wordpress.instructions.md` - Some pattern patterns mentioned

---

### 2. php-wordpress.instructions.md

**Purpose**: General WordPress PHP development guidelines and best practices

**Scope** (~500 lines):

- File structure and organization
- Security (escaping, sanitization, nonces) with code examples
- Database operations (prepared statements, get_posts)
- Internationalization/i18n
- Error handling and logging
- Performance optimization
- WordPress hooks (add_action, add_filter, do_action, apply_filters)
- Class-based code with singleton pattern
- Block registration (`register_block_type`)
- REST API endpoints with permission callbacks

**Key Content**:

- Comprehensive code examples for security patterns
- Database query best practices
- Hook registration patterns
- OOP class structure recommendations
- Block registration examples
- REST API endpoint examples

**Status**: Broad coverage of general WordPress PHP patterns

**Overlap with**:

- `wpcs-php.instructions.md` - Covers many same topics (~80% overlap)
- `php-block.instructions.md` - Block registration sections
- `wpcs-php-docs.instructions.md` - Some documentation references

---

### 3. wpcs-php.instructions.md

**Purpose**: WordPress PHP Coding Standards (WPCS) - Primary standards reference

**Scope** (~670 lines):

- Mission: Ensure PHP follows WordPress conventions for style, security, i18n, performance
- Language/frameworks (PHP 7.4+)
- Project structure
- Coding standards (indentation, brace styles, Yoda conditions, escaping)
- Security (CSRF, nonces, sanitization)
- i18n (translatable strings with text domain)
- Testing & quality (PHPCS, PHPUnit)
- Performance & caching
- **Extensive DocBlock documentation** (Summary, Description, @since, Line wrapping, etc.)
- Formatting examples (functions, classes, hooks, etc.)
- PHPDoc tags reference table
- Pattern registration (from php-block.instructions.md)
- Translation/i18n
- Asset management
- Block pattern best practices

**Key Content**:

- Complete PHPCS/WPCS standards reference
- Comprehensive inline documentation guidelines
- DocBlock examples for all element types
- PHPDoc tags reference (17 tags documented)
- Code quality checklist
- Resources and references

**Status**: Primary standards document with comprehensive coverage

**Contains**:

- All essential PHPDoc documentation (duplicating wpcs-php-docs.instructions.md content)
- Pattern registration details (from php-block.instructions.md)
- General coding standards

**Overlap**:

- ~70% overlap with `php-wordpress.instructions.md`
- ~60% overlap with `wpcs-php-docs.instructions.md` (both cover DocBlocks extensively)
- ~40% overlap with `php-block.instructions.md` (pattern sections)

---

### 4. wpcs-php-docs.instructions.md

**Purpose**: PHP Inline Documentation (DocBlocks) standards - Comprehensive reference

**Scope** (~930 lines):

- Mission: Ensure every PHP function, class, hook has proper DocBlock
- Language/frameworks (PHP with WordPress APIs, phpDocumentor)
- Coding standards for DocBlocks
- Testing & quality (PHPCS WordPress-Docs ruleset)
- **Best Practices**: Formatting, content, WordPress-specific patterns
- **DocBlock Formatting Examples**:
  - Functions & class methods (with detailed syntax)
  - Parameters as arrays (special formatting)
  - Deprecated functions
  - Classes (DocBlocks + properties + constants)
  - Requires and includes
  - Hooks (actions and filters with special rules)
  - Inline comments (single-line and multi-line)
  - File headers
  - Constants
- **PHPDoc Tags Reference**: 17 tags with usage and description
- **Common Patterns**: WordPress hooks, functions, classes

**Key Content**:

- Comprehensive DocBlock syntax documentation
- 17 PHPDoc tags fully documented with examples
- Special handling for deprecated functions
- Hook documentation patterns
- File header requirements
- Language and grammar guidelines for documentation

**Status**: Specialized documentation-focused reference (930 lines entirely about DocBlocks)

**Unique Content**:

- Most comprehensive DocBlock reference
- Grammar and language guidelines
- Tag usage patterns table
- Deprecated function patterns
- File header template examples

**Overlap with**:

- `wpcs-php.instructions.md` - Covers ~60% of same DocBlock content but less comprehensively

---

## Overlap Matrix

| Aspect | php-block | php-wordpress | wpcs-php | wpcs-php-docs |
|--------|-----------|---------------|----------|---------------|
| **Block patterns** | ✓✓ (primary) | ✓ (secondary) | ✓ (secondary) | - |
| **General WordPress PHP** | - | ✓✓ (primary) | ✓✓ (primary) | - |
| **Coding standards** | - | ✓ (secondary) | ✓✓ (primary) | - |
| **DocBlock formatting** | - | - | ✓ (secondary) | ✓✓ (primary) |
| **Security patterns** | ✓ (context) | ✓✓ (primary) | ✓✓ (primary) | - |
| **Code examples** | ✓ (patterns) | ✓✓ (many) | ✓ (some) | ✓ (DocBlocks) |

---

## Consolidation Options

### Option A: Maintain Separation (Keep All Files)

**Pros**:

- Each file has clear, focused scope
- Less overwhelming for readers seeking specific information
- Reduces maintenance complexity
- Aligns with user preference for WPCS separation

**Cons**:

- Content duplication across files
- More files to maintain and update
- Risk of inconsistent standards across files

**Recommendation for**: Readers who prefer focused, specialized documents

---

### Option B: Consolidate Into wpcs-php.instructions.md

**Scope**: Merge php-block.instructions.md and php-wordpress.instructions.md into wpcs-php.instructions.md

**Process**:

1. Keep wpcs-php.instructions.md as primary standards document
2. Add missing content from php-wordpress.instructions.md
3. Integrate pattern registration from php-block.instructions.md
4. Delete php-wordpress.instructions.md and php-block.instructions.md

**Result**: Single comprehensive PHP standards file

**Impact**:

- ✓ Reduces file count from 4 to 2
- ✓ Eliminates redundancy between php-wordpress and wpcs-php
- ✗ Creates very large file (~1100+ lines)
- ✗ Contradicts user preference for WPCS file separation
- ✗ wpcs-php-docs.instructions.md remains as separate specialized document

**Not Recommended**: User stated WPCS files should stay separate

---

### Option C: Consolidate php-* Files Only

**Scope**: Merge php-block.instructions.md and php-wordpress.instructions.md into wpcs-php.instructions.md

**Process**:

1. Merge content from php-wordpress.instructions.md into wpcs-php.instructions.md
2. Integrate pattern sections from php-block.instructions.md
3. Keep wpcs-php-docs.instructions.md as separate documentation standard
4. Delete php-wordpress.instructions.md and php-block.instructions.md

**Result**:

- wpcs-php.instructions.md (~1100 lines) - Primary PHP standards
- wpcs-php-docs.instructions.md (~930 lines) - Specialized DocBlock reference

**Impact**:

- ✓ Reduces file count from 4 to 2
- ✓ Addresses user request about php-* files
- ✓ Keeps WPCS files separate (wpcs-php and wpcs-php-docs)
- ✓ Eliminates redundancy between similar files
- ✗ wpcs-php becomes large but still manageable

**Recommended**: Aligns with user preferences and consolidation goals

---

### Option D: Merge Only wpcs-php-docs into wpcs-php

**Scope**: Merge wpcs-php-docs.instructions.md into wpcs-php.instructions.md (per user's original question)

**Process**:

1. Integrate comprehensive DocBlock documentation from wpcs-php-docs into wpcs-php
2. Keep php-block.instructions.md and php-wordpress.instructions.md separate
3. Delete wpcs-php-docs.instructions.md

**Result**:

- wpcs-php.instructions.md (~1600 lines) - Everything about PHP standards
- php-block.instructions.md (~200 lines) - Block patterns only
- php-wordpress.instructions.md (~500 lines) - General WordPress PHP

**Impact**:

- ✗ Only modest consolidation (1 file merged)
- ✗ Still significant overlap between wpcs-php and php-wordpress
- ✗ Creates very large file (~1600 lines)
- ✗ Contradicts user preference for WPCS file separation
- ✓ Addresses specific request to merge wpcs-php-docs

**Not Recommended**: Doesn't address root consolidation issues; contradicts WPCS separation preference

---

## Recommended Consolidation Strategy

**Recommendation: Option C** - Consolidate php-* files into wpcs-php.instructions.md

### Rationale

1. **User Preference Alignment**: User explicitly stated "All of the files prefixed with 'wpcs-*' should stay separate"
   - This suggests keeping wpcs-php.instructions.md and wpcs-php-docs.instructions.md as separate documents
   - But consolidating php-* files into one of them

2. **Logical Grouping**:
   - `php-block.instructions.md` and `php-wordpress.instructions.md` are both "how to write PHP" documents
   - These should be consolidated into the primary PHP standards document
   - `wpcs-php-docs.instructions.md` is a specialized "how to document PHP" reference - keep separate

3. **File Structure**:
   - Final state: 2 related files instead of 4
   - wpcs-php.instructions.md (consolidated) - Comprehensive PHP standards + blocks/patterns
   - wpcs-php-docs.instructions.md (unchanged) - Specialized DocBlock documentation reference

4. **Eliminates Redundancy**:
   - Removes 80% overlap between php-wordpress.instructions.md and wpcs-php.instructions.md
   - Consolidates all pattern registration guidance in one place
   - Reduces duplicate code examples

### Implementation Steps

1. **Merge php-wordpress.instructions.md** into wpcs-php.instructions.md
   - Extract unique content from php-wordpress not already in wpcs-php
   - Integrate into appropriate sections
   - Update examples and cross-references

2. **Merge php-block.instructions.md** into wpcs-php.instructions.md
   - Integrate pattern registration section
   - Add block-specific best practices
   - Consolidate code examples

3. **Delete Redundant Files**:
   - Delete php-wordpress.instructions.md
   - Delete php-block.instructions.md
   - Keep wpcs-php.instructions.md (updated)
   - Keep wpcs-php-docs.instructions.md (unchanged)

4. **Update References**:
   - Check all `.applyTo` patterns in other instruction files
   - Update any cross-references
   - Update documentation indexes

---

## Files Affected By Consolidation

### To Delete

- `.github/instructions/php-block.instructions.md`
- `.github/instructions/php-wordpress.instructions.md`

### To Update

- `.github/instructions/wpcs-php.instructions.md` - Receive merged content
- Any files that reference the deleted files

### To Keep Unchanged

- `.github/instructions/wpcs-php-docs.instructions.md` - Specialized reference document

---

## Critical Questions for User

Before implementing consolidation, please clarify:

1. **Consolidation Scope**: Do you want to consolidate only the `php-*` files (Option C), or also merge `wpcs-php-docs.instructions.md` (Option D)?

2. **WPCS File Separation**: You mentioned "All of the files prefixed with 'wpcs-*' should stay separate" - does this mean:
   - Keep `wpcs-php.instructions.md` and `wpcs-php-docs.instructions.md` as separate files?
   - Or can we merge them if both are related to PHP standards?

3. **File Size**: Is there a preference for file size?
   - Option C results in ~1100 line consolidated file
   - Option D results in ~1600 line consolidated file
   - Or keep files smaller and separate?

---

## Content Mapping for Consolidation

### From php-wordpress.instructions.md → wpcs-php.instructions.md

The following unique content from php-wordpress.instructions.md should be integrated:

- **File Structure** section (if not in wpcs-php)
- **Database Query Examples** (prepared statements, get_posts)
- **Hook Registration Examples** (add_action, add_filter patterns)
- **REST API Examples** (endpoint registration with permission checks)
- **OOP Class Patterns** (singleton pattern example)
- Any code examples not already present

### From php-block.instructions.md → wpcs-php.instructions.md

All content should be integrated under a "Block and Pattern Development" section:

- Pattern registration using `register_block_pattern()`
- Naming conventions (lsx/[category]-[name])
- Pattern categories and keywords
- ViewportWidth configuration
- Pattern-specific security and escaping
- Asset management for blocks
- Block pattern best practices
- Performance considerations for patterns

---

## Implementation Readiness

**Status**: Ready for implementation once user clarifies consolidation scope

**Blocking Questions**: See "Critical Questions for User" section above

**Estimated Effort**:

- Reading and analysis: 2-3 hours ✓ (Complete)
- Consolidation implementation: 1-2 hours (Pending user decision)
- Testing and verification: 30 minutes

---

## References

- [Instruction Files Index](.github/instructions/README.md)
- [WPCS Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- [Related Discussion in AGENTS.md](AGENTS.md)
