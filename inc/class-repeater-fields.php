<?php
/**
 * Repeater and Flexible Content Fields using Secure Custom Fields.
 *
 * @package example_plugin
 * @see https://wordpress.org/plugins/secure-custom-fields/
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Repeater Fields class.
 */
class Repeater_Fields {

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
				'key'      => 'group_example-plugin_slider',
				'title'    => __( 'Item Slider', 'example-plugin' ),
				'fields'   => array(
					array(
						'key'          => 'field_example-plugin_slides',
						'label'        => __( 'Slides', 'example-plugin' ),
						'name'         => 'example-plugin_slides',
						'type'         => 'repeater',
						'instructions' => __( 'Add slides to the slider.', 'example-plugin' ),
						'min'          => 0,
						'max'          => 20,
						'layout'       => 'block',
						'button_label' => __( 'Add Slide', 'example-plugin' ),
						'sub_fields'   => array(
							array(
								'key'           => 'field_example-plugin_slide_image',
								'label'         => __( 'Image', 'example-plugin' ),
								'name'          => 'image',
								'type'          => 'image',
								'return_format' => 'array',
								'preview_size'  => 'medium',
								'library'       => 'all',
							),
							array(
								'key'   => 'field_example-plugin_slide_title',
								'label' => __( 'Title', 'example-plugin' ),
								'name'  => 'title',
								'type'  => 'text',
							),
							array(
								'key'   => 'field_example-plugin_slide_caption',
								'label' => __( 'Caption', 'example-plugin' ),
								'name'  => 'caption',
								'type'  => 'textarea',
								'rows'  => 2,
							),
							array(
								'key'   => 'field_example-plugin_slide_link',
								'label' => __( 'Link', 'example-plugin' ),
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
							'value'    => Post_Types::POST_TYPE,
						),
					),
				),
			)
		);

		// Flexible Content Field Group for sections.
		acf_add_local_field_group(
			array(
				'key'      => 'group_example-plugin_sections',
				'title'    => __( 'Item Sections', 'example-plugin' ),
				'fields'   => array(
					array(
						'key'          => 'field_example-plugin_sections',
						'label'        => __( 'Content Sections', 'example-plugin' ),
						'name'         => 'example-plugin_sections',
						'type'         => 'flexible_content',
						'instructions' => __( 'Add content sections.', 'example-plugin' ),
						'button_label' => __( 'Add Section', 'example-plugin' ),
						'layouts'      => array(
							'layout_text'    => array(
								'key'        => 'layout_example-plugin_text',
								'name'       => 'text_section',
								'label'      => __( 'Text Section', 'example-plugin' ),
								'sub_fields' => array(
									array(
										'key'   => 'field_example-plugin_section_heading',
										'label' => __( 'Heading', 'example-plugin' ),
										'name'  => 'heading',
										'type'  => 'text',
									),
									array(
										'key'   => 'field_example-plugin_section_content',
										'label' => __( 'Content', 'example-plugin' ),
										'name'  => 'content',
										'type'  => 'wysiwyg',
									),
								),
							),
							'layout_gallery' => array(
								'key'        => 'layout_example-plugin_gallery',
								'name'       => 'gallery_section',
								'label'      => __( 'Gallery Section', 'example-plugin' ),
								'sub_fields' => array(
									array(
										'key'           => 'field_example-plugin_section_gallery',
										'label'         => __( 'Gallery', 'example-plugin' ),
										'name'          => 'gallery',
										'type'          => 'gallery',
										'return_format' => 'array',
									),
								),
							),
							'layout_cta'     => array(
								'key'        => 'layout_example-plugin_cta',
								'name'       => 'cta_section',
								'label'      => __( 'Call to Action', 'example-plugin' ),
								'sub_fields' => array(
									array(
										'key'   => 'field_example-plugin_cta_text',
										'label' => __( 'CTA Text', 'example-plugin' ),
										'name'  => 'cta_text',
										'type'  => 'text',
									),
									array(
										'key'   => 'field_example-plugin_cta_link',
										'label' => __( 'CTA Link', 'example-plugin' ),
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
							'value'    => Post_Types::POST_TYPE,
						),
					),
				),
			)
		);
	}
}
