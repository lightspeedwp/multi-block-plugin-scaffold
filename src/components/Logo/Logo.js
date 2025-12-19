/**
 * {{name}} Logo
 * Accessible logo component for WordPress blocks and frontend.
 * @param root0
 * @param root0.src
 * @param root0.alt
 */
export default function Logo({
	src,
	alt = __('Logo', '{{textdomain}}'),
	...props
}) {
	return (
		<img
			src={src}
			alt={alt}
			className="{{namespace}}-logo"
			role="img"
			{...props}
		/>
	);
}
