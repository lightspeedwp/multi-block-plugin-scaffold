// development-assistant.agent.js test
const main = require('../development-assistant.agent');
test('development-assistant agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
