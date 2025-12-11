# WordPress Standards Compliance & Multi-CPT Scaffold Enhancement

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical bugs, ensure WordPress coding standards compliance, expand mustache placeholder system for multi-CPT support, and update all documentation.

**Architecture:** Three-phase approach: (1) Fix critical plugin initialization bugs and align with WordPress standards, (2) Expand schema and file structure for multi-CPT support with specific placeholders, (3) Update all instruction files and documentation for consistency.

**Tech Stack:** WordPress 6.5+, PHP 8.0+, Secure Custom Fields (SCF), Node.js 18+, Mustache templating, JSON Schema validation

---

## Context & Background

**Current State:**
- Plugin scaffold has duplicate initialization code (both `ExamplePlugin_Plugin` class and `Core` class)
- Missing class includes in Core class (`class-block-styles.php`, `class-scf-json-validator.php`)
- Generic `{{slug}}` placeholder used where CPT-specific `{{cpt_slug}}` is needed
- Inconsistent mustache placeholders across files
- Schema supports single CPT but files need multi-CPT architecture
- Documentation doesn't reflect multi-CPT workflow

**Completed Work:**
- ✅ Fixed duplicate plugin initialization in `{{slug}}.php`
- ✅ Added missing class includes to `class-core.php`

**What We're Building:**
A production-ready WordPress plugin scaffold that:
1. Follows WordPress coding standards perfectly
2. Supports multiple custom post types per plugin
3. Has specific mustache placeholders for different contexts (CPT, taxonomy, blocks, patterns)
4. Includes comprehensive PHPDoc/JSDoc
5. Has accurate, consistent documentation

---

## PHASE 0: Update Governance Documents (CRITICAL - DO FIRST)

### Task 0.1: Review and Update README.md

**Files:**
- Modify: `README.md`
- Read: Current implementation to identify outdated sections

**Step 1: Read current README**

```bash
cat README.md | head -150
```

**Step 2: Identify outdated sections**

Check for:
- Incorrect workflow descriptions
- Missing multi-CPT information
- Outdated directory structure references
- Old placeholder examples
- Broken links to docs

**Step 3: Update "What this scaffold includes" section**

Ensure it mentions:
- Multi-CPT support
- Bidirectional relationships
- New mustache placeholder system
- Block styles JSON system
- Updated file structure

**Step 4: Update "How it works" section**

Verify flowchart accurately reflects:
- Schema validation
- Multi-CPT generation
- Proper build process

**Step 5: Update examples**

Replace single-CPT examples with multi-CPT examples where appropriate.

**Step 6: Verify all links**

```bash
# Check all markdown links
grep -o '\[.*\](.*\.md)' README.md
```

Test each link exists.

**Step 7: Commit**

```bash
git add README.md
git commit -m "docs: update README with multi-CPT support and current architecture"
```

---

### Task 0.2: Review and Update docs/ARCHITECTURE.md

**Files:**
- Modify: `docs/ARCHITECTURE.md`
- Verify against: Current `inc/`, `src/`, directory structure

**Step 1: Read current architecture doc**

```bash
cat docs/ARCHITECTURE.md
```

**Step 2: Audit directory structure accuracy**

```bash
# Compare documented structure vs actual
ls -R | grep -E "^\.:" | sed 's/://' > /tmp/actual-structure.txt
```

Compare with documented structure in ARCHITECTURE.md.

**Step 3: Update folder structure section**

Ensure documentation includes:
- `styles/` directory with subdirectories
- Correct `inc/class-*.php` files (including `class-block-styles.php`, `class-scf-json-validator.php`)
- `{{cpt_slug}}` naming in blocks, patterns, templates
- Multi-CPT file organization

**Step 4: Update "Directory Purposes" sections**

For each directory, verify:
- ✅ Current purpose is accurate
- ✅ Files listed actually exist
- ✅ Examples use correct placeholders
- ✅ Naming conventions are current

**Step 5: Add missing sections**

Add if missing:
- `styles/` directory explanation
- Block styles JSON system
- Multi-CPT architecture
- Relationship management
- Mustache placeholder reference

**Step 6: Remove deprecated information**

Remove references to:
- Old single-CPT-only approach
- Deprecated placeholder usage
- Files that no longer exist
- Outdated workflows

**Step 7: Update examples**

Replace all code examples with current implementations from actual files:

```bash
# Example: Get actual class-post-types.php structure
head -50 inc/class-post-types.php
```

Use real code, not hypothetical examples.

**Step 8: Commit**

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: update ARCHITECTURE.md to reflect current multi-CPT structure"
```

---

### Task 0.3: Review and Update docs/FOLDER-STRUCTURE.md

**Files:**
- Modify: `docs/FOLDER-STRUCTURE.md`
- Cross-reference: Actual directory tree

**Step 1: Generate current directory tree**

```bash
tree -L 3 -I 'node_modules|vendor|build|logs|tmp' > /tmp/current-tree.txt
```

**Step 2: Compare with documented structure**

```bash
cat docs/FOLDER-STRUCTURE.md | grep -A 100 "```text"
```

Compare with `/tmp/current-tree.txt`.

**Step 3: Update directory tree diagram**

Replace outdated tree with current structure showing:
- `styles/` directory
- `{{cpt_slug}}` in block names
- All current `inc/class-*.php` files
- Correct template naming

**Step 4: Update directory purpose descriptions**

For each directory:
- Verify description matches current use
- Add examples from actual files
- Document mustache placeholder usage
- Note which directories are generated vs scaffold

**Step 5: Add new directories**

Document newly added directories:

```markdown
#### `styles/` - Block Style Definitions

**Purpose**: JSON-based block style configurations organized by type.

**Contents**:
- `styles/blocks/` - Block-specific styles (e.g., post-template-card.json)
- `styles/sections/` - Section/layout styles
- `styles/typography/` - Typography style variations
- `styles/colors/` - Color palette styles
- `styles/presets/` - Preset combinations

**Characteristics**:
- JSON format for declarative styling
- Auto-registered via `inc/class-block-styles.php`
- Generates inline CSS on frontend
- Supports multiple block types per style

**Example Structure**:

```json
{
  "name": "card",
  "label": "Card Style",
  "blockTypes": ["core/post-template"],
  "styles": [...]
}
```
```

**Step 6: Document placeholder usage**

Add section explaining when to use:
- `{{slug}}` - Plugin-level identifiers
- `{{cpt_slug}}` - CPT-specific files
- `{{tax_slug}}` - Taxonomy files
- Context-specific naming rules

**Step 7: Commit**

```bash
git add docs/FOLDER-STRUCTURE.md
git commit -m "docs: update FOLDER-STRUCTURE.md with styles/ directory and current organization"
```

---

### Task 0.4: Verify All Documentation Cross-References

**Files:**
- Check: All `.md` files in `docs/` and `.github/instructions/`

**Step 1: Extract all internal links**

```bash
find docs/ .github/instructions/ -name "*.md" -exec grep -H '\[.*\](.*\.md)' {} \; > /tmp/all-md-links.txt
```

**Step 2: Verify each link resolves**

```bash
# Test each link
while IFS= read -r line; do
  file=$(echo "$line" | cut -d: -f1)
  link=$(echo "$line" | grep -o '(.*\.md)' | tr -d '()')

  # Resolve relative path
  dir=$(dirname "$file")
  target="$dir/$link"

  if [ ! -f "$target" ]; then
    echo "BROKEN: $file -> $link (resolved to $target)"
  fi
