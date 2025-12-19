// task-researcher.agent.js test
const main = require('../scripts/agents/task-researcher.agent');
test('task-researcher agent runs with wizard (dry-run)', async () => {
	process.env.DRY_RUN = '1';
	await expect(main()).resolves.toBeUndefined();
});
