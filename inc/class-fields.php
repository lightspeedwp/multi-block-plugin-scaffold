<?php
/**
 * Custom Fields Registration using Secure Custom Fields.
 *
 * @package example_plugin
 * @see https://wordpress.org/plugins/secure-custom-fields/
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Fields class.
 */
class Fields {

	/**
	 * Field group key.
	 *
	 * @var string
	 */
	const FIELD_GROUP = 'group_example-plugin_fields';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'acf/init', array( $this, 'register_fields' ) );
		add_action( 'admin_notices', array( $this, 'scf_dependency_notice' ) );
	}

	/**
	 * Check if Secure Custom Fields is active.
	 *
	 * @return bool
	 */
	public function is_scf_active() {
		return function_exists( 'acf_add_local_field_group' );
	}

	/**
	 * Display admin notice if SCF is not active.
	 *
	 * @return void
	 */
	public function scf_dependency_notice() {
		if ( ! $this->is_scf_active() ) {
			?>
			<div class="notice notice-warning">
				<p>
					<?php
					printf(
						/* translators: %s: Plugin name */
						esc_html__( '%s requires Secure Custom Fields plugin to be installed and activated for custom fields functionality.', 'example-plugin' ),
						'<strong>Example Plugin</strong>'
					);
					?>
				</p>
			</div>
			<?php
		}
	}

	/**
	 * Register custom fields.
	 *
	 * @return void
	 */
	public function register_fields() {
		if ( ! $this->is_scf_active() ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'             => self::FIELD_GROUP,
				'title'           => __( 'Item Details', 'example-plugin' ),
				'fields'          => array(
					array(
						'key'          => 'field_example-plugin_subtitle',
						'label'        => __( 'Subtitle', 'example-plugin' ),
						'name'         => 'example-plugin_subtitle',
						'type'         => 'text',
						'instructions' => __( 'Enter a subtitle for this item.', 'example-plugin' ),
					),
					array(
						'key'          => 'field_example-plugin_featured',
						'label'        => __( 'Featured', 'example-plugin' ),
						'name'         => 'example-plugin_featured',
						'type'         => 'true_false',
						'ui'           => 1,
						'instructions' => __( 'Mark this item as featured.', 'example-plugin' ),
					),
					array(
						'key'           => 'field_example-plugin_gallery',
						'label'         => __( 'Gallery', 'example-plugin' ),
						'name'          => 'example-plugin_gallery',
						'type'          => 'gallery',
						'instructions'  => __( 'Add images to the gallery.', 'example-plugin' ),
						'return_format' => 'array',
						'preview_size'  => 'medium',
						'library'       => 'all',
					),
					array(
						'key'           => 'field_example-plugin_related',
						'label'         => __( 'Related Items', 'example-plugin' ),
						'name'          => 'example-plugin_related',
						'type'          => 'relationship',
						'post_type'     => array( Post_Types::POST_TYPE ),
						'filters'       => array( 'search', 'taxonomy' ),
						'return_format' => 'object',
						'instructions'  => __( 'Select related items.', 'example-plugin' ),
					),
				),
				'location'        => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => Post_Types::POST_TYPE,
						),
					),
				),
				'menu_order'      => 0,
				'position'        => 'normal',
				'style'           => 'default',
				'label_placement' => 'top',
			)
		);
	}
}
