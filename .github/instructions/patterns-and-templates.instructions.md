---
file_type: "instructions"
title: "Block Pattern and Template Development"
description: "Comprehensive guide for developing reusable block patterns and templates in WordPress block plugins and themes"
version: 2.0.0
lastUpdated: 2025-12-10
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
owners: ["LightSpeedWP Team"]
tags: ["pattern", "wordpress", "block", "template", "instructions"]
applyTo: "**/patterns/**/*.php"
license: "GPL-3.0"
domain: "wp-core"
stability: "stable"
references:
  - path: "./blocks-development.instructions.md"
    description: "Core block development patterns"
  - path: "./wpcs-php.instructions.md"
    description: "WordPress PHP coding standards"
  - path: "./wpcs-html.instructions.md"
    description: "WordPress HTML standards"
  - path: "./wpcs-accessibility.instructions.md"
    description: "Accessibility standards"
---

# Block Pattern and Template Development

You are a pattern and template designer. Follow our block composition patterns to build reusable patterns and templates that suit multi-block plugins. Avoid theme-specific hacks or tightly coupling patterns to bespoke CSS beyond the shared styles and block supports.

> ⚠️ **Scope Notice**: These instructions are intended for **WordPress block plugin and theme repositories** within the `lightspeedwp` GitHub organisation. They should **not** be applied to the `lightspeedwp/.github` community health repository, as that repository does not contain WordPress code.

## Overview

This guide provides comprehensive best practices for developing reusable block patterns and block templates in WordPress. Patterns are pre-designed block layouts that users can insert, while templates provide full-page structures.

## General Rules

- Keep patterns theme-agnostic; rely on block supports and shared styles, not bespoke CSS.
- Use semantic block choices and accessible defaults; ensure headings and landmarks are logical.
- Keep placeholder content realistic but neutral; ensure keywords, titles, and categories are localised.
- Maintain unique slugs and stable markup; avoid hard-coded URLs or IDs.
- Keep patterns composable; prefer Groups/Stacks over deeply nested custom containers.

## Detailed Guidance

## 1. Pattern Structure

### Anatomy of a Good Pattern

A well-structured pattern should:

- ✅ Use descriptive comments to document each section
- ✅ Follow a logical structure with clear parent-child relationships
- ✅ Group related blocks using the Group block where appropriate
- ✅ Use appropriate block variations based on content needs
- ✅ Test across different viewport sizes
- ✅ Provide realistic placeholder content

### Example Pattern Structure

```php
<?php
/**
 * Title: Hero Section with Call to Action
 * Slug: myplugin/hero-cta
 * Categories: featured, call-to-action
 * Keywords: hero, banner, cta, featured
 * Viewport width: 1376
 * Description: A full-width hero section with heading, description, and call-to-action button
 */
?>

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}},"backgroundColor":"primary","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-primary-background-color has-background" style="padding-top:6rem;padding-bottom:6rem">

    <!-- wp:heading {"textAlign":"center","level":1} -->
    <h1 class="wp-block-heading has-text-align-center">Welcome to Our Amazing Service</h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center"} -->
    <p class="has-text-align-center">Discover how we can help you achieve your goals with our innovative solutions.</p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
        <!-- wp:button -->
        <div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Get Started</a></div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

</div>
<!-- /wp:group -->
```

---

## 2. Pattern Registration

### Method 1: PHP File Headers (Recommended)

WordPress automatically registers patterns from PHP files with proper headers:

```php
<?php
/**
 * Title: Example Pattern Name
 * Slug: myplugin/pattern-slug
 * Categories: featured, text
 * Keywords: example, demo, test
 * Viewport width: 1376
 * Description: A brief description of what this pattern does
 * Block Types: core/post-content
 * Post Types: page, post
 * Inserter: yes
 */
?>

<!-- Pattern markup here -->
```

### Method 2: register_block_pattern() Function

For programmatic registration:

