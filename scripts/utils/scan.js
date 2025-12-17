/**
 * Directory scanning helpers used across tooling in the scaffold.
 *
 * Provides reusable helpers for discovering mustache placeholders, categorising
 * them, and building a registry that can be emitted as JSON or used for
 * configuration validation.
 *
 * @module scripts/utils/scan
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

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

const IGNORE_PATHS = [
	'scripts/mustache-variables-registry.json',
	'scripts/fixtures/mustache-variables-registry.example.json',
	'.github/schemas/examples/mustache-variables-registry.example.json',
];

/**
 * Normalise a file path for comparison purposes.
 *
 * @param {string} fullPath
 * @return {string}
 */
function normalizeRelativePath(fullPath) {
	const relative = path.relative(ROOT_DIR, fullPath);
	return relative ? relative.split(path.sep).join('/') : '';
}

/**
 * Determine whether the scanner should skip a given path.
 *
 * @param {string} fullPath
 * @return {boolean}
 */
function isIgnoredPath(fullPath) {
	const relativePath = normalizeRelativePath(fullPath);
	if (!relativePath) {
		return false;
	}

	return IGNORE_PATHS.some(
		(ignorePath) =>
			relativePath === ignorePath || relativePath.startsWith(`${ignorePath}/`)
	);
}

const MUSTACHE_REGEX = /\{\{([a-zA-Z0-9_]+(?:\|[a-zA-Z0-9_]+)?)\}\}/g;

const CATEGORY_ORDER = [
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

/**
 * Walks directories and collects files that look like mustache templates.
 *
 * @param {string} dir Absolute directory to walk.
 * @param {string} basePath Relative path accumulator.
 * @return {Array<Object>} Discovered files.
 */
function scanDirectory(dir, basePath = '') {
	const files = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (isIgnoredPath(fullPath)) {
			continue;
		}
		const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;

		if (entry.isDirectory()) {
			if (EXCLUDE_DIRS.includes(entry.name)) {
				continue;
			}

			files.push(...scanDirectory(fullPath, relativePath));
			continue;
		}

		if (!entry.isFile()) {
			continue;
		}

		const ext = path.extname(entry.name);
		if (SCAN_EXTENSIONS.includes(ext)) {
			files.push({
				path: relativePath,
				fullPath,
				ext,
			});
		}
	}

	return files;
}

/**
 * Scan configured directories from the repository root.
 *
 * @param {Object} [options={}] Options bag.
 * @param {string[]} [options.directories=SCAN_DIRS]
 * @param {string} [options.rootDir=ROOT_DIR]
 * @return {Array<Object>}
 */
function gatherTemplateFiles(options = {}) {
	const { directories = SCAN_DIRS, rootDir = ROOT_DIR } = options;
	const files = [];

	for (const scanDir of directories) {
		const dirPath = path.join(rootDir, scanDir);
		if (!fs.existsSync(dirPath)) {
			continue;
		}

		const basePath = scanDir === '.' ? '' : scanDir;
		files.push(...scanDirectory(dirPath, basePath));
	}

	return files;
}

/**
 * Recover unique mustache placeholders from content.
 *
 * @param {string} content
 * @return {string[]}
 */
function extractVariables(content) {
	const variables = new Set();
	let match;
	MUSTACHE_REGEX.lastIndex = 0;

	while ((match = MUSTACHE_REGEX.exec(content)) !== null) {
		variables.add(match[1]);
	}

	return Array.from(variables);
}

/**
 * Categorise a placeholder for reporting.
 *
 * @param {string} varName
 * @return {string}
 */
