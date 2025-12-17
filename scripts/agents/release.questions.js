// scripts/agents/release.questions.js
// Staged, validated questions array for the release agent wizard

module.exports = [
  // Stage 1: Release Metadata
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
    name: 'release_notes',
    type: 'input',
    message: 'Release notes (short summary):',
    validate: v => v.length > 5 || 'Please provide a summary.',
  },
  {
    name: 'tag',
    type: 'input',
    message: 'Git tag for release:',
    validate: v => /^v?\d+\.\d+\.\d+$/.test(v) || 'Use v1.2.3 or 1.2.3.',
  },
  // Stage 2: Checklist
  {
    name: 'tests',
    type: 'confirm',
    message: 'Have all tests passed?',
  },
  {
    name: 'build',
    type: 'confirm',
    message: 'Has the plugin been built (npm run build)?',
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
    name: 'pre_release_hooks',
    type: 'input',
    message: 'Any pre-release hooks to run?',
    when: a => a.advanced,
  },
  // Stage 4: Summary/Confirmation
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Ready to run release with these settings?',
  },
];
