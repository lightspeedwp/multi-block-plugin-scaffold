// Dry run tests for validating {{mustache}} placeholder variables in scaffold files
const fs = require('fs');
const path = require('path');
const {
	replaceMustacheVars,
	DRY_RUN_VALUES,
} = require('./dry-run-config');
const glob = require('glob');

// Recursively find all files with mustache variables in the scaffold (deprecated)
function findMustacheFiles() {
	throw new Error(
		'findMustacheFiles is deprecated. Use findMustacheFilesGlob instead.'
	);
}

// Use glob to find all files, including ignored ones, then filter for mustache variables
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
			ignore: [], // Don't ignore anything
			nodir: true,
			follow: true,
		});
		console.log(`Pattern: ${pattern} | Matches: ${matched.length}`);
		if (matched.length > 0) {
			console.log(
				`First 5 matches for pattern '${pattern}':`,
				matched.slice(0, 5)
			);
		}
		files = files.concat(matched);
	});
	// Remove duplicates
	files = Array.from(new Set(files));
	console.log('Total unique files matched by all patterns:', files.length);
	if (files.length > 0) {
		console.log('First 20 unique files:', files.slice(0, 20));
	}
	// Only keep files containing mustache variables
	const mustacheFiles = files.filter((file) => {
		try {
			const content = fs.readFileSync(file, 'utf8');
			return /\{\{[a-z_]+\}\}/i.test(content);
		} catch (e) {
			return false;
		}
	});
	console.log(
		'Total files containing mustache variables:',
		mustacheFiles.length
	);
	if (mustacheFiles.length > 0) {
		console.log('First 10 mustache files:', mustacheFiles.slice(0, 10));
	}
	return mustacheFiles;
}

describe('Dry Run Mustache Variable Validation', () => {
	const ROOT_DIR = path.resolve(__dirname, '../..');

	test('All scaffold files with mustache variables are detected', () => {
		const files = findMustacheFilesGlob(ROOT_DIR);
		// Debug output
		console.log('ROOT_DIR:', ROOT_DIR);
		console.log('Total files found by glob:', files.length);
		if (files.length === 0) {
			const allCandidates = glob.sync('**/*', {
				cwd: ROOT_DIR,
				absolute: true,
				dot: true,
				nodir: true,
			});
			console.log(
				'Sample of all files in ROOT_DIR:',
				allCandidates.slice(0, 20)
			);
		}
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
