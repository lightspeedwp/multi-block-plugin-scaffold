#!/usr/bin/env node

/**
 * Plugin config validation helpers
 *
 * @package
 */

const fs = require('fs');
const path = require('path');

const {
	validateConfig,
	validateFieldTypes,
	validateTaxonomies,
	checkBestPractices,
} = require('../../scripts/validate-plugin-config');

const { loadConfigFile } = require('../../scripts/generate-plugin');

const FIXTURE_PATH = path.join(
	__dirname,
	'..',
	'fixtures',
	'plugin-config.test.json'
);

describe('Plugin configuration validation', () => {
	const fixtureConfig = loadConfigFile(FIXTURE_PATH);
	const schemaPath = path.join(
		__dirname,
		'..',
		'..',
		'.github',
		'schemas',
		'plugin-config.schema.json'
	);
	const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

	test('validateConfig accepts a valid configuration file', () => {
		const result = validateConfig(fixtureConfig, schema);

		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
	});

	test('validateFieldTypes reports invalid definitions', () => {
		const config = {
			fields: [
				{
					name: 'field_one',
					label: 'Invalid field',
					type: 'unsupported',
				},
				{ name: 'choices', label: 'Needs options', type: 'select' },
			],
		};

		const errors = validateFieldTypes(config);

		expect(errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining(
					'Field at index 0 has invalid type: unsupported'
				),
				expect.stringContaining(
					"Field 'choices' of type 'select' requires 'choices' property"
				),
			])
		);
	});

	test('validateTaxonomies catches missing or invalid slugs', () => {
		const config = {
			taxonomies: [
				{ singular: 'Book', plural: 'Books' },
				{
					slug: 'too-long-taxonomy-slug-example-123',
					singular: 'Series',
					plural: 'Series',
				},
			],
		};

		const errors = validateTaxonomies(config);

		expect(errors).toEqual(
			expect.arrayContaining([
				"Taxonomy at index 0 missing required 'slug' property",
				expect.stringContaining('slug too long'),
			])
		);
	});

	test('checkBestPractices highlights mismatches and missing sections', () => {
		const config = {
			slug: 'example-plugin',
			textdomain: 'different-domain',
			namespace: 'exampleplugin',
			cpt_slug: 'very-long-custom-post-type-slug',
			blocks: [],
			templates: [],
		};

		const warnings = checkBestPractices(config);

		expect(warnings).toEqual(
			expect.arrayContaining([
				"textdomain 'different-domain' should match slug 'example-plugin'",
				"namespace 'exampleplugin' should be 'example_plugin' (slug with underscores)",
				expect.stringContaining(
					"cpt_slug 'very-long-custom-post-type-slug'"
				),
				'No blocks defined - consider adding at least one block',
				'No templates defined - consider adding at least one template',
			])
		);
	});
});