function categorizeVariable(varName) {
	const cleanName = varName.split('|')[0];

	if ([
		'theme_slug',
		'theme_name',
		'namespace',
		'description',
	].includes(cleanName)) {
		return 'core_identity';
	}

	if (
		cleanName.includes('author') ||
		cleanName.includes('email') ||
		cleanName === 'year'
	) {
		return 'author_contact';
	}

	if (
		cleanName.includes('version') ||
		cleanName.includes('_wp_') ||
		cleanName.includes('_php_')
	) {
		return 'versioning';
	}

	if (cleanName.includes('_url') || cleanName.includes('_uri')) {
		return 'urls';
	}

	if (cleanName.includes('license')) {
		return 'license';
	}

	if (cleanName.includes('color') || cleanName.includes('_colour')) {
		return 'design_colors';
	}

	if (
		cleanName.includes('font') ||
		cleanName.includes('line_height') ||
		cleanName.includes('weight')
	) {
		return 'design_typography';
	}

	if (
		cleanName.includes('width') ||
		cleanName.includes('spacing') ||
		cleanName.includes('size')
	) {
		return 'design_layout';
	}

	if (
		cleanName.includes('text') ||
		cleanName.includes('title') ||
		cleanName.includes('excerpt') ||
		cleanName.includes('skip_link') ||
		cleanName.includes('copyright')
	) {
		return 'content_strings';
	}

	if (cleanName.includes('image') || cleanName.includes('thumbnail')) {
		return 'images';
	}

	if (
		cleanName.includes('tags') ||
		cleanName.includes('textdomain') ||
		cleanName.includes('audience')
	) {
		return 'theme_metadata';
	}

	if (cleanName.includes('button') || cleanName.includes('border')) {
		return 'ui_components';
	}

	return 'other';
}

/**
 * Count occurrences of a placeholder in a file.
 *
 * @param {string} content
 * @param {string} varName
 * @return {number}
 */
function countOccurrences(content, varName) {
	const cleaned = varName.split('|')[0];
	const escaped = cleaned.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	const occurrences = content.match(
		new RegExp(`\\{\\{${escaped}(?:\\|[^}]+)?\\}\\}`, 'g')
	);
	return occurrences ? occurrences.length : 0;
}

/**
 * Build the registry data structure used to power validation routines.
 *
 * @param {Object} [options={}]
 * @param {string} [options.rootDir]
 * @param {string[]} [options.directories]
 * @return {Object}
 */
function buildRegistry(options = {}) {
	const files = gatherTemplateFiles(options);
	const summary = {
		totalFiles: files.length,
		filesWithVariables: 0,
		uniqueVariables: 0,
		totalOccurrences: 0,
	};

	const variables = {};
	const categories = {};

	for (const file of files) {
		let content;
		try {
			content = fs.readFileSync(file.fullPath, 'utf8');
		} catch (error) {
			continue;
		}

		const discovered = extractVariables(content);
		if (!discovered.length) {
			continue;
		}

		summary.filesWithVariables++;

		const canonicalVariables = Array.from(
			new Set(discovered.map((name) => name.split('|')[0]))
		);

		for (const varName of canonicalVariables) {
			if (!variables[varName]) {
				const category = categorizeVariable(varName);
				variables[varName] = {
					name: varName,
					category,
					files: [],
					count: 0,
				};

				if (!categories[category]) {
					categories[category] = {
						variables: [],
						count: 0,
					};
				}
				categories[category].variables.push(varName);
			}

			const meta = variables[varName];
			if (!meta.files.includes(file.path)) {
				meta.files.push(file.path);
			}

			const occurrences = countOccurrences(content, varName);
			meta.count += occurrences;
			summary.totalOccurrences += occurrences;
		}
	}

	summary.uniqueVariables = Object.keys(variables).length;

	for (const category of Object.keys(categories)) {
		categories[category].count = categories[category].variables.length;
	}

	const sortedVariables = Object.values(variables).sort((a, b) => {
		if (b.count === a.count) {
			return a.name.localeCompare(b.name);
		}
		return b.count - a.count;
	});

	return {
		results: {
			summary,
			variables,
			categories,
		},
		sortedVariables,
	};
}

/**
 * Format console output for CLI users.
 *
 * @param {Object} results
 * @param {Array<Object>} sortedVariables
 */
function displayResults(results, sortedVariables) {
	console.log(
		`Scanned ${results.summary.totalFiles} template file(s) across ${SCAN_DIRS.length} directories.`
	);
	console.log(
		`Discovered ${results.summary.uniqueVariables} unique mustache variable(s) in ${results.summary.filesWithVariables} file(s).`
	);
	console.log(`Total placeholder occurrences: ${results.summary.totalOccurrences}.`);

	const categoryLines = CATEGORY_ORDER.filter((category) => results.categories[category]);
	if (categoryLines.length) {
		console.log('Variables by category:');
		for (const category of categoryLines) {
			const summary = results.categories[category];
			console.log(`  ${category}: ${summary.count} variable(s)`);
		}
	}

	if (!sortedVariables.length) {
		console.log('No mustache placeholders were detected.');
		return;
	}

	console.log('Top placeholders:');
	sortedVariables.slice(0, 20).forEach((variable, index) => {
		console.log(
			`  ${index + 1}. {{${variable.name}}} — ${variable.count} occurrence(s) in ${variable.files.length} file(s)`
		);
	});
}

