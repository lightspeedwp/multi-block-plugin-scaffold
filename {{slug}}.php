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

// Include the Core class.
require_once EXAMPLE_PLUGIN_PLUGIN_DIR . 'inc/class-core.php';

/**
 * Initialise the plugin and return the main instance.
 *
 * @return \example_plugin\classes\Core Main plugin instance.
 */
function example_plugin_plugin() {
	global $example_plugin_plugin;
	if ( null === $example_plugin_plugin ) {
		$example_plugin_plugin = new \example_plugin\classes\Core();
	}
	return $example_plugin_plugin;
}

// Initialize the plugin.
example_plugin_plugin();
