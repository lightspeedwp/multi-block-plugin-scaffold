const fs = require('fs');
const path = require('path');
const { runDryRun, replacePlaceholders } = require('../dry-run-release');

describe('dry-run-release helper', () => {
	test('replacePlaceholders swaps {{}} tokens with dry-run markers', () => {
		const sample = 'Release {{theme_name}} - version {{version}}';
		const replaced = replacePlaceholders(sample);
		expect(replaced).toContain('dry-run-theme-name');
		expect(replaced).toContain('dry-run-version');
		expect(replaced).not.toMatch(/\{\{/);
	});

	test('runDryRun writes replaced files to tmp directory', () => {
		const tmpDir = path.resolve(__dirname, '../../tmp/dry-run-release-test');
		if (fs.existsSync(tmpDir)) {
			fs.rmSync(tmpDir, { recursive: true, force: true });
		}

		const outputDir = runDryRun({ outputDir: tmpDir });
		const sanitizedReleaseProcess = path.join(outputDir, 'docs', 'RELEASE_PROCESS.md');
		expect(fs.existsSync(sanitizedReleaseProcess)).toBe(true);
		const content = fs.readFileSync(sanitizedReleaseProcess, 'utf8');
		expect(content).not.toMatch(/\{\{/);
		expect(content).toMatch(/dry-run-/);

		fs.rmSync(tmpDir, { recursive: true, force: true });
	});
});
