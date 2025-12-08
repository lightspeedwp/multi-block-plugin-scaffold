<?php
/**
 * Example Card Pattern
 *
 * This is a comprehensive example pattern showing all available properties
 * and best practices for plugin pattern development in the multi-block scaffold.
 *
 * Pattern Structure:
 * - Patterns must return a PHP associative array (NOT use file headers)
 * - Patterns are registered via inc/class-patterns.php
 * - All text must be internationalized with __() function
 * - CSS variables should have absolute fallbacks
 * - Use semantic HTML and ARIA attributes for accessibility
 *
 * @package    {{namespace}}
 * @subpackage Patterns
 * @since      1.0.0
 * @version    1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Disable image function check for patterns containing placeholder images.
// phpcs:ignoreFile PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage

return array(
	/**
	 * Title (Required)
	 * Human-readable pattern name shown in the block inserter.
	 * Must be internationalized.
	 */
	'title'         => __( 'Example Card', '{{textdomain}}' ),

	/**
	 * Description (Optional but Recommended)
	 * Hidden text used for searching patterns in the inserter.
	 * Should explain the pattern's purpose and use case.
	 */
	'description'   => __( 'A card layout for displaying content in grids and queries. Includes image, title, excerpt, and metadata.', '{{textdomain}}' ),

	/**
	 * Categories (Optional but Recommended)
	 * Array of category slugs. Use plugin slug as primary category.
	 * Additional categories can be registered in inc/class-patterns.php
	 */
	'categories'    => array( '{{slug}}' ),

	/**
	 * Keywords (Optional)
	 * Array of search terms/aliases to help users find the pattern.
	 * All keywords should be internationalized.
	 */
	'keywords'      => array(
		__( 'card', '{{textdomain}}' ),
		__( 'grid', '{{textdomain}}' ),
		__( 'post', '{{textdomain}}' ),
		__( 'layout', '{{textdomain}}' ),
	),

	/**
	 * Block Types (Optional)
	 * Array of block type names where this pattern is contextually relevant.
	 * Patterns appear as variations/transforms for these block types.
	 *
	 * Common block types:
	 * - core/post-template (for query loops)
	 * - core/query (for archive patterns)
	 * - core/group (for layout patterns)
	 * - core/columns (for column-based patterns)
	 */
	'blockTypes'    => array( 'core/post-template', 'core/query' ),

	/**
	 * Post Types (Optional)
	 * Restrict pattern visibility to specific post types.
	 * Use for patterns designed for custom post types.
	 *
	 * Examples: array( '{{slug}}', 'post', 'page' )
	 */
	'postTypes'     => array( '{{slug}}' ),

	/**
	 * Template Types (Optional)
	 * Specify which template types can use this pattern.
	 * Available in WordPress 6.2+
	 *
	 * Common types:
	 * - 'single' (single post/page templates)
	 * - 'archive' (archive templates)
	 * - 'home' (homepage template)
	 * - 'search' (search results template)
	 * - 'single-{{slug}}' (specific CPT template)
	 * - 'archive-{{slug}}' (specific archive template)
	 */
	'templateTypes' => array( 'single', 'archive', 'single-{{slug}}', 'archive-{{slug}}' ),

	/**
	 * Viewport Width (Optional)
	 * Intended width for scaled preview in the block inserter.
	 * Expressed in pixels.
	 *
	 * Recommended values:
	 * - 400px: Card patterns
	 * - 720px: Content sections
	 * - 1200px: Full-width layouts
	 * - 1400px: Hero sections
	 */
	'viewportWidth' => 400,

	/**
	 * Inserter (Optional)
	 * Boolean to control pattern visibility in the inserter.
	 * Default: true
	 *
	 * Set to false for patterns meant for programmatic use only
	 * (e.g., nested patterns, private patterns).
	 */
	'inserter'      => true,

	/**
	 * Content (Required)
	 * Block HTML markup for the pattern.
	 *
	 * Best Practices:
	 * 1. Use proper block markup with comments
	 * 2. Include metadata attributes for pattern name/categories
	 * 3. Add ariaLabel for accessibility
	 * 4. Use CSS custom properties with fallbacks
	 * 5. Internationalize all visible text with esc_html__() or esc_attr__()
	 * 6. Use semantic HTML elements
	 * 7. Include proper spacing and layout attributes
	 * 8. Use block bindings for dynamic content (metadata.bindings)
	 *
	 * CSS Variables:
	 * - Use var(--wp--preset--spacing--20) with fallback: var(--wp--preset--spacing--20, 1rem)
	 * - Or use inline style values directly: style="padding:1rem"
	 *
	 * Accessibility:
	 * - Add aria-label to container groups
	 * - Use semantic headings (h1-h6)
	 * - Include alt text for images
	 * - Ensure color contrast meets WCAG AA standards
	 */
	'content'       => '<!-- wp:group {"metadata":{"name":"' . esc_attr__( 'Example Card', '{{textdomain}}' ) . '","categories":["{{slug}}"],"patternName":"{{namespace}}/example-card"},"className":"{{slug}}-card overflow-hidden is-style-shadow-sm","style":{"spacing":{"blockGap":"var(--wp--preset--spacing--20, 1rem)"},"border":{"radius":"0.5rem"}},"layout":{"type":"default"},"ariaLabel":"' . esc_attr__( 'Example Card', '{{textdomain}}' ) . '"} -->
