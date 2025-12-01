<?php
/**
 * SCF Local JSON Save/Load Integration Tests.
 *
 * Tests for SCF Local JSON saving and loading functionality,
 * including file creation, directory setup, and ACF filter integration.
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Test SCF Local JSON save and load operations.
 */
class {{namespace|pascalCase}}_SCF_JSON_Save_Load_Test extends WP_UnitTestCase {

	/**
	 * SCF JSON handler instance.
	 *
	 * @var {{namespace|pascalCase}}_SCF_JSON
	 */
	private $scf_json;

	/**
	 * Test directory path.
	 *
	 * @var string
	 */
	private $test_json_dir;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		// Create test JSON directory.
		$this->test_json_dir = sys_get_temp_dir() . '/scf-json-test-' . uniqid();
		wp_mkdir_p( $this->test_json_dir );

		// Initialize SCF JSON handler.
		if ( class_exists( '{{namespace|pascalCase}}_SCF_JSON' ) ) {
			$this->scf_json = new {{namespace|pascalCase}}_SCF_JSON();
		}
	}

	/**
	 * Clean up after tests.
	 */
	public function tear_down() {
		// Remove test JSON directory and files.
		if ( file_exists( $this->test_json_dir ) ) {
			$this->remove_directory_recursive( $this->test_json_dir );
		}

		parent::tear_down();
	}

	/**
	 * Recursively remove directory and contents.
	 *
	 * @param string $dir Directory path.
	 */
	private function remove_directory_recursive( $dir ) {
		if ( ! is_dir( $dir ) ) {
			if ( file_exists( $dir ) ) {
				unlink( $dir );
			}
			return;
		}

		$files = scandir( $dir );
		if ( false === $files ) {
			return;
		}

		foreach ( $files as $file ) {
			if ( '.' !== $file && '..' !== $file ) {
				$this->remove_directory_recursive( $dir . '/' . $file );
			}
		}

		rmdir( $dir );
	}

	/**
	 * Test that SCF JSON handler is available.
	 */
	public function test_scf_json_handler_available() {
		$this->assertTrue(
			class_exists( '{{namespace|pascalCase}}_SCF_JSON' ),
			'SCF JSON handler class should exist'
		);
	}

	/**
	 * Test get_json_path() returns expected directory.
	 */
	public function test_get_json_path() {
		$this->skip_if_scf_json_not_available();

		$path = $this->scf_json->get_json_path();
		$this->assertIsString( $path );
		$this->assertNotEmpty( $path );
	}

	/**
	 * Test that JSON directory can be created.
	 */
	public function test_json_directory_creation() {
		$test_dir = $this->test_json_dir . '/acf-json';

		$this->assertFalse( file_exists( $test_dir ) );

		wp_mkdir_p( $test_dir );

		$this->assertTrue( is_dir( $test_dir ) );
	}

	/**
	 * Test getting JSON files from directory.
	 */
	public function test_get_json_files() {
		$this->skip_if_scf_json_not_available();

		// Create test JSON files.
		$test_file_1 = $this->test_json_dir . '/group_test_1.json';
		$test_file_2 = $this->test_json_dir . '/group_test_2.json';
		$non_json     = $this->test_json_dir . '/readme.txt';

		file_put_contents( $test_file_1, '{}' );
		file_put_contents( $test_file_2, '{}' );
		file_put_contents( $non_json, 'not json' );

		// Use glob to get JSON files like the handler does.
		$json_files = glob( $this->test_json_dir . '/*.json' );

		$this->assertIsArray( $json_files );
		$this->assertCount( 2, $json_files );
		$this->assertContains( $test_file_1, $json_files );
		$this->assertContains( $test_file_2, $json_files );
		$this->assertNotContains( $non_json, $json_files );
	}

	/**
	 * Test saving JSON field group file.
	 */
	public function test_save_json_file() {
		$field_group = array(
			'key'      => 'group_test_save',
			'title'    => 'Test Field Group',
			'fields'   => array(),
			'location' => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'post',
					),
				),
			),
		);

		$file_path = $this->test_json_dir . '/group_test_save.json';

		// Write JSON file.
		$json_content = wp_json_encode( $field_group );
		file_put_contents( $file_path, $json_content );

		$this->assertTrue( file_exists( $file_path ) );

		// Read and verify content.
		$saved_content  = file_get_contents( $file_path );
		$saved_data     = json_decode( $saved_content, true );
		$this->assertIsArray( $saved_data );
		$this->assertEquals( 'group_test_save', $saved_data['key'] );
	}

	/**
	 * Test loading JSON field group file.
	 */
	public function test_load_json_file() {
		// Create a test JSON file.
		$field_group = array(
			'key'      => 'group_test_load',
			'title'    => 'Test Load Group',
			'fields'   => array(
				array(
					'key'  => 'field_test_load',
					'name' => 'test_field',
					'type' => 'text',
				),
			),
			'location' => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'page',
					),
				),
			),
		);

		$file_path = $this->test_json_dir . '/group_test_load.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		// Load and verify.
		$this->assertTrue( file_exists( $file_path ) );

		$loaded_content = file_get_contents( $file_path );
		$loaded_data    = json_decode( $loaded_content, true );

		$this->assertEquals( 'group_test_load', $loaded_data['key'] );
		$this->assertEquals( 'Test Load Group', $loaded_data['title'] );
		$this->assertCount( 1, $loaded_data['fields'] );
		$this->assertEquals( 'field_test_load', $loaded_data['fields'][0]['key'] );
	}

	/**
	 * Test JSON file with special characters in field names.
	 */
	public function test_json_file_with_special_chars() {
		$field_group = array(
			'key'      => 'group_special_chars',
			'title'    => 'Field Group with Special Chars',
			'fields'   => array(
				array(
					'key'  => 'field_email_address',
					'name' => 'email_address',
					'type' => 'email',
				),
				array(
					'key'  => 'field_phone_number',
					'name' => 'phone_number',
					'type' => 'text',
				),
			),
			'location' => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'post',
					),
				),
			),
		);

		$file_path = $this->test_json_dir . '/group_special_chars.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		$loaded_data = json_decode( file_get_contents( $file_path ), true );

		$this->assertCount( 2, $loaded_data['fields'] );
		$this->assertEquals( 'email_address', $loaded_data['fields'][0]['name'] );
		$this->assertEquals( 'phone_number', $loaded_data['fields'][1]['name'] );
	}

	/**
	 * Test validating saved JSON file.
	 */
	public function test_validate_saved_json_file() {
		$this->skip_if_scf_json_not_available();

		$field_group = array(
			'key'      => 'group_valid_test',
			'title'    => 'Valid Field Group',
			'fields'   => array(),
			'location' => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'post',
					),
				),
			),
		);

		$file_path = $this->test_json_dir . '/group_valid_test.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		// Validate using handler.
		$validation_result = $this->scf_json->validate_json_file( $file_path );

		$this->assertIsArray( $validation_result );
		$this->assertArrayHasKey( 'valid', $validation_result );
	}

	/**
	 * Test multiple JSON files in directory.
	 */
	public function test_multiple_json_files() {
		$files_count = 3;

		for ( $i = 1; $i <= $files_count; $i++ ) {
			$field_group = array(
				'key'      => 'group_test_' . $i,
				'title'    => 'Test Group ' . $i,
				'fields'   => array(),
				'location' => array(),
			);

			$file_path = $this->test_json_dir . '/group_test_' . $i . '.json';
			file_put_contents( $file_path, wp_json_encode( $field_group ) );
		}

		$json_files = glob( $this->test_json_dir . '/*.json' );

		$this->assertCount( $files_count, $json_files );
	}

	/**
	 * Test JSON encoding/decoding round trip.
	 */
	public function test_json_round_trip() {
		$original = array(
			'key'       => 'group_roundtrip',
			'title'     => 'Round Trip Test',
			'fields'    => array(
				array(
					'key'       => 'field_one',
					'name'      => 'field_one',
					'type'      => 'text',
					'label'     => 'Field One',
					'required'  => 1,
					'wrapper'   => array(
						'width' => '50',
						'class' => 'class-one',
						'id'    => 'field-one',
					),
				),
			),
			'location'  => array(),
			'menu_order' => 0,
			'position'  => 'normal',
			'style'     => 'default',
			'active'    => true,
		);

		$file_path = $this->test_json_dir . '/group_roundtrip.json';
		file_put_contents( $file_path, wp_json_encode( $original ) );

		$recovered = json_decode( file_get_contents( $file_path ), true );

		$this->assertEquals( $original, $recovered );
	}

	/**
	 * Skip test if SCF JSON handler not available.
	 */
	private function skip_if_scf_json_not_available() {
		if ( ! class_exists( '{{namespace|pascalCase}}_SCF_JSON' ) || ! $this->scf_json ) {
			$this->markTestSkipped( 'SCF JSON handler class not available' );
		}
	}
}
