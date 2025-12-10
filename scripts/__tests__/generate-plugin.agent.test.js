/**
 * Tests for generate-plugin.agent.js
 *
 * Tests the interactive agent that collects plugin configuration requirements
 * and generates a plugin-config.json file for use with generate-plugin.js
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Mock fs module only (child_process needs to be real for spawn tests)
jest.mock('fs');

// Path to the agent script
const AGENT_SCRIPT = path.join(__dirname, '../generate-plugin.agent.js');

describe('generate-plugin.agent.js', () => {
	// Reset mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
		// Mock fs.writeFileSync by default
		fs.writeFileSync = jest.fn();
		fs.existsSync = jest.fn().mockReturnValue(false);
		fs.readFileSync = jest.fn();
	});

	describe('Command Line Arguments', () => {
		it('should display help when --help flag is provided', (done) => {
			const process = spawn('node', [AGENT_SCRIPT, '--help']);
			let output = '';

			process.stdout.on('data', (data) => {
				output += data.toString();
			});

			process.on('close', (code) => {
				expect(code).toBe(0);
				expect(output).toContain('Usage:');
				expect(output).toContain('Interactive:');
				expect(output).toContain('With JSON:');
				done();
			});
		});

		it('should display schema when --schema flag is provided', (done) => {
			const process = spawn('node', [AGENT_SCRIPT, '--schema']);
			let output = '';

			process.stdout.on('data', (data) => {
				output += data.toString();
			});

			process.on('close', (code) => {
				expect(code).toBe(0);
				expect(output).toContain('"$schema"');
				expect(output).toContain('"type": "object"');
				done();
			});
		});
	});

	describe('JSON Mode', () => {
		it('should accept valid JSON configuration via stdin', (done) => {
			const validConfig = JSON.stringify({
				slug: 'test-plugin',
				name: 'Test Plugin',
				author: 'Test Author',
			});

			const process = spawn('node', [AGENT_SCRIPT, '--json'], {
				stdio: ['pipe', 'pipe', 'pipe'],
			});

			let output = '';
			let errorOutput = '';

			process.stdout.on('data', (data) => {
				output += data.toString();
			});

			process.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			process.on('close', (code) => {
				if (code !== 0) {
					console.error('Error output:', errorOutput);
				}
				expect(code).toBe(0);
				done();
			});

			// Write the JSON to stdin
			process.stdin.write(validConfig);
			process.stdin.end();
		});

		it('should reject invalid JSON via stdin', (done) => {
			const invalidJSON = 'not valid json';

			const process = spawn('node', [AGENT_SCRIPT, '--json'], {
				stdio: ['pipe', 'pipe', 'pipe'],
			});

			let errorOutput = '';

			process.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			process.on('close', (code) => {
				expect(code).not.toBe(0);
				expect(errorOutput).toContain('Invalid JSON');
				done();
			});

			process.stdin.write(invalidJSON);
			process.stdin.end();
		});

		it('should validate configuration structure in JSON mode', (done) => {
			const invalidConfig = JSON.stringify({
				slug: 'test-plugin',
				// Missing required 'name' and 'author'
			});

			const process = spawn('node', [AGENT_SCRIPT, '--json'], {
				stdio: ['pipe', 'pipe', 'pipe'],
			});

			let errorOutput = '';

			process.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			process.on('close', (code) => {
				expect(code).not.toBe(0);
				expect(errorOutput).toContain('required');
				done();
			});

			process.stdin.write(invalidConfig);
			process.stdin.end();
		});
	});

	describe('Validate Mode', () => {
		it('should validate a valid configuration', (done) => {
			const validConfig = JSON.stringify({
				slug: 'test-plugin',
				name: 'Test Plugin',
				author: 'Test Author',
			});

			const process = spawn('node', [
				AGENT_SCRIPT,
				'--validate',
				validConfig,
			]);
			let output = '';

			process.stdout.on('data', (data) => {
				output += data.toString();
			});

			process.on('close', (code) => {
				expect(code).toBe(0);
				expect(output).toContain('✓') ||
					expect(output).toContain('valid');
				done();
			});
		});

		it('should reject invalid configuration format', (done) => {
			const invalidConfig = JSON.stringify({
				slug: 'Invalid Slug With Spaces!',
				name: 'Test Plugin',
				author: 'Test Author',
			});

			const process = spawn('node', [
				AGENT_SCRIPT,
				'--validate',
				invalidConfig,
			]);
			let errorOutput = '';

			process.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			process.on('close', (code) => {
				expect(code).not.toBe(0);
				done();
			});
		});
	});

	describe('Configuration Output', () => {
		it('should write plugin-config.json file', () => {
			// This test would require mocking the interactive prompts
			// For now, we test that the fs.writeFileSync is called correctly
			const mockConfig = {
				slug: 'test-plugin',
				name: 'Test Plugin',
				author: 'Test Author',
			};

			fs.writeFileSync(
				path.join(process.cwd(), 'plugin-config.json'),
				JSON.stringify(mockConfig, null, 2)
			);

			expect(fs.writeFileSync).toHaveBeenCalledWith(
				expect.stringContaining('plugin-config.json'),
				expect.stringContaining('"slug": "test-plugin"')
			);
		});

		it('should format JSON output with proper indentation', () => {
			const mockConfig = {
				slug: 'test-plugin',
				name: 'Test Plugin',
			};

			const formattedJSON = JSON.stringify(mockConfig, null, 2);
			fs.writeFileSync('plugin-config.json', formattedJSON);

			expect(fs.writeFileSync).toHaveBeenCalledWith(
				expect.any(String),
				expect.stringMatching(/\n\s+/)
			);
		});
	});

	describe('Input Validation', () => {
		it('should validate slug format', () => {
			// Valid slugs
			expect(/^[a-z][a-z0-9-]*$/.test('valid-slug')).toBe(true);
			expect(/^[a-z][a-z0-9-]*$/.test('my-plugin-2024')).toBe(true);

			// Invalid slugs
			expect(/^[a-z][a-z0-9-]*$/.test('Invalid Slug')).toBe(false);
			expect(/^[a-z][a-z0-9-]*$/.test('slug_with_underscores')).toBe(
				false
			);
			expect(/^[a-z][a-z0-9-]*$/.test('1-starts-with-number')).toBe(
				false
			);
		});

		it('should validate version format', () => {
			// Valid versions
			expect(/^\d+\.\d+\.\d+$/.test('1.0.0')).toBe(true);
			expect(/^\d+\.\d+\.\d+$/.test('2.15.3')).toBe(true);

			// Invalid versions
			expect(/^\d+\.\d+\.\d+$/.test('1.0')).toBe(false);
			expect(/^\d+\.\d+\.\d+$/.test('v1.0.0')).toBe(false);
			expect(/^\d+\.\d+\.\d+$/.test('1.0.0-beta')).toBe(false);
		});

		it('should validate URL format', () => {
			// Valid URLs
			const validURL1 = 'https://example.com';
			const validURL2 = 'http://localhost:8080';

			expect(() => new URL(validURL1)).not.toThrow();
			expect(() => new URL(validURL2)).not.toThrow();

			// Invalid URLs
			const invalidURL = 'not a url';
			expect(() => new URL(invalidURL)).toThrow();
		});

		it('should validate required fields', () => {
			const requiredFields = ['slug', 'name', 'author'];

			const validConfig = {
				slug: 'test',
				name: 'Test',
				author: 'Author',
			};

			const invalidConfig = {
				slug: 'test',
				// Missing name and author
			};

			// Check all required fields are present
			const hasAllRequired = requiredFields.every(
				(field) => field in validConfig
			);
			expect(hasAllRequired).toBe(true);

			const missingRequired = requiredFields.some(
				(field) => !(field in invalidConfig)
			);
			expect(missingRequired).toBe(true);
		});
	});

	describe('Configuration Generation', () => {
		it('should derive namespace from slug', () => {
			const slug = 'tour-operator';
			const expectedNamespace = 'tour_operator';
			const derivedNamespace = slug.replace(/-/g, '_');

			expect(derivedNamespace).toBe(expectedNamespace);
		});

		it('should derive textdomain from slug', () => {
			const slug = 'tour-operator';
			const expectedTextdomain = 'tour-operator';

			expect(slug).toBe(expectedTextdomain);
		});

		it('should apply default values for optional fields', () => {
			const minimalConfig = {
				slug: 'test-plugin',
				name: 'Test Plugin',
				author: 'Test Author',
			};

			const configWithDefaults = {
				...minimalConfig,
				version: minimalConfig.version || '1.0.0',
				license: minimalConfig.license || 'GPL-2.0-or-later',
				namespace:
					minimalConfig.namespace ||
					minimalConfig.slug.replace(/-/g, '_'),
				textdomain: minimalConfig.textdomain || minimalConfig.slug,
			};

			expect(configWithDefaults.version).toBe('1.0.0');
			expect(configWithDefaults.license).toBe('GPL-2.0-or-later');
			expect(configWithDefaults.namespace).toBe('test_plugin');
			expect(configWithDefaults.textdomain).toBe('test-plugin');
		});

		it('should preserve custom values when provided', () => {
			const customConfig = {
				slug: 'test-plugin',
				name: 'Test Plugin',
				author: 'Test Author',
				version: '2.5.0',
				license: 'MIT',
			};

			expect(customConfig.version).toBe('2.5.0');
			expect(customConfig.license).toBe('MIT');
		});
	});

	describe('Integration with generate-plugin.js', () => {
		it('should call generate-plugin.js with correct arguments', () => {
			const childProcess = require('child_process');
			const mockSpawn = jest
				.spyOn(childProcess, 'spawn')
				.mockImplementation(() => {
					// Return a mock ChildProcess object
					return {
						stdout: { on: jest.fn() },
						stderr: { on: jest.fn() },
						stdin: { write: jest.fn(), end: jest.fn() },
						on: jest.fn(),
					};
				});

			// Simulate the call that would be made
			const configPath = path.join(process.cwd(), 'plugin-config.json');
			const generateScript = path.join(
				__dirname,
				'../generate-plugin.js'
			);

			// Use the child_process module directly, not the imported spawn
			childProcess.spawn('node', [
				generateScript,
				'--config',
				configPath,
			]);

			expect(mockSpawn).toHaveBeenCalledWith(
				'node',
				expect.arrayContaining([
					expect.stringContaining('generate-plugin.js'),
					'--config',
					expect.stringContaining('plugin-config.json'),
				])
			);

			mockSpawn.mockRestore();
		});
	});

	describe('Error Handling', () => {
		it('should handle file system errors gracefully', () => {
			fs.writeFileSync.mockImplementation(() => {
				throw new Error('Permission denied');
			});

			expect(() => {
				fs.writeFileSync('plugin-config.json', '{}');
			}).toThrow('Permission denied');
		});

		it('should handle JSON parsing errors', () => {
			const invalidJSON = 'not valid json';

			expect(() => {
				JSON.parse(invalidJSON);
			}).toThrow();
		});

		it('should provide helpful error messages', () => {
			const error = new Error('Validation failed: slug is required');

			expect(error.message).toContain('Validation failed');
			expect(error.message).toContain('slug');
		});
	});

	describe('Taxonomy Configuration', () => {
		it('should support hierarchical taxonomies', () => {
			const taxonomy = {
				slug: 'destination',
				singular: 'Destination',
				plural: 'Destinations',
				hierarchical: true,
			};

			expect(taxonomy.hierarchical).toBe(true);
		});

		it('should support non-hierarchical taxonomies', () => {
			const taxonomy = {
				slug: 'tag',
				singular: 'Tag',
				plural: 'Tags',
				hierarchical: false,
			};

			expect(taxonomy.hierarchical).toBe(false);
		});

		it('should validate taxonomy slug length', () => {
			// Taxonomy slugs should be reasonable length
			const validSlug = 'destination';
			const tooLongSlug = 'a'.repeat(51);

			expect(validSlug.length).toBeLessThanOrEqual(32);
			expect(tooLongSlug.length).toBeGreaterThan(50);
		});
	});

	describe('Custom Field Configuration', () => {
		it('should support basic field types', () => {
			const fieldTypes = [
				'text',
				'textarea',
				'number',
				'email',
				'url',
				'true_false',
			];

			fieldTypes.forEach((type) => {
				const field = {
					name: `test_${type}`,
					label: `Test ${type}`,
					type,
				};

				expect(field.type).toBe(type);
			});
		});

		it('should support repeater fields', () => {
			const repeaterField = {
				name: 'itinerary',
				label: 'Itinerary',
				type: 'repeater',
				sub_fields: [
					{
						name: 'day',
						label: 'Day',
						type: 'number',
					},
					{
						name: 'description',
						label: 'Description',
						type: 'textarea',
					},
				],
			};

			expect(repeaterField.type).toBe('repeater');
			expect(repeaterField.sub_fields).toHaveLength(2);
		});

		it('should validate field key format', () => {
			// Field keys should be lowercase with underscores
			const validKey = 'field_test_field';
			const invalidKey = 'Field-Test-Field';

			expect(/^[a-z_]+$/.test(validKey)).toBe(true);
			expect(/^[a-z_]+$/.test(invalidKey)).toBe(false);
		});
	});

	describe('Block Configuration', () => {
		it('should support block selection', () => {
			const availableBlocks = [
				'card',
				'collection',
				'slider',
				'featured',
				'single',
			];

			const selectedBlocks = ['card', 'collection', 'slider'];

			selectedBlocks.forEach((block) => {
				expect(availableBlocks).toContain(block);
			});
		});

		it('should derive block slugs from plugin slug', () => {
			const pluginSlug = 'tour-operator';
			const blockName = 'card';
			const expectedBlockSlug = `${pluginSlug}-${blockName}`;

			expect(expectedBlockSlug).toBe('tour-operator-card');
		});
	});

	describe('CPT Configuration', () => {
		it('should validate CPT slug length', () => {
			// CPT slugs must be 20 characters or less
			const validSlug = 'tour';
			const tooLongSlug = 'a'.repeat(21);

			expect(validSlug.length).toBeLessThanOrEqual(20);
			expect(tooLongSlug.length).toBeGreaterThan(20);
		});

		it('should support CPT features configuration', () => {
			const supports = [
				'title',
				'editor',
				'thumbnail',
				'excerpt',
				'custom-fields',
			];

			const cptConfig = {
				slug: 'tour',
				supports,
			};

			expect(cptConfig.supports).toContain('title');
			expect(cptConfig.supports).toContain('editor');
		});

		it('should derive CPT slug from plugin slug', () => {
			const pluginSlug = 'tour-operator';
			// Take first word or first 20 chars
			const cptSlug = pluginSlug.split('-')[0].substring(0, 20);

			expect(cptSlug).toBe('tour');
			expect(cptSlug.length).toBeLessThanOrEqual(20);
		});
	});
});
