/**
 * {{name}} Typography helpers
 * Utility components for headings, text, etc.
 * @param root0
 * @param root0.level
 * @param root0.children
 */
export function Heading({ level = 2, children, ...props }) {
	const Tag = `h${level}`;
	return (
		<Tag className={`{{namespace}}-heading`} {...props}>
			{children}
		</Tag>
	);
}

export function Text({ children, ...props }) {
	return (
		<span className="{{namespace}}-text" {...props}>
			{children}
		</span>
	);
}
