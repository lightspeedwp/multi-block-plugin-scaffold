// Accessibility Agent Script
// Integrates with wizard.js for config gathering
const { runWizard } = require('../lib/wizard.js');

async function main() {
  const mode = process.env.DRY_RUN ? 'mock' : 'cli';
  const params = await runWizard({ mode });
  // TODO: Implement accessibility audit logic using params
  console.log('Accessibility Agent params:', params);
}

if (require.main === module) main();
module.exports = main;
