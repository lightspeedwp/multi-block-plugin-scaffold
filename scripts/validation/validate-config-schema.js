const {
	CONFIG_SCHEMA,
	BLOCK_CATEGORIES,
	SCF_FIELD_TYPES,
	loadCanonicalSchema,
	loadSchema,
	getCanonicalConfigSchema,
	getFieldsForStage,
	getRequiredFieldsForStage,
	getFieldConfig,
} = require('./config-schema');

function validateField(field, value) {
	const config = getFieldConfig(field);
	if (!config) {
		return { valid: false, error: `Unknown field: ${field}` };
	}

	if (config.required && !value) {
		return { valid: false, error: `${field} is required` };
	}

	if (!value && !config.required) {
		return { valid: true };
	}

	const valueType = Array.isArray(value) ? 'array' : typeof value;
	if (config.type !== valueType) {
		return {
			valid: false,
			error: `${field} must be ${config.type}, got ${valueType}`,
		};
	}

	if (config.pattern && !new RegExp(config.pattern).test(value)) {
		return {
			valid: false,
			error: `${field} does not match required pattern`,
		};
	}

	if (config.maxLength && value.length > config.maxLength) {
		return {
			valid: false,
			error: `${field} exceeds maximum length of ${config.maxLength}`,
		};
	}

	if (config.enum && !config.enum.includes(value)) {
		return {
			valid: false,
			error: `${field} must be one of: ${config.enum.join(', ')}`,
		};
	}

	return { valid: true };
}

module.exports = {
	CONFIG_SCHEMA,
	BLOCK_CATEGORIES,
	SCF_FIELD_TYPES,
	loadCanonicalSchema,
	loadSchema,
	getCanonicalConfigSchema,
	getFieldsForStage,
	getRequiredFieldsForStage,
	getFieldConfig,
	validateField,
};
