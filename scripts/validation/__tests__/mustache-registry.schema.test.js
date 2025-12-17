const Ajv2020 = require('ajv/dist/2020');

const schema = require('../../../.github/schemas/mustache-variables-registry.schema.json');
const registry = require('../../../scripts/mustache-variables-registry.json');
const fixture = require('../../fixtures/mustache-variables-registry.example.json');

describe('Mustache variables registry schema', () => {
	const ajv = new Ajv2020({ allErrors: true, strict: false });

	const validate = (data) => {
		const validateFn = ajv.compile(schema);
		return { valid: validateFn(data), errors: validateFn.errors };
	};

	const expectValid = (result) => {
		if (!result.valid) {
			console.error('Schema validation failed:', result.errors);
		}
		expect(result.valid).toBe(true);
	};

	test('production registry matches schema', () => {
		const result = validate(registry);
		expectValid(result);
	});

	test('example fixture matches schema', () => {
		const result = validate(fixture);
		expectValid(result);
	});
});
