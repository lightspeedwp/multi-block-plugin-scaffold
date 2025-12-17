/**
 * Test Helper
 *
 * Centralized test helper that re-exports utilities from other test files.
 * This provides a single import point for test utilities.
 *
 * @package multi-block-plugin-scaffold
 */

const testLogger = require('./test-logger');
const testUtils = require('./test-utils');

module.exports = {
	// Re-export test logger
	...testLogger,

	// Re-export test utils
	...testUtils,
};
