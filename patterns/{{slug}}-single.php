<?php
/**
 * ExamplePlugin Single Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Single', '{{textdomain}}' ),
	'slug'        => '{{slug}}/{{slug}}-single',
	'description' => __( 'Single item content layout.', '{{textdomain}}' ),
	'categories'  => array( '{{slug}}' ),
	'keywords'    => array(
		__( 'single', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'post', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/post-content', 'core/group' ),
	'postTypes'   => array( 'item' ),
	'templateTypes' => array( 'single', 'single-example-plugin' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
	<!-- wp:post-featured-image {"aspectRatio":"21/9"} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">
		<!-- wp:post-title {"level":1} /-->

		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"{{slug}}/fields","args":{"key":"{{namespace}}_subtitle"}}}},"style":{"typography":{"fontSize":"1.25rem","fontStyle":"italic"},"color":{"text":"#666666"}}} -->
		<p class="has-text-color" style="color:#666666;font-size:1.25rem;font-style:italic"></p>
		<!-- /wp:paragraph -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
		<div class="wp-block-group">
			<!-- wp:post-date /-->
			<!-- wp:post-author {"showAvatar":false} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:pattern {"slug":"{{slug}}/{{slug}}-meta"} /-->
</div>
<!-- /wp:group -->',
<div class="wp-block-group">
	<!-- wp:post-featured-image {"aspectRatio":"21/9"} /-->

	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">
		<!-- wp:post-title {"level":1} /-->

		<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"example_plugin/fields","args":{"key":"example_plugin_subtitle"}}}},"style":{"typography":{"fontSize":"1.25rem","fontStyle":"italic"},"color":{"text":"#666666"}}} -->
		<p class="has-text-color" style="color:#666666;font-size:1.25rem;font-style:italic"></p>
		<!-- /wp:paragraph -->

		<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
		<div class="wp-block-group">
			<!-- wp:post-date /-->
			<!-- wp:post-author {"showAvatar":false} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:pattern {"slug":"example_plugin/example-plugin-meta"} /-->
</div>
<!-- /wp:group -->',
);
