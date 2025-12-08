#!/usr/bin/env node

/**
 * Scaffold Generator Agent for Multi-Block Plugin
 *
 * Interactive agent that gathers requirements for a multi-block plugin
 * including CPT, taxonomies, custom fields, and blocks.
 *
 * Usage:
 *   Interactive: node scaffold-generator.agent.js
 *   With JSON:   echo '{"slug":"tour-operator"}' | node scaffold-generator.agent.js --json
 *   Validate:    node scaffold-generator.agent.js --validate '{"slug":"test"}'
 *   Schema:      node scaffold-generator.agent.js --schema
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `agent-scaffold-generator-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

/**
 * Log function for agent
 *
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG, TRACE)
 * @param {string} message - Log message
 */
function agentLog(level, message) {
	const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
	logStream.write(entry);
	console.log(entry.trim());
}

// Log at start
agentLog('INFO', 'Scaffold generator agent starting');
agentLog('INFO', `Node version: ${process.version}`);
agentLog('INFO', `Working directory: ${process.cwd()}`);
agentLog('INFO', `Log file: ${logFile}`);

// Cleanup on exit
process.on('exit', () => {
	agentLog('INFO', 'Agent execution completed');
	logStream.end();
});

process.on('SIGINT', () => {
	agentLog('WARN', 'Agent interrupted by user');
	logStream.end();
	process.exit(1);
});

/**
 * SCF Field types reference
 */
const SCF_FIELD_TYPES = [
	'text',
	'textarea',
	'wysiwyg',
	'number',
	'email',
	'url',
	'password',
	'image',
	'file',
	'gallery',
	'select',
	'checkbox',
	'radio',
	'true_false',
	'date_picker',
	'time_picker',
	'date_time_picker',
	'color_picker',
	'post_object',
	'relationship',
	'taxonomy',
	'user',
	'repeater',
	'group',
	'flexible_content',
	'clone',
];

/**
 * Configuration schema defining all available options
 */
const CONFIG_SCHEMA = {
	// Stage 1: Plugin Identity (Required)
	slug: {
		stage: 1,
		required: true,
		type: 'string',
		pattern: /^[a-z][a-z0-9-]{1,48}[a-z0-9]$/,
		description: 'Plugin slug (lowercase, hyphens only)',
		example: 'tour-operator',
		default: null,
	},
	name: {
		stage: 1,
		required: true,
		type: 'string',
		minLength: 2,
		maxLength: 100,
		description: 'Plugin display name',
		example: 'Tour Operator',
		default: null,
	},
	name_singular: {
		stage: 1,
		required: false,
		type: 'string',
		description: 'Singular name for CPT',
		example: 'Tour',
		default: null,
	},
	name_plural: {
		stage: 1,
		required: false,
		type: 'string',
		description: 'Plural name for CPT',
		example: 'Tours',
		default: null,
	},
	description: {
		stage: 1,
		required: false,
		type: 'string',
		maxLength: 500,
		description: 'Plugin description',
		example: 'A multi-block plugin for tour management.',
		default: 'A custom multi-block WordPress plugin.',
	},
	author: {
		stage: 1,
		required: false,
		type: 'string',
		maxLength: 100,
		description: 'Author name',
		example: 'Your Name',
		default: 'Author Name',
	},
	author_uri: {
		stage: 1,
		required: false,
		type: 'url',
		description: 'Author website URL',
		example: 'https://example.com',
		default: 'https://example.com',
	},

	// Stage 2: Custom Post Type
	cpt_slug: {
		stage: 2,
		required: false,
		type: 'string',
		pattern: /^[a-z][a-z0-9_]{0,18}[a-z0-9]$/,
		description: 'CPT slug (max 20 chars, underscores OK)',
		example: 'tour',
		default: null,
	},
	cpt_supports: {
		stage: 2,
		required: false,
		type: 'array',
		items: {
			enum: [
				'title',
				'editor',
				'author',
				'thumbnail',
				'excerpt',
				'trackbacks',
				'custom-fields',
				'comments',
				'revisions',
				'page-attributes',
				'post-formats',
			],
		},
		description: 'CPT supports (comma-separated)',
		default: ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
	},
	cpt_has_archive: {
		stage: 2,
		required: false,
		type: 'boolean',
		description: 'Enable archive page',
		default: true,
	},
	cpt_public: {
		stage: 2,
		required: false,
		type: 'boolean',
		description: 'Make CPT public',
		default: true,
	},
	cpt_menu_icon: {
		stage: 2,
		required: false,
		type: 'string',
		description: 'Dashicon name for admin menu',
		example: 'dashicons-palmtree',
		default: 'dashicons-admin-post',
	},

	// Stage 3: Taxonomies
	taxonomies: {
		stage: 3,
		required: false,
		type: 'array',
		items: { type: 'object' },
		description: 'Custom taxonomies',
		default: [],
	},

	// Stage 4: Custom Fields
	fields: {
		stage: 4,
		required: false,
		type: 'array',
		items: { type: 'object' },
		description: 'Custom fields (SCF format)',
		default: [],
	},

	// Stage 5: Blocks
	blocks: {
		stage: 5,
		required: false,
		type: 'array',
		items: { type: 'object' },
		description: 'Blocks to create',
		default: ['card', 'collection'],
	},

	// Stage 6: Templates
	templates: {
		stage: 6,
		required: false,
		type: 'array',
		items: {
			enum: ['single', 'archive', 'search'],
		},
		description: 'Templates to generate',
		default: ['single', 'archive'],
	},

	// Stage 7: Version
	version: {
		stage: 7,
		required: false,
		type: 'semver',
		description: 'Initial version number',
		example: '1.0.0',
		default: '1.0.0',
	},
	requires_wp: {
		stage: 7,
		required: false,
		type: 'version',
		description: 'Minimum WordPress version',
		example: '6.0',
		default: '6.0',
	},
	requires_php: {
		stage: 7,
		required: false,
		type: 'version',
		description: 'Minimum PHP version',
		example: '8.0',
		default: '8.0',
	},
	license: {
		stage: 7,
		required: false,
		type: 'string',
		enum: ['GPL-2.0-or-later', 'GPL-3.0-or-later'],
		description: 'License identifier',
		default: 'GPL-2.0-or-later',
	},
};

