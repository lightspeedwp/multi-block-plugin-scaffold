// release-scaffold.agent.js test
const main = require('../scripts/agents/release-scaffold.agent');
test('release-scaffold agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
