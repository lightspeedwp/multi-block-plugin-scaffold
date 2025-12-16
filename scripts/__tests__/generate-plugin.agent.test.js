/**
 * Tests for generate-plugin.agent.js
 *
 * Covers the CLI agent behavior without relying on callbacks.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

jest.mock('fs');

const AGENT_SCRIPT = path.join(__dirname, '../generate-plugin.agent.js');

/* eslint-disable jsdoc/check-line-alignment */
/**
 * Run the agent as a subprocess and capture stdout/stderr.
 *
 * @param {string[]} args - Command line arguments.
 * @param {Object} options - Optional settings.
 * @param {string} options.input - Data that should be piped to stdin.
 * @return {Promise<Object>} - Resolves with the exit code and outputs.
 */
/* eslint-enable jsdoc/check-line-alignment */
function runAgent(args = [], options = {}) {
	return new Promise((resolve, reject) => {
		const proc = spawn('node', [AGENT_SCRIPT, ...args], {
			stdio: ['pipe', 'pipe', 'pipe'],
		});

		let stdout = '';
		let stderr = '';

		proc.stdout.on('data', (chunk) => {
			stdout += chunk.toString();
		});

		proc.stderr.on('data', (chunk) => {
			stderr += chunk.toString();
		});

		proc.on('error', reject);

		proc.on('close', (code) => {
			resolve({ code, stdout, stderr });
		});

		if (options.input) {
			proc.stdin.write(options.input);
		}

		proc.stdin.end();
	});
}

describe('generate-plugin.agent.js', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		fs.writeFileSync = jest.fn();
		fs.existsSync = jest.fn().mockReturnValue(false);
		fs.readFileSync = jest.fn();
	});

	describe('Command Line Arguments', () => {
		it('shows help when the --help flag is present', async () => {
			const result = await runAgent(['--help']);
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('Usage:');
			expect(result.stdout).toContain('Interactive:');
			expect(result.stdout).toContain('With JSON:');
		});

		it('prints the schema when --schema is supplied', async () => {
			const result = await runAgent(['--schema']);
			expect(result.code).toBe(0);
			expect(result.stdout).toContain('"$schema"');
			expect(result.stdout).toContain('"type": "object"');
		});
	});

	describe('JSON Mode', () => {
		const validConfig = JSON.stringify({
			slug: 'test-plugin',
			name: 'Test Plugin',
			author: 'Test Author',
		});

		it('accepts valid JSON via stdin', async () => {
			const result = await runAgent(['--json'], { input: validConfig });
			expect(result.code).toBe(0);
			expect(result.stderr).toBe('');
		});

		it('rejects invalid JSON that is provided via stdin', async () => {
			const result = await runAgent(['--json'], {
				input: 'not valid json',
			});
			expect(result.code).not.toBe(0);
			expect(result.stderr).toContain('Invalid JSON');
		});

		it('validates structure while running in JSON mode', async () => {
			const incompleteConfig = JSON.stringify({
				slug: 'test-plugin',
				// missing name and author
			});

			const result = await runAgent(['--json'], {
				input: incompleteConfig,
			});
			expect(result.code).not.toBe(0);
			expect(result.stderr).toContain('required');
		});
	});

	describe('Validate Mode', () => {
		const validJson = JSON.stringify({
			slug: 'test-plugin',
			name: 'Test Plugin',
			author: 'Test Author',
		});

		it('reports success for a valid configuration', async () => {
			const result = await runAgent(['--validate', validJson]);
			expect(result.code).toBe(0);
			const hasSuccessIndicator = ['✓', 'valid'].some((symbol) =>
				result.stdout.includes(symbol)
			);
			expect(hasSuccessIndicator).toBe(true);
		});

		it('fails when the configuration format is invalid', async () => {
			const invalidConfig = JSON.stringify({
				slug: 'BAD Slug',
				name: 'Styled Test',
			});

			const result = await runAgent(['--validate', invalidConfig]);
			expect(result.code).not.toBe(0);
		});
	});
});
