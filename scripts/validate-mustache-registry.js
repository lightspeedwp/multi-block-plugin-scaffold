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
 * Structured logging helper
 *
 * @param {string} level
 * @param {string} message
 */
function log(level, message) {
	process.stdout.write(`[${level}] ${message}\n`);
}

/**
 * Print raw line (no prefix)
 *
 * @param {string} message
 */
function print(message = '') {
	process.stdout.write(`${message}\n`);
}

/**
 * Load JSON file
 *
 * @param {string} filePath - Path to JSON file
 */
function loadJson(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(content);
	} catch (error) {
		log('ERROR', `Error loading ${filePath}: ${error.message}`);
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
	log('INFO', '🔍 Validating mustache variables registry...');
	print();

	// Load registry
	log('INFO', `📄 Loading registry: ${registryPath}`);
	const registry = loadJson(registryPath);

	// Load schema
	log('INFO', `📋 Loading schema: ${schemaPath}`);
	const schema = loadJson(schemaPath);

	// Validate
	log('INFO', '⚙️  Validating...');
	print();
	const result = validateRegistry(registry, schema);

	if (!result.valid) {
		log('ERROR', '❌ Validation failed!');
		log('ERROR', 'Errors:');
		result.errors.forEach((error, index) => {
			const instancePath = error.instancePath || 'root';
			const message = error.message || 'Unknown error';
			const params = error.params ? JSON.stringify(error.params) : '';

			log(
				'ERROR',
				`  ${index + 1}. ${instancePath}: ${message} ${params ? `(${params})` : ''}`
			);
		});
		print();
		process.exit(1);
	}

	// Success
	log('SUCCESS', '✅ Registry is valid!');
	print('');
	print('Summary:');
	print(`  - Total files scanned: ${registry.summary.totalFiles}`);
	print(`  - Files with variables: ${registry.summary.filesWithVariables}`);
	print(`  - Unique variables: ${registry.summary.uniqueVariables}`);
	print(`  - Total occurrences: ${registry.summary.totalOccurrences}`);
	print('');

	// Additional validation checks
	log('INFO', '🔍 Running additional validation checks...');
	print();

	let warnings = 0;
	let errors = 0;

	// Check for duplicate variable names
	const variableNames = Object.keys(registry.variables);
	const nameCounts = {};
	variableNames.forEach((name) => {
		nameCounts[name] = (nameCounts[name] || 0) + 1;
	});
	const duplicates = Object.entries(nameCounts).filter(
		([, count]) => count > 1
	);
	if (duplicates.length > 0) {
		log('ERROR', '❌ Found duplicate variable names:');
		duplicates.forEach(([name, count]) => {
			log('ERROR', `  - ${name} (appears ${count} times)`);
		});
		errors++;
	} else {
		log('INFO', '✓ No duplicate variable names');
	}

	// Verify count matches files array length
	let countMismatches = 0;
	Object.entries(registry.variables).forEach(([name, variable]) => {
		const fileCount = variable.files.length;
		const declaredCount = variable.count;
		if (fileCount !== declaredCount) {
			if (countMismatches === 0) {
				print();
				log('WARN', '⚠️  Count mismatches (files.length !== count):');
			}
			log(
				'WARN',
				`  - ${name}: files=${fileCount}, count=${declaredCount}`
			);
			countMismatches++;
		}
	});
	if (countMismatches === 0) {
		log('INFO', '✓ All variable counts match files array length');
	} else {
		warnings += countMismatches;
	}

	// Validate category distribution
	const categories = {};
	Object.values(registry.variables).forEach((variable) => {
		const cat = variable.category || 'uncategorized';
		categories[cat] = (categories[cat] || 0) + 1;
	});
	print();
	log('INFO', '📊 Category distribution:');
	Object.entries(categories)
		.sort((a, b) => b[1] - a[1])
		.forEach(([category, count]) => {
			const percentage = (
				(count / registry.summary.uniqueVariables) *
				100
			).toFixed(1);
			print(`  - ${category}: ${count} (${percentage}%)`);
		});

	// Check for variables without category
	const uncategorized = Object.entries(registry.variables).filter(
		([, v]) => !v.category || v.category === 'other'
	);
	if (uncategorized.length > 0) {
		print();
		log(
			'WARN',
			`⚠️  ${uncategorized.length} variables are uncategorized or marked as "other":`
		);
		uncategorized.slice(0, 10).forEach(([name]) => {
			log('WARN', `  - ${name}`);
		});
		if (uncategorized.length > 10) {
			log('WARN', `  ... and ${uncategorized.length - 10} more`);
		}
		warnings += uncategorized.length;
	}

	// Verify file paths exist (sample check)
	print();
	log('INFO', '📁 Verifying file paths (sampling 10 random files)...');
	const allFiles = new Set();
	Object.values(registry.variables).forEach((variable) => {
		variable.files.forEach((file) => allFiles.add(file));
	});
	const filesArray = Array.from(allFiles);
	const sampleSize = Math.min(10, filesArray.length);
	const sampleFiles = [];
	for (let i = 0; i < sampleSize; i++) {
		const randomIndex = Math.floor(Math.random() * filesArray.length);
		sampleFiles.push(filesArray[randomIndex]);
	}

	let missingFiles = 0;
	for (const file of sampleFiles) {
		const fullPath = path.join(process.cwd(), file);
		if (!fs.existsSync(fullPath)) {
			if (missingFiles === 0) {
				print();
				log('ERROR', '❌ Missing files detected:');
			}
			log('ERROR', `  - ${file}`);
			missingFiles++;
		}
	}
	if (missingFiles === 0) {
		log('INFO', `✓ Sampled ${sampleSize} files, all exist`);
	} else {
		errors += missingFiles;
	}

	// Summary
	print('');
	print('='.repeat(50));
	if (errors > 0) {
		log(
			'ERROR',
			`Validation completed with ${errors} error(s) and ${warnings} warning(s)`
		);
		process.exit(1);
	} else if (warnings > 0) {
		log('WARN', `⚠️  Validation completed with ${warnings} warning(s)`);
		process.exit(0);
	} else {
		log('SUCCESS', '✅ All validation checks passed!');
		process.exit(0);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

// Export for testing
module.exports = { validateRegistry, loadJson };
