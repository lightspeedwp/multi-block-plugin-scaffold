# Generate Plugin – Scaffold Review & Alignment Task List

## 0. Global Rules (Non-Negotiable)

* This repository is a **scaffold**:

  * **Do not remove or hard-code any `{{mustache}}` values**
  * You **may introduce new mustache values** if required
  * All changes must propagate consistently across:

    * agents
    * instructions
    * prompts
    * documentation
* Prefer **WordPress core APIs** first.
* Use **Secure Custom Fields (SCF)** only where core APIs are insufficient.
* All PHP, JS, CSS, HTML, and Markdown **must pass linting** aligned with WordPress standards.
* Every class and JS file **must include PHPDoc / JSDoc**.

---

## 1. Review `docs/` Folder

### Tasks

* Review all files under `docs/`
* Validate:

  * Accuracy
  * Alignment with current scaffold structure
  * Consistency with instructions and agents
* Expand documentation where:

  * Mustache placeholders are introduced but not explained
  * Workflow expectations are unclear
* Ensure `docs/GENERATE-PLUGIN.md`:

  * Reflects the **current agent-driven workflow**
  * References SCF + WordPress Core appropriately
  * Mentions JSON-based SCF configuration preference

---

## 2. Review & Correct Instruction Files

### 2.1 WordPress Coding Standards (WPCS)

#### Tasks

