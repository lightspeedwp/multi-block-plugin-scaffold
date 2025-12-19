/**
 * {{name}} SkipLink
 * Accessible skip to main content link for WordPress blocks and frontend.
 */
export default function SkipLink({ target = '#maincontent', label = __('Skip to main content', '{{textdomain}}') }) {
	return (
		<a href={target} className="{{namespace}}-skip-link sr-only" tabIndex={0}>
			{label}
		</a>
	);
}
