#!/usr/bin/env node

/**
 * scripts/scan-mustache-variables.js
 *
 * Scans the entire repository for mustache variables {{variable_name}}
 * and generates a complete registry categorized by type and usage.
 *
 * Usage:
 *   node scripts/scan-mustache-variables.js
 *   node scripts/scan-mustache-variables.js --json > variables.json
 *   node scripts/scan-mustache-variables.js --validate theme-config.json
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = [
	'.',
	'patterns',
	'parts',
	'templates',
	'styles',
	'src',
	'.github',
	'docs',
];

// Directories to exclude from scanning
const EXCLUDE_DIRS = [
	'node_modules',
	'vendor',
	'dist',
	'build',
	'output-theme',
	'.git',
	'coverage',
	'test-results',
	'artifacts',
];

// File extensions to scan
const SCAN_EXTENSIONS = [
	'.php',
	'.js',
	'.json',
	'.md',
	'.css',
	'.scss',
	'.html',
	'.txt',
	'.yml',
	'.yaml',
];

// Mustache variable regex: {{variable_name}}
const MUSTACHE_REGEX = /\{\{([a-zA-Z0-9_]+(?:\|[a-zA-Z0-9_]+)?)\}\}/g;

/**
 * Recursively scan directory for files
 *
 * @param {string} dir Directory path to scan
 * @param {string} basePath Base path for relative paths
 * @return {Array} Array of file objects
 */
function scanDirectory(dir, basePath = '') {
	const files = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.join(basePath, entry.name);

		if (entry.isDirectory()) {
			// Skip excluded directories
			if (EXCLUDE_DIRS.includes(entry.name)) {
				continue;
			}
			// Recursively scan subdirectory
			files.push(...scanDirectory(fullPath, relativePath));
		} else if (entry.isFile()) {
			// Check if file extension should be scanned
			const ext = path.extname(entry.name);
			if (SCAN_EXTENSIONS.includes(ext)) {
				files.push({
					path: relativePath,
					fullPath,
					ext,
				});
			}
		}
	}

	return files;
}

/**
 * Extract mustache variables from file content
 *
 * @param {string} content File content to scan
 * @return {Array} Array of variable names
 */
function extractVariables(content) {
	const variables = new Set();
	let match;

	while ((match = MUSTACHE_REGEX.exec(content)) !== null) {
		// match[1] contains the variable name (without {{ }})
		variables.add(match[1]);
	}

	return Array.from(variables);
}

/**
 * Categorize variable by name pattern
 *
 * @param {string} varName Variable name to categorize
 * @return {string} Category name
 */
function categorizeVariable(varName) {
	// Remove transformation suffix (e.g., variable|upper -> variable)
	const cleanName = varName.split('|')[0];

	// Core identity
	if (['theme_slug', 'theme_name', 'namespace', 'description'].includes(cleanName)) {
		return 'core_identity';
	}

	// Author & contact
	if (cleanName.includes('author') || cleanName.includes('email') || cleanName === 'year') {
		return 'author_contact';
	}

	// Versioning
	if (cleanName.includes('version') || cleanName.includes('_wp_') || cleanName.includes('_php_')) {
		return 'versioning';
	}

	// URLs
	if (cleanName.includes('_url') || cleanName.includes('_uri')) {
		return 'urls';
	}

	// License
	if (cleanName.includes('license')) {
		return 'license';
	}

	// Colors
	if (cleanName.includes('color') || cleanName.includes('_colour')) {
		return 'design_colors';
	}

	// Typography
	if (
		cleanName.includes('font') ||
		cleanName.includes('line_height') ||
		cleanName.includes('weight')
	) {
		return 'design_typography';
	}

	// Layout
	if (
		cleanName.includes('width') ||
		cleanName.includes('spacing') ||
		cleanName.includes('size')
	) {
		return 'design_layout';
	}

	// Content strings
	if (
		cleanName.includes('text') ||
		cleanName.includes('title') ||
		cleanName.includes('excerpt') ||
		cleanName.includes('skip_link') ||
		cleanName.includes('copyright')
	) {
		return 'content_strings';
	}

	// Images
	if (cleanName.includes('image') || cleanName.includes('thumbnail')) {
		return 'images';
	}

	// Theme tags and metadata
	if (cleanName.includes('tags') || cleanName.includes('textdomain') || cleanName.includes('audience')) {
		return 'theme_metadata';
	}

	// UI components
	if (cleanName.includes('button') || cleanName.includes('border')) {
		return 'ui_components';
	}

	return 'other';
}

