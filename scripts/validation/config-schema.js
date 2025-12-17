const fs = require('fs');
const path = require('path');

let cachedSchema = null;

function loadCanonicalSchema(forceReload = false) {
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

	const content = fs.readFileSync(schemaPath, 'utf8');
	cachedSchema = JSON.parse(content);
	return cachedSchema;
}

const canonicalSchema = loadCanonicalSchema();

function loadSchema(forceReload = false) {
	return loadCanonicalSchema(forceReload);
}

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

const BLOCK_CATEGORIES = Object.freeze(
	getNestedSchemaArray(canonicalSchema, [
		'properties',
		'blocks',
		'items',
		'enum',
	])
);

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
				stage: definition['x-stage'] ?? null,
				required: requiredFields.has(field),
			},
		])
	);
}

const CONFIG_SCHEMA = buildConfigSchema(canonicalSchema);

function getFieldConfig(field) {
	return CONFIG_SCHEMA[field] || null;
}

function getFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, config]) => config.stage === stage)
		.map(([field]) => field);
}

function getRequiredFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, config]) => config.stage === stage && config.required)
		.map(([field]) => field);
}

module.exports = {
	CONFIG_SCHEMA,
	BLOCK_CATEGORIES,
	SCF_FIELD_TYPES,
	loadCanonicalSchema,
	loadSchema,
	getCanonicalConfigSchema: () => canonicalSchema,
	getFieldConfig,
	getFieldsForStage,
	getRequiredFieldsForStage,
};