/**
 * Taxonomy configuration schema
 */
const TAXONOMY_SCHEMA = {
	slug: {
		required: true,
		type: 'string',
		pattern: /^[a-z][a-z0-9_]{0,30}[a-z0-9]$/,
		description: 'Taxonomy slug',
	},
	singular: {
		required: true,
		type: 'string',
		description: 'Singular label',
	},
	plural: {
		required: true,
		type: 'string',
		description: 'Plural label',
	},
	hierarchical: {
		required: false,
		type: 'boolean',
		description: 'Hierarchical (like categories)',
		default: true,
	},
};

/**
 * Field configuration schema
 */
const FIELD_SCHEMA = {
	name: {
		required: true,
		type: 'string',
		description: 'Field name (key)',
	},
	label: {
		required: true,
		type: 'string',
		description: 'Field label',
	},
	type: {
		required: true,
		type: 'string',
		enum: SCF_FIELD_TYPES,
		description: 'Field type',
	},
	required: {
		required: false,
		type: 'boolean',
		description: 'Is field required',
		default: false,
	},
	instructions: {
		required: false,
		type: 'string',
		description: 'Help text for editors',
	},
};

/**
 * Validate a single value against its schema definition
 */
function validateValue(key, value, schema) {
	const errors = [];

	if (schema.required && !value) {
		errors.push(`${key} is required`);
		return errors;
	}

	if (!value && !schema.required) {
		return errors;
	}

	switch (schema.type) {
		case 'string':
			if (typeof value !== 'string') {
				errors.push(`${key} must be a string`);
			} else {
				if (schema.pattern && !schema.pattern.test(value)) {
					errors.push(
						`${key} must match pattern: ${schema.pattern}`
					);
				}
				if (schema.minLength && value.length < schema.minLength) {
					errors.push(
						`${key} must be at least ${schema.minLength} characters`
					);
				}
				if (schema.maxLength && value.length > schema.maxLength) {
					errors.push(
						`${key} must be at most ${schema.maxLength} characters`
					);
				}
				if (schema.enum && !schema.enum.includes(value)) {
					errors.push(
						`${key} must be one of: ${schema.enum.join(', ')}`
					);
				}
			}
			break;

		case 'url':
			try {
				const url = new URL(value);
				if (!['http:', 'https:'].includes(url.protocol)) {
					errors.push(`${key} must use http or https protocol`);
				}
			} catch {
				errors.push(`${key} must be a valid URL`);
			}
			break;

		case 'semver':
			if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(value)) {
				errors.push(`${key} must be valid semver (e.g., 1.0.0)`);
			}
			break;

		case 'version':
			if (!/^\d+\.\d+(\.\d+)?$/.test(value)) {
				errors.push(`${key} must be a valid version (e.g., 6.0)`);
			}
			break;

		case 'boolean':
			if (typeof value !== 'boolean') {
				errors.push(`${key} must be a boolean`);
			}
			break;

		case 'array':
			if (!Array.isArray(value)) {
				errors.push(`${key} must be an array`);
			} else if (schema.items?.enum) {
				const invalid = value.filter(
					(v) => typeof v === 'string' && !schema.items.enum.includes(v)
				);
				if (invalid.length > 0) {
					errors.push(
						`${key} contains invalid values: ${invalid.join(', ')}`
					);
				}
			}
			break;
	}

	return errors;
}