done < /tmp/all-md-links.txt
```

**Step 3: Fix broken links**

For each broken link:
1. Determine correct target path
2. Update link in source file
3. Document in commit message

**Step 4: Verify external links still valid**

```bash
# Extract external links
find docs/ .github/instructions/ -name "*.md" -exec grep -H 'https://' {} \; | grep -o 'https://[^)]*' | sort -u > /tmp/external-links.txt
```

Spot-check important external links (WordPress docs, SCF docs).

**Step 5: Create link validation script**

Create: `bin/validate-docs-links.sh`

```bash
#!/bin/bash
# Validate all documentation links

echo "Checking internal markdown links..."
# Add validation logic from Step 2

echo "Checking external links..."
# Optional: curl check for external links

exit 0
```

```bash
chmod +x bin/validate-docs-links.sh
```

**Step 6: Commit**

```bash
git add docs/ .github/instructions/ bin/validate-docs-links.sh
git commit -m "docs: fix broken cross-references and add link validation script"
```

---

### Task 0.5: Update docs/README.md (Docs Index)

**Files:**
- Modify: `docs/README.md`

**Step 1: Read current docs index**

```bash
cat docs/README.md
```

**Step 2: List all actual docs**

```bash
ls -1 docs/*.md | sed 's/docs\///' | sort
```

**Step 3: Update index to match reality**

Ensure every document in `docs/` is listed with:
- Accurate title
- Current description
- Correct filename
- Proper categorization

**Step 4: Add new documents**

Add entries for newly created docs:
- `CPT-REGISTRATION-STRATEGY.md`
- `BIDIRECTIONAL-RELATIONSHIPS.md`
- Any other new documentation

**Step 5: Remove deprecated entries**

Remove references to documentation that no longer exists.

**Step 6: Organize by category**

Group documents:
- **Getting Started**: README, GENERATE-PLUGIN
- **Architecture**: ARCHITECTURE, FOLDER-STRUCTURE, CPT-REGISTRATION-STRATEGY
- **Development**: BUILD-PROCESS, TESTING, LINTING
- **Reference**: API_REFERENCE, CONFIGS, BIDIRECTIONAL-RELATIONSHIPS
- **Contributing**: CONTRIBUTING, CODE_OF_CONDUCT, SECURITY

**Step 7: Commit**

```bash
git add docs/README.md
git commit -m "docs: update docs index to reflect current documentation"
```

---

## PHASE 1: WordPress Standards & Critical Fixes

### Task 1.1: Verify Plugin Header Requirements ✅ COMPLETED

**Status:** Main plugin file already updated with correct header structure

**Verification:**
```bash
head -20 {{slug}}.php
```

Expected: All required headers present with mustache placeholders

---

### Task 1.2: Review WordPress Directory/Constant Naming

**Files:**
- Review: `{{slug}}.php:24-28`
- Reference: https://developer.wordpress.org/plugins/plugin-basics/determining-plugin-and-content-directories/

**Step 1: Check current constant naming**

```bash
grep -n "define(" {{slug}}.php
```

**Step 2: Verify against WordPress standards**

Current constants:
```php
define( '{{namespace|upper}}_VERSION', '{{version}}' );
define( '{{namespace|upper}}_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( '{{namespace|upper}}_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( '{{namespace|upper}}_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
```

WordPress recommends:
- ✅ Use `plugin_dir_path(__FILE__)` for directory
- ✅ Use `plugin_dir_url(__FILE__)` for URL
- ✅ Use `plugin_basename(__FILE__)` for basename
- ✅ Prefix all constants with plugin namespace

**Step 3: Document findings**

Create note in `docs/ARCHITECTURE.md` section about constants

**Step 4: Commit**

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: document WordPress constant naming standards"
```

---

### Task 1.3: Review Activation/Deactivation Hooks

**Files:**
- Check: `{{slug}}.php` (currently missing)
- Reference: https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/

**Step 1: Check if activation hooks exist**

```bash
grep -n "register_activation_hook\|register_deactivation_hook" {{slug}}.php inc/*.php
```

Expected: No results (hooks not implemented)

**Step 2: Determine if hooks are needed**

WordPress best practices:
- Activation: Flush rewrite rules for custom post types
- Deactivation: Clean up (but don't delete data)
- Uninstall: Use `uninstall.php` for data deletion

**Step 3: Check uninstall.php**

```bash
cat uninstall.php | head -50
```

**Step 4: Add activation hook to Core class**

Modify: `inc/class-core.php`

Add method after constructor:

```php
/**
 * Plugin activation hook.
 *
 * @return void
 */
public static function activate() {
	// Trigger CPT registration to set up rewrite rules.
	$instance = new self();
	$instance->init();

	// Flush rewrite rules.
	flush_rewrite_rules();
}

/**
 * Plugin deactivation hook.
 *
 * @return void
 */
public static function deactivate() {
	// Flush rewrite rules on deactivation.
	flush_rewrite_rules();
}
```

**Step 5: Register hooks in main plugin file**

Modify: `{{slug}}.php`

Add after the `return;` statement (line 51), before Core include:

```php
// Register activation and deactivation hooks.
register_activation_hook( __FILE__, array( '\\{{namespace|lowerCase}}\\classes\\Core', 'activate' ) );
register_deactivation_hook( __FILE__, array( '\\{{namespace|lowerCase}}\\classes\\Core', 'deactivate' ) );
```

**Step 6: Commit**

```bash
git add {{slug}}.php inc/class-core.php
git commit -m "feat: add activation/deactivation hooks for rewrite rules"
```

---

### Task 1.4: Decide CPT Registration Approach

**Reference:**
- WordPress Core: https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/
- SCF Method: https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-post-type.md

**Step 1: Review current implementation**

```bash
cat inc/class-post-types.php
```

**Step 2: Document decision**

**Recommendation:** Use **WordPress Core `register_post_type()`** as primary method because:
- Native WordPress API (no dependency)
- More control over all parameters
- Better documented in WordPress core
- SCF dependency only for custom fields, not structure

**Use SCF admin UI** for convenience in development, but:
- Export to PHP using SCF's local JSON
- Register via PHP code for production
- This follows WordPress best practices

**Step 3: Create documentation**

Create/update: `docs/CPT-REGISTRATION-STRATEGY.md`

```markdown
# Custom Post Type Registration Strategy

## Approach

Use WordPress Core `register_post_type()` for all CPT registration.

## Rationale

1. **No dependency** - Works without SCF
2. **Version control** - All config in code
3. **Performance** - No database queries
4. **Portability** - Standard WordPress API

## Development Workflow

1. Prototype in SCF admin UI (optional)
2. Export configuration
3. Convert to `register_post_type()` call
4. Test thoroughly

## Example

