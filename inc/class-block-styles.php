<?php
/**
 * Block Style Variations Registration.
 *
 * @package example_plugin
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block style variations (including section-style like presets).
 */
class Block_Styles {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block_styles' ) );
	}

	/**
	 * Register block style variations.
	 *
	 * @return void
	 */
	public function register_block_styles() {
		if ( ! function_exists( 'register_block_style' ) ) {
			return;
		}

		// Minimal example: section-like highlight for groups and columns.
		register_block_style(
			array( 'core/group', 'core/columns' ),
			array(
				'name'       => 'example-plugin-section-highlight',
				'label'      => __( 'Example Plugin Section Highlight', 'example-plugin' ),
				'style_data' => array(
					'color' => array(
						'background' => 'var:preset|color|contrast',
						'text'       => 'var:preset|color|base',
					),
				),
			)
		);
	}
}
