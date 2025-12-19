/**
 * @file release.agent.test.js
 * @description Smoke test for the generated release agent exports
 */
const releaseAgent = require('../scripts/agents/release.agent');

test('release agent exposes the validation helpers', () => {
	expect(typeof releaseAgent.checkVersionConsistency).toBe('function');
	expect(typeof releaseAgent.checkQualityGates).toBe('function');
});
