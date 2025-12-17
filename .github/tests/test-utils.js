/**
 * Test Utilities
 *
 * Shared test utilities for the multi-block-plugin-scaffold project.
 * Provides helpers for DOM manipulation, async operations, and test data generation.
 *
 * For logging in tests, use test-logger.js (InMemoryTestLogger, createTestLogger).
 *
 * @package multi-block-plugin-scaffold
 */

/**
 * Wait for a condition to be true
 *
 * @param {Function} condition - Function that returns true when condition is met
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @param {number} interval - Check interval in milliseconds
 * @return {Promise<void>}
 */
async function waitFor(condition, timeout = 5000, interval = 100) {
	const startTime = Date.now();

	while (Date.now() - startTime < timeout) {
		if (await condition()) {
			return;
		}
		await new Promise(resolve => setTimeout(resolve, interval));
	}

	throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Create a mock DOM element with attributes
 *
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} content - Inner content
 * @return {Object} Mock DOM element
 */
function createMockElement(tag, attributes = {}, content = '') {
	return {
		tagName: tag.toUpperCase(),
		attributes,
		innerHTML: content,
		textContent: content.replace(/<[^>]*>/g, ''),
		getAttribute: (name) => attributes[name] || null,
		setAttribute: (name, value) => { attributes[name] = value; },
		querySelector: () => null,
		querySelectorAll: () => [],
	};
}

/**
 * Generate test data for plugin configuration
 *
 * @param {Object} overrides - Values to override defaults
 * @return {Object} Test plugin configuration
 */
function generateTestPluginConfig(overrides = {}) {
	return {
		slug: 'test-plugin',
		name: 'Test Plugin',
		description: 'A test plugin for unit testing',
		version: '1.0.0',
		namespace: 'TestPlugin',
		author: 'Test Author',
		authorUri: 'https://example.com',
		textDomain: 'test-plugin',
		phpNamespace: 'TestPlugin',
		prefix: 'test_plugin',
		...overrides,
	};
}

/**
 * Generate test data for block configuration
 *
 * @param {Object} overrides - Values to override defaults
 * @return {Object} Test block configuration
 */
function generateTestBlockConfig(overrides = {}) {
	return {
		name: 'test-plugin/test-block',
		title: 'Test Block',
		description: 'A test block',
		category: 'widgets',
		icon: 'smiley',
		supports: {
			html: false,
		},
		attributes: {},
		...overrides,
	};
}

/**
 * Mock file system operations
 *
 * @return {Object} Mock fs module
 */
function createMockFs() {
	const files = new Map();

	return {
		readFileSync: (path) => {
			if (!files.has(path)) {
				throw new Error(`ENOENT: no such file or directory, open '${path}'`);
			}
			return files.get(path);
		},
		writeFileSync: (path, content) => {
			files.set(path, content);
		},
		existsSync: (path) => files.has(path),
		mkdirSync: () => {},
		readdirSync: () => Array.from(files.keys()),
		_reset: () => files.clear(),
		_getFiles: () => files,
	};
}

/**
 * Suppress console output during tests
 *
 * @return {Function} Restore function
 */
function suppressConsole() {
	const originalLog = console.log;
	const originalError = console.error;
	const originalWarn = console.warn;

	console.log = jest.fn();
	console.error = jest.fn();
	console.warn = jest.fn();

	return () => {
		console.log = originalLog;
		console.error = originalError;
		console.warn = originalWarn;
	};
}

/**
 * Create a spy on console methods
 *
 * @return {Object} Console spies
 */
function spyOnConsole() {
	return {
		log: jest.spyOn(console, 'log').mockImplementation(() => {}),
		error: jest.spyOn(console, 'error').mockImplementation(() => {}),
		warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
	};
}

module.exports = {
	waitFor,
	createMockElement,
	generateTestPluginConfig,
	generateTestBlockConfig,
	createMockFs,
	suppressConsole,
	spyOnConsole,
	// Logging helpers are now in test-logger.js
};
