/**
 * {{name}} Card Block
 *
 * Registers the card block for displaying individual {{name_singular}} items
 * with featured image, title, excerpt, and custom field data. This block is
 * typically used within query loops, patterns, or as a standalone display.
 *
 * @see ./block.json Block metadata and configuration
 * @see ./edit.js Block editor component
 * @see ./save.js Client-side save function
 * @see ./render.php Server-side rendering template (if dynamic)
 *
 * @package {{namespace}}
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

/**
 * Register {{name}} Card Block.
 *
 * Block registration with edit and save components. Styles are loaded
 * automatically from style.scss (frontend + editor) and editor.scss (editor only).
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
