---
title: GitHub Release Setup Instructions
description: Step-by-step instructions for configuring the repository as a GitHub template and creating the v1.0.0 release
category: Documentation
type: Guide
audience: Repository Maintainers
date: 2024-12-10
---

# GitHub Release Setup Instructions

This document provides step-by-step instructions for completing the v1.0.0 release setup tasks that require GitHub UI access.

## Prerequisites

✅ Completed:
- [x] Text domain fixes committed (474 instances replaced)
- [x] `.github/template-repository-settings.json` created
- [x] `CHANGELOG.md` created with full v1.0.0 release notes
- [x] All code changes committed and pushed to main branch

## Task 17: Enable Template Repository

### Steps:

1. **Navigate to Repository Settings**
   - Go to: https://github.com/lightspeedwp/multi-block-plugin-scaffold
   - Click "Settings" tab (requires admin permissions)

2. **Enable Template Repository**
   - Scroll to "Template repository" section
   - Check ☑️ "Template repository" checkbox
   - This allows users to click "Use this template" button

3. **Verify Template Status**
   - Return to repository main page
   - Confirm green "Use this template" button appears
   - Test button leads to template generation workflow

### Expected Result:
✅ Repository shows "Use this template" button on main page  
✅ Users can generate new repositories from this template

### Notes:
- Requires repository to be public
- Requires admin/owner permissions
- Setting is applied immediately

---

## Task 18: Add GitHub Topics

### Steps:

1. **Navigate to Repository Main Page**
   - Go to: https://github.com/lightspeedwp/multi-block-plugin-scaffold

2. **Click "About" Settings (Gear Icon)**
   - Located in right sidebar above "About" section
   - Click gear/cog icon ⚙️

3. **Add Topics**
   Add the following topics (comma-separated or one at a time):
   ```
   wordpress
   wordpress-plugin
   gutenberg
   blocks
   block-plugin
   scaffold
   generator
   plugin-template
   gutenberg-blocks
   wordpress-blocks
   wordpress-development
   block-editor
   mustache-templates
   plugin-scaffold
   lightspeed
   ```

4. **Update Description**
   Ensure description reads:
   ```
   WordPress plugin scaffold with multi-block architecture, dual-mode generator, and comprehensive development tools
   ```

5. **Add Website URL** (optional but recommended)
   ```
   https://github.com/lightspeedwp/multi-block-plugin-scaffold
   ```

6. **Save Changes**
   - Click "Save changes" button

### Expected Result:
✅ Topics appear as badges below repository description  
✅ Repository is discoverable via topic searches  
✅ Improved SEO and discoverability on GitHub

### Alternative Method (GitHub API):

If you prefer CLI/API approach:

```bash
curl -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/multi-block-plugin-scaffold \
  -d '{
    "description": "WordPress plugin scaffold with multi-block architecture, dual-mode generator, and comprehensive development tools",
    "topics": ["wordpress", "wordpress-plugin", "gutenberg", "blocks", "block-plugin", "scaffold", "generator", "plugin-template", "gutenberg-blocks", "wordpress-blocks", "wordpress-development", "block-editor", "mustache-templates", "plugin-scaffold", "lightspeed"]
  }'
```

---

## Task 20: Create v1.0.0 Release

### Prerequisites:
- ✅ All changes committed
- ✅ All changes pushed to main branch
- ✅ CHANGELOG.md complete
- ✅ Template repository enabled
- ✅ Topics added

### Steps:

#### 1. Create Git Tag

```bash
# Ensure you're on main branch with latest changes
git checkout main
git pull origin main

# Create annotated tag
git tag -a v1.0.0 -m "Release v1.0.0: Multi-Block Plugin Scaffold

Initial release with dual-mode generator, mustache templating, and comprehensive development infrastructure."

# Push tag to GitHub
git push origin v1.0.0
```

#### 2. Create GitHub Release

1. **Navigate to Releases**
   - Go to: https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases
   - Click "Draft a new release"

2. **Configure Release**
   - **Choose a tag**: Select `v1.0.0` (just created)
   - **Release title**: `v1.0.0: Multi-Block Plugin Scaffold`
   - **Target**: `main` branch