```php
<?php
/**
 * Register custom block patterns
 */
function myplugin_register_patterns() {
    register_block_pattern(
        'myplugin/my-pattern',
        array(
            'title'       => __( 'My Custom Pattern', 'myplugin' ),
            'description' => __( 'A custom block pattern for specific use', 'myplugin' ),
            'content'     => '<!-- wp:paragraph --><p>Pattern content here</p><!-- /wp:paragraph -->',
            'categories'  => array( 'text', 'featured' ),
            'keywords'    => array( 'custom', 'example' ),
            'viewportWidth' => 1376,
        )
    );
}
add_action( 'init', 'myplugin_register_patterns' );
```

### Pattern Categories

Register custom pattern categories:

```php
<?php
/**
 * Register pattern categories
 */
function myplugin_register_pattern_categories() {
    register_block_pattern_category(
        'myplugin-layouts',
        array(
            'label'       => __( 'My Plugin Layouts', 'myplugin' ),
            'description' => __( 'Custom layout patterns for My Plugin', 'myplugin' ),
        )
    );
}
add_action( 'init', 'myplugin_register_pattern_categories' );
```

---

## 3. Advanced Pattern Assignment

### Assign to Post Types

Make patterns available for specific post types:

```php
/**
 * Title: Blog Post Template
 * Slug: myplugin/blog-post-template
 * Post Types: post
 * Categories: text
 */
```

### Assign to Block Types (Starter Patterns)

Patterns can be assigned to specific block contexts, such as starter page patterns:

```php
/**
 * Title: About Page
 * Slug: myplugin/about-page
 * Block Types: core/post-content
 * Post Types: page
 * Categories: page
 * Viewport width: 1376
 */
```

### Assign to Template Types

Associate patterns with specific templates:

```php
/**
 * Title: Homepage Hero
 * Slug: myplugin/homepage-hero
 * Template Types: front-page, home
 * Inserter: no
 * Viewport width: 1376
 */
```

**Common Template Types:**
- `index` — Default template
- `home` — Blog homepage
- `front-page` — Static front page
- `singular` — Single post/page
- `single` — Single post
- `page` — Page template
- `archive` — Archive pages
- `author` — Author archive
- `category` — Category archive
- `taxonomy` — Taxonomy archive
- `date` — Date archive
- `tag` — Tag archive
- `attachment` — Attachment pages
- `search` — Search results
- `privacy-policy` — Privacy policy page
- `404` — 404 error page

### Hide from Inserter

Use `Inserter: no` to hide patterns from the inserter while keeping them available for templates:

```php
/**
 * Title: Header Template
 * Slug: myplugin/header-template
 * Template Types: header
 * Inserter: no
 */
```

---

## 4. Using Patterns in Templates

### Include Pattern in Template

Patterns can be included directly in block templates or template parts:

```html
<!-- wp:pattern {"slug":"myplugin/homepage-hero"} /-->
```

### Example: Full Page Template

```html
<!-- wp:template-part {"slug":"header"} /-->

<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group">
    <!-- wp:pattern {"slug":"myplugin/hero-section"} /-->
    <!-- wp:pattern {"slug":"myplugin/features-grid"} /-->
    <!-- wp:pattern {"slug":"myplugin/call-to-action"} /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer"} /-->
```

---

## 5. Authoring Best Practices

### Define Use Case First

Before creating a pattern:

1. **Identify the need** — What problem does this solve?
2. **Define user value** — How does this help users?
3. **Consider variations** — Should there be multiple versions?
4. **Plan responsiveness** — How does it work on mobile?

### Pattern vs Reusable Block

| Feature | Pattern | Reusable Block |
|---------|---------|----------------|
| **Reusability** | Template — users can edit after insertion | Synced — edits affect all instances |
| **Use Case** | Starting point for unique content | Consistent element across pages |
| **Examples** | Hero section, testimonial grid | Site header, footer, call-out box |

**Prefer patterns for:** Starting layouts, page sections, content templates
**Prefer reusable blocks for:** Site-wide elements that should stay synchronized

