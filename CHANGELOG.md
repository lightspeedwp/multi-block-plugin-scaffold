# Changelog

All notable changes to the Multi-Block Plugin Scaffold will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-10

Initial release of the Multi-Block Plugin Scaffold - a comprehensive WordPress plugin scaffold with dual-mode generation, mustache templating, and complete development infrastructure.

### Added

#### Core Generator System
- Dual-mode generator supporting both template mode (`--in-place`) and output folder mode (default `generated-plugins/`)
- Interactive confirmation prompt for template mode with safe default "No" to prevent accidental scaffold destruction
- Mustache template system with 6 transformation filters: `upper`, `lower`, `pascalCase`, `camelCase`, `kebabCase`, `snakeCase`
- CLI agent interface with JSON mode for programmatic plugin generation
- Comprehensive schema validation for plugin configuration via JSON Schema
- Template variable validation system ensuring correct mustache usage throughout

#### Example Blocks
- **Card Block** - Display single items with featured image, title, excerpt, and custom fields
- **Collection Block** - Grid/list layouts with pagination, filtering, and query controls
- **Slider Block** - Carousel with autoplay, navigation, and responsive controls
- **Featured Block** - Highlight selected items with custom layouts

#### Architecture & Infrastructure
- Custom post type and taxonomy scaffolding with full WordPress registration
- Secure Custom Fields (SCF) integration with local JSON sync
- Block patterns system with 7 pre-built patterns
- Block template system with automatic assignment
- Repeater fields support with nested data structures
- Block bindings API integration (WordPress 6.5+)
- Block styles registration system
- Options pages with settings API integration

#### Development Tools
- Comprehensive unit test suite: 130 tests across 7 suites (Jest + @wordpress/scripts)
- Linting infrastructure: ESLint (JS), Stylelint (CSS), PHPCS (PHP), PHPStan (static analysis)
- Build system with webpack 5, Babel, and PostCSS
- Dry-run testing system for template validation without full generation
- Pre-commit hooks with Husky for code quality enforcement
- wp-env integration for local WordPress development environment

#### Documentation
- 15 comprehensive documentation files covering all aspects:
  - ARCHITECTURE.md - Repository structure and organization
  - GENERATE-PLUGIN.md - Complete plugin generation guide
  - BUILD-PROCESS.md - Build system documentation
  - TESTING.md - Testing strategies and setup
  - LINTING.md - Code quality standards
  - API_REFERENCE.md - PHP and JavaScript API documentation
- Added "Using This Scaffold" section to README.md with dual-mode workflows
- Created generated-plugins/README.md with usage warnings and cleanup instructions

### Changed

#### Repository Organization
- Reorganized directory structure:
  - `bin/` → `scripts/` for better clarity
  - `parts/` → `template-parts/` for WordPress standard naming
- Renamed agent specification:
  - `scaffold-generator.agent.md` → `generate-plugin.agent.md` for clarity
- Updated all documentation to reflect dual-mode operational model
- Consolidated GENERATE-PLUGIN.md from 4 methods to 2 operational modes

#### Code Quality
- Standardized all text domains to `{{textdomain}}` mustache template (474 instances)
- Corrected POST_TYPE constants to use `{{slug}}` instead of text domain
- Fixed default postType parameters in hooks to use `{{slug}}`
- Applied consistent mustache variable usage throughout codebase

### Fixed

- Resolved all circular dependency issues (madge check: 0 circular dependencies)
- Fixed 474 text domain consistency issues across PHP and JS files
- Corrected POST_TYPE constant misuse (was text domain, now correctly uses slug)
- Fixed default parameter usage in hooks (postType should be slug, not text domain)
- Ensured test fixtures in dry-run-config.js remain as test values, not templates

### Documentation

#### New Documentation Files
- `docs/ARCHITECTURE.md` - Complete repository structure guide
- `docs/BUILD-PROCESS.md` - Build system detailed documentation
- `docs/GENERATE-PLUGIN.md` - Plugin generation comprehensive guide
- `docs/TESTING.md` - Testing strategies and implementation
- `docs/LINTING.md` - Linting tools and standards
- `generated-plugins/README.md` - Output directory usage instructions

#### Enhanced Documentation
- README.md: Added "Using This Scaffold" section with workflow examples
- GENERATE-PLUGIN.md: Consolidated to 2 clear operational modes
- All docs include frontmatter metadata for better organization

### Technical Details

#### Supported Features
- WordPress 6.5+ (Block Bindings API, Plugin Dependencies)
- PHP 8.0+ requirement
- Node.js 18+ for build system
- Custom post types with full feature support
- Hierarchical and non-hierarchical taxonomies
- Secure Custom Fields integration with all field types
- Block patterns with multiple categories
- Block templates with automatic assignment
- Repeater fields with nested data
- Block styles registration
- Options pages with settings API

#### Build System
- Webpack 5 with optimized production builds
- Babel transpilation for modern JavaScript
- PostCSS with autoprefixer and cssnano
- SCSS compilation with WordPress design tokens
- Source maps for development
- Asset extraction and optimization

#### Testing Infrastructure
- Jest unit tests for JavaScript
- PHPUnit for PHP
- Playwright for E2E tests
- Code coverage reporting
- Dry-run validation system
- Pre-commit hook integration

### Breaking Changes

None - this is the initial release.

### Migration Guide

Not applicable for v1.0.0 (initial release).

### Known Issues

- Template mode (`--in-place`) is destructive and cannot be undone without version control
- Generated plugins require manual dependency installation (`npm install` and `composer install`)
- Block editor preview styles may need adjustment in different themes
- SCF field group sync requires plugin activation

### Upgrade Notes

Not applicable for v1.0.0 (initial release).

### Credits

Developed by [LightSpeed](https://lightspeedwp.agency) for the WordPress community.

### Links

- [GitHub Repository](https://github.com/lightspeedwp/multi-block-plugin-scaffold)
- [Documentation](https://github.com/lightspeedwp/multi-block-plugin-scaffold/tree/main/docs)
- [Issues](https://github.com/lightspeedwp/multi-block-plugin-scaffold/issues)
- [License](LICENSE)

---

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Fixed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Security
- Nothing yet

---

[1.0.0]: https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases/tag/v1.0.0
[Unreleased]: https://github.com/lightspeedwp/multi-block-plugin-scaffold/compare/v1.0.0...HEAD
