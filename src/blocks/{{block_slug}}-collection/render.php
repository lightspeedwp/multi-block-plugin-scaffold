<?php
/**
 * Render callback for the {{block_slug}}-collection block.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function {{namespace}}_render_{{block_slug}}_collection( $attributes, $content, $block ) {
	// Output markup for the collection block.
	return '<div class="wp-block-{{namespace}}-{{block_slug}}-collection">' .
		'<p>' . esc_html__( 'Collection block output.', '{{textdomain}}' ) . '</p>' .
	'</div>';
}
