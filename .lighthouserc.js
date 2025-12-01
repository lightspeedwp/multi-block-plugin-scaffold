/**
 * Lighthouse CI configuration
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
	ci: {
		collect: {
			// Test URLs - adjust based on your local WordPress setup
			url: [
				'http://localhost:8888', // Homepage
				'http://localhost:8888/sample-page/', // Sample page with block
			],
			numberOfRuns: 3, // Run each URL 3 times for more consistent results
			settings: {
				// Performance budget categories
				budgets: [
					{
						resourceSizes: [
							{
								resourceType: 'script',
								budget: 150, // KB
							},
							{
								resourceType: 'stylesheet',
								budget: 50, // KB
							},
							{
								resourceType: 'total',
								budget: 500, // KB
							},
						],
					},
				],
				// Emulate mobile device
				emulatedFormFactor: 'mobile',
				throttling: {
					rttMs: 40,
					throughputKbps: 10240,
					requestLatencyMs: 0,
					downloadThroughputKbps: 0,
					uploadThroughputKbps: 0,
					cpuSlowdownMultiplier: 1,
				},
			},
		},
		assert: {
			assertions: {
				// Performance assertions
				'categories:performance': ['warn', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.9 }],
				'categories:best-practices': ['warn', { minScore: 0.9 }],
				'categories:seo': ['warn', { minScore: 0.9 }],

				// Specific metric assertions
				'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
				'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
				'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['warn', { maxNumericValue: 300 }],

				// Resource size assertions
				'resource-summary:script:size': ['warn', { maxNumericValue: 153600 }], // 150 KB
				'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 51200 }], // 50 KB
			},
		},
		upload: {
			// Store reports locally
			target: 'filesystem',
			outputDir: './lighthouse-reports',
		},
	},
};
