# Block Plugin Scaffolding – Instructions for Copilot

These instructions describe how to extend the **multi-block plugin scaffold** in this repository so that a generated plugin has **placeholders** for:

- Block templates (via the plugin template API)
- Block bindings
- Block patterns (already mostly scaffolded, just clarify usage)
- Plugin-scoped styles (block style variations / section styles)

> ⚠️ Important
> This is a **plugin**, not a block theme. Only themes get automatic theme.json + `templates/` + `parts/` handling. For plugins we must register things explicitly via WordPress APIs and/or filters.

The repository uses mustache-style placeholders like `{{namespace}}`, `{{slug}}`, `{{textdomain}}`, `{{name}}`. Do **not** hard-code values; keep the placeholders so the scaffold remains reusable.

---

## 1. Conventions to follow

1. **Namespaces and class location**

   - Follow the pattern used in `inc/class-patterns.php`:
     - Namespace: `{{namespace|lowerCase}}\classes`
     - Guard: `if ( ! defined( 'ABSPATH' ) ) { exit; }`
   - New classes go into `inc/` and are named:

     - `class Block_Templates`
     - `class Block_Bindings`
     - `class Block_Styles`

2. **Plugin dir constant**

   - Reuse the constant already used in `class-patterns.php`:
     - `{{namespace|upper}}_PLUGIN_DIR`
   - Use this constant when resolving plugin-relative directories (e.g. `templates/`, `styles/`).

3. **Hooking**

   - Follow the “instance class + constructor hooks” pattern from `class-patterns.php`:
     - Add actions in `__construct()`, e.g.:

       ```php
       public function __construct() {
           add_action( 'init', array( $this, 'register_block_templates' ) );
       }
       ```

   - The plugin bootstrap file is responsible for doing `new \{{namespace|lowerCase}}\classes\Block_Templates();` etc.

---

## 2. Block templates scaffolding (plugin-side)

### 2.1. Files & structure

1. Create a new class file:

   - `inc/class-block-templates.php`

2. Create a templates directory and README:

   - `templates/`
   - `templates/README.md` explaining that these files are **plugin-registered templates** (not theme templates) and are consumed via `register_block_template()`.

3. Add at least one **example template** file:

   - `templates/example-archive.html`
   - Content should be simple block markup, e.g. a group with a heading and post-template.

### 2.2. Class implementation

In `inc/class-block-templates.php`:

- Add the namespace + guard.
- Define `Block_Templates` with:

```php
<?php
namespace {{namespace|lowerCase}}\classes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Plugin block templates registration.
 */
class Block_Templates {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_block_templates' ) );
    }

    /**
     * Register plugin block templates via the WP 6.7+ API.
     *
     * @return void
     */
    public function register_block_templates() {
        if ( ! function_exists( 'register_block_template' ) ) {
            return; // Pre-6.7: no-op.
        }

        $templates_dir = {{namespace|upper}}_PLUGIN_DIR . 'templates/';

        $template_file = $templates_dir . 'example-archive.html';

        if ( file_exists( $template_file ) ) {
            register_block_template(
                '{{slug}}//example-archive',
                array(
                    'title'       => __( '{{name}} Example Archive', '{{textdomain}}' ),
                    'description' => __( 'Example archive template registered by the plugin.', '{{textdomain}}' ),
                    'post_types'  => array( 'post' ),
                    'content'     => file_get_contents( $template_file ),
                )
            );
        }
    }
}
```


Notes:

* Don’t add template parts here – there’s no clean plugin API yet. We just support **full templates** as placeholders.
* Keep this implementation minimal and commented so users can extend it.

### **2.3. Template parts placeholder**

Add a directory for future template parts:

* `template-parts/README.md` with a short explanation:

  * Template parts are still primarily a theme concern.
  * Plugin authors can either ship them as patterns or let themes provide actual `wp_template_part` files.
  * This dir exists as a **documentation placeholder**, not something the scaffold wires up.

No PHP registration code is required yet; just document the limitation.

---

## **3\. Block bindings scaffolding**

### **3.1. Files**

Create:

* `inc/class-block-bindings.php`

### **3.2. Class implementation**

Implement a single example binding source for “post meta” values.

