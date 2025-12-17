/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const CLI_HELP_DOC_PATH = path.resolve(
	__dirname,
	'../../docs/GENERATE_PLUGIN.md'
);
/**
 * @file Mode Detector
 * @description Detects which mode the plugin generator should run in based on CLI arguments and stdin.
 *
 * The script supports several operational modes:
 * - `interactive`: A step-by-step wizard for user input.
 * - `json`: Configuration is provided via a specified file.
 * - `json-stdin`: Configuration is piped via stdin.
 * - `validate`: Validates a configuration file without generating the plugin.
 * - `help`: Displays the help message.
 */

/**
 * Parse command-line arguments
 *
 * @param {string[]} [argv=process.argv] - Process argv. Defaults to `process.argv`.
 * @returns {{mode: string, config: string|null, flags: Object<string, (string|boolean)>}} Parsed arguments containing the detected mode,
 * configuration file path (if any), and any provided flags.
 */
function parseArgs(argv = process.argv) {
	const args = minimist(argv.slice(2), {
		alias: {
			h: 'help',
			c: 'config',
			o: 'output',
			v: 'verbose',
			f: 'force',
		},
		boolean: ['help', 'schema', 'json', 'dry-run', 'verbose', 'force'],
		string: ['config', 'output'],
		// `validate` can be a boolean or have a value, so we don't declare its type.
	});

	let mode = 'interactive';
	let config = null;

	if (args.help) {
		mode = 'help';
	} else if (args.schema) {
		mode = 'schema';
	} else if (args.validate !== undefined) {
		mode = 'validate';
		// Handle `--validate` and `--validate <file>`
		if (typeof args.validate === 'string' && args.validate) {
			config = args.validate;
		} else if (args._.length > 0) {
			// Handle `... --validate file.json`
			config = args._.shift();
		}
	} else if (args.config) {
		mode = 'json';
		config = args.config;
	} else if (args.json) {
		mode = 'json-stdin';
	}

	// The remaining flags are collected, excluding '_' for positional args.
	const flags = { ...args };
	delete flags._;
	delete flags.h;
	delete flags.c;
	delete flags.o;
	delete flags.v;
	delete flags.f;

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
 * Read the CLI Reference section from the canonical docs to keep the help output in sync.
 *
 * @return {string|null} Trimmed section text or null when the section is unavailable
 */
function readCliHelpSection() {
	try {
		const content = fs.readFileSync(CLI_HELP_DOC_PATH, 'utf8');
		const lines = content.split(/\r?\n/);
		const startIndex = lines.findIndex(
			(line) => line.trim() === '## CLI Reference'
		);
		if (startIndex === -1) {
			return null;
		}

		const sectionLines = [];
		for (let i = startIndex + 1; i < lines.length; i++) {
			if (lines[i].startsWith('## ')) {
				break;
			}
			sectionLines.push(lines[i]);
		}

		const section = sectionLines.join('\n').trim();
		return section.length ? section : null;
	} catch (error) {
		console.warn(
			`⚠️  Warning: Unable to read CLI help doc: ${error.message}`
		);
		return null;
	}
}

/**
 * Displays the CLI help message.
 * It first attempts to read the "CLI Reference" section from `docs/GENERATE_PLUGIN.md`
 * to ensure the help text is always synchronized with the documentation. If reading fails,
 * it falls back to a hardcoded help message.
 */
function showHelp() {
	const docHelp = readCliHelpSection();
	if (docHelp) {
		console.log(docHelp);
		return;
	}

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

For more information, see: docs/GENERATE_PLUGIN.md
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
