<?php
/**
 * {{slug|pascalCase}} Meta Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Meta', '{{textdomain}}' ),
	'slug'        => '{{namespace}}/{{slug}}-meta',
	'description' => __( 'Display item metadata and taxonomies.', '{{textdomain}}' ),
	'categories'  => array( '{{textdomain}}' ),
	'keywords'    => array(
		__( 'meta', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'taxonomy', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/post-template', 'core/group' ),
	'postTypes'   => array( '{{cpt_slug}}' ),
	'viewportWidth' => 720,
	'content'     => '<!-- wp:group {"className":"{{namespace}}-{{slug}}-meta","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"margin":{"top":"var:preset|spacing|40"}}},"backgroundColor":"contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group {{namespace}}-{{slug}}-meta has-contrast-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
	<!-- wp:heading {"level":4} -->
	<h4>' . esc_html__( 'Details', '{{textdomain}}' ) . '</h4>
	<!-- /wp:heading -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:post-terms {"term":"{{taxonomy_slug}}","prefix":"' . esc_attr__( 'Category: ', '{{textdomain}}' ) . '"} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->',
);
