/**
 * usePostType Hook
 *
 * Custom hook for fetching post type data.
 *
 * @package
 */

import { useSelect } from '@wordpress/data';

/**
 * usePostType hook.
 *
 * @param {number} postId   Post ID.
 * @param {string} postType Post type slug.
 *
 * @return {Object} Post data and loading state.
 */
export default function usePostType(postId, postType = '{{cpt_slug}}') {
	return useSelect(
		(select) => {
			if (!postId) {
				return { post: null, isLoading: false };
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

			return { post, isLoading };
		},
		[postId, postType]
	);
}
