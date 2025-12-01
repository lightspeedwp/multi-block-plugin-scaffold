---
title: PHP Block Instructions
description: Standards for PHP in WordPress blocks
category: Project
type: Guide
audience: Developers
date: 2025-12-01
---

# PHP Block & Template Instructions

## Pattern Registration
- Register block patterns using files in `patterns/` directory.
- Use consistent naming: `{{namespace}}/{{slug}}-[name]` (e.g., `{{namespace}}/{{slug}}-archive`).
- Include proper pattern categories and keywords.
- Provide descriptive viewportWidth values.

## Translation & Internationalisation
- Use correct text domain for all translations: `__('text', '{{textdomain}}')`.
- Ensure all user-visible strings are translatable.
- Use proper escaping functions with translations: `esc_html__()`, `esc_attr__()`.

## Security & Data Handling
- Sanitise all dynamic output using appropriate escaping functions.
- Validate and sanitise all input data before use.
- Use nonces for form submissions and AJAX requests.

## Asset Management
- Do not enqueue scripts/styles inline—use WordPress enqueue functions.
- Properly handle dependencies in enqueue functions.
- Use versioning for cache busting.
- Localise JavaScript data using `wp_localize_script()`.

## Block Pattern Best Practices
- Keep pattern names unique and descriptive.
- Use meaningful comments to document pattern sections.
- Maintain proper block structure and nesting.
- Ensure blocks use theme.json variables for styling consistency.
- Test patterns across different viewport sizes.

## Custom Post Type Integration
- Register CPT with `show_in_rest` for block editor support.
- Define block templates for consistent editing experience.
- Use `template_lock` appropriately.

## SCF Field Integration
- Check for SCF/ACF function existence before use.
- Use Block Bindings for displaying field content.
- Implement proper field validation.

## Performance Considerations
- Avoid unnecessary database queries in pattern rendering.
- Optimise image usage in patterns.
- Use WordPress core blocks whenever possible.
