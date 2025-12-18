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
