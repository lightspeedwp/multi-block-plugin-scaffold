/**
 * {{name}} Slider Block
 *
 * Registers the slider block for displaying {{name_plural}} in an interactive
 * carousel/slider format. Supports autoplay, navigation arrows, pagination dots,
 * infinite loop, and responsive slide counts.
 *
 * Frontend interactivity is powered by view.js with vanilla JavaScript for
 * optimal performance. No external slider libraries required.
 *
 * @see ./block.json Block metadata and configuration
 * @see ./edit.js Block editor component with slider controls
 * @see ./save.js Client-side save function
 * @see ./render.php Server-side rendering with slide query
 * @see ./view.js Frontend slider interactivity
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
 * Register {{name}} Slider Block.
 *
 * Block registration with carousel/slider functionality. Interactive features
 * are initialized client-side via view.js viewScript.
 */
registerBlockType(metadata.name, {
	edit: Edit,
	save,
});
