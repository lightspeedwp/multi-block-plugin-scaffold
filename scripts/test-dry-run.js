#!/usr/bin/env node

/* eslint-disable no-console */
/**
 * Test Dry Run Script
 *
 * Runs Jest tests with mustache variable substitution for testing the scaffold
 * template files without requiring full plugin generation.
 *
 * This script:
 * 1. Backs up files with mustache variables
 * 2. Replaces variables with test values
 * 3. Runs Jest test suite
 * 4. Restores original files
 *
 * Usage:
 *   npm run test:dry-run
 *   node scripts/test-dry-run.js
 *   node scripts/test-dry-run.js --coverage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getDryRunConfig } = require('./dry-run-config');

// Paths
const rootDir = path.resolve(__dirname, '..');
const backupDir = path.join(rootDir, '.dry-run-backup');
const logsDir = path.join(rootDir, 'logs');

// Create logs directory
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `test-dry-run-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

/**
 * Log message
 *
 * @param {string} level   - Log level
 * @param {string} message - Message to log
 */
function log(level, message) {
	const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
	logStream.write(entry);
	console.log(entry.trim());
}

log('INFO', 'Test dry-run starting');
log('INFO', `Working directory: ${rootDir}`);
log('INFO', `Backup directory: ${backupDir}`);
log('INFO', `Log file: ${logFile}`);

/**
 * Find files with mustache variables
 *
 * @param {string} dir        - Directory to search
 * @param {Array}  extensions - File extensions to check
 * @return {Array} Array of file paths relative to rootDir
 */
function findMustacheFiles(dir, extensions = ['.js', '.jsx', '.json', '.php']) {
	const files = [];

	function scan(currentDir) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name);

			// Skip certain directories
			if (
				entry.isDirectory() &&
				[
					'node_modules',
					'vendor',
					'build',
					'.git',
					'logs',
					'tmp',
					'.dry-run-backup',
				].includes(entry.name)
			) {
				continue;
			}

			// Skip test files that test mustache variable replacement
			// (they need actual {{variable}} syntax in the tests)
			// Also skip dry-run-config.js since it's what provides the test values
			if (
				entry.name === 'generate-plugin.test.js' ||
				entry.name === 'dry-run-config.test.js' ||
				entry.name === 'dry-run-config.js'
			) {
				log('DEBUG', `Skipping test file: ${entry.name}`);
				continue;
			}

			if (entry.isDirectory()) {
				scan(fullPath);
			} else if (extensions.includes(path.extname(entry.name))) {
				try {
					const content = fs.readFileSync(fullPath, 'utf8');
					if (/\{\{[a-z_|]+\}\}/i.test(content)) {
						files.push(path.relative(rootDir, fullPath));
					}
				} catch (err) {
					log('WARN', `Could not read file: ${fullPath}`);
				}
			}
		}
	}

	scan(dir);
	return files;
}

/**
 * Backup file
 *
 * @param {string} filePath - File path relative to rootDir
 */
function backupFile(filePath) {
	const sourcePath = path.join(rootDir, filePath);
	const backupPath = path.join(backupDir, filePath);

	// Create backup directory structure
	const backupFileDir = path.dirname(backupPath);
	if (!fs.existsSync(backupFileDir)) {
		fs.mkdirSync(backupFileDir, { recursive: true });
	}

	// Copy file
	fs.copyFileSync(sourcePath, backupPath);
	log('DEBUG', `Backed up: ${filePath}`);
}

/**
 * Replace mustache variables in file
 *
 * @param {string} filePath - File path relative to rootDir
 * @param {Object} values   - Replacement values
 */
function replaceInFile(filePath, values) {
	const fullPath = path.join(rootDir, filePath);
	let content = fs.readFileSync(fullPath, 'utf8');

	// Replace all {{variable}} and {{variable|filter}} patterns
	Object.entries(values).forEach(([key, value]) => {
		// Simple variable
		const simpleRegex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
		content = content.replace(simpleRegex, value);

		// Variable with filters (we'll handle basic ones)
		const filterRegex = new RegExp(`\\{\\{${key}\\|([a-z]+)\\}\\}`, 'gi');
		content = content.replace(filterRegex, (match, filter) => {
			switch (filter.toLowerCase()) {
				case 'upper':
					return String(value).toUpperCase();
				case 'lower':
					return String(value).toLowerCase();
				case 'pascalcase':
					return String(value)
						.split(/[_-]/)
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						)
						.join('');
				case 'camelcase': {
					const pascal = String(value)
						.split(/[_-]/)
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						)
						.join('');
					return pascal.charAt(0).toLowerCase() + pascal.slice(1);
				}
				default:
					return value;
			}
		});
	});

	fs.writeFileSync(fullPath, content, 'utf8');
	log('DEBUG', `Processed: ${filePath}`);
}

