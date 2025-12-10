/**
 * Gallery Component
 *
 * Display image galleries in blocks.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Gallery component.
 *
 * @param {Object}  props           Component props.
 * @param {Array}   props.images    Array of image objects.
 * @param {number}  props.columns   Number of columns.
 * @param {boolean} props.lightbox  Enable lightbox.
 * @param {string}  props.className Additional CSS class.
 *
 * @return {Element} Gallery component.
 */
export default function Gallery({
	images = [],
	columns = 3,
	lightbox = true,
	className = '',
}) {
	const [activeImage, setActiveImage] = useState(null);

	if (images.length === 0) {
		return null;
	}

	return (
		<>
			<div
				className={`example_plugin-gallery ${className}`}
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${columns}, 1fr)`,
					gap: '1rem',
				}}
			>
				{images.map((image, index) => (
					<figure
						key={image.id || index}
						className="example_plugin-gallery__item"
						style={{ margin: 0 }}
					>
						<button
							type="button"
							className="example_plugin-gallery__button"
							onClick={() => lightbox && setActiveImage(index)}
							style={{
								border: 'none',
								padding: 0,
								cursor: lightbox ? 'pointer' : 'default',
								width: '100%',
								display: 'block',
								background: 'none',
							}}
						>
							<img
								src={image.sizes?.medium?.url || image.url}
								alt={image.alt || ''}
								className="example_plugin-gallery__image"
								style={{
									width: '100%',
									height: 'auto',
									display: 'block',
								}}
							/>
						</button>
						{image.caption && (
							<figcaption className="example_plugin-gallery__caption">
								{image.caption}
							</figcaption>
						)}
					</figure>
				))}
			</div>

			{lightbox && activeImage !== null && (
				<div
					className="example_plugin-gallery__lightbox"
					onClick={() => setActiveImage(null)}
					onKeyDown={(e) =>
						e.key === 'Escape' && setActiveImage(null)
					}
					role="dialog"
					aria-modal="true"
					aria-label={__('Image lightbox', '{{textdomain}}')}
					tabIndex={-1}
					ref={(el) => el && el.focus()}
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.9)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 99999,
						outline: 'none',
					}}
				>
					<img
						src={images[activeImage].url}
						alt={images[activeImage].alt || ''}
						style={{
							maxWidth: '90%',
							maxHeight: '90%',
							objectFit: 'contain',
						}}
					/>
					<button
						className="example_plugin-gallery__lightbox-close"
						onClick={() => setActiveImage(null)}
						aria-label={__('Close lightbox', '{{textdomain}}')}
						style={{
							position: 'absolute',
							top: '1rem',
							right: '1rem',
							background: '#fff',
							border: 'none',
							padding: '0.5rem 1rem',
							cursor: 'pointer',
							borderRadius: '4px',
						}}
					>
						{__('Close', '{{textdomain}}')}
					</button>
				</div>
			)}
		</>
	);
}
