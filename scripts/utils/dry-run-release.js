const fs = require('fs');
const path = require('path');

const RELEASE_AGENT_FILES = [
	'.github/agents/release.agent.md',
	'.github/prompts/create-release.prompt.md',
	'.github/instructions/release.instructions.md',
	'docs/RELEASE_PROCESS.md',
];

const SCAFFOLD_AGENT_FILES = [
	'.github/agents/release-scaffold.agent.md',
	'.github/prompts/create-release-scaffold.prompt.md',
	'.github/prompts/pre-release-validation.prompt.md',
	'.github/instructions/release-scaffold.instructions.md',
	'docs/RELEASE_PROCESS_SCAFFOLD.md',
];

const releaseFiles = [...RELEASE_AGENT_FILES, ...SCAFFOLD_AGENT_FILES];

function replacePlaceholders(content, replacements = {}) {
	return content.replace(/\{\{\s*([^}|]+)(?:\|[^}]+)?\s*\}\}/g, (_, key) => {
		const token = key.trim();
		if (replacements[token]) {
			return replacements[token];
		}
		return `dry-run-${token.replace(/[^a-z0-9]+/gi, '-')}`;
	});
}

function getFilesForMode(mode = 'combined') {
	switch (mode) {
		case 'release':
			return RELEASE_AGENT_FILES;
		case 'scaffold':
			return SCAFFOLD_AGENT_FILES;
		default:
			return releaseFiles;
	}
}

function runDryRun(options = {}) {
	const rootDir = path.resolve(__dirname, '../..');
	const outputDir =
		options.outputDir || path.join(rootDir, 'tmp', 'dry-run-release');
	const replacements = options.replacements || {};
	const files = options.files || getFilesForMode(options.mode || 'combined');

	files.forEach((relativePath) => {
		const sourcePath = path.join(rootDir, relativePath);
		if (!fs.existsSync(sourcePath)) {
			return;
		}
		const content = fs.readFileSync(sourcePath, 'utf8');
		const sanitized = replacePlaceholders(content, replacements);
		const destPath = path.join(outputDir, relativePath);
		fs.mkdirSync(path.dirname(destPath), { recursive: true });
		fs.writeFileSync(destPath, sanitized, 'utf8');
	});

	return outputDir;
}

function runCli(args = process.argv.slice(2)) {
	const modeArg = args.find((arg) => arg.startsWith('--mode='));
	const mode = modeArg ? modeArg.split('=')[1] : 'combined';
	const outputDir = runDryRun({ mode });
	console.log(`Dry-run artifacts written to ${outputDir} (${mode} mode)`);
	return outputDir;
}

module.exports = {
	replacePlaceholders,
	runDryRun,
	releaseFiles,
	RELEASE_AGENT_FILES,
	SCAFFOLD_AGENT_FILES,
	getFilesForMode,
	runCli,
};

if (require.main === module) {
	runCli(process.argv.slice(2));
}
