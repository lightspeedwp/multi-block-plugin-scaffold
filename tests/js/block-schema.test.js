const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const blockSchema = require('../fixtures/block.schema.json');

describe('Block schema fixture', () => {
	const ajv = new Ajv({ allErrors: true, strict: false });
	addFormats(ajv);

	it('is a valid JSON Schema for WordPress blocks', () => {
		const isValidSchema = ajv.validateSchema(blockSchema);

		if (!isValidSchema) {
			const errors = ajv.errorsText
				? ajv.errorsText(ajv.errors, { separator: '; ' })
				: (ajv.errors || []).map((error) => error.message).join('; ');
			throw new Error(`Block schema validation failed: ${errors}`);
		}

		expect(isValidSchema).toBe(true);
	});
});
