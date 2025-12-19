import { useState, useRef, useEffect } from 'react';

/**
 * {{name}} Modal
 * Accessible modal dialog for frontend use.
 * For editor, use WordPress Modal.
 * @param root0
 * @param root0.isOpen
 * @param root0.onClose
 * @param root0.title
 * @param root0.children
 */
export default function Modal({ isOpen, onClose, title, children }) {
	const modalRef = useRef(null);

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus();
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="{{namespace}}-modal"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabIndex={-1}
			ref={modalRef}
		>
			<div className="{{namespace}}-modal__content">
				<button
					onClick={onClose}
					aria-label={__('Close modal', '{{textdomain}}')}
					className="{{namespace}}-modal__close"
				>
					×
				</button>
				{title && <h2>{title}</h2>}
				{children}
			</div>
		</div>
	);
}
