/**
 * useRepeater Hook
 *
 * Custom hook for accessing ACF/SCF repeater field data.
 *
 * @package {{namespace}}
 */

import { useSelect } from '@wordpress/data';

/**
 * useRepeater hook.
 *
 * @param {number} postId    Post ID.
 * @param {string} fieldName Repeater field name.
 * @param {string} postType  Post type slug.
 *
 * @return {Object} Repeater rows and loading state.
 */
export default function useRepeater( postId, fieldName, postType = '{{slug}}' ) {
	return useSelect(
		( select ) => {
			if ( ! postId || ! fieldName ) {
				return { rows: [], isLoading: false };
			}

			const post = select( 'core' ).getEntityRecord( 'postType', postType, postId );
			const isLoading = select( 'core/data' ).isResolving( 'core', 'getEntityRecord', [
				'postType',
				postType,
				postId,
			] );

			const fieldValue = post?.acf?.[ fieldName ] ?? post?.meta?.[ fieldName ] ?? null;
			const rows = Array.isArray( fieldValue ) ? fieldValue : [];

			return { rows, isLoading };
		},
		[ postId, fieldName, postType ]
	);
}
