<?php
/**
 * Main Plugin Tests.
 *
 * @package {{namespace}}
 */

/**
 * Test case for main plugin class.
 */
class Test_Plugin_Main extends WP_UnitTestCase {

	/**
	 * Set up test fixtures.
	 */
	public function setUp(): void {
		parent::setUp();
	}

	/**
	 * Test that plugin constants are defined.
	 */
	public function test_plugin_constants_defined() {
		$this->assertTrue( defined( '{{namespace|upper}}_VERSION' ) );
		$this->assertTrue( defined( '{{namespace|upper}}_PLUGIN_DIR' ) );
		$this->assertTrue( defined( '{{namespace|upper}}_PLUGIN_URL' ) );
		$this->assertTrue( defined( '{{namespace|upper}}_PLUGIN_BASENAME' ) );
	}

	/**
	 * Test that main plugin class exists.
	 */
	public function test_main_class_exists() {
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Plugin' ) );
	}

	/**
	 * Test that supporting classes exist.
	 */
	public function test_supporting_classes_exist() {
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Post_Types' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Taxonomies' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Fields' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Repeater_Fields' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Block_Templates' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Block_Bindings' ) );
		$this->assertTrue( class_exists( '{{namespace|pascalCase}}_Patterns' ) );
	}
}
