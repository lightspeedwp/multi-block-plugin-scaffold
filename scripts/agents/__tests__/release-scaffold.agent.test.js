/**
 * @file release-scaffold.agent.test.js
 * @description Smoke test for the ReleaseScaffoldAgent export
 * @todo Expand tests for actual release orchestration when ready
 */
const ReleaseScaffoldAgent = require('../scripts/agents/release-scaffold.agent');

test('release-scaffold agent exports a constructor', () => {
	expect(typeof ReleaseScaffoldAgent).toBe('function');
	expect(ReleaseScaffoldAgent.name).toBe('ReleaseScaffoldAgent');
});
