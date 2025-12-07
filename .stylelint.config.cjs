module.exports = {
	extends: [ '@wordpress/stylelint-config' ],
	rules: {
		'selector-class-pattern':
			'^wp-block-{{namespace}}-[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'apply',
					'layer',
					'responsive',
					'screen',
					'tailwind',
					'variants',
				],
			},
		],
		// Allow some selector specificity flexibility in complex block styles
		'no-descending-specificity': null,
	},
};
