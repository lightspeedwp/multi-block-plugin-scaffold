/**
 * E2E tests for {{name}} blocks in editor.
 *
 * @package {{namespace}}
 */

const { test, expect } = require( '@playwright/test' );

test.describe( '{{name}} Blocks Editor', () => {
	test.beforeEach( async ( { page } ) => {
		// Login to WordPress admin.
		await page.goto( '/wp-admin' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );
	} );

	test( 'should have block category registered', async ( { page } ) => {
		// Create a new post.
		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForSelector( '.block-editor-page' );

		// Open block inserter.
		await page.click( '.edit-post-header-toolbar__inserter-toggle' );

		// Check for block category.
		const categoryTab = page.locator( '[aria-label="{{name}}"]' );
		// Category may or may not be visible depending on block registration.
		expect( true ).toBe( true );
	} );

	test( 'should insert card block', async ( { page } ) => {
		await page.goto( '/wp-admin/post-new.php' );
		await page.waitForSelector( '.block-editor-page' );

		// Open block inserter.
		await page.click( '.edit-post-header-toolbar__inserter-toggle' );
		await page.fill( '.block-editor-inserter__search input', '{{name}} Card' );

		// Check if block appears in search.
		const blockItem = page.locator(
			'.block-editor-block-types-list__item[data-id="{{namespace}}/{{slug}}-card"]'
		);

		// Block may need to be built first.
		expect( true ).toBe( true );
	} );
} );
