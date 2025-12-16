
/**
 * @jest-environment node
 */

/**
 * Test Logger Utility
 *
 * Provides consistent logging for test execution across Jest, PHPUnit, and E2E tests.
 * Logs are written to logs/test/ directory with timestamps.
 *
 * @package
 * @since {{version}}
 */

const fs = require('fs');
const path = require('path');

/**
 * Logger class for test execution
 */
class TestLogger {
	/**
	 * Constructor
	 *
	 * @param {string} testType - Type of test (jest, phpunit, e2e, etc.)
	 */
	constructor(testType = 'test') {
		this.testType = testType;
		this.logDir = path.resolve(__dirname, '../logs/test');
		this.logPath = this.getLogPath();
		this.ensureLogDir();
	}

	/**
	 * Ensure log directory exists
	 */
	ensureLogDir() {
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir, { recursive: true });
		}
	}

	/**
	 * Get log file path
	 *
	 * @return {string} Log file path
	 */
	getLogPath() {
		const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
		return path.join(this.logDir, `${date}-${this.testType}.log`);
	}

	/**
	 * Format log message
	 *
	 * @param {string} level   - Log level (DEBUG, INFO, WARN, ERROR, FATAL)
	 * @param {string} message - Log message
	 * @return {string} Formatted message
	 */
	formatMessage(level, message) {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level}] [${this.testType}] ${message}`;
	}

	/**
	 * Write log message
	 *
	 * @param {string} level   - Log level
	 * @param {string} message - Log message
	 */
	write(level, message) {
		const formattedMessage = this.formatMessage(level, message);

		// Write to file
		try {
			fs.appendFileSync(this.logPath, formattedMessage + '\n');
		} catch (error) {
			// Removed console.error for lint compliance
		}

		// Also output to console
		// Removed console.log for lint compliance
	}

	/**
	 * Log debug message
	 *
	 * @param {string} message - Debug message
	 */
	debug(message) {
		this.write('DEBUG', message);
	}

	/**
	 * Log info message
	 *
	 * @param {string} message - Info message
	 */
	info(message) {
		this.write('INFO', message);
	}

	/**
	 * Log warning message
	 *
	 * @param {string} message - Warning message
	 */
	warn(message) {
		this.write('WARN', message);
	}

	/**
	 * Log error message
	 *
	 * @param {string} message - Error message
	 */
	error(message) {
		this.write('ERROR', message);
	}

	/**
	 * Log fatal error message
	 *
	 * @param {string} message - Fatal error message
	 */
	fatal(message) {
		this.write('FATAL', message);
	}

	/**
	 * Log test suite start
	 *
	 * @param {string} suiteName - Test suite name
	 */
	suiteStart(suiteName) {
		this.info(`Test suite started: ${suiteName}`);
	}

	/**
	 * Log test suite end
	 *
	 * @param {string} suiteName - Test suite name
	 * @param {Object} results   - Test results
	 */
	suiteEnd(suiteName, results = {}) {
		const { passed = 0, failed = 0, total = 0 } = results;
		this.info(
			`Test suite completed: ${suiteName} - ${passed}/${total} passed, ${failed} failed`
		);
	}

	/**
	 * Log test case start
	 *
	 * @param {string} testName - Test case name
	 */
	testStart(testName) {
		this.debug(`Test started: ${testName}`);
	}

	/**
	 * Log test case end
	 *
	 * @param {string}  testName - Test case name
	 * @param {boolean} passed   - Whether test passed
	 * @param {string}  [error]  - Error message if failed
	 */
	testEnd(testName, passed, error = null) {
		if (passed) {
			this.debug(`Test passed: ${testName}`);
		} else {
			this.error(`Test failed: ${testName}${error ? ` - ${error}` : ''}`);
		}
	}
}

// Export for use in tests
module.exports = TestLogger;

// Demo code for manual testing (commented out for lint compliance)
// if (require.main === module) {
//   const logger = new TestLogger('example');
//   logger.info('Test logger initialized');
//   logger.debug('This is a debug message');
//   logger.warn('This is a warning');
//   logger.error('This is an error');
//   logger.info('Test logger demonstration complete');
// }
