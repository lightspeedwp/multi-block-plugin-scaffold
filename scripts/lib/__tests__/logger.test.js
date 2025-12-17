/**
 * Tests for Logger
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const path = require('path');
const fs = require('fs');
const { FileLogger } = require('../logger');

describe('Logger', () => {
       test('writes to dryrun-debug.log in root when category is dryrun-debug', async () => {
	       const logger = new FileLogger('dryrun', 'dryrun-debug');
	       logger.info('Test dryrun-debug root log', { foo: 'bar' });
	       await logger.save();
	       const logPath = path.resolve(__dirname, '../../../dryrun-debug.log');
	       const logContent = fs.readFileSync(logPath, 'utf8');
	       expect(logContent).toMatch(/Test dryrun-debug root log/);
       });
	describe('ensureLogsDirectory', () => {
		test('creates logs directory if it does not exist', () => {
			const logsDir = FileLogger.ensureLogsDirectory();
			expect(logsDir).toBeDefined();
			expect(typeof logsDir).toBe('string');
		});
	});

	describe('createLogEntry', () => {
		test('creates log entry object with all fields', () => {
			const entry = FileLogger.createLogEntry(
				'test-slug',
				'success',
				{ name: 'Test' },
				{ passed: true },
				'/output/path'
			);
			expect(entry).toHaveProperty('timestamp');
			expect(entry).toHaveProperty('slug', 'test-slug');
			expect(entry).toHaveProperty('status', 'success');
			expect(entry).toHaveProperty('variables');
			expect(entry).toHaveProperty('validation');
			expect(entry).toHaveProperty('outputPath', '/output/path');
		});
	});

	test('placeholder - implement full logger test suite', () => {
		expect(true).toBe(true);
		// TODO: Add tests for writeLog()
	});
});
