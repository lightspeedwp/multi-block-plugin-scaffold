# Mustache Variable Scanning Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the mustache variable scanning system with better detection, tracking, type inference, change reporting, and CI integration.

**Architecture:** Extend the existing `scripts/utils/scan.js` module with additional capabilities while maintaining backward compatibility. Add new CLI flags to `scan-mustache-variables.js` and enhance the validation system. Implement .mustacheignore pattern matching using glob patterns.

**Tech Stack:** Node.js, Jest for testing, glob patterns for ignore functionality, JSON Schema for validation

---

## Task 1: Enhance .mustacheignore Support

**Files:**
- Modify: `scripts/utils/scan.js:82-83`
- Test: `scripts/utils/__tests__/scan.test.js` (create new)

**Step 1: Write failing test for .mustacheignore pattern loading**

Create new test file:

```javascript
/**
 * Tests for scan utilities
 */
const fs = require('fs');
const path = require('path');
const {
	loadIgnorePatterns,
	shouldIgnorePath,
} = require('../scan');

describe('loadIgnorePatterns', () => {
	const tempDir = path.join(__dirname, 'temp-ignore-test');
	const ignorePath = path.join(tempDir, '.mustacheignore');

	beforeEach(() => {
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}
	});

	afterEach(() => {
		if (fs.existsSync(ignorePath)) {
			fs.unlinkSync(ignorePath);
		}
		if (fs.existsSync(tempDir)) {
			fs.rmdirSync(tempDir);
		}
	});

	test('returns empty array when .mustacheignore does not exist', () => {
		const patterns = loadIgnorePatterns(tempDir);
		expect(patterns).toEqual([]);
	});

	test('loads patterns from .mustacheignore file', () => {
		fs.writeFileSync(ignorePath, 'node_modules/\nbuild/\n# comment\n\ndocs/');
		const patterns = loadIgnorePatterns(tempDir);
		expect(patterns).toEqual(['node_modules/', 'build/', 'docs/']);
	});

	test('shouldIgnorePath matches simple patterns', () => {
		const patterns = ['node_modules/', 'build/'];
		expect(shouldIgnorePath('node_modules/package', patterns)).toBe(true);
		expect(shouldIgnorePath('src/index.js', patterns)).toBe(false);
	});

	test('shouldIgnorePath matches glob patterns', () => {
		const patterns = ['**/*.test.js', 'src/experimental/**'];
		expect(shouldIgnorePath('src/utils/scan.test.js', patterns)).toBe(true);
		expect(shouldIgnorePath('src/experimental/feature.js', patterns)).toBe(true);
		expect(shouldIgnorePath('src/utils/scan.js', patterns)).toBe(false);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- scripts/utils/__tests__/scan.test.js`
Expected: FAIL with "loadIgnorePatterns is not defined"

**Step 3: Implement .mustacheignore loading and pattern matching**

In `scripts/utils/scan.js`, add after line 80:

```javascript
/**
 * Load ignore patterns from .mustacheignore file
 *
 * @param {string} rootDir - Root directory to search for .mustacheignore
 * @return {string[]} Array of ignore patterns
 */
function loadIgnorePatterns(rootDir = ROOT_DIR) {
	const ignorePath = path.join(rootDir, '.mustacheignore');
	if (!fs.existsSync(ignorePath)) {
		return [];
	}

	const content = fs.readFileSync(ignorePath, 'utf8');
	return content
		.split(/\r?\n/)
		.map(line => line.trim())
		.filter(line => line && !line.startsWith('#'));
}

/**
 * Check if a path should be ignored based on patterns
 *
 * @param {string} filePath - Path to check
 * @param {string[]} patterns - Ignore patterns
 * @return {boolean} True if path should be ignored
 */
function shouldIgnorePath(filePath, patterns) {
	if (!patterns || patterns.length === 0) {
		return false;
	}

	// Normalize path separators
	const normalizedPath = filePath.replace(/\\/g, '/');

	for (const pattern of patterns) {
		const normalizedPattern = pattern.replace(/\\/g, '/');

		// Simple prefix match for directory patterns
		if (normalizedPattern.endsWith('/')) {
			if (normalizedPath.startsWith(normalizedPattern) ||
				normalizedPath.includes('/' + normalizedPattern)) {
				return true;
			}
		}

		// Glob pattern match
		if (normalizedPattern.includes('*')) {
			const regex = new RegExp(
				'^' + normalizedPattern
					.replace(/\./g, '\\.')
					.replace(/\*\*/g, '.*')
					.replace(/\*/g, '[^/]*') + '$'
			);
			if (regex.test(normalizedPath)) {
				return true;
			}
		}

		// Exact match
		if (normalizedPath === normalizedPattern || normalizedPath.endsWith('/' + normalizedPattern)) {
			return true;
		}
	}

	return false;
}

// Load custom ignore patterns from .mustacheignore if present
const IGNORE_PATTERNS = loadIgnorePatterns();
```

