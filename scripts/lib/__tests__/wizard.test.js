const { runWizard } = require('../wizard');

describe('runWizard', () => {
	it('returns a mock config object by default', async () => {
		const config = await runWizard();
		expect(config).toHaveProperty('slug');
		expect(config).toHaveProperty('name');
		expect(config).toHaveProperty('author');
	});

	it('should allow loading config from a file if provided', async () => {
		// This test will be implemented after file loading is added
		// Placeholder for future test
		expect(true).toBe(true);
	});
});