### Provide Good Defaults

- ✅ Use realistic placeholder content (not lorem ipsum when possible)
- ✅ Set appropriate spacing and alignment
- ✅ Use theme.json design tokens for colors and typography
- ✅ Provide helpful guidance in placeholder text
- ✅ Test with different content lengths

---

## 6. Content Strategy

### Placeholder Content Guidelines

**DO:**
- ✅ Use descriptive, instructional placeholder text
  - Example: "Add your company mission statement here"
- ✅ Provide realistic examples that guide users
  - Example: "Our team of 50+ experts has over 100 years of combined experience"
- ✅ Match tone and length to the intended use
- ✅ Include helpful context in comments

**DON'T:**
- ❌ Use lorem ipsum (not helpful for users)
- ❌ Use generic "text here" placeholders
- ❌ Assume users know what content to add
- ❌ Provide overly long placeholder text

### Example: Good vs Bad Placeholders

```html
<!-- ❌ BAD -->
<!-- wp:heading -->
<h2>Lorem ipsum dolor sit amet</h2>
<!-- /wp:heading -->

<!-- ✅ GOOD -->
<!-- wp:heading -->
<h2>Describe your primary service or offering</h2>
<!-- /wp:heading -->
```

### Ensure Semantic Structure

- ✅ Maintain proper heading hierarchy (H1 → H2 → H3)
- ✅ Use semantic HTML elements
- ✅ Provide alt text placeholders for images
- ✅ Use lists for list content
- ✅ Ensure logical reading order

---

## 7. Styling Patterns

### Use theme.json Variables

**Always use theme.json design tokens** for consistent styling:

```html
<!-- ✅ GOOD: Using theme.json variables -->
<!-- wp:group {"backgroundColor":"primary","textColor":"base"} -->
<div class="wp-block-group has-primary-background-color has-base-color has-text-color has-background">
    <!-- Content -->
</div>
<!-- /wp:group -->

<!-- ❌ BAD: Inline styles -->
<!-- wp:group {"style":{"color":{"background":"#0066cc","text":"#ffffff"}}} -->
<div class="wp-block-group" style="background:#0066cc;color:#ffffff">
    <!-- Content -->
</div>
<!-- /wp:group -->
```

### Spacing Guidelines

- ✅ Use consistent spacing units from theme.json
- ✅ Apply padding/margin at the group level, not individual blocks
- ✅ Test responsive behavior
- ✅ Consider mobile-first spacing

### Avoid Custom CSS

- ✅ Use block supports for styling when possible
- ✅ Leverage theme.json for colors, typography, spacing
- ❌ Avoid inline styles unless absolutely necessary
- ❌ Don't add custom CSS classes without documentation

---

## 8. Accessibility

### Heading Hierarchy

```html
<!-- ✅ GOOD: Proper hierarchy -->
<!-- wp:heading {"level":2} -->
<h2>Section Title</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3>Subsection Title</h3>
<!-- /wp:heading -->

<!-- ❌ BAD: Skipping levels -->
<!-- wp:heading {"level":2} -->
<h2>Section Title</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":4} -->
<h4>Skipped H3</h4>
<!-- /wp:heading -->
```

### Image Alt Text

```html
<!-- ✅ GOOD: Descriptive alt text placeholder -->
<!-- wp:image {"alt":"Team collaboration in modern office space"} -->
<figure class="wp-block-image">
    <img src="placeholder.jpg" alt="Team collaboration in modern office space"/>
</figure>
<!-- /wp:image -->

<!-- ❌ BAD: No alt text -->
<!-- wp:image -->
<figure class="wp-block-image">
    <img src="placeholder.jpg" alt=""/>
</figure>
<!-- /wp:image -->
```

### Color Contrast

- ✅ Ensure sufficient contrast for text elements (WCAG AA: 4.5:1)
- ✅ Test patterns with different color schemes (light/dark)
- ✅ Provide alternative styling options when needed
- ✅ Don't rely on color alone to convey information

