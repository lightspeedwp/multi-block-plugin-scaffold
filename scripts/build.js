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

/**
 * Structured logging helper
 *
 * @param {string} level
 * @param {string} message
 */
function log(level, message) {
	process.stdout.write(`[${level}] ${message}\n`);
}

/**
 * Print a raw line (including blank lines)
 *
 * @param {string} message
 */
function print(message = '') {
	process.stdout.write(`${message}\n`);
}

print();
log('INFO', '🚀 Building Example Plugin...');
print();

// Step 1: Clean build directory
log('INFO', 'Step 1: Cleaning build directory...');
const buildDir = path.join(rootDir, 'build');
if (fs.existsSync(buildDir)) {
	log('INFO', `Removing existing build directory: ${buildDir}`);
	fs.rmSync(buildDir, { recursive: true });
	log('INFO', 'Build directory cleaned');
} else {
	log('INFO', 'Build directory already clean');
}

// Step 2: Run webpack build
print();
log('INFO', 'Step 2: Running webpack build...');
try {
	log('INFO', 'Executing: npm run build');
	execSync('npm run build', {
		cwd: rootDir,
		stdio: 'inherit',
	});
	log('INFO', 'Webpack build completed successfully');
} catch (error) {
	log('ERROR', `Build failed: ${error.message}`);
	process.exit(1);
}

print();
log('SUCCESS', 'All steps completed successfully!');
log('SUCCESS', '🎉 Build complete!');
