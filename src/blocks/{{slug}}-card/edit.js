/**
 * Example Plugin Card Block - Editor Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Card block edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @param {Object}   props.context       Block context.
 *
 * @return {Element} Block editor component.
 */
export default function Edit({ attributes, setAttributes, context }) {
	const {
		displayFeaturedImage,
		displayTitle,
		displayExcerpt,
		displayMeta,
		displaySubtitle,
		linkToPost,
	} = attributes;

	const postId = context.postId;

	const post = useSelect(
		(select) => {
			if (!postId) {
				return null;
			}
			return select('core').getEntityRecord(
				'postType',
				context.postType || '{{textdomain}}',
				postId
			);
		},
		[postId, context.postType]
	);

	const featuredMedia = useSelect(
		(select) => {
			if (!post?.featured_media) {
				return null;
			}
			return select('core').getMedia(post.featured_media);
		},
		[post?.featured_media]
	);

	const blockProps = useBlockProps({
		className: 'wp-block-{{namespace}}-{{slug}}-card',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Display Settings', '{{textdomain}}')}>
					<ToggleControl
						label={__('Display Featured Image', '{{textdomain}}')}
						checked={displayFeaturedImage}
						onChange={(value) =>
							setAttributes({ displayFeaturedImage: value })
						}
					/>
					<ToggleControl
						label={__('Display Title', '{{textdomain}}')}
						checked={displayTitle}
						onChange={(value) =>
							setAttributes({ displayTitle: value })
						}
					/>
					<ToggleControl
						label={__('Display Subtitle', '{{textdomain}}')}
						checked={displaySubtitle}
						onChange={(value) =>
							setAttributes({ displaySubtitle: value })
						}
					/>
					<ToggleControl
						label={__('Display Excerpt', '{{textdomain}}')}
						checked={displayExcerpt}
						onChange={(value) =>
							setAttributes({ displayExcerpt: value })
						}
					/>
					<ToggleControl
						label={__('Display Meta', '{{textdomain}}')}
						checked={displayMeta}
						onChange={(value) =>
							setAttributes({ displayMeta: value })
						}
					/>
					<ToggleControl
						label={__('Link to Post', '{{textdomain}}')}
						checked={linkToPost}
						onChange={(value) =>
							setAttributes({ linkToPost: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{displayFeaturedImage && featuredMedia && (
					<div className="wp-block-{{namespace}}-{{slug}}-card__image">
						<img
							src={featuredMedia.source_url}
							alt={featuredMedia.alt_text || ''}
						/>
					</div>
				)}

				<div className="wp-block-{{namespace}}-{{slug}}-card__content">
					{displayTitle && post && (
						<h3 className="wp-block-{{namespace}}-{{slug}}-card__title">
							{post.title?.rendered ||
								__('Untitled', '{{textdomain}}')}
						</h3>
					)}

					{displaySubtitle && (
						<p className="wp-block-{{namespace}}-{{slug}}-card__subtitle">
							{__('Subtitle placeholder', '{{textdomain}}')}
						</p>
					)}

					{displayExcerpt && post && (
						<div
							className="wp-block-{{namespace}}-{{slug}}-card__excerpt"
							dangerouslySetInnerHTML={{
								__html: post.excerpt?.rendered || '',
							}}
						/>
					)}

					{displayMeta && post && (
						<div className="wp-block-{{namespace}}-{{slug}}-card__meta">
							<span className="wp-block-{{namespace}}-{{slug}}-card__date">
								{new Date(post.date).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>

				{!post && (
					<p className="wp-block-{{namespace}}-{{slug}}-card__placeholder">
						{__('Select a post to display.', '{{textdomain}}')}
					</p>
				)}
			</div>
		</>
	);
}
