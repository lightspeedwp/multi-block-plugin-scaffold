// scripts/dry-run/dry-run-php.js
// Mustache: {{namespace}}, {{slug}}, {{textdomain}}
// Dry-run script for PHP unit tests
// TODO: Support conditional test suites (e.g. plugin vs block) when the suite grows.
const { execSync } = require('child_process');

/**
 * Execute the PHP unit tests as part of the dry-run validation workflow.
 *
 * @todo Allow opting in to specific phpunit groups once scaffolds expose them.
 * @return {void}
 */
function runDryRunPHP() {
  try {
    execSync('./vendor/bin/phpunit', { stdio: 'inherit' });
    console.log('PHP dry-run completed.');
    process.exit(0);
  } catch (err) {
    console.error('PHP dry-run failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runDryRunPHP();
}
