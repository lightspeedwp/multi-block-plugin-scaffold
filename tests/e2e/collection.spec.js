/**
 * E2E tests for {{name}} Collection block.
 *
 * @package {{namespace}}
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const { test, expect } = require( '@playwright/test' );

test.describe( '{{name}} Collection Block', () => {
	test.beforeEach( async ( { page } ) => {
		// Login to WordPress admin.
		await page.goto( '/wp-admin' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );

		// Create a new post.
		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForSelector( '.block-editor-page' );
	} );

	test( 'should insert collection block', async ( { page } ) => {
		// Open block inserter.
		await page.click( '.edit-post-header-toolbar__inserter-toggle' );
		await page.fill( '.block-editor-inserter__search input', '{{name}} Collection' );

		// Insert the block.
		const blockItem = page.locator(
			'.block-editor-block-types-list__item[data-id="{{namespace}}/{{slug}}-collection"]'
		);
		await blockItem.click();

		// Verify block is inserted.
		const block = page.locator( '.wp-block-{{namespace}}-{{slug}}-collection' );
		await expect( block ).toBeVisible();
	} );

	test( 'should show layout options in sidebar', async ( { page } ) => {
		// Insert the block.
		await page.click( '.edit-post-header-toolbar__inserter-toggle' );
		await page.fill( '.block-editor-inserter__search input', '{{name}} Collection' );
		await page.click(
			'.block-editor-block-types-list__item[data-id="{{namespace}}/{{slug}}-collection"]'
		);

		// Select the block.
		const block = page.locator( '.wp-block-{{namespace}}-{{slug}}-collection' );
		await block.click();

		// Check sidebar settings.
		const layoutControl = page.locator( 'select[aria-label*="Layout"]' );
		await expect( layoutControl ).toBeVisible();
	} );
} );
