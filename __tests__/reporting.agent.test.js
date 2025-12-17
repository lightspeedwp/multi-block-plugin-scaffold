// reporting.agent.js test
const main = require('../scripts/agents/reporting.agent');
test('reporting agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
