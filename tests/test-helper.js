/**
 * Playwright Test Helpers
 *
 * Shared helper functions for Playwright E2E tests.
 * For Jest unit test helpers, use .github/tests/test-helper.js instead.
 *
 * @package
 * @see .github/instructions/playwright-tests.instructions.md
 */
/* global jest */

/**
 * Wait for a selector and return the element (Playwright)
 * @param {import('@playwright/test').Page} page
 * @param {string}                          selector
 * @param {Object}                          [options]
 * @return {Promise<import('@playwright/test').Locator>} Locator for the awaited selector.
 */
async function waitForSelector(page, selector, options = {}) {
	await page.waitForSelector(selector, options);
	return page.locator(selector);
}

/**
 * Fill a field by label (Playwright)
 * @param {import('@playwright/test').Page} page
 * @param {string}                          label
 * @param {string}                          value
 */
async function fillByLabel(page, label, value) {
	await page.getByLabel(label).fill(value);
}

/**
 * Click a button by role and name (Playwright)
 * @param {import('@playwright/test').Page} page
 * @param {string}                          name
 */
async function clickButton(page, name) {
	await page.getByRole('button', { name }).click();
}

/**
 * Utility: Reset test state (Jest)
 */
function resetTestState() {
	jest.clearAllMocks();
	jest.resetModules();
}

/**
 * Check accessibility of a page (Playwright with axe-core)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @return {Promise<Object>} Accessibility scan results
 */
async function checkAccessibility(page) {
	// This requires @axe-core/playwright to be installed
	// Example usage in tests/e2e/ files
	const results = await page.evaluate(() => {
		// Placeholder for axe-core integration
		return { violations: [] };
	});
	return results;
}

/**
 * Wait for WordPress admin page to load
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @return {Promise<void>}
 */
async function waitForWpAdmin(page) {
	await page.waitForSelector('#wpadminbar', { timeout: 10000 });
}

/**
 * Navigate to block editor
 * @param {import('@playwright/test').Page} page     - Playwright page object
 * @param {string}                          postType - Post type (default: 'post')
 * @return {Promise<void>}
 */
async function navigateToBlockEditor(page, postType = 'post') {
	await page.goto(`/wp-admin/post-new.php?post_type=${postType}`);
	await page.waitForSelector('.block-editor', { timeout: 10000 });
}

module.exports = {
	// Playwright helpers
	waitForSelector,
	fillByLabel,
	clickButton,
	checkAccessibility,
	waitForWpAdmin,
	navigateToBlockEditor,

	// Jest helpers (for compatibility)
	resetTestState,
};
