<?php
/**
 * ExamplePlugin Archive Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Archive', '{{textdomain}}' ),
	'slug'        => '{{slug}}/{{slug}}-archive',
	'description' => __( 'Displays an archive grid of items.', '{{textdomain}}' ),
	'categories'  => array( '{{slug}}' ),
	'keywords'    => array(
		__( 'archive', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'grid', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/query' ),
	'postTypes'   => array( 'item' ),
	'templateTypes' => array( 'archive', 'archive-example-plugin' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:query {"queryId":1,"query":{"postType":"item","perPage":12,"inherit":true},"layout":{"type":"constrained"}} -->
<div class="wp-block-query">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
		<!-- wp:pattern {"slug":"{{slug}}/{{slug}}-card"} /-->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-previous /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:paragraph {"align":"center"} -->
		<p class="has-text-align-center">' . esc_html__( 'No items found.', '{{textdomain}}' ) . '</p>
<div class="wp-block-query">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
		<!-- wp:pattern {"slug":"example_plugin/example-plugin-card"} /-->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-previous /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:paragraph {"align":"center"} -->
		<p class="has-text-align-center">' . esc_html__( 'No items found.', 'example-plugin' ) . '</p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->',
);