```php
register_post_type(
    '{{cpt_slug}}',
    array(
        'labels' => array(
            'name' => __( '{{cpt_name_plural}}', '{{textdomain}}' ),
            'singular_name' => __( '{{cpt_name_singular}}', '{{textdomain}}' ),
        ),
        'public' => true,
        'has_archive' => {{cpt_has_archive}},
        'supports' => {{cpt_supports}},
        'menu_icon' => '{{cpt_menu_icon}}',
        'show_in_rest' => true,
    )
);
```
```

**Step 4: Commit**

```bash
git add docs/CPT-REGISTRATION-STRATEGY.md
git commit -m "docs: document CPT registration strategy"
```

---

### Task 1.5: Fix class-post-types.php

**Files:**
- Modify: `inc/class-post-types.php`
- Reference: https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/

**Step 1: Read current implementation**

```bash
cat inc/class-post-types.php
```

**Step 2: Update with WordPress core approach and mustache placeholders**

Replace entire file content:

```php
<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Custom Post Types Registration.
 *
 * Registers custom post types using WordPress core register_post_type().
 * Supports multiple CPTs via config-driven registration.
 *
 * @package {{namespace}}
 * @see https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Post_Types
 *
 * Handles registration of all custom post types for the plugin.
 */
class Post_Types {

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress init action to register post types.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	/**
	 * Register all custom post types.
	 *
	 * @return void
	 */
	public function register_post_types() {
		// Register primary custom post type.
		$this->register_primary_cpt();

		/**
		 * Hook for additional custom post types.
		 *
		 * Use this filter to register additional CPTs from config or extensions.
		 *
		 * @since 1.0.0
		 */
		do_action( '{{namespace|lowerCase}}_register_additional_cpts' );
	}

	/**
	 * Register the primary custom post type.
	 *
	 * @return void
	 */
	private function register_primary_cpt() {
		$labels = array(
			'name'                  => _x( '{{cpt_name_plural}}', 'Post type general name', '{{textdomain}}' ),
			'singular_name'         => _x( '{{cpt_name_singular}}', 'Post type singular name', '{{textdomain}}' ),
			'menu_name'             => _x( '{{cpt_name_plural}}', 'Admin Menu text', '{{textdomain}}' ),
			'name_admin_bar'        => _x( '{{cpt_name_singular}}', 'Add New on Toolbar', '{{textdomain}}' ),
			'add_new'               => __( 'Add New', '{{textdomain}}' ),
			'add_new_item'          => __( 'Add New {{cpt_name_singular}}', '{{textdomain}}' ),
			'new_item'              => __( 'New {{cpt_name_singular}}', '{{textdomain}}' ),
			'edit_item'             => __( 'Edit {{cpt_name_singular}}', '{{textdomain}}' ),
			'view_item'             => __( 'View {{cpt_name_singular}}', '{{textdomain}}' ),
			'all_items'             => __( 'All {{cpt_name_plural}}', '{{textdomain}}' ),
			'search_items'          => __( 'Search {{cpt_name_plural}}', '{{textdomain}}' ),
			'parent_item_colon'     => __( 'Parent {{cpt_name_plural}}:', '{{textdomain}}' ),
			'not_found'             => __( 'No {{cpt_name_plural|lowerCase}} found.', '{{textdomain}}' ),
			'not_found_in_trash'    => __( 'No {{cpt_name_plural|lowerCase}} found in Trash.', '{{textdomain}}' ),
			'featured_image'        => _x( '{{cpt_name_singular}} Cover Image', 'Overrides the "Featured Image" phrase', '{{textdomain}}' ),
			'set_featured_image'    => _x( 'Set cover image', 'Overrides the "Set featured image" phrase', '{{textdomain}}' ),
			'remove_featured_image' => _x( 'Remove cover image', 'Overrides the "Remove featured image" phrase', '{{textdomain}}' ),
			'use_featured_image'    => _x( 'Use as cover image', 'Overrides the "Use as featured image" phrase', '{{textdomain}}' ),
			'archives'              => _x( '{{cpt_name_singular}} archives', 'The post type archive label used in nav menus', '{{textdomain}}' ),
			'insert_into_item'      => _x( 'Insert into {{cpt_name_singular|lowerCase}}', 'Overrides the "Insert into post" phrase', '{{textdomain}}' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this {{cpt_name_singular|lowerCase}}', 'Overrides the "Uploaded to this post" phrase', '{{textdomain}}' ),
			'filter_items_list'     => _x( 'Filter {{cpt_name_plural|lowerCase}} list', 'Screen reader text for the filter links', '{{textdomain}}' ),
			'items_list_navigation' => _x( '{{cpt_name_plural}} list navigation', 'Screen reader text for the pagination', '{{textdomain}}' ),
			'items_list'            => _x( '{{cpt_name_plural}} list', 'Screen reader text for the items list', '{{textdomain}}' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => {{cpt_public}},
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => '{{cpt_slug}}' ),
			'capability_type'    => 'post',
			'has_archive'        => {{cpt_has_archive}},
			'hierarchical'       => false,
			'menu_position'      => null,
			'menu_icon'          => '{{cpt_menu_icon}}',
			'supports'           => array( {{cpt_supports}} ),
			'show_in_rest'       => true,
			'template'           => array(
				array( '{{slug}}/{{cpt_slug}}-card' ),
			),
		);

		register_post_type( '{{cpt_slug}}', $args );
	}
}
```

**Step 3: Verify file doesn't have syntax errors (mustache placeholders will show as "errors" but that's expected)**

```bash
php -l inc/class-post-types.php
```

**Step 4: Commit**

```bash
git add inc/class-post-types.php
git commit -m "refactor: use WordPress core register_post_type with proper labels and mustache placeholders"
```

---

### Task 1.6: Fix class-taxonomies.php

**Files:**
- Modify: `inc/class-taxonomies.php`
- Reference: https://developer.wordpress.org/plugins/taxonomies/working-with-custom-taxonomies/

**Step 1: Create proper taxonomy registration**

Replace entire file:

```php
<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Custom Taxonomies Registration.
 *
 * Registers custom taxonomies using WordPress core register_taxonomy().
 * Supports multiple taxonomies via config-driven registration.
 *
 * @package {{namespace}}
 * @see https://developer.wordpress.org/plugins/taxonomies/working-with-custom-taxonomies/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Taxonomies
 *
 * Handles registration of all custom taxonomies for the plugin.
 */
class Taxonomies {

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress init action to register taxonomies.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_taxonomies' ) );
	}

	/**
	 * Register all custom taxonomies.
	 *
	 * @return void
	 */
	public function register_taxonomies() {
		// Example: Register a hierarchical taxonomy (like categories).
		$this->register_example_category_taxonomy();

		// Example: Register a non-hierarchical taxonomy (like tags).
		$this->register_example_tag_taxonomy();

		/**
		 * Hook for additional custom taxonomies.
		 *
		 * Use this action to register additional taxonomies from config or extensions.
		 *
		 * @since 1.0.0
		 */
		do_action( '{{namespace|lowerCase}}_register_additional_taxonomies' );
	}

	/**
	 * Register a hierarchical example taxonomy.
	 *
	 * Replace {{tax_slug}}, {{tax_singular}}, {{tax_plural}} with actual values.
	 * This is a template example - customize for your needs.
	 *
	 * @return void
	 */
	private function register_example_category_taxonomy() {
		$labels = array(
			'name'              => _x( '{{tax_plural}}', 'taxonomy general name', '{{textdomain}}' ),
			'singular_name'     => _x( '{{tax_singular}}', 'taxonomy singular name', '{{textdomain}}' ),
			'search_items'      => __( 'Search {{tax_plural}}', '{{textdomain}}' ),
			'all_items'         => __( 'All {{tax_plural}}', '{{textdomain}}' ),
			'parent_item'       => __( 'Parent {{tax_singular}}', '{{textdomain}}' ),
			'parent_item_colon' => __( 'Parent {{tax_singular}}:', '{{textdomain}}' ),
			'edit_item'         => __( 'Edit {{tax_singular}}', '{{textdomain}}' ),
			'update_item'       => __( 'Update {{tax_singular}}', '{{textdomain}}' ),
			'add_new_item'      => __( 'Add New {{tax_singular}}', '{{textdomain}}' ),
			'new_item_name'     => __( 'New {{tax_singular}} Name', '{{textdomain}}' ),
			'menu_name'         => __( '{{tax_plural}}', '{{textdomain}}' ),
		);

		$args = array(
			'hierarchical'      => {{tax_hierarchical}},
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => '{{tax_slug}}' ),
			'show_in_rest'      => true,
		);

