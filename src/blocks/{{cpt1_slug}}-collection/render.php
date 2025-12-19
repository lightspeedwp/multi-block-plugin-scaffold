<?php
/**
 * Render callback for the {{cpt1_slug}}-collection block.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function {{namespace}}_render_{{cpt1_slug}}_collection( $attributes, $content, $block ) {
	// Output markup for the CPT1 collection block.
	return '<div class="wp-block-{{namespace}}-{{cpt1_slug}}-collection">' .
		'<p>' . esc_html__( 'CPT1 collection block output.', '{{textdomain}}' ) . '</p>' .
	'</div>';
}
