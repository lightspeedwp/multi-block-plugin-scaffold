<?php
/**
 * Block Bindings Registration.
 *
 * @package {{namespace}}
 * @since 6.5.0 Block Bindings API
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Bindings class.
 */
class {{namespace|pascalCase}}_Block_Bindings {

	/**
	 * Binding source name.
	 *
	 * @var string
	 */
	const SOURCE = '{{namespace}}/fields';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_bindings' ) );
	}

	/**
	 * Register block bindings source.
	 *
	 * @return void
	 */
	public function register_bindings() {
		if ( ! function_exists( 'register_block_bindings_source' ) ) {
			return;
		}

		register_block_bindings_source(
			self::SOURCE,
			array(
				'label'              => __( '{{name}} Fields', '{{textdomain}}' ),
				'get_value_callback' => array( $this, 'get_binding_value' ),
				'uses_context'       => array( 'postId', 'postType' ),
			)
		);
	}

	/**
	 * Get binding value callback.
	 *
	 * @param array    $source_args    Source arguments.
	 * @param WP_Block $block_instance Block instance.
	 * @param string   $attribute_name Attribute name.
	 *
	 * @return string|null
	 */
	public function get_binding_value( $source_args, $block_instance, $attribute_name ) {
		if ( empty( $source_args['key'] ) ) {
			return null;
		}

		$post_id = $block_instance->context['postId'] ?? get_the_ID();
		$field   = $source_args['key'];

		// Get ACF field value if available.
		if ( function_exists( 'get_field' ) ) {
			$value = get_field( $field, $post_id );

			if ( is_array( $value ) ) {
				return wp_json_encode( $value );
			}

			return $value;
		}

		// Fallback to post meta.
		return get_post_meta( $post_id, $field, true );
	}
}