/**
 * Validate complete configuration object
 */
function validateConfig(config) {
	const errors = [];
	const warnings = [];

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		const value = config[key];
		const fieldErrors = validateValue(key, value, schema);

		if (fieldErrors.length > 0) {
			if (schema.required) {
				errors.push(...fieldErrors);
			} else {
				warnings.push(...fieldErrors);
			}
		}
	}

	// Validate nested taxonomies
	if (Array.isArray(config.taxonomies)) {
		config.taxonomies.forEach((tax, i) => {
			for (const [key, schema] of Object.entries(TAXONOMY_SCHEMA)) {
				const fieldErrors = validateValue(
					`taxonomies[${i}].${key}`,
					tax[key],
					schema
				);
				errors.push(...fieldErrors);
			}
		});
	}

	// Validate nested fields
	if (Array.isArray(config.fields)) {
		config.fields.forEach((field, i) => {
			for (const [key, schema] of Object.entries(FIELD_SCHEMA)) {
				const fieldErrors = validateValue(
					`fields[${i}].${key}`,
					field[key],
					schema
				);
				errors.push(...fieldErrors);
			}
		});
	}

	return { valid: errors.length === 0, errors, warnings };
}

/**
 * Apply defaults to configuration
 */
function applyDefaults(config) {
	const result = { ...config };

	for (const [key, schema] of Object.entries(CONFIG_SCHEMA)) {
		if (result[key] === undefined && schema.default !== null) {
			result[key] = schema.default;
		}
	}

	// Derive computed values
	if (result.slug) {
		result.textdomain = result.slug;
		result.namespace = result.slug.replace(/-/g, '_');
		result.cpt_slug = result.cpt_slug || result.slug.replace(/-/g, '_');
	}

	if (result.name && !result.name_singular) {
		// Attempt to singularize
		result.name_singular = result.name.replace(/s$/, '');
	}

	if (result.name_singular && !result.name_plural) {
		result.name_plural = result.name_singular + 's';
	}

	return result;
}

/**
 * Build the generation command (for multi-block, we output JSON config)
 */
function buildCommand(config) {
	// Multi-block uses JSON config file approach
	return `# Save this configuration to generate the plugin:\necho '${JSON.stringify(config, null, 2)}' > plugin-config.json\nnode bin/generate-plugin.js --config plugin-config.json`;
}

/**
 * Get questions for a specific stage
 */
function getStageQuestions(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, schema]) => schema.stage === stage)
		.map(([key, schema]) => ({
			key,
			...schema,
		}));
}

/**
 * Interactive prompt session
 */
