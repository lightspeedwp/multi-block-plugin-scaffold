// release.agent.js test
const main = require('../scripts/agents/release.agent');
test('release agent runs with wizard (dry-run)', async () => {
	process.env.DRY_RUN = '1';
	await expect(main()).resolves.toBeUndefined();
});
