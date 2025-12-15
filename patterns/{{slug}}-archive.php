<?php
/**
 * {{slug|pascalCase}} Archive Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Archive', '{{textdomain}}' ),
	'slug'        => '{{namespace}}/{{slug}}-archive',
	'description' => __( 'Displays an archive grid of items.', '{{textdomain}}' ),
	'categories'  => array( '{{textdomain}}' ),
	'keywords'    => array(
		__( 'archive', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'grid', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/query' ),
	'postTypes'   => array( '{{slug}}' ),
	'templateTypes' => array( 'archive', 'archive-{{slug}}' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:query {"queryId":1,"query":{"postType":"{{slug}}","perPage":12,"inherit":true},"layout":{"type":"constrained"}} -->
<div class="wp-block-query">
	<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
		<!-- wp:pattern {"slug":"{{namespace}}/{{slug}}-card"} /-->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
		<!-- wp:query-pagination-previous /-->
		<!-- wp:query-pagination-numbers /-->
		<!-- wp:query-pagination-next /-->
	<!-- /wp:query-pagination -->

	<!-- wp:query-no-results -->
		<!-- wp:paragraph {"align":"center"} -->
		<p class="has-text-align-center">' . esc_html__( 'No items found.', '{{textdomain}}' ) . '</p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->',
);
