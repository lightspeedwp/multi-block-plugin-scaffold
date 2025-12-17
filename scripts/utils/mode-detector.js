/**
 * scripts/lib/mode-detector.js
 *
 * Unified mode detection and routing for generate-theme.js
 * Detects how the script is being invoked and routes to appropriate handler
 *
 * Supported modes:
 * - CLI mode: Direct CLI arguments (--slug, --name, etc.)
 * - JSON config mode: --config path/to/config.json
 * - JSON stdin mode: echo '{}' | generate-theme.js --json
 * - Validate mode: --validate '{}' (validates config without generating)
 * - Schema mode: --schema (outputs config schema)
 * - Help mode: --help (outputs usage information)
 *
 * @module mode-detector
 */

/**
 * Parse command-line arguments into key-value pairs
 *
 * @param {string[]} args - Process argv.slice(2)
 * @return {Object} Parsed arguments map
 */
function parseArguments( args ) {
	const argMap = {};
	for ( let i = 0; i < args.length; i++ ) {
		if ( args[ i ].startsWith( '--' ) ) {
			const key = args[ i ].replace( '--', '' );
			const value = args[ i + 1 ];
			if ( value && ! value.startsWith( '--' ) ) {
				argMap[ key ] = value;
				i++;
			} else {
				argMap[ key ] = true;
			}
		}
	}
	return argMap;
}

/**
 * Detect which mode the script is being run in
 *
 * @param {string[]} args     - Process argv.slice(2)
 * @param {boolean}  hasStdin - Whether stdin is available (piped data)
 * @return {string} Mode name: 'help', 'schema', 'validate', 'json-stdin', 'json-config', or 'cli'
 */
function detectMode( args, hasStdin = false ) {
	// Help takes priority
	if ( args.includes( '--help' ) || args.includes( '-h' ) ) {
		return 'help';
	}

	// Schema output
	if ( args.includes( '--schema' ) ) {
		return 'schema';
	}

	// Validate mode
	const validateIndex = args.indexOf( '--validate' );
	if ( validateIndex !== -1 ) {
		return 'validate';
	}

	// JSON stdin mode
	if ( args.includes( '--json' ) && hasStdin ) {
		return 'json-stdin';
	}

	// JSON config file mode
	const argMap = parseArguments( args );
	if ( argMap.config ) {
		return 'json-config';
	}

	// Default to CLI mode
	return 'cli';
}

/**
 * Check if mode requires stdin input
 *
 * @param {string} mode - Mode name
 * @return {boolean} True if mode expects stdin
 */
function requiresStdin( mode ) {
	return mode === 'json-stdin' || mode === 'validate';
}

/**
 * Get mode description and usage
 *
 * @param {string} mode - Mode name
 * @return {string} Description of the mode
 */
function getModeDescription( mode ) {
	const descriptions = {
		help: 'Show help message and usage examples',
		schema: 'Output configuration schema as JSON',
		validate: 'Validate provided JSON configuration',
		'json-stdin':
			'Read configuration from stdin and generate theme with JSON input',
		'json-config': 'Read configuration from JSON file and generate theme',
		cli: 'Generate theme using CLI arguments (--slug, --name, etc.)',
	};
	return descriptions[ mode ] || 'Unknown mode';
}

/**
 * Validate that provided arguments are appropriate for the detected mode
 *
 * @param {string} mode   - Detected mode
 * @param {Object} argMap - Parsed arguments
 * @return {Object} Validation result: { valid: boolean, error: string|null }
 */
function validateModeArguments( mode, argMap ) {
	switch ( mode ) {
		case 'validate':
			if ( ! argMap.validate ) {
				return {
					valid: false,
					error: '--validate requires a JSON argument',
				};
			}
			return { valid: true };

		case 'json-config':
			if ( ! argMap.config ) {
				return {
					valid: false,
					error: 'Config file path is required',
				};
			}
			return { valid: true };

		case 'json-stdin':
			// No specific argument validation needed
			return { valid: true };

		case 'cli':
			// CLI mode validates that required fields will be present
			return { valid: true };

		case 'help':
		case 'schema':
			// These modes don't need arguments
			return { valid: true };

		default:
			return { valid: false, error: `Unknown mode: ${ mode }` };
	}
}

/**
 * Format mode information for logging/debugging
 *
 * @param {string} mode   - Mode name
 * @param {Object} argMap - Parsed arguments
 * @return {string} Formatted mode info
 */
function formatModeInfo( mode, argMap ) {
	const info = [
		`Mode: ${ mode }`,
		`Description: ${ getModeDescription( mode ) }`,
	];

	if ( Object.keys( argMap ).length > 0 ) {
		const relevantArgs = Object.entries( argMap )
			.filter( ( [ key ] ) => key !== 'help' && key !== 'h' )
			.map(
				( [ key, val ] ) =>
					`--${ key }${ val === true ? '' : ` ${ val }` }`
			)
			.join( ', ' );
		if ( relevantArgs ) {
			info.push( `Arguments: ${ relevantArgs }` );
		}
	}

	return info.join( '\n' );
}

// Export for use in other scripts
module.exports = {
	parseArguments,
	detectMode,
	requiresStdin,
	getModeDescription,
	validateModeArguments,
	formatModeInfo,
};

// If run directly, show mode examples
if ( require.main === module ) {
	// console.log('Mode Detection Examples:\n');
	// console.log('1. Help:');
	// console.log('   node generate-theme.js --help\n');
	//
	// console.log('2. Schema:');
	// console.log('   node generate-theme.js --schema\n');
	//
	// console.log('3. Validate JSON:');
	// console.log(
	//     '   echo \'{"slug":"test"}\' | node generate-theme.js --validate\n'
	// );
	//
	// console.log('4. JSON Config File:');
	// console.log('   node generate-theme.js --config theme-config.json\n');
	//
	// console.log('5. JSON Stdin:');
	// console.log(
	//     '   echo \'{"slug":"my-theme","name":"My Theme"}\' | node generate-theme.js --json\n'
	// );
	//
	// console.log('6. CLI Arguments:');
	// console.log(
	//     '   node generate-theme.js --slug my-theme --name "My Theme" --author "Your Name"\n'
	// );
	//
	// // Test mode detection
	// console.log('Mode Detection Tests:\n');
	// const testCases = [
	//     { args: ['--help'], expected: 'help' },
	//     { args: ['--schema'], expected: 'schema' },
	//     { args: ['--validate', '{}'], expected: 'validate' },
	//     { args: ['--config', 'config.json'], expected: 'json-config' },
	//     { args: ['--json'], expected: 'cli' }, // Would be json-stdin if stdin available
	//     { args: ['--slug', 'test'], expected: 'cli' },
	//     { args: [], expected: 'cli' },
	// ];
	//
	// testCases.forEach(({ args, expected }) => {
	//     const mode = detectMode(args, false);
	//     const status = mode === expected ? '✓' : '✗';
	//     console.log(`${status} ${JSON.stringify(args)} -> ${mode}`);
	// });
}
