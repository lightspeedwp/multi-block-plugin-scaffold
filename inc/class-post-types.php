<?php
namespace {{namespace|lowerCase}}\classes;

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
	const POST_TYPE = '{{cpt_slug}}';

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
			'name'                  => _x( 'Items', 'Post type general name', '{{textdomain}}' ),
			'singular_name'         => _x( 'Item', 'Post type singular name', '{{textdomain}}' ),
			'menu_name'             => _x( 'Items', 'Admin Menu text', '{{textdomain}}' ),
			'add_new'               => __( 'Add New', '{{textdomain}}' ),
			'add_new_item'          => __( 'Add New Item', '{{textdomain}}' ),
			'edit_item'             => __( 'Edit Item', '{{textdomain}}' ),
			'new_item'              => __( 'New Item', '{{textdomain}}' ),
			'view_item'             => __( 'View Item', '{{textdomain}}' ),
			'view_items'            => __( 'View Items', '{{textdomain}}' ),
			'search_items'          => __( 'Search Items', '{{textdomain}}' ),
			'not_found'             => __( 'No items found.', '{{textdomain}}' ),
			'not_found_in_trash'    => __( 'No items found in Trash.', '{{textdomain}}' ),
			'all_items'             => __( 'All Items', '{{textdomain}}' ),
			'archives'              => __( 'Item Archives', '{{textdomain}}' ),
			'attributes'            => __( 'Item Attributes', '{{textdomain}}' ),
			'insert_into_item'      => __( 'Insert into item', '{{textdomain}}' ),
			'uploaded_to_this_item' => __( 'Uploaded to this item', '{{textdomain}}' ),
			'filter_items_list'     => __( 'Filter items list', '{{textdomain}}' ),
			'items_list_navigation' => __( 'Items list navigation', '{{textdomain}}' ),
			'items_list'            => __( 'Items list', '{{textdomain}}' ),
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true, // Required for block editor.
			'query_var'          => true,
			'rewrite'            => array( 'slug' => '{{textdomain}}' ),
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
