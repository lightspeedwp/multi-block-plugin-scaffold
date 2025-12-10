<?php
/**
 * Post Types Tests.
 *
 * @package example_plugin
 */

/**
 * Test case for Post Types class.
 */
class Test_Post_Types extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
		do_action( 'init' );
	}

	/**
	 * Test that post type is registered.
	 */
	public function test_post_type_registered() {
		$this->assertTrue( post_type_exists( 'example-plugin' ) );
	}

	/**
	 * Test that post type supports editor.
	 */
	public function test_post_type_supports_editor() {
		$this->assertTrue( post_type_supports( 'example-plugin', 'editor' ) );
	}

	/**
	 * Test that post type supports thumbnail.
	 */
	public function test_post_type_supports_thumbnail() {
		$this->assertTrue( post_type_supports( 'example-plugin', 'thumbnail' ) );
	}

	/**
	 * Test that post type supports title.
	 */
	public function test_post_type_supports_title() {
		$this->assertTrue( post_type_supports( 'example-plugin', 'title' ) );
	}

	/**
	 * Test that post type is public.
	 */
	public function test_post_type_is_public() {
		$post_type = get_post_type_object( 'example-plugin' );
		$this->assertTrue( $post_type->public );
	}

	/**
	 * Test that post type shows in REST.
	 */
	public function test_post_type_shows_in_rest() {
		$post_type = get_post_type_object( 'example-plugin' );
		$this->assertTrue( $post_type->show_in_rest );
	}

	/**
	 * Test that post type has archive.
	 */
	public function test_post_type_has_archive() {
		$post_type = get_post_type_object( 'example-plugin' );
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * Test can create post.
	 */
	public function test_can_create_post() {
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'example-plugin',
				'post_title' => 'Test Item',
			)
		);

		$this->assertIsInt( $post_id );
		$this->assertGreaterThan( 0, $post_id );

		$post = get_post( $post_id );
		$this->assertEquals( 'example-plugin', $post->post_type );
	}
}
