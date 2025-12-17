const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '../../../');
const schemaDir = path.join(repoRoot, '.github', 'schemas');
const exampleDir = path.join(schemaDir, 'examples');

const schemaFiles = [
	path.join(schemaDir, 'block.schema.json'),
	path.join(schemaDir, 'block.6.9.json'),
	path.join(schemaDir, 'frontmatter.schema.json'),
	path.join(schemaDir, 'mustache-variables-registry.schema.json'),
	path.join(schemaDir, 'mustache-variables.schema.json'),
	path.join(schemaDir, 'plugin-config.schema.json'),
];

describe('JSON schema assets', () => {

	test('schema README exists', () => {
		const readmePath = path.join(schemaDir, 'README.md');
		expect(fs.existsSync(readmePath)).toBe(true);
		const content = fs.readFileSync(readmePath, 'utf8');
		expect(content).toContain('Schema Library');
	});

	schemaFiles.forEach((schemaPath) => {
		test(`valid JSON schema: ${path.basename(schemaPath)}`, () => {
			const schemaText = fs.readFileSync(schemaPath, 'utf8');
			let schema;
			expect(() => {
				schema = JSON.parse(schemaText);
			}).not.toThrow();
			expect(schema).toHaveProperty('$schema');
			expect(typeof schema.$schema).toBe('string');
		});
	});

	test('example configs parse cleanly', () => {
		if (!fs.existsSync(exampleDir)) {
			throw new Error('Schema example directory missing');
		}
		const files = fs.readdirSync(exampleDir).filter((file) => file.endsWith('.json'));
		expect(files.length).toBeGreaterThan(0);
		files.forEach((file) => {
			const configPath = path.join(exampleDir, file);
			expect(() => JSON.parse(fs.readFileSync(configPath, 'utf8'))).not.toThrow();
		});
	});
});
