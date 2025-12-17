// generate-plugin.agent.js test
const main = require('../generate-plugin.agent');
test('generate-plugin agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
