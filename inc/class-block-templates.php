<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Block Templates Registration.
 *
 * @package example_plugin
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin block templates registration.
 */
class Block_Templates {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block_templates' ) );
	}

	/**
	 * Register plugin block templates via the WP 6.7+ API.
	 *
	 * @return void
	 */
	public function register_block_templates() {
		if ( ! function_exists( 'register_block_template' ) ) {
			return; // Pre-6.7: no-op.
		}

		$templates_dir = EXAMPLE_PLUGIN_PLUGIN_DIR . 'templates/';

		$template_file = $templates_dir . 'example-archive.html';

		if ( file_exists( $template_file ) ) {
			register_block_template(
				'example-plugin//example-archive',
				array(
					'title'       => __( 'Example Plugin Example Archive', '{{textdomain}}' ),
					'description' => __( 'Example archive template registered by the plugin.', '{{textdomain}}' ),
					'post_types'  => array( 'post' ),
					'content'     => file_get_contents( $template_file ),
				)
			);
		}
	}
}