/**
 * Main scan function
 */
function scanRepository() {
	console.error('🔍 Scanning repository for mustache variables...\n');

	const results = {
		summary: {
			totalFiles: 0,
			filesWithVariables: 0,
			uniqueVariables: 0,
			totalOccurrences: 0,
		},
		variables: {},
		filesByCategory: {},
		categories: {},
	};

	// Scan all configured directories
	const allFiles = [];
	for (const dir of SCAN_DIRS) {
		const dirPath = path.resolve(__dirname, '..', dir);
		if (fs.existsSync(dirPath)) {
			allFiles.push(...scanDirectory(dirPath, dir === '.' ? '' : dir));
		}
	}

	results.summary.totalFiles = allFiles.length;

	// Process each file
	for (const file of allFiles) {
		try {
			const content = fs.readFileSync(file.fullPath, 'utf8');
			const variables = extractVariables(content);

			if (variables.length > 0) {
				results.summary.filesWithVariables++;

				for (const varName of variables) {
					// Initialize variable entry if not exists
					if (!results.variables[varName]) {
						const category = categorizeVariable(varName);
						results.variables[varName] = {
							name: varName,
							category,
							files: [],
							count: 0,
						};

						// Initialize category
						if (!results.categories[category]) {
							results.categories[category] = {
								variables: [],
								count: 0,
							};
						}
						results.categories[category].variables.push(varName);
					}

					// Add file reference
					if (!results.variables[varName].files.includes(file.path)) {
						results.variables[varName].files.push(file.path);
					}

					// Count occurrences
					const occurrences = (content.match(new RegExp(`\\{\\{${varName}\\}\\}`, 'g')) || []).length;
					results.variables[varName].count += occurrences;
					results.summary.totalOccurrences += occurrences;
				}
			}
		} catch (error) {
			console.error(`⚠️  Error reading ${file.path}: ${error.message}`);
		}
	}

	// Calculate summary statistics
	results.summary.uniqueVariables = Object.keys(results.variables).length;

	// Sort variables by usage count
	const sortedVariables = Object.values(results.variables).sort((a, b) => b.count - a.count);

	// Count variables per category
	for (const category of Object.keys(results.categories)) {
		results.categories[category].count = results.categories[category].variables.length;
	}

	return { results, sortedVariables };
}

/**
 * Display results in human-readable format
 *
 * @param {Object} results Scan results object
 * @param {Array} sortedVariables Variables sorted by usage
 */
function displayResults(results, sortedVariables) {
	console.log('📊 Scan Results\n');
	console.log('Summary:');
	console.log(`  Total files scanned: ${results.summary.totalFiles}`);
	console.log(`  Files with variables: ${results.summary.filesWithVariables}`);
	console.log(`  Unique variables: ${results.summary.uniqueVariables}`);
	console.log(`  Total occurrences: ${results.summary.totalOccurrences}\n`);

	console.log('Variables by Category:\n');
	const categoryOrder = [
		'core_identity',
		'author_contact',
		'versioning',
		'urls',
		'license',
		'design_colors',
		'design_typography',
		'design_layout',
		'content_strings',
		'ui_components',
		'images',
		'theme_metadata',
		'other',
	];

	for (const category of categoryOrder) {
		if (results.categories[category]) {
			const cat = results.categories[category];
			console.log(`  ${category}: ${cat.count} variables`);
			console.log(`    ${cat.variables.join(', ')}`);
			console.log('');
		}
	}

	console.log('\nTop 20 Most Used Variables:\n');
	for (let i = 0; i < Math.min(20, sortedVariables.length); i++) {
		const v = sortedVariables[i];
		console.log(`  ${i + 1}. {{${v.name}}} - ${v.count} occurrences in ${v.files.length} files`);
	}

	console.log('\n✅ Scan complete!');
}

