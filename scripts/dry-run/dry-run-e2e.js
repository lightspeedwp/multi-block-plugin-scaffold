// scripts/dry-run/dry-run-e2e.js
// Mustache: {{namespace}}, {{slug}}, {{textdomain}}
// Dry-run script for E2E Playwright tests
// TODO: Allow overriding the target suite or Playwright options via CLI flags when needed.
const { execSync } = require('child_process');

/**
 * Execute the Playwright test suite under the dry-run configuration.
 *
 * @todo Allow filtering test groups once there are stable component suites.
 * @return {void}
 */
function runDryRunE2E() {
	const baseUrl = process.env.PLAYWRIGHT_E2E_URL;

	if (!baseUrl) {
		console.warn(
			'Playwright E2E dry-run skipped because PLAYWRIGHT_E2E_URL is not defined.'
		);
		process.exit(0);
	}

	const command = `npx playwright test tests/e2e/ --base-url=${baseUrl}`;

	try {
		execSync(command, { stdio: 'inherit' });
		console.log('E2E dry-run completed.');
		process.exit(0);
	} catch (err) {
		console.error('E2E dry-run failed:', err.message);
		process.exit(1);
	}
}

if (require.main === module) {
	runDryRunE2E();
}
