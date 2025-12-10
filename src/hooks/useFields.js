/**
 * useFields Hook
 *
 * Custom hook for accessing ACF/SCF field values.
 *
 * @package
 */

import { useSelect } from '@wordpress/data';

/**
 * useFields hook.
 *
 * @param {number} postId   Post ID.
 * @param {string} postType Post type slug.
 *
 * @return {Object} Fields data and loading state.
 */
export default function useFields(postId, postType = '{{cpt_slug}}') {
	return useSelect(
		(select) => {
			if (!postId) {
				return { fields: {}, isLoading: false };
			}

			const post = select('core').getEntityRecord(
				'postType',
				postType,
				postId
			);
			const isLoading = select('core/data').isResolving(
				'core',
				'getEntityRecord',
				['postType', postType, postId]
			);

			// ACF fields are typically in the 'acf' object or in 'meta'.
			const fields = post?.acf || post?.meta || {};

			return { fields, isLoading };
		},
		[postId, postType]
	);
}