		register_taxonomy( '{{tax_slug}}', array( '{{cpt_slug}}' ), $args );
	}

	/**
	 * Register a non-hierarchical example taxonomy (tag-like).
	 *
	 * This is a second example showing tag-style taxonomy.
	 * Remove or customize as needed.
	 *
	 * @return void
	 */
	private function register_example_tag_taxonomy() {
		$labels = array(
			'name'                       => _x( '{{tax2_plural}}', 'taxonomy general name', '{{textdomain}}' ),
			'singular_name'              => _x( '{{tax2_singular}}', 'taxonomy singular name', '{{textdomain}}' ),
			'search_items'               => __( 'Search {{tax2_plural}}', '{{textdomain}}' ),
			'popular_items'              => __( 'Popular {{tax2_plural}}', '{{textdomain}}' ),
			'all_items'                  => __( 'All {{tax2_plural}}', '{{textdomain}}' ),
			'edit_item'                  => __( 'Edit {{tax2_singular}}', '{{textdomain}}' ),
			'update_item'                => __( 'Update {{tax2_singular}}', '{{textdomain}}' ),
			'add_new_item'               => __( 'Add New {{tax2_singular}}', '{{textdomain}}' ),
			'new_item_name'              => __( 'New {{tax2_singular}} Name', '{{textdomain}}' ),
			'separate_items_with_commas' => __( 'Separate {{tax2_plural|lowerCase}} with commas', '{{textdomain}}' ),
			'add_or_remove_items'        => __( 'Add or remove {{tax2_plural|lowerCase}}', '{{textdomain}}' ),
			'choose_from_most_used'      => __( 'Choose from the most used {{tax2_plural|lowerCase}}', '{{textdomain}}' ),
			'not_found'                  => __( 'No {{tax2_plural|lowerCase}} found.', '{{textdomain}}' ),
			'menu_name'                  => __( '{{tax2_plural}}', '{{textdomain}}' ),
		);

		$args = array(
			'hierarchical'      => false,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'update_count_callback' => '_update_post_term_count',
			'query_var'         => true,
			'rewrite'           => array( 'slug' => '{{tax2_slug}}' ),
			'show_in_rest'      => true,
		);

		register_taxonomy( '{{tax2_slug}}', array( '{{cpt_slug}}' ), $args );
	}
}
```

**Step 2: Commit**

```bash
git add inc/class-taxonomies.php
git commit -m "refactor: use WordPress core register_taxonomy with proper labels and mustache placeholders"
```

---

### Task 1.7: Review and Document Bidirectional Relationships

**Files:**
- Create: `docs/BIDIRECTIONAL-RELATIONSHIPS.md`

**Step 1: Research SCF bidirectional fields**

Based on ACF/SCF documentation, bidirectional relationships are configured via the `bidirectional` parameter in field definition, NOT a separate class.

**Step 2: Create documentation**

```markdown
# Bidirectional Relationships in SCF

## Overview

Bidirectional relationships allow two-way connections between posts. When you relate Post A to Post B, Post B automatically shows Post A as related.

## Implementation

Bidirectional relationships are configured in field definitions, NOT in a separate class file.

## Example: Tours ↔ Accommodations

### Field Definition

```php
acf_add_local_field_group( array(
	'key'    => 'group_tour_relationships',
	'title'  => 'Related Content',
	'fields' => array(
		array(
			'key'           => 'field_related_accommodations',
			'label'         => 'Related Accommodations',
			'name'          => 'related_accommodations',
			'type'          => 'relationship',
			'post_type'     => array( 'accommodation' ),
			'return_format' => 'object',
			'bidirectional'  => 'related_tours', // Key of reverse field
		),
	),
	'location' => array(
		array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'tour',
			),
		),
	),
) );

// Reverse field on Accommodation post type
acf_add_local_field_group( array(
	'key'    => 'group_accommodation_relationships',
	'title'  => 'Related Content',
	'fields' => array(
		array(
			'key'           => 'field_related_tours',
			'label'         => 'Related Tours',
			'name'          => 'related_tours',
			'type'          => 'relationship',
			'post_type'     => array( 'tour' ),
			'return_format' => 'object',
			'bidirectional'  => 'related_accommodations', // Key of reverse field
		),
	),
	'location' => array(
		array(
			array(
				'param'    => 'post_type',
				'operator' => '==',
				'value'    => 'accommodation',
			),
		),
	),
) );
```

## Usage

```php
// On tour single page
$accommodations = get_field( 'related_accommodations' );
if ( $accommodations ) {
	foreach ( $accommodations as $accommodation ) {
		echo esc_html( $accommodation->post_title );
	}
}

// On accommodation single page (automatically synced!)
$tours = get_field( 'related_tours' );
if ( $tours ) {
	foreach ( $tours as $tour ) {
		echo esc_html( $tour->post_title );
	}
}
```

## Decision

**No separate class file needed.** Bidirectional relationships are configured in `inc/class-fields.php` using the `bidirectional` parameter.
```

**Step 3: Commit**

```bash
git add docs/BIDIRECTIONAL-RELATIONSHIPS.md
git commit -m "docs: document bidirectional relationship implementation strategy"
```

---

### Task 1.8: Review class-options.php and Add Example Setting

**Files:**
- Modify: `inc/class-options.php`
- Reference: https://developer.wordpress.org/plugins/settings/custom-settings-page/

**Step 1: Read current file**

```bash
cat inc/class-options.php | head -100
```

**Step 2: Add example setting with mustache placeholders**

Add a comprehensive PHPDoc comment at top of class explaining its purpose, then add an example settings page registration.

The file should demonstrate:
- Settings page registration
- Settings section
- Settings field
- Validation/sanitization
- Using SCF for options pages (https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-options-page.md)

**Step 3: Create example options page**

Add after constructor in `inc/class-options.php`:

```php
/**
 * Register plugin options pages.
 *
 * Uses SCF to create options pages for plugin settings.
 * Each options page can have multiple field groups attached.
 *
 * @return void
 */
