/**
 * Tests for mode-detector.js
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const modeDetector = require('../mode-detector');

describe('Mode Detector', () => {
	test('parseArgs detects --help', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--help']);
		expect(result.mode).toBe('help');
	});

	test('parseArgs detects --schema', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--schema']);
		expect(result.mode).toBe('schema');
	});

	test('parseArgs detects --validate with file', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--validate', 'foo.json']);
		expect(result.mode).toBe('validate');
		expect(result.config).toBe('foo.json');
	});

	test('parseArgs detects --config', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--config', 'bar.json']);
		expect(result.mode).toBe('json');
		expect(result.config).toBe('bar.json');
	});

	test('parseArgs detects --json', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--json']);
		expect(result.mode).toBe('json-stdin');
		expect(result.flags.json).toBe(true);
	});

	test('parseArgs detects --output', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--output', 'dist']);
		expect(result.flags.output).toBe('dist');
	});

	test('parseArgs detects --dry-run', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--dry-run']);
		expect(result.flags.dryRun).toBe(true);
	});

	test('parseArgs detects --verbose', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--verbose']);
		expect(result.flags.verbose).toBe(true);
	});

	test('parseArgs detects --force', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--force']);
		expect(result.flags.force).toBe(true);
	});

	test('parseArgs detects unknown flag', () => {
		const result = modeDetector.parseArgs(['node', 'script.js', '--custom', 'val']);
		expect(result.flags.custom).toBe('val');
	});

	test('getModeDescription returns correct description', () => {
		const desc = modeDetector.getModeDescription('json');
		expect(desc).toMatch(/JSON configuration/);
	});
});