async function interactiveSession() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));

	console.log('\n🏗️  Multi-Block Plugin Scaffold Generator\n');
	console.log('This wizard will guide you through creating a WordPress plugin with:');
	console.log('  • Custom Post Type');
	console.log('  • Custom Taxonomies');
	console.log('  • SCF Custom Fields');
	console.log('  • Multiple Blocks');
	console.log('  • Block Templates\n');

	const config = {};

	// Stage 1: Identity
	console.log('📋 Stage 1: Plugin Identity\n');

	for (const q of getStageQuestions(1)) {
		const required = q.required ? ' (required)' : '';
		const defaultHint = q.default ? ` [${q.default}]` : '';
		const answer = await ask(`  ${q.description}${required}${defaultHint}: `);

		if (answer.trim()) {
			config[q.key] = answer.trim();
		}
	}

	// Validate Stage 1
	const stage1Validation = validateConfig(config);
	if (!stage1Validation.valid) {
		console.log('\n❌ Validation errors:');
		stage1Validation.errors.forEach((e) => console.log(`   - ${e}`));
		rl.close();
		process.exit(1);
	}

	// Stage 2: CPT
	const continueStage2 = await ask('\n📋 Stage 2: Custom Post Type (Y/n): ');
	if (continueStage2.toLowerCase() !== 'n') {
		console.log('');
		for (const q of getStageQuestions(2)) {
			if (q.type === 'array') {
				const defaultHint = q.default ? ` [${q.default.join(',')}]` : '';
				const answer = await ask(`  ${q.description}${defaultHint}: `);
				if (answer.trim()) {
					config[q.key] = answer.split(',').map((s) => s.trim());
				}
			} else if (q.type === 'boolean') {
				const defaultHint = q.default ? ' [Y/n]' : ' [y/N]';
				const answer = await ask(`  ${q.description}${defaultHint}: `);
				if (answer.trim()) {
					config[q.key] = answer.toLowerCase() === 'y';
				}
			} else {
				const defaultHint = q.default ? ` [${q.default}]` : '';
				const answer = await ask(`  ${q.description}${defaultHint}: `);
				if (answer.trim()) {
					config[q.key] = answer.trim();
				}
			}
		}
	}

	// Stage 3: Taxonomies
	const continueStage3 = await ask('\n📋 Stage 3: Add Taxonomies? (y/N): ');
	if (continueStage3.toLowerCase() === 'y') {
		config.taxonomies = [];
		let addMore = true;

		while (addMore) {
			console.log(`\n  Taxonomy #${config.taxonomies.length + 1}:`);
			const tax = {};

			for (const [key, schema] of Object.entries(TAXONOMY_SCHEMA)) {
				if (schema.type === 'boolean') {
					const defaultHint = schema.default ? ' [Y/n]' : ' [y/N]';
					const answer = await ask(`    ${schema.description}${defaultHint}: `);
					tax[key] = answer.toLowerCase() !== 'n';
				} else {
					const answer = await ask(`    ${schema.description}: `);
					if (answer.trim()) {
						tax[key] = answer.trim();
					}
				}
			}

			config.taxonomies.push(tax);

			const more = await ask('\n  Add another taxonomy? (y/N): ');
			addMore = more.toLowerCase() === 'y';
		}
	}

	// Stage 4: Fields
	const continueStage4 = await ask('\n📋 Stage 4: Add Custom Fields? (y/N): ');
	if (continueStage4.toLowerCase() === 'y') {
		config.fields = [];
		let addMore = true;

		console.log(`\n  Available field types: ${SCF_FIELD_TYPES.slice(0, 10).join(', ')}...`);

		while (addMore) {
			console.log(`\n  Field #${config.fields.length + 1}:`);
			const field = {};

			for (const [key, schema] of Object.entries(FIELD_SCHEMA)) {
				if (schema.type === 'boolean') {
					const answer = await ask(`    ${schema.description} [y/N]: `);
					field[key] = answer.toLowerCase() === 'y';
				} else {
					const required = schema.required ? ' (required)' : '';
					const answer = await ask(`    ${schema.description}${required}: `);
					if (answer.trim()) {
						field[key] = answer.trim();
					}
				}
			}

			config.fields.push(field);

			const more = await ask('\n  Add another field? (y/N): ');
			addMore = more.toLowerCase() === 'y';
		}
	}

	// Stage 5: Blocks
	const continueStage5 = await ask('\n📋 Stage 5: Configure Blocks (y/N): ');
	if (continueStage5.toLowerCase() === 'y') {
		const blocksAnswer = await ask(
			'  Block names (comma-separated) [card, collection]: '
		);
		if (blocksAnswer.trim()) {
			config.blocks = blocksAnswer.split(',').map((s) => s.trim());
		}
	}

	// Stage 6: Templates
	const continueStage6 = await ask('\n📋 Stage 6: Block Templates (y/N): ');
	if (continueStage6.toLowerCase() === 'y') {
		const templatesAnswer = await ask(
			'  Templates (single, archive, search) [single, archive]: '
		);
		if (templatesAnswer.trim()) {
			config.templates = templatesAnswer.split(',').map((s) => s.trim());
		}
	}

	// Stage 7: Version
	const continueStage7 = await ask('\n📋 Stage 7: Version & Requirements (y/N): ');
	if (continueStage7.toLowerCase() === 'y') {
		console.log('');
		for (const q of getStageQuestions(7)) {
			const defaultHint = q.default ? ` [${q.default}]` : '';
			const answer = await ask(`  ${q.description}${defaultHint}: `);

			if (answer.trim()) {
				config[q.key] = answer.trim();
			}
		}
	}

	rl.close();

	// Apply defaults and validate
	const finalConfig = applyDefaults(config);
	const validation = validateConfig(finalConfig);

	if (!validation.valid) {
		console.log('\n❌ Configuration errors:');
		validation.errors.forEach((e) => console.log(`   - ${e}`));
		process.exit(1);
	}

	if (validation.warnings.length > 0) {
		console.log('\n⚠️  Warnings:');
		validation.warnings.forEach((w) => console.log(`   - ${w}`));
	}

	// Show summary
	console.log('\n✅ Configuration Summary:\n');
	console.log(JSON.stringify(finalConfig, null, 2));
	console.log('\n📦 Next Steps:\n');
	console.log('  1. Save the configuration above to a JSON file');
	console.log('  2. Run: node bin/generate-plugin.js --config your-config.json\n');

	return finalConfig;
}

