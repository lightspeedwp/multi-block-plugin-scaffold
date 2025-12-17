#!/usr/bin/env node
/**
 * Audit Frontmatter Validation
 *
 * Validates frontmatter metadata in agent specifications and documentation
 * against the frontmatter schema. Scans all .agent.md and .md files,
 * validates structure, and reports issues.
 *
 * @module scripts/validation/audit-frontmatter
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const yaml = require('js-yaml');
const { glob } = require('glob');

/**
 * Extract frontmatter from a markdown file
 * @param {string} content - File content
 * @returns {Object|null} Parsed frontmatter or null if not found
 */
function extractFrontmatter(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return null;
	}

	try {
		return yaml.load(match[1]);
	} catch (error) {
		return { error: `YAML parse error: ${error.message}` };
	}
}

/**
 * Load the frontmatter schema
 * @returns {Object} JSON schema
 */
function loadSchema() {
	const schemaPath = path.join(
		__dirname,
		'../../.github/schemas/frontmatter.schema.json'
	);
	return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

/**
 * Validate frontmatter against schema
 * @param {Object} frontmatter - Parsed frontmatter
 * @param {Object} schema - JSON schema
 * @returns {Object} Validation result {valid: boolean, errors: Array}
 */
function validateFrontmatter(frontmatter, schema) {
	const ajv = new Ajv({ allErrors: true, strict: false });
	addFormats(ajv);

	const validate = ajv.compile(schema);
	const valid = validate(frontmatter);

	return {
		valid,
		errors: validate.errors || [],
	};
}

/**
 * Check if last_updated is recent (within 90 days)
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is recent
 */
function isRecentUpdate(dateString) {
	if (!dateString) return false;

	try {
		const lastUpdated = new Date(dateString);
		const now = new Date();
		const daysSince = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
		return daysSince <= 90;
	} catch {
		return false;
	}
}

/**
 * Check if referenced files exist
 * @param {Array<string>} references - Array of file paths
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array<string>} Array of missing files
 */
function checkReferences(references, baseDir) {
	if (!Array.isArray(references)) return [];

	const missing = [];

	for (const ref of references) {
		// Skip external URLs
		if (ref.startsWith('http://') || ref.startsWith('https://')) {
			continue;
		}

		const refPath = path.resolve(baseDir, ref);
		if (!fs.existsSync(refPath)) {
			missing.push(ref);
		}
	}

	return missing;
}

/**
 * Audit a single file
 * @param {string} filePath - Path to the file
 * @param {Object} schema - JSON schema
 * @returns {Object} Audit result
 */
function auditFile(filePath, schema) {
	const content = fs.readFileSync(filePath, 'utf8');
	const frontmatter = extractFrontmatter(content);

	if (!frontmatter) {
		return {
			file: filePath,
			status: 'no_frontmatter',
			errors: ['No frontmatter found'],
			warnings: [],
		};
	}

	if (frontmatter.error) {
		return {
			file: filePath,
			status: 'parse_error',
			errors: [frontmatter.error],
			warnings: [],
		};
	}

	const validation = validateFrontmatter(frontmatter, schema);
	const warnings = [];

	// Check for stale last_updated
	if (
		frontmatter.last_updated &&
		!isRecentUpdate(frontmatter.last_updated)
	) {
		warnings.push(
			`last_updated is more than 90 days old: ${frontmatter.last_updated}`
		);
	}

	// Check references
	const baseDir = path.dirname(filePath);
	const missingRefs = checkReferences(frontmatter.references, baseDir);
	if (missingRefs.length > 0) {
		warnings.push(`Missing references: ${missingRefs.join(', ')}`);
	}

	return {
		file: filePath,
		status: validation.valid ? 'valid' : 'invalid',
		errors: validation.errors.map(
			(err) =>
				`${err.instancePath || 'root'}: ${err.message} ${
					err.params ? JSON.stringify(err.params) : ''
				}`
		),
		warnings,
	};
}

/**
 * Main audit function
 * @param {Object} options - Audit options
 * @returns {Object} Audit results
 */
async function auditFrontmatter(options = {}) {
	const {
		patterns = [
			'.github/agents/*.agent.md',
			'.github/instructions/*.instructions.md',
			'.github/prompts/*.prompt.md'
		],
		baseDir = process.cwd()
	} = options;

	// Load schema
	const schema = loadSchema();

	// Find all files
	const files = [];
	for (const pattern of patterns) {
		const matches = await glob(pattern, {
			cwd: baseDir,
			ignore: ['node_modules/**', 'vendor/**', 'generated-plugins/**'],
			absolute: true,
		});
		files.push(...matches);
	}

	// Audit each file
	const results = files.map((file) => auditFile(file, schema));

	// Summarize results
	const summary = {
		total: results.length,
		valid: results.filter((r) => r.status === 'valid').length,
		invalid: results.filter((r) => r.status === 'invalid').length,
		no_frontmatter: results.filter((r) => r.status === 'no_frontmatter')
			.length,
		parse_error: results.filter((r) => r.status === 'parse_error').length,
		warnings: results.filter((r) => r.warnings.length > 0).length,
	};

	return {
		summary,
		results,
	};
}

/**
 * CLI runner
 */
async function main() {
	console.log('🔍 Auditing frontmatter...\n');

	const audit = await auditFrontmatter();

	// Print summary
	console.log('📊 Summary:');
	console.log(`   Total files: ${audit.summary.total}`);
	console.log(`   ✅ Valid: ${audit.summary.valid}`);
	console.log(`   ❌ Invalid: ${audit.summary.invalid}`);
	console.log(`   ⚠️  Warnings: ${audit.summary.warnings}`);
	console.log(`   📄 No frontmatter: ${audit.summary.no_frontmatter}`);
	console.log(`   💥 Parse errors: ${audit.summary.parse_error}`);
	console.log('');

	// Print details for invalid files
	const invalid = audit.results.filter(
		(r) => r.status === 'invalid' || r.errors.length > 0
	);
	if (invalid.length > 0) {
		console.log('❌ Invalid files:\n');
		invalid.forEach((result) => {
			console.log(`   ${path.relative(process.cwd(), result.file)}`);
			result.errors.forEach((err) => console.log(`      ❌ ${err}`));
			console.log('');
		});
	}

	// Print warnings
	const withWarnings = audit.results.filter((r) => r.warnings.length > 0);
	if (withWarnings.length > 0) {
		console.log('⚠️  Files with warnings:\n');
		withWarnings.forEach((result) => {
			console.log(`   ${path.relative(process.cwd(), result.file)}`);
			result.warnings.forEach((warn) => console.log(`      ⚠️  ${warn}`));
			console.log('');
		});
	}

	// Print files without frontmatter
	const noFrontmatter = audit.results.filter(
		(r) => r.status === 'no_frontmatter'
	);
	if (noFrontmatter.length > 0) {
		console.log('📄 Files without frontmatter:\n');
		noFrontmatter.forEach((result) => {
			console.log(`   ${path.relative(process.cwd(), result.file)}`);
		});
		console.log('');
	}

	// Exit with error code if there are invalid files
	if (audit.summary.invalid > 0 || audit.summary.parse_error > 0) {
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main().catch((error) => {
		console.error('Error:', error);
		process.exit(1);
	});
}

module.exports = {
	auditFrontmatter,
	extractFrontmatter,
	validateFrontmatter,
};
