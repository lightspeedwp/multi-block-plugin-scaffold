/**
 * Jest Configuration
 *
 * @see https://jestjs.io/docs/configuration
 */

const defaultConfig = require('@wordpress/scripts/config/jest-unit.config');

module.exports = {
	...defaultConfig,

	// Test file patterns
	testMatch: [
		'**/tests/js/**/*.test.js',
		'**/tests/**/*.test.js',
		'**/?(*.)+(spec|test).js',
	],

	// Files to ignore
	testPathIgnorePatterns: [
		'/node_modules/',
		'/vendor/',
		'/build/',
		'/tests/e2e/',
		'/.dry-run-backup/',
	],

	// Setup files
	setupFilesAfterEnv: ['<rootDir>/.github/__tests__/setup-tests.js'],

	// Coverage configuration
	collectCoverageFrom: [
		'scripts/dry-run-config.js',
		'scripts/generate-plugin.js',
	],

	coverageDirectory: 'coverage',

	coverageReporters: [
		'text',
		'text-summary',
		'html',
		'lcov',
		'json',
		'json-summary',
	],

	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 5,
			statements: 5,
		},
	},

	// Module paths
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
		'\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js',
	},

	// Transform ES modules from node_modules
	transformIgnorePatterns: ['node_modules/(?!(parsel-js)/)'],

	// Verbose output
	verbose: true,
};