**Step 4: Update scanDirectory to use ignore patterns**

Replace lines 82-83 in `scan.js` with:

```javascript
let IGNORE_PATHS = [];
```

Then update the `scanDirectory` function (around line 13):

```javascript
if (EXCLUDE_DIRS.includes(entry.name) ||
	IGNORE_PATHS.includes(relPath) ||
	shouldIgnorePath(relPath, IGNORE_PATTERNS)) {
	continue;
}
```

**Step 5: Run tests to verify they pass**

Run: `npm test -- scripts/utils/__tests__/scan.test.js`
Expected: PASS - all tests green

**Step 6: Export new functions**

At the bottom of `scan.js` (around line 795), add to exports:

```javascript
module.exports = {
	// ... existing exports
	loadIgnorePatterns,
	shouldIgnorePath,
	IGNORE_PATTERNS,
};
```

**Step 7: Commit**

```bash
git add scripts/utils/scan.js scripts/utils/__tests__/scan.test.js
git commit -m "feat: add .mustacheignore pattern support with glob matching

- Load ignore patterns from .mustacheignore file
- Support simple paths, directory prefixes, and glob patterns
- Add comprehensive test coverage for pattern matching
- Update scanDirectory to respect ignore patterns

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add Registry Change Reporting

**Files:**
- Create: `scripts/utils/registry-diff.js`
- Modify: `scripts/scan-mustache-variables.js:22-36`
- Test: `scripts/utils/__tests__/registry-diff.test.js` (create new)
- Create: `scripts/reports/.gitkeep`

**Step 1: Write failing test for registry diff detection**

Create `scripts/utils/__tests__/registry-diff.test.js`:

```javascript
/**
 * Tests for registry diff utilities
 */
const {
	compareRegistries,
	formatDiffReport,
	saveDiffReport,
} = require('../registry-diff');

describe('compareRegistries', () => {
	test('detects added variables', () => {
		const oldRegistry = {
			variables: { foo: { name: 'foo', count: 1 } }
		};
		const newRegistry = {
			variables: {
				foo: { name: 'foo', count: 1 },
				bar: { name: 'bar', count: 2 }
			}
		};

		const diff = compareRegistries(oldRegistry, newRegistry);
		expect(diff.added).toEqual(['bar']);
		expect(diff.removed).toEqual([]);
		expect(diff.modified).toEqual([]);
	});

	test('detects removed variables', () => {
		const oldRegistry = {
			variables: {
				foo: { name: 'foo', count: 1 },
				bar: { name: 'bar', count: 2 }
			}
		};
		const newRegistry = {
			variables: { foo: { name: 'foo', count: 1 } }
		};

		const diff = compareRegistries(oldRegistry, newRegistry);
		expect(diff.added).toEqual([]);
		expect(diff.removed).toEqual(['bar']);
		expect(diff.modified).toEqual([]);
	});

	test('detects modified variables', () => {
		const oldRegistry = {
			variables: { foo: { name: 'foo', count: 1, files: ['a.js'] } }
		};
		const newRegistry = {
			variables: { foo: { name: 'foo', count: 3, files: ['a.js', 'b.js'] } }
		};

		const diff = compareRegistries(oldRegistry, newRegistry);
		expect(diff.added).toEqual([]);
		expect(diff.removed).toEqual([]);
		expect(diff.modified).toHaveLength(1);
		expect(diff.modified[0].name).toBe('foo');
		expect(diff.modified[0].changes).toContain('count: 1 → 3');
	});

	test('returns empty diff for identical registries', () => {
		const registry = {
			variables: { foo: { name: 'foo', count: 1 } }
		};

		const diff = compareRegistries(registry, registry);
		expect(diff.added).toEqual([]);
		expect(diff.removed).toEqual([]);
		expect(diff.modified).toEqual([]);
	});
});

