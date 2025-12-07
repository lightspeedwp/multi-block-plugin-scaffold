/**
 * Jest setup file for {{name}}.
 *
 * @package {{namespace}}
 */

/* eslint-env jest, node */
/* eslint-disable no-console */

const fs = require( 'fs' );
const path = require( 'path' );

// Create logs directory
const logsDir = path.join( __dirname, '../logs' );
if ( ! fs.existsSync( logsDir ) ) {
	fs.mkdirSync( logsDir, { recursive: true } );
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace( /:/g, '-' ).split( '.' )[ 0 ];
const logFile = path.join( logsDir, `test-unit-${ timestamp }.log` );
const logStream = fs.createWriteStream( logFile, { flags: 'a' } );

/**
 * Log function for tests
 *
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG, TRACE)
 * @param {string} message - Log message
 */
function testLog( level, message ) {
	const entry = `[${ new Date().toISOString() }] [${ level }] ${ message }\n`;
	logStream.write( entry );
	console.log( entry.trim() );
}

// Make globally available
global.testLog = testLog;

// Log at start
beforeAll( () => {
	testLog( 'INFO', 'Jest test suite starting' );
	testLog( 'INFO', `Node version: ${ process.version }` );
	testLog( 'INFO', `Working directory: ${ process.cwd() }` );
	testLog( 'INFO', `Log file: ${ logFile }` );
} );

// Log at end and close
afterAll( () => {
	testLog( 'INFO', 'Jest test suite completed' );
	logStream.end();
} );

// Mock WordPress globals.
global.wp = {
	blocks: {
		registerBlockType: jest.fn(),
	},
	i18n: {
		__: ( str ) => str,
		_x: ( str ) => str,
		sprintf: ( str, ...args ) => str.replace( /%s/g, () => args.shift() ),
	},
	element: {
		createElement: jest.fn(),
		useState: jest.fn( ( initial ) => [ initial, jest.fn() ] ),
		useEffect: jest.fn(),
		useCallback: jest.fn( ( fn ) => fn ),
		useRef: jest.fn( () => ( { current: null } ) ),
		useMemo: jest.fn( ( fn ) => fn() ),
	},
	data: {
		useSelect: jest.fn( () => ( {} ) ),
		useDispatch: jest.fn( () => ( {} ) ),
	},
	blockEditor: {
		useBlockProps: jest.fn( ( props ) => props ),
		InspectorControls: jest.fn( ( { children } ) => children ),
	},
	components: {
		PanelBody: jest.fn( ( { children } ) => children ),
		ToggleControl: jest.fn(),
		RangeControl: jest.fn(),
		SelectControl: jest.fn(),
		TextControl: jest.fn(),
		Button: jest.fn(),
		Spinner: jest.fn(),
	},
};

// Mock @wordpress packages.
jest.mock( '@wordpress/blocks', () => global.wp.blocks );
jest.mock( '@wordpress/i18n', () => global.wp.i18n );
jest.mock( '@wordpress/element', () => global.wp.element );
jest.mock( '@wordpress/data', () => global.wp.data );
jest.mock( '@wordpress/block-editor', () => global.wp.blockEditor );
jest.mock( '@wordpress/components', () => global.wp.components );