### Keyboard Navigation

- ✅ Ensure all interactive elements are keyboard accessible
- ✅ Test tab order for logical flow
- ✅ Provide focus indicators
- ✅ Test with screen readers (NVDA, JAWS, VoiceOver)

See [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md) for comprehensive accessibility standards.

---

## 9. Performance

### Optimize Images

- ✅ Use appropriately sized placeholder images
- ✅ Leverage modern image formats (WebP, AVIF)
- ✅ Provide srcset for responsive images
- ✅ Use lazy loading where appropriate

### Minimize Markup

```html
<!-- ✅ GOOD: Minimal, clean markup -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:heading -->
    <h2>Title</h2>
    <!-- /wp:heading -->
</div>
<!-- /wp:group -->

<!-- ❌ BAD: Unnecessary nesting -->
<!-- wp:group -->
<div class="wp-block-group">
    <!-- wp:group -->
    <div class="wp-block-group">
        <!-- wp:group -->
        <div class="wp-block-group">
            <!-- wp:heading -->
            <h2>Title</h2>
            <!-- /wp:heading -->
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
```

### Avoid Heavy Dependencies

- ✅ Use core blocks whenever possible
- ✅ Minimize custom block usage
- ✅ Test rendering performance
- ✅ Consider mobile device performance

---

## 10. Reusability & Maintenance

### Design for Flexibility

- ✅ Create variations for different use cases
- ✅ Document pattern dependencies (required plugins, theme features)
- ✅ Test with different themes
- ✅ Consider how patterns work together

### Pattern Variations

Create multiple versions of popular patterns:

```php
/**
 * Title: Hero Section (Light Background)
 * Slug: myplugin/hero-light
 * Categories: featured
 */

/**
 * Title: Hero Section (Dark Background)
 * Slug: myplugin/hero-dark
 * Categories: featured
 */

/**
 * Title: Hero Section (Image Background)
 * Slug: myplugin/hero-image
 * Categories: featured
 */
```

### Documentation

Include in pattern header or accompanying README:

- Pattern purpose and use case
- Required theme features or plugins
- Customization instructions
- Best practices for content
- Screenshot or preview

---

## 11. Pattern Organization

### File Structure

```
patterns/
├── README.md                  # Pattern documentation
├── hero-sections/
│   ├── hero-light.php
│   ├── hero-dark.php
│   └── hero-image.php
├── features/
│   ├── features-3-col.php
│   └── features-grid.php
├── testimonials/
│   ├── testimonial-single.php
│   └── testimonial-carousel.php
└── call-to-action/
    ├── cta-button.php
    └── cta-form.php
```

### Naming Conventions

- ✅ Use descriptive, kebab-case file names
- ✅ Group related patterns in subdirectories
- ✅ Prefix pattern slugs with plugin/theme name
- ✅ Use consistent naming patterns

**Examples:**
- `myplugin/hero-light`
- `myplugin/features-3-column`
- `myplugin/testimonial-carousel`

---

## 12. Testing Patterns

### Manual Testing Checklist

- [ ] Pattern inserts without errors
- [ ] Displays correctly in editor
- [ ] Renders correctly on frontend
- [ ] Works across different viewport sizes
- [ ] Maintains design with different content lengths
- [ ] Accessible (keyboard, screen reader)
- [ ] Color contrast meets WCAG standards
- [ ] Proper heading hierarchy
- [ ] Works with different themes
- [ ] Performance is acceptable

### Browser & Device Testing

- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] RTL language support (if applicable)

---

## 13. Delivery & Documentation

### Pattern Previews

Include screenshots in documentation:

```markdown
# Hero Section Patterns

## Hero Light
![Hero Light Preview](./screenshots/hero-light.png)

**Use case:** Landing pages with light, airy feel
**Best for:** Professional services, SaaS products
```

### Provide Transforms

Help users switch between pattern variations:

