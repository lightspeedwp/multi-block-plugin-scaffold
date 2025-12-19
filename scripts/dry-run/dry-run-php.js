// scripts/dry-run/dry-run-php.js
// Mustache: {{namespace}}, {{slug}}, {{textdomain}}
// Dry-run script for PHP unit tests
// TODO: Support conditional test suites (e.g. plugin vs block) when the suite grows.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Execute the PHP unit tests as part of the dry-run validation workflow.
 *
 * @todo Allow opting in to specific phpunit groups once scaffolds expose them.
 * @return {void}
 */
function runDryRunPHP() {
	const testsDir =
		process.env.WP_TESTS_DIR || path.join(os.tmpdir(), 'wordpress-tests-lib');
	const functionsPath = path.join(testsDir, 'includes', 'functions.php');

	if (!fs.existsSync(functionsPath)) {
		console.warn(
			`WordPress PHPUnit suite not found (${functionsPath}); skipping PHP dry-run.`
		);
		process.exit(0);
	}

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
