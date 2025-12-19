// code-quality.agent.js test
const main = require('../scripts/agents/code-quality.agent');
test('code-quality agent runs with wizard (dry-run)', async () => {
	process.env.DRY_RUN = '1';
	await expect(main()).resolves.toBeUndefined();
});
