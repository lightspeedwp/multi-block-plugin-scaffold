/**
 * @file edit.js
 * @description Block editor component for the example featured block.
 * @todo Add custom controls and improve accessibility.
 */
/**
 * Featured Items Block - Editor Component
 *
 * @package
// Folder and file names should use mustache placeholders, e.g. src/blocks/{{slug}}-featured/edit.js

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
// Folder and file names should use mustache placeholders, e.g. src/blocks/{{slug}}-featured/edit.js
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
			return select('core').getEntityRecords('postType', 'item', {
				per_page: count,
				   meta_key: '{{namespace}}_featured',
				meta_value: '1',
				_embed: true,
			});
		},
		[count]
	);

	const blockProps = useBlockProps({
		className: `wp-block-{{namespace}}-{{slug}}-featured is-layout-${layout}`,
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
						onChange={(value) => setAttributes({ layout: value })}
									const blockProps = useBlockProps({
										className: `wp-block-{{namespace}}-{{slug}}-featured is-layout-${layout}`,
									});
				   <PanelBody title={__('Display Settings', '{{textdomain}}')}>
											<PanelBody title={__('Settings', '{{textdomain}}')}>
							   label={__('Display Featured Image', '{{textdomain}}')}
												<RangeControl
													label={__('Number of Items', '{{textdomain}}')}
							setAttributes({ displayFeaturedImage: value })
												<SelectControl
													label={__('Layout', '{{textdomain}}')}
					<ToggleControl
														label: __('Grid', '{{textdomain}}'),
						checked={displayTitle}
														label: __('Featured First', '{{textdomain}}'),
							setAttributes({ displayTitle: value })
														label: __('Hero', '{{textdomain}}'),
					/>
											<PanelBody title={__('Display Settings', '{{textdomain}}')}>
							   label={__('Display Subtitle', '{{textdomain}}')}
												<ToggleControl
													label={__('Display Featured Image', '{{textdomain}}')}
							setAttributes({ displaySubtitle: value })
												<ToggleControl
													label={__('Display Title', '{{textdomain}}')}
					<ToggleControl
												<ToggleControl
													label={__('Display Subtitle', '{{textdomain}}')}
						onChange={(value) =>
												<ToggleControl
													label={__('Display Excerpt', '{{textdomain}}')}
					/>
												<ToggleControl
													label={__('Display Meta', '{{textdomain}}')}
						checked={displayMeta}
												<ToggleControl
													label={__('Display Read More', '{{textdomain}}')}
						}
												{displayReadMore && (
													<TextControl
														label={__('Read More Text', '{{textdomain}}')}
						checked={displayReadMore}
												<p className="wp-block-{{namespace}}-{{slug}}-featured__loading">
							setAttributes({ displayReadMore: value })
													{__('Loading…', '{{textdomain}}')}
					/>
												<p className="wp-block-{{namespace}}-{{slug}}-featured__empty">
						<TextControl
													{__(
														'No featured items found. Mark some as featured in the post editor.',
														'{{textdomain}}'
													)}
							}
												<div className="wp-block-{{namespace}}-{{slug}}-featured__items">
					)}
													<article
														key={post.id}
														className={`wp-block-{{namespace}}-{{slug}}-featured__item ${
															index === 0 && layout === 'featured-first'
																? 'is-primary'
																: ''
														}`}
					</p>
														{displayFeaturedImage &&
															post._embedded?.[
																'wp:featuredmedia'
															]?.[0] && (
																<div className="wp-block-{{namespace}}-{{slug}}-featured__image">
							'No featured items found. Mark some as featured in the post editor.',
														<div className="wp-block-{{namespace}}-{{slug}}-featured__content">
						)}
															<h3 className="wp-block-{{namespace}}-{{slug}}-featured__title">
				)}
															<p className="wp-block-{{namespace}}-{{slug}}-featured__subtitle">
																{__('Subtitle', '{{textdomain}}')}
					   <div className="wp-block-{{namespace}}-{{slug}}-featured__items">
															<div
																className="wp-block-{{namespace}}-{{slug}}-featured__excerpt"
								key={post.id}
															<div className="wp-block-{{namespace}}-{{slug}}-featured__meta">
									index === 0 && layout === 'featured-first'
															<button
																type="button"
																className="wp-block-{{namespace}}-{{slug}}-featured__read-more"
							>
								{displayFeaturedImage &&
									post._embedded?.[
										'wp:featuredmedia'
									]?.[0] && (
										   <div className="wp-block-{{namespace}}-{{slug}}-featured__image">
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

								   <div className="wp-block-{{namespace}}-{{slug}}-featured__content">
									{displayTitle && (
										   <h3 className="wp-block-{{namespace}}-{{slug}}-featured__title">
											{post.title.rendered}
										</h3>
									)}

									{displaySubtitle && (
										   <p className="wp-block-{{namespace}}-{{slug}}-featured__subtitle">
											   {__('Subtitle', '{{textdomain}}')}
										</p>
									)}

									{displayExcerpt && (
										<div
											   className="wp-block-{{namespace}}-{{slug}}-featured__excerpt"
											dangerouslySetInnerHTML={{
												__html: post.excerpt.rendered,
											}}
										/>
									)}

									{displayMeta && (
										   <div className="wp-block-{{namespace}}-{{slug}}-featured__meta">
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
											   className="wp-block-{{namespace}}-{{slug}}-featured__read-more"
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
