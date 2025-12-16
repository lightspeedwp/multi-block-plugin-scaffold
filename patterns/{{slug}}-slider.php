<?php
/**
 * {{slug|pascalCase}} Slider Pattern
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return array(
	'title'       => __( '{{name}} Slider', '{{textdomain}}' ),
	'slug'        => '{{namespace}}/{{slug}}-slider-pattern',
	'description' => __( 'A slider/carousel of items.', '{{textdomain}}' ),
	'categories'  => array( '{{textdomain}}' ),
	'keywords'    => array(
		__( 'slider', '{{textdomain}}' ),
		__( '{{slug}}', '{{textdomain}}' ),
		__( 'carousel', '{{textdomain}}' ),
	),
	'blockTypes'  => array( 'core/group', 'core/query' ),
	'postTypes'   => array( '{{cpt_slug}}' ),
	'viewportWidth' => 1200,
	'content'     => '<!-- wp:{{namespace}}/{{slug}}-slider {"source":"posts","autoplay":true,"autoplaySpeed":5000,"showDots":true,"showArrows":true} /-->',
);
