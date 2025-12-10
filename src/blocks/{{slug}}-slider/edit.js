/**
 * Example Plugin Slider Block - Editor Component
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
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
		setAttributes({ slides: newSlides });
	};

	const removeSlide = (index) => {
		const newSlides = slides.filter((_, i) => i !== index);
		setAttributes({ slides: newSlides });
		if (currentSlide >= newSlides.length) {
			setCurrentSlide(Math.max(0, newSlides.length - 1));
		}
	};

	const blockProps = useBlockProps({
		className: 'wp-block-example_plugin-example-plugin-slider',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Slider Source', '{{textdomain}}')}>
					<SelectControl
						label={__('Slide Source', '{{textdomain}}')}
						value={source}
						options={[
							{
								label: __('Custom Slides', '{{textdomain}}'),
								value: 'custom',
							},
							{
								label: __('Posts', '{{textdomain}}'),
								value: 'posts',
							},
							{
								label: __('Repeater Field', '{{textdomain}}'),
								value: 'repeater',
							},
						]}
						onChange={(value) => setAttributes({ source: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Slider Settings', '{{textdomain}}')}>
					<ToggleControl
						label={__('Autoplay', '{{textdomain}}')}
						checked={autoplay}
						onChange={(value) => setAttributes({ autoplay: value })}
					/>
					{autoplay && (
						<RangeControl
							label={__('Autoplay Speed (ms)', '{{textdomain}}')}
							value={autoplaySpeed}
							onChange={(value) =>
								setAttributes({ autoplaySpeed: value })
							}
							min={1000}
							max={10000}
							step={500}
						/>
					)}
					<ToggleControl
						label={__('Show Dots', '{{textdomain}}')}
						checked={showDots}
						onChange={(value) => setAttributes({ showDots: value })}
					/>
					<ToggleControl
						label={__('Show Arrows', '{{textdomain}}')}
						checked={showArrows}
						onChange={(value) =>
							setAttributes({ showArrows: value })
						}
					/>
					<ToggleControl
						label={__('Infinite Loop', '{{textdomain}}')}
						checked={infinite}
						onChange={(value) => setAttributes({ infinite: value })}
					/>
					<RangeControl
						label={__('Slides to Show', '{{textdomain}}')}
						value={slidesToShow}
						onChange={(value) =>
							setAttributes({ slidesToShow: value })
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Slides to Scroll', '{{textdomain}}')}
						value={slidesToScroll}
						onChange={(value) =>
							setAttributes({ slidesToScroll: value })
						}
						min={1}
						max={slidesToShow}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{source === 'custom' && (
					<>
						<div className="wp-block-example_plugin-example-plugin-slider__viewport">
							{slides.length > 0 ? (
								<div className="wp-block-example_plugin-example-plugin-slider__track">
									{slides.map((slide, index) => (
										<div
											key={slide.id}
											className={`wp-block-example_plugin-example-plugin-slider__slide ${
												index === currentSlide
													? 'is-active'
													: ''
											}`}
											style={{
												display:
													index === currentSlide
														? 'block'
														: 'none',
											}}
										>
											<MediaUploadCheck>
												<MediaUpload
													onSelect={(media) =>
														updateSlide(index, {
															image: {
																id: media.id,
																url: media.url,
																alt: media.alt,
															},
														})
													}
													allowedTypes={['image']}
													value={slide.image?.id}
													render={({ open }) => (
														<div
															className="wp-block-example_plugin-example-plugin-slider__image-wrapper"
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
																<div className="wp-block-example_plugin-example-plugin-slider__placeholder">
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

											<div className="wp-block-example_plugin-example-plugin-slider__slide-content">
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
												className="wp-block-example_plugin-example-plugin-slider__remove-slide"
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
								<div className="wp-block-example_plugin-example-plugin-slider__empty">
									{__(
										'No slides added yet. Click the button below to add slides.',
										'{{textdomain}}'
									)}
								</div>
							)}
						</div>

						{slides.length > 1 && (
							<div className="wp-block-example_plugin-example-plugin-slider__nav">
								{slides.map((_, index) => (
									<button
										key={index}
										className={`wp-block-example_plugin-example-plugin-slider__dot ${
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
							className="wp-block-example_plugin-example-plugin-slider__add-slide"
						>
							{__('Add Slide', '{{textdomain}}')}
						</Button>
					</>
				)}

				{source === 'posts' && (
					<div className="wp-block-example_plugin-example-plugin-slider__posts-notice">
						{__(
							'Slider will display posts from the Example Plugin post type.',
							'{{textdomain}}'
						)}
					</div>
				)}

				{source === 'repeater' && (
					<div className="wp-block-example_plugin-example-plugin-slider__repeater-notice">
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
