#!/usr/bin/env node
/* eslint-disable no-console, jsdoc/require-param-type */
const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
	'node_modules',
	'.git',
	'vendor',
	'build',
	'.github/agents',
	'generated-plugins',
	'logs',
	'tmp',
]);

function collectMarkdownFiles(dir) {
	const results = [];

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (IGNORED_DIRS.has(entry.name)) {
				continue;
			}

			results.push(...collectMarkdownFiles(path.join(dir, entry.name)));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(path.join(dir, entry.name));
		}
	}

	return results;
}

function reportIssues(issues) {
	let currentFile = '';

	console.log(
		'Found .instructions.md references inside References/See Also sections:\n'
	);

	issues.forEach((issue) => {
		if (issue.file !== currentFile) {
			currentFile = issue.file;
			console.log(`File: ${currentFile}`);
		}

		console.log(`  Line ${issue.line} (${issue.section}): ${issue.text}`);
	});

	console.log(`\nTotal references found: ${issues.length}`);
}

const files = collectMarkdownFiles(process.cwd());
const issues = [];

files.forEach((filePath) => {
	const content = fs.readFileSync(filePath, 'utf8');
	const lines = content.split(/\r?\n/);
	let section = null;

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		const heading = trimmed.match(/^#{1,6}\s+(References|See Also)$/i);

		if (heading) {
			section = heading[1];
			return;
		}

		if (section && /^#{1,6}\s+/.test(trimmed)) {
			section = null;
		}

		if (section && trimmed.includes('.instructions.md')) {
			issues.push({
				file: path.relative(process.cwd(), filePath),
				line: index + 1,
				section,
				text: trimmed,
			});
		}
	});
});

if (issues.length) {
	reportIssues(issues);
} else {
	console.log(
		'No third-party instructions references were found in References/See Also sections.'
	);
}
