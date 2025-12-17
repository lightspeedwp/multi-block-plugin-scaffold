/**
 * @file File-based Logger Module
 * @description Provides a class-based logger that buffers messages and writes them to categorized,
 * date-stamped log files. This is ideal for tracking the execution of scripts and agents.
 *
 * This module supports environment variables for configuration:
 * - `MBPS_LOG_DIR`: Overrides the default log directory (`/logs`).
 * - `MBPS_LOG_LEVEL`: Sets the minimum log level to record (e.g., INFO, WARN, ERROR, DEBUG). Default: INFO.
 */

const fs = require('fs');
const path = require('path');

/**
 * The default directory for log files, resolved relative to the current file.
 * @type {string}
 */
const DEFAULT_LOG_DIR = path.resolve(__dirname, '../../logs');
/**
 * The directory to store log files. This can be overridden by the `MBPS_LOG_DIR` environment variable.
 * @type {string}
 */
const LOG_DIR = process.env.MBPS_LOG_DIR
	? path.resolve(process.env.MBPS_LOG_DIR)
	: DEFAULT_LOG_DIR;

/**
 * A map of log level names to their numeric severity values.
 * Lower numbers indicate lower severity.
 * @constant
 * @type {Object<string, number>}
 */
const LOG_LEVELS = {
	DEBUG: 10,
	INFO: 20,
	WARN: 30,
	ERROR: 40,
};

/**
 * The current logging level, controllable via the `MBPS_LOG_LEVEL` environment variable.
 * Defaults to 'INFO'.
 * @type {number}
 */
const CURRENT_LOG_LEVEL =
	LOG_LEVELS[process.env.MBPS_LOG_LEVEL?.toUpperCase()] || LOG_LEVELS.INFO;

/**
 * A logger that buffers messages and writes them to a file.
 */
class FileLogger {
		/**
		 * Ensures the logs directory exists and returns its path.
		 * @returns {string} The path to the logs directory.
		 */
		static ensureLogsDirectory() {
			const dir = LOG_DIR;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			return dir;
		}

		/**
		 * Creates a log entry object with standard fields.
		 * @param {string} slug
		 * @param {string} status
		 * @param {Object} variables
		 * @param {Object} validation
		 * @param {string} outputPath
		 * @returns {Object} Log entry object
		 */
		static createLogEntry(slug, status, variables, validation, outputPath) {
			return {
				timestamp: new Date().toISOString(),
				slug,
				status,
				variables,
				validation,
				outputPath,
			};
		}
	/**
	 * Creates an instance of FileLogger.
	 * @param {string} processName - The name of the process being logged (e.g., 'generate-plugin-agent').
	 * @param {string} [category='default'] - The category for the log file (e.g., 'agents', 'scripts').
	 */
	constructor(processName, category = 'default') {
		this.processName = processName;
		this.category = category;
		this.buffer = [];
		   // Special case: if category is 'dryrun-debug', log to project root
		   if (this.category === 'dryrun-debug') {
			   this.logDir = path.resolve(__dirname, '../../');
			   this.logFileName = 'dryrun-debug.log';
		   } else {
			   this.logDir = path.join(LOG_DIR, this.category);
			   this.logFileName = null;
		   }
	}

	/**
	 * Logs a message with the 'INFO' level.
	 * @param {string} message - The message to log.
	 * @param {Object} [data={}] - Additional structured data.
	 */
	info(message, data = {}) {
		this._log('INFO', message, data);
	}

	/**
	 * Logs a message with the 'DEBUG' level.
	 * @param {string} message - The message to log.
	 * @param {Object} [data={}] - Additional structured data.
	 */
	debug(message, data = {}) {
		this._log('DEBUG', message, data);
	}

	/**
	 * Logs a message with the 'ERROR' level.
	 * @param {string} message - The message to log.
	 * @param {Object} [data={}] - Additional structured data.
	 */
	error(message, data = {}) {
		this._log('ERROR', message, data);
	}

	/**
	 * Saves all buffered log messages to the log file.
	 * @returns {Promise<void>}
	 */
	async save() {
		if (this.buffer.length === 0) {
			return;
		}

		   try {
			   await fs.promises.mkdir(this.logDir, { recursive: true });

			   let logFile;
			   if (this.logFileName) {
				   logFile = path.join(this.logDir, this.logFileName);
			   } else {
				   const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
				   logFile = path.join(
					   this.logDir,
					   `${date}-${this.processName}.log`
				   );
			   }

			   const logContent =
				   this.buffer.map((entry) => JSON.stringify(entry)).join('\n') +
				   '\n';

			   await fs.promises.appendFile(logFile, logContent, 'utf8');
			   this.buffer = []; // Clear buffer after saving
		   } catch (err) {
			   console.error('FATAL: Failed to save log file.', err);
		   }
	}

	/**
	 * Internal method to create and buffer a log entry.
	 * @private
	 * @param {string} level - The log level.
	 * @param {string} message - The log message.
	 * @param {Object} data - Additional data.
	 */
	_log(level, message, data) {
		const numericLevel = LOG_LEVELS[level.toUpperCase()];
		if (!numericLevel || numericLevel < CURRENT_LOG_LEVEL) {
			return;
		}

		this.buffer.push({
			timestamp: new Date().toISOString(),
			level,
			message,
			...data,
		});

		// Also print to console for immediate feedback
		const consoleMessage = `[${level}] ${message}`;
		if (level.toUpperCase() === 'ERROR') {
			console.error(consoleMessage);
		} else {
			console.log(consoleMessage);
		}
	}
}

module.exports = {
	FileLogger,
};