public function register_options_pages() {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	// Main settings page.
	acf_add_options_page(
		array(
			'page_title' => __( '{{name}} Settings', '{{textdomain}}' ),
			'menu_title' => __( '{{name}} Settings', '{{textdomain}}' ),
			'menu_slug'  => '{{slug}}-settings',
			'capability' => 'manage_options',
			'icon_url'   => '{{cpt_menu_icon}}',
			'position'   => 60,
			'redirect'   => false,
		)
	);

	// Example sub-page.
	acf_add_options_sub_page(
		array(
			'page_title'  => __( 'Display Settings', '{{textdomain}}' ),
			'menu_title'  => __( 'Display', '{{textdomain}}' ),
			'parent_slug' => '{{slug}}-settings',
		)
	);
}
```

**Step 4: Add hook in constructor**

```php
public function __construct() {
	add_action( 'acf/init', array( $this, 'register_options_pages' ) );
}
```

**Step 5: Commit**

```bash
git add inc/class-options.php
git commit -m "feat: add example options page registration with SCF"
```

---

## PHASE 2: Multi-CPT Schema & Placeholder System

### Task 2.1: Expand plugin-config.schema.json for Multi-CPT

**Files:**
- Modify: `.github/schemas/plugin-config.schema.json`

**Step 1: Add custom_post_types array**

The schema currently has single `cpt_slug`, `cpt_supports`, etc. We need to restructure for multiple CPTs.

**Step 2: Update schema structure**

Modify the schema to have:

```json
"custom_post_types": {
  "type": "array",
  "description": "Array of custom post types to generate",
  "minItems": 1,
  "items": {
    "type": "object",
    "required": ["slug", "singular", "plural"],
    "properties": {
      "slug": {
        "type": "string",
        "description": "CPT slug (max 20 chars)",
        "pattern": "^[a-z][a-z0-9_]{0,18}[a-z0-9]$"
      },
      "singular": {
        "type": "string",
        "description": "Singular name"
      },
      "plural": {
        "type": "string",
        "description": "Plural name"
      },
      "supports": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"]
        }
      },
      "has_archive": {
        "type": "boolean",
        "default": true
      },
      "public": {
        "type": "boolean",
        "default": true
      },
      "menu_icon": {
        "type": "string",
        "pattern": "^dashicons-[a-z0-9-]+$",
        "default": "dashicons-admin-post"
      },
      "taxonomies": {
        "type": "array",
        "description": "Taxonomies for this specific CPT",
        "items": {
          "$ref": "#/$defs/taxonomy"
        }
      },
      "fields": {
        "type": "array",
        "description": "Custom fields for this specific CPT",
        "items": {
          "$ref": "#/$defs/field"
        }
      },
      "relationships": {
        "type": "array",
        "description": "Bidirectional relationships with other CPTs",
        "items": {
          "type": "object",
          "required": ["target_cpt", "field_name"],
          "properties": {
            "target_cpt": {
              "type": "string",
              "description": "Slug of the CPT to relate to"
            },
            "field_name": {
              "type": "string",
              "description": "Field name for this relationship"
            },
            "field_label": {
              "type": "string",
              "description": "Label shown in admin"
            },
            "reverse_field_name": {
              "type": "string",
              "description": "Field name on reverse side"
            }
          }
        }
      }
    }
  }
}
```

**Step 3: Add $defs for reusable schemas**

Add at root level of schema:

```json
"$defs": {
  "taxonomy": {
    "type": "object",
    "required": ["slug", "singular", "plural"],
    "properties": {
      "slug": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9_]{0,30}[a-z0-9]$"
      },
      "singular": {
        "type": "string"
      },
      "plural": {
        "type": "string"
      },
      "hierarchical": {
        "type": "boolean",
        "default": true
      }
    }
  },
  "field": {
    "type": "object",
    "required": ["name", "label", "type"],
    "properties": {
      "name": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9_]*$"
      },
      "label": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "enum": ["text", "textarea", "number", "select", "relationship", "post_object", "gallery", "image", "wysiwyg", "true_false"]
      }
    }
  }
}
```

**Step 4: Keep backward compatibility**

Keep old single CPT fields but mark as deprecated:

```json
"cpt_slug": {
  "type": "string",
  "deprecated": true,
  "description": "DEPRECATED: Use custom_post_types array instead. Kept for backward compatibility."
}
```

**Step 5: Commit**

```bash
git add .github/schemas/plugin-config.schema.json
git commit -m "feat: expand schema to support multiple custom post types"
```

---

### Task 2.2: Update plugin-config.example.json with Multi-CPT

**Files:**
- Modify: `.github/schemas/examples/plugin-config.example.json`

**Step 1: Add multi-CPT example**

```json
{
  "slug": "tour-operator",
  "name": "Tour Operator",
  "description": "Comprehensive tour booking and management plugin",
  "author": "LightSpeed",
  "author_uri": "https://developer.lsdev.biz",
  "custom_post_types": [
    {
      "slug": "tour",
      "singular": "Tour",
      "plural": "Tours",
      "supports": ["title", "editor", "thumbnail", "excerpt", "custom-fields", "revisions"],
      "has_archive": true,
      "public": true,
      "menu_icon": "dashicons-palmtree",
      "taxonomies": [
        {
          "slug": "destination",
          "singular": "Destination",
          "plural": "Destinations",
          "hierarchical": true
        }
      ],
      "fields": [
        {
          "name": "price",
          "label": "Price per Person",
          "type": "number"
        },
        {
          "name": "duration_days",
          "label": "Duration (Days)",
          "type": "number"
        }
      ],
      "relationships": [
        {
          "target_cpt": "accommodation",
          "field_name": "related_accommodations",
          "field_label": "Related Accommodations",
          "reverse_field_name": "related_tours"
        }
      ]
    },
    {
      "slug": "accommodation",
      "singular": "Accommodation",
      "plural": "Accommodations",
      "supports": ["title", "editor", "thumbnail", "excerpt", "custom-fields"],
      "has_archive": true,
      "public": true,
      "menu_icon": "dashicons-building",
      "taxonomies": [
        {
          "slug": "accommodation_type",
          "singular": "Accommodation Type",
          "plural": "Accommodation Types",
          "hierarchical": true
        }
      ],
      "fields": [
        {
          "name": "room_count",
          "label": "Number of Rooms",
          "type": "number"
        },
        {
          "name": "star_rating",
          "label": "Star Rating",
          "type": "select"
        }
      ]
    }
  ],
  "blocks": ["card", "collection", "slider", "featured"],
  "templates": ["single", "archive"]
}
```

**Step 2: Commit**

```bash
git add .github/schemas/examples/plugin-config.example.json
git commit -m "feat: add multi-CPT example configuration"
```

---

### Task 2.3: Rename Block Directories to Use {{cpt_slug}}

**Files:**
- Rename: `src/blocks/{{slug}}-collection` → `src/blocks/{{cpt_slug}}-collection`
- Rename: `src/blocks/{{slug}}-card` → `src/blocks/{{cpt_slug}}-card`
- Rename: `src/blocks/{{slug}}-featured` → `src/blocks/{{cpt_slug}}-featured`
- Rename: `src/blocks/{{slug}}-slider` → `src/blocks/{{cpt_slug}}-slider`

**Step 1: Rename directories**

```bash
cd src/blocks
mv "{{slug}}-collection" "{{cpt_slug}}-collection"
mv "{{slug}}-card" "{{cpt_slug}}-card"
mv "{{slug}}-featured" "{{cpt_slug}}-featured"
mv "{{slug}}-slider" "{{cpt_slug}}-slider"
cd ../..
```

**Step 2: Update block.json files**

For each block, update the `name` field in block.json:

```json
{
  "name": "{{slug}}/{{cpt_slug}}-collection"
}
```

**Step 3: Update all internal references**

Search and replace in each block's files:

```bash
find src/blocks/{{cpt_slug}}-* -type f \( -name "*.js" -o -name "*.php" -o -name "*.json" \) -exec sed -i '' 's/{{slug}}-collection/{{cpt_slug}}-collection/g' {} +
find src/blocks/{{cpt_slug}}-* -type f \( -name "*.js" -o -name "*.php" -o -name "*.json" \) -exec sed -i '' 's/{{slug}}-card/{{cpt_slug}}-card/g' {} +
find src/blocks/{{cpt_slug}}-* -type f \( -name "*.js" -o -name "*.php" -o -name "*.json" \) -exec sed -i '' 's/{{slug}}-featured/{{cpt_slug}}-featured/g' {} +
find src/blocks/{{cpt_slug}}-* -type f \( -name "*.js" -o -name "*.php" -o -name "*.json" \) -exec sed -i '' 's/{{slug}}-slider/{{cpt_slug}}-slider/g' {} +
```

**Step 4: Commit**

```bash
git add src/blocks/
git commit -m "refactor: rename block directories to use {{cpt_slug}} placeholder"
```

---

### Task 2.4: Rename Pattern Files

**Files:**
- Rename: `patterns/{{slug}}-*.php` → `patterns/{{cpt_slug}}-*.php`

**Step 1: Rename pattern files**

```bash
cd patterns
mv "{{slug}}-archive.php" "{{cpt_slug}}-archive.php"
mv "{{slug}}-card.php" "{{cpt_slug}}-card.php"
mv "{{slug}}-featured.php" "{{cpt_slug}}-featured.php"
mv "{{slug}}-grid.php" "{{cpt_slug}}-grid.php"
mv "{{slug}}-meta.php" "{{cpt_slug}}-meta.php"
mv "{{slug}}-single.php" "{{cpt_slug}}-single.php"
mv "{{slug}}-slider.php" "{{cpt_slug}}-slider.php"
cd ..
```

**Step 2: Update internal references**

```bash
find patterns/{{cpt_slug}}-* -type f -name "*.php" -exec sed -i '' 's/{{slug}}-/{{cpt_slug}}-/g' {} +
```

**Step 3: Update class-patterns.php registration**

Modify: `inc/class-patterns.php`

Update the pattern registration to use `{{cpt_slug}}` in filenames.

**Step 4: Commit**

```bash
git add patterns/ inc/class-patterns.php
git commit -m "refactor: rename pattern files to use {{cpt_slug}} placeholder"
```

---

### Task 2.5: Rename Template Files

**Files:**
- Rename: `templates/archive-{{slug}}.html` → `templates/archive-{{cpt_slug}}.html`
- Rename: `templates/single-{{slug}}.html` → `templates/single-{{cpt_slug}}.html`
- Rename: `template-parts/{{slug}}-*.html` → `template-parts/{{cpt_slug}}-*.html`

**Step 1: Rename template files**

```bash
cd templates
mv "archive-{{slug}}.html" "archive-{{cpt_slug}}.html"
mv "single-{{slug}}.html" "single-{{cpt_slug}}.html"
cd ../template-parts
mv "{{slug}}-header.html" "{{cpt_slug}}-header.html"
mv "{{slug}}-meta.html" "{{cpt_slug}}-meta.html"
mv "{{slug}}-sidebar.html" "{{cpt_slug}}-sidebar.html"
cd ..
```

**Step 2: Update references in templates**

```bash
find templates/ template-parts/ -type f -name "*.html" -exec sed -i '' 's/{{slug}}/{{cpt_slug}}/g' {} +
```

**Step 3: Update class-block-templates.php**

Modify: `inc/class-block-templates.php`

Change template assignment to use `{{cpt_slug}}`.

**Step 4: Commit**

```bash
git add templates/ template-parts/ inc/class-block-templates.php
git commit -m "refactor: rename template files to use {{cpt_slug}} placeholder"
```

---

### Task 2.6: Create styles/ Folder Structure

**Files:**
- Create: `styles/blocks/` directory
- Create: `styles/sections/` directory
- Create: `styles/typography/` directory
- Create: `styles/colors/` directory
- Create: `styles/presets/` directory

**Step 1: Create directory structure**

```bash
mkdir -p styles/blocks
mkdir -p styles/sections
mkdir -p styles/typography
mkdir -p styles/colors
mkdir -p styles/presets
```

**Step 2: Create example block style JSON**

Create: `styles/blocks/post-template-card.json`

```json
{
  "name": "card",
  "label": "Card Style",
  "blockTypes": ["core/post-template"],
  "styles": [
    {
      "selector": ".wp-block-post-template.is-style-card",
      "rules": {
        "display": "grid",
        "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
        "gap": "var(--wp--preset--spacing--50)"
      }
    }
  ]
}
```

Create: `styles/blocks/{{cpt_slug}}-collection-grid.json`

```json
{
  "name": "grid",
  "label": "Grid Layout",
  "blockTypes": ["{{slug}}/{{cpt_slug}}-collection"],
  "styles": [
    {
      "selector": ".wp-block-{{slug}}-{{cpt_slug}}-collection.is-style-grid",
      "rules": {
        "display": "grid",
        "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
        "gap": "var(--wp--preset--spacing--40)"
      }
    }
  ]
}
```

**Step 3: Update class-block-styles.php to load from JSON**

Modify: `inc/class-block-styles.php`

```php
<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Block Styles Registration.
 *
 * Registers block styles from JSON files in styles/ directory.
 * Styles are organized by: blocks, sections, typography, colors, presets.
 *
 * @package {{namespace}}
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Block_Styles
 *
 * Handles registration of block styles from JSON files.
 */
