/*
 * @file edit.js
 * @description Block editor component for the example featured block.
 * @todo Add custom controls and improve accessibility.
 */
/**
 * Featured Items Block - Editor Component
 *
 * @package
  // Folder and file names should use mustache placeholders, e.g. src/blocks/{{block_slug}}-featured/edit.js
  
  import { __ } from '@wordpress/i18n';
  import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
  import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
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
			return select('core').getEntityRecords('postType', '{{cpt_slug}}', {
				per_page: count,
				meta_key: '{{namespace}}_featured',
				meta_value: '1',
				_embed: true,
			});
		},
		[count]
	);

	const blockProps = useBlockProps({
		className: `wp-block-{{namespace}}-{{block_slug}}-featured is-layout-${layout}`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', '{{textdomain}}')}>
					<RangeControl
						label={__('Number of Items', '{{textdomain}}')}
						value={count}
						onChange={(value) => setAttributes({ count: value })}
						min={1}
						max={6}
					/>
					<SelectControl
						label={__('Layout', '{{textdomain}}')}
						value={layout}
						options={[
							{
								label: __('Grid', '{{textdomain}}'),
								value: 'grid',
							},
							{
								label: __('Featured First', '{{textdomain}}'),
								value: 'featured-first',
							},
							{
								label: __('Hero', '{{textdomain}}'),
								value: 'hero',
							},
						]}
						onChange={(value) => setAttributes({ layout: value })}
					/>
				</PanelBody>
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
						label={__('Display Read More', '{{textdomain}}')}
						checked={displayReadMore}
						onChange={(value) =>
							setAttributes({ displayReadMore: value })
						}
					/>
					{displayReadMore && (
						<TextControl
							label={__('Read More Text', '{{textdomain}}')}
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
					<p className="wp-block-{{namespace}}-{{block_slug}}-featured__loading">
						{__('Loading…', '{{textdomain}}')}
					</p>
				)}
				{posts && posts.length === 0 && (
					<p className="wp-block-{{namespace}}-{{block_slug}}-featured__empty">
						{__(
							'No featured items found. Mark some as featured in the post editor.',
							'{{textdomain}}'
						)}
					</p>
				)}
				{posts && posts.length > 0 && (
					<div className="wp-block-{{namespace}}-{{block_slug}}-featured__items">
						{posts.map((post, index) => (
							<article
								key={post.id}
								className={`wp-block-{{namespace}}-{{block_slug}}-featured__item ${
									index === 0 && layout === 'featured-first'
										? 'is-primary'
										: ''
								}`}
							>
								{displayFeaturedImage &&
									post._embedded?.[
										'wp:featuredmedia'
									]?.[0] && (
										<div className="wp-block-{{namespace}}-{{block_slug}}-featured__image">
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
								<div className="wp-block-{{namespace}}-{{block_slug}}-featured__content">
									{displayTitle && (
										<h3 className="wp-block-{{namespace}}-{{block_slug}}-featured__title">
											{post.title.rendered}
										</h3>
									)}
									{displaySubtitle && (
										<p className="wp-block-{{namespace}}-{{block_slug}}-featured__subtitle">
											{__('Subtitle', '{{textdomain}}')}
										</p>
									)}
									{displayExcerpt && (
										<div
											className="wp-block-{{namespace}}-{{block_slug}}-featured__excerpt"
											dangerouslySetInnerHTML={{
												__html: post.excerpt.rendered,
											}}
										/>
									)}
									{displayMeta && (
										<div className="wp-block-{{namespace}}-{{block_slug}}-featured__meta">
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
											className="wp-block-{{namespace}}-{{block_slug}}-featured__read-more"
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
// ...existing code from edit.js for featured block...
