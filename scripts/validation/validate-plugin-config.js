
/**
 * Plugin config validation helpers (restored logic).
 *
 * Provides schema validation and specific checks for fields, taxonomies,
 * and configuration best practices.
 *
 * @module scripts/validation/validate-plugin-config
 */
// TODO: Consider exporting a CLI-friendly runner that prints warnings/errors with codes.
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/**
 * Validate a plugin configuration object against a JSON schema.
 *
 * @param {Object} config Plugin configuration payload.
 * @param {Object} schema JSON schema to validate against.
 * @return {{valid: boolean, errors: Array|null}} Validation results.
 */
function validateConfig(config, schema) {
	const ajv = new Ajv({
		allErrors: true,
		strict: false,
		validateSchema: false,
	});
	addFormats(ajv);
	const validate = ajv.compile(schema);
	const valid = validate(config);
	return {
		valid,
		errors: validate.errors ? validate.errors : [],
	};
}

/**
 * Ensure each field definition uses a supported type and required extras.
 *
 * @param {Object} config Plugin configuration object.
 * @return {string[]} List of validation errors for fields.
 */
function validateFieldTypes(config) {
	const errors = [];
	if (!config.fields) return errors;
	config.fields.forEach((field, i) => {
		if (
			![
				'text',
				'number',
				'select',
				'checkbox',
				'radio',
				'date',
				'email',
				'url',
				'textarea',
				'repeater',
				'group',
			].includes(field.type)
		) {
			errors.push(
				`Field at index ${i} has invalid type: ${field.type}`
			);
		}
		if (field.type === 'select' && !field.choices) {
			errors.push(
				`Field '${field.name}' of type 'select' requires 'choices' property`
			);
		}
	});
	return errors;
}

/**
 * Validate taxonomy configurations for required slugs and length.
 *
 * @param {Object} config Plugin configuration object.
 * @return {string[]} Taxonomy validation errors.
 */
function validateTaxonomies(config) {
	const errors = [];
	if (!config.taxonomies) return errors;
	config.taxonomies.forEach((tax, i) => {
		if (!tax.slug) {
			errors.push(
				`Taxonomy at index ${i} missing required 'slug' property`
			);
		} else if (tax.slug.length > 20) {
			errors.push(
				`Taxonomy slug too long: '${tax.slug}' (max 20 chars)`
			);
		}
	});
	return errors;
}

/**
 * Run best-practice checks on the configuration to generate warnings.
 *
 * @param {Object} config Plugin configuration payload.
 * @return {string[]} Best-practice warning messages.
 */
function checkBestPractices(config) {
	const warnings = [];
	if (config.textdomain && config.slug && config.textdomain !== config.slug) {
		warnings.push(
			`textdomain '${config.textdomain}' should match slug '${config.slug}'`
		);
	}
	if (
		config.namespace &&
		config.slug &&
		config.namespace !== config.slug.replace(/-/g, '_')
	) {
		warnings.push(
			`namespace '${config.namespace}' should be '${config.slug.replace(
				/-/g,
				'_'
			)}' (slug with underscores)`
		);
	}
	if (config.cpt_slug && config.cpt_slug.length > 20) {
		warnings.push(
			`cpt_slug '${config.cpt_slug}' is too long (max 20 chars)`
		);
	}
	if (!config.blocks || config.blocks.length === 0) {
		warnings.push('No blocks defined - consider adding at least one block');
	}
	if (!config.templates || config.templates.length === 0) {
		warnings.push(
			'No templates defined - consider adding at least one template'
		);
	}
	return warnings;
}

module.exports = {
	validateConfig,
	validateFieldTypes,
	validateTaxonomies,
	checkBestPractices,
};