/**
 * Validate theme-config.json against discovered variables
 *
 * @param {string} configPath Path to config file
 * @param {Object} results Scan results
 */
function validateConfig(configPath, results) {
	console.error(`\n🔍 Validating ${configPath}...\n`);

	try {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		const flatConfig = flattenConfig(config);
		const configKeys = new Set(Object.keys(flatConfig));
		const discoveredVars = new Set(
			Object.keys(results.variables).map((v) => v.split('|')[0])
		);

		const missing = [];
		const extra = [];

		// Check for missing required variables
		for (const varName of discoveredVars) {
			if (!configKeys.has(varName)) {
				// Check if it's a derived variable
				if (!isDerivedVariable(varName)) {
					missing.push(varName);
				}
			}
		}

		// Check for extra variables in config
		for (const key of configKeys) {
			if (!discoveredVars.has(key) && !key.startsWith('_') && key !== 'design_system' && key !== 'theme_structure' && key !== 'features' && key !== 'content') {
				extra.push(key);
			}
		}

		console.log('Validation Results:\n');
		console.log(`  Variables in config: ${configKeys.size}`);
		console.log(`  Variables in repository: ${discoveredVars.size}`);

		if (missing.length > 0) {
			console.log(`\n  ⚠️  Missing ${missing.length} variables in config:`);
			missing.slice(0, 10).forEach((v) => console.log(`    - {{${v}}}`));
			if (missing.length > 10) {
				console.log(`    ... and ${missing.length - 10} more`);
			}
		}

		if (extra.length > 0) {
			console.log(`\n  ℹ️  Extra ${extra.length} variables in config (not found in templates):`);
			extra.slice(0, 10).forEach((v) => console.log(`    - ${v}`));
			if (extra.length > 10) {
				console.log(`    ... and ${extra.length - 10} more`);
			}
		}

		if (missing.length === 0 && extra.length === 0) {
			console.log('\n  ✅ Config is complete and matches repository!');
		}
	} catch (error) {
		console.error(`❌ Error validating config: ${error.message}`);
		process.exit(1);
	}
}

/**
 * Flatten nested config object
 *
 * @param {Object} config Config object to flatten
 * @param {string} prefix Key prefix for nested objects
 * @return {Object} Flattened config object
 */
function flattenConfig(config, prefix = '') {
	const flattened = {};

	for (const [key, value] of Object.entries(config)) {
		const newKey = prefix ? `${prefix}_${key}` : key;

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			Object.assign(flattened, flattenConfig(value, newKey));
		} else if (!Array.isArray(value)) {
			flattened[newKey] = value;
		}
	}

	return flattened;
}

/**
 * Check if variable is auto-derived from other variables
 *
 * @param {string} varName Variable name to check
 * @return {boolean} True if variable is derived
 */
function isDerivedVariable(varName) {
	const derived = [
		'namespace', // Derived from theme_slug
		'support_url', // Derived from theme_slug
		'support_email', // Derived from author_uri
		'security_email', // Derived from author_uri
		'business_email', // Derived from author_uri
		'docs_url', // Derived from author + theme_slug
		'docs_repo_url', // Derived from theme_repo_url
		'content_width_px', // Derived from content_width
		'year', // Auto-generated
		'created_date', // Auto-generated
		'updated_date', // Auto-generated
	];

	return derived.includes(varName);
}

/**
 * Main execution
 */
function main() {
	const args = process.argv.slice(2);
	const outputJson = args.includes('--json');
	const validateIndex = args.indexOf('--validate');

	const { results, sortedVariables } = scanRepository();

	if (validateIndex !== -1 && args[validateIndex + 1]) {
		// Validate config mode
		validateConfig(args[validateIndex + 1], results);
	} else if (outputJson) {
		// JSON output mode
		console.log(JSON.stringify(results, null, 2));
	} else {
		// Human-readable output mode
		displayResults(results, sortedVariables);
	}
}

main();
