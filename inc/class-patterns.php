<?php
namespace {{namespace|lowerCase}}\classes;

/**
 * Block Patterns Registration.
 *
 * @package example_plugin
 */

namespace example_plugin\classes;

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
			'{{textdomain}}',
			array(
				'label' => __( 'Example Plugin', '{{textdomain}}' ),
			)
		);
	}

	/**
	 * Register patterns from patterns directory.
	 *
	 * Patterns return associative arrays with properties:
	 * - slug: Pattern identifier (required)
	 * - title: Display name (required)
	 * - description: Pattern description
	 * - categories: Array of category slugs
	 * - keywords: Array of search terms
	 * - viewportWidth: Preview width in pixels
	 * - blockTypes: Array of applicable block types
	 * - postTypes: Array of applicable post types
	 * - content: Block markup HTML (required)
	 *
	 * @return void
	 */
	public function register_patterns() {
		$patterns_dir = EXAMPLE_PLUGIN_PLUGIN_DIR . 'patterns/';

		if ( ! is_dir( $patterns_dir ) ) {
			return;
		}

		$pattern_files = glob( $patterns_dir . '*.php' );

		foreach ( $pattern_files as $pattern_file ) {
			$pattern = require $pattern_file;

			// Skip if pattern doesn't return an array.
			if ( ! is_array( $pattern ) ) {
				continue;
			}

			// Extract pattern slug from array or derive from filename.
			$slug = $pattern['slug'] ?? $this->get_pattern_slug_from_file( $pattern_file );

			// Skip if no slug available.
			if ( empty( $slug ) ) {
				continue;
			}

			// Register the pattern with WordPress.
			register_block_pattern( $slug, $pattern );
		}
	}

	/**
	 * Derive pattern slug from filename.
	 *
	 * Converts 'patterns/example-plugin-card.php' to 'example-plugin/card'
	 *
	 * @param string $pattern_file Full path to pattern file.
	 * @return string Pattern slug.
	 */
	private function get_pattern_slug_from_file( $pattern_file ) {
		$filename = basename( $pattern_file, '.php' );

		// Remove example-plugin- prefix if present.
		$pattern_name = str_replace( 'example-plugin-', '', $filename );

		// Return namespaced slug.
		return 'example-plugin/' . $pattern_name;
	}
}
