// scripts/agents/release-scaffold.questions.js
// Staged, validated questions array for the release-scaffold agent wizard

module.exports = [
  // Stage 1: Release Readiness
  {
    name: 'version',
    type: 'input',
    message: 'Release version (semver):',
    validate: v => /^\d+\.\d+\.\d+$/.test(v) || 'Use semantic versioning (e.g., 1.2.3).',
  },
  {
    name: 'changelog',
    type: 'confirm',
    message: 'Has the changelog been updated?',
  },
  {
    name: 'build',
    type: 'confirm',
    message: 'Has the plugin been built (npm run build)?',
  },
  // Stage 2: Checklist
  {
    name: 'lint',
    type: 'confirm',
    message: 'Have all linters passed?',
  },
  {
    name: 'tests',
    type: 'confirm',
    message: 'Have all tests passed?',
  },
  {
    name: 'docs',
    type: 'confirm',
    message: 'Is documentation up to date?',
  },
  {
    name: 'translations',
    type: 'confirm',
    message: 'Are translations updated?',
  },
  {
    name: 'plugin_zip',
    type: 'confirm',
    message: 'Is the plugin ZIP ready?',
  },
  // Stage 3: Advanced/Optional
  {
    name: 'advanced',
    type: 'confirm',
    message: 'Show advanced options?',
    default: false,
  },
  {
    name: 'custom_scripts',
    type: 'input',
    message: 'Any custom pre-release scripts to run?',
    when: a => a.advanced,
  },
  // Stage 4: Summary/Confirmation
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Ready to run release with these settings?',
  },
];
