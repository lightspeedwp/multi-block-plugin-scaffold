module.exports = {
	extends: [ '@wordpress/eslint-plugin/recommended' ],
	env: {
		browser: true,
		es6: true,
		node: true,
		jquery: true,
	},
	globals: {
		wp: 'readonly',
		wpApiSettings: 'readonly',
		ajaxurl: 'readonly',
	},
	rules: {
		'no-console': 'warn',
		'no-debugger': 'error',
		'jsdoc/check-tag-names': [
			'error',
			{
				definedTags: [ 'jest-environment' ],
			},
		],
	},
	overrides: [
		{
			files: [ '*.test.js', '*.spec.js' ],
			env: {
				jest: true,
			},
		},
	],
};
