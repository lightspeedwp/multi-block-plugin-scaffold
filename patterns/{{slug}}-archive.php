<?php
/**
 * Title: {{name_singular}} Archive
 * Slug: {{namespace}}/{{slug}}-archive
 * Categories: {{slug}}
 * Keywords: archive, {{slug}}, grid
 * Description: Displays an archive grid of {{name_plural_lower}}.
 * Block Types: core/query
 * Viewport Width: 1200
 */
?>
<!-- wp:query {"queryId":1,"query":{"postType":"{{slug}}","perPage":12,"inherit":true},"layout":{"type":"constrained"}} -->
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
		<p class="has-text-align-center"><?php esc_html_e( 'No {{name_plural_lower}} found.', '{{textdomain}}' ); ?></p>
		<!-- /wp:paragraph -->
	<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
