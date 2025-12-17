// scripts/lib/wizard.js
// Minimal stub for runWizard to unblock agent CLI and tests.
// TODO: Implement full interactive wizard as needed.

async function runWizard(/* dependencies */) {
    // Return a minimal valid config for test purposes
    return {
        slug: 'test-plugin',
        name: 'Test Plugin',
        author: 'Test Author',
        version: '1.0.0',
        description: 'A test plugin',
        namespace: 'test_plugin',
        textdomain: 'test-plugin',
    };
}

module.exports = { runWizard };
