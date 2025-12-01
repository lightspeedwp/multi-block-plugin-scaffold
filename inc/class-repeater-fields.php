<?php
/**
 * Repeater and Flexible Content Fields using Secure Custom Fields.
 *
 * @package {{namespace}}
 * @see https://wordpress.org/plugins/secure-custom-fields/
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Repeater Fields class.
 */
class {{namespace|pascalCase}}_Repeater_Fields {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'acf/init', array( $this, 'register_repeater_fields' ) );
	}

	/**
	 * Register repeater field groups.
	 *
	 * @return void
	 */
	public function register_repeater_fields() {
		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		// Slider/Gallery Repeater Field Group.
		acf_add_local_field_group(
			array(
				'key'      => 'group_{{slug}}_slider',
				'title'    => __( '{{name_singular}} Slider', '{{textdomain}}' ),
				'fields'   => array(
					array(
						'key'          => 'field_{{slug}}_slides',
						'label'        => __( 'Slides', '{{textdomain}}' ),
						'name'         => '{{slug}}_slides',
						'type'         => 'repeater',
						'instructions' => __( 'Add slides to the slider.', '{{textdomain}}' ),
						'min'          => 0,
						'max'          => 20,
						'layout'       => 'block',
						'button_label' => __( 'Add Slide', '{{textdomain}}' ),
						'sub_fields'   => array(
							array(
								'key'           => 'field_{{slug}}_slide_image',
								'label'         => __( 'Image', '{{textdomain}}' ),
								'name'          => 'image',
								'type'          => 'image',
								'return_format' => 'array',
								'preview_size'  => 'medium',
								'library'       => 'all',
							),
							array(
								'key'   => 'field_{{slug}}_slide_title',
								'label' => __( 'Title', '{{textdomain}}' ),
								'name'  => 'title',
								'type'  => 'text',
							),
							array(
								'key'   => 'field_{{slug}}_slide_caption',
								'label' => __( 'Caption', '{{textdomain}}' ),
								'name'  => 'caption',
								'type'  => 'textarea',
								'rows'  => 2,
							),
							array(
								'key'   => 'field_{{slug}}_slide_link',
								'label' => __( 'Link', '{{textdomain}}' ),
								'name'  => 'link',
								'type'  => 'link',
							),
						),
					),
				),
				'location' => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => {{namespace|pascalCase}}_Post_Types::POST_TYPE,
						),
					),
				),
			)
		);

		// Flexible Content Field Group for sections.
		acf_add_local_field_group(
			array(
				'key'      => 'group_{{slug}}_sections',
				'title'    => __( '{{name_singular}} Sections', '{{textdomain}}' ),
				'fields'   => array(
					array(
						'key'          => 'field_{{slug}}_sections',
						'label'        => __( 'Content Sections', '{{textdomain}}' ),
						'name'         => '{{slug}}_sections',
						'type'         => 'flexible_content',
						'instructions' => __( 'Add content sections.', '{{textdomain}}' ),
						'button_label' => __( 'Add Section', '{{textdomain}}' ),
						'layouts'      => array(
							'layout_text'    => array(
								'key'        => 'layout_{{slug}}_text',
								'name'       => 'text_section',
								'label'      => __( 'Text Section', '{{textdomain}}' ),
								'sub_fields' => array(
									array(
										'key'   => 'field_{{slug}}_section_heading',
										'label' => __( 'Heading', '{{textdomain}}' ),
										'name'  => 'heading',
										'type'  => 'text',
									),
									array(
										'key'   => 'field_{{slug}}_section_content',
										'label' => __( 'Content', '{{textdomain}}' ),
										'name'  => 'content',
										'type'  => 'wysiwyg',
									),
								),
							),
							'layout_gallery' => array(
								'key'        => 'layout_{{slug}}_gallery',
								'name'       => 'gallery_section',
								'label'      => __( 'Gallery Section', '{{textdomain}}' ),
								'sub_fields' => array(
									array(
										'key'           => 'field_{{slug}}_section_gallery',
										'label'         => __( 'Gallery', '{{textdomain}}' ),
										'name'          => 'gallery',
										'type'          => 'gallery',
										'return_format' => 'array',
									),
								),
							),
							'layout_cta'     => array(
								'key'        => 'layout_{{slug}}_cta',
								'name'       => 'cta_section',
								'label'      => __( 'Call to Action', '{{textdomain}}' ),
								'sub_fields' => array(
									array(
										'key'   => 'field_{{slug}}_cta_text',
										'label' => __( 'CTA Text', '{{textdomain}}' ),
										'name'  => 'cta_text',
										'type'  => 'text',
									),
									array(
										'key'   => 'field_{{slug}}_cta_link',
										'label' => __( 'CTA Link', '{{textdomain}}' ),
										'name'  => 'cta_link',
										'type'  => 'link',
									),
								),
							),
						),
					),
				),
				'location' => array(
					array(
						array(
							'param'    => 'post_type',
							'operator' => '==',
							'value'    => {{namespace|pascalCase}}_Post_Types::POST_TYPE,
						),
					),
				),
			)
		);
	}
}
