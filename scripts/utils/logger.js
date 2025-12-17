
#!/usr/bin/env node

/**
 * @file logger.js
 * @description Simple logger utility for console and file logging.
 *
 * Conforms to the logging standards defined in the project documentation,
 * creating date-stamped log files within categorized directories. It supports
 * log levels and can be configured via environment variables:
 * - LOG_LEVEL: (debug, info, warn, error) - Minimum level to log. Default is 'info'.
 * - LOG_TO_CONSOLE: (true, false) - Toggles console output. Default is 'true'.
 *
 * @example
 * const logger = new FileLogger('my-process', 'agents');
 * logger.info('Process starting...');
 * logger.debug('Doing some work.'); // Only logs if LOG_LEVEL is 'debug'
 * await logger.save();
 *
 * @todo Consider consolidating with file-logger.js for unified logging interface.
 */

const fs = require( 'fs/promises' );
const path = require( 'path' );

const LOG_LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

class FileLogger {
	/**
	 * @type {string[]}
	 * @private
	 */
	_logBuffer = [];

	/**
	 * @type {string}
	 * @private
	 */
	_processName;

	/**
	 * @type {string}
	 * @private
	 */
	_category;

	/**
	 * @type {number}
	 * @private
	 */
	_logLevel;

	/**
	 * @type {boolean}
	 * @private
	 */
	_logToConsole;

	/**
	 * Creates a new FileLogger instance.
	 *
	 * @param {string} processName The name of the process, used in the log filename.
	 * @param {string} [category='agents'] The category for the log (e.g., 'agents', 'build').
	 */
	constructor( processName, category = 'agents' ) {
		if ( ! processName ) {
			throw new Error( 'FileLogger requires a processName.' );
		}
		this._processName = processName;
		this._category = category;

		const envLogLevel =
			process.env.LOG_LEVEL?.toLowerCase() || 'info';
		this._logLevel = LOG_LEVELS[ envLogLevel ] ?? LOG_LEVELS.info;
		this._logToConsole = process.env.LOG_TO_CONSOLE !== 'false';
	}

	/**
	 * Adds an INFO level message to the log buffer.
	 * @param {string} message The message to log.
	 */
	info( message ) {
		this._log( 'INFO', message );
	}

	/**
	 * Adds a DEBUG level message to the log buffer.
	 * @param {string} message The message to log.
	 */
	debug( message ) {
		this._log( 'DEBUG', message );
	}

	/**
	 * Adds a WARN level message to the log buffer.
	 * @param {string} message The message to log.
	 */
	warn( message ) {
		this._log( 'WARN', message );
	}

	/**
	 * Adds an ERROR level message to the log buffer.
	 * @param {string} message The message to log.
	 */
	error( message ) {
		this._log( 'ERROR', message );
	}

	/**
	 * Formats and adds a message to the internal log buffer.
	 * @param {'INFO' | 'DEBUG' | 'WARN' | 'ERROR'} level The log level.
	 * @param {string} message The log message.
	 * @private
	 */
	_log( level, message ) {
		const numericLevel = LOG_LEVELS[ level.toLowerCase() ];
		if ( numericLevel < this._logLevel ) {
			return;
		}

		const timestamp = new Date().toISOString();
		const formattedMessage = `[${ timestamp }] [${ level }] ${ message }`;
		this._logBuffer.push( formattedMessage );

		if ( this._logToConsole ) {
			const consoleMethod =
				level === 'ERROR'
					? console.error
					: level === 'WARN' ? console.warn : console.log;
			consoleMethod( formattedMessage );
		}
	}

	/**
	 * Generates the full path for the log file.
	 * @returns {string} The absolute path for the log file.
	 * @private
	 */
	_getLogRootDir() {
		// Allow override via LOG_DIR env
		// Special case: dry-run logs go to logs/dry-run/
		if (this._category === 'dry-run') {
			return path.resolve(process.cwd(), 'logs', 'dry-run');
		}
		return process.env.LOG_DIR
			? path.resolve(process.env.LOG_DIR)
			: path.resolve(process.cwd(), 'logs');
	}

	_getLogFilePath() {
		const date = new Date().toISOString().split( 'T' )[ 0 ]; // YYYY-MM-DD
		const filename = `${ date }-${ this._processName }.log`;
		return path.resolve( this._getLogRootDir(), this._category, filename );
	}

	/**
	 * Asynchronously saves all buffered log messages to the log file.
	 */
	async save() {
		if ( this._logBuffer.length === 0 ) {
			return;
		}

		const filePath = this._getLogFilePath();
		const logDir = path.dirname( filePath );

		try {
			await fs.mkdir( logDir, { recursive: true } );
			// Log rotation: delete logs older than retention days
			await this._rotateLogs(logDir);
			const logContent = this._logBuffer.join( '\n' ) + '\n';
			await fs.writeFile( filePath, logContent, { flag: 'a' } );
			this._logBuffer = [];
		} catch ( err ) {
			console.error( `[FATAL] Failed to write log file to ${ filePath }`, err );
		}
	}

	/**
	 * Deletes log files older than LOG_RETENTION_DAYS (default 30) in the log directory.
	 * @private
	 */
	async _rotateLogs(logDir) {
		const retentionDays = parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30;
		const now = Date.now();
		try {
			const files = await fs.readdir(logDir);
			for (const file of files) {
				if (!file.endsWith('.log')) continue;
				const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
				if (!match) continue;
				const fileDate = new Date(match[1]);
				if (isNaN(fileDate)) continue;
				const ageDays = (now - fileDate.getTime()) / (1000 * 60 * 60 * 24);
				if (ageDays > retentionDays) {
					try {
						await fs.unlink(path.join(logDir, file));
					} catch (err) {
						// Ignore errors deleting old logs
					}
				}
			}
		} catch (err) {
			// Ignore errors reading log dir
		}
	}
}

module.exports = FileLogger;
