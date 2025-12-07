/**
 * useTaxonomies Hook
 *
 * Custom hook for fetching taxonomy terms.
 *
 * @package {{namespace}}
 */

import { useSelect } from '@wordpress/data';

/**
 * useTaxonomies hook.
 *
 * @param {string} taxonomy Taxonomy slug.
 * @param {Object} args     Query arguments.
 *
 * @return {Object} Terms data and loading state.
 */
export default function useTaxonomies( taxonomy = '{{slug}}_category', args = {} ) {
	return useSelect(
		( select ) => {
			const queryArgs = {
				per_page: 100,
				hide_empty: false,
				...args,
			};

			const terms = select( 'core' ).getEntityRecords( 'taxonomy', taxonomy, queryArgs );
			const isLoading = select( 'core/data' ).isResolving( 'core', 'getEntityRecords', [
				'taxonomy',
				taxonomy,
				queryArgs,
			] );

			return { terms, isLoading };
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ taxonomy, JSON.stringify( args ) ]
	);
}
