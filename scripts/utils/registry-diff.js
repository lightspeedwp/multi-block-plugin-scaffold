/**
 * Utilities for comparing registry versions and generating change reports
 *
 * @module scripts/utils/registry-diff
 */

const fs = require('fs');
const path = require('path');

/**
 * Compare two registry objects and return differences
 *
 * @param {Object} oldRegistry - Previous registry
 * @param {Object} newRegistry - Current registry
 * @return {Object} Diff object with added, removed, and modified arrays
 */
function compareRegistries(oldRegistry, newRegistry) {
	const oldVars = oldRegistry.variables || {};
	const newVars = newRegistry.variables || {};

	const oldKeys = new Set(Object.keys(oldVars));
	const newKeys = new Set(Object.keys(newVars));

	const added = [];
	const removed = [];
	const modified = [];

	// Find added variables
	for (const key of newKeys) {
		if (!oldKeys.has(key)) {
			added.push(key);
		}
	}

	// Find removed variables
	for (const key of oldKeys) {
		if (!newKeys.has(key)) {
			removed.push(key);
		}
	}

	// Find modified variables
	for (const key of oldKeys) {
		if (newKeys.has(key)) {
			const oldVar = oldVars[key];
			const newVar = newVars[key];
			const changes = [];

			if (oldVar.count !== newVar.count) {
				changes.push(`count: ${oldVar.count} → ${newVar.count}`);
			}

			if (oldVar.files?.length !== newVar.files?.length) {
				changes.push(`files: ${oldVar.files?.length || 0} → ${newVar.files?.length || 0}`);
			}

			if (oldVar.category !== newVar.category) {
				changes.push(`category: ${oldVar.category} → ${newVar.category}`);
			}

			if (changes.length > 0) {
				modified.push({ name: key, changes });
			}
		}
	}

	return {
		added: added.sort(),
		removed: removed.sort(),
		modified: modified.sort((a, b) => a.name.localeCompare(b.name)),
		timestamp: new Date().toISOString(),
	};
}

/**
 * Format diff report as readable text
 *
 * @param {Object} diff - Diff object from compareRegistries
 * @return {string} Formatted report
 */
function formatDiffReport(diff) {
	const lines = [];

	lines.push('# Mustache Variable Registry Changes');
	lines.push('');
	lines.push(`**Date:** ${diff.timestamp}`);
	lines.push('');

	if (diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0) {
		lines.push('No changes detected in the registry.');
		return lines.join('\n');
	}

	if (diff.added.length > 0) {
		lines.push(`## Added (${diff.added.length})`);
		lines.push('');
		diff.added.forEach(name => {
			lines.push(`- \`{{${name}}}\``);
		});
		lines.push('');
	}

	if (diff.removed.length > 0) {
		lines.push(`## Removed (${diff.removed.length})`);
		lines.push('');
		diff.removed.forEach(name => {
			lines.push(`- \`{{${name}}}\``);
		});
		lines.push('');
	}

	if (diff.modified.length > 0) {
		lines.push(`## Modified (${diff.modified.length})`);
		lines.push('');
		diff.modified.forEach(item => {
			lines.push(`- \`{{${item.name}}}\``);
			item.changes.forEach(change => {
				lines.push(`  - ${change}`);
			});
		});
		lines.push('');
	}

	return lines.join('\n');
}

/**
 * Save diff report to a dated file in scripts/reports
 *
 * @param {Object} diff - Diff object from compareRegistries
 * @param {string} outputDir - Directory to save report
 * @return {string} Path to saved report
 */
function saveDiffReport(diff, outputDir = path.join(__dirname, '..', 'reports')) {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const date = new Date().toISOString().split('T')[0];
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
	const filename = `registry-changes-${date}-${timestamp}.md`;
	const filepath = path.join(outputDir, filename);

	const report = formatDiffReport(diff);
	fs.writeFileSync(filepath, report, 'utf8');

	return filepath;
}

module.exports = {
	compareRegistries,
	formatDiffReport,
	saveDiffReport,
};
