<?php
/**
 * ExamplePlugin Featured Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Featured Items', '{{textdomain}}' ),
	'slug'        => '{{slug}}/{{slug}}-featured-pattern',
	'description' => __( 'Display featured items.', '{{textdomain}}' ),
	'categories'  => array( '{{slug}}' ),
	'keywords'    => array(
		__( 'featured', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'highlight', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/group', 'core/query' ),
	'postTypes'   => array( 'item' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:{{slug}}/{{slug}}-featured {"count":3,"layout":"featured-first"} /-->',
);
