#!/usr/bin/env node

/**
 * Update version number across all plugin files.
 *
 * Usage: node scripts/update-version.js <new-version>
 *
 * @package
 */

const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

if (!newVersion) {
	console.error('Usage: node scripts/update-version.js <new-version>');
	process.exit(1);
}

// Validate semver format.
const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!semverRegex.test(newVersion)) {
	console.error(
		'Invalid version format. Use semantic versioning (e.g., 1.0.0)'
	);
	process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');

const filesToUpdate = [
	{
		file: path.join(rootDir, 'package.json'),
		pattern: /"version":\s*"[^"]+"/,
		replacement: `"version": "${newVersion}"`,
	},
	{
		file: path.join(rootDir, 'example-plugin.php'),
		pattern: /Version:\s*[^\n]+/,
		replacement: `Version:           ${newVersion}`,
	},
	{
		file: path.join(rootDir, 'example-plugin.php'),
		pattern:
			/define\(\s*'\{\{namespace\|upper\}\}_VERSION',\s*'[^']+'\s*\)/,
		replacement: `define( 'EXAMPLE_PLUGIN_VERSION', '${newVersion}' )`,
	},
];

console.log(`📦 Updating version to ${newVersion}...\n`);

filesToUpdate.forEach(({ file, pattern, replacement }) => {
	if (!fs.existsSync(file)) {
		console.warn(`⚠️  File not found: ${file}`);
		return;
	}

	const content = fs.readFileSync(file, 'utf8');
	const updated = content.replace(pattern, replacement);

	if (content !== updated) {
		fs.writeFileSync(file, updated);
		console.log(`✅ Updated: ${path.relative(rootDir, file)}`);
	} else {
		console.log(`⏭️  No changes: ${path.relative(rootDir, file)}`);
	}
});

console.log('\n🎉 Version update complete!');
