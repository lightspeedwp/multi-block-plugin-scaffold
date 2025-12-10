/**
 * Query Controls Component
 *
 * Reusable query configuration controls for collection blocks.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import TaxonomyFilter from '../TaxonomyFilter';

/**
 * QueryControls component.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.query    Current query settings.
 * @param {Function} props.onChange Callback when query changes.
 *
 * @return {Element} QueryControls component.
 */
export default function QueryControls({ query, onChange }) {
	const {
		perPage = 6,
		order = 'desc',
		orderBy = 'date',
		featured = false,
		taxQuery = null,
	} = query;

	const updateQuery = (updates) => {
		onChange({ ...query, ...updates });
	};

	return (
		<InspectorControls>
			<PanelBody title={__('Query Settings', 'example-plugin')}>
				<RangeControl
					label={__('Number of Items', 'example-plugin')}
					value={perPage}
					onChange={(value) => updateQuery({ perPage: value })}
					min={1}
					max={24}
				/>
				<SelectControl
					label={__('Order By', 'example-plugin')}
					value={orderBy}
					options={[
						{ label: __('Date', 'example-plugin'), value: 'date' },
						{
							label: __('Title', 'example-plugin'),
							value: 'title',
						},
						{
							label: __('Modified', 'example-plugin'),
							value: 'modified',
						},
						{
							label: __('Random', 'example-plugin'),
							value: 'rand',
						},
						{
							label: __('Menu Order', 'example-plugin'),
							value: 'menu_order',
						},
					]}
					onChange={(value) => updateQuery({ orderBy: value })}
				/>
				<SelectControl
					label={__('Order', 'example-plugin')}
					value={order}
					options={[
						{
							label: __('Descending', 'example-plugin'),
							value: 'desc',
						},
						{
							label: __('Ascending', 'example-plugin'),
							value: 'asc',
						},
					]}
					onChange={(value) => updateQuery({ order: value })}
				/>
				<ToggleControl
					label={__('Featured Only', 'example-plugin')}
					checked={featured}
					onChange={(value) => updateQuery({ featured: value })}
				/>
			</PanelBody>

			<PanelBody
				title={__('Filter by Taxonomy', 'example-plugin')}
				initialOpen={false}
			>
				<TaxonomyFilter
					taxonomy="example-plugin_category"
					value={taxQuery?.['example-plugin_category'] || []}
					onChange={(termIds) =>
						updateQuery({
							taxQuery: termIds.length
								? { 'example-plugin_category': termIds }
								: null,
						})
					}
					label={__('Categories', 'example-plugin')}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
