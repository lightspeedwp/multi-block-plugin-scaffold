/**
 * Tests for Validate Mustache Registry
 */
const { validateRegistry, checkNewVariablesHavePlaceholders } = require('../validate-mustache-registry');

describe('Validate Mustache Registry', () => {
	test('validateRegistry fails when new variables lack placeholders', () => {
		const mockRegistry = {
			variables: {
				new_var: { name: 'new_var', count: 1, files: ['test.js'] }
			}
		};

		const mockPlaceholders = {};
		const result = validateRegistry(mockRegistry, mockPlaceholders, { strict: true });

		expect(result.valid).toBe(false);
		expect(result.errors).toContain('new_var');
	});

	test('validateRegistry passes when all variables have placeholders', () => {
		const mockRegistry = {
			variables: {
				existing_var: { name: 'existing_var', count: 1, files: ['test.js'] }
			}
		};

		const mockPlaceholders = {
			existing_var: 'placeholder value'
		};
		const result = validateRegistry(mockRegistry, mockPlaceholders, { strict: true });

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	test('checkNewVariablesHavePlaceholders returns variables without placeholders', () => {
		const variables = ['var1', 'var2', 'var3'];
		const placeholders = { var1: 'value1' };

		const missing = checkNewVariablesHavePlaceholders(variables, placeholders);
		expect(missing).toEqual(['var2', 'var3']);
	});
});