/**
 * Process JSON input from stdin
 */
async function processJsonInput() {
	return new Promise((resolve, reject) => {
		let data = '';
		process.stdin.on('data', (chunk) => (data += chunk));
		process.stdin.on('end', () => {
			try {
				const config = JSON.parse(data);
				resolve(config);
			} catch (e) {
				reject(new Error(`Invalid JSON: ${e.message}`));
			}
		});
	});
}

/**
 * Main entry point
 */
async function main() {
	const args = process.argv.slice(2);

	// Schema output
	if (args.includes('--schema')) {
		console.log(
			JSON.stringify(
				{
					config: CONFIG_SCHEMA,
					taxonomy: TAXONOMY_SCHEMA,
					field: FIELD_SCHEMA,
					fieldTypes: SCF_FIELD_TYPES,
				},
				null,
				2
			)
		);
		process.exit(0);
	}

	// Validate JSON argument
	const validateIndex = args.indexOf('--validate');
	if (validateIndex !== -1) {
		const jsonArg = args[validateIndex + 1];
		if (!jsonArg) {
			console.error('--validate requires a JSON argument');
			process.exit(1);
		}
		try {
			const config = JSON.parse(jsonArg);
			const result = validateConfig(config);
			console.log(JSON.stringify(result, null, 2));
			process.exit(result.valid ? 0 : 1);
		} catch (e) {
			console.error(`Invalid JSON: ${e.message}`);
			process.exit(1);
		}
	}

	// JSON input mode
	if (args.includes('--json')) {
		try {
			const config = await processJsonInput();
			const finalConfig = applyDefaults(config);
			const validation = validateConfig(finalConfig);

			if (!validation.valid) {
				console.error(
					JSON.stringify({ success: false, errors: validation.errors })
				);
				process.exit(1);
			}

			console.log(
				JSON.stringify({
					success: true,
					config: finalConfig,
					command: buildCommand(finalConfig),
				})
			);
			process.exit(0);
		} catch (e) {
			console.error(JSON.stringify({ success: false, error: e.message }));
			process.exit(1);
		}
	}

	// Interactive mode
	await interactiveSession();
}

// Export for testing
module.exports = {
	CONFIG_SCHEMA,
	TAXONOMY_SCHEMA,
	FIELD_SCHEMA,
	SCF_FIELD_TYPES,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
};

// Run if executed directly
if (require.main === module) {
	main().catch((e) => {
		console.error(e.message);
		process.exit(1);
	});
}