class Block_Styles {

	/**
	 * Constructor.
	 *
	 * Hooks into WordPress init to register block styles.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block_styles' ) );
	}

	/**
	 * Register all block styles from JSON files.
	 *
	 * @return void
	 */
	public function register_block_styles() {
		$styles_dir = {{namespace|upper}}_PLUGIN_DIR . 'styles/blocks/';

		if ( ! is_dir( $styles_dir ) ) {
			return;
		}

		$style_files = glob( $styles_dir . '*.json' );

		foreach ( $style_files as $style_file ) {
			$this->register_style_from_json( $style_file );
		}
	}

	/**
	 * Register a block style from a JSON file.
	 *
	 * @param string $file_path Path to JSON file.
	 * @return void
	 */
	private function register_style_from_json( $file_path ) {
		$style_data = json_decode( file_get_contents( $file_path ), true );

		if ( ! $style_data || ! isset( $style_data['name'], $style_data['blockTypes'] ) ) {
			return;
		}

		foreach ( $style_data['blockTypes'] as $block_type ) {
			register_block_style(
				$block_type,
				array(
					'name'  => $style_data['name'],
					'label' => $style_data['label'] ?? $style_data['name'],
				)
			);
		}

		// Enqueue styles if provided.
		if ( isset( $style_data['styles'] ) ) {
			add_action(
				'enqueue_block_assets',
				function () use ( $style_data ) {
					$this->enqueue_style_css( $style_data );
				}
			);
		}
	}

