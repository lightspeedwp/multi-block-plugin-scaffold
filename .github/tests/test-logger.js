/**
 * Test Logger
 *
 * Provides in-memory logging for Jest tests and file-based logging for E2E/integration tests.
 *
 * Special: If you pass { inMemory: false, category: 'dryrun-debug' }, logs will be written to dryrun-debug.log in the project root.
 *
 * @package multi-block-plugin-scaffold
 */

/**
 * In-memory test logger for Jest unit tests
 */
class InMemoryTestLogger {
	constructor() {
		this.logs = [];
	}

	/**
	 * Log info message
	 * @param {string} message
	 * @param {Object} data
	 */
	info(message, data = {}) {
		this.logs.push({ level: 'INFO', message, data, timestamp: new Date().toISOString() });
	}

	/**
	 * Log debug message
	 * @param {string} message
	 * @param {Object} data
	 */
	debug(message, data = {}) {
		this.logs.push({ level: 'DEBUG', message, data, timestamp: new Date().toISOString() });
	}

	/**
	 * Log error message
	 * @param {string} message
	 * @param {Object} data
	 */
	error(message, data = {}) {
		this.logs.push({ level: 'ERROR', message, data, timestamp: new Date().toISOString() });
	}

	/**
	 * Log warning message
	 * @param {string} message
	 * @param {Object} data
	 */
	warn(message, data = {}) {
		this.logs.push({ level: 'WARN', message, data, timestamp: new Date().toISOString() });
	}

	/**
	 * Get all logs
	 * @return {Array} All logged messages
	 */
	getLogs() {
		return this.logs;
	}

	/**
	 * Get logs by level
	 * @param {string} level
	 * @return {Array} Logs matching the level
	 */
	getLogsByLevel(level) {
		return this.logs.filter(log => log.level === level.toUpperCase());
	}

	/**
	 * Clear all logs
	 */
	clear() {
		this.logs = [];
	}

	/**
	 * Mock save method (no-op for in-memory logger)
	 * @return {Promise<void>}
	 */
	async save() {
		// No-op for in-memory logger
		return Promise.resolve();
	}
}

/**
 * File-based test logger for E2E/integration tests
 * Uses the production FileLogger from scripts/lib/logger.js
 */
const { FileLogger } = require('../../scripts/lib/logger');

/**
 * Factory function to create appropriate logger for test context
 *
 * @param {string} processName - Name of the test process
 * @param {Object} options - Logger options
 * @param {boolean} options.inMemory - Use in-memory logger (default: true for Jest)
 * @param {string} options.category - Category for file-based logger
 * @return {InMemoryTestLogger|FileLogger} Appropriate logger instance
 */
function createTestLogger(processName, options = {}) {
       const { inMemory = true, category = 'tests' } = options;

       if (inMemory) {
	       return new InMemoryTestLogger();
       }

       // If category is 'dryrun-debug', FileLogger will write to dryrun-debug.log in root
       return new FileLogger(processName, category);
}

module.exports = {
	InMemoryTestLogger,
	createTestLogger,
	FileLogger,
};
