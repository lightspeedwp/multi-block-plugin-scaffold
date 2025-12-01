/**
 * {{name}} Slider Block - Frontend View Script
 *
 * @package {{namespace}}
 */

( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		const sliders = document.querySelectorAll( '.wp-block-{{namespace}}-{{slug}}-slider' );

		sliders.forEach( function ( slider ) {
			initSlider( slider );
		} );
	} );

	/**
	 * Initialize a slider instance.
	 *
	 * @param {HTMLElement} slider Slider container element.
	 */
	function initSlider( slider ) {
		const track = slider.querySelector( '.wp-block-{{namespace}}-{{slug}}-slider__track' );
		const slides = slider.querySelectorAll( '.wp-block-{{namespace}}-{{slug}}-slider__slide' );
		const prevBtn = slider.querySelector( '.wp-block-{{namespace}}-{{slug}}-slider__arrow--prev' );
		const nextBtn = slider.querySelector( '.wp-block-{{namespace}}-{{slug}}-slider__arrow--next' );
		const dots = slider.querySelectorAll( '.wp-block-{{namespace}}-{{slug}}-slider__dot' );

		if ( ! track || slides.length === 0 ) {
			return;
		}

		// Parse settings from data attribute.
		let settings = {
			autoplay: false,
			autoplaySpeed: 5000,
			showDots: true,
			showArrows: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
		};

		try {
			const dataSettings = slider.getAttribute( 'data-slider' );
			if ( dataSettings ) {
				settings = { ...settings, ...JSON.parse( dataSettings ) };
			}
		} catch ( e ) {
			console.error( 'Error parsing slider settings:', e );
		}

		let currentIndex = 0;
		const totalSlides = slides.length;
		const maxIndex = Math.max( 0, totalSlides - settings.slidesToShow );
		let autoplayInterval = null;
		let isPlaying = settings.autoplay;

		/**
		 * Go to specific slide index.
		 *
		 * @param {number} index Slide index.
		 */
		function goToSlide( index ) {
			if ( settings.infinite ) {
				if ( index < 0 ) {
					index = maxIndex;
				} else if ( index > maxIndex ) {
					index = 0;
				}
			} else {
				index = Math.max( 0, Math.min( index, maxIndex ) );
			}

			currentIndex = index;
			const translateX = -currentIndex * ( 100 / settings.slidesToShow );
			track.style.transform = `translateX(${ translateX }%)`;

			updateDots();
			updateArrows();
		}

		/**
		 * Go to next slide.
		 */
		function nextSlide() {
			goToSlide( currentIndex + settings.slidesToScroll );
		}

		/**
		 * Go to previous slide.
		 */
		function prevSlide() {
			goToSlide( currentIndex - settings.slidesToScroll );
		}

		/**
		 * Update dot active states.
		 */
		function updateDots() {
			if ( ! dots.length ) {
				return;
			}

			dots.forEach( function ( dot, index ) {
				const dotIndex = index * settings.slidesToScroll;
				const isActive = currentIndex >= dotIndex &&
					currentIndex < dotIndex + settings.slidesToScroll;

				dot.classList.toggle( 'is-active', isActive || index === Math.floor( currentIndex / settings.slidesToScroll ) );
				dot.setAttribute( 'aria-selected', dot.classList.contains( 'is-active' ) );
			} );
		}

		/**
		 * Update arrow disabled states.
		 */
		function updateArrows() {
			if ( settings.infinite ) {
				return;
			}

			if ( prevBtn ) {
				prevBtn.disabled = currentIndex === 0;
			}
			if ( nextBtn ) {
				nextBtn.disabled = currentIndex >= maxIndex;
			}
		}

		/**
		 * Start autoplay.
		 */
		function startAutoplay() {
			if ( ! settings.autoplay || totalSlides <= settings.slidesToShow ) {
				return;
			}

			stopAutoplay();
			autoplayInterval = setInterval( nextSlide, settings.autoplaySpeed );
			isPlaying = true;
		}

		/**
		 * Stop autoplay.
		 */
		function stopAutoplay() {
			if ( autoplayInterval ) {
				clearInterval( autoplayInterval );
				autoplayInterval = null;
			}
			isPlaying = false;
		}

		// Event listeners.
		if ( prevBtn ) {
			prevBtn.addEventListener( 'click', function () {
				prevSlide();
				stopAutoplay();
			} );
		}

		if ( nextBtn ) {
			nextBtn.addEventListener( 'click', function () {
				nextSlide();
				stopAutoplay();
			} );
		}

		dots.forEach( function ( dot ) {
			dot.addEventListener( 'click', function () {
				const index = parseInt( dot.getAttribute( 'data-index' ), 10 ) || 0;
				goToSlide( index * settings.slidesToScroll );
				stopAutoplay();
			} );
		} );

		// Pause on hover.
		slider.addEventListener( 'mouseenter', function () {
			if ( isPlaying ) {
				stopAutoplay();
			}
		} );

		slider.addEventListener( 'mouseleave', function () {
			if ( settings.autoplay ) {
				startAutoplay();
			}
		} );

		// Keyboard navigation.
		slider.addEventListener( 'keydown', function ( event ) {
			if ( event.key === 'ArrowLeft' ) {
				prevSlide();
				stopAutoplay();
			} else if ( event.key === 'ArrowRight' ) {
				nextSlide();
				stopAutoplay();
			}
		} );

		// Touch/swipe support.
		let touchStartX = 0;
		let touchEndX = 0;

		slider.addEventListener( 'touchstart', function ( event ) {
			touchStartX = event.changedTouches[ 0 ].screenX;
		}, { passive: true } );

		slider.addEventListener( 'touchend', function ( event ) {
			touchEndX = event.changedTouches[ 0 ].screenX;
			handleSwipe();
		}, { passive: true } );

		/**
		 * Handle swipe gesture.
		 */
		function handleSwipe() {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;

			if ( Math.abs( diff ) > swipeThreshold ) {
				if ( diff > 0 ) {
					nextSlide();
				} else {
					prevSlide();
				}
				stopAutoplay();
			}
		}

		// Initialize.
		updateDots();
		updateArrows();
		startAutoplay();

		// Make slider focusable for keyboard navigation.
		slider.setAttribute( 'tabindex', '0' );
	}
} )();
