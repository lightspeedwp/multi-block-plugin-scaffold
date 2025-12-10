<?php
/**
 * Block Bindings Registration.
 *
 * @package example_plugin
 * @since 6.5.0 Block Bindings API
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Bindings class.
 */
class Block_Bindings {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_sources' ) );
	}

	/**
	 * Register bindings sources.
	 *
	 * @return void
	 */
	public function register_sources() {
		if ( ! function_exists( 'register_block_bindings_source' ) ) {
			return;
		}

		register_block_bindings_source(
			'example-plugin/post-meta',
			array(
				'label'              => __( 'Example Plugin Post Meta', 'example-plugin' ),
				'get_value_callback' => array( $this, 'get_post_meta_value' ),
				'uses_context'       => array( 'postId' ),
			)
		);
	}

	/**
	 * Example binding: fetch a scalar post meta value.
	 *
	 * @param array $args    Binding arguments (expects 'key').
	 * @param array $context Binding context (expects 'postId').
	 * @return string|null
	 */
	public function get_post_meta_value( $args, $context ) {
		if ( empty( $args['key'] ) || empty( $context['postId'] ) ) {
			return null;
		}

		$meta = get_post_meta( (int) $context['postId'], $args['key'], true );

		if ( is_scalar( $meta ) ) {
			return (string) $meta;
		}

		return null;
	}
}
