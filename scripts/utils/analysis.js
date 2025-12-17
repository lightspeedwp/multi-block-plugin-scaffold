#!/usr/bin/env node

/**
 * Token Counter for Context Reduction
 *
 * Counts tokens in markdown files to measure context size.
 * Uses a simple approximation: ~4 characters per token (GPT-3/4 average).
 *
 * Usage:
 *   node bin/count-tokens.js
 *   node bin/count-tokens.js --path .github/instructions
 *   node bin/count-tokens.js --detailed
 */

const fs = require( 'fs' );
const path = require( 'path' );

// Create logs directory
const logsDir = path.join( __dirname, '../logs' );
if ( ! fs.existsSync( logsDir ) ) {
	fs.mkdirSync( logsDir, { recursive: true } );
}

// Create log file
const timestamp = new Date()
	.toISOString()
	.replace( /:/g, '-' )
	.split( '.' )[ 0 ];
const logFile = path.join( logsDir, `token-count-${ timestamp }.log` );
const logStream = fs.createWriteStream( logFile, { flags: 'a' } );

function log( level, message ) {
	const entry = `[${ new Date().toISOString() }] [${ level }] ${ message }\n`;
	logStream.write( entry );
	process.stdout.write( `${ entry.trim() }\n` );
}

/**
 * Print a raw line to stdout (no formatting)
 *
 * @param {string} message
 */
function printLine( message = '' ) {
	process.stdout.write( `${ message }\n` );
}

log( 'INFO', 'Token counting started' );

// Parse arguments
const args = process.argv.slice( 2 );
const targetPath = args.includes( '--path' )
	? args[ args.indexOf( '--path' ) + 1 ]
	: '.';
const detailed = args.includes( '--detailed' );

// Token estimation (4 chars per token average)
const CHARS_PER_TOKEN = 4;

// Directories to exclude
const EXCLUDE_DIRS = [
	'node_modules',
	'vendor',
	'build',
	'.git',
	'.archive',
	'tmp',
	'logs',
];

/**
 * Count tokens in a string
 *
 * @param {string} text
 * @return {number} Estimated token count.
 */
function countTokens( text ) {
	const matches = text.match( /\{\{[^}]+\}\}/g );
	if ( matches && matches.length > 0 ) {
		return matches.length;
	}
	return Math.ceil( text.length / CHARS_PER_TOKEN );
}

/**
 * Check if path should be excluded
 *
 * @param {string} filePath
 * @return {boolean} True when the path should be excluded from scanning.
 */
function shouldExclude( filePath ) {
	return EXCLUDE_DIRS.some(
		( dir ) =>
			filePath.includes( `/${ dir }/` ) ||
			filePath.includes( `\\${ dir }\\` )
	);
}

/**
 * Get all markdown files recursively
 *
 * @param {string} dir
 * @return {string[]} List of markdown files found under the directory.
 */
function getMarkdownFiles( dir ) {
	const files = [];

	try {
		const items = fs.readdirSync( dir );

		for ( const item of items ) {
			const fullPath = path.join( dir, item );

			if ( shouldExclude( fullPath ) ) {
				continue;
			}

			const stat = fs.statSync( fullPath );

			if ( stat.isDirectory() ) {
				files.push( ...getMarkdownFiles( fullPath ) );
			} else if ( item.endsWith( '.md' ) ) {
				files.push( fullPath );
			}
		}
	} catch ( error ) {
		log( 'ERROR', `Error reading directory ${ dir }: ${ error.message }` );
	}

	return files;
}

/**
 * Analyze markdown file
 *
 * @param {string} filePath
 * @return {Object|null} File metadata or null when analysis fails.
 */
function analyzeFile( filePath, callback ) {
	try {
		const content = fs.readFileSync( filePath, 'utf-8' );
		const tokens = countTokens( content );
		const lines = content.split( '\n' ).length;
		const chars = content.length;

		const result = {
			path: filePath,
			tokens,
			lines,
			chars,
			size: fs.statSync( filePath ).size,
		};

		if ( typeof callback === 'function' ) {
			return callback( content );
		}

		return result;
	} catch ( error ) {
		log( 'ERROR', `Error analyzing ${ filePath }: ${ error.message }` );
		return null;
	}
}

/**
 * Categorize file by directory
 *
 * @param {string} filePath
 * @return {string} Category key for reporting.
 */
function categorizeFile( filePath ) {
	const relative = path.relative( process.cwd(), filePath );

	if ( relative.startsWith( '.github/instructions/' ) ) {
		return 'instructions';
	} else if ( relative.startsWith( '.github/agents/' ) ) {
		return 'agents';
	} else if ( relative.startsWith( '.github/prompts/' ) ) {
		return 'prompts';
	} else if ( relative.startsWith( 'docs/' ) ) {
		return 'docs';
	} else if ( relative.startsWith( 'reports/' ) ) {
		return 'reports';
	} else if (
		relative === 'AGENTS.md' ||
		relative === 'README.md' ||
		relative === 'CONTRIBUTING.md'
	) {
		return 'root';
	}
	return 'other';
}

