<?php
/**
 * Render callback for the {{block_slug}}-featured block.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function {{namespace}}_render_{{block_slug}}_featured( $attributes, $content, $block ) {
	// Output markup for the featured block.
	return '<div class="wp-block-{{namespace}}-{{block_slug}}-featured">' .
		'<h2>' . esc_html__( 'Featured Content', '{{textdomain}}' ) . '</h2>' .
		'<div>' . esc_html__( 'Featured block output.', '{{textdomain}}' ) . '</div>' .
	'</div>';
}
