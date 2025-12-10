module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	env: {
		browser: true,
		es6: true,
		node: true,
		jquery: true,
		jest: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
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