describe('formatDiffReport', () => {
	test('formats diff report with all change types', () => {
		const diff = {
			added: ['new_var'],
			removed: ['old_var'],
			modified: [
				{ name: 'changed_var', changes: ['count: 1 → 2'] }
			],
			timestamp: '2025-12-18T10:00:00.000Z'
		};

		const report = formatDiffReport(diff);
		expect(report).toContain('Registry Changes');
		expect(report).toContain('Added (1)');
		expect(report).toContain('new_var');
		expect(report).toContain('Removed (1)');
		expect(report).toContain('old_var');
		expect(report).toContain('Modified (1)');
		expect(report).toContain('changed_var');
	});

	test('returns message for no changes', () => {
		const diff = {
			added: [],
			removed: [],
			modified: [],
			timestamp: '2025-12-18T10:00:00.000Z'
		};

		const report = formatDiffReport(diff);
		expect(report).toContain('No changes detected');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- scripts/utils/__tests__/registry-diff.test.js`
Expected: FAIL with "Cannot find module '../registry-diff'"

**Step 3: Implement registry diff utilities**

Create `scripts/utils/registry-diff.js`:

```javascript
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
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- scripts/utils/__tests__/registry-diff.test.js`
Expected: PASS - all tests green

**Step 5: Integrate diff reporting into updateRegistry function**

In `scripts/scan-mustache-variables.js`, update the `updateRegistry` function:

```javascript
const { compareRegistries, formatDiffReport, saveDiffReport } = require('./utils/registry-diff');

function updateRegistry() {
	// Load old registry for comparison
	let oldRegistry = { variables: {} };
	if (fs.existsSync(REGISTRY_PATH)) {
		try {
			oldRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
		} catch (e) {
			// ignore
		}
	}

	const { results } = buildRegistry();
	const sorted = sortVariablesAlphabetically(results.variables);
	const newRegistry = { summary: results.summary, variables: sorted };

	// Compare and generate diff report
	const diff = compareRegistries(oldRegistry, newRegistry);

	// Write updated registry
	fs.writeFileSync(
		REGISTRY_PATH,
		JSON.stringify(newRegistry, null, 2) + '\n'
	);

	// Output changes to console
	if (diff.added.length > 0 || diff.removed.length > 0 || diff.modified.length > 0) {
		console.log('\n' + formatDiffReport(diff));

		// Save dated report
		const reportPath = saveDiffReport(diff);
		console.log(`\nChange report saved to: ${reportPath}`);
	}

	if (results.missingInRegistry && results.missingInRegistry.length > 0) {
		console.warn('⚠️  Variables found in files but missing from registry:', results.missingInRegistry);
	}
	if (results.unusedInFiles && results.unusedInFiles.length > 0) {
		console.warn('⚠️  Variables in registry not found in any file:', results.unusedInFiles);
	}
	console.log(`Updated mustache registry: ${REGISTRY_PATH}`);
}
```

**Step 6: Create reports directory with .gitkeep**

Run: `mkdir -p scripts/reports && touch scripts/reports/.gitkeep`

**Step 7: Run integration test**

Run: `node scripts/scan-mustache-variables.js --update-registry`
Expected: Registry updated with diff report

**Step 8: Commit**

```bash
git add scripts/utils/registry-diff.js scripts/utils/__tests__/registry-diff.test.js scripts/scan-mustache-variables.js scripts/reports/.gitkeep
git commit -m "feat: add registry change reporting

- Compare old and new registry versions
- Generate diff reports with added/removed/modified variables
- Save dated change reports to scripts/reports
- Display changes in console output
- Full test coverage for diff utilities

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add CI/Pre-commit Validation Mode

**Files:**
- Modify: `scripts/scan-mustache-variables.js:56-89`
- Modify: `scripts/validation/validate-mustache-registry.js:111-165`
- Test: `scripts/validation/__tests__/validate-mustache-registry.test.js`

**Step 1: Write failing test for strict validation mode**

Update `scripts/validation/__tests__/validate-mustache-registry.test.js`:

```javascript
/**
 * Tests for Validate Mustache Registry
 */
const fs = require('fs');
const path = require('path');
const { validateRegistry, checkNewVariablesHavePlaceholders } = require('../validate-mustache-registry');

describe('Validate Mustache Registry', () => {
	test('validateRegistry fails when new variables lack placeholders', () => {
		const mockRegistry = {
			variables: {
				new_var: { name: 'new_var', count: 1, files: ['test.js'] }
			}
		};

		const mockPlaceholders = {};
		const result = validateRegistry(mockRegistry, mockPlaceholders, { strict: true });

		expect(result.valid).toBe(false);
		expect(result.errors).toContain('new_var');
	});

	test('validateRegistry passes when all variables have placeholders', () => {
		const mockRegistry = {
			variables: {
				existing_var: { name: 'existing_var', count: 1, files: ['test.js'] }
			}
		};

		const mockPlaceholders = {
			existing_var: 'placeholder value'
		};
		const result = validateRegistry(mockRegistry, mockPlaceholders, { strict: true });

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	test('checkNewVariablesHavePlaceholders returns variables without placeholders', () => {
		const variables = ['var1', 'var2', 'var3'];
		const placeholders = { var1: 'value1' };

		const missing = checkNewVariablesHavePlaceholders(variables, placeholders);
		expect(missing).toEqual(['var2', 'var3']);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- scripts/validation/__tests__/validate-mustache-registry.test.js`
Expected: FAIL with "validateRegistry is not a function"

**Step 3: Implement strict validation mode**

In `scripts/validation/validate-mustache-registry.js`, add before `main()` function:

```javascript
/**
 * Check if new variables have placeholder values defined
 *
 * @param {string[]} variables - Variable names to check
 * @param {Object} placeholders - Placeholder map
 * @return {string[]} Variables without placeholders
 */
function checkNewVariablesHavePlaceholders(variables, placeholders) {
	return variables.filter(varName => {
		return !placeholders.hasOwnProperty(varName) ||
			placeholders[varName] === undefined ||
			placeholders[varName] === '';
	});
}

/**
 * Validate registry with optional strict mode
 *
 * @param {Object} registry - Registry object
 * @param {Object} placeholders - Placeholder values
 * @param {Object} options - Validation options
 * @return {Object} Validation result
 */
function validateRegistry(registry, placeholders, options = {}) {
	const errors = [];
	const warnings = [];

	if (options.strict) {
		const variables = Object.keys(registry.variables || {});
		const missing = checkNewVariablesHavePlaceholders(variables, placeholders);

		if (missing.length > 0) {
			errors.push(...missing.map(v => `Variable '${v}' lacks a placeholder value`));
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}
```

**Step 4: Add --strict flag to CLI**

Update the `main()` function in `validate-mustache-registry.js`:

```javascript
function main() {
	const args = process.argv.slice(2);
	const strictMode = args.includes('--strict');

	const registry = loadRegistry();
	const files = gatherTemplateFiles();
	const foundMap = buildFoundMap(files);

	const registryKeys = new Set(registry.keys());
	const foundKeys = new Set(foundMap.keys());

	const missingRegistry = [];
	foundKeys.forEach((key) => {
		if (!registryKeys.has(key)) {
			missingRegistry.push(key);
		}
	});

	const staleRegistry = [];
	registryKeys.forEach((key) => {
		if (!foundKeys.has(key)) {
			staleRegistry.push(key);
		}
	});

	const issues = [];

	if (missingRegistry.length) {
		issues.push(
			`Templates include ${missingRegistry.length} unregistered mustache variable(s): ${formatList(
				missingRegistry
			)}`
		);
	}

	if (staleRegistry.length) {
		issues.push(
			`Registry lists ${staleRegistry.length} variable(s) that no longer appear in templates: ${formatList(
				staleRegistry
			)}`
		);
	}

	// Strict mode: check for placeholder values
	if (strictMode && missingRegistry.length > 0) {
		const placeholdersPath = path.join(ROOT_DIR, 'scripts', 'utils', 'placeholders.js');
		let placeholders = {};
		try {
			placeholders = require(placeholdersPath);
		} catch (e) {
			// ignore
		}

		const missingPlaceholders = checkNewVariablesHavePlaceholders(missingRegistry, placeholders);
		if (missingPlaceholders.length > 0) {
			issues.push(
				`New variables lack placeholder values: ${formatList(missingPlaceholders)}`
			);
		}
	}

	console.log(`✔ Scanned ${files.length} template file(s) across ${SCAN_DIRS.length} directories.`);
	console.log(`✔ Registry contains ${registryKeys.size} variable(s).`);

	if (issues.length) {
		console.error('❌ Mustache registry validation failed:');
		issues.forEach((issue) => console.error(`  - ${issue}`));
		process.exitCode = 1;
	} else {
		console.log('✅ Mustache registry is in sync with template files.');
	}
}
```

**Step 5: Export new functions**

At the bottom of `validate-mustache-registry.js`:

```javascript
module.exports = {
	loadRegistry,
	gatherTemplateFiles,
	buildFoundMap,
	validateRegistry,
	checkNewVariablesHavePlaceholders,
};
```

**Step 6: Run tests to verify they pass**

Run: `npm test -- scripts/validation/__tests__/validate-mustache-registry.test.js`
Expected: PASS - all tests green

**Step 7: Add --ci-fail CLI flag to scan-mustache-variables.js**

In `scripts/scan-mustache-variables.js`, update `main()` function:

```javascript
function main() {
	const args = process.argv.slice(2);

	if (args.includes('--update-registry')) {
		updateRegistry();
		return;
	}
	if (args.includes('--fix-fixtures')) {
		fixFixtures();
		return;
	}
	if (args.includes('--json')) {
		outputJson();
		return;
	}
	if (args.includes('--ci-fail')) {
		// CI mode: fail if registry is out of sync
		const { results } = buildRegistry();

		const issues = [];
		if (results.missingInRegistry?.length > 0) {
			issues.push(`${results.missingInRegistry.length} variables in files not in registry`);
		}
		if (results.unusedInFiles?.length > 0) {
			issues.push(`${results.unusedInFiles.length} variables in registry not in files`);
		}

		if (issues.length > 0) {
			console.error('❌ Registry validation failed:');
			issues.forEach(issue => console.error(`  - ${issue}`));
			console.error('\nRun: node scripts/scan-mustache-variables.js --update-registry');
			process.exit(1);
		}

		console.log('✅ Registry is in sync');
		return;
	}

	const validateIndex = args.indexOf('--validate');
	if (validateIndex !== -1) {
		const configPath = args[validateIndex + 1];
		if (!configPath) {
			console.error('Missing argument for --validate');
			process.exit(1);
		}
		const { results } = buildRegistry();
		validateConfig(configPath, results);
		return;
	}

	// Default: print summary
	require('./utils/scan').runCli();
}
```

**Step 8: Test CI mode**

Run: `node scripts/scan-mustache-variables.js --ci-fail`
Expected: Exits with 0 if in sync, 1 if out of sync

**Step 9: Document CI usage**

Update the header comment in `scripts/scan-mustache-variables.js`:

```javascript
/**
 * CLI for scanning mustache variables and updating the registry/fixtures.
 *
 * Usage:
 *   node scripts/scan-mustache-variables.js --update-registry
 *   node scripts/scan-mustache-variables.js --fix-fixtures
 *   node scripts/scan-mustache-variables.js --json
 *   node scripts/scan-mustache-variables.js --validate <configPath>
 *   node scripts/scan-mustache-variables.js --ci-fail
 *
 * CI/Pre-commit Integration:
 *   --ci-fail: Exit with error code if registry is out of sync
 *              Use in CI or pre-commit hooks to enforce registry sync
 */
```

**Step 10: Commit**

```bash
git add scripts/scan-mustache-variables.js scripts/validation/validate-mustache-registry.js scripts/validation/__tests__/validate-mustache-registry.test.js
git commit -m "feat: add CI/pre-commit validation mode

- Add --ci-fail flag to fail if registry is out of sync
- Add --strict mode to validate-mustache-registry
- Check that new variables have placeholder values
- Exit with error code for CI integration
- Document CI usage in script header

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Refactor Type Inference (Already Implemented)

**Files:**
- Review: `scripts/utils/scan.js:105-155` (type inference already exists)
- Test: `scripts/utils/__tests__/scan.test.js`

**Step 1: Write tests for existing type inference**

Add to `scripts/utils/__tests__/scan.test.js`:

```javascript
const { inferVariableType } = require('../scan');

describe('inferVariableType', () => {
	test('infers URL format', () => {
		const result = inferVariableType('site_url', [], ['config.json']);
		expect(result.type).toBe('string');
		expect(result.format).toBe('url');
	});

	test('infers email format', () => {
		const result = inferVariableType('author_email', [], ['package.json']);
		expect(result.type).toBe('string');
		expect(result.format).toBe('email');
	});

	test('infers boolean type', () => {
		const result = inferVariableType('is_active', [], ['config.js']);
		expect(result.type).toBe('boolean');
	});

	test('infers number type', () => {
		const result = inferVariableType('post_count', [], ['template.php']);
		expect(result.type).toBe('number');
	});

	test('infers array type', () => {
		const result = inferVariableType('tag_list', [], ['data.json']);
		expect(result.type).toBe('array');
	});

	test('infers color format', () => {
		const result = inferVariableType('primary_color', [], ['styles.css']);
		expect(result.type).toBe('string');
		expect(result.format).toBe('color');
	});

	test('infers slug format', () => {
		const result = inferVariableType('post_slug', [], ['template.html']);
		expect(result.type).toBe('string');
		expect(result.format).toBe('slug');
	});

	test('defaults to string type', () => {
		const result = inferVariableType('unknown_var', [], ['file.txt']);
		expect(result.type).toBe('string');
		expect(result.format).toBeUndefined();
	});
});
```

**Step 2: Run tests to verify type inference works**

Run: `npm test -- scripts/utils/__tests__/scan.test.js -t "inferVariableType"`
Expected: PASS - type inference is already implemented

**Step 3: Export inferVariableType if not already exported**

Check exports in `scan.js` (line 782-795), add if missing:

```javascript
module.exports = {
	// ... existing exports
	inferVariableType,
};
```

**Step 4: Run all scan tests**

Run: `npm test -- scripts/utils/__tests__/scan.test.js`
Expected: PASS - all tests green

**Step 5: Commit**

```bash
git add scripts/utils/__tests__/scan.test.js scripts/utils/scan.js
git commit -m "test: add comprehensive tests for variable type inference

- Test URL, email, boolean, number, array type detection
- Test color, slug, and other format detection
- Verify default fallback to string type
- Export inferVariableType for testing

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update Documentation

**Files:**
- Create: `docs/mustache-scanning.md`
- Modify: `README.md` (add link to documentation)

**Step 1: Create comprehensive documentation**

Create `docs/mustache-scanning.md`:

```markdown
# Mustache Variable Scanning

This document describes the mustache variable scanning and registry system used in the plugin scaffold.

## Overview

The scanning system automatically discovers and tracks mustache variables (like `{{slug}}`) used throughout the codebase. It maintains a registry of all variables with metadata about their usage.

## CLI Commands

### Scan and Report

```bash
# Display summary of mustache variables
node scripts/scan-mustache-variables.js

# Output as JSON
node scripts/scan-mustache-variables.js --json
```

### Update Registry

```bash
# Update the registry file
node scripts/scan-mustache-variables.js --update-registry
```

This will:
- Scan all template files for mustache variables
- Update `scripts/mustache-variables-registry.json`
- Generate a diff report showing changes
- Save a dated change report to `scripts/reports/`

### Validate Configuration

```bash
# Validate a config file against the registry
node scripts/scan-mustache-variables.js --validate path/to/config.json
```

### CI Integration

```bash
# Fail if registry is out of sync (for CI/pre-commit)
node scripts/scan-mustache-variables.js --ci-fail
```

Exit codes:
- `0`: Registry is in sync
- `1`: Registry is out of sync (needs update)

### Fix Fixtures

```bash
# Update example fixtures
node scripts/scan-mustache-variables.js --fix-fixtures
```

## Registry Validation

```bash
# Validate registry is in sync with files
node scripts/validation/validate-mustache-registry.js

# Strict mode: also check for placeholder values
node scripts/validation/validate-mustache-registry.js --strict
```

## Ignore Patterns

Create a `.mustacheignore` file at the repository root to exclude files/directories from scanning:

```
# .mustacheignore

# Exclude directories
node_modules/
build/
dist/

# Exclude specific files
temp.js

# Glob patterns
**/*.test.js
src/experimental/**
```

Pattern types supported:
- Directory prefixes: `node_modules/`
- Exact paths: `src/temp.js`
- Glob patterns: `**/*.test.js`, `src/*/temp/**`

## Variable Type Inference

The scanner automatically infers variable types and formats based on naming conventions:

| Pattern | Type | Format |
|---------|------|--------|
| `*_url`, `*_uri` | string | url |
| `*_email` | string | email |
| `*_color`, `*_colour` | string | color |
| `is_*`, `has_*` | boolean | - |
| `*_count`, `*_number` | number | - |
| `*_list`, `*_array`, `*_ids` | array | - |
| `*_slug` | string | slug |
| `namespace` | string | namespace |
| `version` | string | semver |
| Other | string | - |

## Registry Structure

The registry file (`scripts/mustache-variables-registry.json`) contains:

```json
{
  "summary": {
    "totalFiles": 256,
    "filesWithVariables": 190,
    "uniqueVariables": 42,
    "totalOccurrences": 873
  },
  "variables": {
    "slug": {
      "name": "slug",
      "category": "core_identity",
      "files": ["package.json", "{{slug}}.php"],
      "count": 127,
      "usage": [
        { "file": "package.json", "line": 3 },
        { "file": "{{slug}}.php", "line": 12 }
      ],
      "type": "string",
      "format": "slug"
    }
  }
}
```

### Fields

- `summary`: Aggregate statistics
- `variables`: Map of variable name to metadata
  - `name`: Variable name (without `{{}}`)
  - `category`: Classification (core_identity, author_contact, etc.)
  - `files`: Array of file paths where variable appears
  - `count`: Total occurrences across all files
  - `usage`: Array of `{file, line}` objects for each occurrence
  - `type`: Inferred data type (string, number, boolean, array, object)
  - `format`: Optional format hint (url, email, color, slug, etc.)

## Change Reports

When updating the registry, a diff report is generated:

```markdown
# Mustache Variable Registry Changes

**Date:** 2025-12-18T10:30:00.000Z

## Added (2)

- `{{new_var}}`
- `{{another_var}}`

## Removed (1)

- `{{old_var}}`

## Modified (1)

- `{{existing_var}}`
  - count: 5 → 12
  - files: 2 → 4
```

Reports are saved to `scripts/reports/registry-changes-YYYY-MM-DD-HH-MM-SS.md`.

## Pre-commit Hook Integration

Add to `.husky/pre-commit` or `lint-staged` config:

```bash
# Fail if registry is out of sync
node scripts/scan-mustache-variables.js --ci-fail
```

Or with auto-fix:

```bash
# Auto-update registry and stage changes
node scripts/scan-mustache-variables.js --update-registry
git add scripts/mustache-variables-registry.json
```

## Categories

Variables are categorized for organization:

- `core_identity`: slug, name, namespace, description
- `author_contact`: author, email
- `versioning`: version, php_version, wp_version
- `urls`: *_url, *_uri
- `license`: license info
- `design_colors`: *_color, *_colour
- `design_typography`: font, line_height, weight
- `design_layout`: width, spacing, size
- `content_strings`: text, title, excerpt
- `images`: image, thumbnail
- `theme_metadata`: tags, textdomain
- `ui_components`: button, border
- `other`: uncategorized

## Troubleshooting

### Registry out of sync

```bash
node scripts/scan-mustache-variables.js --update-registry
```

### Finding where a variable is used

```bash
node scripts/scan-mustache-variables.js --json | jq '.variables.slug.usage'
```

### Checking ignore patterns

```bash
# View what's being ignored
cat .mustacheignore

# Test if a path is ignored (manually check patterns)
```

## API

For programmatic usage, import from `scripts/utils/scan.js`:

```javascript
const {
  buildRegistry,
  extractVariables,
  categorizeVariable,
  inferVariableType,
  loadIgnorePatterns,
  shouldIgnorePath,
} = require('./scripts/utils/scan');

// Build registry
const { results } = buildRegistry();

// Extract from content
const vars = extractVariables('Hello {{name}}!');
// ['name']

// Categorize
const category = categorizeVariable('author_email');
// 'author_contact'

// Type inference
const { type, format } = inferVariableType('site_url', [], []);
// { type: 'string', format: 'url' }
```
```

**Step 2: Update README.md**

Add to the README.md (find appropriate section):

```markdown
## Mustache Variable Scanning

The scaffold includes a comprehensive mustache variable scanning system. See [docs/mustache-scanning.md](docs/mustache-scanning.md) for full documentation.

Quick commands:
- Scan: `node scripts/scan-mustache-variables.js`
- Update registry: `node scripts/scan-mustache-variables.js --update-registry`
- Validate: `node scripts/scan-mustache-variables.js --ci-fail`
```

**Step 3: Commit**

```bash
git add docs/mustache-scanning.md README.md
git commit -m "docs: add comprehensive mustache scanning documentation

- Document all CLI commands and flags
- Explain registry structure and fields
- Cover ignore patterns and type inference
- Add pre-commit hook integration examples
- Include API usage examples
- Add troubleshooting section

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Integration Testing

**Files:**
- Create: `scripts/__tests__/scan-integration.test.js`

**Step 1: Write integration test**

Create `scripts/__tests__/scan-integration.test.js`:

```javascript
/**
 * Integration tests for mustache variable scanning
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Mustache Scanning Integration', () => {
	const tempDir = path.join(__dirname, 'temp-integration');
	const registryPath = path.join(tempDir, 'registry.json');

	beforeEach(() => {
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true });
		}
		fs.mkdirSync(tempDir, { recursive: true });
	});

	afterEach(() => {
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true });
		}
	});

	test('full scan updates registry with type inference', () => {
		// Create test files
		const testFile = path.join(tempDir, 'test.js');
		fs.writeFileSync(testFile, 'const url = "{{site_url}}";');

		// Run scan (would need to mock buildRegistry to use tempDir)
		const { buildRegistry } = require('../utils/scan');
		const { results } = buildRegistry({ rootDir: tempDir, directories: ['.'] });

		expect(results.summary.uniqueVariables).toBeGreaterThan(0);
		expect(results.variables.site_url).toBeDefined();
		expect(results.variables.site_url.type).toBe('string');
		expect(results.variables.site_url.format).toBe('url');
	});

	test('ignore patterns exclude files from scan', () => {
		// Create .mustacheignore
		const ignorePath = path.join(tempDir, '.mustacheignore');
		fs.writeFileSync(ignorePath, '**/*.test.js');

		// Create files
		fs.writeFileSync(path.join(tempDir, 'include.js'), '{{var1}}');
		fs.writeFileSync(path.join(tempDir, 'exclude.test.js'), '{{var2}}');

		const { buildRegistry } = require('../utils/scan');
		const { results } = buildRegistry({ rootDir: tempDir, directories: ['.'] });

		expect(results.variables.var1).toBeDefined();
		expect(results.variables.var2).toBeUndefined();
	});

	test('registry diff detects changes', () => {
		const { compareRegistries } = require('../utils/registry-diff');

		const oldReg = {
			variables: {
				old: { name: 'old', count: 1 }
			}
		};

		const newReg = {
			variables: {
				old: { name: 'old', count: 2 },
				new: { name: 'new', count: 1 }
			}
		};

		const diff = compareRegistries(oldReg, newReg);
		expect(diff.added).toContain('new');
		expect(diff.modified).toHaveLength(1);
		expect(diff.modified[0].name).toBe('old');
	});
});
```

**Step 2: Run integration tests**

Run: `npm test -- scripts/__tests__/scan-integration.test.js`
Expected: PASS - integration tests work end-to-end

**Step 3: Commit**

```bash
git add scripts/__tests__/scan-integration.test.js
git commit -m "test: add integration tests for scanning system

