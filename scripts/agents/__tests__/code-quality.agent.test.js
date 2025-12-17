// code-quality.agent.js test
const main = require('../code-quality.agent');
test('code-quality agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
