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
	console.log(entry.trim());
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
 * @param filePath
 */
function shouldExclude(filePath) {
	return EXCLUDE_DIRS.some(
		(dir) =>
			filePath.includes(`/${dir}/`) || filePath.includes(`\\${dir}\\`)
	);
}

/**
 * Get all markdown files recursively
 * @param dir
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
 * @param content
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
 * @param content
 * @param filePath
 */
function extractReferences(content, filePath) {
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
 * @param fromFile
 * @param toPath
 */
function resolvePath(fromFile, toPath) {
	const fromDir = path.dirname(fromFile);
	const resolved = path.resolve(fromDir, toPath);
	return path.relative(process.cwd(), resolved);
}

/**
 * Detect circular references using DFS
 * @param graph
 */
function findCircularReferences(graph) {
	const circular = [];
	const visited = new Set();
	const recursionStack = new Set();

	function dfs(node, path = []) {
		if (recursionStack.has(node)) {
			// Found a cycle
			const cycleStart = path.indexOf(node);
			circular.push([...path.slice(cycleStart), node]);
			return;
		}

		if (visited.has(node)) {
			return;
		}

		visited.add(node);
		recursionStack.add(node);
		path.push(node);

		const neighbors = graph[node] || [];
		for (const neighbor of neighbors) {
			dfs(neighbor, [...path]);
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
 * @param graph
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
		const references = extractReferences(content, filePath);

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
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 FRONTMATTER REFERENCE AUDIT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Statistics:');
console.log(`  Total Files:           ${stats.totalFiles}`);
console.log(`  Files with References: ${stats.filesWithRefs}`);
console.log(`  Total References:      ${stats.totalReferences}`);
console.log(`  Circular Chains:       ${stats.circularChains}`);
console.log(`  Files w/ Transitive:   ${stats.filesWithTransitive}\n`);

if (circularRefs.length > 0) {
	console.log('🔴 Circular References Detected:\n');
	circularRefs.forEach((chain, i) => {
		console.log(`  ${i + 1}. ${chain.join(' → ')}`);
	});
	console.log('');
}

console.log('Top 10 Files by Reference Count:\n');
recommendations
	.sort((a, b) => b.directRefs - a.directRefs)
	.slice(0, 10)
	.forEach((rec, i) => {
		const status =
			rec.recommendation === 'CRITICAL'
				? '🔴'
				: rec.recommendation === 'REDUCE'
					? '🟡'
					: rec.recommendation === 'REVIEW'
						? '🟠'
						: '🟢';
		console.log(`  ${i + 1}. ${status} ${rec.file}`);
		console.log(
			`     Direct: ${rec.directRefs}, Transitive: ${rec.transitiveRefs}, ${rec.reason}`
		);
	});

console.log('');

// Output CSV if requested
if (outputCsv) {
	const csvFile = path.join(
		__dirname,
		'../tmp',
		`frontmatter-audit-${timestamp}.csv`
	);
	const csvLines = [
		'File,Direct References,Transitive References,Circular,Recommendation,Reason',
	];

	recommendations.forEach((rec) => {
		csvLines.push(
			`"${rec.file}",${rec.directRefs},${rec.transitiveRefs},${rec.circular ? 'Yes' : 'No'},"${rec.recommendation}","${rec.reason}"`
		);
	});

	fs.writeFileSync(csvFile, csvLines.join('\n'));
	console.log(`📄 CSV report saved to: ${csvFile}\n`);
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
	console.log(`📊 Graph data saved to: ${graphFile}\n`);
}

log('INFO', 'Frontmatter audit completed');
log('INFO', `Circular chains: ${circularRefs.length}`);
log('INFO', `Files with transitive refs: ${stats.filesWithTransitive}`);

logStream.end();
