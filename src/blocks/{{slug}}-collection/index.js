/**
 * {{name}} Collection Block
 *
 * @package {{namespace}}
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import variations from './variations';
import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	variations,
} );
