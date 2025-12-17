// Detect maximum dry run mode
function isMaximumDryRun(argv) {
	return (
		process.env.DRY_RUN === 'maximum' ||
		argv.includes('--dry-run=maximum') ||
		argv.includes('--max-dry-run')
	);
}
#!/usr/bin/env node
/* eslint-disable no-console, jsdoc/require-param-type */

/**
 * Release Agent Implementation
 *
 * Automated release validation and preparation assistant for the
 * Multi-Block Plugin Scaffold, following the specification in
 * .github/agents/release.agent.md
 *
 * Usage:
 *   node scripts/release.agent.js [command]
 *
 * Commands:
 *   validate    - Run full validation suite
 *   version     - Check version consistency
 *   quality     - Run quality gates (lint, format, dry-run tests)
 *   docs        - Verify documentation
 *   generate    - Validate generator configuration
 *   security    - Run security audit
 *   status      - Quick readiness status
 *   report      - Generate full readiness report
 *
 * Or from npm:
 *   npm run release:validate
 *   npm run release:status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// Color output helpers
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m',
};

/**
 * Output a log message using the provided colour.
 *
 * @param {string} color Colour escape sequence prefix.
 * @param {...any} args Additional values to log.
 * @return {void}
 */
function log(color, ...args) {
	console.log(color, ...args, colors.reset);
}

/**
 * Log an error-level message.
 *
 * @param {...any} args Error message segments.
 * @return {void}
 */
function error(...args) {
	log(colors.red, '❌', ...args);
}

/**
 * Log a success-level message.
 *
 * @param {...any} args Success message segments.
 * @return {void}
 */
function success(...args) {
	log(colors.green, '✅', ...args);
}

/**
 * Log a warning-level message.
 *
 * @param {...any} args Warning message segments.
 * @return {void}
 */
function warning(...args) {
	log(colors.yellow, '⚠️ ', ...args);
}

/**
 * Log an informational message.
 *
 * @param {...any} args Info message segments.
 * @return {void}
 */
function info(...args) {
	log(colors.blue, 'ℹ', ...args);
}

/**
 * Print a stylised header block for major sections.
 *
 * @param {string} text Header title text.
 * @return {void}
 */
function header(text) {
	console.log(
		'\n' + colors.magenta + colors.bold + '═'.repeat(60) + colors.reset
	);
	log(colors.magenta + colors.bold, text);
	console.log(
		colors.magenta + colors.bold + '═'.repeat(60) + colors.reset + '\n'
	);
}

// Validation state tracker
const validationResults = {
	critical: [],
	warnings: [],
	passed: [],
	failed: [],
};

/**
 * Record the outcome of a validation check.
 *
 * @param {string} type Result type (critical/important/etc.).
 * @param {string} category Result category (e.g., version, quality).
 * @param {string} message Descriptive message for the result.
 * @param {string} [status='pass'] Status indicator.
 * @return {void}
 */
function addResult(type, category, message, status = 'pass') {
	const result = { category, message, status };

	if (status === 'pass') {
		validationResults.passed.push(result);
	} else if (status === 'fail') {
		validationResults.failed.push(result);
		if (type === 'critical') {
			validationResults.critical.push(result);
		}
	} else if (status === 'warn') {
		validationResults.warnings.push(result);
	}
}

/**
 * Execute a shell command and capture its result.
 *
 * @param {string} command Shell command string.
 * @param {Object} [options={}] execSync options.
 * @return {{success: boolean, output?: string, error?: string}} Result object.
 */
function runCommand(command, options = {}) {
	try {
		const output = execSync(command, {
			encoding: 'utf8',
			stdio: options.silent ? 'pipe' : 'inherit',
			...options,
		});
		return { success: true, output };
	} catch (err) {
		return { success: false, error: err.message, output: err.stdout };
	}
}

// Helpers for version detection
/**
 * Locate the primary plugin PHP file by searching for a Plugin Name header.
 *
 * @param {string} rootDir Directory to search in.
 * @return {string|null} Path when found or null.
 */
