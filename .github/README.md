---
title: GitHub Configuration
description: GitHub-specific configuration files
category: Project
type: Index
audience: Developers
date: 2025-12-01
---

# GitHub Configuration

This directory contains GitHub-specific configuration files for the {{name}} multi-block plugin.

## Contents

- **agents/** - AI agent configurations for automated development tasks
- **chatmodes/** - Custom chat mode configurations for AI assistants
- **instructions/** - Development instructions and guidelines for AI tools
- **prompts/** - Reusable prompt templates for AI-assisted development
- **workflows/** - GitHub Actions CI/CD workflow definitions

## Workflows

| Workflow | Description |
|----------|-------------|
| `ci-cd.yml` | Main CI/CD pipeline (lint, test, security audit, E2E) |
| `code-quality.yml` | Code coverage, quality gates, bundle analysis |
| `deploy-wporg.yml` | Automated WordPress.org SVN deployment |
| `release.yml` | Version bumping, changelog generation, releases |
| `performance.yml` | Lighthouse CI and bundle size monitoring |

## Purpose

These files enable:

- Automated build and test workflows
- Code coverage tracking with Codecov
- Quality gates for PRs
- AI-assisted multi-block development with context-specific instructions
- Consistent code review and quality checks
- Automated release and deployment processes
- WordPress.org plugin directory deployment

## Usage

These files are automatically used by GitHub Actions and compatible AI development tools. They are excluded from plugin distribution packages.
