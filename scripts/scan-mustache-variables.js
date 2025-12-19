#!/usr/bin/env node
/**
 * CLI for scanning mustache variables and updating the registry/fixtures.
 *
 * Usage:
 *   node scripts/scan-mustache-variables.js --update-registry
 *   node scripts/scan-mustache-variables.js --fix-fixtures
 *   node scripts/scan-mustache-variables.js --json
 *   node scripts/scan-mustache-variables.js --validate <configPath>
 */
const fs = require('fs');
const path = require('path');
const {
	buildRegistry,
	sortVariablesAlphabetically,
	validateConfig,
} = require('./utils/scan');
const { compareRegistries, formatDiffReport, saveDiffReport } = require('./utils/registry-diff');

const REGISTRY_PATH = path.join(__dirname, 'mustache-variables-registry.json');
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'mustache-variables-registry.example.json');

function updateRegistry() {
	// Load old registry for comparison
	let oldRegistry = { variables: {} };
	if (fs.existsSync(REGISTRY_PATH)) {
		try {
			oldRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
		} catch (e) {
			// ignore
		}
	}

	const { results } = buildRegistry();
	const sorted = sortVariablesAlphabetically(results.variables);
	const newRegistry = { summary: results.summary, variables: sorted };

	// Compare and generate diff report
	const diff = compareRegistries(oldRegistry, newRegistry);

	// Write updated registry
	fs.writeFileSync(
		REGISTRY_PATH,
		JSON.stringify(newRegistry, null, 2) + '\n'
	);

	// Output changes to console
	if (diff.added.length > 0 || diff.removed.length > 0 || diff.modified.length > 0) {
		console.log('\n' + formatDiffReport(diff));

		// Save dated report
		const reportPath = saveDiffReport(diff);
		console.log(`\nChange report saved to: ${reportPath}`);
	}

	if (results.missingInRegistry && results.missingInRegistry.length > 0) {
		console.warn('⚠️  Variables found in files but missing from registry:', results.missingInRegistry);
	}
	if (results.unusedInFiles && results.unusedInFiles.length > 0) {
		console.warn('⚠️  Variables in registry not found in any file:', results.unusedInFiles);
	}
	console.log(`Updated mustache registry: ${REGISTRY_PATH}`);
}

function fixFixtures() {
	const { results } = buildRegistry();
	const sorted = sortVariablesAlphabetically(results.variables);
	fs.writeFileSync(
		FIXTURE_PATH,
		JSON.stringify({ summary: results.summary, variables: sorted }, null, 2) + '\n'
	);
	console.log(`Updated mustache registry fixture: ${FIXTURE_PATH}`);
}

function outputJson() {
	const { results } = buildRegistry();
	const sorted = sortVariablesAlphabetically(results.variables);
	console.log(
		JSON.stringify({ summary: results.summary, variables: sorted }, null, 2)
	);
}

function main() {
	const args = process.argv.slice(2);
	if (args.includes('--update-registry')) {
		updateRegistry();
		return;
	}
	if (args.includes('--fix-fixtures')) {
		fixFixtures();
		return;
	}
	if (args.includes('--json')) {
		outputJson();
		return;
	}
	if (args.includes('--ci-fail')) {
		// CI mode: fail if registry is out of sync
		const { results } = buildRegistry();

		const issues = [];
		if (results.missingInRegistry?.length > 0) {
			issues.push(`${results.missingInRegistry.length} variables in files not in registry`);
		}
		if (results.unusedInFiles?.length > 0) {
			issues.push(`${results.unusedInFiles.length} variables in registry not in files`);
		}

		if (issues.length > 0) {
			console.error('❌ Registry validation failed:');
			issues.forEach(issue => console.error(`  - ${issue}`));
			console.error('\nRun: node scripts/scan-mustache-variables.js --update-registry');
			process.exit(1);
		}

		console.log('✅ Registry is in sync');
		return;
	}

	const validateIndex = args.indexOf('--validate');
	if (validateIndex !== -1) {
		const configPath = args[validateIndex + 1];
		if (!configPath) {
			console.error('Missing argument for --validate');
			process.exit(1);
		}
		const { results } = buildRegistry();
		validateConfig(configPath, results);
		return;
	}
	// Default: print summary
	require('./utils/scan').runCli();
}

if (require.main === module) {
	main();
}
