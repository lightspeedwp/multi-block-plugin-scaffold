/**
 * {{name}} Collection Block - Frontend View Script
 *
 * @package {{namespace}}
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const sliders = document.querySelectorAll(
		'.wp-block-{{namespace}}-{{slug}}-collection.is-layout-slider'
	);

	sliders.forEach( ( slider ) => {
		const itemsContainer = slider.querySelector(
			'.wp-block-{{namespace}}-{{slug}}-collection__items'
		);

		if ( ! itemsContainer ) {
			return;
		}

		// Add smooth scroll behavior.
		itemsContainer.style.scrollBehavior = 'smooth';

		// Optional: Add navigation buttons dynamically.
		const prevBtn = document.createElement( 'button' );
		prevBtn.className = 'wp-block-{{namespace}}-{{slug}}-collection__nav-prev';
		prevBtn.innerHTML = '&lsaquo;';
		prevBtn.setAttribute( 'aria-label', 'Previous' );

		const nextBtn = document.createElement( 'button' );
		nextBtn.className = 'wp-block-{{namespace}}-{{slug}}-collection__nav-next';
		nextBtn.innerHTML = '&rsaquo;';
		nextBtn.setAttribute( 'aria-label', 'Next' );

		prevBtn.addEventListener( 'click', () => {
			const scrollAmount = itemsContainer.offsetWidth * 0.8;
			itemsContainer.scrollLeft -= scrollAmount;
		} );

		nextBtn.addEventListener( 'click', () => {
			const scrollAmount = itemsContainer.offsetWidth * 0.8;
			itemsContainer.scrollLeft += scrollAmount;
		} );

		slider.appendChild( prevBtn );
		slider.appendChild( nextBtn );
	} );
} );
