/**
 * Jest Setup File (Before Environment)
 *
 * This file runs before the test framework is installed in the environment.
 * Use setup-tests.js (setupFilesAfterEnv) for most configuration.
 *
 * @package multi-block-plugin-scaffold
 * @see https://jestjs.io/docs/configuration#setupfiles-array
 */

// Environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MBPS_LOG_LEVEL = 'ERROR'; // Only log errors during tests