	/**
	 * Enqueue CSS for block styles.
	 *
	 * @param array $style_data Style data from JSON.
	 * @return void
	 */
	private function enqueue_style_css( $style_data ) {
		// Generate inline CSS from style rules.
		$css = '';
		foreach ( $style_data['styles'] as $style ) {
			$css .= $style['selector'] . ' {';
			foreach ( $style['rules'] as $property => $value ) {
				$css .= $property . ': ' . $value . ';';
			}
			$css .= '}';
		}

		if ( $css ) {
			wp_add_inline_style( 'wp-block-library', $css );
		}
	}
}
```

**Step 4: Add .gitkeep to other directories**

```bash
touch styles/sections/.gitkeep
touch styles/typography/.gitkeep
touch styles/colors/.gitkeep
touch styles/presets/.gitkeep
```

**Step 5: Commit**

```bash
git add styles/ inc/class-block-styles.php
git commit -m "feat: create styles/ directory structure with JSON-based block style registration"
```

---

## PHASE 3: Documentation Updates

### Task 3.1: Update scf-fields.instructions.md with Links

**Files:**
- Modify: `.github/instructions/scf-fields.instructions.md`

**Step 1: Add links section at top**

Add after the overview:

```markdown
## Official Documentation

- [SCF Tutorials](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/tutorials)
  - [First Custom Field](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-field.md)
  - [First Post Type](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-post-type.md)
  - [First Taxonomy](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-taxonomy.md)
  - [First Options Page](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-options-page.md)
- [SCF Code Reference](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference)
  - [Fields Reference](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference/fields)
  - [Local JSON File](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/local-json-file.md)
  - [Blocks File](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/blocks-file.md)
- [SCF API Features](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/features/scf-api.md)
```

**Step 2: Add section on bidirectional relationships**

Add after relational fields section:

```markdown
### Bidirectional Relationships

Create two-way connections between posts using the `bidirectional` parameter.

**See:** `docs/BIDIRECTIONAL-RELATIONSHIPS.md` for full implementation guide.
```

**Step 3: Commit**

```bash
git add .github/instructions/scf-fields.instructions.md
git commit -m "docs: add SCF documentation links and bidirectional relationships"
```

---

### Task 3.2: Update scaffold-extensions.instructions.md

**Files:**
- Modify: `.github/instructions/scaffold-extensions.instructions.md`

**Step 1: Document new placeholder system**

Add section:

```markdown
## Mustache Placeholder Reference

### Plugin-Level Placeholders

- `{{slug}}` - Plugin slug (kebab-case)
- `{{name}}` - Plugin display name
- `{{namespace}}` - PHP namespace (snake_case)
- `{{namespace|lowerCase}}` - Lowercase namespace
- `{{namespace|upper}}` - Uppercase namespace for constants
- `{{textdomain}}` - Internationalization text domain
- `{{version}}` - Plugin version
- `{{author}}` - Author name
- `{{author_uri}}` - Author website URL

### Custom Post Type Placeholders

- `{{cpt_slug}}` - Custom post type slug
- `{{cpt_name_singular}}` - Singular CPT name
- `{{cpt_name_plural}}` - Plural CPT name
- `{{cpt_supports}}` - Array of supported features
- `{{cpt_has_archive}}` - Boolean for archive page
- `{{cpt_public}}` - Boolean for public queryability
- `{{cpt_menu_icon}}` - Dashicon class name

### Taxonomy Placeholders

- `{{tax_slug}}` - Taxonomy slug (primary)
- `{{tax_singular}}` - Singular taxonomy name
- `{{tax_plural}}` - Plural taxonomy name
- `{{tax_hierarchical}}` - Boolean for hierarchy
- `{{tax2_slug}}` - Secondary taxonomy slug
- `{{tax2_singular}}` - Secondary singular name
- `{{tax2_plural}}` - Secondary plural name

### Block Placeholders

- `{{block_slug}}` - Individual block slug (e.g., "card", "collection")
- `{{block_name}}` - Block display name

### Context-Specific Usage

**CPT-Related Files:**
- `src/blocks/{{cpt_slug}}-collection/`
- `patterns/{{cpt_slug}}-card.php`
- `templates/single-{{cpt_slug}}.html`

**Plugin-Wide Files:**
- `{{slug}}.php` - Main plugin file
- Block category slug: `{{slug}}`

**Multi-CPT Support:**

When config has multiple CPTs, the first CPT becomes the primary:
- First CPT → `{{cpt_slug}}`, `{{cpt_name_singular}}`, etc.
- Additional CPTs handled via generator loops
```

**Step 2: Commit**

```bash
git add .github/instructions/scaffold-extensions.instructions.md
git commit -m "docs: document expanded mustache placeholder system"
```

---

### Task 3.3: Update generate-plugin.instructions.md

**Files:**
- Modify: `.github/instructions/generate-plugin.instructions.md`

**Step 1: Add multi-CPT workflow section**

```markdown
## Multi-CPT Plugin Generation

### Configuration

Define multiple custom post types in `plugin-config.json`:

```json
{
  "slug": "tour-operator",
  "name": "Tour Operator",
  "custom_post_types": [
    {
      "slug": "tour",
      "singular": "Tour",
      "plural": "Tours",
      "taxonomies": [...],
      "fields": [...],
      "relationships": [...]
    },
    {
      "slug": "accommodation",
      "singular": "Accommodation",
      "plural": "Accommodations"
    }
  ]
}
```

### Generation Behavior

1. **First CPT is Primary:** First CPT in array becomes `{{cpt_slug}}`
2. **Blocks Generated:** One set of blocks per CPT (card, collection, slider, featured)
3. **Patterns:** CPT-specific patterns for each post type
4. **Templates:** Single and archive templates per CPT
5. **Relationships:** Bidirectional fields automatically configured

### File Structure

```
generated-plugins/tour-operator/
├── src/blocks/
│   ├── tour-collection/
│   ├── tour-card/
│   ├── accommodation-collection/
│   └── accommodation-card/
├── patterns/
│   ├── tour-card.php
│   ├── tour-grid.php
│   ├── accommodation-card.php
│   └── accommodation-grid.php
├── templates/
│   ├── single-tour.html
│   ├── archive-tour.html
│   ├── single-accommodation.html
│   └── archive-accommodation.html
```
```

**Step 2: Commit**

```bash
git add .github/instructions/generate-plugin.instructions.md
git commit -m "docs: add multi-CPT generation workflow"
```

---

### Task 3.4: Update docs/GENERATE-PLUGIN.md

**Files:**
- Modify: `docs/GENERATE-PLUGIN.md`

**Step 1: Add multi-CPT examples**

Add comprehensive section showing:
- Multi-CPT config example
- Expected file output
- Relationship configuration
- Testing generated plugins

**Step 2: Add troubleshooting section**

```markdown
## Troubleshooting

### Multiple CPTs Not Generating

**Symptom:** Only first CPT generates blocks/patterns

**Solution:** Ensure generator script loops through `custom_post_types` array

### Bidirectional Relationships Not Working

**Symptom:** Reverse relationship doesn't auto-populate

**Solution:**
1. Verify `bidirectional` parameter uses correct field names
2. Check both field groups are registered
3. Clear WordPress cache

### Block Registration Fails

**Symptom:** Blocks don't appear in editor

**Solution:**
1. Run `npm run build`
2. Check `build/blocks/` directory exists
3. Verify `block.json` name matches directory
```

**Step 3: Commit**

```bash
git add docs/GENERATE-PLUGIN.md
git commit -m "docs: add multi-CPT examples and troubleshooting to generation guide"
```

---

### Task 3.5: Update docs/ARCHITECTURE.md

**Files:**
- Modify: `docs/ARCHITECTURE.md`

**Step 1: Add multi-CPT architecture section**

```markdown
## Multi-CPT Architecture

### Design Philosophy

