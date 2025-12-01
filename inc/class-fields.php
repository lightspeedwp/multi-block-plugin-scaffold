<?php
/**
 * Custom Fields Registration using Secure Custom Fields.
 *
 * @package {{namespace}}
 * @see https://wordpress.org/plugins/secure-custom-fields/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Fields class.
 */
class {{namespace|pascalCase}}_Fields {

	/**
	 * Field group key.
	 *
	 * @var string
	 */
	const FIELD_GROUP = 'group_{{slug}}_fields';

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
						esc_html__( '%s requires Secure Custom Fields plugin to be installed and activated for custom fields functionality.', '{{textdomain}}' ),
						'<strong>{{name}}</strong>'
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
				'title'           => __( '{{name_singular}} Details', '{{textdomain}}' ),
				'fields'          => array(
					array(
						'key'          => 'field_{{slug}}_subtitle',
						'label'        => __( 'Subtitle', '{{textdomain}}' ),
						'name'         => '{{slug}}_subtitle',
						'type'         => 'text',
						'instructions' => __( 'Enter a subtitle for this {{name_singular_lower}}.', '{{textdomain}}' ),
					),
					array(
						'key'          => 'field_{{slug}}_featured',
						'label'        => __( 'Featured', '{{textdomain}}' ),
						'name'         => '{{slug}}_featured',
						'type'         => 'true_false',
						'ui'           => 1,
						'instructions' => __( 'Mark this {{name_singular_lower}} as featured.', '{{textdomain}}' ),
					),
					array(
						'key'           => 'field_{{slug}}_gallery',
						'label'         => __( 'Gallery', '{{textdomain}}' ),
						'name'          => '{{slug}}_gallery',
						'type'          => 'gallery',
						'instructions'  => __( 'Add images to the gallery.', '{{textdomain}}' ),
						'return_format' => 'array',
						'preview_size'  => 'medium',
						'library'       => 'all',
					),
					array(
						'key'           => 'field_{{slug}}_related',
						'label'         => __( 'Related {{name_plural}}', '{{textdomain}}' ),
						'name'          => '{{slug}}_related',
						'type'          => 'relationship',
						'post_type'     => array( {{namespace|pascalCase}}_Post_Types::POST_TYPE ),
						'filters'       => array( 'search', 'taxonomy' ),
						'return_format' => 'object',
						'instructions'  => __( 'Select related {{name_plural_lower}}.', '{{textdomain}}' ),
					),
				),
				'location'        => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => {{namespace|pascalCase}}_Post_Types::POST_TYPE,
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
