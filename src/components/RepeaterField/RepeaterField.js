/**
 * Repeater Field Component
 *
 * Display ACF/SCF repeater field data in blocks.
 *
 * @package
 */

import { useSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';

/**
 * RepeaterField component.
 *
 * @param {Object}   props           Component props.
 * @param {number}   props.postId    Post ID.
 * @param {string}   props.fieldName Repeater field name.
 * @param {Function} props.renderRow Function to render each row.
 * @param {string}   props.className Additional CSS class.
 *
 * @return {Element} RepeaterField component.
 */
export default function RepeaterField({
	postId,
	fieldName,
	renderRow,
	className = '',
}) {
	const { rows, isLoading } = useSelect(
		(select) => {
			if (!postId || !fieldName) {
				return { rows: [], isLoading: false };
			}

			const post = select('core').getEntityRecord(
				'postType',
				'{{textdomain}}',
				postId
			);
			const fieldValue =
				post?.acf?.[fieldName] ?? post?.meta?.[fieldName] ?? null;

			return {
				rows: Array.isArray(fieldValue) ? fieldValue : [],
				isLoading: !post,
			};
		},
		[postId, fieldName]
	);

	if (isLoading) {
		return <Spinner />;
	}

	if (rows.length === 0) {
		return null;
	}

	return (
		<div className={`example_plugin-repeater-field ${className}`}>
			{rows.map((row, index) =>
				renderRow ? (
					renderRow(row, index)
				) : (
					<div
						key={index}
						className="example_plugin-repeater-field__row"
					>
						{Object.entries(row).map(([key, value]) => (
							<div
								key={key}
								className="example_plugin-repeater-field__field"
							>
								<strong>{key}:</strong> {String(value)}
							</div>
						))}
					</div>
				)
			)}
		</div>
	);
}
