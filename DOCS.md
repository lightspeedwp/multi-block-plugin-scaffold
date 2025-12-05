# Documentation Index

Comprehensive documentation for the multi-block plugin scaffold.

## Overview

This document serves as the central index for all documentation in the `docs/` directory. The documentation is organized by topic and audience to help you quickly find what you need.

## Quick Start

New to this scaffold? Start here:

1. [GENERATE-PLUGIN.md](docs/GENERATE-PLUGIN.md) - How to create a plugin from this scaffold
2. [README.md](docs/README.md) - Comprehensive documentation index with visual flowcharts
3. [BUILD-PROCESS.md](docs/BUILD-PROCESS.md) - Understanding the build system
4. [SRC-FOLDER-STRUCTURE.md](docs/SRC-FOLDER-STRUCTURE.md) - Source directory organization
5. [API-REFERENCE.md](docs/API-REFERENCE.md) - Complete API documentation

## Documentation Categories

### Getting Started

| Document | Description |
|----------|-------------|
| [README.md](docs/README.md) | Complete documentation index with visual diagrams and workflow guides |
| [GENERATE-PLUGIN.md](docs/GENERATE-PLUGIN.md) | Plugin generation guide using the scaffold system |
| [GENERATOR-SYSTEM.md](docs/GENERATOR-SYSTEM.md) | How the generator system works internally |
| [TEMPLATE-VALIDATION.md](docs/TEMPLATE-VALIDATION.md) | Mustache template validation report |

### Development Guides

| Document | Description |
|----------|-------------|
| [BUILD-PROCESS.md](docs/BUILD-PROCESS.md) | Complete build process with webpack, Babel, and asset compilation |
| [SRC-FOLDER-STRUCTURE.md](docs/SRC-FOLDER-STRUCTURE.md) | Source directory structure and block file organization |
| [INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md) | Translation and localization guide for blocks |
| [TESTING.md](docs/TESTING.md) | Testing guide for PHP, JavaScript, and E2E tests |
| [WORKFLOWS.md](docs/WORKFLOWS.md) | GitHub Actions workflows and CI/CD documentation |

### AI & Automation

| Document | Description |
|----------|-------------|
| [AGENTS.md](docs/AGENTS.md) | AI agents for development automation and code quality |

### API Reference

| Document | Description |
|----------|-------------|
| [API-REFERENCE.md](docs/API-REFERENCE.md) | Complete PHP and JavaScript API reference |

### Security & Database

| Document | Description |
|----------|-------------|
| [SECURITY-NONCE.md](docs/SECURITY-NONCE.md) | Nonce utilities for secure AJAX and form handling |
| [SECURITY-HEADERS.md](docs/SECURITY-HEADERS.md) | Security headers and content security policies |
| [DB-MIGRATION.md](docs/DB-MIGRATION.md) | Database migration system documentation |
| [DEPRECATION.md](docs/DEPRECATION.md) | Deprecation workflow for functions and hooks |

### Performance & Quality

| Document | Description |
|----------|-------------|
| [PERFORMANCE.md](docs/PERFORMANCE.md) | Performance monitoring with Lighthouse CI and bundle analysis |
| [TOOL-CONFIGS.md](docs/TOOL-CONFIGS.md) | Overview of all development tools and their purposes |

## Tool Configuration (docs/config/)

Detailed configuration documentation for each development tool:

### Build Tools

| Document | Description |
|----------|-------------|
| [webpack.md](docs/config/webpack.md) | Module bundling configuration and optimization |
| [babel.md](docs/config/babel.md) | JavaScript transpilation setup |
| [postcss.md](docs/config/postcss.md) | CSS processing and optimization |
| [wp-scripts.md](docs/config/wp-scripts.md) | WordPress scripts build system |

### Code Quality Tools

| Document | Description |
|----------|-------------|
| [eslint.md](docs/config/eslint.md) | JavaScript linting rules and configuration |
| [stylelint.md](docs/config/stylelint.md) | CSS/SCSS linting rules and configuration |
| [prettier.md](docs/config/prettier.md) | Code formatting rules and setup |
| [npm-package-json-lint.md](docs/config/npm-package-json-lint.md) | Package.json validation and standards |

### Testing Tools

| Document | Description |
|----------|-------------|
| [jest.md](docs/config/jest.md) | JavaScript unit testing configuration |
| [playwright.md](docs/config/playwright.md) | End-to-end testing setup and usage |

### Configuration Index

| Document | Description |
|----------|-------------|
| [README.md](docs/config/README.md) | Index of all tool configuration documentation |

## Common Tasks

### Development Workflow

```bash
# Start development server with watch mode
npm run start

# Build for production
npm run build

# Run all linters
npm run lint

# Run all tests
npm run test
```

### Code Quality

```bash
# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Lint PHP
composer run lint

# Format all files
npm run format
```

### Testing

```bash
# JavaScript unit tests
npm run test:js

# End-to-end tests
npm run test:e2e

# PHP tests
composer run test
```

### Internationalization

```bash
# Generate .pot file for translations
npm run makepot

# Generate JSON translations for JavaScript
npm run make-json
```

## Prerequisites

- **Node.js**: 18.0+ and npm 9.0+
- **PHP**: 8.0+
- **WordPress**: 6.0+
- **Composer**: 2.0+ (for PHP dependencies)

## Related Documentation

- [README.md](README.md) - Main project README
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development setup guide
- [USAGE.md](USAGE.md) - Usage instructions
- [SUPPORT.md](SUPPORT.md) - Support resources

## Official WordPress Resources

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [Block API Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)

## Contributing to Documentation

When contributing documentation:

1. Follow the frontmatter structure in existing docs
2. Update this index when adding new documentation
3. Use clear, concise language
4. Include code examples where appropriate
5. Add Mermaid diagrams for complex workflows
6. Test all code examples before committing
