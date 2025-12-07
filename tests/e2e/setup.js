/**
 * E2E test setup with logging
 *
 * @package {{namespace}}
 */

/* eslint-disable no-console */

const fs = require( 'fs' );
const path = require( 'path' );

// Create logs directory
const logsDir = path.join( __dirname, '../../logs' );
if ( ! fs.existsSync( logsDir ) ) {
	fs.mkdirSync( logsDir, { recursive: true } );
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace( /:/g, '-' ).split( '.' )[ 0 ];
const logFile = path.join( logsDir, `test-e2e-${ timestamp }.log` );
const logStream = fs.createWriteStream( logFile, { flags: 'a' } );

/**
 * Log function for E2E tests
 *
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG, TRACE)
 * @param {string} message - Log message
 */
function e2eLog( level, message ) {
	const entry = `[${ new Date().toISOString() }] [${ level }] ${ message }\n`;
	logStream.write( entry );
	console.log( entry.trim() );
}

// Log at start
e2eLog( 'INFO', 'E2E test suite starting' );
e2eLog( 'INFO', `Node version: ${ process.version }` );
e2eLog( 'INFO', `Working directory: ${ process.cwd() }` );
e2eLog( 'INFO', `Log file: ${ logFile }` );

// Cleanup on exit
process.on( 'exit', () => {
	e2eLog( 'INFO', 'E2E test suite completed' );
	logStream.end();
} );

// Export log function
module.exports = { e2eLog };
