#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const instructionsDir = path.resolve(__dirname, '../.github/instructions');

function getAllowedReferences() {
	return ['../custom-instructions.md'];
}

function removeSection(content, heading) {
	const lines = content.split(/\r?\n/);
	const headingPattern = new RegExp(`^#{1,6}\\s+${heading}\\s*$`, 'i');
	const result = [];
	let skipping = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!skipping && headingPattern.test(trimmed)) {
			skipping = true;
			continue;
		}

		if (skipping && /^#{1,6}\s+/.test(trimmed)) {
			skipping = false;
		}

		if (skipping) {
			continue;
		}

		result.push(line);
	}

	return result.join('\n');
}

function extractReferences(content) {
	const lines = content.split(/\r?\n/);
	const headingPattern = /^#{1,6}\s+/;
	const referenceIndex = lines.findIndex((line) =>
		/^#{1,6}\s+References$/i.test(line.trim())
	);

	if (referenceIndex === -1) {
		return { cleaned: content, references: [] };
	}

	let endIndex = referenceIndex + 1;
	while (
		endIndex < lines.length &&
		!headingPattern.test(lines[endIndex].trim())
	) {
		endIndex++;
	}

	const entries = lines
		.slice(referenceIndex + 1, endIndex)
		.map((line) => line.trim())
		.filter((line) => line.startsWith('- '))
		.map((line) => line.slice(2).trim())
		.filter(Boolean);

	const cleanedLines = [
		...lines.slice(0, referenceIndex),
		...lines.slice(endIndex),
	];

	return { cleaned: cleanedLines.join('\n'), references: entries };
}

function ensureTrailingNewline(text) {
	if (text.endsWith('\n')) {
		return text;
	}

	return `${text}\n`;
}

(async function main() {
	const files = fs
		.readdirSync(instructionsDir)
		.filter((file) => file.endsWith('.instructions.md'))
		.map((file) => path.join(instructionsDir, file));

	for (const filePath of files) {
		const fileName = path.basename(filePath);
		const raw = fs.readFileSync(filePath, 'utf8');
		const parsed = matter(raw);
		const data = parsed.data || {};
		const content = parsed.content;

		data.references = getAllowedReferences(fileName);

		let body = removeSection(content, 'See Also');
		const extracted = extractReferences(body);
		body = extracted.cleaned;

		const seeAlsoEntries = Array.from(new Set(extracted.references));

		if (seeAlsoEntries.length) {
			body = body.trimEnd() + '\n\n## See Also\n\n';
			body +=
				seeAlsoEntries.map((entry) => `- ${entry}`).join('\n') + '\n';
		} else {
			body = ensureTrailingNewline(body.trimEnd());
		}

		const output = matter.stringify(body, data);
		fs.writeFileSync(filePath, output, 'utf8');

		console.log(
			`Updated ${fileName}: ${seeAlsoEntries.length} See Also entr${seeAlsoEntries.length === 1 ? 'y' : 'ies'}.`
		);
	}

	console.log(
		'\n✅ Instruction references cleaned. Run the audit if desired.'
	);
})();
