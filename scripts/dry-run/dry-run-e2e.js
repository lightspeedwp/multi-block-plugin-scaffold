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
  try {
    execSync('playwright test tests/e2e/', { stdio: 'inherit' });
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
