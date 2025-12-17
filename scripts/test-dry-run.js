#!/usr/bin/env node
// Entrypoint for test-dry-run.js, delegates to scripts/dry-run/test-dry-run.js
require(require('path').join(__dirname, 'dry-run', 'test-dry-run.js'));
