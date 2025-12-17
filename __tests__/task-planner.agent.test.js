// task-planner.agent.js test
const main = require('../scripts/agents/task-planner.agent');
test('task-planner agent runs with wizard (dry-run)', async () => {
  process.env.DRY_RUN = '1';
  await expect(main()).resolves.toBeUndefined();
});
