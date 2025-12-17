// task-planner.agent.js test
const main = require('../task-planner.agent');
test('task-planner agent runs with wizard', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
