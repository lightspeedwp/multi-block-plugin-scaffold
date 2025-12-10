<?php
/**
 * Custom Post Type Registration.
 *
 * @package example_plugin
 */

namespace example_plugin\classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Post Types class.
 */
class Post_Types {

	/**
	 * Post type slug.
	 *
	 * @var string
	 */
	const POST_TYPE = 'example-plugin';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	/**
	 * Register custom post types.
	 *
	 * @return void
	 */
	public function register_post_types() {
		$labels = array(
			'name'                  => _x( 'Items', 'Post type general name', 'example-plugin' ),
			'singular_name'         => _x( 'Item', 'Post type singular name', 'example-plugin' ),
			'menu_name'             => _x( 'Items', 'Admin Menu text', 'example-plugin' ),
			'add_new'               => __( 'Add New', 'example-plugin' ),
			'add_new_item'          => __( 'Add New Item', 'example-plugin' ),
			'edit_item'             => __( 'Edit Item', 'example-plugin' ),
			'new_item'              => __( 'New Item', 'example-plugin' ),
			'view_item'             => __( 'View Item', 'example-plugin' ),
			'view_items'            => __( 'View Items', 'example-plugin' ),
			'search_items'          => __( 'Search Items', 'example-plugin' ),
			'not_found'             => __( 'No items found.', 'example-plugin' ),
			'not_found_in_trash'    => __( 'No items found in Trash.', 'example-plugin' ),
			'all_items'             => __( 'All Items', 'example-plugin' ),
			'archives'              => __( 'Item Archives', 'example-plugin' ),
			'attributes'            => __( 'Item Attributes', 'example-plugin' ),
			'insert_into_item'      => __( 'Insert into item', 'example-plugin' ),
			'uploaded_to_this_item' => __( 'Uploaded to this item', 'example-plugin' ),
			'filter_items_list'     => __( 'Filter items list', 'example-plugin' ),
			'items_list_navigation' => __( 'Items list navigation', 'example-plugin' ),
			'items_list'            => __( 'Items list', 'example-plugin' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true, // Required for block editor.
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'example-plugin' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => 20,
			'menu_icon'          => 'dashicons-admin-generic',
			'supports'           => array(
				'title',
				'editor',
				'author',
				'thumbnail',
				'excerpt',
				'custom-fields',
				'revisions',
			),
			'template'           => array(
				array( 'example_plugin/example-plugin-single' ),
			),
			'template_lock'      => false,
		);

		register_post_type( self::POST_TYPE, $args );
	}
}
