<?php
/**
 * Fields Tests.
 *
 * @package {{namespace}}
 */

/**
 * Test case for Fields class.
 */
/**
 * Mustache: {{namespace}}, {{slug}}, {{textdomain}}
 */
class Test_Fields extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
		do_action( 'init' );
	}

	/**
	 * Test that fields class can be instantiated.
	 */
	public function test_fields_class_exists() {
		$this->assertTrue( class_exists( 'ExamplePlugin_Fields' ) );
	}

	/**
	 * Test is_scf_active method returns correct value.
	 */
	public function test_is_scf_active() {
		$fields = new ExamplePlugin_Fields();
		$this->assertTrue( $fields->is_scf_active() );
	}

	/**
	 * Test that post meta can be set and retrieved.
	 */
	public function test_can_set_and_get_post_meta() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'example-plugin',
			)
		);

		update_post_meta( $post_id, 'example-plugin_subtitle', 'Test Subtitle' );
		$value = get_post_meta( $post_id, 'example-plugin_subtitle', true );

		$this->assertEquals( 'Test Subtitle', $value );
	}

	/**
	 * Test that featured field can be set.
	 */
	public function test_can_set_featured_field() {
		$post_id = $this->factory->post->create(
			array(
				'post_type' => 'example-plugin',
			)
		);

		update_post_meta( $post_id, 'example-plugin_featured', '1' );
		$value = get_post_meta( $post_id, 'example-plugin_featured', true );

		$this->assertEquals( '1', $value );
	}
}
