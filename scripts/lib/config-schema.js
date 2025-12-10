/**
 * Shared Configuration Schema
 *
 * Central schema definition used by both generate-plugin.js and generate-plugin.agent.js
 * Ensures consistent validation and configuration structure across all generation modes.
 */

const path = require('path');
const fs = require('fs');

/**
 * Load JSON schema from file
 *
 * @return {Object} The parsed JSON schema
 */
function loadSchema() {
	const schemaPath = path.resolve(
		__dirname,
		'../../.github/schemas/plugin-config.schema.json'
	);

	if (!fs.existsSync(schemaPath)) {
		throw new Error(`Schema file not found: ${schemaPath}`);
	}

	const schemaContent = fs.readFileSync(schemaPath, 'utf8');
	return JSON.parse(schemaContent);
}

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
 * Available block categories
 */
const BLOCK_CATEGORIES = [
	'text',
	'media',
	'design',
	'widgets',
	'theme',
	'embed',
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
		pattern: '^[a-z0-9]+(-[a-z0-9]+)*$',
		maxLength: 50,
		description: 'Plugin slug (lowercase, hyphens only, max 50 chars)',
		examples: ['tour-operator', 'booking-system', 'event-manager'],
	},
	name: {
		stage: 1,
		required: true,
		type: 'string',
		description: 'Plugin display name',
		examples: ['Tour Operator', 'Booking System', 'Event Manager'],
	},
	description: {
		stage: 1,
		required: false,
		type: 'string',
		description: 'Brief plugin description',
		examples: [
			'Manage tours and bookings',
			'Complete booking solution',
			'Event management plugin',
		],
	},
	author: {
		stage: 1,
		required: true,
		type: 'string',
		description: 'Plugin author name',
		examples: ['LightSpeed', 'Your Company', 'Your Name'],
	},
	author_uri: {
		stage: 1,
		required: false,
		type: 'string',
		format: 'uri',
		description: 'Author website URL',
		examples: ['https://lightspeedwp.com', 'https://example.com'],
	},

	// Stage 2: Custom Post Type
	name_singular: {
		stage: 2,
		required: false,
		type: 'string',
		description: 'Singular post type name',
		examples: ['Tour', 'Event', 'Product'],
	},
	name_plural: {
		stage: 2,
		required: false,
		type: 'string',
		description: 'Plural post type name',
		examples: ['Tours', 'Events', 'Products'],
	},
	cpt_slug: {
		stage: 2,
		required: false,
		type: 'string',
		maxLength: 20,
		description: 'Custom post type slug (max 20 chars)',
		examples: ['tour', 'event', 'product'],
	},
	cpt_icon: {
		stage: 2,
		required: false,
		type: 'string',
		description: 'Dashicon class for admin menu',
		examples: [
			'dashicons-palmtree',
			'dashicons-calendar',
			'dashicons-cart',
		],
	},
	cpt_supports: {
		stage: 2,
		required: false,
		type: 'array',
		items: {
			type: 'string',
			enum: [
				'title',
				'editor',
				'thumbnail',
				'excerpt',
				'comments',
				'revisions',
				'custom-fields',
			],
		},
		description: 'Features supported by the post type',
	},
	cpt_has_archive: {
		stage: 2,
		required: false,
		type: 'boolean',
		description: 'Enable archive page for the post type',
	},

	// Stage 3: Taxonomies
	taxonomies: {
		stage: 3,
		required: false,
		type: 'array',
		items: {
			type: 'object',
			properties: {
				slug: {
					type: 'string',
					description: 'Taxonomy slug',
				},
				singular: {
					type: 'string',
					description: 'Singular taxonomy name',
				},
				plural: {
					type: 'string',
					description: 'Plural taxonomy name',
				},
				hierarchical: {
					type: 'boolean',
					description: 'Is taxonomy hierarchical (like categories)',
				},
			},
			required: ['slug', 'singular', 'plural'],
		},
		description: 'Taxonomies for the custom post type',
	},

	// Stage 4: Custom Fields
	fields: {
		stage: 4,
		required: false,
		type: 'array',
		items: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					description: 'Field name/key',
				},
				label: {
					type: 'string',
					description: 'Field label shown to users',
				},
				type: {
					type: 'string',
					enum: SCF_FIELD_TYPES,
					description: 'SCF field type',
				},
				required: {
					type: 'boolean',
					description: 'Is this field required',
				},
				instructions: {
					type: 'string',
					description: 'Help text for editors',
				},
			},
			required: ['name', 'label', 'type'],
		},
		description: 'Custom fields for the post type',
	},

	// Stage 5: Blocks
	blocks: {
		stage: 5,
		required: false,
		type: 'array',
		items: {
			type: 'string',
			enum: ['card', 'collection', 'slider', 'featured'],
		},
		description: 'Blocks to generate',
	},

	// Stage 6: Templates & Patterns
	templates: {
		stage: 6,
		required: false,
		type: 'array',
		items: {
			type: 'string',
			enum: ['single', 'archive'],
		},
		description: 'Block templates to generate',
	},

	// Stage 7: Version & Compatibility
	version: {
		stage: 7,
		required: false,
		type: 'string',
		pattern: '^\\d+\\.\\d+\\.\\d+$',
		default: '1.0.0',
		description: 'Plugin version (semantic versioning)',
	},
	requires_wp: {
		stage: 7,
		required: false,
		type: 'string',
		default: '6.5',
		description: 'Minimum WordPress version',
	},
	requires_php: {
		stage: 7,
		required: false,
		type: 'string',
		default: '8.0',
		description: 'Minimum PHP version',
	},
	tested_up_to: {
		stage: 7,
		required: false,
		type: 'string',
		default: '6.7',
		description: 'Tested up to WordPress version',
	},
	license: {
		stage: 7,
		required: false,
		type: 'string',
		default: 'GPL-2.0-or-later',
		description: 'Plugin license',
	},

	// Auto-generated fields (not user-provided)
	namespace: {
		required: false,
		type: 'string',
		description: 'PHP namespace (auto-generated from slug)',
	},
	textdomain: {
		required: false,
		type: 'string',
		description: 'i18n text domain (auto-generated from slug)',
	},
};