```php
<?php
/**
 * Register pattern transforms
 */
function myplugin_register_pattern_transforms() {
    // Allow users to easily switch between hero variations
    register_block_pattern(
        'myplugin/hero-light',
        array(
            'title' => __( 'Hero Light', 'myplugin' ),
            // ... pattern config
            'transformations' => array( 'myplugin/hero-dark', 'myplugin/hero-image' ),
        )
    );
}
```

### Teardown Instructions

Document how to safely remove or replace patterns:

```markdown
## Removing This Pattern

1. Select the entire pattern group
2. Press Delete or use the toolbar Remove button
3. Alternative: Use the "Replace" option to switch to a different pattern

## Replacing This Pattern

1. Select the pattern
2. Click the "Replace" button in the toolbar
3. Choose a different pattern from the inserter
```

---

## 14. Advanced: Synced Patterns (Reusable Blocks)

For content that should remain synchronized across pages:

```php
<?php
/**
 * Register a synced pattern (reusable block)
 */
function myplugin_register_synced_pattern() {
    $pattern_content = '<!-- wp:group -->
        <div class="wp-block-group">
            <!-- wp:heading -->
            <h2>Site-wide Call to Action</h2>
            <!-- /wp:heading -->
        </div>
        <!-- /wp:group -->';

    // Create as a wp_block post type
    wp_insert_post( array(
        'post_title'   => 'Site-wide CTA',
        'post_content' => $pattern_content,
        'post_status'  => 'publish',
        'post_type'    => 'wp_block',
    ) );
}
```

**When to use synced patterns:**
- Site headers and footers
- Call-out boxes used site-wide
- Legal disclaimers
- Contact information blocks
- Social media links

----

## Validation

- Run `npm run lint` (JS/TS/CSS) and `composer lint` (PHP) if patterns include PHP helpers.
- Validate pattern PHP files with `php -l patterns/*.php`.
- Insert patterns in the editor and run E2E smoke tests for insertion and RTL.
- Ensure `block.json` references (if any) are correct and pattern slugs are unique.

## Examples

### Quick Reference

### Pattern Header Template

```php
<?php
/**
 * Title: [Pattern Name]
 * Slug: [plugin/pattern-slug]
 * Categories: [category1, category2]
 * Keywords: [keyword1, keyword2, keyword3]
 * Viewport width: 1376
 * Description: [Brief description]
 * Block Types: [core/post-content] (optional)
 * Post Types: [page, post] (optional)
 * Template Types: [front-page, home] (optional)
 * Inserter: [yes/no] (optional, default: yes)
 */
?>
```

### Common Pattern Categories

- `featured` — Featured/hero sections
- `text` — Text-heavy patterns
- `call-to-action` — CTA patterns
- `banner` — Banner patterns
- `header` — Header patterns
- `footer` — Footer patterns
- `testimonial` — Testimonial patterns
- `gallery` — Gallery patterns
- `contact` — Contact forms/info
- `portfolio` — Portfolio layouts
- `services` — Service descriptions
- `team` — Team member layouts
- `page` — Full page layouts

---

**For the latest and any additional instructions, always check all files in `.github/instructions/` and reference the master index at [_index.instructions.md](./_index.instructions.md).**

## External resources

- [WordPress Patterns Documentation](https://developer.wordpress.org/themes/patterns/)
- [Starter Patterns](https://developer.wordpress.org/themes/patterns/starter-patterns/)
- [Usage in Templates](https://developer.wordpress.org/themes/patterns/usage-in-templates/)
- [Block Pattern Registry](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)

## References

- [blocks-development.instructions.md](./blocks-development.instructions.md)
- [wpcs-html.instructions.md](./wpcs-html.instructions.md)
- [wpcs-accessibility.instructions.md](./wpcs-accessibility.instructions.md)
- [wpcs-php.instructions.md](./wpcs-php.instructions.md)
- [_index.instructions.md](./_index.instructions.md)
