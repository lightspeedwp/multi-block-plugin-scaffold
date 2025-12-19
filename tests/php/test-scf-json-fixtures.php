<?php
/**
 * SCF JSON Fixtures Test.
 *
 * Tests using valid and invalid field group fixtures
 * to verify validator functionality with real-world examples.
 *
 * @package example_plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Test SCF JSON fixtures with validator.
 */
/**
 * Mustache: example_plugin, example-plugin, example-plugin
 */
class ExamplePlugin_SCF_JSON_Fixtures_Test extends WP_UnitTestCase {

	/**
	 * SCF JSON validator instance.
	 *
	 * @var ExamplePlugin_SCF_JSON_Validator
	 */
	private $validator;

	/**
	 * Fixtures directory.
	 *
	 * @var string
	 */
	private $fixtures_dir;

	/**
	 * Set up test environment.
	 */
	public function set_up() {
		parent::set_up();

		// Initialize validator if available.
		if ( class_exists( 'ExamplePlugin_SCF_JSON_Validator' ) ) {
			$this->validator = new ExamplePlugin_SCF_JSON_Validator();
		}

		// Set fixtures directory.
		$this->fixtures_dir = EXAMPLE_PLUGIN_PLUGIN_DIR . 'tests/fixtures';
	}

	/**
	 * Test fixtures directory exists.
	 */
	public function test_fixtures_directory_exists() {
		$this->assertTrue(
			is_dir( $this->fixtures_dir ),
			'Fixtures directory should exist: ' . $this->fixtures_dir
		);
	}

	/**
	 * Test valid complete fixture file exists.
	 */
	public function test_valid_complete_fixture_exists() {
		$file = $this->fixtures_dir . '/group_valid_complete.json';

		$this->assertTrue(
			file_exists( $file ),
			'Valid complete fixture should exist'
		);
	}

	/**
	 * Test valid complete fixture loads correctly.
	 */
	public function test_valid_complete_fixture_loads() {
		$file = $this->fixtures_dir . '/group_valid_complete.json';

		$this->assertTrue( file_exists( $file ) );

		$content = file_get_contents( $file );
		$data    = json_decode( $content, true );

		$this->assertIsArray( $data );
		$this->assertEquals( 'group_valid_complete', $data['key'] );
		$this->assertCount( 4, $data['fields'] );
	}

	/**
	 * Test valid complete fixture has required properties.
	 */
	public function test_valid_complete_fixture_properties() {
		$file = $this->fixtures_dir . '/group_valid_complete.json';
		$data = json_decode( file_get_contents( $file ), true );

		$required = array( 'key', 'title', 'fields', 'location' );
		foreach ( $required as $prop ) {
			$this->assertArrayHasKey(
				$prop,
				$data,
				sprintf( '%s property should exist in valid fixture', $prop )
			);
		}
	}

	/**
	 * Test valid complete fixture has expected field types.
	 */
	public function test_valid_complete_fixture_field_types() {
		$file   = $this->fixtures_dir . '/group_valid_complete.json';
		$data   = json_decode( file_get_contents( $file ), true );
		$fields = $data['fields'];

		$types = array_map(
			function ( $field ) {
				return $field['type'];
			},
			$fields
		);

		$this->assertContains( 'text', $types );
		$this->assertContains( 'group', $types );
		$this->assertContains( 'repeater', $types );
		$this->assertContains( 'flexible_content', $types );
	}

