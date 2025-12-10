#!/usr/bin/env node

/**
 * Multi-Block Plugin Scaffold Generator Agent
 *
 * Interactive agent that collects requirements and generates WordPress plugins.
 * Supports multiple modes:
 * - Interactive: Prompts for configuration
 * - JSON: Accepts configuration via stdin
 * - Validate: Validates configuration
 * - Schema: Outputs JSON schema
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { loadSchema, validateConfig } = require('./generate-plugin.js');

/**
 * Display help information
 */
function displayHelp() {
	const help = `
Multi-Block Plugin Scaffold Generator

Usage:
  node generate-plugin.agent.js [options]

Options:
  --help         Display this help message
  --schema       Output JSON schema
  --json         Accept configuration via stdin
  --validate     Validate configuration (provide config as argument)

Examples:
  Interactive:
    node generate-plugin.agent.js

  With JSON:
    echo '{"slug":"my-plugin","name":"My Plugin","author":"Author"}' | node generate-plugin.agent.js --json

  Validate:
    node generate-plugin.agent.js --validate '{"slug":"test",...}'

  Schema:
    node generate-plugin.agent.js --schema
`;
	console.log(help);
}

/**
 * Display JSON schema
 */
function displaySchema() {
	const schema = loadSchema();
	console.log(JSON.stringify(schema, null, 2));
}

/**
 * Handle JSON mode - read configuration from stdin
 */
function handleJsonMode() {
	let input = '';

	process.stdin.setEncoding('utf8');

	process.stdin.on('data', (chunk) => {
		input += chunk;
	});

	process.stdin.on('end', () => {
		try {
			// Parse JSON
			const config = JSON.parse(input);

			// Validate configuration
			const result = validateConfig(config);

			if (!result.valid) {
				console.error('Configuration validation failed:');
				if (result.errors && result.errors.length > 0) {
					result.errors.forEach((error) => {
						const field =
							error.instancePath || error.field || 'unknown';
						const message = error.message || 'Validation error';
						console.error(`  - ${field}: ${message}`);

						// Check if it's a required field error
						if (
							error.keyword === 'required' ||
							message.includes('required')
						) {
							const requiredField =
								error.params?.missingProperty || '';
							if (requiredField) {
								console.error(
									`    Required field missing: ${requiredField}`
								);
							}
						}
					});
				}
				process.exit(1);
			}

			// Configuration is valid
			console.log('✓ Configuration validated successfully');

			// Write to plugin-config.json
			const outputPath = path.join(process.cwd(), 'plugin-config.json');
			fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
			console.log(`✓ Configuration written to: ${outputPath}`);

			process.exit(0);
		} catch (error) {
			if (error instanceof SyntaxError) {
				console.error('Invalid JSON:', error.message);
			} else {
				console.error('Error processing configuration:', error.message);
			}
			process.exit(1);
		}
	});

	process.stdin.on('error', (error) => {
		console.error('Error reading stdin:', error.message);
		process.exit(1);
	});
}

/**
 * Handle validate mode - validate configuration from argument
 *
 * @param {string} configJson - JSON configuration string
 */
function handleValidateMode(configJson) {
	try {
		// Parse JSON
		const config = JSON.parse(configJson);

		// Validate configuration
		const result = validateConfig(config);

		if (!result.valid) {
			console.error('Configuration validation failed:');
			if (result.errors && result.errors.length > 0) {
				result.errors.forEach((error) => {
					const field =
						error.instancePath || error.field || 'unknown';
					const message = error.message || 'Validation error';
					console.error(`  - ${field}: ${message}`);

					// Check if it's a required field error
					if (
						error.keyword === 'required' ||
						message.includes('required')
					) {
						const requiredField =
							error.params?.missingProperty || '';
						if (requiredField) {
							console.error(
								`    Required field missing: ${requiredField}`
							);
						}
					}
				});
			}
			process.exit(1);
		}

		// Configuration is valid
		console.log('✓ Configuration is valid');
		process.exit(0);
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error('Invalid JSON:', error.message);
		} else {
			console.error('Error validating configuration:', error.message);
		}
		process.exit(1);
	}
}

/**
 * Main function
 */
function main() {
	const args = process.argv.slice(2);

	// Handle --help flag
	if (args.includes('--help') || args.includes('-h')) {
		displayHelp();
		process.exit(0);
	}

	// Handle --schema flag
	if (args.includes('--schema')) {
		displaySchema();
		process.exit(0);
	}

	// Handle --json flag (read from stdin)
	if (args.includes('--json')) {
		handleJsonMode();
		return; // Don't exit here, let stdin handlers manage exit
	}

	// Handle --validate flag
	if (args.includes('--validate')) {
		const validateIndex = args.indexOf('--validate');
		const configJson = args[validateIndex + 1];

		if (!configJson) {
			console.error(
				'Error: --validate requires a JSON configuration argument'
			);
			process.exit(1);
		}

		handleValidateMode(configJson);
		return;
	}

	// No recognized flags - show help
	console.log('No command provided. Use --help for usage information.');
	displayHelp();
	process.exit(0);
}

// Run main function
main();
