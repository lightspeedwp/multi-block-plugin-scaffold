#!/usr/bin/env node

/**
 * Block metadata validation
 *
 * @package
 */

const fs = require('fs');
const path = require('path');

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const https = require('https');

const {
	loadConfigFile,
	applyDefaults,
	replaceMustacheVars,
} = require('../../scripts/generate-plugin');

const FIXTURE_PATH = path.join(
	__dirname,
	'..',
	'fixtures',
	'plugin-config.test.json'
);

const BLOCKS_DIR = path.join(__dirname, '..', '..', 'src', 'blocks');

const baseConfig = applyDefaults(loadConfigFile(FIXTURE_PATH));
const pluginConfig = { ...baseConfig, namespace: baseConfig.slug };
const blockDirectories = fs
	.readdirSync(BLOCKS_DIR, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

describe('Block metadata templates', () => {
	const schemaPath = path.join(
		__dirname,
		'..',
		'..',
		'.github',
		'schemas',
		'block.json'
	);
	const localSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
	const ajv = new Ajv({ allErrors: true, strict: false });
	addFormats(ajv);
	const validate = ajv.compile(localSchema);

	blockDirectories.forEach((blockName) => {
		it(`validates ${blockName}/block.json against local schema`, () => {
			const blockPath = path.join(BLOCKS_DIR, blockName, 'block.json');
			const raw = fs.readFileSync(blockPath, 'utf8');
			const rendered = replaceMustacheVars(raw, pluginConfig);
			const parsed = JSON.parse(rendered);
			const valid = validate(parsed);

			if (!valid) {
				const errList = (validate.errors || [])
					.map(
						(err) => `${err.instancePath || 'root'}: ${err.message}`
					)
					.join('; ');
				throw new Error(
					`Block schema errors for ${blockName}: ${errList}`
				);
			}

			expect(valid).toBe(true);
		});
	});
});
