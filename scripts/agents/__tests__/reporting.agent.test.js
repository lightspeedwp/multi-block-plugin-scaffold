// reporting.agent.js test
const main = require('../reporting.agent');
test('reporting agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
