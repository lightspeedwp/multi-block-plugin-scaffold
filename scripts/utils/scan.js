/**
 * Generic scanning helpers for the scaffold.
 *
 * Provides directory walking, mustache placeholder extraction, and categorisation
 * utilities, reused across multiple tooling scripts.
 *
 * @module scripts/utils/scan
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
/**
 * Directories that should be scanned for template files.
 *
 * @type {string[]}
 */
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
/**
 * Directories that should be excluded from scans.
 *
 * @type {string[]}
 */
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
/**
 * File extensions that should be considered during scans.
 *
 * @type {string[]}
 */
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
/**
 * Regex that matches mustache-style variable placeholders.
 *
 * @type {RegExp}
 */
const MUSTACHE_REGEX = /\{\{([a-zA-Z0-9_]+(?:\|[a-zA-Z0-9_]+)?)\}\}/g;

/**
 * Recursively scan a directory for supported files, honoring exclude lists.
 *
 * @param {string} dir Directory to walk.
 * @param {string} [basePath=''] Relative path accumulator.
 * @return {Array<Object>} List of discovered files with metadata.
 */
function scanDirectory(dir, basePath = '') {
	const files = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.join(basePath, entry.name);

		if (entry.isDirectory()) {
			if (EXCLUDE_DIRS.includes(entry.name)) continue;
			files.push(...scanDirectory(fullPath, relativePath));
		} else if (entry.isFile()) {
			const ext = path.extname(entry.name);
			if (SCAN_EXTENSIONS.includes(ext)) {
				files.push({ path: relativePath, fullPath, ext });
			}
		}
	}
	return files;
}

/**
 * Extract unique mustache variables from text content.
 *
 * @param {string} content Text to scan.
 * @return {string[]} Array of variable names (including optional filters).
 */
function extractVariables(content) {
	const variables = new Set();
	let match;
	while ((match = MUSTACHE_REGEX.exec(content)) !== null) {
		variables.add(match[1]);
	}
	return Array.from(variables);
}

/**
 * Categorize a variable name for reporting (identity, layout, etc.).
 *
 * @param {string} varName Variable name with optional filter suffix.
 * @return {string} Category key.
 */
function categorizeVariable(varName) {
	const cleanName = varName.split('|')[0];
	if ([
		'theme_slug', 'theme_name', 'namespace', 'description',
	].includes(cleanName)) return 'core_identity';
	if (
		cleanName.includes('author') ||
		cleanName.includes('email') ||
		cleanName === 'year'
	) return 'author_contact';
	if (
		cleanName.includes('version') ||
		cleanName.includes('_wp_') ||
		cleanName.includes('_php_')
	) return 'versioning';
	if (cleanName.includes('_url') || cleanName.includes('_uri')) return 'urls';
	if (cleanName.includes('license')) return 'license';
	if (cleanName.includes('color') || cleanName.includes('_colour')) return 'design_colors';
	if (
		cleanName.includes('font') ||
		cleanName.includes('line_height') ||
		cleanName.includes('weight')
	) return 'design_typography';
	if (
		cleanName.includes('width') ||
		cleanName.includes('spacing') ||
		cleanName.includes('size')
	) return 'design_layout';
	if (
		cleanName.includes('text') ||
		cleanName.includes('title') ||
		cleanName.includes('excerpt') ||
		cleanName.includes('skip_link') ||
		cleanName.includes('copyright')
	) return 'content_strings';
	if (cleanName.includes('image') || cleanName.includes('thumbnail')) return 'images';
	if (
		cleanName.includes('tags') ||
		cleanName.includes('textdomain') ||
		cleanName.includes('audience')
	) return 'theme_metadata';
	if (cleanName.includes('button') || cleanName.includes('border')) return 'ui_components';
	return 'other';
}

module.exports = {
	SCAN_DIRS,
	EXCLUDE_DIRS,
	SCAN_EXTENSIONS,
	MUSTACHE_REGEX,
	scanDirectory,
	extractVariables,
	categorizeVariable,
};
// TODO: Add caching and concurrency safety if scanning large repositories becomes a bottleneck.
// ...moved helpers from scan-mustache-variables.js...
