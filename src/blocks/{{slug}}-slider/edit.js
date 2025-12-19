/**
 * @file edit.js
 * @description Block editor component for the example slider block.
 * @todo Add accessibility and responsive design improvements.
 */
/**
 * Example Plugin Slider Block - Editor Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
// Folder and file names should use mustache placeholders, e.g. src/blocks/{{slug}}-slider/edit.js
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
	Button,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Slider block edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 *
 * @return {Element} Block editor component.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		source,
		slides,
		autoplay,
		autoplaySpeed,
		showDots,
		showArrows,
		infinite,
		slidesToShow,
		slidesToScroll,
	} = attributes;

	const [currentSlide, setCurrentSlide] = useState(0);

	const addSlide = () => {
		const newSlides = [
			...slides,
			{
				id: Date.now(),
				image: null,
				title: '',
				caption: '',
				link: '',
			},
		];
		setAttributes({ slides: newSlides });
		setCurrentSlide(newSlides.length - 1);
	};

	const updateSlide = (index, updates) => {
		const newSlides = [...slides];
		newSlides[index] = { ...newSlides[index], ...updates };
			const blockProps = useBlockProps({
				className: 'wp-block-{{namespace}}-{{slug}}-slider',
			});
	const removeSlide = (index) => {
					<PanelBody title={__('Slider Source', '{{textdomain}}')}>
		setAttributes({ slides: newSlides });
						<SelectControl
							label={__('Slide Source', '{{textdomain}}')}
		}
								label: __('Custom Slides', '{{textdomain}}'),

								label: __('Posts', '{{textdomain}}'),
		className: 'wp-block-{{namespace}}-{{slug}}-slider',
								label: __('Repeater Field', '{{textdomain}}'),

					<PanelBody title={__('Slider Settings', '{{textdomain}}')}>
		<>
						<ToggleControl
							label={__('Autoplay', '{{textdomain}}')}
					<SelectControl
						{autoplay && (
							<RangeControl
								label={__('Autoplay Speed (ms)', '{{textdomain}}')}
							{
						<ToggleControl
							label={__('Show Dots', '{{textdomain}}')}
							},
						<ToggleControl
							label={__('Show Arrows', '{{textdomain}}')}
								value: 'posts',
						<ToggleControl
							label={__('Infinite Loop', '{{textdomain}}')}
								   label: __('Repeater Field', '{{textdomain}}'),
						<RangeControl
							label={__('Slides to Show', '{{textdomain}}')}
						]}
						<RangeControl
							label={__('Slides to Scroll', '{{textdomain}}')}
				</PanelBody>
						<div className="wp-block-{{namespace}}-{{slug}}-slider__viewport">
				   <PanelBody title={__('Slider Settings', '{{textdomain}}')}>
							<div className="wp-block-{{namespace}}-{{slug}}-slider__track">
							   label={__('Autoplay', '{{textdomain}}')}
								<div
									key={slide.id}
									className={`wp-block-{{namespace}}-{{slug}}-slider__slide ${
										index === currentSlide
											? 'is-active'
											: ''
									}`}
							onChange={(value) =>
									<div className="wp-block-{{namespace}}-{{slug}}-slider__image-wrapper"
							}
										<div className="wp-block-{{namespace}}-{{slug}}-slider__placeholder">
							max={10000}
											{__('Click to select image', '{{textdomain}}')}
						/>
									<div className="wp-block-{{namespace}}-{{slug}}-slider__slide-content">
					<ToggleControl
										<TextControl
											label={__(
												'Title',
												'{{textdomain}}'
											)}
							   label={__('Show Arrows', '{{textdomain}}')}
										<TextareaControl
											label={__(
												'Caption',
												'{{textdomain}}'
											)}
					<ToggleControl
										<TextControl
											label={__(
												'Link URL',
												'{{textdomain}}'
											)}
							   label={__('Slides to Show', '{{textdomain}}')}
									<Button
										isDestructive
										onClick={() =>
											removeSlide(index)
										}
										className="wp-block-{{namespace}}-{{slug}}-slider__remove-slide"
									>
										{__(
											'Remove Slide',
											'{{textdomain}}'
										)}
							setAttributes({ slidesToScroll: value })
									<div className="wp-block-{{namespace}}-{{slug}}-slider__empty">
						min={1}
										{__(
											'No slides added yet. Click the button below to add slides.',
											'{{textdomain}}'
										)}

									<div className="wp-block-{{namespace}}-{{slug}}-slider__nav">
				{source === 'custom' && (
										<button
											className={`wp-block-{{namespace}}-{{slug}}-slider__dot ${
												index === currentSlide
													? 'is-active'
													: ''
											}`}
											key={slide.id}
						<Button
							variant="primary"
							onClick={addSlide}
							className="wp-block-{{namespace}}-{{slug}}-slider__add-slide"
						>
							{__('Add Slide', '{{textdomain}}')}
						</Button>
													index === currentSlide
						<div className="wp-block-{{namespace}}-{{slug}}-slider__posts-notice">
														: 'none',
							{__(
								'Slider will display posts from the {{name}} post type.',
								'{{textdomain}}'
							)}
													onSelect={(media) =>
						<div className="wp-block-{{namespace}}-{{slug}}-slider__repeater-notice">
															image: {
							{__(
								'Slider will display slides from the repeater field.',
								'{{textdomain}}'
							)}
														})
													}
													allowedTypes={['image']}
													value={slide.image?.id}
													render={({ open }) => (
														<div
															   className="wp-block-{{namespace}}-{{slug}}-slider__image-wrapper"
															onClick={open}
															role="button"
															tabIndex={0}
															onKeyPress={(e) =>
																e.key ===
																	'Enter' &&
																open()
															}
														>
															{slide.image ? (
																<img
																	src={
																		slide
																			.image
																			.url
																	}
																	alt={
																		slide
																			.image
																			.alt ||
																		''
																	}
																/>
															) : (
																   <div className="wp-block-{{namespace}}-{{slug}}-slider__placeholder">
																	{__(
																		'Click to select image',
																		   '{{textdomain}}'
																	)}
																</div>
															)}
														</div>
													)}
												/>
											</MediaUploadCheck>

											   <div className="wp-block-{{namespace}}-{{slug}}-slider__slide-content">
												<TextControl
													label={__(
														'Title',
														   '{{textdomain}}'
													)}
													value={slide.title}
													onChange={(value) =>
														updateSlide(index, {
															title: value,
														})
													}
												/>
												<TextareaControl
													label={__(
														'Caption',
														   '{{textdomain}}'
													)}
													value={slide.caption}
													onChange={(value) =>
														updateSlide(index, {
															caption: value,
														})
													}
												/>
												<TextControl
													label={__(
														'Link URL',
														   '{{textdomain}}'
													)}
													value={slide.link}
													onChange={(value) =>
														updateSlide(index, {
															link: value,
														})
													}
													type="url"
												/>
											</div>

											<Button
												isDestructive
												onClick={() =>
													removeSlide(index)
												}
												   className="wp-block-{{namespace}}-{{slug}}-slider__remove-slide"
											>
												{__(
													'Remove Slide',
													   '{{textdomain}}'
												)}
											</Button>
										</div>
									))}
								</div>
							) : (
								   <div className="wp-block-{{namespace}}-{{slug}}-slider__empty">
									{__(
										'No slides added yet. Click the button below to add slides.',
										   '{{textdomain}}'
									)}
								</div>
							)}
						</div>

						{slides.length > 1 && (
							   <div className="wp-block-{{namespace}}-{{slug}}-slider__nav">
								{slides.map((_, index) => (
									<button
										key={index}
										   className={`wp-block-{{namespace}}-{{slug}}-slider__dot ${
											index === currentSlide
												? 'is-active'
												: ''
										}`}
										onClick={() => setCurrentSlide(index)}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>
						)}

						<Button
							variant="primary"
							onClick={addSlide}
							   className="wp-block-{{namespace}}-{{slug}}-slider__add-slide"
						>
							   {__('Add Slide', '{{textdomain}}')}
						</Button>
					</>
				)}

				{source === 'posts' && (
					   <div className="wp-block-{{namespace}}-{{slug}}-slider__posts-notice">
						{__(
							'Slider will display posts from the Example Plugin post type.',
							   '{{textdomain}}'
						)}
					</div>
				)}

				{source === 'repeater' && (
					   <div className="wp-block-{{namespace}}-{{slug}}-slider__repeater-notice">
						{__(
							'Slider will display slides from the repeater field.',
							   '{{textdomain}}'
						)}
					</div>
				)}
			</div>
		</>
	);
}
// ...existing code from edit.js for slider block...
