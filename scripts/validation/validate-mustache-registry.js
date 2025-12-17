/**
 * Scan the repository and ensure every mustache token in the registry still exists,
 * and that no new placeholders have appeared without a registry entry.
 *
 * @module scripts/validation/validate-mustache-registry
 */

const fs = require('fs');
const path = require('path');
const {
	scanDirectory,
	extractVariables,
	SCAN_DIRS,
} = require('../utils/scan');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = path.join(ROOT_DIR, 'scripts', 'mustache-variables-registry.json');

/**
 * Load the registry file and return the registered variable names.
 *
 * @return {Map<string, Object>}
 */
function loadRegistry() {
	const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
	const parsed = JSON.parse(raw);
	const variables = parsed.variables ?? {};

	return new Map(Object.entries(variables));
}

/**
 * Recursively scan the workspace directories for files that might contain mustache placeholders.
 *
 * @return {Array<Object>}
 */
function gatherTemplateFiles() {
	const files = [];

	SCAN_DIRS.forEach((scanDir) => {
		const fullPath = path.join(ROOT_DIR, scanDir);
		if (!fs.existsSync(fullPath)) {
			return;
		}

		files.push(...scanDirectory(fullPath, scanDir));
	});

	return files;
}

/**
 * Extract clean variable names (without filters) from file contents.
 *
 * @param {string} content
 * @return {Array<string>}
 */
function collectVariableNames(content) {
	return extractVariables(content).map((entry) => entry.split('|')[0]);
}

/**
 * Build a map of found variable names to the files that mention them.
 *
 * @param {Array<Object>} files
 * @return {Map<string, Set<string>>}
 */
function buildFoundMap(files) {
	const map = new Map();

	files.forEach((file) => {
		const absolute = file.fullPath;
		if (!fs.existsSync(absolute)) {
			return;
		}

		const content = fs.readFileSync(absolute, 'utf8');
		const names = collectVariableNames(content);
		if (!names.length) {
			return;
		}

		names.forEach((name) => {
			if (!map.has(name)) {
				map.set(name, new Set());
			}

			map.get(name).add(file.path);
		});
	});

	return map;
}

/**
 * Format an array of strings for logging.
 *
 * @param {Array<string>} items
 * @param {number} sample
 * @return {string}
 */
function formatList(items, sample = 3) {
	if (!items.length) {
		return '';
	}

	const sampleList = items.slice(0, sample).join(', ');
	return `${items.length} item(s): ${sampleList}${items.length > sample ? ', …' : ''}`;
}

function main() {
	const registry = loadRegistry();
	const files = gatherTemplateFiles();
	const foundMap = buildFoundMap(files);

	const registryKeys = new Set(registry.keys());
	const foundKeys = new Set(foundMap.keys());

	const missingRegistry = [];
	foundKeys.forEach((key) => {
		if (!registryKeys.has(key)) {
			missingRegistry.push(key);
		}
	});

	const staleRegistry = [];
	registryKeys.forEach((key) => {
		if (!foundKeys.has(key)) {
			staleRegistry.push(key);
		}
	});

	const issues = [];

	if (missingRegistry.length) {
		issues.push(
			`Templates include ${missingRegistry.length} unregistered mustache variable(s): ${formatList(
				missingRegistry
			)}`
		);
	}

	if (staleRegistry.length) {
		issues.push(
			`Registry lists ${staleRegistry.length} variable(s) that no longer appear in templates: ${formatList(
				staleRegistry
			)}`
		);
	}

	console.log(`✔ Scanned ${files.length} template file(s) across ${SCAN_DIRS.length} directories.`);
	console.log(`✔ Registry contains ${registryKeys.size} variable(s).`);

	if (issues.length) {
		console.error('❌ Mustache registry validation failed:');
		issues.forEach((issue) => console.error(`  - ${issue}`));
		process.exitCode = 1;
	} else {
		console.log('✅ Mustache registry is in sync with template files.');
	}
}

if (require.main === module) {
	main();
}
