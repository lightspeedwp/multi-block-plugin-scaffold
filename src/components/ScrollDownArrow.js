/**
 * {{name}} ScrollDownArrow
 * Decorative scroll-down arrow with smooth scroll.
 * @param root0
 * @param root0.target
 * @param root0.label
 */
export default function ScrollDownArrow({
	target = '#maincontent',
	label = __('Scroll down', '{{textdomain}}'),
}) {
	const handleClick = (e) => {
		e.preventDefault();
		const el = document.querySelector(target);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	};
	return (
		<button
			className="{{namespace}}-scroll-down-arrow"
			onClick={handleClick}
			aria-label={label}
		>
			<span aria-hidden="true">↓</span>
		</button>
	);
}
