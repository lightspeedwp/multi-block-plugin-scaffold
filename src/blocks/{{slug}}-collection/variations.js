/**
 * Example Plugin Collection Block - Variations
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

const variations = [
	{
		name: 'grid',
		title: __('Example Plugin Grid', '{{textdomain}}'),
		description: __('Display items in a grid layout.', '{{textdomain}}'),
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
		title: __('Example Plugin List', '{{textdomain}}'),
		description: __('Display items in a list layout.', '{{textdomain}}'),
		icon: 'list-view',
		attributes: {
			layout: 'list',
		},
		scope: ['inserter', 'transform'],
	},
	{
		name: 'slider',
		title: __('Example Plugin Slider', '{{textdomain}}'),
		description: __(
			'Display items in a slider/carousel layout.',
			'{{textdomain}}'
		),
		icon: 'slides',
		attributes: {
			layout: 'slider',
		},
		scope: ['inserter', 'transform'],
	},
	{
		name: 'featured',
		title: __('Featured Items', '{{textdomain}}'),
		description: __('Display only featured items.', '{{textdomain}}'),
		icon: 'star-filled',
		attributes: {
			layout: 'grid',
			columns: 3,
			query: {
				postType: '{{textdomain}}',
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
