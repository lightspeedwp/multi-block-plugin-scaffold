
/**
 * Validates that scaffold mustache variables are detected and replaced during dry runs.
 */
const fs = require('fs');
const path = require('path');
const {
	replaceMustacheVars,
	DRY_RUN_VALUES,
} = require('../dry-run-config');
const glob = require('glob');

/**
 * Deprecated helper once used to find mustache files.
 *
 * @throws {Error} Always throws because this helper is no longer supported.
 */
function findMustacheFiles() {
	throw new Error(
		'findMustacheFiles is deprecated. Use findMustacheFilesGlob instead.'
	);
}

// Use glob to find all files, including ignored ones, then filter for mustache variables
/**
 * Find all files matching mustache-containing patterns.
 *
 * @param {string} rootDir Root directory for globbing (currently unused).
 * @return {string[]} Absolute paths of matching files.
 */
function findMustacheFilesGlob(rootDir) {
	// Match all relevant file types recursively, including dotfiles and ignored files
	const patterns = [
		'**/*.{js,jsx,ts,tsx,php,json,scss,md,txt,html}',
		'**/readme.txt',
		'**/composer.json',
		'**/package.json',
		'**/*.php',
		'**/*.md',
		'**/*.js',
		'**/*.json',
		'**/*.scss',
		'**/*.html',
		'**/*.txt',
	];
	let files = [];
	patterns.forEach((pattern) => {
		const matched = glob.sync(pattern, {
			cwd: process.cwd(), // Use process.cwd() instead of rootDir
			absolute: true,
			dot: true,
			ignore: [],
			nodir: true,
			follow: true,
		});
		files = files.concat(matched);
	});
	files = Array.from(new Set(files));
	// TODO: Narrow the pattern list when the relevant filetypes are final to avoid redundant scanning.
	// Only keep files containing mustache variables
	const mustacheFiles = files.filter((file) => {
		try {
			const content = fs.readFileSync(file, 'utf8');
			return /\{\{[a-z_]+\}\}/i.test(content);
		} catch (e) {
			return false;
		}
	});
	return mustacheFiles;
}

/**
 * Test suite verifying mustache placeholders across the scaffold.
 */
describe('Dry Run Mustache Variable Validation', () => {
	// TODO: Expand pattern coverage once the template stabilises to avoid random glob hits.
	const ROOT_DIR = path.resolve(__dirname, '../../../');

	test('All scaffold files with mustache variables are detected', () => {
		const files = findMustacheFilesGlob(ROOT_DIR);
		expect(Array.isArray(files)).toBe(true);
		expect(files.length).toBeGreaterThan(0);
		files.forEach((file) => {
			expect(typeof file).toBe('string');
			expect(file).toMatch(
				/\.(js|jsx|ts|tsx|php|json|scss|md|txt|html)$/
			);
		});
	});

	test('All mustache files can be dry-run replaced without placeholders', () => {
		const files = findMustacheFilesGlob(ROOT_DIR);
		expect(files.length).toBeGreaterThan(0);
		files.forEach((file) => {
			const content = fs.readFileSync(file, 'utf8');
			const replaced = replaceMustacheVars(content, DRY_RUN_VALUES);
			expect(replaced).not.toMatch(/\{\{[a-z_]+\}\}/i);
		});
	});

	test('All mustache variables in DRY_RUN_VALUES are valid', () => {
		Object.keys(DRY_RUN_VALUES).forEach((key) => {
			expect(DRY_RUN_VALUES[key]).toBeDefined();
			expect(DRY_RUN_VALUES[key]).not.toMatch(/\{\{.*?\}\}/);
		});
	});
});
