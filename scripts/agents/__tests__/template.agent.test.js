/**
 * @file template.agent.test.js
 * @description Smoke test for the TemplateAgent export
 * @todo Add targeted unit tests once the template is customised
 */
const TemplateAgent = require('../scripts/agents/template.agent');

test('template agent exports a constructor', () => {
	expect(typeof TemplateAgent).toBe('function');
	expect(TemplateAgent.name).toBe('TemplateAgent');
});
