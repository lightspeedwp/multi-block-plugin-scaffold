/**
 * {{name}} LoadingSpinner
 * Accessible loading spinner for WordPress blocks and frontend.
 * @param root0
 * @param root0.label
 */
export default function LoadingSpinner({
	label = __('Loading…', '{{textdomain}}'),
}) {
	return (
		<div
			className="{{namespace}}-loading-spinner"
			role="status"
			aria-live="polite"
		>
			<span className="{{namespace}}-spinner" aria-hidden="true">
				⏳
			</span>
			<span className="{{namespace}}-loading-label">{label}</span>
		</div>
	);
}