3. **Add Release Notes**
   Copy content from `CHANGELOG.md` v1.0.0 section, or use the following:

   ```markdown
   ## 🎉 Initial Release: Multi-Block Plugin Scaffold

   A comprehensive WordPress plugin scaffold with dual-mode generation, mustache templating, and complete development infrastructure.

   ### ✨ Key Features

   #### Core Generator System
   - **Dual-mode generator**: Template mode (`--in-place`) or output folder mode
   - **Mustache templating**: 6 transformation filters for flexible plugin generation
   - **Schema validation**: JSON Schema validation for plugin configuration
   - **CLI interface**: JSON mode for programmatic generation

   #### Example Blocks
   - Card Block - Single item display with custom fields
   - Collection Block - Grid/list with pagination and filtering
   - Slider Block - Responsive carousel with autoplay
   - Featured Block - Highlighted items with custom layouts

   #### Development Tools
   - **130 unit tests** across 7 test suites
   - **Complete linting**: ESLint, Stylelint, PHPCS, PHPStan
   - **Build system**: Webpack 5, Babel, PostCSS
   - **Local environment**: wp-env integration
   - **Pre-commit hooks**: Husky for code quality

   #### Architecture
   - Custom post type and taxonomy scaffolding
   - Secure Custom Fields integration with local JSON
   - Block patterns (7 pre-built)
   - Block templates with automatic assignment
   - Repeater fields with nested data
   - Block bindings API (WordPress 6.5+)

   ### 📚 Documentation

   15 comprehensive documentation files:
   - [GENERATE-PLUGIN.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/GENERATE-PLUGIN.md) - Complete generation guide
   - [ARCHITECTURE.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/ARCHITECTURE.md) - Repository structure
   - [TESTING.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/TESTING.md) - Testing strategies
   - [Full documentation index](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/docs/README.md)

   ### 🚀 Getting Started

   #### Use as Template
   1. Click "Use this template" button
   2. Create your repository
   3. Clone locally
   4. Run `npm install && composer install`
   5. Generate plugin: `node scripts/generate-plugin.js --in-place`

   #### Generate Plugin
   ```bash
   # Clone scaffold
   git clone https://github.com/lightspeedwp/multi-block-plugin-scaffold.git
   cd multi-block-plugin-scaffold

   # Generate plugin (output to generated-plugins/)
   node scripts/generate-plugin.js
   ```

   ### 📋 Requirements

   - WordPress 6.5+
   - PHP 8.0+
   - Node.js 18+

   ### 🔧 Technical Details

   - **474 text domain instances** standardized to mustache templates
   - **0 circular dependencies** (verified with madge)
   - **Webpack 5** with optimized production builds
   - **Secure Custom Fields** integration with all field types

   ### 📝 Full Changelog

   See [CHANGELOG.md](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/CHANGELOG.md) for complete details.

   ### 🙏 Credits

   Developed by [LightSpeed](https://lightspeedwp.agency) for the WordPress community.

   ### 📄 License

   GPL-3.0-or-later - See [LICENSE](https://github.com/lightspeedwp/multi-block-plugin-scaffold/blob/main/LICENSE)
   ```

4. **Release Options**
   - ☑️ Check "Set as the latest release"
   - ☐ Leave "Set as a pre-release" unchecked
   - ☐ Leave "Create a discussion for this release" unchecked (optional)

5. **Publish Release**
   - Click "Publish release" button

### Expected Result:
✅ v1.0.0 release appears on releases page  
✅ Release shows up in repository sidebar  
✅ Release is marked as "Latest"  
✅ Tag v1.0.0 exists in repository  
✅ Users can download source code ZIP/tarball

### Verification:

1. Check release page: https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases
2. Verify tag exists: `git tag -l`
3. Check release is latest: Repository sidebar shows "v1.0.0"
4. Test download links work

---

## Post-Release Checklist

After completing all tasks:

- [ ] Template repository enabled and working
- [ ] All topics added and visible
- [ ] v1.0.0 release published
- [ ] Release shows "Latest" badge
- [ ] "Use this template" button works
- [ ] Repository appears in topic searches
- [ ] All documentation links work
- [ ] CHANGELOG.md accurate

---

## Troubleshooting

### Issue: "Use this template" button not appearing
**Solution**: Ensure repository is public and template repository setting is enabled

### Issue: Topics not saving
**Solution**: GitHub limits to 20 topics. Our list has 15, so this shouldn't be an issue. Remove least important if needed.

### Issue: Tag already exists
**Solution**: Delete tag locally and remotely, then recreate:
```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
# Then recreate tag
```

### Issue: Release notes formatting issues
**Solution**: Preview release notes before publishing. Use Markdown preview.

---

## Next Steps After Release

1. **Announce Release**
   - Share on WordPress community channels
   - Post to relevant social media
   - Update any related documentation

2. **Monitor Issues**
   - Watch for user feedback
   - Address any bug reports quickly
   - Update documentation as needed

3. **Plan v1.1.0**
   - Review pending feature requests
   - Plan next milestone
   - Update project board

---

## Support

For questions or issues with release setup:
- Open an issue: https://github.com/lightspeedwp/multi-block-plugin-scaffold/issues
- Check documentation: https://github.com/lightspeedwp/multi-block-plugin-scaffold/tree/main/docs

