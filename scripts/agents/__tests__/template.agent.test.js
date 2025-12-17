// template.agent.js test
const main = require('../template.agent');
test('template agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