* Review and validate all instruction files against official standards:

  * [https://developer.wordpress.org/coding-standards/](https://developer.wordpress.org/coding-standards/)
* Follow all linked sub-standards:

  * PHP
  * JavaScript
  * CSS
  * HTML
  * PHPDoc
  * JSDoc
  * Accessibility

#### Files to Audit & Fix

* `.github/instructions/wpcs-accessibility.instructions.md`
* `.github/instructions/wpcs-css.instructions.md`
* `.github/instructions/wpcs-html.instructions.md`
* `.github/instructions/wpcs-javascript.instructions.md`
* `.github/instructions/wpcs-js-docs.instructions.md`
* `.github/instructions/wpcs-php-docs.instructions.md`
* `.github/instructions/wpcs-php.instructions.md`

#### Acceptance Criteria

* No contradictions between files
* Each file links to:

  * The relevant developer.wordpress.org page
* Examples follow:

  * Real WordPress core patterns
  * Correct escaping, sanitisation, naming, and hooks

---

### 2.2 Markdown Style Guide

#### Tasks

* Expand `.github/instructions/markdown.instructions.md` into a **full Markdown standard**
* Include:

  * Heading hierarchy rules
  * Code fence rules (language + indentation)
  * List spacing rules
  * Line-length guidance
  * Linting expectations (markdownlint-style)
* Apply rules consistently across **all `.md` files**

---

## 3. Secure Custom Fields (SCF) Alignment

### Tasks

* Review:

  * `.github/instructions/scf-fields.instructions.md`
  * `.github/instructions/scaffold-extensions.instructions.md`
  * `.github/instructions/generate-plugin.instructions.md`
  * `.github/prompts/generate-plugin.prompt.md`
  * `.github/agents/generate-plugin.agent.md`
* Ensure:

  * SCF is positioned as **secondary to core APIs**
  * JSON-based SCF configuration is the **preferred approach**
  * SCF documentation links are explicit and accurate
* Update docs to explain:

  * How SCF JSON is loaded
  * Where JSON files live
  * How validation works

---

## 4. Review All `inc/class-*` Files

### Prerequisite Reading

* [https://developer.wordpress.org/plugins/plugin-basics/](https://developer.wordpress.org/plugins/plugin-basics/)
* [https://developer.wordpress.org/plugins/plugin-basics/header-requirements/](https://developer.wordpress.org/plugins/plugin-basics/header-requirements/)
* [https://developer.wordpress.org/plugins/plugin-basics/determining-plugin-and-content-directories/](https://developer.wordpress.org/plugins/plugin-basics/determining-plugin-and-content-directories/)
* [https://developer.wordpress.org/plugins/plugin-basics/best-practices/](https://developer.wordpress.org/plugins/plugin-basics/best-practices/)
* [https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/](https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/)

### Tasks

* Review **every file in `inc/`**
* Start with:

  * `inc/class-core.php`

    * Ensure all classes are included
    * Ensure loading order is logical
* Validate:

  * Plugin header values
  * Constants
  * Directory resolution
  * Activation / deactivation hooks
* Add missing includes where required

---

## 5. Custom Post Types (CPTs)

### Tasks

* Review:

  * `inc/class-post-types.php`
* Compare:

  * Core CPT registration
    [https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/](https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/)
  * SCF CPT registration
    [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-post-type.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-post-type.md)
* Decide and document:

  * When CPTs should use **core APIs**
  * When SCF is justified
* Ensure:

  * Slugs are scaffolded (`{{cpt_slug}}`)
  * Labels are internationalised
  * Capabilities and supports are explicit

---

## 6. Custom Options / Settings

### Tasks

* Review:

  * `inc/class-options.php`
* Read:

  * [https://developer.wordpress.org/plugins/settings/custom-settings-page/](https://developer.wordpress.org/plugins/settings/custom-settings-page/)
  * [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-options-page.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-options-page.md)
* Add:

  * One example setting
  * Fully scaffolded with mustache values
* Prefer:

  * Core Settings API
  * SCF only for complex UIs

---

## 7. Custom Taxonomies

### Tasks

* Review:

  * `inc/class-taxonomies.php`
* Compare:

  * Core taxonomy registration (document and implement)
  * SCF taxonomy approach
    [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-taxonomy.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-taxonomy.md)
* Document decision logic:

  * Core vs SCF

---

## 8. Custom Fields (SCF-First via JSON)

### Tasks

* Review:

  * `inc/class-fields.php`
* Read:

  * [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-field.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-field.md)
  * [https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference)
* Ensure:

  * All fields are JSON-driven
  * No browser-only configuration is required
* Update docs to explain:

  * JSON structure
  * Local loading
  * Validation

---

### 8.1 SCF JSON Handling

#### Tasks

* Review:

  * `inc/class-scf-json.php`
  * `inc/class-scf-json-validator.php`
* Read:

  * [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/local-json-file.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/local-json-file.md)
  * [https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/fields-file.md](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/fields-file.md)
* Ensure:

  * Validation errors are explicit
  * JSON schema expectations are documented

---

### 8.2 Repeater Fields

#### Tasks

* Review:

  * `inc/class-repeater-fields.php`
* Validate against:

  * [https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference/fields](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference/fields)

---

## 9. Meta Boxes

### Tasks

* Read:

  * [https://developer.wordpress.org/block-editor/how-to-guides/metabox/](https://developer.wordpress.org/block-editor/how-to-guides/metabox/)
  * [https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/](https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/)
* Prefer:

  * Block-editor-native approaches
* Decide:

  * Whether to introduce `inc/class-meta-boxes.php`
* If yes:

  * Create the class
  * Add example meta boxes
  * Use mustache placeholders
  * Prefer core APIs; SCF only if needed

---

## 10. Documentation Standards

### Tasks

* Add **PHPDoc** to:

  * All PHP classes and methods
* Add **JSDoc** to:

  * All JavaScript files
* Ensure:

  * Types
  * Params
  * Returns
  * Hooks are documented

---

## 11. Blocks

### Tasks

* Review:

  * [https://developer.wordpress.org/block-editor/getting-started/fundamentals/](https://developer.wordpress.org/block-editor/getting-started/fundamentals/)
* Validate:

  * Block folder structure
  * `block.json` usage
  * Registration patterns

---

### 11.1 Post Type Collection Blocks

#### Tasks

* Review:

  * `src/blocks/{{slug}}-collection`
* Rename scaffold usage:

  * Prefer `{{cpt_slug}}` over `{{slug}}`
* Review:

  * [https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/)
  * [https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/)

---

### 11.2 Post Template / Card Blocks

#### Tasks

* Review:

  * `src/blocks/{{slug}}-card`
* Introduce:

  * Template part for Post Template block
* Create:

  * 2 patterns scoped specifically to that template

---

## 12. Block Bindings

### Tasks

* Review:

  * `inc/class-block-bindings.php`
* Read:

  * [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/)
* Ensure:

  * Bindings align with templates, template parts, and patterns

---

## 13. Block Styles

### Tasks

* Review:

  * `inc/class-block-styles.php`
* Change behaviour:

  * Register styles from `styles/*.json`
  * Do not embed styles in PHP
* Create folder structure:

  * `styles/blocks/`
  * `styles/sections/`
  * `styles/typography/`
  * `styles/colors/`
  * `styles/presets/`
* Ensure styles:

  * Relate directly to plugin blocks and patterns

---

## 14. Patterns

### Tasks

* Review:

  * `inc/class-patterns.php`
* Read:

  * [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
* Update all patterns in `patterns/` to:

  * Match the provided example structure
  * Retain all mustache placeholders
  * Register correct metadata (`postTypes`, `blockTypes`, etc.)

---

## 15. Template Parts & Templates

### Tasks

* Review:

  * `template-parts/*.html`
  * `templates/*.html`
* Validate:

  * Patterns are used correctly
  * Templates are registered via `inc/class-block-templates.php`
* Read:

  * [https://developer.wordpress.org/block-editor/reference-guides/block-api/block-templates/](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-templates/)

---

## 16. Final Instruction Review

### Tasks

* Re-audit:

  * `.github/instructions/*.instructions.md`
* Ensure:

  * No contradictions
  * Clear links to:

    * developer.wordpress.org
    * Secure Custom Fields GitHub docs
* Instructions must:

  * Be scaffold-safe
  * Be actionable by an agent
  * Reflect best practices only

---

If you want, next step I can:

* Convert this into a **machine-optimised agent prompt**
* Split it into **phased execution checkpoints**
* Or generate **acceptance criteria per file** for CI-style validation