	/**
	 * Test valid complete fixture validates successfully.
	 */
	public function test_valid_complete_fixture_validates() {
		$this->skip_if_validator_not_available();

		$file   = $this->fixtures_dir . '/group_valid_complete.json';
		$result = $this->validator->validate( $file );

		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'valid', $result );
		$this->assertTrue(
			$result['valid'],
			'Valid fixture should pass validation: ' . wp_json_encode( $result['errors'] )
		);
	}

	/**
	 * Test invalid fixture: missing title.
	 */
	public function test_invalid_missing_title_fixture() {
		$file = $this->fixtures_dir . '/group_invalid_missing_title.json';

		$this->assertTrue( file_exists( $file ) );

		$data = json_decode( file_get_contents( $file ), true );

		$this->assertArrayNotHasKey(
			'title',
			$data,
			'Invalid fixture should not have title'
		);
	}

	/**
	 * Test invalid fixture: missing title fails validation.
	 */
	public function test_invalid_missing_title_fails_validation() {
		$this->skip_if_validator_not_available();

		$file   = $this->fixtures_dir . '/group_invalid_missing_title.json';
		$result = $this->validator->validate( $file );

		$this->assertFalse(
			$result['valid'],
			'Invalid fixture should fail validation'
		);
		$this->assertNotEmpty( $result['errors'] );
	}

	/**
	 * Test invalid fixture: bad key format.
	 */
	public function test_invalid_bad_key_fixture() {
		$file = $this->fixtures_dir . '/group_invalid_bad_key.json';

		$this->assertTrue( file_exists( $file ) );

		$data = json_decode( file_get_contents( $file ), true );

		$this->assertArrayNotHasKey(
			'key',
			$data,
			'Invalid fixture should not have proper key'
		);
	}

	/**
	 * Test invalid fixture: bad key fails validation.
	 */
	public function test_invalid_bad_key_fails_validation() {
		$this->skip_if_validator_not_available();

		$file   = $this->fixtures_dir . '/group_invalid_bad_key.json';
		$result = $this->validator->validate( $file );

		$this->assertFalse( $result['valid'] );
		$this->assertNotEmpty( $result['errors'] );
	}

	/**
	 * Test invalid fixture: bad field type.
	 */
	public function test_invalid_field_type_fixture() {
		$file = $this->fixtures_dir . '/group_invalid_field_type.json';

		$this->assertTrue( file_exists( $file ) );

		$data = json_decode( file_get_contents( $file ), true );

		$this->assertEquals( 'nonexistent_type', $data['fields'][0]['type'] );
	}

	/**
	 * Test invalid fixture: bad field type fails validation.
	 */
	public function test_invalid_field_type_fails_validation() {
		$this->skip_if_validator_not_available();

		$file   = $this->fixtures_dir . '/group_invalid_field_type.json';
		$result = $this->validator->validate( $file );

		$this->assertFalse( $result['valid'] );
		$this->assertNotEmpty( $result['errors'] );
	}

	/**
	 * Test invalid fixture: missing location.
	 */
	public function test_invalid_no_location_fixture() {
		$file = $this->fixtures_dir . '/group_invalid_no_location.json';

		$this->assertTrue( file_exists( $file ) );

		$data = json_decode( file_get_contents( $file ), true );

		$this->assertArrayNotHasKey(
			'location',
			$data,
			'Invalid fixture should not have location'
		);
	}

	/**
	 * Test invalid fixture: missing location fails validation.
	 */
	public function test_invalid_no_location_fails_validation() {
		$this->skip_if_validator_not_available();

		$file   = $this->fixtures_dir . '/group_invalid_no_location.json';
		$result = $this->validator->validate( $file );

		$this->assertFalse( $result['valid'] );
		$this->assertNotEmpty( $result['errors'] );
	}

	/**
	 * Test all fixtures can be read and decoded.
	 */
	public function test_all_fixtures_are_valid_json() {
		$fixtures = glob( $this->fixtures_dir . '/group_*.json' );

		$this->assertNotEmpty( $fixtures );

		foreach ( $fixtures as $file ) {
			$content = file_get_contents( $file );
			$data    = json_decode( $content, true );

			$this->assertIsArray(
				$data,
				sprintf( 'Fixture %s should decode to array', basename( $file ) )
			);
		}
	}

	/**
	 * Test fixture count.
	 */
	public function test_fixtures_count() {
		$fixtures = glob( $this->fixtures_dir . '/group_*.json' );

		// Should have: 1 valid + 4 invalid = 5 total.
		$this->assertGreaterThanOrEqual(
			5,
			count( $fixtures ),
			'Should have at least 5 test fixtures'
		);
	}

	/**
	 * Skip test if validator not available.
	 */
	private function skip_if_validator_not_available() {
		if ( ! class_exists( 'ExamplePlugin_SCF_JSON_Validator' ) || ! $this->validator ) {
			$this->markTestSkipped( 'SCF JSON Validator not available' );
		}
	}
}
