#!/usr/bin/env node

/**
 * Frontmatter Reference Auditor
 *
 * Scans all markdown files for frontmatter references and builds a dependency graph.
 * Detects circular references, transitive dependencies, and generates recommendations.
 *
 * Usage:
 *   node bin/audit-frontmatter.js
 *   node bin/audit-frontmatter.js --csv
 *   node bin/audit-frontmatter.js --graph
 */

const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `frontmatter-audit-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(level, message) {
	const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
	logStream.write(entry);
	process.stdout.write(`${entry.trim()}\n`);
}

/**
 * Print raw line (including blank lines)
 *
 * @param {string} message
 */
function printLine(message = '') {
	process.stdout.write(`${message}\n`);
}

log('INFO', 'Frontmatter audit started');

// Parse arguments
const args = process.argv.slice(2);
const outputCsv = args.includes('--csv');
const outputGraph = args.includes('--graph');

// Directories to exclude
const EXCLUDE_DIRS = [
	'node_modules',
	'vendor',
	'build',
	'.git',
	'.archive',
	'tmp',
	'logs',
];

/**
 * Check if path should be excluded
 *
 * @param {string} filePath
 * @return {boolean} True when the file path should be skipped.
 */
function shouldExclude(filePath) {
	return EXCLUDE_DIRS.some(
		(dir) =>
			filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`)
	);
}

/**
 * Get all markdown files recursively
 *
 * @param {string} dir
 * @return {string[]} Array of markdown file paths.
 */
function getMarkdownFiles(dir) {
	const files = [];

	try {
		const items = fs.readdirSync(dir);

		for (const item of items) {
			const fullPath = path.join(dir, item);

			if (shouldExclude(fullPath)) {
				continue;
			}

			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				files.push(...getMarkdownFiles(fullPath));
			} else if (item.endsWith('.md')) {
				files.push(fullPath);
			}
		}
	} catch (error) {
		log('ERROR', `Error reading directory ${dir}: ${error.message}`);
	}

	return files;
}

/**
 * Extract frontmatter from markdown file
 *
 * @param {string} content
 * @return {Record<string, string> | null} Parsed frontmatter data or null.
 */
function extractFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		return null;
	}

	const frontmatter = {};
	const lines = match[1].split('\n');

	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex === -1) {
			continue;
		}

		const key = line.slice(0, colonIndex).trim();
		const value = line.slice(colonIndex + 1).trim();

		frontmatter[key] = value;
	}

	return frontmatter;
}

/**
 * Extract file references from markdown content
 * @param {string} content
 */
function extractReferences(content) {
	const references = new Set();

	// Match markdown links: [text](path) or [text](path "title")
	const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
	let match;

	while ((match = linkRegex.exec(content)) !== null) {
		const linkPath = match[2].split(' ')[0].split('#')[0]; // Remove title and anchor

		// Only include relative markdown file references
		if (linkPath.endsWith('.md') && !linkPath.startsWith('http')) {
			references.add(linkPath);
		}
	}

	return Array.from(references);
}

/**
 * Resolve relative path to absolute
 *
 * @param {string} fromFile
 * @param {string} toPath
 * @return {string} Relative path from the current working directory.
 */
function resolvePath(fromFile, toPath) {
	const fromDir = path.dirname(fromFile);
	const resolved = path.resolve(fromDir, toPath);
	return path.relative(process.cwd(), resolved);
}

/**
 * Detect circular references using DFS
 *
 * @param {Record<string, string[]>} graph
 * @return {string[][]} List of detected circular paths.
 */
function findCircularReferences(graph) {
	const circular = [];
	const visited = new Set();
	const recursionStack = new Set();

	function dfs(node, currentPath = []) {
		if (recursionStack.has(node)) {
			// Found a cycle
			const cycleStart = currentPath.indexOf(node);
			circular.push([...currentPath.slice(cycleStart), node]);
			return;
		}

		if (visited.has(node)) {
			return;
		}

		visited.add(node);
		recursionStack.add(node);

		const nextPath = [...currentPath, node];

		const neighbors = graph[node] || [];
		for (const neighbor of neighbors) {
			dfs(neighbor, nextPath);
		}

		recursionStack.delete(node);
	}

	Object.keys(graph).forEach((node) => {
		if (!visited.has(node)) {
			dfs(node);
		}
	});

	return circular;
}

/**
 * Find transitive references (A -> B -> C, so A -> C is transitive)
 *
 * @param {Record<string, string[]>} graph
 * @return {Record<string, string[]>} Transitive reference map.
 */
function findTransitiveReferences(graph) {
	const transitive = {};

	for (const node in graph) {
		const directRefs = new Set(graph[node] || []);
		const allRefs = new Set(directRefs);

		// BFS to find all reachable nodes
		const queue = [...directRefs];
		const visited = new Set([node]);

		while (queue.length > 0) {
			const current = queue.shift();

			if (visited.has(current)) {
				continue;
			}
			visited.add(current);

			const neighbors = graph[current] || [];
			for (const neighbor of neighbors) {
				allRefs.add(neighbor);
				if (!visited.has(neighbor)) {
					queue.push(neighbor);
				}
			}
		}

		// Transitive refs are those reachable but not direct
		const transitiveRefs = [...allRefs].filter(
			(ref) => !directRefs.has(ref)
		);

		if (transitiveRefs.length > 0) {
			transitive[node] = transitiveRefs;
		}
	}

	return transitive;
}