module.exports = {
	countTokens,
	shouldExclude,
	getMarkdownFiles,
	analyzeFile,
};

// Main execution
const startDir = path.resolve( process.cwd(), targetPath );
log( 'INFO', `Scanning directory: ${ startDir }` );

const files = getMarkdownFiles( startDir );
log( 'INFO', `Found ${ files.length } markdown files` );

const results = files.map( analyzeFile ).filter( ( r ) => r !== null );

// Calculate statistics by category
const categories = {};
results.forEach( ( result ) => {
	const category = categorizeFile( result.path );

	if ( ! categories[ category ] ) {
		categories[ category ] = {
			files: 0,
			tokens: 0,
			lines: 0,
			chars: 0,
		};
	}

	categories[ category ].files++;
	categories[ category ].tokens += result.tokens;
	categories[ category ].lines += result.lines;
	categories[ category ].chars += result.chars;
} );

// Calculate totals
const totals = {
	files: results.length,
	tokens: results.reduce( ( sum, r ) => sum + r.tokens, 0 ),
	lines: results.reduce( ( sum, r ) => sum + r.lines, 0 ),
	chars: results.reduce( ( sum, r ) => sum + r.chars, 0 ),
};

// Output results
printLine( '' );
printLine( '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' );
printLine( '📊 TOKEN COUNT SUMMARY' );
printLine( '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' );
printLine( '' );

printLine( 'Total Statistics:' );
printLine( `  Files:  ${ totals.files.toLocaleString() }` );
printLine( `  Tokens: ${ totals.tokens.toLocaleString() }` );
printLine( `  Lines:  ${ totals.lines.toLocaleString() }` );
printLine( `  Chars:  ${ totals.chars.toLocaleString() }` );
printLine( '' );

printLine( 'By Category:' );
printLine( '┌─────────────────┬────────┬──────────┬─────────┬───────────┐' );
printLine( '│ Category        │ Files  │ Tokens   │ Lines   │ Chars     │' );
printLine( '├─────────────────┼────────┼──────────┼─────────┼───────────┤' );

Object.entries( categories )
	.sort( ( a, b ) => b[ 1 ].tokens - a[ 1 ].tokens )
	.forEach( ( [ category, stats ] ) => {
		const pct = ( ( stats.tokens / totals.tokens ) * 100 ).toFixed( 1 );
		printLine(
			`│ ${ category.padEnd( 15 ) } │ ${ String( stats.files ).padStart(
				6
			) } │ ${ String( stats.tokens.toLocaleString() ).padStart(
				8
			) } │ ${ String( stats.lines.toLocaleString() ).padStart(
				7
			) } │ ${ String( stats.chars.toLocaleString() ).padStart(
				9
			) } │ ${ pct }%`
		);
	} );

printLine( '└─────────────────┴────────┴──────────┴─────────┴───────────┘' );
printLine( '' );

// Detailed output
if ( detailed ) {
	printLine( '' );
	printLine( 'Top 20 Files by Token Count:' );
	printLine(
		'┌────────────────────────────────────────────────────┬──────────┐'
	);
	printLine(
		'│ File                                               │ Tokens   │'
	);
	printLine(
		'├────────────────────────────────────────────────────┼──────────┤'
	);

	results
		.sort( ( a, b ) => b.tokens - a.tokens )
		.slice( 0, 20 )
		.forEach( ( result ) => {
			const relativePath = path.relative( process.cwd(), result.path );
			const displayPath =
				relativePath.length > 50
					? '...' + relativePath.slice( -47 )
					: relativePath;
			printLine(
				`│ ${ displayPath.padEnd( 50 ) } │ ${ String(
					result.tokens.toLocaleString()
				).padStart( 8 ) } │`
			);
		} );

	printLine(
		'└────────────────────────────────────────────────────┴──────────┘'
	);
	printLine( '' );
}

// Log summary
log( 'INFO', `Total files: ${ totals.files }` );
log( 'INFO', `Total tokens: ${ totals.tokens.toLocaleString() }` );
log( 'INFO', `Total lines: ${ totals.lines.toLocaleString() }` );
log( 'INFO', `Total chars: ${ totals.chars.toLocaleString() }` );

Object.entries( categories ).forEach( ( [ category, stats ] ) => {
	log(
		'INFO',
		`${ category }: ${
			stats.files
		} files, ${ stats.tokens.toLocaleString() } tokens`
	);
} );

log( 'INFO', 'Token counting completed' );
log( 'INFO', `Log saved to: ${ logFile }` );

// Write JSON report
const reportDir = path.join( __dirname, '../tmp' );
if ( ! fs.existsSync( reportDir ) ) {
	fs.mkdirSync( reportDir, { recursive: true } );
}

const reportFile = path.join( reportDir, `token-count-${ timestamp }.json` );
fs.writeFileSync(
	reportFile,
	JSON.stringify(
		{
			timestamp: new Date().toISOString(),
			totals,
			categories,
			files: detailed ? results : undefined,
		},
		null,
		2
	)
);

printLine( `📝 Detailed report saved to: ${ reportFile }` );
printLine( '' );

logStream.end();