/**
 * Restore file from backup
 *
 * @param {string} filePath - File path relative to rootDir
 */
function restoreFile(filePath) {
	const sourcePath = path.join(rootDir, filePath);
	const backupPath = path.join(backupDir, filePath);

	if (fs.existsSync(backupPath)) {
		fs.copyFileSync(backupPath, sourcePath);
		log('DEBUG', `Restored: ${filePath}`);
	}
}

/**
 * Cleanup backup directory
 */
function cleanupBackup() {
	if (fs.existsSync(backupDir)) {
		fs.rmSync(backupDir, { recursive: true, force: true });
		log('INFO', 'Backup directory cleaned up');
	}
}

// Main execution
async function main() {
	let exitCode = 0;

	try {
		// Get test configuration
		const config = getDryRunConfig();
		log(
			'INFO',
			`Using test values: slug=${config.slug}, name=${config.name}`
		);

		// Find all files with mustache variables
		log('INFO', 'Scanning for files with mustache variables...');
		const files = findMustacheFiles(rootDir);
		log('INFO', `Found ${files.length} files to process`);

		// Backup all files
		log('INFO', 'Creating backups...');
		files.forEach(backupFile);
		log('INFO', 'Backup complete');

		// Replace variables in all files
		log('INFO', 'Replacing mustache variables...');
		files.forEach((file) => replaceInFile(file, config));
		log('INFO', 'Variable replacement complete');

		// Parse command-line arguments for Jest
		const jestArgs = process.argv.slice(2);
		const jestCommand = `npm run test:unit${jestArgs.length > 0 ? ' -- ' + jestArgs.join(' ') : ''}`;

		// Run tests
		log('INFO', `Running tests: ${jestCommand}`);
		console.log('\n' + '='.repeat(60));
		console.log('Running Jest Tests with Dry-Run Configuration');
		console.log('='.repeat(60) + '\n');

		try {
			execSync(jestCommand, {
				stdio: 'inherit',
				cwd: rootDir,
				env: {
					...process.env,
					DRY_RUN: 'true',
				},
			});
			log('INFO', 'Tests passed');
			console.log('\n✅ All tests passed!');
		} catch (err) {
			exitCode = 1;
			log('ERROR', 'Tests failed');
			console.log('\n❌ Some tests failed');
		}
	} catch (err) {
		log('ERROR', `Error: ${err.message}`);
		console.error(`\n❌ Error: ${err.message}`);
		exitCode = 1;
	} finally {
		// Always restore original files
		log('INFO', 'Restoring original files...');
		console.log('\n🔄 Restoring original files...');

		try {
			const files = findMustacheFiles(rootDir);
			files.forEach(restoreFile);
			cleanupBackup();
			log('INFO', 'Files restored successfully');
			console.log('✅ Files restored\n');
		} catch (err) {
			log('ERROR', `Failed to restore files: ${err.message}`);
			console.error(`❌ Failed to restore files: ${err.message}\n`);
			exitCode = 1;
		}

		// Close log stream
		logStream.end();

		// Exit with appropriate code
		process.exit(exitCode);
	}
}

// Handle interrupts
process.on('SIGINT', () => {
	log('WARN', 'Test run interrupted by user');
	console.log('\n\n⚠️  Interrupted by user');

	// Restore files before exiting
	try {
		const files = findMustacheFiles(rootDir);
		files.forEach(restoreFile);
		cleanupBackup();
		console.log('✅ Files restored\n');
	} catch (err) {
		console.error(`❌ Failed to restore files: ${err.message}\n`);
	}

	logStream.end();
	process.exit(130);
});

// Run
main();
