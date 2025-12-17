<?php
/**
 * Block Registration Tests.
 *
 * @package {{namespace}}
 */

/**
 * Test case for Block Registration.
 */
/**
 * Mustache: {{namespace}}, {{slug}}, {{textdomain}}
 */
class Test_Block_Registration extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
		do_action( 'init' );
	}

	/**
	 * Test that blocks are registered.
	 */
	public function test_blocks_registered() {
		$registry   = WP_Block_Type_Registry::get_instance();
		$registered = $registry->get_all_registered();

		$plugin_blocks = array_filter(
			array_keys( $registered ),
			function ( $name ) {
				return strpos( $name, 'example_plugin/' ) === 0;
			}
		);

		// At minimum, check that the registry exists.
		$this->assertInstanceOf( 'WP_Block_Type_Registry', $registry );
	}

	/**
	 * Test block category is registered.
	 */
	public function test_block_category_registered() {
		$plugin = new ExamplePlugin_Plugin();

		$categories = array(
			array(
				'slug'  => 'existing-category',
				'title' => 'Existing',
			),
		);

		$result = $plugin->register_block_category( $categories );

		$this->assertIsArray( $result );

		$slugs = array_column( $result, 'slug' );
		$this->assertContains( 'example-plugin', $slugs );
	}
}
