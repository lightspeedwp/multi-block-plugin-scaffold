// a11y.agent.js test
const main = require('../scripts/agents/a11y.agent');
test('a11y agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
