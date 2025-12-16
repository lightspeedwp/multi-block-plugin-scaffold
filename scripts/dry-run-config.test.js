#!/usr/bin/env node

/**
 * Test for dry-run configuration
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
	DRY_RUN_VALUES,
	getDryRunConfig,
	getDryRunValue,
	isDryRun,
	replaceMustacheVars,
	replaceMustacheVarsInFile,
	getFilesWithMustacheVars,
} = require('./dry-run-config');

const TEMP_DIR = path.join(__dirname, '..', 'tmp', 'dry-run-tests');
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const CLI_SCRIPT = path.join(ROOT_DIR, 'scripts', 'dry-run-config.js');
const CLI_TEMP_DIR = path.join(__dirname, '..', 'tmp', 'dry-run-cli');

describe('Dry Run Configuration', () => {
	beforeAll(() => {
		fs.mkdirSync(TEMP_DIR, { recursive: true });
	});

	afterAll(() => {
		fs.rmSync(TEMP_DIR, { recursive: true, force: true });
	});

	test('provides all required mustache variables', () => {
		const config = getDryRunConfig();

		expect(config).toHaveProperty('slug');
		expect(config).toHaveProperty('name');
		expect(config).toHaveProperty('namespace');
		expect(config).toHaveProperty('version');
		expect(config).not.toBe(DRY_RUN_VALUES);
	});

	test('getDryRunValue returns correct values', () => {
		expect(getDryRunValue('slug')).toBe('example-plugin');
		expect(getDryRunValue('name')).toBe('Example Plugin');
		expect(getDryRunValue('nonexistent', 'default')).toBe('default');
	});

	test('isDryRun checks environment variable accurately', () => {
		const originalEnv = process.env.DRY_RUN;

		process.env.DRY_RUN = 'true';
		expect(isDryRun()).toBe(true);

		process.env.DRY_RUN = '1';
		expect(isDryRun()).toBe(true);

		process.env.DRY_RUN = 'false';
		expect(isDryRun()).toBe(false);

		delete process.env.DRY_RUN;
		expect(isDryRun()).toBe(false);

		process.env.DRY_RUN = originalEnv;
	});

	test('replaceMustacheVars substitutes variables', () => {
		const template = 'Plugin name: Example Plugin, Slug: example-plugin';
		const result = replaceMustacheVars(template);

		expect(result).toBe(
			'Plugin name: Example Plugin, Slug: example-plugin'
		);
		expect(result).not.toContain('{{');
	});

	test('replaceMustacheVars handles multiple occurrences', () => {
		const template = 'example-plugin-block and example-plugin-component';
		const result = replaceMustacheVars(template);

		expect(result).toBe(
			'example-plugin-block and example-plugin-component'
		);
	});

	test('replaceMustacheVars uses custom values', () => {
		const template = 'Name: {{name}}';
		const customValues = { name: 'Custom Plugin' };
		const result = replaceMustacheVars(template, customValues);

		expect(result).toBe('Name: Custom Plugin');
	});

	test('replaceMustacheVarsInFile reads from disk and applies replacements', () => {
		const templatePath = path.join(TEMP_DIR, 'template.txt');
		fs.writeFileSync(templatePath, 'Name: {{name}}', 'utf8');

		const result = replaceMustacheVarsInFile(templatePath, {
			name: 'Dry Run Plugin',
		});

		expect(result).toBe('Name: Dry Run Plugin');
	});

	test('getFilesWithMustacheVars returns only files containing placeholders', () => {
		const mustacheFile = path.join(TEMP_DIR, 'with-vars.txt');
		const plainFile = path.join(TEMP_DIR, 'without-vars.txt');
		fs.writeFileSync(mustacheFile, 'Slug: {{slug}}', 'utf8');
		fs.writeFileSync(plainFile, 'Hello world', 'utf8');

		const found = getFilesWithMustacheVars(
			'tests/tmp/dry-run-tests/**/*.txt'
		);

		expect(found).toContain('tests/tmp/dry-run-tests/with-vars.txt');
		expect(found).not.toContain('tests/tmp/dry-run-tests/without-vars.txt');
	});
});

describe('Dry Run CLI commands', () => {
	beforeAll(() => {
		fs.mkdirSync(CLI_TEMP_DIR, { recursive: true });
		fs.writeFileSync(
			path.join(CLI_TEMP_DIR, 'with-vars.txt'),
			'Slug: {{slug}}',
			'utf8'
		);
		fs.writeFileSync(
			path.join(CLI_TEMP_DIR, 'without-vars.txt'),
			'Hello world',
			'utf8'
		);
		fs.writeFileSync(
			path.join(CLI_TEMP_DIR, 'replace.txt'),
			'Name: {{name}}',
			'utf8'
		);
	});

	afterAll(() => {
		fs.rmSync(CLI_TEMP_DIR, { recursive: true, force: true });
	});

	test('config command prints JSON payload', () => {
		const result = spawnSync('node', [CLI_SCRIPT, 'config'], {
			encoding: 'utf8',
			cwd: ROOT_DIR,
		});

		expect(result.status).toBe(0);
		const parsed = JSON.parse(result.stdout);
		expect(parsed.slug).toBe(DRY_RUN_VALUES.slug);
	});

	test('value command prints the requested key', () => {
		const result = spawnSync('node', [CLI_SCRIPT, 'value', 'slug'], {
			encoding: 'utf8',
			cwd: ROOT_DIR,
		});

		expect(result.status).toBe(0);
		expect(result.stdout.trim()).toBe(DRY_RUN_VALUES.slug);
	});

	test('files command honours the provided pattern', () => {
		const pattern = 'tests/tmp/dry-run-cli/**/*.txt';
		const result = spawnSync('node', [CLI_SCRIPT, 'files', pattern], {
			encoding: 'utf8',
			cwd: ROOT_DIR,
		});

		expect(result.status).toBe(0);
		expect(result.stdout).toContain('tests/tmp/dry-run-cli/with-vars.txt');
		expect(result.stdout).not.toContain('without-vars.txt');
	});

	test('replace command substitutes mustache variables', () => {
		const templatePath = path.join(CLI_TEMP_DIR, 'replace.txt');
		const result = spawnSync(
			'node',
			[CLI_SCRIPT, 'replace', templatePath],
			{
				encoding: 'utf8',
				cwd: ROOT_DIR,
			}
		);

		expect(result.status).toBe(0);
		expect(result.stdout.trim()).toBe('Name: Example Plugin');
	});

	test('replace command errors when missing file argument', () => {
		const result = spawnSync('node', [CLI_SCRIPT, 'replace'], {
			encoding: 'utf8',
			cwd: ROOT_DIR,
		});

		expect(result.status).toBe(1);
		expect(result.stdout).toContain(
			'Please provide a file path for replacement'
		);
	});
});
