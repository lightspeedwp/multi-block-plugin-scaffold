// Staged questions array for generate-plugin agent wizard
module.exports = [
  // 1. Plugin Identity
  {
    name: 'name',
    type: 'input',
    message: 'Plugin name:',
    validate: (input) => input && input.length > 2 || 'Plugin name required.'
  },
  {
    name: 'slug',
    type: 'input',
    message: 'Plugin slug (kebab-case):',
    validate: (input) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(input) || 'Use only lowercase letters, numbers, and hyphens.'
  },
  {
    name: 'namespace',
    type: 'input',
    message: 'Namespace (snake_case):',
    validate: (input) => /^[a-z0-9]+(_[a-z0-9]+)*$/.test(input) || 'Use only lowercase letters, numbers, and underscores.'
  },
  {
    name: 'description',
    type: 'input',
    message: 'Short description:',
    validate: (input) => input && input.length > 5 || 'Description required.'
  },
  {
    name: 'author',
    type: 'input',
    message: 'Author name:',
    validate: (input) => input && input.length > 1 || 'Author required.'
  },
  {
    name: 'author_uri',
    type: 'input',
    message: 'Author website (URL):',
    validate: (input) => /^https?:\/\//.test(input) || 'Enter a valid URL.'
  },
  {
    name: 'version',
    type: 'input',
    message: 'Plugin version (semver):',
    default: '1.0.0',
    validate: (input) => /^\d+\.\d+\.\d+$/.test(input) || 'Use semantic versioning (e.g. 1.0.0)'
  },
  // 2. Features
  {
    name: 'addCPT',
    type: 'confirm',
    message: 'Add a custom post type (CPT)?'
  },
  {
    name: 'cpt_slug',
    type: 'input',
    message: 'CPT slug (max 20 chars):',
    when: (a) => a.addCPT,
    validate: (input) => !input || (input.length <= 20 && /^[a-z0-9_]+$/.test(input)) || 'Max 20 chars, lowercase letters/numbers/underscores.'
  },
  {
    name: 'cpt_name',
    type: 'input',
    message: 'CPT name (plural):',
    when: (a) => a.addCPT,
    validate: (input) => !input || input.length > 1 || 'CPT name required.'
  },
  {
    name: 'addTaxonomy',
    type: 'confirm',
    message: 'Add a taxonomy?'
  },
  {
    name: 'taxonomy_slug',
    type: 'input',
    message: 'Taxonomy slug:',
    when: (a) => a.addTaxonomy,
    validate: (input) => !input || /^[a-z0-9_]+$/.test(input) || 'Lowercase letters/numbers/underscores.'
  },
  {
    name: 'taxonomy_name',
    type: 'input',
    message: 'Taxonomy name (plural):',
    when: (a) => a.addTaxonomy,
    validate: (input) => !input || input.length > 1 || 'Taxonomy name required.'
  },
  {
    name: 'addBlocks',
    type: 'confirm',
    message: 'Add custom blocks?'
  },
  {
    name: 'block_slugs',
    type: 'input',
    message: 'Block slugs (comma-separated):',
    when: (a) => a.addBlocks,
    filter: (input) => input.split(',').map((s) => s.trim()).filter(Boolean),
    validate: (input) => !input || input.length > 0 || 'At least one block slug required.'
  },
  // 3. Design
  {
    name: 'addDesign',
    type: 'confirm',
    message: 'Configure design tokens (colors, icons, styles)?'
  },
  {
    name: 'primaryColor',
    type: 'input',
    message: 'Primary color (hex):',
    when: (a) => a.addDesign,
    validate: (input) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(input) || 'Enter a valid hex color.'
  },
  {
    name: 'icon',
    type: 'input',
    message: 'Plugin icon (dashicon slug):',
    when: (a) => a.addDesign,
    validate: (input) => !input || /^([a-z-]+)$/.test(input) || 'Enter a valid dashicon slug.'
  },
  // 4. Advanced
  {
    name: 'addSCF',
    type: 'confirm',
    message: 'Add Secure Custom Fields (SCF)?'
  },
  {
    name: 'scf_fields',
    type: 'input',
    message: 'SCF field keys (comma-separated):',
    when: (a) => a.addSCF,
    filter: (input) => input.split(',').map((s) => s.trim()).filter(Boolean),
    validate: (input) => !input || input.length > 0 || 'At least one field key required.'
  },
  // 5. Summary/Confirmation
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Ready to generate plugin with these settings?'
  }
];
