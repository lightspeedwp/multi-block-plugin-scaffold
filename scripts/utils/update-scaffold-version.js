#!/usr/bin/env node

/**
 * update-scaffold-version.js
 *
 * Updates version numbers in scaffold-only files (release-scaffold.* and docs/RELEASE_PROCESS_SCAFFOLD.md).
 * Usage: node scripts/utils/update-scaffold-version.js <new-version>
 *
 * Only intended for use by release-scaffold agents and workflows.
 *
 * @module scripts/utils/update-scaffold-version
 */

const path = require('path');
const { log, print, validateSemver, applyUpdates } = require('./version-utils');

const newVersion = process.argv[2];

if (!newVersion) {
	log('ERROR', 'Usage: node scripts/utils/update-scaffold-version.js <new-version>');
	process.exit(1);
}

try {
	validateSemver(newVersion);
} catch (error) {
	log('ERROR', error.message);
	process.exit(1);
}

const rootDir = path.resolve(__dirname, '../..');

const filesToUpdate = [
	{
		file: path.join(rootDir, '.github/agents/release-scaffold.agent.md'),
		pattern: /version:?\s*\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?/gi,
		replacement: `version: ${newVersion}`,
	},
	{
		file: path.join(rootDir, 'scripts/agents/release-scaffold.agent.js'),
		pattern: /version\s*=\s*['"]\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?['"]/gi,
		replacement: `version = '${newVersion}'`,
	},
	{
		file: path.join(rootDir, 'docs/RELEASE_PROCESS_SCAFFOLD.md'),
		pattern: /Version:?\s*\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?/gi,
		replacement: `Version: ${newVersion}`,
	},
	{
		file: path.join(rootDir, '.github/workflows/release.yml'),
		pattern: /version:?\s*\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?/gi,
		replacement: `version: ${newVersion}`,
	},
];

log('INFO', `📦 Updating scaffold version to ${newVersion}...`);
print();

applyUpdates(filesToUpdate, rootDir);

print();
log('SUCCESS', '🎉 Scaffold version update complete!');
