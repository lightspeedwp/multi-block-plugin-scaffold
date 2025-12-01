---
title: Workflows Directory
description: CI/CD workflow automation and configuration
category: Project
type: Index
audience: Developers
date: 2025-12-01
---

# GitHub Actions Workflows

This directory contains GitHub Actions workflow definitions for CI/CD automation.

## Workflows

| Workflow | Description |
|----------|-------------|
| **agent-workflow.yml** | AI agent automation workflow for GitHub Copilot |
| **ci-cd.yml** | Continuous integration and deployment workflow |
| **code-quality.yml** | Code coverage, bundle analysis, and quality metrics |
| **deploy-wporg.yml** | WordPress.org plugin directory deployment |
| **performance.yml** | Lighthouse CI and bundle size monitoring |
| **release.yml** | Automated release management and changelog generation |

## Purpose

These workflows automate:

- Building multi-block assets on push/PR
- Running automated block tests (unit, integration, E2E)
- Code quality checks (linting, formatting)
- Code coverage collection and reporting (Codecov)
- Bundle size analysis and tracking
- Plugin version management and releases
- WordPress.org directory deployment
- Block registration validation

## Workflow Details

### ci-cd.yml

Main CI/CD pipeline running on every push and PR:

- PHP/JS linting and formatting
- Unit tests (PHPUnit, Jest)
- E2E tests (Playwright)
- Block validation

### code-quality.yml

Code quality metrics and analysis:

- Test coverage with Codecov integration
- Bundle size analysis with size limits
- Lint result summaries

### deploy-wporg.yml

WordPress.org plugin directory deployment:

- Triggered on GitHub releases
- SVN sync to WordPress.org
- Asset and readme updates

### release.yml

Automated release management:

- Semantic versioning
- Changelog generation
- GitHub release creation

### performance.yml

Performance monitoring:

- Lighthouse CI testing
- Bundle size analysis
- Performance budget checks

## Triggers

| Trigger | Workflows |
|---------|-----------|
| Push to main/develop | ci-cd.yml, code-quality.yml |
| Pull request | ci-cd.yml, code-quality.yml |
| Release published | deploy-wporg.yml |
| Manual dispatch | release.yml, agent-workflow.yml |

## Configuration

Required repository secrets:

- `CODECOV_TOKEN` - Codecov upload token
- `SVN_USERNAME` - WordPress.org SVN username
- `SVN_PASSWORD` - WordPress.org SVN password

## Usage

GitHub Actions automatically executes these workflows based on configured triggers. Check individual workflow files for specific configuration details.
