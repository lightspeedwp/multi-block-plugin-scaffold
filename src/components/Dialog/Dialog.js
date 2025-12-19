import { useState, useRef, useEffect } from 'react';

/**
 * {{name}} Dialog/Sheet/Drawer
 * Accessible modal/dialog for frontend use.
 * For editor, use WordPress Modal.
 * @param root0
 * @param root0.isOpen
 * @param root0.onClose
 * @param root0.title
 * @param root0.children
 */
export default function Dialog({ isOpen, onClose, title, children }) {
	const dialogRef = useRef(null);

	useEffect(() => {
		if (isOpen && dialogRef.current) {
			dialogRef.current.focus();
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="{{namespace}}-dialog"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabIndex={-1}
			ref={dialogRef}
		>
			<div className="{{namespace}}-dialog__content">
				<button
					onClick={onClose}
					aria-label={__('Close dialog', '{{textdomain}}')}
					className="{{namespace}}-dialog__close"
				>
					×
				</button>
				{title && <h2>{title}</h2>}
				{children}
			</div>
		</div>
	);
}
