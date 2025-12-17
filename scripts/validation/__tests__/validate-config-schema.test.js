/**
 * Tests for Validate Configuration Schema helpers.
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const {
	CONFIG_SCHEMA,
	validateField,
	loadSchema,
} = require('../validate-config-schema');

describe('Validation: Validate Config Schema', () => {
	test('loads the canonical schema', () => {
		const schema = loadSchema();
		expect(schema).toEqual(expect.objectContaining({ properties: expect.any(Object) }));
	});

	test('returns validation result for unknown field', () => {
		const result = validateField('missing_field', 'value');
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/Unknown field/);
	});

	test('exports CONFIG_SCHEMA mapping', () => {
		expect(CONFIG_SCHEMA).toBeDefined();
		expect(CONFIG_SCHEMA).toHaveProperty('slug');
	});
});
