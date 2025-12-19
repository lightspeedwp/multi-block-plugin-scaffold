<?php
/**
 * Render callback for the {{block_slug}}-card block.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function {{namespace}}_render_{{block_slug}}_card( $attributes, $content, $block ) {
	// Output markup for the card block.
	return '<div class="wp-block-{{namespace}}-{{block_slug}}-card">' .
		'<h3>' . esc_html__( 'Card Title', '{{textdomain}}' ) . '</h3>' .
		'<div>' . esc_html__( 'Card content goes here.', '{{textdomain}}' ) . '</div>' .
	'</div>';
}
