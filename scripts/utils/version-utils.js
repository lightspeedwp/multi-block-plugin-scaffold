/**
 * Shared helpers for version-update CLI scripts.
 *
 * Provides logging, semantic version validation, and file-mutation helpers
 * reused by both `update-version.js` and `update-scaffold-version.js`.
 *
 * @module scripts/utils/version-utils
 */

const fs = require('fs');
const path = require('path');

const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;

/**
 * Structured log helper.
 *
 * @param {string} level
 * @param {string} message
 */
function log(level, message) {
	process.stdout.write(`[${level}] ${message}\n`);
}

/**
 * Print a blank line or custom message.
 *
 * @param {string} message
 */
function print(message = '') {
	process.stdout.write(`${message}\n`);
}

/**
 * Validate semantic version input.
 *
 * @param {string} candidate
 * @throws {Error}
 */
function validateSemver(candidate) {
	if (!SEMVER_REGEX.test(candidate)) {
		throw new Error('Invalid version format. Use semantic versioning (e.g., 1.0.0)');
	}
}

/**
 * Apply a set of replacements to files and log progress.
 *
 * @param {Array<Object>} entries
 * @param {string} rootDir
 */
function applyUpdates(entries, rootDir) {
	entries.forEach(({ file, pattern, replacement, mustacheSafe }) => {
		if (!fs.existsSync(file)) {
			log('WARN', `File not found: ${file}`);
			return;
		}

		const content = fs.readFileSync(file, 'utf8');
		if (mustacheSafe && /\{\{.*version.*\}\}/i.test(content)) {
			log('INFO', `Skipped (mustache placeholder detected): ${path.relative(rootDir, file)}`);
			return;
		}

		const updated = content.replace(pattern, replacement);
		const relative = path.relative(rootDir, file);
		if (content === updated) {
			log('INFO', `No changes: ${relative}`);
			return;
		}

		fs.writeFileSync(file, updated);
		log('INFO', `Updated: ${relative}`);
	});
}

module.exports = {
	log,
	print,
	validateSemver,
	applyUpdates,
};
