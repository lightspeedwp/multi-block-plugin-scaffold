<?php
/**
 * Title: Item Meta
 * Slug: example_plugin/example-plugin-meta
 * Categories: example-plugin
 * Keywords: meta, example-plugin, taxonomy
 * Description: Display item metadata and taxonomies.
 * Viewport Width: 720
 */
?>
<!-- wp:group {"className":"example-plugin-meta","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"margin":{"top":"var:preset|spacing|40"}}},"backgroundColor":"contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group example-plugin-meta has-contrast-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
	<!-- wp:heading {"level":4} -->
	<h4><?php esc_html_e( 'Details', '{{textdomain}}' ); ?></h4>
	<!-- /wp:heading -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:post-terms {"term":"example-plugin_category","prefix":"<?php esc_attr_e( 'Category: ', '{{textdomain}}' ); ?>"} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
