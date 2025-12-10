#!/usr/bin/env node

/**
 * Build script for Example Plugin.
 *
 * @package
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Building Example Plugin...\n');

// Clean build directory.
const buildDir = path.join(rootDir, 'build');
if (fs.existsSync(buildDir)) {
	fs.rmSync(buildDir, { recursive: true });
}

// Run webpack build.
try {
	execSync('npm run build', {
		cwd: rootDir,
		stdio: 'inherit',
	});
} catch (error) {
	console.error('❌ Build failed:', error.message);
	process.exit(1);
}

console.log('\n✅ Build complete!');
