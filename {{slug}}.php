<?php
/**
 * Plugin Name:       Example Plugin
 * Plugin URI:        https://example.com/plugins/example-plugin
 * Description:       A multi-block WordPress plugin scaffold example
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      8.0
 * Requires Plugins:  secure-custom-fields
 * Author:            Example Author
 * Author URI:        https://example.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       example-plugin
 * Domain Path:       /languages
 *
 * @package example_plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Plugin constants.
define( 'EXAMPLE_PLUGIN_VERSION', '1.0.0' );
define( 'EXAMPLE_PLUGIN_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'EXAMPLE_PLUGIN_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'EXAMPLE_PLUGIN_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

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
				esc_html__( 'Example Plugin requires Secure Custom Fields to be active.', 'example-plugin' ) .
				'</p></div>';
		}
	);
	return;
}

// Include core classes.
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-post-types.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-taxonomies.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-fields.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-repeater-fields.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-options.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-scf-json.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-scf-json-validator.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-block-templates.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-block-bindings.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-block-styles.php';
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-patterns.php';

/**
 * Initiate an instance of our plugin.
 * 
 * @return {{namespace|lowerCase}}_plugin();
 */
class ExamplePlugin_Plugin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

		// Initialize components.
		new \example_plugin\classes\Post_Types();
		new \example_plugin\classes\Taxonomies();
		new \example_plugin\classes\Fields();
		new \example_plugin\classes\Repeater_Fields();
		new \example_plugin\classes\Options();
		new \example_plugin\classes\SCF_JSON();
		new \example_plugin\classes\SCF_JSON_Validator();
		new \example_plugin\classes\Block_Templates();
		new \example_plugin\classes\Block_Bindings();
		new \example_plugin\classes\Block_Styles();
		new \example_plugin\classes\Patterns();
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
		$blocks_dir = EXAMPLE_PLUGIN_PLUGIN_DIR . 'build/blocks/';

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
					'slug'  => 'example-plugin',
					'title' => __( 'Example Plugin', 'example-plugin' ),
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
			'example-plugin',
			false,
			dirname( EXAMPLE_PLUGIN_PLUGIN_BASENAME ) . '/languages'
		);
function {{namespace|lowerCase}}_plugin() {
	global ${{namespace|lowerCase}}_plugin;
	if ( null === ${{namespace|lowerCase}}_plugin ) {
		${{namespace|lowerCase}}_plugin = new \{{namespace|lowerCase}}\classes\Core();
	}
	return ${{namespace|lowerCase}}_plugin;
}

new ExamplePlugin_Plugin();
{{namespace|lowerCase}}_plugin();