- Test full scan with type inference
- Test ignore pattern exclusions
- Test registry diff detection
- Verify end-to-end workflows

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Run Full Test Suite and Build

**Files:**
- All test files
- Build output

**Step 1: Run all unit tests**

Run: `npm run test:unit`
Expected: All tests pass

**Step 2: Run linting**

Run: `npm run lint`
Expected: No lint errors

**Step 3: Fix any lint issues**

If linting fails:
Run: `npm run lint:js:fix && npm run lint:css:fix`

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Verify all functionality manually**

```bash
# Test scan
node scripts/scan-mustache-variables.js

# Test update registry
node scripts/scan-mustache-variables.js --update-registry

# Test CI mode
node scripts/scan-mustache-variables.js --ci-fail

# Test validation
node scripts/validation/validate-mustache-registry.js
```

**Step 6: Review change reports**

Check: `scripts/reports/` for generated diff reports

**Step 7: Final commit**

```bash
git add .
git commit -m "chore: finalize mustache scanning enhancements

- All tests passing
- Lint issues resolved
- Build successful
- Manual testing complete

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Summary of Enhancements

### Completed Features

1. ✅ **Enhanced .mustacheignore Support**
   - Load patterns from `.mustacheignore` file
   - Support directory prefixes, exact paths, and glob patterns
   - Integrated into scan directory function

2. ✅ **Variable Type/Format Inference** (Already Implemented)
   - Heuristics based on variable naming
   - Type field (string, number, boolean, array, object)
   - Format field (url, email, color, slug, etc.)

3. ✅ **Variable Usage Tracking** (Already Implemented)
   - Track file paths and line numbers
   - Usage array in registry output

4. ✅ **Unused/Undocumented Variable Detection** (Already Implemented)
   - Flag variables in files but not in registry
   - Flag variables in registry but not in files

5. ✅ **Registry Change Reporting**
   - Compare old and new registry versions
   - Generate diff reports (added, removed, modified)
   - Save dated reports to `scripts/reports/`
   - Console output of changes

6. ✅ **CI/Pre-commit Integration**
   - `--ci-fail` flag for CI pipelines
   - `--strict` mode for validation
   - Exit codes for automation
   - Pre-commit hook documentation

7. ✅ **Comprehensive Documentation**
   - CLI command reference
   - Ignore pattern usage
   - Registry structure explanation
   - API usage examples
   - Troubleshooting guide

8. ✅ **Full Test Coverage**
   - Unit tests for all new functions
   - Integration tests for workflows
   - Type inference tests
   - Pattern matching tests

### Files Created/Modified

**Created:**
- `scripts/utils/__tests__/scan.test.js`
- `scripts/utils/registry-diff.js`
- `scripts/utils/__tests__/registry-diff.test.js`
- `scripts/__tests__/scan-integration.test.js`
- `scripts/reports/.gitkeep`
- `docs/mustache-scanning.md`
- `docs/plans/2025-12-18-mustache-scan-enhancements.md`

**Modified:**
- `scripts/utils/scan.js`
- `scripts/scan-mustache-variables.js`
- `scripts/validation/validate-mustache-registry.js`
- `scripts/validation/__tests__/validate-mustache-registry.test.js`
- `README.md`

### Next Steps

After implementation:
1. Update any CI configuration to use `--ci-fail`
2. Add pre-commit hook if desired
3. Share documentation with team
4. Monitor change reports for insights

---

## Execution Options

Plan complete and saved to `docs/plans/2025-12-18-mustache-scan-enhancements.md`.

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach would you like to use?**
