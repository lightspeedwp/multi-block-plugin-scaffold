#!/usr/bin/env node

/**
 * Validate mustache-variables-registry.json against schema
 *
 * This test validates that the mustache variables registry follows the correct structure.
 * Run after scanning to ensure the registry is valid.
 *
 * Usage:
 *   node scripts/validate-mustache-registry.js
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const Ajv2020 = require('ajv/dist/2020');

// Paths
const registryPath = path.join(__dirname, 'mustache-variables-registry.json');
const schemaPath = path.join(
	__dirname,
	'../.github/schemas/mustache-variables-registry.schema.json'
);

/**
 * Load JSON file
 *
 * @param {string} filePath - Path to JSON file
 * @return {Object} Parsed JSON
 */
function loadJson(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		console.error(`❌ Error loading ${filePath}:`, error.message);
		process.exit(1);
	}
}

/**
 * Validate registry against schema
 *
 * @param {Object} registry - Registry data
 * @param {Object} schema   - JSON schema
 * @return {Object} Validation result
 */
function validateRegistry(registry, schema) {
	const ajv = new Ajv2020({ allErrors: true, strict: false });
	const validate = ajv.compile(schema);
	const valid = validate(registry);

	return {
		valid,
		errors: validate.errors || [],
	};
}

/**
 * Main function
 */
function main() {
	console.log('🔍 Validating mustache variables registry...\n');

	// Load registry
	console.log(`📄 Loading registry: ${registryPath}`);
	const registry = loadJson(registryPath);

	// Load schema
	console.log(`📋 Loading schema: ${schemaPath}`);
	const schema = loadJson(schemaPath);

	// Validate
	console.log('⚙️  Validating...\n');
	const result = validateRegistry(registry, schema);

	if (!result.valid) {
		console.error('❌ Validation failed!\n');
		console.error('Errors:');
		result.errors.forEach((error, index) => {
			const path = error.instancePath || 'root';
			const message = error.message || 'Unknown error';
			const params = error.params ? JSON.stringify(error.params) : '';

			console.error(
				`  ${index + 1}. ${path}: ${message} ${params ? `(${params})` : ''}`
			);
		});
		console.error('');
		process.exit(1);
	}

	// Success
	console.log('✅ Registry is valid!\n');
	console.log('Summary:');
	console.log(
		`  - Total files scanned: ${registry.summary.totalFiles}`
	);
	console.log(
		`  - Files with variables: ${registry.summary.filesWithVariables}`
	);
	console.log(
		`  - Unique variables: ${registry.summary.uniqueVariables}`
	);
	console.log(
		`  - Total occurrences: ${registry.summary.totalOccurrences}`
	);
	console.log('');

	// TODO: Additional validation checks
	// TODO: Check for duplicate variable names
	// TODO: Verify file paths exist
	// TODO: Validate category distribution
	// TODO: Check for orphaned variables (defined but not used)
	// TODO: Verify count matches files array length

	console.log('💡 Note: Additional validation checks are TODO');
	process.exit(0);
}

// Run if executed directly
if (require.main === module) {
	main();
}

// Export for testing
module.exports = { validateRegistry, loadJson };
