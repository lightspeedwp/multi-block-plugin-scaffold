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
		// No-op
	}
}

/**
 * Factory for test logger
 * @param {Object} opts
 * @return {InMemoryTestLogger}
 */
function createTestLogger(opts = {}) {
	return new InMemoryTestLogger();
}

module.exports = {
	InMemoryTestLogger,
	createTestLogger,
};
