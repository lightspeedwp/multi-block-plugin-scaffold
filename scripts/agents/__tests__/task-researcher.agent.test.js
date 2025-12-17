// task-researcher.agent.js test
const main = require('../task-researcher.agent');
test('task-researcher agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
