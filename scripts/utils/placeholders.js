#!/usr/bin/env node

/**
 * scripts/test-placeholders.js
 *
 * Centralized test placeholder values for mustache variables.
 * Used by lint-dry-run and pre-commit hooks to enable testing
 * of scaffold templates without full theme generation.
 *
 * @module test-placeholders
 */

const PLACEHOLDER_MAP = {
	'{{theme_slug}}': 'block-theme-scaffold',
	'{{theme_name}}': 'Block Theme Scaffold',
	'{{description}}':
		'A modern WordPress block theme scaffold with full site editing support',
	'{{author}}': 'LightSpeed',
	'{{author_uri}}': 'https://lightspeedwp.com',
	'{{version}}': '1.0.0',
	'{{theme_uri}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{theme_tags}}': 'block-theme, full-site-editing, accessibility-ready',
	'{{min_wp_version}}': '6.0',
	'{{tested_wp_version}}': '6.9',
	'{{min_php_version}}': '7.4',
	'{{license}}': 'GPL-2.0-or-later',
	'{{license_uri}}': 'https://www.gnu.org/licenses/gpl-2.0.html',
	'{{theme_repo_url}}':
		'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{support_url}}':
		'https://wordpress.org/support/theme/block-theme-scaffold',
	'{{support_email}}': 'support@lightspeedwp.com',
	'{{security_email}}': 'security@lightspeedwp.com',
	'{{business_email}}': 'contact@lightspeedwp.com',
	'{{docs_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold/wiki',
	'{{docs_repo_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{discord_url}}': 'https://discord.gg/lightspeedwp',
	'{{custom_dev_url}}': 'https://lightspeedwp.com',
	'{{premium_support_url}}': 'https://lightspeedwp.com/support',
	'{{changelog_url}}':
		'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md',
	'{{warning_title}}': 'Dry-run placeholder',
	'{{metadata}}': 'dry-run metadata entry',
	'{{layout}}': 'constrained',
	'{{layout_type}}': 'constrained',
	'{{metadata_author}}': 'LightSpeed Dry Run',
	'{{namespace}}': 'block_theme_scaffold',
	'{{primary_color}}': '#0073aa',
	'{{secondary_color}}': '#005177',
	'{{background_color}}': '#ffffff',
	'{{text_color}}': '#1e1e1e',
	'{{accent_color}}': '#d63638',
	'{{neutral_color}}': '#757575',
	'{{heading_font_family}}':
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	'{{heading_font_name}}': 'System Sans',
	'{{body_font_family}}': 'Georgia, "Times New Roman", Times, serif',
	'{{body_font_name}}': 'System Serif',
	'{{mono_font_family}}': '"Courier New", Courier, monospace',
	'{{mono_font_name}}': 'Monospace',
	'{{heading_font_weight}}': '700',
	'{{heading_line_height}}': '1.2',
	'{{body_line_height}}': '1.6',
	'{{button_font_weight}}': '600',
	'{{button_border_radius}}': '4px',
	'{{site_title_font_weight}}': '700',
	'{{content_width}}': '640px',
	'{{wide_width}}': '1200px',
	'{{year}}': new Date().getFullYear().toString(),
	'{{created_date}}': new Date().toISOString(),
	'{{updated_date}}': new Date().toISOString(),
	'{{skip_link_text}}': 'Skip to content',
	'{{theme_slug|camelCase}}': 'blockThemeScaffold',
};

const PLACEHOLDER_REGEX = /\{\{\s*([^}|]+)(?:\|([^}]+))?\s*\}\}/g;

function applyFilter( value, filter ) {
	const normalized = ( filter || '' ).toLowerCase();
	switch ( normalized ) {
		case 'upper':
			return value.toUpperCase();
		case 'lower':
			return value.toLowerCase();
		case 'pascalcase':
			return value
				.split( /[\s-_]+/ )
				.filter( Boolean )
				.map(
					( segment ) =>
						segment.charAt( 0 ).toUpperCase() +
						segment.slice( 1 ).toLowerCase()
				)
				.join( '' );
		case 'camelcase':
			return value
				.split( /[\s-_]+/ )
				.filter( Boolean )
				.map( ( segment, index ) =>
					index === 0
						? segment.toLowerCase()
						: segment.charAt( 0 ).toUpperCase() +
						  segment.slice( 1 ).toLowerCase()
				)
				.join( '' );
		case 'snake_case':
			return value
				.split( /[\s-_]+/ )
				.filter( Boolean )
				.join( '_' )
				.toLowerCase();
		default:
			return value;
	}
}

