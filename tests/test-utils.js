/**
 * @jest-environment node
 *
 * Test utilities for error handling and logging
 *
 * @package
 */

/**
 * Custom error logger for tests
 */
class TestLogger {
	constructor(testName) {
		this.testName = testName;
		this.errors = [];
		this.warnings = [];
		this.info = [];
	}

	error(message, error) {
		const logEntry = {
			timestamp: new Date().toISOString(),
			level: 'ERROR',
			test: this.testName,
			message,
			error: error
				? {
						message: error.message,
						stack: error.stack,
						code: error.code,
					}
				: null,
		};
		this.errors.push(logEntry);
		// Removed console.error for lint compliance
	}

	warn(message, details) {
		const logEntry = {
			timestamp: new Date().toISOString(),
			level: 'WARN',
			test: this.testName,
			message,
			details,
		};
		this.warnings.push(logEntry);
		// Removed console.warn for lint compliance
	}

	info(message, details) {
		const logEntry = {
			timestamp: new Date().toISOString(),
			level: 'INFO',
			test: this.testName,
			message,
			details,
		};
		this.info.push(logEntry);
		// Removed console.log for lint compliance
	}

	getErrors() {
		return this.errors;
	}

	getWarnings() {
		return this.warnings;
	}

	hasErrors() {
		return this.errors.length > 0;
	}

	hasWarnings() {
		return this.warnings.length > 0;
	}

	getSummary() {
		return {
			test: this.testName,
			errors: this.errors.length,
			warnings: this.warnings.length,
			info: this.info.length,
			logs: {
				errors: this.errors,
				warnings: this.warnings,
				info: this.info,
			},
		};
	}

	clear() {
		this.errors = [];
		this.warnings = [];
		this.info = [];
	}
}

/**
 * Retry a test operation with exponential backoff
 * @param {Function} operation - The async operation to retry
 * @param {Object} [options] - Retry options
 * @param {number} [options.maxRetries]
 * @param {number} [options.initialDelay]
 * @param {number} [options.maxDelay]
 * @param {number} [options.backoffMultiplier]
 * @param {TestLogger} [options.logger]
 * @returns {Promise<*>}
 */
async function retryOperation(operation, options = {}) {
	const {
		maxRetries = 3,
		initialDelay = 1000,
		maxDelay = 5000,
		backoffMultiplier = 2,
		logger = null,
	} = options;

	let lastError;
	let delay = initialDelay;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			if (logger) {
				logger.info(`Attempt ${attempt}/${maxRetries}`);
			}
			return await operation();
		} catch (error) {
			lastError = error;

			if (logger) {
				logger.warn(`Attempt ${attempt} failed: ${error.message}`, {
					attempt,
					error,
				});
			}

			if (attempt < maxRetries) {
				if (logger) {
					logger.info(`Retrying in ${delay}ms`);
				}
				await new Promise((resolve) => setTimeout(resolve, delay));
				delay = Math.min(delay * backoffMultiplier, maxDelay);
			}
		}
	}

	throw new Error(
		`Operation failed after ${maxRetries} attempts: ${lastError.message}`
	);
}

/**
 * Safe file operation wrapper with error handling
 * @param {Function} operation - The file operation to execute
 * @param {Function|null} [errorHandler] - Optional error handler
 * @returns {*}
 */
function safeFileOperation(operation, errorHandler = null) {
	try {
		return operation();
	} catch (error) {
		if (errorHandler) {
			return errorHandler(error);
		}

		// Provide more context for file errors
		if (error.code === 'ENOENT') {
			throw new Error(`File or directory not found: ${error.path}`);
		} else if (error.code === 'EACCES' || error.code === 'EPERM') {
			throw new Error(`Permission denied: ${error.path}`);
		} else if (error.code === 'EEXIST') {
			throw new Error(`File or directory already exists: ${error.path}`);
		}

		throw error;
	}
}

/**
 * Assert with detailed error logging
 * @param {boolean} condition - Assertion condition
 * @param {string} message - Assertion message
 * @param {TestLogger} logger - Logger instance
 * @param {*} details - Additional details
 */
function assertWithLog(condition, message, logger, details) {
	if (!condition) {
		if (logger) {
			logger.error(message, details);
		}
		throw new Error(`Assertion failed: ${message}`);
	}
	if (logger) {
		logger.info(`Assertion passed: ${message}`);
	}
}

/**
 * Measure test execution time
 * @param {Function} fn - Function to execute
 * @param {TestLogger} logger - Logger instance
 * @returns {{result: *, duration: number}}
 */
