<?php
/**
 * Dry Run PHP Test
 *
 * Mustache: example_plugin, example-plugin, example-plugin
 *
 * @package example_plugin
 */

class Test_Dry_Run extends WP_UnitTestCase {
	public function test_dry_run_placeholder() {
		// Placeholder assertion for dry-run infra
		$this->assertTrue( true, 'Dry run PHP test executed.' );
	}
}