/**
 * Get required fields for a specific stage
 *
 * @param {number} stage - Stage number (1-7)
 * @return {Array} Array of required field names
 */
function getRequiredFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(
			([, config]) => config.stage === stage && config.required === true
		)
		.map(([field]) => field);
}

/**
 * Get all fields for a specific stage
 *
 * @param {number} stage - Stage number (1-7)
 * @return {Array} Array of field names
 */
function getFieldsForStage(stage) {
	return Object.entries(CONFIG_SCHEMA)
		.filter(([, config]) => config.stage === stage)
		.map(([field]) => field);
}

/**
 * Get field configuration
 *
 * @param {string} field - Field name
 * @return {Object|null} Field configuration or null
 */
function getFieldConfig(field) {
	return CONFIG_SCHEMA[field] || null;
}

/**
 * Validate a field value against its schema
 *
 * @param {string} field - Field name
 * @param {*}      value - Field value
 * @return {Object} { valid: boolean, error?: string }
 */
function validateField(field, value) {
	const config = getFieldConfig(field);
	if (!config) {
		return { valid: false, error: `Unknown field: ${field}` };
	}

	// Check required
	if (config.required && !value) {
		return { valid: false, error: `${field} is required` };
	}

	// If not required and no value, it's valid
	if (!value && !config.required) {
		return { valid: true };
	}

	// Type validation
	const valueType = Array.isArray(value) ? 'array' : typeof value;
	if (config.type !== valueType) {
		return {
			valid: false,
			error: `${field} must be ${config.type}, got ${valueType}`,
		};
	}

	// Pattern validation
	if (config.pattern && !new RegExp(config.pattern).test(value)) {
		return {
			valid: false,
			error: `${field} does not match required pattern`,
		};
	}

	// Max length validation
	if (config.maxLength && value.length > config.maxLength) {
		return {
			valid: false,
			error: `${field} exceeds maximum length of ${config.maxLength}`,
		};
	}

	// Enum validation
	if (config.enum && !config.enum.includes(value)) {
		return {
			valid: false,
			error: `${field} must be one of: ${config.enum.join(', ')}`,
		};
	}

	return { valid: true };
}

module.exports = {
	CONFIG_SCHEMA,
	SCF_FIELD_TYPES,
	BLOCK_CATEGORIES,
	loadSchema,
	getRequiredFieldsForStage,
	getFieldsForStage,
	getFieldConfig,
	validateField,
};
