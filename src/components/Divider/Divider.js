/**
 * {{name}} Divider
 * Accessible divider for WordPress blocks and frontend.
 */
export default function Divider({ label }) {
	return (
		<hr className="{{namespace}}-divider" aria-label={label} />
	);
}