// Main execution
log('INFO', 'Scanning for markdown files...');
const files = getMarkdownFiles(process.cwd());
log('INFO', `Found ${files.length} markdown files`);

// Build dependency graph
const graph = {};
const fileData = {};

files.forEach((filePath) => {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		const relativePath = path.relative(process.cwd(), filePath);

		const frontmatter = extractFrontmatter(content);
		const references = extractReferences(content);

		// Resolve references to absolute paths
		const resolvedRefs = references.map((ref) =>
			resolvePath(filePath, ref)
		);

		graph[relativePath] = resolvedRefs;
		fileData[relativePath] = {
			frontmatter,
			references: resolvedRefs,
			directRefCount: resolvedRefs.length,
		};

		log('DEBUG', `${relativePath}: ${resolvedRefs.length} references`);
	} catch (error) {
		log('ERROR', `Error processing ${filePath}: ${error.message}`);
	}
});

// Analyze dependencies
log('INFO', 'Analyzing dependencies...');

const circularRefs = findCircularReferences(graph);
const transitiveRefs = findTransitiveReferences(graph);

// Calculate statistics
const stats = {
	totalFiles: files.length,
	filesWithRefs: Object.values(fileData).filter((d) => d.directRefCount > 0)
		.length,
	totalReferences: Object.values(fileData).reduce(
		(sum, d) => sum + d.directRefCount,
		0
	),
	circularChains: circularRefs.length,
	filesWithTransitive: Object.keys(transitiveRefs).length,
};

// Generate recommendations
const recommendations = [];

Object.entries(fileData).forEach(([file, data]) => {
	const hasCircular = circularRefs.some((chain) => chain.includes(file));
	const transitiveCount = (transitiveRefs[file] || []).length;

	let recommendation = 'OK';
	let reason = '';

	if (hasCircular) {
		recommendation = 'CRITICAL';
		reason = 'Circular reference detected';
	} else if (transitiveCount > 5) {
		recommendation = 'REDUCE';
		reason = `${transitiveCount} transitive references`;
	} else if (data.directRefCount > 10) {
		recommendation = 'REVIEW';
		reason = `${data.directRefCount} direct references`;
	}

	recommendations.push({
		file,
		directRefs: data.directRefCount,
		transitiveRefs: transitiveCount,
		circular: hasCircular,
		recommendation,
		reason,
	});
});

// Output results
printLine('');
printLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
printLine('📊 FRONTMATTER REFERENCE AUDIT');
printLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
printLine('');

printLine('Statistics:');
printLine(`  Total Files:           ${stats.totalFiles}`);
printLine(`  Files with References: ${stats.filesWithRefs}`);
printLine(`  Total References:      ${stats.totalReferences}`);
printLine(`  Circular Chains:       ${stats.circularChains}`);
printLine(`  Files w/ Transitive:   ${stats.filesWithTransitive}`);
printLine('');

if (circularRefs.length > 0) {
	printLine('🔴 Circular References Detected:');
	circularRefs.forEach((chain, i) => {
		printLine(`  ${i + 1}. ${chain.join(' → ')}`);
	});
	printLine('');
}

printLine('Top 10 Files by Reference Count:');
printLine('');
recommendations
	.sort((a, b) => b.directRefs - a.directRefs)
	.slice(0, 10)
	.forEach((rec, i) => {
		let status = '🟢';
		if (rec.recommendation === 'CRITICAL') {
			status = '🔴';
		} else if (rec.recommendation === 'REDUCE') {
			status = '🟡';
		} else if (rec.recommendation === 'REVIEW') {
			status = '🟠';
		}
		printLine(`  ${i + 1}. ${status} ${rec.file}`);
		printLine(
			`     Direct: ${rec.directRefs}, Transitive: ${rec.transitiveRefs}, ${rec.reason}`
		);
	});

printLine('');

// Output CSV to stdout by default (for tests to capture)
const csvLines = [
	'File,Direct References,Transitive References,Circular,Recommendation,Reason',
];

recommendations.forEach((rec) => {
	csvLines.push(
		`"${rec.file}",${rec.directRefs},${rec.transitiveRefs},${rec.circular ? 'Yes' : 'No'},"${rec.recommendation}","${rec.reason}"`
	);
});

printLine(csvLines.join('\n'));

// Output CSV if requested (to file)
if (outputCsv) {
	const csvFile = path.join(
		__dirname,
		'../tmp',
		`frontmatter-audit-${timestamp}.csv`
	);
	fs.writeFileSync(csvFile, csvLines.join('\n'));
	printLine(`📄 CSV report saved to: ${csvFile}`);
	printLine('');
}

// Output graph if requested
if (outputGraph) {
	const graphFile = path.join(
		__dirname,
		'../tmp',
		`frontmatter-graph-${timestamp}.json`
	);
	fs.writeFileSync(
		graphFile,
		JSON.stringify(
			{
				graph,
				circular: circularRefs,
				transitive: transitiveRefs,
				stats,
				recommendations,
			},
			null,
			2
		)
	);
	printLine(`📊 Graph data saved to: ${graphFile}`);
	printLine('');
}

log('INFO', 'Frontmatter audit completed');
log('INFO', `Circular chains: ${circularRefs.length}`);
log('INFO', `Files with transitive refs: ${stats.filesWithTransitive}`);

logStream.end();