The scaffold supports multiple custom post types per plugin while maintaining:
- Clean separation of concerns
- Reusable components
- CPT-specific customization
- Shared infrastructure

### Primary vs Secondary CPTs

**Primary CPT:**
- First in `custom_post_types` array
- Uses `{{cpt_slug}}` placeholder
- Gets full block/pattern/template suite
- Shown in examples throughout docs

**Secondary CPTs:**
- Additional CPTs in array
- Generate complete file sets
- Can relate to primary CPT bidirectionally
- Independent taxonomies and fields

### File Organization

```
inc/
├── class-core.php              # Orchestrates all registrations
├── class-post-types.php        # Loops through CPT array
├── class-taxonomies.php        # Registers taxonomies per CPT
└── class-fields.php            # Registers fields per CPT

src/blocks/
├── {cpt1-slug}-collection/     # Primary CPT blocks
├── {cpt1-slug}-card/
├── {cpt2-slug}-collection/     # Secondary CPT blocks
└── {cpt2-slug}-card/

patterns/
├── {cpt1-slug}-card.php        # Primary patterns
├── {cpt2-slug}-card.php        # Secondary patterns
```

### Relationship Management

Bidirectional relationships configured in field definitions:

```php
// On CPT 1
'bidirectional' => 'reverse_field_name'

// On CPT 2
'bidirectional' => 'forward_field_name'
```

No separate relationship class needed - handled by SCF automatically.
```

**Step 2: Commit**

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: document multi-CPT architecture and relationships"
```

---

### Task 3.6: Create Implementation Summary Document

**Files:**
- Create: `.github/projects/completed/2025-12-11-wordpress-standards-multi-cpt-implementation-summary.md`

**Step 1: Document what was completed**

```markdown
# WordPress Standards & Multi-CPT Implementation Summary

**Date Completed:** 2025-12-11
**Phases:** 3
**Tasks Completed:** 22

## Phase 1: WordPress Standards & Critical Fixes ✅

### Completed
1. ✅ Fixed duplicate plugin initialization
2. ✅ Added missing class includes (block-styles, scf-json-validator)
3. ✅ Added activation/deactivation hooks
4. ✅ Refactored CPT registration to use WordPress core
5. ✅ Refactored taxonomy registration
6. ✅ Documented bidirectional relationships (no separate class needed)
7. ✅ Added example options page

### Code Quality
- All PHP classes follow WordPress coding standards
- Proper PHPDoc on all public methods
- Defensive coding for SCF dependency
- i18n on all user-facing strings

## Phase 2: Multi-CPT Schema & Placeholders ✅

### Schema Changes
- ✅ Added `custom_post_types` array to schema
- ✅ Support for multiple CPTs with independent config
- ✅ Relationship definitions in schema
- ✅ Backward compatibility maintained

### File Renames
- ✅ `src/blocks/{{slug}}-*` → `src/blocks/{{cpt_slug}}-*`
- ✅ `patterns/{{slug}}-*` → `patterns/{{cpt_slug}}-*`
- ✅ `templates/*-{{slug}}` → `templates/*-{{cpt_slug}}`
- ✅ `template-parts/{{slug}}-*` → `template-parts/{{cpt_slug}}-*`

### New Features
- ✅ Block styles JSON system (`styles/` directory)
- ✅ CPT-specific placeholders
- ✅ Taxonomy-specific placeholders
- ✅ Relationship configuration

## Phase 3: Documentation ✅

### Updated Files
- ✅ `scf-fields.instructions.md` - Added links to SCF docs
- ✅ `scaffold-extensions.instructions.md` - Placeholder reference
- ✅ `generate-plugin.instructions.md` - Multi-CPT workflow
- ✅ `docs/GENERATE-PLUGIN.md` - Examples and troubleshooting
- ✅ `docs/ARCHITECTURE.md` - Multi-CPT architecture
- ✅ `docs/CPT-REGISTRATION-STRATEGY.md` - New doc
- ✅ `docs/BIDIRECTIONAL-RELATIONSHIPS.md` - New doc

## Next Steps

### Still TODO (Future Enhancements)
1. Update generator script to loop through `custom_post_types` array
2. Add PHPDoc to remaining inc/class-* files
3. Add JSDoc to JavaScript files
4. Security audit (nonces, escaping, sanitization)
5. Performance testing with multiple CPTs

### Testing Needed
1. Generate plugin with single CPT
2. Generate plugin with multiple CPTs + relationships
3. Verify bidirectional relationships work
4. Test all blocks render correctly
5. Validate against WordPress coding standards (phpcs)

## Files Modified

**Core:**
- `{{slug}}.php`
- `inc/class-core.php`
- `inc/class-post-types.php`
- `inc/class-taxonomies.php`
- `inc/class-options.php`
- `inc/class-block-styles.php`

**Schema:**
- `.github/schemas/plugin-config.schema.json`
- `.github/schemas/examples/plugin-config.example.json`

**Blocks:**
- `src/blocks/{{cpt_slug}}-collection/`
- `src/blocks/{{cpt_slug}}-card/`
- `src/blocks/{{cpt_slug}}-featured/`
- `src/blocks/{{cpt_slug}}-slider/`

**Patterns:**
- `patterns/{{cpt_slug}}-*.php` (7 files)

**Templates:**
- `templates/archive-{{cpt_slug}}.html`
- `templates/single-{{cpt_slug}}.html`
- `template-parts/{{cpt_slug}}-*.html` (3 files)

**Documentation:**
- `.github/instructions/*.instructions.md` (4 files)
- `docs/*.md` (4 files)

**Total Files:** 35+ files modified/created
```

**Step 2: Move to completed**

```bash
git add .github/projects/completed/2025-12-11-wordpress-standards-multi-cpt-implementation-summary.md
git commit -m "docs: add implementation summary for WordPress standards & multi-CPT project"
```

---

## Verification & Testing

### Final Verification Checklist

```bash
# 1. Verify no syntax errors in PHP files
find inc/ -name "*.php" -exec php -l {} \;

# 2. Verify schema is valid JSON
jsonlint .github/schemas/plugin-config.schema.json

# 3. Verify example config validates
# (requires ajv-cli: npm install -g ajv-cli)
ajv validate -s .github/schemas/plugin-config.schema.json -d .github/schemas/examples/plugin-config.example.json

# 4. Check all mustache placeholders are documented
grep -r "{{" inc/ src/ patterns/ templates/ | grep -v ".git" > /tmp/placeholders.txt
echo "Review /tmp/placeholders.txt to ensure all placeholders are documented"

# 5. Git status clean
git status
```

### Manual Testing

1. **Generate a plugin with single CPT:**
   ```bash
   node scripts/generate-plugin.js --config .github/schemas/examples/plugin-config.example.json
   ```

2. **Install in WordPress:**
   ```bash
   cp -r generated-plugins/tour-operator ~/Local\ Sites/test/app/public/wp-content/plugins/
   ```

3. **Activate and verify:**
   - CPT registered correctly
   - Taxonomies appear
   - Blocks available in editor
   - Patterns load
   - Templates assigned

---

## Success Criteria

✅ All Phase 1 tasks completed
✅ All Phase 2 tasks completed
✅ All Phase 3 tasks completed
✅ No PHP syntax errors
✅ Schema validates
✅ Documentation is comprehensive
✅ Mustache placeholders are consistent
✅ Git history is clean with descriptive commits
