#!/usr/bin/env node
/**
 * Release Scaffold Agent
 *
 * Handles the release process for the multi-block-plugin-scaffold repository itself.
 * This is separate from release.agent.js which handles releasing GENERATED plugins.
 *
 * **Git Flow Support:**
 * This agent supports Git Flow workflow where:
 * - `develop` branch is for active development and feature branches
 * - `main` branch is stable and only updated via releases
 * - Releases are created on develop, then merged to main
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Release Scaffold Agent Class
 */
class ReleaseScaffoldAgent {
	constructor() {
		this.rootDir = path.resolve(__dirname, '../..');
		this.changelogPath = path.join(this.rootDir, 'CHANGELOG.md');
		this.packageJsonPath = path.join(this.rootDir, 'package.json');
		this.currentBranch = this.getCurrentBranch();
		this.mainBranch = this.getMainBranch();
	}

	/**
	 * Get the current git branch
	 *
	 * @return {string} Current branch name
	 */
	getCurrentBranch() {
		try {
			return execSync('git branch --show-current', {
				encoding: 'utf8',
				cwd: this.rootDir,
			}).trim();
		} catch (error) {
			throw new Error(`Failed to get current branch: ${error.message}`);
		}
	}

	/**
	 * Get the main branch name (main or master)
	 *
	 * @return {string} Main branch name
	 */
	getMainBranch() {
		try {
			const branches = execSync('git branch -r', {
				encoding: 'utf8',
				cwd: this.rootDir,
			});

			// Check if origin/main exists
			if (branches.includes('origin/main')) {
				return 'main';
			}
			// Fall back to master if main doesn't exist
			if (branches.includes('origin/master')) {
				return 'master';
			}
			// Default to main for new repos
			return 'main';
		} catch (error) {
			// If git command fails, default to main
			return 'main';
		}
	}

	/**
	 * Run the release process
	 *
	 * @param {Object} options Release options
	 * @param {string} options.version Version to release (e.g., '1.1.0')
	 * @param {boolean} options.dryRun Whether to run in dry-run mode
	 */
	async run(options = {}) {
		const { version, dryRun = false } = options;

		console.log('🚀 Release Scaffold Agent Starting...\n');

		// Show Git Flow info if on develop
		if (this.currentBranch === 'develop') {
			console.log(`📍 Git Flow Mode Detected`);
			console.log(`   Current branch: develop`);
			console.log(`   Target branch: ${this.mainBranch}`);
			console.log(`   Release will be created on develop, then merged to ${this.mainBranch}\n`);
		} else {
			console.log(`📍 Current branch: ${this.currentBranch}\n`);
		}

		if (dryRun) {
			console.log('⚠️  DRY RUN MODE - No changes will be committed\n');
		}

		// TODO: Emit a structured release report (JSON/yaml) summarizing the steps.

		try {
			// 1. Validate git status
			this.validateGitStatus();

			// 2. Validate version format
			if (!version) {
				throw new Error('Version is required. Usage: --version=1.1.0');
			}
			this.validateVersion(version);

			// 3. Run tests
			this.runTests();

			// 4. Run linting
			this.runLinting();

			// 5. Update CHANGELOG
			this.updateChangelog(version, dryRun);

			// 6. Update package.json version
			this.updatePackageVersion(version, dryRun);

			// 7. Create git tag
			this.createGitTag(version, dryRun);

			// 8. Show next steps
			this.showNextSteps(version, dryRun);

			console.log('\n✅ Release Scaffold Agent completed successfully!');
		} catch (error) {
			console.error('\n❌ Release failed:', error.message);
			process.exit(1);
		}
	}

	/**
	 * Validate git status is clean
	 */
	validateGitStatus() {
		console.log('📋 Checking git status...');

		try {
			const status = execSync('git status --porcelain', {
				encoding: 'utf8',
			}).trim();

			if (status) {
				throw new Error(
					'Working directory is not clean. Commit or stash changes first.'
				);
			}

			console.log('✓ Git status is clean\n');
		} catch (error) {
			throw new Error(`Git status check failed: ${error.message}`);
		}
	}

	/**
	 * Validate version format
	 *
	 * @param {string} version Version string
	 */
	validateVersion(version) {
		console.log(`📋 Validating version: ${version}...`);

		const semverRegex = /^\d+\.\d+\.\d+$/;
		if (!semverRegex.test(version)) {
			throw new Error(
				`Invalid version format: ${version}. Use semantic versioning (e.g., 1.1.0)`
			);
		}

		console.log('✓ Version format is valid\n');
	}

	/**
	 * Run test suite
	 */
	runTests() {
	console.log('🧪 Running tests...');

	try {
		execSync('npm test', { stdio: 'inherit', cwd: this.rootDir });
		console.log('✓ All tests passed\n');
	} catch (error) {
		throw new Error('Tests failed. Fix issues before releasing.');
	}

	// TODO: Capture test reports/coverage results for audit trails.
	}

