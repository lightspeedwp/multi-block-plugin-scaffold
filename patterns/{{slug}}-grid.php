<?php
/**
 * ExamplePlugin Grid Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Grid', '{{textdomain}}' ),
	'slug'        => '{{slug}}/{{slug}}-grid',
	'description' => __( 'A grid of items.', '{{textdomain}}' ),
	'categories'  => array( '{{slug}}' ),
	'keywords'    => array(
		__( 'grid', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'collection', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/group', 'core/query' ),
	'postTypes'   => array( 'item' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:{{slug}}/{{slug}}-collection {"layout":"grid","columns":3,"query":{"postType":"item","perPage":6}} /-->',
);
