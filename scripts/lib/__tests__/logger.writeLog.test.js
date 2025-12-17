/**
 * Tests for logger.writeLog()
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { FileLogger } = require('../logger');


describe('Logger.writeLog', () => {
	const testSlug = 'test-logger';
	const logsDir = FileLogger.ensureLogsDirectory();
	const logFile = path.join(logsDir, `generate-theme-${testSlug}.log`);

	afterEach(() => {
		// Clean up log file after each test
		if (fs.existsSync(logFile)) {
			fs.unlinkSync(logFile);
		}
	});

	       test('writes a log entry to file', () => {
		       const entry = FileLogger.createLogEntry(
			       testSlug,
			       'success',
			       { foo: 'bar' },
			       { passed: true },
			       '/output/path'
		       );
		       logger.writeLog(testSlug, entry);
		       const content = fs.readFileSync(logFile, 'utf8');
		       const lines = content.trim().split('\n');
		       const parsed = JSON.parse(lines[0]);
		       expect(parsed.slug).toBe(testSlug);
		       expect(parsed.status).toBe('success');
		       expect(parsed.variables.foo).toBe('bar');
		       expect(parsed.outputPath).toBe('/output/path');
	       });

	       test('appends multiple log entries', () => {
		       const entry1 = FileLogger.createLogEntry(testSlug, 'started', {}, {}, '/foo');
		       const entry2 = FileLogger.createLogEntry(testSlug, 'success', {}, {}, '/bar');
		       logger.writeLog(testSlug, entry1);
		       logger.writeLog(testSlug, entry2);
		       const content = fs.readFileSync(logFile, 'utf8');
		       const lines = content.trim().split('\n');
		       expect(lines.length).toBe(2);
		       const parsed2 = JSON.parse(lines[1]);
		       expect(parsed2.status).toBe('success');
		       // Timestamps should be ISO strings
		       expect(new Date(parsed2.timestamp).toISOString()).toBe(parsed2.timestamp);
	       });

	       test('does not throw if log directory is missing', () => {
		       // Remove logs dir if exists
		       if (fs.existsSync(logsDir)) {
			       fs.rmdirSync(logsDir, { recursive: true });
		       }
		       const entry = FileLogger.createLogEntry(testSlug, 'started', {}, {}, '/foo');
		       expect(() => logger.writeLog(testSlug, entry)).not.toThrow();
		       // Should recreate logs dir and file
		       expect(fs.existsSync(logFile)).toBe(true);
	       });
});
