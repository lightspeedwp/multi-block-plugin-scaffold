/**
 * Tests for config-schema.js
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const configSchema = require('../config-schema');

describe('Config Schema', () => {
	test('loadSchema() loads the JSON schema file', () => {
		const schema = configSchema.loadSchema();
		expect(schema).toBeDefined();
		expect(typeof schema).toBe('object');
		// Should have at least one property
		expect(Object.keys(schema).length).toBeGreaterThan(0);
	});

	test('getRequiredFieldsForStage returns correct fields', () => {
		const required = configSchema.getRequiredFieldsForStage(1);
		expect(Array.isArray(required)).toBe(true);
		expect(required).toContain('slug');
		expect(required).toContain('name');
	});

	test('getFieldsForStage returns all fields for a stage', () => {
		const fields = configSchema.getFieldsForStage(2);
		expect(Array.isArray(fields)).toBe(true);
		expect(fields).toContain('name_singular');
		expect(fields).toContain('cpt_slug');
	});

	test('getFieldConfig returns field config or null', () => {
		const config = configSchema.getFieldConfig('slug');
		expect(config).toBeDefined();
		expect(config.type).toBe('string');
		const missing = configSchema.getFieldConfig('not_a_field');
		expect(missing).toBeNull();
	});

	test('validateField validates required and type', () => {
		const valid = configSchema.validateField('slug', 'my-plugin');
		expect(valid.valid).toBe(true);
		const missing = configSchema.validateField('slug', '');
		expect(missing.valid).toBe(false);
		const wrongType = configSchema.validateField('slug', 123);
		expect(wrongType.valid).toBe(false);
	});

	test('validateField validates pattern and maxLength', () => {
		const tooLong = configSchema.validateField('slug', 'a'.repeat(51));
		expect(tooLong.valid).toBe(false);
		const badPattern = configSchema.validateField('slug', 'BadSlug!');
		expect(badPattern.valid).toBe(false);
	});
});
