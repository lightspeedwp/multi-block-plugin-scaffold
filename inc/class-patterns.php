<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Block Patterns Registration.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Patterns class.
 */
class Patterns {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_pattern_category' ) );
		add_action( 'init', array( $this, 'register_patterns' ) );
	}

	/**
	 * Register pattern category.
	 *
	 * @return void
	 */
	public function register_pattern_category() {
		register_block_pattern_category(
			'{{slug}}',
			array(
				'label' => __( '{{name}}', '{{textdomain}}' ),
			)
		);
	}

	/**
	 * Register patterns from patterns directory.
	 *
	 * @return void
	 */
	public function register_patterns() {
		$patterns_dir = {{namespace|upper}}_PLUGIN_DIR . 'patterns/';

		if ( ! is_dir( $patterns_dir ) ) {
			return;
		}

		$pattern_files = glob( $patterns_dir . '*.php' );

		foreach ( $pattern_files as $pattern_file ) {
			// The pattern files register themselves via the file header.
			require_once $pattern_file;
		}
	}
}
