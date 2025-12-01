<?php
/**
 * Title: {{name_singular}} Meta
 * Slug: {{namespace}}/{{slug}}-meta
 * Categories: {{slug}}
 * Keywords: meta, {{slug}}, taxonomy
 * Description: Display {{name_singular_lower}} metadata and taxonomies.
 * Viewport Width: 720
 */
?>
<!-- wp:group {"className":"{{slug}}-meta","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"margin":{"top":"var:preset|spacing|40"}}},"backgroundColor":"contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group {{slug}}-meta has-contrast-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
	<!-- wp:heading {"level":4} -->
	<h4><?php esc_html_e( 'Details', '{{textdomain}}' ); ?></h4>
	<!-- /wp:heading -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:post-terms {"term":"{{slug}}_category","prefix":"<?php esc_attr_e( 'Category: ', '{{textdomain}}' ); ?>"} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
