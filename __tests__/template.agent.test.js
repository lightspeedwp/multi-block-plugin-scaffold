// template.agent.js test
const main = require('../scripts/agents/template.agent');
test('template agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
