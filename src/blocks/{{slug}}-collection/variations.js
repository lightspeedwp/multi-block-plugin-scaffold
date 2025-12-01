/**
 * {{name}} Collection Block - Variations
 *
 * @package {{namespace}}
 */

import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'grid',
		title: __( '{{name}} Grid', '{{textdomain}}' ),
		description: __( 'Display {{name_plural_lower}} in a grid layout.', '{{textdomain}}' ),
		icon: 'grid-view',
		attributes: {
			layout: 'grid',
			columns: 3,
		},
		scope: [ 'inserter', 'transform' ],
		isDefault: true,
	},
	{
		name: 'list',
		title: __( '{{name}} List', '{{textdomain}}' ),
		description: __( 'Display {{name_plural_lower}} in a list layout.', '{{textdomain}}' ),
		icon: 'list-view',
		attributes: {
			layout: 'list',
		},
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'slider',
		title: __( '{{name}} Slider', '{{textdomain}}' ),
		description: __( 'Display {{name_plural_lower}} in a slider/carousel layout.', '{{textdomain}}' ),
		icon: 'slides',
		attributes: {
			layout: 'slider',
		},
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'featured',
		title: __( 'Featured {{name_plural}}', '{{textdomain}}' ),
		description: __( 'Display only featured {{name_plural_lower}}.', '{{textdomain}}' ),
		icon: 'star-filled',
		attributes: {
			layout: 'grid',
			columns: 3,
			query: {
				postType: '{{slug}}',
				perPage: 3,
				order: 'desc',
				orderBy: 'date',
				featured: true,
			},
		},
		scope: [ 'inserter' ],
	},
];

export default variations;
