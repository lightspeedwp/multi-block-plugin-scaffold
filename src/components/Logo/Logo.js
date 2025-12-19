/**
 * {{name}} Logo
 * Accessible logo component for WordPress blocks and frontend.
 */
export default function Logo({ src, alt = __('Logo', '{{textdomain}}'), ...props }) {
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
