import { useState, useEffect } from 'react';

/**
 * {{name}} Sonner (Toast)
 * Simple toast notification for frontend use.
 * For admin/editor, use WordPress snackbar.
 */
export function useSonner() {
	const [toasts, setToasts] = useState([]);

	const showToast = (message, options = {}) => {
		setToasts((prev) => [...prev, { message, ...options, id: Date.now() }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	const Toasts = () => (
		<div
			className="{{namespace}}-sonner-toasts"
			role="status"
			aria-live="polite"
		>
			{toasts.map((toast) => (
				<div key={toast.id} className="{{namespace}}-sonner-toast">
					{toast.message}
					<button
						onClick={() => removeToast(toast.id)}
						aria-label={__('Dismiss', '{{textdomain}}')}
					>
						×
					</button>
				</div>
			))}
		</div>
	);

	return { showToast, Toasts };
}
