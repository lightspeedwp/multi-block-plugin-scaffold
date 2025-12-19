// development-assistant.agent.js test
const main = require('../scripts/agents/development-assistant.agent');
test('development-assistant agent runs with wizard (dry-run)', async () => {
	process.env.DRY_RUN = '1';
	await expect(main()).resolves.toBeUndefined();
});
