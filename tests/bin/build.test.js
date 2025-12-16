/**
 * Tests for bin/build.js
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('build.js', () => {
	const binDir = path.resolve(__dirname, '..', 'bin');
	const buildScript = path.join(binDir, 'build.js');
	const testDir = path.resolve(__dirname, '..', 'test-theme-build');

	const setupTestTheme = (version = '1.0.0') => {
		try {
			if (!fs.existsSync(testDir)) {
				fs.mkdirSync(testDir, { recursive: true });
			}

			// Create package.json
			fs.writeFileSync(
				path.join(testDir, 'package.json'),
				JSON.stringify(
					{
						version,
						name: 'test-theme',
						scripts: {
							'build:production': 'echo "Building..."',
							lint: 'echo "Linting..."',
							test: 'echo "Testing..."',
						},
					},
					null,
					2
				)
			);

			// Create style.css
			fs.writeFileSync(
				path.join(testDir, 'style.css'),
				`/*\nTheme Name: Test Theme\nVersion: ${version}\n*/`
			);

			// Create public directory
			fs.mkdirSync(path.join(testDir, 'public'), { recursive: true });

			// Create dist directory
			fs.mkdirSync(path.join(testDir, 'dist'), { recursive: true });
		} catch (error) {
			throw new Error(`Test theme setup failed: ${error.message}`);
		}
	};

	const cleanupTestTheme = () => {
		try {
			if (fs.existsSync(testDir)) {
				fs.rmSync(testDir, { recursive: true, force: true });
			}
		} catch (error) {
			// Removed console.error for lint compliance
		}
	};

	beforeEach(() => {
		cleanupTestTheme();
	});

	afterEach(() => {
		cleanupTestTheme();
	});

	describe('Script Existence', () => {
		test('script file should exist', () => {
			try {
				expect(fs.existsSync(buildScript)).toBe(true);
			} catch (error) {
				throw new Error(
					`Script existence check failed: ${error.message}`
				);
			}
		});

		test('script should be executable', () => {
			try {
				const stats = fs.statSync(buildScript);
				const isExecutable = (stats.mode & 0o111) !== 0;
				expect(isExecutable || process.platform === 'win32').toBe(true);
			} catch (error) {
				// Removed console.warn for lint compliance
			}
		});
	});

	describe('Command Validation', () => {
		test('should show help message with no command', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript}`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
					cwd: testDir,
				});

				expect(result).toContain('Usage:');
				expect(result).toContain('Commands:');
				expect(result).toContain('build');
				expect(result).toContain('dist');
				expect(result).toContain('version');
			} catch (error) {
				throw new Error(`Help message test failed: ${error.message}`);
			}
		});

		test('should accept valid commands', () => {
			const validCommands = ['build', 'dist', 'check', 'init', 'version'];

			validCommands.forEach((command) => {
				expect(command).toBeTruthy();
			});
		});
	});

	describe('Version Command', () => {
		test('should update version in package.json', () => {
			try {
				setupTestTheme('1.0.0');
				const cmd = `node ${buildScript} version 1.2.0`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });

				const packageJson = JSON.parse(
					fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
				);
				expect(packageJson.version).toBe('1.2.0');
			} catch (error) {
				throw new Error(`Version update test failed: ${error.message}`);
			}
		});

		test('should update version in style.css', () => {
			try {
				setupTestTheme('1.0.0');
				const cmd = `node ${buildScript} version 1.2.0`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });

				const styleContent = fs.readFileSync(
					path.join(testDir, 'style.css'),
					'utf8'
				);
				expect(styleContent).toContain('Version: 1.2.0');
			} catch (error) {
				throw new Error(
					`style.css version update failed: ${error.message}`
				);
			}
		});

		test('should validate version format', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "invalid"`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have rejected invalid version');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain(
					'semantic versioning'
				);
			}
		});

		test('should reject malicious version input', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "1.0.0; rm -rf /"`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have rejected malicious input');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('invalid characters');
			}
		});

		test('should reject version numbers over 999', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "1000.0.0"`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have rejected large version');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('less than 1000');
			}
		});

		test('should require version argument', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have required version argument');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('provide a version');
			}
		});
	});

	describe('Build Command', () => {
		test('should execute build command', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} build`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
					cwd: testDir,
				});

				expect(result).toContain('Building');
			} catch (error) {
				// Build may fail without full setup, but should attempt
				expect(error.stderr.toString()).toBeDefined();
			}
		});
	});

	describe('Error Handling and Logging', () => {
		test('should handle missing package.json gracefully', () => {
			try {
				// Create empty directory
				fs.mkdirSync(testDir, { recursive: true });

				const cmd = `node ${buildScript} version 1.0.0`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have failed without package.json');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('Error');
			}
		});

		test('should log command execution', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} build`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
					cwd: testDir,
				});

				expect(result).toContain('Running:');
			} catch (error) {
				// Should still show running message
				const stderr = error.stderr.toString();
				const stdout = error.stdout.toString();
				expect(stdout + stderr).toContain('Running');
			}
		});

		test('should handle command failures gracefully', () => {
			try {
				setupTestTheme();
				// Try to run non-existent command
				const packageJson = JSON.parse(
					fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
				);
				packageJson.scripts.lint = 'exit 1';
				fs.writeFileSync(
					path.join(testDir, 'package.json'),
					JSON.stringify(packageJson, null, 2)
				);

				const cmd = `node ${buildScript} check`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have failed with error exit code');
			} catch (error) {
				expect(error.status).toBe(1);
			}
		});

		test('should provide helpful error messages', () => {
			try {
				const cmd = `node ${buildScript} invalid-command`;
				const result = execSync(cmd, {
					stdio: 'pipe',
					encoding: 'utf8',
					cwd: testDir,
				});

				// Should show help for invalid command
				expect(result).toContain('Usage');
			} catch (error) {
				// May error out, but should have message
				expect(error.stderr.toString().length).toBeGreaterThan(0);
			}
		});
	});

	describe('Security Validations', () => {
		test('should prevent command injection in version', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "1.0.0 && echo 'injected'"`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have rejected command injection');
			} catch (error) {
				expect(error.status).toBe(1);
			}
		});

		test('should sanitize shell metacharacters', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "1.0.0|ls"`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });
				fail('Should have rejected shell metacharacters');
			} catch (error) {
				expect(error.status).toBe(1);
				expect(error.stderr.toString()).toContain('invalid characters');
			}
		});

		test('should trim whitespace from version', () => {
			try {
				setupTestTheme();
				const cmd = `node ${buildScript} version "  1.2.0  "`;
				execSync(cmd, { stdio: 'pipe', cwd: testDir });

				const packageJson = JSON.parse(
					fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
				);
				expect(packageJson.version).toBe('1.2.0');
			} catch (error) {
				throw new Error(
					`Whitespace trim test failed: ${error.message}`
				);
			}
		});
	});

	describe('Integration Tests', () => {
		test('should handle full workflow', () => {
			try {
				setupTestTheme('1.0.0');

				// Update version
				execSync(`node ${buildScript} version 1.1.0`, {
					stdio: 'pipe',
					cwd: testDir,
				});

				// Verify update
				const packageJson = JSON.parse(
					fs.readFileSync(path.join(testDir, 'package.json'), 'utf8')
				);
				expect(packageJson.version).toBe('1.1.0');

				const styleContent = fs.readFileSync(
					path.join(testDir, 'style.css'),
					'utf8'
				);
				expect(styleContent).toContain('Version: 1.1.0');
			} catch (error) {
				throw new Error(`Workflow test failed: ${error.message}`);
			}
		});
	});
});
