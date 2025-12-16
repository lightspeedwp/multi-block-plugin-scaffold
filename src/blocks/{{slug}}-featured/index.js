/**
 * {{name}} Featured Block
 *
 * Registers the featured block for prominently displaying selected {{name_plural}}
 * marked as featured via custom field metadata. Automatically queries posts with
 * the `{{namespace}}_featured` meta key set to true.
 *
 * Ideal for hero sections, homepage highlights, or spotlight areas showcasing
 * hand-picked content.
 *
 * @see ./block.json Block metadata and configuration
 * @see ./edit.js Block editor component with featured query
 * @see ./save.js Client-side save function
 * @see ./render.php Server-side rendering with featured meta query
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
 * Register {{name}} Featured Block.
 *
 * Block registration with automatic featured item querying based on custom
 * field metadata. Renders selected count of featured items.
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
