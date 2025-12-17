#!/usr/bin/env node
// Entrypoint for dry-run test helpers; reuses the integration launcher inside __tests__.
require(require('path').join(__dirname, '__tests__', 'dry-run-test.js'));
