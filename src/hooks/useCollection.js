/**
 * useCollection Hook
 *
 * Custom hook for querying posts with filters.
 *
 * @package {{namespace}}
 */

import { useSelect } from '@wordpress/data';

/**
 * useCollection hook.
 *
 * @param {Object} query Query parameters.
 *
 * @return {Object} Posts, pagination info, and loading state.
 */
export default function useCollection( query = {} ) {
	const {
		postType = '{{slug}}',
		perPage = 6,
		page = 1,
		order = 'desc',
		orderBy = 'date',
		search = '',
		taxQuery = null,
		featured = false,
	} = query;

	return useSelect(
		( select ) => {
			const queryArgs = {
				per_page: perPage,
				page,
				order,
				orderby: orderBy,
				search: search || undefined,
				_embed: true,
			};

			// Add taxonomy query.
			if ( taxQuery ) {
				Object.entries( taxQuery ).forEach( ( [ taxonomy, termIds ] ) => {
					if ( termIds.length > 0 ) {
						queryArgs[ taxonomy ] = termIds;
					}
				} );
			}

			// Add featured meta query (if using REST API with meta query support).
			if ( featured ) {
				queryArgs.meta_key = '{{slug}}_featured';
				queryArgs.meta_value = '1';
			}

			const posts = select( 'core' ).getEntityRecords( 'postType', postType, queryArgs );
			const isLoading = select( 'core/data' ).isResolving( 'core', 'getEntityRecords', [
				'postType',
				postType,
				queryArgs,
			] );

			return {
				posts: posts || [],
				isLoading,
				hasNoPosts: posts && posts.length === 0,
			};
		},
		[ postType, perPage, page, order, orderBy, search, JSON.stringify( taxQuery ), featured ]
	);
}
