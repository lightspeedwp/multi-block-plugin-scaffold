/**
 * @file Wizard.js
 * @description Placeholder for the interactive wizard implementation.
 * This module provides a `runWizard` function that simulates gathering
 * configuration data interactively from the user.
 */


const fs = require('fs');
const path = require('path');
const { getCanonicalConfigSchema } = require('../validation/define-config-schema');
const { validateConfig } = require('../validation/validate-plugin-config');

/**
 * Interactive wizard to gather configuration data, or load from a config file if provided.
 *
 * @async
 * @param {Object} [options]
 * @param {string} [options.configFile] - Path to a plugin-config.json file to load instead of prompting.
 * @returns {Promise<Object>} A promise that resolves to a configuration object.
 */
async function runWizard(options = {}) {
	if (options.configFile) {
		const configPath = path.resolve(process.cwd(), options.configFile);
		if (!fs.existsSync(configPath)) {
			throw new Error(`Config file not found: ${configPath}`);
		}
		const content = fs.readFileSync(configPath, 'utf8');
		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch (e) {
			throw new Error(`Invalid JSON in config file: ${configPath}`);
		}
		ensureWizardConfig(parsed);
		return parsed;
	}

	// Simulate user input with a mock configuration object.
	const config = {
		slug: 'example-plugin',
		name: 'Example Plugin',
		author: 'Example Author',
	};

	ensureWizardConfig(config);
	return config;
}

function ensureWizardConfig(config) {
	const schema = getCanonicalConfigSchema();
	const validation = validateConfig(config, schema);
	if (!validation.valid) {
		throw new Error(
			`Wizard generated config is invalid: ${validation.errors
				.map((error) => error.message)
				.join(', ')}`
		);
	}
}

module.exports = {
	runWizard,
};
