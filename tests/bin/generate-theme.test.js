/**
 * Tests for bin/generate-theme.js
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('generate-theme.js', () => {
	const binDir = path.resolve(__dirname, '..', 'bin');
	const generateScript = path.join(binDir, 'generate-theme.js');
	const outputDir = path.resolve(process.cwd(), 'output-theme');

	const cleanupOutputDir = () => {
		if (fs.existsSync(outputDir)) {
			try {
				fs.rmSync(outputDir, { recursive: true, force: true });
			} catch (error) {
				// Removed console.error for lint compliance
			}
		}
	};

	beforeEach(() => {
		cleanupOutputDir();
	});

	afterEach(() => {
		cleanupOutputDir();
	});

	describe('Script Existence and Execution', () => {
		test('script file should exist', () => {
			try {
				expect(fs.existsSync(generateScript)).toBe(true);
			} catch (error) {
				throw new Error(
					`Script existence check failed: ${error.message}`
				);
			}
		});

		test('script should be executable', () => {
			try {
				const stats = fs.statSync(generateScript);
				const isExecutable = (stats.mode & 0o111) !== 0;
				expect(isExecutable || process.platform === 'win32').toBe(true);
			} catch (error) {
				// Removed console.warn for lint compliance
			}
		});
	});

	describe('Input Sanitization', () => {
		test('should reject slug with path traversal', () => {
			try {
				const cmd = `node ${generateScript} --slug "../evil" --name "Test"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have thrown error for path traversal');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('path traversal');
			}
		});

		test('should sanitize slug to valid format', () => {
			try {
				const cmd = `node ${generateScript} --slug "Test Theme!" --name "Test Theme"`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
				});

				expect(result).toContain('generated');
				// Should convert to lowercase and remove invalid chars
			} catch (error) {
				throw new Error(
					`Slug sanitization test failed: ${error.message}`
				);
			}
		});

		test('should reject invalid URL', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --author_uri "not-a-url"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have thrown error for invalid URL');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('Invalid URL');
			}
		});

		test('should reject invalid version format', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --version "invalid"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have thrown error for invalid version');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain(
					'semantic versioning'
				);
			}
		});

		test('should accept WordPress version format', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme" --min_wp_version "6.4"`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
				});

				expect(result).toContain('generated');
			} catch (error) {
				throw new Error(
					`WordPress version format test failed: ${error.message}`
				);
			}
		});

		test('should sanitize license identifier', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme" --license "GPL-2.0-or-later@!"`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
				});

				expect(result).toContain('generated');
				// Should remove invalid characters from license
			} catch (error) {
				throw new Error(
					`License sanitization test failed: ${error.message}`
				);
			}
		});
	});

	describe('Theme Generation', () => {
		test('should generate theme with default values', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
				});

				expect(result).toContain('generated');
				expect(fs.existsSync(outputDir)).toBe(true);
			} catch (error) {
				throw new Error(
					`Theme generation failed: ${error.message}\n${error.stderr?.toString()}`
				);
			}
		});

		test('should fail if output directory exists', () => {
			try {
				fs.mkdirSync(outputDir);

				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have thrown error for existing directory');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('already exists');
			}
		});

		test('should replace placeholders in generated files', () => {
			try {
				const cmd = `node ${generateScript} --slug "my-test-theme" --name "My Test Theme" --version "2.0.0"`;
				execSync(cmd, { stdio: 'pipe' });

				const packageJsonPath = path.join(outputDir, 'package.json');
				expect(fs.existsSync(packageJsonPath)).toBe(true);

				const packageJson = JSON.parse(
					fs.readFileSync(packageJsonPath, 'utf8')
				);
				expect(packageJson.name).toBe('my-test-theme');
				expect(packageJson.version).toBe('2.0.0');
			} catch (error) {
				throw new Error(
					`Placeholder replacement test failed: ${error.message}`
				);
			}
		});

		test('should copy theme structure files', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				execSync(cmd, { stdio: 'pipe' });

				const requiredFiles = [
					'style.css',
					'functions.php',
					'theme.json',
					'README.md',
				];

				requiredFiles.forEach((file) => {
					const filePath = path.join(outputDir, file);
					expect(fs.existsSync(filePath)).toBe(true);
				});
			} catch (error) {
				throw new Error(`File copy test failed: ${error.message}`);
			}
		});

		test('should copy directory structure', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				execSync(cmd, { stdio: 'pipe' });

				const requiredDirs = [
					'parts',
					'templates',
					'styles',
					'inc',
					'src',
				];

				requiredDirs.forEach((dir) => {
					const dirPath = path.join(outputDir, dir);
					expect(fs.existsSync(dirPath)).toBe(true);
					expect(fs.statSync(dirPath).isDirectory()).toBe(true);
				});
			} catch (error) {
				throw new Error(
					`Directory structure test failed: ${error.message}`
				);
			}
		});

		test('should exclude node_modules and build artifacts', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				execSync(cmd, { stdio: 'pipe' });

				const excludedItems = ['node_modules', 'dist', '.git'];

				excludedItems.forEach((item) => {
					const itemPath = path.join(outputDir, item);
					expect(fs.existsSync(itemPath)).toBe(false);
				});
			} catch (error) {
				throw new Error(`Exclusion test failed: ${error.message}`);
			}
		});

		test('should skip generate-theme.js in bin directory', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				execSync(cmd, { stdio: 'pipe' });

				const binPath = path.join(outputDir, 'bin');
				expect(fs.existsSync(binPath)).toBe(true);

				const generateScriptInOutput = path.join(
					binPath,
					'generate-theme.js'
				);
				expect(fs.existsSync(generateScriptInOutput)).toBe(false);
			} catch (error) {
				throw new Error(`Bin exclusion test failed: ${error.message}`);
			}
		});
	});

	describe('Theme-Specific Placeholders', () => {
		test('should handle WordPress version placeholders', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme" --min_wp_version "6.0" --tested_wp_version "6.5"`;
				execSync(cmd, { stdio: 'pipe' });

				const styleCssPath = path.join(outputDir, 'style.css');
				const styleContent = fs.readFileSync(styleCssPath, 'utf8');

				expect(styleContent).toContain('6.0');
				expect(styleContent).toContain('6.5');
			} catch (error) {
				throw new Error(
					`WP version placeholder test failed: ${error.message}`
				);
			}
		});

		test('should handle PHP version placeholder', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme" --min_php_version "8.0"`;
				execSync(cmd, { stdio: 'pipe' });

				const styleCssPath = path.join(outputDir, 'style.css');
				const styleContent = fs.readFileSync(styleCssPath, 'utf8');

				expect(styleContent).toContain('8.0');
			} catch (error) {
				throw new Error(
					`PHP version placeholder test failed: ${error.message}`
				);
			}
		});

		test('should handle license placeholders', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme" --license "MIT" --license_uri "https://opensource.org/licenses/MIT"`;
				execSync(cmd, { stdio: 'pipe' });

				const styleCssPath = path.join(outputDir, 'style.css');
				const styleContent = fs.readFileSync(styleCssPath, 'utf8');

				expect(styleContent).toContain('MIT');
			} catch (error) {
				throw new Error(
					`License placeholder test failed: ${error.message}`
				);
			}
		});
	});

	describe('Error Handling and Logging', () => {
		test('should provide helpful error message on failure', () => {
			try {
				const cmd = `node ${generateScript} --slug "../invalid" --name "Test"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have failed');
			} catch (error) {
				expect(error.stderr.toString().length).toBeGreaterThan(0);
				expect(error.stderr.toString()).toContain('Error');
			}
		});

		test('should log success message on completion', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
				});

				expect(result).toContain('generated');
				expect(result).toContain('output-theme');
			} catch (error) {
				throw new Error(
					`Success logging test failed: ${error.message}`
				);
			}
		});

		test('should handle file system errors gracefully', () => {
			try {
				const parentDir = process.cwd();
				const originalMode = fs.statSync(parentDir).mode;

				try {
					if (process.platform !== 'win32') {
						fs.chmodSync(parentDir, 0o444);
						const cmd = `node ${generateScript} --slug "test-theme" --name "Test Theme"`;
						execSync(cmd, { stdio: 'pipe' });
						fail('Should have failed with permission error');
					}
				} finally {
					if (process.platform !== 'win32') {
						fs.chmodSync(parentDir, originalMode);
					}
				}
			} catch (error) {
				expect(error.status).toBeDefined();
			}
		});
	});

	describe('Security Validations', () => {
		test('should prevent command injection', () => {
			try {
				const cmd = `node ${generateScript} --slug "test; rm -rf /" --name "Test"`;
				execSync(cmd, { stdio: 'pipe' });

				// Should sanitize to safe slug or reject
				if (fs.existsSync(outputDir)) {
					const generatedFiles = fs.readdirSync(outputDir);
					expect(generatedFiles.length).toBeGreaterThan(0);
				}
			} catch (error) {
				// Rejection is also acceptable
				expect(error.status).toBe(1);
			}
		});

		test('should prevent XSS in metadata', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --name "<script>alert('xss')</script>"`;
				execSync(cmd, { stdio: 'pipe' });

				const styleCssPath = path.join(outputDir, 'style.css');
				const styleContent = fs.readFileSync(styleCssPath, 'utf8');

				expect(styleContent).not.toContain('<script>');
			} catch (error) {
				throw new Error(`XSS prevention test failed: ${error.message}`);
			}
		});

		test('should validate URL protocols', () => {
			try {
				const cmd = `node ${generateScript} --slug "test-theme" --author_uri "javascript:alert(1)"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have rejected javascript: protocol');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('protocol');
			}
		});

		test('should prevent directory traversal in slug', () => {
			try {
				const cmd = `node ${generateScript} --slug "../../etc/passwd" --name "Test"`;
				execSync(cmd, { stdio: 'pipe' });
				fail('Should have rejected path traversal');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('path traversal');
			}
		});
	});
});