function findPluginFile(rootDir) {
	const phpFiles = fs
		.readdirSync(rootDir)
		.filter((file) => file.endsWith('.php') && file !== 'uninstall.php');
	for (const file of phpFiles) {
		const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
		if (/Plugin Name:/i.test(content)) {
			return path.join(rootDir, file);
		}
	}
	return null;
}

/**
 * Extract the version declared inside the plugin header comment block.
 *
 * @param {string} content File contents to scan.
 * @return {string|null} Version string if present, otherwise null.
 */
function extractHeaderVersion(content) {
	const match = content.match(/Version:\s*([\\d.]+(?:-[A-Za-z0-9.-]+)?)/);
	return match ? match[1] : null;
}

/**
 * Extract the `_VERSION` constant value from the plugin file.
 *
 * @param {string} content File contents to scan.
 * @return {string|null} Constant value or null.
 */
function extractConstantVersion(content) {
	const match = content.match(/_VERSION',\s*'([^']+)'/);
	return match ? match[1] : null;
}

// Version consistency check
/**
 * Verify that all version references across files match.
 *
 * @return {{success: boolean, version?: string, versions?: Object, error?: string}} Summary of consistency check.
 */
function checkVersionConsistency() {
	info('Checking version consistency...');

	const rootDir = path.resolve(__dirname, '..');
	const versions = {};

	try {
		const versionFile = path.join(rootDir, 'VERSION');
		if (fs.existsSync(versionFile)) {
			versions.VERSION = fs.readFileSync(versionFile, 'utf8').trim();
		}

		const packageFile = path.join(rootDir, 'package.json');
		if (fs.existsSync(packageFile)) {
			const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
			versions['package.json'] = pkg.version;
		}

		const pluginFile = findPluginFile(rootDir);
		if (pluginFile) {
			const pluginContent = fs.readFileSync(pluginFile, 'utf8');
			versions[path.basename(pluginFile)] =
				extractHeaderVersion(pluginContent);
			versions[`${path.basename(pluginFile)} constant`] =
				extractConstantVersion(pluginContent);
		} else {
			warning('Plugin main file not found; cannot verify header version');
			addResult(
				'important',
				'version',
				'Plugin main file missing',
				'warn'
			);
		}

		const readmePath = path.join(rootDir, 'readme.txt');
		if (fs.existsSync(readmePath)) {
			const readmeContent = fs.readFileSync(readmePath, 'utf8');
			const stableMatch = readmeContent.match(
				/Stable tag:\s*([\\w.-]+)/i
			);
			versions['readme.txt stable tag'] = stableMatch
				? stableMatch[1]
				: null;
		}

		const blockJsonFiles = glob.sync(
			path.join(rootDir, 'src/blocks/**/block.json')
		);
		if (blockJsonFiles.length > 0) {
			blockJsonFiles.forEach((file) => {
				try {
					const block = JSON.parse(fs.readFileSync(file, 'utf8'));
					versions[path.relative(rootDir, file)] = block.version;
				} catch (err) {
					warning(
						`Unable to read version from ${file}: ${err.message}`
					);
					addResult(
						'important',
						'version',
						`Invalid block.json at ${file}`,
						'warn'
					);
				}
			});
		}

		const targetVersion = versions.VERSION || versions['package.json'];
		const allMatch =
			targetVersion &&
			Object.values(versions).every((v) => v === targetVersion);

		if (allMatch) {
			success(`Version consistency: ${targetVersion}`);
			addResult(
				'critical',
				'version',
				`All version files match: ${targetVersion}`,
				'pass'
			);
			return { success: true, version: targetVersion };
		}

		error('Version mismatch detected:');
		Object.entries(versions).forEach(([file, ver]) => {
			console.log(`  ${file}: ${ver}`);
		});
		addResult('critical', 'version', 'Version files do not match', 'fail');
		return { success: false, versions };
	} catch (err) {
		error(`Failed to check versions: ${err.message}`);
		addResult(
			'critical',
			'version',
			`Version check failed: ${err.message}`,
			'fail'
		);
		return { success: false, error: err.message };
	}
}

// Quality gates validation
/**
 * Run linting, formatting, and test suites that guard release quality.
 *
 * @return {boolean} True when critical quality gates passed.
 */
function checkQualityGates() {
	header('Quality Gates');

	let allPassed = true;

	// Linting (dry-run replaces mustache safely)
	info('Running linting (dry-run)...');
	const lintResult = runCommand('npm run lint:dry-run', { silent: true });
	if (lintResult.success) {
		success('Linting: PASSED');
		addResult('critical', 'quality', 'Linting passed', 'pass');
	} else {
		error('Linting: FAILED');
		addResult('critical', 'quality', 'Linting failed', 'fail');
		allPassed = false;
	}

	// Format check
	info('Checking code formatting...');
	const formatResult = runCommand('npm run format -- --check', {
		silent: true,
	});
	if (
		formatResult.success ||
		formatResult.output?.includes('All matched files')
	) {
		success('Formatting: PASSED');
		addResult('important', 'quality', 'Code properly formatted', 'pass');
	} else {
		warning('Formatting: needs attention');
		addResult(
			'important',
			'quality',
			'Code formatting inconsistent',
			'warn'
		);
	}

	// Dry-run tests (JS, CSS, unit placeholders)
	info('Running dry-run tests...');
	const testResult = runCommand('npm run dry-run:all', { silent: true });
	if (testResult.success) {
		success('Dry-run tests: PASSED');
		addResult('critical', 'quality', 'Dry-run tests passed', 'pass');
	} else {
		error('Dry-run tests: FAILED');
		addResult('critical', 'quality', 'Dry-run tests failed', 'fail');
		allPassed = false;
	}

	// PHP unit tests (optional but recommended)
	info('Running PHP unit tests...');
	const phpTestResult = runCommand('npm run test:php', { silent: true });
	if (phpTestResult.success) {
		success('PHP unit tests: PASSED');
		addResult('important', 'quality', 'PHP unit tests passed', 'pass');
	} else {
		warning('PHP unit tests: FAILED');
		addResult('important', 'quality', 'PHP unit tests failed', 'warn');
	}

	return allPassed;
}

// Documentation verification
/**
 * Validate presence and quality of documentation files.
 *
 * @return {void}
 */
function checkDocumentation() {
	header('Documentation Verification');

	// TODO: Include CHANGELOG.md, instructions, and other docs in this verification pass.

	const rootDir = path.resolve(__dirname, '..');

	// Check README.md exists and is current
	const readmePath = path.join(rootDir, 'README.md');
	if (fs.existsSync(readmePath)) {
		success('README.md exists');
		addResult('important', 'docs', 'README.md present', 'pass');

		// Check for version references
		const readmeContent = fs.readFileSync(readmePath, 'utf8');
		if (readmeContent.includes('{{version}}')) {
			warning('README.md contains mustache variables');
			addResult(
				'important',
				'docs',
				'README.md has unreplaced variables',
				'warn'
			);
		}
	} else {
		error('README.md not found');
		addResult('important', 'docs', 'README.md missing', 'fail');
	}

	// Check readme.txt
	const pluginReadmePath = path.join(rootDir, 'readme.txt');
	if (fs.existsSync(pluginReadmePath)) {
		const pluginReadmeContent = fs.readFileSync(pluginReadmePath, 'utf8');
		if (/Stable tag:\s*\{\{version\}\}/.test(pluginReadmeContent)) {
			warning('readme.txt stable tag still uses mustache variable');
			addResult(
				'important',
				'docs',
				'readme.txt stable tag not updated',
				'warn'
			);
		} else {
			success('readme.txt stable tag present');
			addResult('important', 'docs', 'readme.txt stable tag set', 'pass');
		}
	} else {
		warning('readme.txt not found');
		addResult('important', 'docs', 'readme.txt missing', 'warn');
	}

	// Check CONTRIBUTING.md
	const contributingPath = path.join(rootDir, 'CONTRIBUTING.md');
	if (fs.existsSync(contributingPath)) {
		success('CONTRIBUTING.md exists');
		addResult('important', 'docs', 'CONTRIBUTING.md present', 'pass');
	} else {
		warning('CONTRIBUTING.md not found');
		addResult('important', 'docs', 'CONTRIBUTING.md missing', 'warn');
	}
}

// Plugin generation validation
/**
 * Validate plugin generation logic using plugin-config.json.
 *
 * @return {boolean} True when validation succeeds.
 */
function testPluginGeneration() {
	header('Plugin Generation Validation');

	info('Validating plugin config and generator...');

	const configPath = path.resolve(__dirname, '..', 'plugin-config.json');
	if (!fs.existsSync(configPath)) {
		warning('plugin-config.json not found; skipping generator validation');
		addResult(
			'important',
			'generation',
			'plugin-config.json missing',
			'warn'
		);
		return false;
	}

	// TODO: Run the actual generator and validate output files instead of just schema validation.
	const result = runCommand('npm run validate:config', { silent: true });
	if (result.success) {
		success('Generator validation: PASSED');
		addResult(
			'critical',
			'generation',
			'Generator validation passed',
			'pass'
		);
		return true;
	}

	error('Generator validation: FAILED');
	addResult('critical', 'generation', 'Generator validation failed', 'fail');
	return false;
}

// Security audit
/**
 * Execute npm audit and report vulnerabilities.
 *
 * @return {boolean} True when no high/critical vulnerabilities exist.
 */
function runSecurityAudit() {
	header('Security Audit');

	// TODO: Capture and persist audit reports for later inspection.
	info('Running npm audit...');
	const result = runCommand('npm audit --audit-level=high', { silent: true });

	if (result.success) {
		success('Security audit: No high/critical vulnerabilities');
		addResult(
			'critical',
			'security',
			'No critical vulnerabilities',
			'pass'
		);
		return true;
	}
	const output = result.output || '';
	if (output.includes('found 0 vulnerabilities')) {
		success('Security audit: No vulnerabilities');
		addResult('critical', 'security', 'No vulnerabilities found', 'pass');
		return true;
	}
	error('Security audit: Vulnerabilities found');
	console.log(output);
	addResult(
		'critical',
		'security',
		'High/critical vulnerabilities found',
		'fail'
	);
	return false;
}

// Generate full report
/**
 * Print a release readiness report summarising previous checks.
 *
 * @return {boolean} True when critical blockers are absent.
 */
function generateReport() {
	header('Release Readiness Report');

	// TODO: Serialize this report to disk or remote logging system.
	const version = checkVersionConsistency().version || 'Unknown';

	console.log(
		colors.cyan +
			colors.bold +
			`\n## Release Readiness for v${version}\n` +
			colors.reset
	);

	// Summary
	const totalChecks =
		validationResults.passed.length +
		validationResults.failed.length +
		validationResults.warnings.length;

	console.log(colors.bold + '### Summary\n' + colors.reset);
	console.log(`Total Checks: ${totalChecks}`);
	success(`Passed: ${validationResults.passed.length}`);
	warning(`Warnings: ${validationResults.warnings.length}`);
	error(`Failed: ${validationResults.failed.length}`);

	// Ready to release?
	const isReady = validationResults.critical.length === 0;

	console.log('\n' + colors.bold + '### Status\n' + colors.reset);
	if (isReady) {
		success('✓ READY TO RELEASE');
	} else {
		error('✗ RELEASE BLOCKED');
	}

	// Passed checks
	if (validationResults.passed.length > 0) {
		console.log(
			'\n' +
				colors.green +
				colors.bold +
				'### ✅ Passed Checks\n' +
				colors.reset
		);
		validationResults.passed.forEach((result) => {
			console.log(`- [x] ${result.message}`);
		});
	}

	// Warnings
	if (validationResults.warnings.length > 0) {
		console.log(
			'\n' +
				colors.yellow +
				colors.bold +
				'### ⚠️  Warnings\n' +
				colors.reset
		);
		validationResults.warnings.forEach((result) => {
			console.log(`- [ ] ${result.message}`);
		});
	}

	// Blockers
	if (validationResults.critical.length > 0) {
		console.log(
			'\n' +
				colors.red +
				colors.bold +
				'### ❌ Critical Blockers\n' +
				colors.reset
		);
		validationResults.critical.forEach((result) => {
			console.log(`- [ ] ${result.message}`);
		});

		console.log(
			'\n' +
				colors.red +
				'⚠️  Cannot proceed until critical issues are resolved.\n' +
				colors.reset
		);
	}

	// Next steps
	console.log('\n' + colors.bold + '### Next Steps\n' + colors.reset);
	if (isReady) {
		console.log('1. Review changes: git diff');
		console.log(
			`2. Create release branch: git checkout -b release/${version}`
		);
		console.log(
			`3. Commit: git commit -am "chore: prepare release v${version}"`
		);
		console.log('4. Follow: docs/RELEASE_PROCESS.md');
	} else {
		console.log('1. Fix critical blockers listed above');
		console.log('2. Re-run validation: npm run release:validate');
		console.log('3. Review warnings and fix if possible');
	}

	console.log('\n' + colors.magenta + '═'.repeat(60) + colors.reset + '\n');

	return isReady;
}

// Main function
/**
 * CLI entry point for the release agent.
 *
 * @return {boolean} True when the requested command succeeded.
 */
/**
 * CLI entry point for the release agent.
 *
 * @return {boolean} True when the requested command succeeded.
 */
function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'validate';

	if (isMaximumDryRun(process.argv)) {
		info('=== MAXIMUM DRY RUN MODE ENABLED: All side effects are simulated. ===');
		info('[MAXIMUM DRY RUN] All actions are simulated. No commands or writes will be performed.');
		success('Linting: PASSED (simulated)');
		addResult('critical', 'quality', 'Linting passed (simulated)', 'pass');
		success('Dry-run tests: PASSED (simulated)');
		addResult('critical', 'quality', 'Dry-run tests passed (simulated)', 'pass');
		success('PHP unit tests: PASSED (simulated)');
		addResult('important', 'quality', 'PHP unit tests passed (simulated)', 'pass');
		success('Formatting: PASSED (simulated)');
		addResult('important', 'quality', 'Code properly formatted (simulated)', 'pass');
		success('Documentation: PASSED (simulated)');
		addResult('important', 'docs', 'Documentation valid (simulated)', 'pass');
		success('Version consistency: PASSED (simulated)');
		addResult('critical', 'version', 'All version files match (simulated)', 'pass');
		info('All checks simulated. No side effects performed.');
		return true;
	}

	console.log(colors.cyan + colors.bold);
	console.log('╔══════════════════════════════════════════════════════════╗');
	console.log('║     Multi-Block Plugin Scaffold - Release Agent         ║');
	console.log('╚══════════════════════════════════════════════════════════╝');
	console.log(colors.reset);

	switch (command) {
		case 'validate':
		case 'full':
			checkVersionConsistency();
			checkQualityGates();
			checkDocumentation();
			testPluginGeneration();
			runSecurityAudit();
			return generateReport();

		case 'version':
			return checkVersionConsistency().success;

		case 'quality':
			return checkQualityGates();

		case 'docs':
			checkDocumentation();
			return validationResults.failed.length === 0;

		case 'generate':
			return testPluginGeneration();

		case 'security':
			return runSecurityAudit();

		case 'status':
		case 'report':
			checkVersionConsistency();
			checkQualityGates();
			checkDocumentation();
			return generateReport();

	case 'help':
	case '--help':
	case '-h':
		console.log('\nUsage: node scripts/release.agent.js [command]\n');
			console.log('Commands:');
			console.log('  validate    Run full validation suite (default)');
			console.log('  version     Check version consistency');
			console.log('  quality     Run quality gates (lint, format, test)');
			console.log('  docs        Verify documentation');
			console.log('  generate    Validate plugin generator config');
			console.log('  security    Run security audit');
			console.log('  status      Quick readiness status');
			console.log('  report      Generate full readiness report');
			console.log('  help        Show this help\n');
			return true;

	default:
		// TODO: Provide suggestions when unknown commands are supplied.
		error(`Unknown command: ${command}`);
		console.log('Run with --help for usage information\n');
		return false;
}
}

// Run main function
if (require.main === module) {
	const result = main();
	process.exit(result ? 0 : 1);
}

module.exports = {
	checkVersionConsistency,
	checkQualityGates,
	checkDocumentation,
	testPluginGeneration,
	runSecurityAudit,
	generateReport,
};
