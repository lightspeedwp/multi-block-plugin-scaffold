#!/usr/bin/env node
/**
 * Wrapper for the real theme generator so tests can execute the CLI from tests/bin.
 *
 * Locating the implementation via a relative path instead of duplicating logic
 * keeps the test shim in sync with the real generator.
 */

const path = require('path');

const scriptPath = path.resolve(
	__dirname,
	'..',
	'..',
	'scripts',
	'generate-theme.js'
);

// Load the actual generator so it reuses the real implementation.
require(scriptPath);
