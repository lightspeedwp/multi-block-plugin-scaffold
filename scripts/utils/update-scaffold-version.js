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

const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

if (!newVersion) {
	console.error('Usage: node scripts/utils/update-scaffold-version.js <new-version>');
	process.exit(1);
}

const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!semverRegex.test(newVersion)) {
	console.error('Invalid version format. Use semantic versioning (e.g., 1.0.0)');
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

filesToUpdate.forEach(({ file, pattern, replacement }) => {
	if (!fs.existsSync(file)) {
		console.warn(`File not found: ${file}`);
		return;
	}
	const content = fs.readFileSync(file, 'utf8');
	const updated = content.replace(pattern, replacement);
	if (content !== updated) {
		fs.writeFileSync(file, updated);
		console.log(`Updated: ${path.relative(rootDir, file)}`);
	} else {
		console.log(`No changes: ${path.relative(rootDir, file)}`);
	}
});

console.log('Scaffold version update complete!');