/**
 * Flatten nested config objects for easy comparison.
 *
 * @param {Object} config
 * @param {string} prefix
 * @return {Object}
 */
function flattenConfig(config, prefix = '') {
	const flattened = {};

	for (const [key, value] of Object.entries(config)) {
		const newKey = prefix ? `${prefix}_${key}` : key;

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			Object.assign(flattened, flattenConfig(value, newKey));
			continue;
		}

		if (!Array.isArray(value)) {
			flattened[newKey] = value;
		}
	}

	return flattened;
}

/**
 * Determine whether a placeholder is derived rather than user provided.
 *
 * @param {string} varName
 * @return {boolean}
 */
function isDerivedVariable(varName) {
	const derived = [
		'namespace',
		'support_url',
		'support_email',
		'security_email',
		'business_email',
		'docs_url',
		'docs_repo_url',
		'content_width_px',
		'year',
		'created_date',
		'updated_date',
	];

	return derived.includes(varName);
}

/**
 * Validate a config file against the discovered placeholders.
 *
 * @param {string} configPath
 * @param {Object} results
 */
function validateConfig(configPath, results) {
	let config;
	try {
		config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	} catch (error) {
		console.error(`Unable to parse configuration at ${configPath}: ${error.message}`);
		process.exit(1);
	}

	const flatConfig = flattenConfig(config);
	const configKeys = new Set(Object.keys(flatConfig));
	const discovered = new Set(Object.keys(results.variables).map((name) => name.split('|')[0]));

	const missing = [];
	const extra = [];

	for (const placeholder of discovered) {
		if (!configKeys.has(placeholder) && !isDerivedVariable(placeholder)) {
			missing.push(placeholder);
		}
	}

	for (const key of configKeys) {
		if (
			!discovered.has(key) &&
			!key.startsWith('_') &&
			key !== 'design_system' &&
			key !== 'theme_structure' &&
			key !== 'features' &&
			key !== 'content'
		) {
			extra.push(key);
		}
	}

	if (missing.length) {
		console.error(`Missing variables from config: ${missing.join(', ')}`);
	}

	if (extra.length) {
		console.error(`Unused values in config: ${extra.join(', ')}`);
	}

	if (missing.length || extra.length) {
		process.exitCode = 1;
		return;
	}

	console.log('Configuration is in sync with the mustache registry.');
}

/**
 * Keep the registry object stable for JSON output.
 *
 * @param {Object} variables
 * @return {Object}
 */
function sortVariablesAlphabetically(variables) {
	return Object.keys(variables)
		.sort((a, b) => a.localeCompare(b))
		.reduce((acc, key) => {
			acc[key] = variables[key];
			return acc;
		}, {});
}

/**
 * CLI entry point.
 */
function runCli() {
	const args = process.argv.slice(2);
	const outputJson = args.includes('--json');
	const validateIndex = args.indexOf('--validate');
	const { results, sortedVariables } = buildRegistry();

	if (validateIndex !== -1) {
		const configPath = args[validateIndex + 1];
		if (!configPath) {
			console.error('Missing argument for --validate');
			process.exit(1);
		}
		validateConfig(configPath, results);
		return;
	}

	if (outputJson) {
		const payload = {
			summary: results.summary,
			variables: sortVariablesAlphabetically(results.variables),
		};
		console.log(JSON.stringify(payload, null, 2));
		return;
	}

	displayResults(results, sortedVariables);
}

if (require.main === module) {
	runCli();
}

module.exports = {
	SCAN_DIRS,
	EXCLUDE_DIRS,
	SCAN_EXTENSIONS,
	MUSTACHE_REGEX,
	scanDirectory,
	extractVariables,
	categorizeVariable,
	buildRegistry,
	gatherTemplateFiles,
	validateConfig,
	flattenConfig,
	isDerivedVariable,
};
