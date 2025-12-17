// Reporting Agent Script
const { runWizard } = require('../lib/wizard.js');

async function main() {
  const mode = process.env.DRY_RUN ? 'mock' : 'cli';
  const params = await runWizard({ mode });
  // TODO: Implement reporting logic using params
  console.log('Reporting Agent params:', params);
}

if (require.main === module) main();
module.exports = main;
