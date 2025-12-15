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

	// Additional validation checks
	console.log('🔍 Running additional validation checks...\n');

	let warnings = 0;
	let errors = 0;

	// Check for duplicate variable names
	const variableNames = Object.keys(registry.variables);
	const nameCounts = {};
	variableNames.forEach((name) => {
		nameCounts[name] = (nameCounts[name] || 0) + 1;
	});
	const duplicates = Object.entries(nameCounts).filter(
		([_, count]) => count > 1
	);
	if (duplicates.length > 0) {
		console.error('❌ Found duplicate variable names:');
		duplicates.forEach(([name, count]) => {
			console.error(`  - ${name} (appears ${count} times)`);
		});
		errors++;
	} else {
		console.log('✓ No duplicate variable names');
	}

	// Verify count matches files array length
	let countMismatches = 0;
	Object.entries(registry.variables).forEach(([name, variable]) => {
		const fileCount = variable.files.length;
		const declaredCount = variable.count;
		if (fileCount !== declaredCount) {
			if (countMismatches === 0) {
				console.warn(
					'\n⚠️  Count mismatches (files.length !== count):'
				);
			}
			console.warn(
				`  - ${name}: files=${fileCount}, count=${declaredCount}`
			);
			countMismatches++;
		}
	});
	if (countMismatches === 0) {
		console.log('✓ All variable counts match files array length');
	} else {
		warnings += countMismatches;
	}

	// Validate category distribution
	const categories = {};
	Object.values(registry.variables).forEach((variable) => {
		const cat = variable.category || 'uncategorized';
		categories[cat] = (categories[cat] || 0) + 1;
	});
	console.log('\n📊 Category distribution:');
	Object.entries(categories)
		.sort((a, b) => b[1] - a[1])
		.forEach(([category, count]) => {
			const percentage = (
				(count / registry.summary.uniqueVariables) *
				100
			).toFixed(1);
			console.log(`  - ${category}: ${count} (${percentage}%)`);
		});

	// Check for variables without category
	const uncategorized = Object.entries(registry.variables).filter(
		([_, v]) => !v.category || v.category === 'other'
	);
	if (uncategorized.length > 0) {
		console.warn(
			`\n⚠️  ${uncategorized.length} variables are uncategorized or marked as "other":`
		);
		uncategorized.slice(0, 10).forEach(([name]) => {
			console.warn(`  - ${name}`);
		});
		if (uncategorized.length > 10) {
			console.warn(`  ... and ${uncategorized.length - 10} more`);
		}
		warnings += uncategorized.length;
	}

	// Verify file paths exist (sample check)
	console.log('\n📁 Verifying file paths (sampling 10 random files)...');
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
				console.error('\n❌ Missing files detected:');
			}
			console.error(`  - ${file}`);
			missingFiles++;
		}
	}
	if (missingFiles === 0) {
		console.log(`✓ Sampled ${sampleSize} files, all exist`);
	} else {
		errors += missingFiles;
	}

	// Summary
	console.log('\n' + '='.repeat(50));
	if (errors > 0) {
		console.error(
			`\n❌ Validation completed with ${errors} error(s) and ${warnings} warning(s)`
		);
		process.exit(1);
	} else if (warnings > 0) {
		console.warn(
			`\n⚠️  Validation completed with ${warnings} warning(s)`
		);
		process.exit(0);
	} else {
		console.log('\n✅ All validation checks passed!');
		process.exit(0);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

// Export for testing
module.exports = { validateRegistry, loadJson };