function measureExecutionTime(fn, logger) {
	const start = Date.now();
	try {
		const result = fn();
		const duration = Date.now() - start;

		if (logger) {
			logger.info(`Execution completed in ${duration}ms`);
		}

		return { result, duration };
	} catch (error) {
		const duration = Date.now() - start;

		if (logger) {
			logger.error(`Execution failed after ${duration}ms`, error);
		}

		throw error;
	}
}

/**
 * Validate test environment
 * @param {Object} requirements - Environment requirements
 * @param {TestLogger} logger - Logger instance
 * @returns {{valid: boolean, issues: string[]}}
 */
function validateTestEnvironment(requirements, logger) {
	const issues = [];

	if (requirements.nodeVersion) {
		const currentVersion = process.version;
		if (!currentVersion.startsWith(`v${requirements.nodeVersion}`)) {
			issues.push(
				`Node version mismatch: expected ${requirements.nodeVersion}, got ${currentVersion}`
			);
		}
	}

	if (requirements.env) {
		Object.entries(requirements.env).forEach(([key, value]) => {
			if (process.env[key] !== value) {
				issues.push(`Environment variable mismatch: ${key}`);
			}
		});
	}

	if (requirements.commands) {
		const { execSync } = require('child_process');
		requirements.commands.forEach((cmd) => {
			try {
				execSync(`command -v ${cmd}`, { stdio: 'pipe' });
			} catch (error) {
				issues.push(`Required command not found: ${cmd}`);
			}
		});
	}

	if (issues.length > 0) {
		if (logger) {
			issues.forEach((issue) => logger.warn(issue));
		}
		return { valid: false, issues };
	}

	if (logger) {
		logger.info('Test environment validation passed');
	}
	return { valid: true, issues: [] };
}

/**
 * Create a test context with cleanup
 * @param {Function} setup - Setup function
 * @param {Function} cleanup - Cleanup function
 * @param {TestLogger} logger - Logger instance
 * @returns {Object}
 */
function createTestContext(setup, cleanup, logger) {
	const context = {
		cleanup: () => {
			try {
				if (cleanup) {
					cleanup();
					if (logger) {
						logger.info('Cleanup completed successfully');
					}
				}
			} catch (error) {
				if (logger) {
					logger.error('Cleanup failed', error);
				}
				throw error;
			}
		},
	};

	try {
		const setupResult = setup();
		if (logger) {
			logger.info('Setup completed successfully');
		}
		return { ...context, ...setupResult };
	} catch (error) {
		if (logger) {
			logger.error('Setup failed', error);
		}
		context.cleanup(); // Attempt cleanup even if setup fails
		throw error;
	}
}

/**
 * Collect test metrics
 */
class TestMetrics {
	constructor() {
		this.metrics = {
			totalTests: 0,
			passedTests: 0,
			failedTests: 0,
			skippedTests: 0,
			totalDuration: 0,
			errors: [],
			warnings: [],
		};
	}

	recordTest(name, status, duration, error = null) {
		this.metrics.totalTests++;
		this.metrics.totalDuration += duration;

		switch (status) {
			case 'passed':
				this.metrics.passedTests++;
				break;
			case 'failed':
				this.metrics.failedTests++;
				if (error) {
					this.metrics.errors.push({
						test: name,
						error: error.message,
					});
				}
				break;
			case 'skipped':
				this.metrics.skippedTests++;
				break;
		}
	}

	recordWarning(test, warning) {
		this.metrics.warnings.push({ test, warning });
	}

	getSummary() {
		return {
			...this.metrics,
			successRate:
				this.metrics.totalTests > 0
					? (
							(this.metrics.passedTests /
								this.metrics.totalTests) *
							100
						).toFixed(2)
					: 0,
			averageDuration:
				this.metrics.totalTests > 0
					? (
							this.metrics.totalDuration / this.metrics.totalTests
						).toFixed(2)
					: 0,
		};
	}

	printSummary() {
		const summary = this.getSummary();
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance
		// Removed console.log for lint compliance

		if (summary.errors.length > 0) {
			// Removed console.log for lint compliance
			summary.errors.forEach(({ test, error }) => {
				// Removed console.log for lint compliance
			});
		}

		if (summary.warnings.length > 0) {
			// Removed console.log for lint compliance
			summary.warnings.forEach(({ test, warning }) => {
				// Removed console.log for lint compliance
			});
		}
	}
}

module.exports = {
	TestLogger,
	retryOperation,
	safeFileOperation,
	assertWithLog,
	measureExecutionTime,
	validateTestEnvironment,
	createTestContext,
	TestMetrics,
};
