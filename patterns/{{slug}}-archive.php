<?php
/**
 * Title: Item Archive
 * Slug: example_plugin/example-plugin-archive
 * Categories: example-plugin
 * Keywords: archive, example-plugin, grid
 * Description: Displays an archive grid of items.
 * Block Types: core/query
 * Viewport Width: 1200
 */
?>
<!-- wp:query {"queryId":1,"query":{"postType":"example-plugin","perPage":12,"inherit":true},"layout":{"type":"constrained"}} -->
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
		<p class="has-text-align-center"><?php esc_html_e( 'No items found.', '{{textdomain}}' ); ?></p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
