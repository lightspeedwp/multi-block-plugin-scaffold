/**
 * Featured Items Block - Editor Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Featured block edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 *
 * @return {Element} Block editor component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		count,
		layout,
		displayFeaturedImage,
		displayTitle,
		displayExcerpt,
		displaySubtitle,
		displayMeta,
		displayReadMore,
		readMoreText,
	} = attributes;

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords(
				'postType',
				'example-plugin',
				{
					per_page: count,
					meta_key: 'example-plugin_featured',
					meta_value: '1',
					_embed: true,
				}
			);
		},
		[count]
	);

	const blockProps = useBlockProps({
		className: `wp-block-example_plugin-example-plugin-featured is-layout-${layout}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'example-plugin')}>
					<RangeControl
						label={__('Number of Items', 'example-plugin')}
						value={count}
						onChange={(value) => setAttributes({ count: value })}
						min={1}
						max={6}
					/>
					<SelectControl
						label={__('Layout', 'example-plugin')}
						value={layout}
						options={[
							{
								label: __('Grid', 'example-plugin'),
								value: 'grid',
							},
							{
								label: __('Featured First', 'example-plugin'),
								value: 'featured-first',
							},
							{
								label: __('Hero', 'example-plugin'),
								value: 'hero',
							},
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Display Settings', 'example-plugin')}>
					<ToggleControl
						label={__('Display Featured Image', 'example-plugin')}
						checked={displayFeaturedImage}
						onChange={(value) =>
							setAttributes({ displayFeaturedImage: value })
						}
					/>
					<ToggleControl
						label={__('Display Title', 'example-plugin')}
						checked={displayTitle}
						onChange={(value) =>
							setAttributes({ displayTitle: value })
						}
					/>
					<ToggleControl
						label={__('Display Subtitle', 'example-plugin')}
						checked={displaySubtitle}
						onChange={(value) =>
							setAttributes({ displaySubtitle: value })
						}
					/>
					<ToggleControl
						label={__('Display Excerpt', 'example-plugin')}
						checked={displayExcerpt}
						onChange={(value) =>
							setAttributes({ displayExcerpt: value })
						}
					/>
					<ToggleControl
						label={__('Display Meta', 'example-plugin')}
						checked={displayMeta}
						onChange={(value) =>
							setAttributes({ displayMeta: value })
						}
					/>
					<ToggleControl
						label={__('Display Read More', 'example-plugin')}
						checked={displayReadMore}
						onChange={(value) =>
							setAttributes({ displayReadMore: value })
						}
					/>
					{displayReadMore && (
						<TextControl
							label={__('Read More Text', 'example-plugin')}
							value={readMoreText}
							onChange={(value) =>
								setAttributes({ readMoreText: value })
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{posts === null && (
					<p className="wp-block-example_plugin-example-plugin-featured__loading">
						{__('Loading…', 'example-plugin')}
					</p>
				)}

				{posts && posts.length === 0 && (
					<p className="wp-block-example_plugin-example-plugin-featured__empty">
						{__(
							'No featured items found. Mark some as featured in the post editor.',
							'example-plugin'
						)}
					</p>
				)}

				{posts && posts.length > 0 && (
					<div className="wp-block-example_plugin-example-plugin-featured__items">
						{posts.map((post, index) => (
							<article
								key={post.id}
								className={`wp-block-example_plugin-example-plugin-featured__item ${
									index === 0 && layout === 'featured-first'
										? 'is-primary'
										: ''
								}`}
							>
								{displayFeaturedImage &&
									post._embedded?.[
										'wp:featuredmedia'
									]?.[0] && (
										<div className="wp-block-example_plugin-example-plugin-featured__image">
											<img
												src={
													post._embedded[
														'wp:featuredmedia'
													][0].source_url
												}
												alt={
													post._embedded[
														'wp:featuredmedia'
													][0].alt_text || ''
												}
											/>
										</div>
									)}

								<div className="wp-block-example_plugin-example-plugin-featured__content">
									{displayTitle && (
										<h3 className="wp-block-example_plugin-example-plugin-featured__title">
											{post.title.rendered}
										</h3>
									)}

									{displaySubtitle && (
										<p className="wp-block-example_plugin-example-plugin-featured__subtitle">
											{__('Subtitle', 'example-plugin')}
										</p>
									)}

									{displayExcerpt && (
										<div
											className="wp-block-example_plugin-example-plugin-featured__excerpt"
											dangerouslySetInnerHTML={{
												__html: post.excerpt.rendered,
											}}
										/>
									)}

									{displayMeta && (
										<div className="wp-block-example_plugin-example-plugin-featured__meta">
											<time>
												{new Date(
													post.date
												).toLocaleDateString()}
											</time>
										</div>
									)}

									{displayReadMore && (
										<button
											type="button"
											className="wp-block-example_plugin-example-plugin-featured__read-more"
											onClick={() => {
												const postUrl = post.link;
												if (postUrl) {
													window.location.href =
														postUrl;
												}
											}}
										>
											{readMoreText}
										</button>
									)}
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</>
	);
}
