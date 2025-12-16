/**
 * Logger Module for Theme Generation
 *
 * Provides JSON-formatted logging for theme generation tracking and debugging.
 * Logs are stored per-project at logs/generate-theme-{slug}.log
 */

const fs = require('fs');
const path = require('path');

/**
 * Ensure logs directory exists
 * Creates the directory if it doesn't exist
 * @returns {string} Path to logs directory
 */
function ensureLogsDirectory() {
	const logsDir = path.resolve(__dirname, '../../logs');
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
	return logsDir;
}

/**
 * Create a log entry object
 *
 * @param {string} slug - Theme slug
 * @param {string} status - Generation status: 'started', 'success', or 'failure'
 * @param {Object} variables - All mustache variables used in generation
 * @param {Object} validation - Validation results { passed: boolean, errors: [], warnings: [] }
 * @param {string} outputPath - Path where theme was generated
 * @param {string|null} error - Error message if status is 'failure'
 * @returns {Object} Log entry object
 */
function createLogEntry(slug, status, variables, validation, outputPath, error = null) {
	return {
		timestamp: new Date().toISOString(),
		slug,
		status,
		variables,
		validation,
		outputPath,
		error,
	};
}

/**
 * Write log entry to file
 * Appends to existing log file or creates new one
 *
 * @param {string} slug - Theme slug (used in filename)
 * @param {Object} logEntry - Log entry object from createLogEntry()
 */
function writeLog(slug, logEntry) {
	const logsDir = ensureLogsDirectory();
	const logFile = path.join(logsDir, `generate-theme-${slug}.log`);

	// Write as single-line JSON for easy parsing
	const logLine = JSON.stringify(logEntry) + '\n';

	try {
		fs.appendFileSync(logFile, logLine, 'utf8');
	} catch (error) {
		// If logging fails, warn but don't crash the generation
		console.warn(
			`⚠️  Warning: Failed to write log file: ${error.message}`
		);
	}
}

module.exports = {
	ensureLogsDirectory,
	createLogEntry,
	writeLog,
};
