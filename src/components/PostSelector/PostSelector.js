/**
 * Post Selector Component
 *
 * A reusable component for selecting posts in the block editor.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { ComboboxControl, Spinner } from '@wordpress/components';

/**
 * PostSelector component.
 *
 * @param {Object}   props             Component props.
 * @param {string}   props.postType    Post type to query.
 * @param {number}   props.value       Selected post ID.
 * @param {Function} props.onChange    Callback when selection changes.
 * @param {string}   props.label       Control label.
 * @param {string}   props.placeholder Placeholder text.
 *
 * @return {Element} PostSelector component.
 */
export default function PostSelector({
	postType = '{{cpt_slug}}',
	value,
	onChange,
	label = __('Select Post', '{{textdomain}}'),
	placeholder = __('Search posts…', '{{textdomain}}'),
}) {
	const [search, setSearch] = useState('');

	const { posts, isLoading } = useSelect(
		(select) => {
			const queryArgs = {
				per_page: 20,
				search: search || undefined,
				_fields: 'id,title',
			};

			return {
				posts: select('core').getEntityRecords(
					'postType',
					postType,
					queryArgs
				),
				isLoading: select('core/data').isResolving(
					'core',
					'getEntityRecords',
					['postType', postType, queryArgs]
				),
			};
		},
		[postType, search]
	);

	const options =
		posts?.map((post) => ({
			value: post.id,
			label: post.title.rendered || __('(No title)', '{{textdomain}}'),
		})) || [];

	return (
		<div className="example_plugin-post-selector">
			{isLoading && <Spinner />}
			<ComboboxControl
				label={label}
				value={value}
				onChange={onChange}
				options={options}
				onFilterValueChange={(inputValue) => setSearch(inputValue)}
				placeholder={placeholder}
			/>
		</div>
	);
}
