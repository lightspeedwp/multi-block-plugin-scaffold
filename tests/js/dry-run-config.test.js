#!/usr/bin/env node

/**
 * Test for dry-run configuration
 *
 * @package multi-block-plugin-scaffold
 */

const {
	getDryRunConfig,
	getDryRunValue,
	isDryRun,
	replaceMustacheVars,
} = require( '../bin/dry-run-config' );

describe( 'Dry Run Configuration', () => {
	test( 'provides all required mustache variables', () => {
		const config = getDryRunConfig();

		expect( config ).toHaveProperty( 'slug' );
		expect( config ).toHaveProperty( 'name' );
		expect( config ).toHaveProperty( 'namespace' );
		expect( config ).toHaveProperty( 'version' );
	} );

	test( 'getDryRunValue returns correct values', () => {
		expect( getDryRunValue( 'slug' ) ).toBe( 'example-plugin' );
		expect( getDryRunValue( 'name' ) ).toBe( 'Example Plugin' );
		expect( getDryRunValue( 'nonexistent', 'default' ) ).toBe( 'default' );
	} );

	test( 'isDryRun checks environment variable', () => {
		const originalEnv = process.env.DRY_RUN;

		process.env.DRY_RUN = 'true';
		expect( isDryRun() ).toBe( true );

		process.env.DRY_RUN = 'false';
		expect( isDryRun() ).toBe( false );

		process.env.DRY_RUN = originalEnv;
	} );

	test( 'replaceMustacheVars substitutes variables', () => {
		const template = 'Plugin name: {{name}}, Slug: {{slug}}';
		const result = replaceMustacheVars( template );

		expect( result ).toBe( 'Plugin name: Example Plugin, Slug: example-plugin' );
		expect( result ).not.toContain( '{{' );
	} );

	test( 'replaceMustacheVars handles multiple occurrences', () => {
		const template = '{{slug}}-block and {{slug}}-component';
		const result = replaceMustacheVars( template );

		expect( result ).toBe( 'example-plugin-block and example-plugin-component' );
	} );

	test( 'replaceMustacheVars uses custom values', () => {
		const template = 'Name: {{name}}';
		const customValues = { name: 'Custom Plugin' };
		const result = replaceMustacheVars( template, customValues );

		expect( result ).toBe( 'Name: Custom Plugin' );
	} );
} );
