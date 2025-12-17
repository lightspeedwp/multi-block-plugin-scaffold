/**
 * @file wizard.test.js
 * @description Unit tests for wizard interface modes in scripts/lib/wizard.js
 *
 * TODO:
 * - Add tests for CLI, interactive, and advanced modes (mock inquirer)
 * - Add tests for silent mode and error handling
 * - Add integration tests for config validation
 */
const { runWizard } = require('../wizard');

const { runWizard, wizardInterfaces } = require('../wizard');
const path = require('path');
const fs = require('fs');

describe('wizardInterfaces', () => {
	it('mock mode returns valid config', async () => {
		const config = await wizardInterfaces.mock();
		expect(config).toHaveProperty('slug');
		expect(config).toHaveProperty('name');
		expect(config).toHaveProperty('author');
	});

	it('minimal mode returns valid config', async () => {
		const config = await wizardInterfaces.minimal();
		expect(config.slug).toBe('minimal-plugin');
		expect(config.name).toBe('Minimal Plugin');
		expect(config.author).toBe('LightSpeed');
	});

	it('env mode returns config from environment', async () => {
		process.env.PLUGIN_SLUG = 'env-plugin';
		process.env.PLUGIN_NAME = 'Env Plugin';
		process.env.PLUGIN_AUTHOR = 'Env Author';
		const config = await wizardInterfaces.env();
		expect(config.slug).toBe('env-plugin');
		expect(config.name).toBe('Env Plugin');
		expect(config.author).toBe('Env Author');
	});

	it('json mode throws if no configFile', async () => {
		await expect(wizardInterfaces.json({})).rejects.toThrow('JSON mode requires options.configFile');
	});

	it('web mode throws not implemented', async () => {
		await expect(wizardInterfaces.web()).rejects.toThrow('Web wizard interface is not yet implemented');
	});
});

describe('runWizard', () => {
	it('returns a mock config object by default', async () => {
		const config = await runWizard();
		expect(config).toHaveProperty('slug');
		expect(config).toHaveProperty('name');
		expect(config).toHaveProperty('author');
	});

	it('should allow loading config from a file if provided', async () => {
		// This test will be implemented after file loading is added
		// Placeholder for future test
		expect(true).toBe(true);
	});

	it('throws on unknown mode', async () => {
		await expect(runWizard({ mode: 'notamode' })).rejects.toThrow('Unknown wizard mode: notamode');
	});
});
