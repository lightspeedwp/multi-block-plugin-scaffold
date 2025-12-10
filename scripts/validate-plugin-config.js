#!/usr/bin/env node

/**
 * Plugin Configuration Validator
 *
 * Validates plugin configuration files against the JSON Schema.
 * Provides detailed error messages and validation feedback.
 *
 * Usage:
 *   node scripts/validate-plugin-config.js [config-file]
 *   node scripts/validate-plugin-config.js --schema-only
 *   node scripts/validate-plugin-config.js --help
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// ANSI color codes for terminal output
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
};

/**
 * Print colored message to console
 * @param color
 * @param symbol
 * @param message
 */
function print(color, symbol, message) {
	console.log(`${colors[color]}${symbol} ${message}${colors.reset}`);
}

/**
 * Print section header
 * @param title
 */
function printHeader(title) {
	console.log(`\n${title}`);
	console.log('='.repeat(title.length));
}

/**
 * Load and parse JSON file
 * @param filePath
 */
function loadJson(filePath) {
	try {
		const absolutePath = path.resolve(process.cwd(), filePath);
		if (!fs.existsSync(absolutePath)) {
			throw new Error(`File not found: ${filePath}`);
		}

		const content = fs.readFileSync(absolutePath, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Validate configuration against schema
 * @param config
 * @param schema
 */
function validateConfig(config, schema) {
	const ajv = new Ajv({
		allErrors: true,
		verbose: true,
		strict: false,
		validateSchema: false, // Don't validate the meta-schema
	});
	addFormats(ajv);

	const validate = ajv.compile(schema);
	const valid = validate(config);

	return {
		valid,
		errors: validate.errors || [],
	};
}

/**
 * Validate field types for SCF fields
 * @param config
 */
function validateFieldTypes(config) {
	const errors = [];
	const validFieldTypes = [
		'text',
		'textarea',
		'wysiwyg',
		'number',
		'range',
		'email',
		'url',
		'password',
		'image',
		'file',
		'gallery',
		'oembed',
		'select',
		'checkbox',
		'radio',
		'button_group',
		'true_false',
		'link',
		'post_object',
		'page_link',
		'relationship',
		'taxonomy',
		'user',
		'google_map',
		'date_picker',
		'date_time_picker',
		'time_picker',
		'color_picker',
		'message',
		'accordion',
		'tab',
		'group',
		'repeater',
		'flexible_content',
		'clone',
	];

	if (!config.fields || !Array.isArray(config.fields)) {
		return errors;
	}

	config.fields.forEach((field, index) => {
		if (!field.type) {
			errors.push(
				`Field at index ${index} missing required 'type' property`
			);
		} else if (!validFieldTypes.includes(field.type)) {
			errors.push(
				`Field at index ${index} has invalid type: ${field.type}`
			);
		}

		// Validate specific field type requirements
		if (
			field.type === 'select' ||
			field.type === 'checkbox' ||
			field.type === 'radio'
		) {
			if (!field.choices || Object.keys(field.choices).length === 0) {
				errors.push(
					`Field '${field.name || index}' of type '${field.type}' requires 'choices' property`
				);
			}
		}

		if (field.type === 'number' || field.type === 'range') {
			if (
				field.min !== undefined &&
				field.max !== undefined &&
				field.min >= field.max
			) {
				errors.push(
					`Field '${field.name || index}' has min >= max (${field.min} >= ${field.max})`
				);
			}
		}

		if (['image', 'file', 'post_object'].includes(field.type)) {
			if (
				field.return_format &&
				!['array', 'url', 'id', 'object'].includes(field.return_format)
			) {
				errors.push(
					`Field '${field.name || index}' has invalid return_format: ${field.return_format}`
				);
			}
		}
	});

	return errors;
}

/**
 * Validate taxonomies configuration
 * @param config
 */
function validateTaxonomies(config) {
	const errors = [];

	if (!config.taxonomies || !Array.isArray(config.taxonomies)) {
		return errors;
	}

	config.taxonomies.forEach((taxonomy, index) => {
		if (!taxonomy.slug) {
			errors.push(
				`Taxonomy at index ${index} missing required 'slug' property`
			);
		} else if (taxonomy.slug.length > 32) {
			errors.push(
				`Taxonomy '${taxonomy.slug}' slug too long (${taxonomy.slug.length} chars, max 32)`
			);
		}

		if (!taxonomy.singular) {
			errors.push(
				`Taxonomy at index ${index} missing required 'singular' property`
			);
		}

		if (!taxonomy.plural) {
			errors.push(
				`Taxonomy at index ${index} missing required 'plural' property`
			);
		}
	});

	return errors;
}

/**
 * Check best practices
 * @param config
 */
function checkBestPractices(config) {
	const warnings = [];

	// Check textdomain matches slug
	if (config.textdomain && config.slug && config.textdomain !== config.slug) {
		warnings.push(
			`textdomain '${config.textdomain}' should match slug '${config.slug}'`
		);
	}

	// Check namespace consistency
	if (config.namespace && config.slug) {
		const expectedNamespace = config.slug.replace(/-/g, '_');
		if (config.namespace !== expectedNamespace) {
			warnings.push(
				`namespace '${config.namespace}' should be '${expectedNamespace}' (slug with underscores)`
			);
		}
	}

	// Check CPT slug length
	if (config.cpt_slug && config.cpt_slug.length > 20) {
		warnings.push(
			`cpt_slug '${config.cpt_slug}' is ${config.cpt_slug.length} characters (recommend max 20 for WordPress compatibility)`
		);
	}

	// Check blocks array
	if (!config.blocks || config.blocks.length === 0) {
		warnings.push('No blocks defined - consider adding at least one block');
	}

	// Check templates array
	if (!config.templates || config.templates.length === 0) {
		warnings.push(
			'No templates defined - consider adding at least one template'
		);
	}

	return warnings;
}

/**
 * Format AJV validation errors
 * @param errors
 */
function formatAjvErrors(errors) {
	return errors.map((error) => {
		const path = error.instancePath || 'root';
		const message = error.message || 'Unknown error';

		let details = '';
		if (error.params) {
			if (error.params.allowedValues) {
				details = ` (allowed: ${error.params.allowedValues.join(', ')})`;
			} else if (error.params.additionalProperty) {
				details = ` (property: ${error.params.additionalProperty})`;
			} else if (error.params.missingProperty) {
				details = ` (missing: ${error.params.missingProperty})`;
			}
		}

		return `  ${path}: ${message}${details}`;
	});
}

/**
 * Main validation function
 */
function main() {
	const args = process.argv.slice(2);

	// Show help
	if (args.includes('--help') || args.includes('-h')) {
		console.log(`
Plugin Configuration Validator

Usage:
  node scripts/validate-plugin-config.js [config-file]
  node scripts/validate-plugin-config.js --schema-only
  node scripts/validate-plugin-config.js --help

Options:
  --schema-only    Validate the schema file itself
  --help, -h       Show this help message

Examples:
  # Validate example configuration
  node scripts/validate-plugin-config.js .github/schemas/plugin-config.example.json

  # Validate custom configuration
  node scripts/validate-plugin-config.js my-plugin-config.json

  # Validate schema file
  node scripts/validate-plugin-config.js --schema-only
		`);
		process.exit(0);
	}

	// Get file paths
	const schemaPath = '.github/schemas/plugin-config.schema.json';
	let configPath = '.github/schemas/plugin-config.example.json';

	if (args.includes('--schema-only')) {
		// Validate schema file only
		try {
			console.log(`\nValidating Schema File: ${schemaPath}`);
			console.log('='.repeat(50));
			const schema = loadJson(schemaPath);
			print('green', '✅', 'Schema file is valid JSON');
			process.exit(0);
		} catch (error) {
			print('red', '❌', `Schema validation failed: ${error.message}`);
			process.exit(2);
		}
	} else if (args.length > 0) {
		configPath = args[0];
	}

	// Load files
	let schema, config;

	try {
		console.log(`\nValidating Plugin Configuration: ${configPath}`);
		console.log('='.repeat(75));

		schema = loadJson(schemaPath);
		print('blue', 'ℹ️ ', `Loaded schema: ${schemaPath}`);

		config = loadJson(configPath);
		print('blue', 'ℹ️ ', `Loaded config: ${configPath}`);
	} catch (error) {
		print('red', '❌', error.message);
		process.exit(2);
	}

	let hasErrors = false;
	let hasWarnings = false;

	// 1. JSON Schema Validation
	printHeader('\nJSON Schema Validation');
	const schemaResult = validateConfig(config, schema);

	if (schemaResult.valid) {
		print('green', '✅', 'Configuration is valid according to schema');
	} else {
		print(
			'red',
			'❌',
			`Schema validation failed with ${schemaResult.errors.length} error(s):`
		);
		formatAjvErrors(schemaResult.errors).forEach((error) =>
			console.log(error)
		);
		hasErrors = true;
	}

	// 2. Field Type Validation
	printHeader('\nField Type Validation');
	const fieldErrors = validateFieldTypes(config);

	if (fieldErrors.length === 0) {
		print('green', '✅', 'All field types are properly configured');
	} else {
		print(
			'red',
			'❌',
			`Found ${fieldErrors.length} field configuration error(s):`
		);
		fieldErrors.forEach((error) => console.log(`  ${error}`));
		hasErrors = true;
	}

	// 3. Taxonomy Validation
	printHeader('\nTaxonomy Validation');
	const taxonomyErrors = validateTaxonomies(config);

	if (taxonomyErrors.length === 0) {
		print('green', '✅', 'All taxonomies are properly configured');
	} else {
		print('red', '❌', `Found ${taxonomyErrors.length} taxonomy error(s):`);
		taxonomyErrors.forEach((error) => console.log(`  ${error}`));
		hasErrors = true;
	}

	// 4. Best Practices
	printHeader('\nBest Practices Check');
	const warnings = checkBestPractices(config);

	if (warnings.length === 0) {
		print('green', '✅', 'Configuration follows all best practices');
	} else {
		print('yellow', '⚠️ ', `Found ${warnings.length} suggestion(s):`);
		warnings.forEach((warning) => console.log(`  ${warning}`));
		hasWarnings = true;
	}

	// Summary
	printHeader('\nValidation Summary');
	if (hasErrors) {
		print('red', '❌', 'Validation FAILED - please fix the errors above');
		process.exit(1);
	} else if (hasWarnings) {
		print('yellow', '⚠️ ', 'Validation PASSED with warnings');
		process.exit(0);
	} else {
		print(
			'green',
			'✅',
			'Validation PASSED - configuration is ready to use'
		);
		process.exit(0);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

module.exports = {
	validateConfig,
	validateFieldTypes,
	validateTaxonomies,
	checkBestPractices,
};