```php
<?php
namespace {{namespace|lowerCase}}\classes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Block bindings registration.
 */
class Block_Bindings {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_sources' ) );
    }

    /**
     * Register bindings sources.
     *
     * @return void
     */
    public function register_sources() {
        if ( ! function_exists( 'register_block_bindings_source' ) ) {
            return;
        }

        register_block_bindings_source(
            '{{slug}}/post-meta',
            array(
                'label'              => __( '{{name}} Post Meta', '{{textdomain}}' ),
                'get_value_callback' => array( $this, 'get_post_meta_value' ),
                'uses_context'       => array( 'postId' ),
            )
        );
    }

    /**
     * Example binding: fetch a scalar post meta value.
     *
     * @param array $args    Binding arguments (expects 'key').
     * @param array $context Binding context (expects 'postId').
     * @return string|null
     */
    public function get_post_meta_value( $args, $context ) {
        if ( empty( $args['key'] ) || empty( $context['postId'] ) ) {
            return null;
        }

        $meta = get_post_meta( (int) $context['postId'], $args['key'], true );

        if ( is_scalar( $meta ) ) {
            return (string) $meta;
        }

        return null;
    }
}
```

Document in comments how this source can be used from `block.json` via the `metadata.bindings` property.

---

## **4\. Block patterns (confirm & lightly document)**

Patterns are already scaffolded via:

* `inc/class-patterns.php`
* `patterns/*.php`

Tasks:

1. **Leave the existing registration logic intact**, just ensure:

   * The constructor hooks into `'init'` (it already does).
   * `$patterns_dir` uses `{{namespace|upper}}_PLUGIN_DIR . 'patterns/'`.



2. In `patterns/README.md`, add a short section clarifying:

   * Patterns are **plugin-registered** using `register_block_pattern()` from each PHP file.

   * `class-patterns.php` is responsible for:

     * Registering the plugin’s pattern category: slug `{{slug}}`.
     * Loading all PHP files in `patterns/` on `init`.

No major code changes are needed; just ensure the doc explains how to add new patterns.

---

## **5. Styles / section styles scaffolding**

### **5.1. Files**

Create:

* `inc/class-block-styles.php`
* `styles/README.md`
* Optionally: `styles/section-highlight.json` as an example JSON “partial”.

### **5.2. Class implementation**

`inc/class-block-styles.php` should register at least one **block style variation** (section-style-like) for core blocks.

```php
<?php
namespace {{namespace|lowerCase}}\classes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Block style variations (including section-style like presets).
 */
class Block_Styles {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_block_styles' ) );
    }

    /**
     * Register block style variations.
     *
     * @return void
     */
    public function register_block_styles() {
        if ( ! function_exists( 'register_block_style' ) ) {
            return;
        }

        // Minimal example: section-like highlight for groups and columns.
        register_block_style(
            array( 'core/group', 'core/columns' ),
            array(
                'name'       => '{{slug}}-section-highlight',
                'label'      => __( '{{name}} Section Highlight', '{{textdomain}}' ),
                'style_data' => array(
                    'color' => array(
                        'background' => 'var:preset|color|contrast',
                        'text'       => 'var:preset|color|base',
                    ),
                ),
            )
        );
    }
}
```

### **5.3. Optional JSON-based style\_data**

In `styles/README.md`:

* Explain that plugin authors can store theme.json-shaped fragments in `styles/*.json` and load them in `Block_Styles::register_block_styles()` via `wp_read_json_file()` (if present).

* Provide a brief example snippet (in the README) that shows:

  * Reading a JSON file.
  * Extracting `$json['styles']`.
  * Passing that array as the `style_data` argument to `register_block_style()`.

Do **not** implement the JSON loading in the class by default – keep it as a commented-out example or documented pattern so the scaffold remains lightweight.

---

## **6\. Wiring everything in the main plugin file**

Locate the **main plugin bootstrap file** (the one with the plugin header that currently wires up `{{namespace|lowerCase}}\classes\Patterns`).

Add instantiations for the new classes, for example:

```php
// Existing:
new \{{namespace|lowerCase}}\classes\Patterns();

// New:
new \{{namespace|lowerCase}}\classes\Block_Templates();
new \{{namespace|lowerCase}}\classes\Block_Bindings();
new \{{namespace|lowerCase}}\classes\Block_Styles();
```

Ensure these are only instantiated once and that the `inc/*.php` files are already being loaded (e.g. via a simple autoloader or `require_once`).

---

## **7\. Quick sanity checks**

After implementation, the generated plugin for a real project should:

1. **Patterns**

   * Show a new pattern category `{{name}}` in the block inserter.
   * Provide at least one example pattern.



2. **Block styles**

   * Show the `{{name}} Section Highlight` style under core/group & core/columns.



3. **Block bindings**

   * Show `{{name}} Post Meta` as a binding source in the block bindings UI (when available).
   * Correctly pull meta values for a test block using the binding.



4. **Templates**

   * In a WP 6.7+ site, show an “Example Archive” template in the editor’s template list, registered by the plugin.

Do not include any production opinions; keep everything clearly marked as example / placeholder / scaffold in docblocks and README files.
