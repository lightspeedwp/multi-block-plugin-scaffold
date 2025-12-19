#!/usr/bin/env node
/* eslint-disable no-console, jsdoc/require-param-type */
/**
 * Release Scaffold Agent
 *
 * Handles release preparation and validation for the lightspeedwp/block-theme-scaffold
 * repository, ensuring mustache placeholders remain intact and that all templated files
 * are exercised via dry-run tooling before any tagging occurs.
 *
 * @package multi-block-plugin-scaffold
 * @since 1.0.0
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const releaseQuestions = require('./release-scaffold.questions');
const { runPromptWizard } = require('../lib/wizard.js');

class ReleaseScaffoldAgent {
	constructor(options = {}) {
		this.rootDir = path.resolve(__dirname, '../..');
		this.changelogPath = path.join(this.rootDir, 'CHANGELOG.md');
		this.packageJsonPath = path.join(this.rootDir, 'package.json');
		this.promptPaths = {
			release: path.join(
				this.rootDir,
				'.github/prompts/create-release-scaffold.prompt.md'
			),
			validation: path.join(
				this.rootDir,
				'.github/prompts/pre-release-validation.prompt.md'
			),
		};
		this.currentBranch = this.getCurrentBranch();
		this.mainBranch = this.getMainBranch();
		this.maxDryRun = options.maxDryRun || false;
		this.wizardMode = options.wizardMode || this.detectWizardMode();
		this.wizardConfigFile = options.wizardConfigFile;
		this.workflowModeOverride = this.normalizeWorkflowMode(options.workflowMode);
		this.mockAnswers = options.mockAnswers;
	}

	normalizeWorkflowMode(mode) {
		if (!mode) {
			return null;
		}
		const normalized = mode.toLowerCase();
		if (['validation', 'release'].includes(normalized)) {
			return normalized;
		}
		return null;
	}

	detectWizardMode() {
		if (process.env.WIZARD_MODE) {
			return process.env.WIZARD_MODE;
		}
		if (process.env.DRY_RUN) {
			return 'mock';
		}
		return 'cli';
	}

	loadPrompt(mode) {
		const promptPath = this.promptPaths[mode];
		if (!promptPath || !fs.existsSync(promptPath)) {
			return null;
		}
		return fs.readFileSync(promptPath, 'utf8');
	}

	logInitialPrompt(mode) {
		const promptContent = this.loadPrompt(mode);
		if (!promptContent) {
			console.log('ℹ No prompt template found for the requested workflow mode.');
			return;
		}
		const relativePath = path.relative(this.rootDir, this.promptPaths[mode]);
		console.log(`📜 Loaded wizard context from ${relativePath}`);
	}

	async collectAnswers() {
		const wizardOptions = {
			mode: this.wizardMode,
			questions: releaseQuestions,
			mockAnswers: this.mockAnswers,
		};
		if (this.wizardConfigFile) {
			wizardOptions.configFile = this.wizardConfigFile;
		}

		const answers = await runPromptWizard(wizardOptions);
		if (this.workflowModeOverride) {
			answers.workflowMode = this.workflowModeOverride;
		}
		return answers;
	}

	async run(options = {}) {
		const { dryRun = false, maxDryRun = false, version: cliVersion } = options;
		this.maxDryRun = this.maxDryRun || maxDryRun;
		const effectiveDryRun = this.maxDryRun || dryRun;

		console.log('🚀 Release Scaffold Agent Starting...\n');
		if (this.maxDryRun) {
			console.log(
				'=== MAXIMUM DRY RUN MODE ENABLED: All side effects are simulated. ===\n'
			);
		}

		try {
			const answers = await this.collectAnswers();
			const workflowMode = (answers.workflowMode || 'validation').toLowerCase();
			const promptMode = workflowMode === 'release' ? 'release' : 'validation';
			this.logInitialPrompt(promptMode);

			if (workflowMode === 'release' && answers.confirm === false) {
				throw new Error('Release aborted: confirmation step was not approved.');
			}

			const version = cliVersion || answers.version;
			if (!version) {
				throw new Error('Version is required. Provide --version or answer the wizard.');
			}

			await this.runValidationOnly({ version, dryRun: effectiveDryRun });

			if (workflowMode !== 'release') {
				this.showValidationChecklist();
				return;
			}

			if (this.maxDryRun) {
				this.showNextSteps(version, true);
				return;
			}

			this.performRelease(version, effectiveDryRun);
		} catch (error) {
			console.error('\n❌ Release failed:', error.message);
			process.exit(1);
		}
	}

	async runValidationOnly({ version, dryRun }) {
		console.log('🔎 Running pre-release validation (dry-run aware)...');
		this.validateGitStatus();
		this.validateVersion(version);
		this.logMustacheGuard();
		this.runLinting();
		this.runDryRunTests();
		this.verifyMustacheRegistry();
		this.runDryRunReleaseDocs();
	}

	performRelease(version, dryRun) {
		console.log('\n🏁 Running release steps...\n');
		this.updateChangelog(version, dryRun);
		this.updatePackageVersion(version, dryRun);
		this.createGitTag(version, dryRun);
		this.showNextSteps(version, dryRun);
		console.log('\n✅ Release Scaffold Agent completed successfully!');
	}

	logMustacheGuard() {
		console.log(
			'🛡️  Mustache safeguard active: template files are evaluated via dry-run paths only and remain untouched.'
		);
	}

	runDryRunReleaseDocs() {
		console.log('📦 Running dry-run release documentation snapshot...');
		execSync('npm run dry-run:release-scaffold', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
	}

	verifyMustacheRegistry() {
		console.log('📑 Validating mustache registry consistency...');
		execSync('node scripts/scan-mustache-variables.js --ci-fail', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
	}

	runLinting() {
		console.log('🔍 Running linting (dry-run aware)...');
		execSync('npm run lint:dry-run', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
	}

	runDryRunTests() {
		console.log('🧪 Running dry-run test suite...');
		execSync('npm run dry-run:all', {
			stdio: 'inherit',
			cwd: this.rootDir,
		});
	}

	validateGitStatus() {
		console.log('📋 Checking git status...');
		const status = execSync('git status --porcelain', {
			encoding: 'utf8',
			cwd: this.rootDir,
		}).trim();
		if (status) {
			throw new Error('Working directory is not clean. Commit or stash changes first.');
		}
		console.log('✓ Git status is clean\n');
	}

	validateVersion(version) {
		console.log(`📋 Validating version: ${version}...`);
		if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
			throw new Error(`Invalid version format: ${version}. Use semantic versioning (e.g., 1.1.0)`);
		}
		console.log('✓ Version format is valid\n');
	}

	updateChangelog(version, dryRun) {
		console.log(`📝 Updating CHANGELOG.md for v${version}...`);
		const changelog = fs.readFileSync(this.changelogPath, 'utf8');
		const today = new Date().toISOString().split('T')[0];
		const updated = changelog.replace(
			'## [Unreleased]',
			`## [Unreleased]\n\n### Added\n\n- Nothing yet\n\n### Changed\n\n- Nothing yet\n\n### Fixed\n\n- Nothing yet\n\n---\n\n## [${version}] - ${today}`
		);
		if (dryRun) {
			console.log('✓ CHANGELOG.md update prepared (dry run)\n');
			return;
		}
		fs.writeFileSync(this.changelogPath, updated, 'utf8');
		execSync(`git add ${this.changelogPath}`, {
			cwd: this.rootDir,
		});
		console.log('✓ CHANGELOG.md updated\n');
	}

	updatePackageVersion(version, dryRun) {
		console.log(`📦 Updating package.json to v${version}...`);
		if (dryRun) {
			console.log('✓ package.json update prepared (dry run)\n');
			return;
		}
		execSync(`npm version ${version} --no-git-tag-version`, {
			cwd: this.rootDir,
		});
		execSync(`git add ${this.packageJsonPath}`, {
			cwd: this.rootDir,
		});
		console.log('✓ package.json updated\n');
	}

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

	showValidationChecklist() {
		console.log('\n📌 Pre-release validation completed. Release steps were not executed.');
		console.log('   Rerun with the full release workflow (select "Full release" or use --workflow-mode=release) to tag and push.');
	}

	showNextSteps(version, dryRun) {
		const isGitFlow = this.currentBranch === 'develop';
		if (dryRun) {
			console.log('\n📌 Next Steps (after dry run review):');
			console.log('   1. Run without --dry-run to apply changes');
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

	getMainBranch() {
		try {
			const branches = execSync('git branch -r', {
				encoding: 'utf8',
				cwd: this.rootDir,
			});
			if (branches.includes('origin/main')) {
				return 'main';
			}
			if (branches.includes('origin/master')) {
				return 'master';
			}
			return 'main';
		} catch (error) {
			return 'main';
		}
	}
}

if (require.main === module) {
	const args = process.argv.slice(2);
	const options = {};
	args.forEach((arg) => {
		if (arg.startsWith('--version=')) {
			options.version = arg.split('=')[1];
		} else if (arg === '--dry-run') {
			options.dryRun = true;
		} else if (arg === '--max-dry-run' || arg === '--dry-run=maximum') {
			options.maxDryRun = true;
		} else if (arg.startsWith('--wizard-mode=')) {
			options.wizardMode = arg.split('=')[1];
		} else if (arg.startsWith('--wizard-config=')) {
			options.wizardConfigFile = arg.split('=')[1];
		} else if (arg.startsWith('--workflow-mode=')) {
			options.workflowMode = arg.split('=')[1];
		} else if (arg === '--help' || arg === '-h') {
			console.log(`
Release Scaffold Agent

Usage:
	node scripts/agents/release-scaffold.agent.js [options]

Options:
	--version=X.Y.Z         Version to release (required for full release)
	--dry-run               Run without making changes
	--max-dry-run           Simulate all actions
	--wizard-mode=cli|mock|json  Choose wizard interaction mode
	--wizard-config=PATH    JSON file that pre-fills wizard answers
	--workflow-mode=validation|release  Force workflow choice
	--help, -h              Show this help message

Examples:
	node scripts/agents/release-scaffold.agent.js --version=1.2.0 --workflow-mode=release
	node scripts/agents/release-scaffold.agent.js --dry-run --wizard-mode=mock
	`);
			process.exit(0);
		}
	});
	if (process.env.DRY_RUN === 'maximum') {
		options.maxDryRun = true;
	}

	const agent = new ReleaseScaffoldAgent(options);
	agent.run({
		dryRun: options.dryRun,
		maxDryRun: options.maxDryRun,
		version: options.version,
	});
}

module.exports = ReleaseScaffoldAgent;
