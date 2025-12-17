#!/usr/bin/env node
// Entrypoint for test-dry-run.js, delegates to scripts/dry-run/__tests__/dry-run-test.js
require(require('path').join(__dirname, 'dry-run', '__tests__', 'dry-run-test.js'));
