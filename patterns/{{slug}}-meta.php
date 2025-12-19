<?php
/**
 * ExamplePlugin Meta Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( 'Example Plugin Meta', 'example-plugin' ),
	'slug'        => 'example_plugin/example-plugin-meta',
	'description' => __( 'Display item metadata and taxonomies.', 'example-plugin' ),
	'categories'  => array( 'example-plugin' ),
	'keywords'    => array(
		__( 'meta', 'example-plugin' ),
		__( 'example-plugin', 'example-plugin' ),
		__( 'taxonomy', 'example-plugin' ),
	),
	'blockTypes'  => array( 'core/post-template', 'core/group' ),
	'postTypes'   => array( 'item' ),
	'viewportWidth' => 720,
	'content'     => '<!-- wp:group {"className":"example_plugin-example-plugin-meta","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"margin":{"top":"var:preset|spacing|40"}}},"backgroundColor":"contrast","layout":{"type":"constrained"}} -->
<div class="wp-block-group example_plugin-example-plugin-meta has-contrast-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
	<!-- wp:heading {"level":4} -->
	<h4>' . esc_html__( 'Details', 'example-plugin' ) . '</h4>
	<!-- /wp:heading -->

	<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
	<div class="wp-block-group">
		<!-- wp:post-terms {"term":"category","prefix":"' . esc_attr__( 'Category: ', 'example-plugin' ) . '"} /-->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->',
	'title'       => __( '{{name}} Meta', '{{textdomain}}' ),
	'slug'        => '{{slug}}/{{slug}}-meta',
	'description' => __( 'Display item metadata and taxonomies.', '{{textdomain}}' ),
	'categories'  => array( '{{slug}}' ),
	'keywords'    => array(
		__( 'meta', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'taxonomy', '{{textdomain}}' ),
	),
	'content'     => '<!-- wp:group {"className":"{{namespace}}-{{slug}}-meta","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"},"margin":{"top":"var:preset|spacing|40"}},"backgroundColor":"contrast","layout":{"type":"constrained"}} -->\n<div class="wp-block-group {{namespace}}-{{slug}}-meta has-contrast-background-color has-background" style="margin-top:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">\n\t<!-- wp:heading {"level":4} -->\n\t<h4>' . esc_html__( 'Details', '{{textdomain}}' ) . '</h4>\n\t<!-- /wp:heading -->\n\n\t<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->\n\t<div class="wp-block-group">\n\t\t<!-- wp:post-terms {"term":"category","prefix":"' . esc_attr__( 'Category: ', '{{textdomain}}' ) . '"} /-->\n\t</div>\n\t<!-- /wp:group -->\n</div>\n<!-- /wp:group -->',
);