	/**
	 * Run linting
	 */
	runLinting() {
	console.log('🔍 Running linting...');

	try {
		execSync('npm run lint:js', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
		execSync('npm run lint:css', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
		console.log('✓ Linting passed\n');
	} catch (error) {
		throw new Error('Linting failed. Fix issues before releasing.');
	}

	// TODO: Support lint auto-fixing or brief summary of lint results.
	}

	/**
	 * Update CHANGELOG.md
	 *
	 * @param {string} version Version string
	 * @param {boolean} dryRun Dry run mode
	 */
	updateChangelog(version, dryRun) {
		console.log(`📝 Updating CHANGELOG.md for v${version}...`);

		const changelog = fs.readFileSync(this.changelogPath, 'utf8');
		const today = new Date().toISOString().split('T')[0];

		// Replace [Unreleased] with version and date
		const updated = changelog.replace(
			'## [Unreleased]',
			`## [Unreleased]\n\n### Added\n\n- Nothing yet\n\n### Changed\n\n- Nothing yet\n\n### Fixed\n\n- Nothing yet\n\n---\n\n## [${version}] - ${today}`
		);

		if (dryRun) {
			console.log('✓ CHANGELOG.md update prepared (dry run)\n');
			return;
		}

		fs.writeFileSync(this.changelogPath, updated, 'utf8');
		execSync(`git add ${this.changelogPath}`, { cwd: this.rootDir });
		console.log('✓ CHANGELOG.md updated\n');
	}

	/**
	 * Update package.json version
	 *
	 * @param {string} version Version string
	 * @param {boolean} dryRun Dry run mode
	 */
	updatePackageVersion(version, dryRun) {
		console.log(`📦 Updating package.json to v${version}...`);

		if (dryRun) {
			console.log('✓ package.json update prepared (dry run)\n');
			return;
		}

		execSync(`npm version ${version} --no-git-tag-version`, {
			cwd: this.rootDir,
		});
		execSync(`git add ${this.packageJsonPath}`, { cwd: this.rootDir });
		console.log('✓ package.json updated\n');
	}

	/**
	 * Create git tag
	 *
	 * @param {string} version Version string
	 * @param {boolean} dryRun Dry run mode
	 */
	createGitTag(version, dryRun) {
		console.log(`🏷️  Creating git tag v${version}...`);

		if (dryRun) {
			console.log('✓ Git tag creation prepared (dry run)\n');
			return;
		}

		execSync(`git commit -m "chore: Release v${version}"`, {
			cwd: this.rootDir,
		});
		execSync(`git tag -a v${version} -m "Release v${version}"`, {
			cwd: this.rootDir,
		});
		console.log('✓ Git tag created\n');
	}

	/**
	 * Show next steps
	 *
	 * @param {string} version Version string
	 * @param {boolean} dryRun Dry run mode
	 */
	showNextSteps(version, dryRun) {
		const isGitFlow = this.currentBranch === 'develop';

		if (dryRun) {
			console.log('\n📌 Next Steps (after dry run review):');
			console.log(`   1. Run without --dry-run to apply changes`);

			if (isGitFlow) {
				console.log(`   2. git push origin develop`);
				console.log(`   3. git checkout ${this.mainBranch}`);
				console.log(`   4. git merge develop`);
				console.log(`   5. git push origin ${this.mainBranch}`);
				console.log(`   6. git push origin v${version}`);
				console.log(`   7. git checkout develop`);
			} else {
				console.log(`   2. git push origin ${this.currentBranch}`);
				console.log(`   3. git push origin v${version}`);
			}
			return;
		}

		console.log('\n📌 Next Steps:');
		console.log('   1. Review the changes:');
		console.log('      git log -1');
		console.log('      git show');
		console.log('');

		if (isGitFlow) {
			console.log('   2. Push develop and merge to main (Git Flow):');
			console.log(`      git push origin develop`);
			console.log(`      git checkout ${this.mainBranch}`);
			console.log(`      git merge develop --no-ff -m "Release v${version}"`);
			console.log(`      git push origin ${this.mainBranch}`);
			console.log(`      git push origin v${version}`);
			console.log(`      git checkout develop`);
			console.log('');
			console.log('   3. Or create a Pull Request:');
			console.log(`      - Create PR from develop → ${this.mainBranch}`);
			console.log('      - Merge the PR');
			console.log(`      - Then: git push origin v${version}`);
		} else {
			console.log('   2. Push to remote:');
			console.log(`      git push origin ${this.currentBranch}`);
			console.log(`      git push origin v${version}`);
		}

		console.log('');
		console.log('   ' + (isGitFlow ? '4' : '3') + '. GitHub will automatically:');
		console.log('      - Create a release from the tag');
		console.log('      - Build and attach assets');
		console.log('      - Publish to npm (if configured)');
	}
}

// CLI execution
if (require.main === module) {
	const args = process.argv.slice(2);
	const options = {};

	args.forEach((arg) => {
		if (arg.startsWith('--version=')) {
			options.version = arg.split('=')[1];
		} else if (arg === '--dry-run') {
			options.dryRun = true;
		} else if (arg === '--help' || arg === '-h') {
			console.log(`
Release Scaffold Agent

Usage:
  node scripts/agents/release-scaffold.agent.js --version=X.Y.Z [--dry-run]

Options:
  --version=X.Y.Z    Version to release (required)
  --dry-run          Run without making changes
  --help, -h         Show this help message

Examples:
  node scripts/agents/release-scaffold.agent.js --version=1.1.0 --dry-run
  node scripts/agents/release-scaffold.agent.js --version=1.1.0
			`);
			process.exit(0);
		}
	});

	const agent = new ReleaseScaffoldAgent();
	agent.run(options);
}

module.exports = ReleaseScaffoldAgent;

// TODO: Support additional flags (e.g., --skip-tests) when the release workflow grows.
