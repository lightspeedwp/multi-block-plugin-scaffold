<?php
/**
 * PHPUnit bootstrap file for {{name}}.
 *
 * @package {{namespace}}
 */

// Composer autoloader.
if ( file_exists( dirname( __DIR__ ) . '/vendor/autoload.php' ) ) {
	require dirname( __DIR__ ) . '/vendor/autoload.php';
}

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php" . PHP_EOL;
	echo "Have you run bin/install-wp-tests.sh?" . PHP_EOL;
	exit( 1 );
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	// Mock ACF functions for testing without ACF.
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		function acf_add_local_field_group( $args ) {
			return true;
		}
	}

	if ( ! function_exists( 'get_field' ) ) {
		function get_field( $field, $post_id = false ) {
			return get_post_meta( $post_id ? $post_id : get_the_ID(), $field, true );
		}
	}

	if ( ! function_exists( 'have_rows' ) ) {
		function have_rows( $field, $post_id = false ) {
			return false;
		}
	}

	require dirname( __DIR__ ) . '/{{slug}}.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