function fallbackValue( variable, filter ) {
	const normalized = `${ variable }${ filter ? `-${ filter }` : '' }`
		.replace( /[^a-z0-9]+/gi, '-' )
		.replace( /(^-+|-+$)/g, '' )
		.toLowerCase();
	return `dry-run-${ normalized || 'value' }`;
}

/**
 * Replace all mustache placeholders in a string with test values.
 *
 * @param {string} content - The content containing mustache placeholders
 * @return {string} Content with placeholders replaced
 */
function replacePlaceholders( content, values = PLACEHOLDER_MAP ) {
	return content.replace( PLACEHOLDER_REGEX, ( match, variable, filter ) => {
		const placeholder = `{{${ variable }${ filter ? `|${ filter }` : '' }}}`;

		if ( values[ placeholder ] !== undefined ) {
			return values[ placeholder ];
		}

		const baseKey = `{{${ variable }}}`;
		const baseValue = values[ baseKey ];

		if ( baseValue !== undefined ) {
			return filter
				? applyFilter( String( baseValue ), filter )
			: baseValue;
		}

		if ( filter ) {
			const filteredKey = `{{${ variable }|${ filter }}}`;
			if ( values[ filteredKey ] !== undefined ) {
				return values[ filteredKey ];
			}
		}

		return fallbackValue( variable, filter );
	} );
}

/**
 * Check if the current project is in scaffold mode (has mustache variables).
 *
 * @param {string} packageJsonPath - Path to package.json
 * @return {boolean} True if scaffold mode detected
 */
function isScaffoldMode( packageJsonPath ) {
	try {
		const fs = require( 'fs' );
		const packageJson = fs.readFileSync( packageJsonPath, 'utf8' );
		return packageJson.includes( '{{theme_slug}}' );
	} catch ( error ) {
		if ( typeof packageJsonPath === 'string' ) {
			const normalized = packageJsonPath.toLowerCase();
			if (
				normalized.includes( 'scaffold' ) ||
				normalized.includes( 'dev' ) ||
				normalized.includes( 'development' )
			) {
				return true;
			}
		}
		return false;
	}
}

/**
 * Get a specific placeholder value.
 *
 * @param {string} key - The placeholder key (e.g., '{{theme_slug}}')
 * @return {string|undefined} The test value or undefined if not found
 */
function getPlaceholder( key ) {
	return PLACEHOLDER_MAP[ key ];
}

/**
 * Get all placeholder keys.
 *
 * @return {string[]} Array of all placeholder keys
 */
function getPlaceholderKeys() {
	return Object.keys( PLACEHOLDER_MAP );
}

/**
 * Get all placeholder values.
 *
 * @return {Object} Object containing all placeholder key-value pairs
 */
function getAllPlaceholders() {
	return { ...PLACEHOLDER_MAP };
}

module.exports = {
	PLACEHOLDER_MAP,
	replacePlaceholders,
	isScaffoldMode,
	getPlaceholder,
	getPlaceholderKeys,
	getAllPlaceholders,
};

if ( require.main === module ) {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ];

	switch ( command ) {
		case 'list':
			break;

		case 'get':
			if ( args[ 1 ] ) {
				const value = getPlaceholder( args[ 1 ] );
				if ( value !== undefined ) {
					process.stdout.write( value );
				} else {
					process.exit( 1 );
				}
			} else {
				process.exit( 1 );
			}
			break;

		case 'json':
			process.stdout.write( JSON.stringify( PLACEHOLDER_MAP, null, 2 ) );
			break;

		case 'check': {
			const packageJsonPath = args[ 1 ] || '../package.json';
			const inScaffoldMode = isScaffoldMode( packageJsonPath );
			process.exit( inScaffoldMode ? 0 : 1 );
			break;
		}

		default:
			break;
	}
}
