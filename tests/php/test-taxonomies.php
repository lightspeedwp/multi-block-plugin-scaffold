<?php
/**
 * Taxonomies Tests.
 *
 * @package example_plugin
 */

/**
 * Test case for Taxonomies class.
 */
class Test_Taxonomies extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
		do_action( 'init' );
	}

	/**
	 * Test that taxonomy is registered.
	 */
	public function test_taxonomy_registered() {
		$this->assertTrue( taxonomy_exists( 'example-plugin_category' ) );
	}

	/**
	 * Test that taxonomy is associated with post type.
	 */
	public function test_taxonomy_associated_with_post_type() {
		$taxonomies = get_object_taxonomies( 'example-plugin' );
		$this->assertContains( 'example-plugin_category', $taxonomies );
	}

	/**
	 * Test that taxonomy is hierarchical.
	 */
	public function test_taxonomy_is_hierarchical() {
		$taxonomy = get_taxonomy( 'example-plugin_category' );
		$this->assertTrue( $taxonomy->hierarchical );
	}

	/**
	 * Test that taxonomy is public.
	 */
	public function test_taxonomy_is_public() {
		$taxonomy = get_taxonomy( 'example-plugin_category' );
		$this->assertTrue( $taxonomy->public );
	}

	/**
	 * Test that taxonomy shows in REST.
	 */
	public function test_taxonomy_shows_in_rest() {
		$taxonomy = get_taxonomy( 'example-plugin_category' );
		$this->assertTrue( $taxonomy->show_in_rest );
	}

	/**
	 * Test can create term.
	 */
	public function test_can_create_term() {
		$term = wp_insert_term( 'Test Category', 'example-plugin_category' );

		$this->assertIsArray( $term );
		$this->assertArrayHasKey( 'term_id', $term );
		$this->assertGreaterThan( 0, $term['term_id'] );
	}

	/**
	 * Test can assign term to post.
	 */
	public function test_can_assign_term_to_post() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'example-plugin',
			)
		);

		$term = wp_insert_term( 'Assigned Category', 'example-plugin_category' );

		$result = wp_set_object_terms( $post_id, $term['term_id'], 'example-plugin_category' );

		$this->assertIsArray( $result );
		$this->assertContains( $term['term_id'], $result );

		$post_terms = wp_get_object_terms( $post_id, 'example-plugin_category', array( 'fields' => 'ids' ) );
		$this->assertContains( $term['term_id'], $post_terms );
	}
}
