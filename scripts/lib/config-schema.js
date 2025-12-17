/**
 * @file Shared Configuration Schema
 * @description Central schema definition used by all plugin generation modes.
 * It loads the canonical schema from `.github/schemas/plugin-config.schema.json`
 * and provides helper functions to access and validate configuration fields based on it.
 *
 * TODO: For high-frequency script execution, enhance schema caching with a file watcher
 * during development to automatically invalidate the cache on schema changes.
 */

const path = require('path');
const fs = require('fs');

let cachedSchema = null;

/**
 * Load JSON schema from file, caching the result for repeated requests.
 *
 * @param {boolean} [forceReload=false] Refresh cached schema even if already loaded.
 * @return {Object} The parsed JSON schema.
 */
function loadSchema(forceReload = false) {
	if (cachedSchema && !forceReload) {
		return cachedSchema;
	}

	const schemaPath = path.resolve(
		__dirname,
		'../../.github/schemas/plugin-config.schema.json'
	);

	if (!fs.existsSync(schemaPath)) {
		throw new Error(`Schema file not found: ${schemaPath}`);
	}

	const schemaContent = fs.readFileSync(schemaPath, 'utf8');
	cachedSchema = JSON.parse(schemaContent);
	return cachedSchema;
}

/**
 * The canonical JSON schema for plugin configuration, loaded from the schema file.
 *
 * @type {Object}
 */
const canonicalSchema = loadSchema();

/**
 * SCF Field types reference derived from the canonical schema.
 *
 * @type {string[]}
 */
const SCF_FIELD_TYPES = Object.freeze(
	getNestedSchemaArray(canonicalSchema, [
		'properties',
		'fields',
		'items',
		'properties',
		'type',
		'enum',
	])
);

/**
 * Available block categories derived from the canonical schema.
 *
 * @type {string[]}
 */
const BLOCK_CATEGORIES = Object.freeze(
	getNestedSchemaArray(canonicalSchema, [
		'properties',
		'blocks',
		'items',
		'enum',
	])
);

/**
 * Configuration schema defining all available options mapped by field name.
 * Each entry includes stage metadata and whether the canonical schema marks
 * it as required.
 * @type {Object}
 */
const CONFIG_SCHEMA = buildConfigSchema(canonicalSchema);

/**
 * Get required fields for a specific stage
 *
 * @param {number} stage - Stage number (1-7)
 * @return {Array} Array of required field names
 */
function getRequiredFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, config]) => config.stage === stage && config.required)
		.map(([field]) => field);
}

/**
 * Get all fields for a specific stage
 *
 * @param {number} stage - Stage number (1-7)
 * @return {Array} Array of field names
 */
function getFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, config]) => config.stage === stage)
		.map(([field]) => field);
}

/**
 * Get field configuration
 *
 * @param {string} field - Field name
 * @return {Object|null} Field configuration or null
 */
function getFieldConfig(field) {
	return CONFIG_SCHEMA[field] || null;
}

/**
 * Validate a field value against its schema
 *
 * @param {string} field - Field name
 * @param {*} value - Field value
 * @return {Object} { valid: boolean, error?: string }
 */
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

/**
 * Extract an array from a nested path inside the JSON schema.
 * Returns the fallback value when the path is missing or not an array.
 *
 * @param {Object} schema - JSON schema root
 * @param {string[]} pathSegments - Keys leading to the target array
 * @param {Array} [fallback=[]] - Fallback value when extraction fails
 * @return {Array} The array found at the nested path
 */
function getNestedSchemaArray(schema, pathSegments, fallback = []) {
	let pointer = schema;
	for (const segment of pathSegments) {
		if (!pointer || typeof pointer !== 'object') {
			return fallback;
		}
		pointer = pointer[segment];
	}
	return Array.isArray(pointer) ? pointer : fallback;
}

/**
 * Get the canonical JSON schema.
 *
 * @returns {Object} The canonical JSON schema.
 */
function getCanonicalConfigSchema() {
	return canonicalSchema;
}

/**
 * Build the stage-aware configuration schema from the canonical JSON definition.
 *
 * @param {Object} schema - Parsed canonical schema
 * @todo Ensure that any new properties added to `plugin-config.schema.json` also include
 *       the custom `x-stage` property so they are correctly handled by the interactive wizard.
 * @return {Object} Schema entries augmented with stage and required metadata
 */
function buildConfigSchema(schema) {
	const requiredFields = new Set(
		Array.isArray(schema.required) ? schema.required : []
	);
	const properties = schema.properties || {};

	return Object.fromEntries(
		Object.entries(properties).map(([field, definition]) => [
			field,
			{
				...definition,
				// The `x-stage` property in the schema is the canonical source for the stage number.
				stage: definition['x-stage'] ?? null,
				required: requiredFields.has(field),
			},
		])
	);
}

module.exports = {
	CONFIG_SCHEMA,
	SCF_FIELD_TYPES,
	BLOCK_CATEGORIES,
	loadSchema,
	getCanonicalConfigSchema,
	getRequiredFieldsForStage,
	getFieldsForStage,
	getFieldConfig,
	validateField,
};
