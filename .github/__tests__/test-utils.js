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
// ...existing code continues...

module.exports = {
	waitFor,
	createMockElement,
	generateTestPluginConfig,
	// ...other exports...
};
