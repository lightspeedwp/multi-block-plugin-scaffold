/**
 * useSlider Hook
 *
 * Custom hook for managing slider state.
 *
 * @package
 */

import { useState, useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * useSlider hook.
 *
 * @param {Object}  options                Slider options.
 * @param {number}  options.totalSlides    Total number of slides.
 * @param {number}  options.slidesToShow   Slides visible at once.
 * @param {number}  options.slidesToScroll Slides to scroll per action.
 * @param {boolean} options.infinite       Enable infinite loop.
 * @param {boolean} options.autoplay       Enable autoplay.
 * @param {number}  options.autoplaySpeed  Autoplay interval in ms.
 *
 * @return {Object} Slider state and controls.
 */
export default function useSlider({
	totalSlides = 0,
	slidesToShow = 1,
	slidesToScroll = 1,
	infinite = true,
	autoplay = false,
	autoplaySpeed = 5000,
} = {}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoplay);
	const autoplayRef = useRef(null);

	const maxIndex = Math.max(0, totalSlides - slidesToShow);

	const nextSlide = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev >= maxIndex) {
				return infinite ? 0 : prev;
			}
			return Math.min(prev + slidesToScroll, maxIndex);
		});
	}, [maxIndex, infinite, slidesToScroll]);

	const prevSlide = useCallback(() => {
		setCurrentIndex((prev) => {
			if (prev <= 0) {
				return infinite ? maxIndex : 0;
			}
			return Math.max(prev - slidesToScroll, 0);
		});
	}, [maxIndex, infinite, slidesToScroll]);

	const goToSlide = useCallback(
		(index) => {
			setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
		},
		[maxIndex]
	);

	const play = useCallback(() => setIsPlaying(true), []);
	const pause = useCallback(() => setIsPlaying(false), []);

	// Autoplay effect.
	useEffect(() => {
		if (isPlaying && totalSlides > slidesToShow) {
			autoplayRef.current = setInterval(nextSlide, autoplaySpeed);
		}

		return () => {
			if (autoplayRef.current) {
				clearInterval(autoplayRef.current);
			}
		};
	}, [isPlaying, nextSlide, autoplaySpeed, totalSlides, slidesToShow]);

	return {
		currentIndex,
		maxIndex,
		isPlaying,
		nextSlide,
		prevSlide,
		goToSlide,
		play,
		pause,
		canGoPrev: infinite || currentIndex > 0,
		canGoNext: infinite || currentIndex < maxIndex,
	};
}