<div aria-label="' . esc_attr__( 'Example Card', '{{textdomain}}' ) . '" class="wp-block-group {{slug}}-card overflow-hidden is-style-shadow-sm" style="border-radius:0.5rem">

	<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2","linkTarget":"_blank"} /-->

	<!-- wp:group {"metadata":{"name":"' . esc_attr__( 'Card Content', '{{textdomain}}' ) . '"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--30, 1.5rem)","bottom":"var(--wp--preset--spacing--30, 1.5rem)","left":"var(--wp--preset--spacing--30, 1.5rem)","right":"var(--wp--preset--spacing--30, 1.5rem)"},"blockGap":"var(--wp--preset--spacing--20, 1rem)"}},"layout":{"type":"default"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--30, 1.5rem);padding-right:var(--wp--preset--spacing--30, 1.5rem);padding-bottom:var(--wp--preset--spacing--30, 1.5rem);padding-left:var(--wp--preset--spacing--30, 1.5rem)">

		<!-- wp:post-title {"level":3,"isLink":true,"style":{"elements":{"link":{":hover":{"color":{"text":"var(--wp--preset--color--primary, #0073aa)"}}}},"typography":{"fontSize":"1.25rem","lineHeight":"1.4"}},"className":"{{slug}}-card__title"} /-->

		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{namespace}}/fields","args":{"key":"{{slug}}_subtitle"}}}},"style":{"typography":{"fontStyle":"italic","fontSize":"1rem"},"color":{"text":"var(--wp--preset--color--contrast-2, #666666)"}},"className":"{{slug}}-card__subtitle"} -->
		<p class="{{slug}}-card__subtitle has-text-color" style="color:var(--wp--preset--color--contrast-2, #666666);font-size:1rem;font-style:italic"></p>
		<!-- /wp:paragraph -->

		<!-- wp:post-excerpt {"moreText":"","excerptLength":20,"style":{"typography":{"fontSize":"0.875rem"}}} /-->

		<!-- wp:group {"metadata":{"name":"' . esc_attr__( 'Card Meta', '{{textdomain}}' ) . '"},"className":"{{slug}}-card__meta","style":{"spacing":{"blockGap":"var(--wp--preset--spacing--10, 0.5rem)","margin":{"top":"var(--wp--preset--spacing--20, 1rem)"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"},"fontSize":"small"} -->
		<div class="wp-block-group {{slug}}-card__meta has-small-font-size" style="margin-top:var(--wp--preset--spacing--20, 1rem)">
			<!-- wp:post-date {"style":{"color":{"text":"var(--wp--preset--color--contrast-3, #888888)"}}} /-->

			<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--contrast-3, #888888)"}}} -->
			<p class="has-text-color" style="color:var(--wp--preset--color--contrast-3, #888888)">•</p>
			<!-- /wp:paragraph -->

			<!-- wp:post-author {"showAvatar":false,"style":{"color":{"text":"var(--wp--preset--color--contrast-3, #888888)"}}} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->',
);
