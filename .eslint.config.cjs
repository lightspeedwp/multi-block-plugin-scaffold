module.exports = {
	extends: [ '@wordpress/eslint-plugin/recommended' ],
	env: {
		browser: true,
		es6: true,
		node: true,
		jquery: true,
		jest: true,
	},
	globals: {
		wp: 'readonly',
		wpApiSettings: 'readonly',
		ajaxurl: 'readonly',
	},
	rules: {
		'no-console': 'warn',
		'no-debugger': 'error',
	},
};
