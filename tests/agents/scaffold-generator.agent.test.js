/**
 * Tests for Multi-Block Plugin Scaffold Generator Agent
 *
 * @package {{namespace}}
 */

/* eslint-env node, jest */

const {
	CONFIG_SCHEMA,
	TAXONOMY_SCHEMA,
	FIELD_SCHEMA,
	SCF_FIELD_TYPES,
	validateValue,
	validateConfig,
	applyDefaults,
	buildCommand,
	getStageQuestions,
} = require('../../.github/agents/scaffold-generator.agent');

describe('Multi-Block Scaffold Generator Agent', () => {
	describe('CONFIG_SCHEMA', () => {
		it('should have required stage 1 fields', () => {
			const requiredFields = Object.entries(CONFIG_SCHEMA)
				.filter(([, schema]) => schema.required && schema.stage === 1)
				.map(([key]) => key);

			expect(requiredFields).toContain('slug');
			expect(requiredFields).toContain('name');
		});

		it('should have CPT configuration in stage 2', () => {
			const stage2Fields = Object.entries(CONFIG_SCHEMA)
				.filter(([, schema]) => schema.stage === 2)
				.map(([key]) => key);

			expect(stage2Fields).toContain('cpt_slug');
			expect(stage2Fields).toContain('cpt_supports');
			expect(stage2Fields).toContain('cpt_has_archive');
		});

		it('should have 7 stages for comprehensive configuration', () => {
			const stages = new Set(
				Object.values(CONFIG_SCHEMA).map((s) => s.stage)
			);
			expect(stages.size).toBe(7);
		});
	});

	describe('TAXONOMY_SCHEMA', () => {
		it('should have required fields', () => {
			expect(TAXONOMY_SCHEMA.slug.required).toBe(true);
			expect(TAXONOMY_SCHEMA.singular.required).toBe(true);
			expect(TAXONOMY_SCHEMA.plural.required).toBe(true);
		});

		it('should have hierarchical option', () => {
			expect(TAXONOMY_SCHEMA.hierarchical).toBeDefined();
			expect(TAXONOMY_SCHEMA.hierarchical.default).toBe(true);
		});
	});

	describe('FIELD_SCHEMA', () => {
		it('should have required fields', () => {
			expect(FIELD_SCHEMA.name.required).toBe(true);
			expect(FIELD_SCHEMA.label.required).toBe(true);
			expect(FIELD_SCHEMA.type.required).toBe(true);
		});

		it('should support all SCF field types', () => {
			expect(FIELD_SCHEMA.type.enum).toEqual(SCF_FIELD_TYPES);
		});
	});

	describe('SCF_FIELD_TYPES', () => {
		it('should include basic field types', () => {
			expect(SCF_FIELD_TYPES).toContain('text');
			expect(SCF_FIELD_TYPES).toContain('textarea');
			expect(SCF_FIELD_TYPES).toContain('wysiwyg');
			expect(SCF_FIELD_TYPES).toContain('number');
			expect(SCF_FIELD_TYPES).toContain('email');
			expect(SCF_FIELD_TYPES).toContain('url');
		});

		it('should include media field types', () => {
			expect(SCF_FIELD_TYPES).toContain('image');
			expect(SCF_FIELD_TYPES).toContain('file');
			expect(SCF_FIELD_TYPES).toContain('gallery');
		});

		it('should include relational field types', () => {
			expect(SCF_FIELD_TYPES).toContain('post_object');
			expect(SCF_FIELD_TYPES).toContain('relationship');
			expect(SCF_FIELD_TYPES).toContain('taxonomy');
			expect(SCF_FIELD_TYPES).toContain('user');
		});

		it('should include complex field types', () => {
			expect(SCF_FIELD_TYPES).toContain('repeater');
			expect(SCF_FIELD_TYPES).toContain('group');
			expect(SCF_FIELD_TYPES).toContain('flexible_content');
		});
	});

	describe('validateValue', () => {
		describe('CPT slug validation', () => {
			const cptSchema = CONFIG_SCHEMA.cpt_slug;

			it('should accept valid CPT slugs', () => {
				expect(validateValue('cpt', 'tour', cptSchema)).toHaveLength(0);
				expect(validateValue('cpt', 'my_cpt', cptSchema)).toHaveLength(
					0
				);
			});

			it('should enforce max 20 character limit', () => {
				const longSlug = 'a'.repeat(21);
				expect(
					validateValue('cpt', longSlug, cptSchema).length
				).toBeGreaterThan(0);
			});
		});

		describe('boolean validation', () => {
			const boolSchema = CONFIG_SCHEMA.cpt_has_archive;

			it('should accept boolean values', () => {
				expect(validateValue('bool', true, boolSchema)).toHaveLength(0);
				expect(validateValue('bool', false, boolSchema)).toHaveLength(
					0
				);
			});

			it('should reject non-boolean values', () => {
				expect(
					validateValue('bool', 'true', boolSchema).length
				).toBeGreaterThan(0);
				expect(
					validateValue('bool', 1, boolSchema).length
				).toBeGreaterThan(0);
			});
		});
	});

	describe('validateConfig', () => {
		it('should validate minimal config', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
		});

		it('should validate config with taxonomies', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				taxonomies: [
					{
						slug: 'tour_type',
						singular: 'Type',
						plural: 'Types',
						hierarchical: true,
					},
				],
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
		});

		it('should validate config with fields', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				fields: [
					{
						name: 'price',
						label: 'Price',
						type: 'number',
					},
					{
						name: 'gallery',
						label: 'Gallery',
						type: 'gallery',
					},
				],
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
		});

		it('should fail for invalid taxonomy', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				taxonomies: [
					{
						// missing required slug
						singular: 'Type',
						plural: 'Types',
					},
				],
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(false);
		});

		it('should fail for invalid field type', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				fields: [
					{
						name: 'test',
						label: 'Test',
						type: 'invalid_type',
					},
				],
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(false);
		});
	});

	describe('applyDefaults', () => {
		it('should derive CPT slug from plugin slug', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const result = applyDefaults(config);

			expect(result.cpt_slug).toBe('tour_operator');
		});

		it('should derive singular name from name', () => {
			const config = {
				slug: 'tours',
				name: 'Tours',
			};

			const result = applyDefaults(config);

			expect(result.name_singular).toBe('Tour');
		});

		it('should derive plural from singular', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				name_singular: 'Tour',
			};

			const result = applyDefaults(config);

			expect(result.name_plural).toBe('Tours');
		});

		it('should apply default CPT supports', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const result = applyDefaults(config);

			expect(result.cpt_supports).toContain('title');
			expect(result.cpt_supports).toContain('editor');
			expect(result.cpt_supports).toContain('thumbnail');
		});

		it('should apply default blocks', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const result = applyDefaults(config);

			expect(result.blocks).toContain('card');
			expect(result.blocks).toContain('collection');
		});

		it('should apply default templates', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const result = applyDefaults(config);

			expect(result.templates).toContain('single');
			expect(result.templates).toContain('archive');
		});
	});

	describe('buildCommand', () => {
		it('should output JSON config instructions', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
			};

			const command = buildCommand(config);

			expect(command).toContain('plugin-config.json');
			expect(command).toContain('generate-plugin.js');
		});
	});

	describe('getStageQuestions', () => {
		it('should return identity questions for stage 1', () => {
			const questions = getStageQuestions(1);

			expect(questions.some((q) => q.key === 'slug')).toBe(true);
			expect(questions.some((q) => q.key === 'name')).toBe(true);
			expect(questions.some((q) => q.key === 'name_singular')).toBe(true);
			expect(questions.some((q) => q.key === 'name_plural')).toBe(true);
		});

		it('should return CPT questions for stage 2', () => {
			const questions = getStageQuestions(2);

			expect(questions.some((q) => q.key === 'cpt_slug')).toBe(true);
			expect(questions.some((q) => q.key === 'cpt_supports')).toBe(true);
		});

		it('should have taxonomy stage', () => {
			const questions = getStageQuestions(3);
			expect(questions.some((q) => q.key === 'taxonomies')).toBe(true);
		});

		it('should have fields stage', () => {
			const questions = getStageQuestions(4);
			expect(questions.some((q) => q.key === 'fields')).toBe(true);
		});

		it('should have blocks stage', () => {
			const questions = getStageQuestions(5);
			expect(questions.some((q) => q.key === 'blocks')).toBe(true);
		});

		it('should have templates stage', () => {
			const questions = getStageQuestions(6);
			expect(questions.some((q) => q.key === 'templates')).toBe(true);
		});

		it('should have version stage', () => {
			const questions = getStageQuestions(7);
			expect(questions.some((q) => q.key === 'version')).toBe(true);
		});
	});

	describe('complex configuration', () => {
		it('should handle complete Tour Operator config', () => {
			const config = {
				slug: 'tour-operator',
				name: 'Tour Operator',
				name_singular: 'Tour',
				name_plural: 'Tours',
				description: 'A comprehensive tour management plugin',
				author: 'LightSpeed',
				author_uri: 'https://lsdev.biz',
				cpt_slug: 'tour',
				cpt_supports: [
					'title',
					'editor',
					'thumbnail',
					'excerpt',
					'revisions',
				],
				cpt_has_archive: true,
				cpt_public: true,
				cpt_menu_icon: 'dashicons-palmtree',
				taxonomies: [
					{
						slug: 'tour_type',
						singular: 'Tour Type',
						plural: 'Tour Types',
						hierarchical: true,
					},
					{
						slug: 'destination',
						singular: 'Destination',
						plural: 'Destinations',
						hierarchical: true,
					},
				],
				fields: [
					{ name: 'price', label: 'Price', type: 'number' },
					{ name: 'duration', label: 'Duration', type: 'text' },
					{ name: 'gallery', label: 'Gallery', type: 'gallery' },
					{
						name: 'related_tours',
						label: 'Related Tours',
						type: 'relationship',
					},
				],
				blocks: ['card', 'collection', 'slider', 'featured'],
				templates: ['single', 'archive'],
				version: '1.0.0',
				requires_wp: '6.0',
				requires_php: '8.0',
				license: 'GPL-2.0-or-later',
			};

			const result = validateConfig(config);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});
});
