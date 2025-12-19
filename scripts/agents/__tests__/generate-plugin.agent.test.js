/**
 * @file generate-plugin.agent.test.js
 * @description Smoke test for the generate-plugin agent export
 */
const generatePluginAgent = require('../scripts/agents/generate-plugin.agent');

test('generate-plugin agent exports the CLI entry point', () => {
	expect(typeof generatePluginAgent).toBe('function');
});
