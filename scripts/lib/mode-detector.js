/* eslint-disable no-console */
/**
 * Mode Detector
 *
 * Detects which mode the plugin generator should run in:
 * - Interactive: User answers prompts step-by-step
 * - JSON: Configuration provided via file or stdin
 * - Validate: Just validate a configuration
 * - CLI: Configuration provided via command-line arguments
 */

/**
 * Parse command-line arguments
 *
 * @param {Array} argv - Process argv (defaults to process.argv)
 * @return {Object} Parsed arguments { mode, config, flags }
 */
function parseArgs(argv = process.argv) {
	const args = argv.slice(2);
	const flags = {};
	let mode = 'interactive';
	let config = null;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		// Help flag
		if (arg === '--help' || arg === '-h') {
			mode = 'help';
			break;
		}

		// Schema flag
		if (arg === '--schema') {
			mode = 'schema';
			break;
		}

		// Validate mode
		if (arg === '--validate') {
			mode = 'validate';
			if (args[i + 1] && !args[i + 1].startsWith('--')) {
				config = args[i + 1];
				i++;
			}
			continue;
		}

		// Config file mode
		if (arg === '--config' || arg === '-c') {
			mode = 'json';
			if (args[i + 1] && !args[i + 1].startsWith('--')) {
				config = args[i + 1];
				i++;
			}
			continue;
		}

		// JSON mode (stdin)
		if (arg === '--json') {
			mode = 'json-stdin';
			flags.json = true;
			continue;
		}

		// Output directory
		if (arg === '--output' || arg === '-o') {
			if (args[i + 1] && !args[i + 1].startsWith('--')) {
				flags.output = args[i + 1];
				i++;
			}
			continue;
		}

		// Dry run flag
		if (arg === '--dry-run') {
			flags.dryRun = true;
			continue;
		}

		// Verbose flag
		if (arg === '--verbose' || arg === '-v') {
			flags.verbose = true;
			continue;
		}

		// Force flag
		if (arg === '--force' || arg === '-f') {
			flags.force = true;
			continue;
		}

		// Other flags
		if (arg.startsWith('--')) {
			const key = arg
				.slice(2)
				.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
			if (args[i + 1] && !args[i + 1].startsWith('--')) {
				flags[key] = args[i + 1];
				i++;
			} else {
				flags[key] = true;
			}
		}
	}

	return { mode, config, flags };
}

/**
 * Detect if stdin has data (for piped input)
 *
 * @return {boolean} True if stdin has data
 */
function hasStdinData() {
	// Check if stdin is a TTY (interactive terminal)
	// If not a TTY, it's likely piped input
	return !process.stdin.isTTY;
}

/**
 * Read stdin data
 *
 * @return {Promise<string>} Stdin content
 */
async function readStdin() {
	return new Promise((resolve, reject) => {
		let data = '';

		process.stdin.setEncoding('utf8');

		process.stdin.on('data', (chunk) => {
			data += chunk;
		});

		process.stdin.on('end', () => {
			resolve(data);
		});

		process.stdin.on('error', (err) => {
			reject(err);
		});
	});
}

/**
 * Detect execution mode
 *
 * @param {Array} argv - Process argv (optional)
 * @return {Object} { mode, config, flags, isStdin }
 */
function detectMode(argv = process.argv) {
	const parsed = parseArgs(argv);
	const isStdin = hasStdinData();

	// If we have stdin data and no explicit mode, assume JSON input
	if (isStdin && parsed.mode === 'interactive') {
		parsed.mode = 'json-stdin';
	}

	return {
		...parsed,
		isStdin,
	};
}

/**
 * Get mode description
 *
 * @param {string} mode - Mode name
 * @return {string} Human-readable description
 */
function getModeDescription(mode) {
	const descriptions = {
		interactive: 'Interactive wizard with step-by-step prompts',
		json: 'JSON configuration from file',
		'json-stdin': 'JSON configuration from stdin (piped input)',
		validate: 'Validate configuration without generating',
		cli: 'Command-line arguments',
		schema: 'Display JSON schema',
		help: 'Display help information',
	};

	return descriptions[mode] || 'Unknown mode';
}

/**
 * Show help message
 */
function showHelp() {
	console.log(
		`
WordPress Multi-Block Plugin Generator

Usage:
  node generate-plugin.js [options]

Modes:
  Interactive    No arguments - step-by-step wizard
  JSON File      --config <file> - load configuration from JSON file
  JSON Stdin     --json or pipe - read JSON from stdin
  Validate       --validate [file] - validate configuration without generating
  Schema         --schema - display JSON schema
  Help           --help - show this message

Options:
  -c, --config <file>    Load configuration from JSON file
  -o, --output <dir>     Output directory (default: ./generated-plugins)
  -f, --force            Overwrite existing output directory
  -v, --verbose          Verbose output
  --dry-run              Dry run (don't write files)
  --validate [file]      Validate configuration
  --schema               Display JSON schema
  --help                 Show this help message

Examples:
  # Interactive mode
  node generate-plugin.js

  # With config file
  node generate-plugin.js --config my-plugin.json

  # From stdin
  echo '{"slug":"my-plugin","name":"My Plugin"}' | node generate-plugin.js --json

  # Validate configuration
  node generate-plugin.js --validate my-plugin.json

  # Display schema
  node generate-plugin.js --schema

For more information, see: docs/GENERATE-PLUGIN.md
	`.trim()
	);
}

module.exports = {
	parseArgs,
	hasStdinData,
	readStdin,
	detectMode,
	getModeDescription,
	showHelp,
};
