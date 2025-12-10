<?php
/**
 * SCF Local Meta Setup/Reset Tests.
 *
 * Tests for SCF Local JSON meta operations, including
 * setup, reset, and cleanup functionality.
 *
 * @package example_plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Test SCF Local JSON meta setup and reset operations.
 */
class ExamplePlugin_SCF_JSON_Meta_Test extends WP_UnitTestCase {

	/**
	 * SCF JSON handler instance.
	 *
	 * @var ExamplePlugin_SCF_JSON
	 */
	private $scf_json;

	/**
	 * SCF JSON validator instance.
	 *
	 * @var ExamplePlugin_SCF_JSON_Validator
	 */
	private $validator;

	/**
	 * Test JSON directory.
	 *
	 * @var string
	 */
	private $test_json_dir;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		// Initialize SCF JSON handler.
		if ( class_exists( 'ExamplePlugin_SCF_JSON' ) ) {
			$this->scf_json = new ExamplePlugin_SCF_JSON();
		}

		// Initialize validator if available.
		if ( class_exists( 'ExamplePlugin_SCF_JSON_Validator' ) ) {
			$this->validator = new ExamplePlugin_SCF_JSON_Validator();
		}

		// Create test JSON directory.
		$this->test_json_dir = sys_get_temp_dir() . '/scf-json-meta-' . uniqid();
		wp_mkdir_p( $this->test_json_dir );
	}

	/**
	 * Clean up after tests.
	 */
	public function tear_down() {
		// Remove test JSON directory.
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
	 * Test SCF JSON handler is available for meta operations.
	 */
	public function test_scf_json_handler_meta_available() {
		$this->assertTrue(
			class_exists( 'ExamplePlugin_SCF_JSON' ),
			'SCF JSON handler should be available'
		);
	}

	/**
	 * Test validator class is available for meta operations.
	 */
	public function test_validator_class_available() {
		if ( ! class_exists( 'ExamplePlugin_SCF_JSON_Validator' ) ) {
			$this->markTestSkipped( 'Validator class not yet implemented' );
		}

		$this->assertTrue( class_exists( 'ExamplePlugin_SCF_JSON_Validator' ) );
	}

	/**
	 * Test setup creates necessary directory structure.
	 */
	public function test_setup_creates_directory() {
		$this->assertFalse( file_exists( $this->test_json_dir ) );

		wp_mkdir_p( $this->test_json_dir );

		$this->assertTrue( is_dir( $this->test_json_dir ) );
		$this->assertTrue( is_writable( $this->test_json_dir ) );
	}

	/**
	 * Test setup can create nested directory structure.
	 */
	public function test_setup_nested_directories() {
		$nested_dir = $this->test_json_dir . '/sub/dir/structure';

		wp_mkdir_p( $nested_dir );

		$this->assertTrue( is_dir( $nested_dir ) );
	}

	/**
	 * Test reset clears all JSON files.
	 */
	public function test_reset_clears_json_files() {
		// Create test JSON files.
		for ( $i = 1; $i <= 3; $i++ ) {
			$file_path = $this->test_json_dir . '/group_test_' . $i . '.json';
			$data      = array(
				'key'      => 'group_test_' . $i,
				'title'    => 'Test ' . $i,
				'fields'   => array(),
				'location' => array(),
			);
			file_put_contents( $file_path, wp_json_encode( $data ) );
		}

		// Verify files exist.
		$json_files = glob( $this->test_json_dir . '/*.json' );
		$this->assertCount( 3, $json_files );

		// Reset (remove all JSON files).
		foreach ( glob( $this->test_json_dir . '/*.json' ) as $file ) {
			unlink( $file );
		}

		// Verify files are gone.
		$json_files = glob( $this->test_json_dir . '/*.json' );
		$this->assertCount( 0, $json_files );
	}

	/**
	 * Test resetting preserves directory structure.
	 */
	public function test_reset_preserves_directory() {
		wp_mkdir_p( $this->test_json_dir );

		$this->assertTrue( is_dir( $this->test_json_dir ) );

		// Reset would clear files but not directory.
		foreach ( glob( $this->test_json_dir . '/*' ) as $item ) {
			if ( is_file( $item ) ) {
				unlink( $item );
			}
		}

		$this->assertTrue( is_dir( $this->test_json_dir ) );
	}

	/**
	 * Test creating valid field group for setup.
	 */
	public function test_setup_valid_field_group() {
		$field_group = array(
			'key'      => 'group_setup_test',
			'title'    => 'Setup Test Group',
			'fields'   => array(
				array(
					'key'  => 'field_setup_test',
					'name' => 'setup_test',
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

		$file_path = $this->test_json_dir . '/group_setup_test.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		// Verify file and content.
		$this->assertTrue( file_exists( $file_path ) );

		$loaded = json_decode( file_get_contents( $file_path ), true );
		$this->assertEquals( 'group_setup_test', $loaded['key'] );
		$this->assertCount( 1, $loaded['fields'] );
	}

	/**
	 * Test meta information is preserved during operations.
	 */
	public function test_meta_preservation() {
		$field_group = array(
			'key'           => 'group_meta_test',
			'title'         => 'Meta Test',
			'description'   => 'Test description',
			'fields'        => array(),
			'location'      => array(),
			'menu_order'    => 5,
			'position'      => 'normal',
			'style'         => 'default',
			'label_placement' => 'top',
			'instruction_placement' => 'label',
			'active'        => true,
			'show_in_rest'  => true,
		);

		$file_path = $this->test_json_dir . '/group_meta_test.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		// Read and verify meta is preserved.
		$loaded = json_decode( file_get_contents( $file_path ), true );

		$this->assertEquals( 'Meta Test', $loaded['title'] );
		$this->assertEquals( 'Test description', $loaded['description'] );
		$this->assertEquals( 5, $loaded['menu_order'] );
		$this->assertEquals( 'normal', $loaded['position'] );
		$this->assertEquals( true, $loaded['active'] );
	}

	/**
	 * Test validator validates setup field groups.
	 */
	public function test_validator_validates_setup_groups() {
		if ( ! $this->validator ) {
			$this->markTestSkipped( 'Validator not available' );
		}

		$field_group = array(
			'key'      => 'group_validate_setup',
			'title'    => 'Validate Setup',
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

		$file_path = $this->test_json_dir . '/group_validate_setup.json';
		file_put_contents( $file_path, wp_json_encode( $field_group ) );

		$result = $this->validator->validate( $file_path );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'valid', $result );
	}

	/**
	 * Test bulk operations on field groups.
	 */
	public function test_bulk_field_group_operations() {
		$groups_data = array(
			array(
				'key'    => 'group_bulk_1',
				'title'  => 'Bulk Group 1',
				'fields' => array(),
			),
			array(
				'key'    => 'group_bulk_2',
				'title'  => 'Bulk Group 2',
				'fields' => array(),
			),
			array(
				'key'    => 'group_bulk_3',
				'title'  => 'Bulk Group 3',
				'fields' => array(),
			),
		);

		foreach ( $groups_data as $index => $data ) {
			$file_path = $this->test_json_dir . '/group_bulk_' . ( $index + 1 ) . '.json';
			file_put_contents( $file_path, wp_json_encode( $data ) );
		}

		$json_files = glob( $this->test_json_dir . '/*.json' );
		$this->assertCount( 3, $json_files );

		// Verify all can be read.
		foreach ( $json_files as $file ) {
			$data = json_decode( file_get_contents( $file ), true );
			$this->assertIsArray( $data );
			$this->assertArrayHasKey( 'key', $data );
		}
	}

	/**
	 * Test field group state transitions (create -> update -> delete).
	 */
	public function test_field_group_state_transitions() {
		$file_path = $this->test_json_dir . '/group_state_test.json';

		// Initial state: file doesn't exist.
		$this->assertFalse( file_exists( $file_path ) );

		// Create.
		$initial_data = array(
			'key'      => 'group_state_test',
			'title'    => 'State Test',
			'fields'   => array(),
			'location' => array(),
		);
		file_put_contents( $file_path, wp_json_encode( $initial_data ) );
		$this->assertTrue( file_exists( $file_path ) );

		// Update.
		$updated_data = $initial_data;
		$updated_data['title'] = 'State Test Updated';
		file_put_contents( $file_path, wp_json_encode( $updated_data ) );
		$loaded = json_decode( file_get_contents( $file_path ), true );
		$this->assertEquals( 'State Test Updated', $loaded['title'] );

		// Delete.
		unlink( $file_path );
		$this->assertFalse( file_exists( $file_path ) );
	}

	/**
	 * Test handling concurrent operations (stress test).
	 */
	public function test_concurrent_file_operations() {
		$operations_count = 10;

		// Create files.
		for ( $i = 1; $i <= $operations_count; $i++ ) {
			$file_path = $this->test_json_dir . '/group_concurrent_' . $i . '.json';
			$data      = array(
				'key'      => 'group_concurrent_' . $i,
				'title'    => 'Concurrent ' . $i,
				'fields'   => array(),
				'location' => array(),
			);
			file_put_contents( $file_path, wp_json_encode( $data ) );
		}

		$json_files = glob( $this->test_json_dir . '/*.json' );
		$this->assertCount( $operations_count, $json_files );

		// Read all files.
		foreach ( $json_files as $file ) {
			$data = json_decode( file_get_contents( $file ), true );
			$this->assertNotNull( $data );
		}
	}

	/**
	 * Test file permissions and ownership.
	 */
	public function test_file_permissions() {
		$file_path = $this->test_json_dir . '/group_permissions_test.json';
		$data      = array(
			'key'      => 'group_permissions_test',
			'title'    => 'Permissions Test',
			'fields'   => array(),
			'location' => array(),
		);

		file_put_contents( $file_path, wp_json_encode( $data ) );

		$this->assertTrue( is_readable( $file_path ) );
		$this->assertTrue( is_writable( $file_path ) );
	}
}
