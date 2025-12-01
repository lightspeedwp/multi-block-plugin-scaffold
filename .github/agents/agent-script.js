#!/usr/bin/env node
// agent-script.js
// Functional agent script: lists files in the current directory and writes output to a file.

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const env = {
	DRY_RUN: process.env.DRY_RUN,
	VERBOSE: process.env.VERBOSE,
	GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '***' : undefined
};

console.log('Agent Script Running');
console.log('Arguments:', args);
console.log('Environment:', env);

// List files in the current directory
const files = fs.readdirSync(process.cwd());
console.log('Files in current directory:', files);

// Write output to a file for workflow artifact
const output = {
	args,
	env,
	files
};
const outputPath = path.join(process.cwd(), 'agent-output.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log('Output written to', outputPath);

process.exit(0);
