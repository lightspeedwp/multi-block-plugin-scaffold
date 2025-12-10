/**
 * Example Plugin Collection Block - Variations
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'grid',
		title: __('Example Plugin Grid', 'example-plugin'),
		description: __('Display items in a grid layout.', 'example-plugin'),
		icon: 'grid-view',
		attributes: {
			layout: 'grid',
			columns: 3,
		},
		scope: ['inserter', 'transform'],
		isDefault: true,
	},
	{
		name: 'list',
		title: __('Example Plugin List', 'example-plugin'),
		description: __('Display items in a list layout.', 'example-plugin'),
		icon: 'list-view',
		attributes: {
			layout: 'list',
		},
		scope: ['inserter', 'transform'],
	},
	{
		name: 'slider',
		title: __('Example Plugin Slider', 'example-plugin'),
		description: __(
			'Display items in a slider/carousel layout.',
			'example-plugin'
		),
		icon: 'slides',
		attributes: {
			layout: 'slider',
		},
		scope: ['inserter', 'transform'],
	},
	{
		name: 'featured',
		title: __('Featured Items', 'example-plugin'),
		description: __('Display only featured items.', 'example-plugin'),
		icon: 'star-filled',
		attributes: {
			layout: 'grid',
			columns: 3,
			query: {
				postType: 'example-plugin',
				perPage: 3,
				order: 'desc',
				orderBy: 'date',
				featured: true,
			},
		},
		scope: ['inserter'],
	},
];

export default variations;
