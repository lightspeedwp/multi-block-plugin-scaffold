/**
 * {{name}} Collection Block
 *
 * Registers the collection block for displaying grids, lists, and archives of
 * {{name_plural}}. Supports query controls, pagination, filtering by taxonomy,
 * and multiple layout variations (grid, list, masonry).
 *
 * This block uses WordPress Query Loop under the hood with custom post type
 * integration and provides a user-friendly interface for common layouts.
 *
 * @see ./block.json Block metadata and configuration
 * @see ./edit.js Block editor component with query controls
 * @see ./save.js Client-side save function
 * @see ./render.php Server-side rendering with query loop
 * @see ./variations.js Block variations (grid, list, masonry)
 *
 * @package
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import variations from './variations';
import './style.scss';
import './editor.scss';

/**
 * Register {{name}} Collection Block.
 *
 * Block registration with edit, save, and multiple variations for different
 * layout options. Query handling is performed server-side via render.php.
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
	variations,
});
