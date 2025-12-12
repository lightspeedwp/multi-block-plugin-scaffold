<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Block Style Variations Registration.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block style variations (including section-style like presets).
 *
 * @since 1.0.0
 */
class {{namespace|pascalCase}}_Block_Styles {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block_styles' ) );
	}

	/**
	 * Register block style variations.
	 *
	 * @since 1.0.0
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
				'name'       => '{{namespace}}-section-highlight',
				'label'      => __( '{{name}} Section Highlight', '{{textdomain}}' ),
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
