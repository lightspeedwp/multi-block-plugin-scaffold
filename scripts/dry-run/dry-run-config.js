
/**
 * Dry Run Configuration
 *
 * Provides test values for mustache template variables during pre-commit hooks
 * and testing phases. This allows linting and testing to run on the scaffold
 * template files without requiring plugin generation.
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ROOT_DIR = path.resolve(__dirname, '../..');

/**
 * Default mustache variable values for dry-run testing
 */
const DRY_RUN_VALUES = {
	// Core Plugin Identity
	slug: 'example-plugin',
	name: 'Example Plugin',
	displayName: 'Example Plugin',
	namespace: 'example_plugin',
	textdomain: 'example-plugin',
	description: 'A multi-block WordPress plugin scaffold example',
	version: '1.0.0',
	author: 'Example Author',
	author_uri: 'https://example.com',
	license: 'GPL-2.0-or-later',
	license_uri: 'https://www.gnu.org/licenses/gpl-2.0.html',
	plugin_uri: 'https://example.com/plugins/example-plugin',

	// Post Type
	name_singular: 'Item',
	name_plural: 'Items',
	name_singular_lower: 'item',
	name_plural_lower: 'items',
	cpt_slug: 'item',
	cpt_icon: 'dashicons-admin-post',

	// Taxonomy
	taxonomy_singular: 'Category',
	taxonomy_plural: 'Categories',
	taxonomy_slug: 'category',

	// Requirements
	requires_wp: '6.5',
	requires_php: '8.0',
	tested_up_to: '6.7',

	// Meta
	website: 'https://example.com',
	docsUrl: 'https://example.com/docs',
	supportUrl: 'https://example.com/support',
	changelogUrl: 'https://example.com/changelog',
	createdDate: '2025-01-01',
	updatedDate: '2025-12-07',
};

/**
 * Get dry-run configuration
 *
 * @return {Object} Configuration object with all mustache variables
 */
function getDryRunConfig() {
	return { ...DRY_RUN_VALUES };
}

/**
 * Get a specific dry-run value
 *
 * @param {string} key          - The configuration key
 * @param {*}      defaultValue - Default value if key not found
 * @return {*} The configuration value
 */
function getDryRunValue(key, defaultValue = '') {
	return DRY_RUN_VALUES[key] ?? defaultValue;
}

/**
 * Check if we're in dry-run mode
 *
 * @return {boolean} True if DRY_RUN environment variable is set
 */
function isDryRun() {
	return process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
}

const SIMPLE_PLACEHOLDER = /\{\{([a-z0-9_]+)\}\}/gi;
const FILTERED_PLACEHOLDER = /\{\{([a-z0-9_]+)\|([a-z]+)\}\}/gi;

/**
 * Apply a transformation filter to the placeholder value before replacement.
 *
 * @param {string} value  - The raw value to filter
 * @param {string} filter - The filter identifier (e.g. upper, lower)
 * @return {string} The filtered value
 */
function applyFilter(value, filter) {
	const normalized = filter.toLowerCase();
	switch (normalized) {
		case 'upper':
			return value.toUpperCase();
		case 'lower':
			return value.toLowerCase();
		case 'pascalcase':
			return value
				.split(/[\s-_]+/)
				.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
				.join('');
		case 'camelcase':
			return value
				.split(/[\s-_]+/)
				.map((segment, index) =>
					index === 0
						? segment.toLowerCase()
						: segment.charAt(0).toUpperCase() + segment.slice(1)
				)
				.join('');
		default:
			return value;
	}
}

/**
 * Replace mustache variables in a string
 *
 * @param {string} content - Content with mustache variables
 * @param {Object} values  - Optional custom values (defaults to DRY_RUN_VALUES)
 * @return {string} Content with variables replaced
 */
function replaceMustacheVars(content, values = DRY_RUN_VALUES) {
	let result = content;

	result = result.replace(
		FILTERED_PLACEHOLDER,
		(match, varName, filter) => {
			const value = values[varName];
			if (value === undefined) {
				return '';
			}
			return applyFilter(String(value), filter);
		}
	);

	result = result.replace(SIMPLE_PLACEHOLDER, (match, varName) => {
		const value = values[varName];
		return value !== undefined ? String(value) : '';
	});

	// Remove any remaining placeholders (undefined variables)
	result = result.replace(/\{\{[a-z0-9_]+(?:\|[a-z0-9_]+)?\}\}/gi, '');

	// TODO: Allow consumers to register additional filters without editing the utility.
	return result;
}

/**
 * Replace mustache variables in a file
 *
 * @param {string} filePath - Path to the file
 * @param {Object} values   - Optional custom values
 * @return {string} Content with variables replaced
 */
function replaceMustacheVarsInFile(filePath, values = DRY_RUN_VALUES) {
	const fs = require('fs');
	const content = fs.readFileSync(filePath, 'utf8');
	return replaceMustacheVars(content, values);
}

/**
 * Get list of files containing mustache placeholders.
 *
 * @param {string} [pattern='**/*.{js,jsx,php,json,scss,css,html}'] Glob pattern to search.
 * @return {string[]} Array of file paths that include `{{mustache}}` tokens.
 */
function getFilesWithMustacheVars(pattern = '**/*.{js,jsx,php,json,scss,css,html}') {
	const files = glob.sync(pattern, {
		cwd: ROOT_DIR,
		absolute: true,
		dot: true,
		nodir: true,
	});

	return files
		.filter((file) => {
			const stat = fs.statSync(file);
			if (!stat.isFile()) {
				return false;
			}
			const content = fs.readFileSync(file, 'utf8');
			return /\{\{[a-z0-9_]+(?:\|[a-z0-9_]+)?\}\}/i.test(content);
		})
		.map((file) => path.relative(ROOT_DIR, file));
}

// TODO: Honour project-specific ignore lists so generated assets are not scanned repeatedly.

/**
 * Display dry-run CLI usage instructions.
 */
function printUsage() {
	console.log(
		`Dry Run CLI Usage:
  config                   Print dry-run configuration
  value <key>              Print one configuration value
  files <pattern>          List files containing mustache variables
  replace <file>           Show replaced file contents`
	);
}

/**
 * Execute the CLI driver with parsed options.
 *
 * @param {string[]} args - CLI arguments (defaults to process.argv)
 * @return {number} Exit status
 */
function runCli(args = process.argv.slice(2)) {
	const [command, target] = args;

	switch (command) {
		case 'config':
			console.log(JSON.stringify(DRY_RUN_VALUES, null, 2));
			return 0;
		case 'value':
			if (!target) {
				console.log('Please provide the configuration key.');
				return 1;
			}
			console.log(getDryRunValue(target));
			return 0;
		case 'files':
			if (!target) {
				console.log('Please provide a glob pattern.');
				return 1;
			}
			getFilesWithMustacheVars(target).forEach((file) =>
				console.log(file)
			);
			return 0;
		case 'replace':
			if (!target) {
				console.log('Please provide a file path for replacement');
				return 1;
			}
			console.log(replaceMustacheVarsInFile(target));
			// TODO: Support glob patterns so replace can act on multiple targets.
			return 0;
		default:
			printUsage();
			return command ? 1 : 0;
	}
}

if (require.main === module) {
	process.exit(runCli());
}

module.exports = {
	DRY_RUN_VALUES,
	getDryRunConfig,
	getDryRunValue,
	isDryRun,
	replaceMustacheVars,
	replaceMustacheVarsInFile,
	getFilesWithMustacheVars,
	runCli,
	printUsage,
};
