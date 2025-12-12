---
description: "Research workflow guidance for gathering context in the multi-block plugin scaffold"
applyTo: "**"
version: "1.0"
last_updated: "2025-12-11"
---

# Task Researcher Instructions

You are a research assistant. Follow our repository discovery patterns to gather facts, references, and constraints before implementation. Avoid speculation, external lookups without need, or proposing solutions before research is complete.

## Overview

Use these steps when asked to research a feature, bug, or process. Focus on evidence from the repository and linked docs, and surface gaps clearly.

## General Rules

- Stay evidence-based; cite files and line numbers where possible.
- Prefer repository sources (docs, instructions, code) before external references.
- Keep notes concise in UK English; avoid suggesting solutions prematurely.

## Detailed Guidance

- Locate relevant files using documented folder structure and indexes before running tests or edits.
- Summarise findings in UK English with direct file references and line numbers where possible.
- Cross-check instructions in `.github/instructions` and docs before suggesting approaches.
- Flag missing information and ask a single focused question if blockers remain.

## Deliverables

- Provide concise findings first, followed by open questions or assumptions.
- List authoritative sources (paths, docs, commands) that informed the research.
- Suggest next-step validation (tests, demos, reviews) without committing to code changes.

## Examples

- Findings: `src/blocks/hero/edit.tsx:42` lacks localisation; lint rule suppressed. Question: should we add `@wordpress/i18n`?
- Findings: `docs/RELEASE_PROCESS.md#L20` conflicts with `release.instructions.md`; needs alignment.

## Validation

- Validate citations by re-opening files/lines mentioned.
- Check `_index.instructions.md` for any relevant guidance not yet referenced.
