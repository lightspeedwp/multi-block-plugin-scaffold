/**
 * E2E tests for {{name}} Post Type.
 *
 * @package {{namespace}}
 */

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const { test, expect } = require( '@playwright/test' );

test.describe( '{{name}} Post Type', () => {
	test.beforeEach( async ( { page } ) => {
		// Login to WordPress admin.
		await page.goto( '/wp-admin' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );
	} );

	test( 'should have post type menu item', async ( { page } ) => {
		// Navigate to admin dashboard.
		await page.goto( '/wp-admin/' );

		// Check for post type menu item.
		const menuItem = page.locator( '#menu-posts-{{slug}}' );
		await expect( menuItem ).toBeVisible();
	} );

	test( 'should create new post', async ( { page } ) => {
		// Navigate to add new post.
		await page.goto( '/wp-admin/post-new.php?post_type={{slug}}' );

		// Wait for editor.
		await page.waitForSelector( '.block-editor-page' );

		// Add title.
		const titleInput = page.locator( '[aria-label="Add title"]' );
		await titleInput.fill( 'Test {{name_singular}}' );

		// Publish.
		await page.click( '.editor-post-publish-button__button' );
		await page.click( '.editor-post-publish-panel__header-publish-button button' );

		// Verify published.
		await page.waitForSelector( '.components-snackbar__content' );
	} );

	test( 'should list posts', async ( { page } ) => {
		// Navigate to post list.
		await page.goto( '/wp-admin/edit.php?post_type={{slug}}' );

		// Check for post list table.
		const table = page.locator( '#the-list' );
		await expect( table ).toBeVisible();
	} );
} );
