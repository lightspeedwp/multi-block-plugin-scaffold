/**
 * Jest Configuration
 *
 * @see https://jestjs.io/docs/configuration
 */

const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

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
	],

	// Setup files
	setupFilesAfterEnv: [
		'<rootDir>/tests/setup-tests.js',
	],

	// Coverage configuration
	collectCoverageFrom: [
		'src/**/*.js',
		'!src/**/*.test.js',
		'!src/**/test/*.js',
		'!**/node_modules/**',
		'!**/vendor/**',
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
			branches: 60,
			functions: 60,
			lines: 70,
			statements: 70,
		},
	},

	// Module paths
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
		'\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js',
	},

	// Verbose output
	verbose: true,
};
