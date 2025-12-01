<?php
/**
 * Plugin Name:       {{name}}
 * Plugin URI:        {{plugin_uri}}
 * Description:       {{description}}
 * Version:           {{version}}
 * Requires at least: {{requires_wp}}
 * Requires PHP:      {{requires_php}}
 * Requires Plugins:  secure-custom-fields
 * Author:            {{author}}
 * Author URI:        {{author_uri}}
 * License:           {{license}}
 * License URI:       {{license_uri}}
 * Text Domain:       {{textdomain}}
 * Domain Path:       /languages
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Plugin constants.
define( '{{namespace|upper}}_VERSION', '{{version}}' );
define( '{{namespace|upper}}_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( '{{namespace|upper}}_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( '{{namespace|upper}}_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Defensive coding: Check for SCF/ACF functions before using them.
 *
 * While Plugin Dependencies ensures SCF is active, defensive coding is still
 * recommended for:
 * - Edge cases (FTP deletion, deployment issues)
 * - Loading order variations
 * - Future compatibility
 *
 * @see https://make.wordpress.org/core/2024/03/05/introducing-plugin-dependencies-in-wordpress-6-5/
 */
if ( ! function_exists( 'acf_add_local_field_group' ) ) {
	add_action(
		'admin_notices',
		function () {
			echo '<div class="error"><p>' .
				esc_html__( '{{name}} requires Secure Custom Fields to be active.', '{{textdomain}}' ) .
				'</p></div>';
		}
	);
	return;
}

// Include core classes.
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-post-types.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-taxonomies.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-fields.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-repeater-fields.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-options.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-scf-json.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-block-templates.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-block-bindings.php';
require_once {{namespace|upper}}_PLUGIN_DIR . 'inc/class-patterns.php';

/**
 * Main plugin class.
 */
class {{namespace|pascalCase}}_Plugin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

		// Initialize components.
		new {{namespace|pascalCase}}_Post_Types();
		new {{namespace|pascalCase}}_Taxonomies();
		new {{namespace|pascalCase}}_Fields();
		new {{namespace|pascalCase}}_Repeater_Fields();
		new {{namespace|pascalCase}}_Options();
		new {{namespace|pascalCase}}_SCF_JSON();
		new {{namespace|pascalCase}}_Block_Templates();
		new {{namespace|pascalCase}}_Block_Bindings();
		new {{namespace|pascalCase}}_Patterns();
	}

	/**
	 * Initialize the plugin.
	 *
	 * @return void
	 */
	public function init() {
		// Register block category.
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
	}

	/**
	 * Register blocks from the blocks directory.
	 *
	 * @return void
	 */
	public function register_blocks() {
		// Auto-register all blocks in src/blocks/.
		$blocks_dir = {{namespace|upper}}_PLUGIN_DIR . 'build/blocks/';

		if ( is_dir( $blocks_dir ) ) {
			$blocks = glob( $blocks_dir . '*/block.json' );

			foreach ( $blocks as $block_json ) {
				register_block_type( dirname( $block_json ) );
			}
		}
	}

	/**
	 * Register custom block category.
	 *
	 * @param array $categories Existing block categories.
	 * @return array Modified block categories.
	 */
	public function register_block_category( $categories ) {
		return array_merge(
			array(
				array(
					'slug'  => '{{slug}}',
					'title' => __( '{{name}}', '{{textdomain}}' ),
					'icon'  => 'admin-generic',
				),
			),
			$categories
		);
	}

	/**
	 * Load plugin text domain for translations.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'{{textdomain}}',
			false,
			dirname( {{namespace|upper}}_PLUGIN_BASENAME ) . '/languages'
		);
	}
}

new {{namespace|pascalCase}}_Plugin();
