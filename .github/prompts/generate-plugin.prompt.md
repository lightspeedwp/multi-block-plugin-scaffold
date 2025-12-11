---
description: Interactive WordPress multi-block plugin generator with CPT, taxonomies, and SCF fields - comprehensive project setup
---

# Generate New Multi-Block Plugin

I'll help you generate a new WordPress multi-block plugin with custom post types, taxonomies, and Secure Custom Fields integration. This is a comprehensive scaffold for complex WordPress applications.

## 🔍 Step 1: Repository Context Detection

**First, I need to understand your setup:**

Are you running this generator:

1. **In the `lightspeedwp/multi-block-plugin-scaffold` repository?**
   - If YES → The plugin will be generated in `generated-plugins/<slug>/` folder (excluded from git)
   - This folder is for testing and development only
   - You'll manually move the generated plugin to where you need it
   - Use **Generator Mode** (default)

2. **In a NEW repository (created from the scaffold template)?**
   - If YES → The generator will replace all mustache variables IN-PLACE in your current repository
   - This will transform the scaffold INTO your actual plugin
   - This action modifies your repository permanently
   - Use **Template Mode** (`--in-place` flag)

**Please indicate which scenario applies to you before we proceed.**

---

## 📋 Step 2: Configuration File Check

**Do you have a plugin configuration file?**

### ✅ YES - I Have a Config File

If you have a `plugin-config.json` file (or similar), I'll help you validate and use it:

1. **Provide the file path** to your configuration file
2. **I will validate it** against the schema (`.github/schemas/plugin-config.schema.json`)
3. **Review validation results:**
   - ✅ If valid → Ask if you want to override any values → Generate plugin
   - ❌ If invalid → Show errors → Offer to fix or use wizard

**Would you like to override any configuration values?**
- If YES → I'll ask which values you want to change
- If NO → I'll generate using your config file as-is

**Example validation workflow:**
```bash
# Step 1: Validate your config
node scripts/generate-plugin.js --validate plugin-config.json

# Step 2: Generate (if validation passed)
node scripts/generate-plugin.js --config plugin-config.json

# Step 3: (Template mode only) Add --in-place flag
node scripts/generate-plugin.js --config plugin-config.json --in-place
```

**Example configuration file structure:**
```json
{
  "slug": "tour-operator",
  "name": "Tour Operator",
  "description": "A comprehensive tour booking and display plugin",
  "author": "LightSpeed",
  "author_uri": "https://developer.lsdev.biz",
  "version": "1.0.0",
  "name_singular": "Tour",
  "name_plural": "Tours",
  "cpt_slug": "tour",
  "cpt_icon": "dashicons-palmtree",
  "cpt_supports": ["title", "editor", "thumbnail", "custom-fields"],
  "cpt_has_archive": true,
  "taxonomies": [
    {
      "slug": "destination",
      "singular": "Destination",
      "plural": "Destinations",
      "hierarchical": true
    }
  ],
  "fields": [
    {
      "name": "price",
      "label": "Price",
      "type": "number"
    }
  ]
}
```

**See complete example:** `.github/schemas/examples/plugin-config.example.json`

**See schema reference:** `.github/schemas/plugin-config.schema.json`

---

### ❌ NO - I Don't Have a Config File

No problem! I'll guide you through creating your plugin configuration using one of these wizards:

#### Option A: Simple Wizard (Recommended for Most Users)
- Asks **only required** questions
- Uses **smart defaults** for optional values
- **Faster** and easier to complete
- Best for standard use cases

#### Option B: Advanced Wizard (Complete Configuration)
- Asks about **all 100+ mustache variables**
- Full control over every aspect
- Takes longer but offers maximum customization
- Best for complex or highly customized plugins

**Which wizard would you prefer?**
- Type **"simple"** for Simple Wizard
- Type **"advanced"** for Advanced Wizard

---

## 🧙 Interactive Wizard: Information Gathering

*(This section applies when using the Simple or Advanced Wizard)*

This scaffold requires detailed planning due to its complexity. I'll gather information in multiple stages to ensure your plugin is properly configured.

**Wizard Types:**
- **Simple Wizard**: Covers Stages 1-5 with smart defaults
- **Advanced Wizard**: Covers all stages + additional variables (100+ total)

---

## Stage 1: Plugin Identity (Required)

**Please answer these questions:**

1. **Plugin Name** (display name, e.g., "Tour Operator")
   - What would you like to call your plugin?

2. **Plugin Slug** (URL-safe, lowercase, hyphens only, e.g., "tour-operator")
   - This will be used for the namespace, file names, and function prefixes

3. **Description** (one or two sentences)
   - What does this plugin do?

4. **Author/Organisation Name**
   - Who is creating this plugin?

5. **Author URI** (website URL)
   - Your website or organisation URL

---

## Stage 2: Custom Post Type Configuration

This is where we define your main content type:

1. **Post Type Name (Singular)** (e.g., "Tour", "Property", "Product")
   - What is one item called?

2. **Post Type Name (Plural)** (e.g., "Tours", "Properties", "Products")
   - What are multiple items called?

3. **Post Type Icon** (dashicon, e.g., "dashicons-palmtree")
   - What icon represents this content type?

4. **Post Type Supports** (select all that apply):
   - [ ] Title
   - [ ] Editor (block editor content)
   - [ ] Thumbnail (featured image)
   - [ ] Excerpt
   - [ ] Author
   - [ ] Custom Fields
   - [ ] Revisions
   - [ ] Page Attributes (hierarchy)

5. **Has Archive?** (yes/no)
   - Should there be an archive page for this post type?

6. **Hierarchical?** (yes/no)
   - Can items have parent/child relationships (like pages)?

---

## Stage 3: Taxonomy Configuration

Define how content will be categorised:

1. **Primary Taxonomy Name (Singular)** (e.g., "Destination", "Region", "Category")
   - What is one category called?

2. **Primary Taxonomy Name (Plural)** (e.g., "Destinations", "Regions", "Categories")
   - What are multiple categories called?

3. **Taxonomy Type**:
   - Hierarchical (like categories - parent/child)
   - Non-hierarchical (like tags - flat list)

4. **Additional Taxonomies** (optional, comma-separated)
   - Do you need more taxonomies? (e.g., "Travel Style, Duration, Price Range")

---

## Stage 4: Custom Fields (SCF/ACF)

Define the custom data fields for your post type:

1. **Basic Fields** (common field types):
   - Text fields (e.g., subtitle, short_description)
   - Number fields (e.g., price, duration, capacity)
   - Boolean/Toggle fields (e.g., featured, available)
   - URL fields (e.g., booking_link, video_url)
   - Email fields (e.g., contact_email)

2. **Media Fields**:
   - Gallery (multiple images)
   - File upload
   - oEmbed (video embeds)

3. **Relationship Fields**:
   - Related posts (e.g., related_tours)
   - User selection (e.g., tour_guide)
   - Taxonomy selection

4. **Repeater Fields** (for repeating content groups):
   - Itinerary items (day, title, description, image)
   - Pricing tiers (name, price, features)
   - FAQ items (question, answer)
   - Features/amenities list

5. **Flexible Content** (optional, for variable layouts):
   - Content sections (text, gallery, video, cta)

---

## Stage 5: Blocks to Generate

Which blocks should be created?

1. **Card Block** (`{{slug}}-card`)
   - Displays a single post in card format
   - Used in grids and collections

2. **Collection Block** (`{{slug}}-collection`)
   - Query-based post grid/list
   - Similar to WooCommerce Product Collection
   - Filtering by taxonomy, featured, etc.

3. **Slider Block** (`{{slug}}-slider`)
   - Carousel/slider display
   - Uses repeater field data

4. **Single Block** (`{{slug}}-single`)
   - Full single post display
   - Block bindings for custom fields

5. **Featured Block** (`{{slug}}-featured`)
   - Highlighted/featured posts display

**Select which blocks to include** (default: all)

---

## Stage 6: Additional Features (Optional)

1. **Block Templates**
   - Single post template
   - Archive template
   - Would you like custom templates?

2. **Block Patterns**
   - Archive grid pattern
   - Featured section pattern
   - Card layout pattern
   - Would you like patterns?

3. **REST API Extensions**
   - Custom endpoints for your post type
   - Needed for headless/decoupled use?

4. **Options Page**
   - Global settings for your plugin
   - API keys, defaults, configurations

---

## Stage 7: Version & Compatibility

1. **Version** (default: 1.0.0)
2. **Minimum WordPress** (default: 6.5 - required for Block Bindings)
3. **Tested WordPress** (default: 6.7)
4. **Minimum PHP** (default: 8.0)

---

## 🚀 Let's Begin!

**First, answer these two questions:**

1. **Repository Context**: Are you in the scaffold repo or a new repo?
   - Type **"scaffold"** for Generator Mode (creates `generated-plugins/<slug>/`)
   - Type **"new"** for Template Mode (modifies current directory with `--in-place`)

2. **Configuration File**: Do you have a plugin-config.json file?
   - Type **"yes"** and provide the file path
   - Type **"no"** to use the wizard

---

**If using the wizard, provide your answers for Stage 1:**

1. Plugin Name:
2. Plugin Slug:
3. Description:
4. Author Name:
5. Author URI:

*Reply with your answers, and I'll walk you through each stage.*

---

## Example: Tour Operator Plugin

Here's a complete example showing all stages:

### Stage 1: Identity
```
Plugin Name:    Tour Operator
Plugin Slug:    tour-operator
Description:    A comprehensive tour booking and display plugin for travel websites
Author:         LightSpeed
Author URI:     https://developer.lsdev.biz
```

### Stage 2: Post Type
```
Singular:       Tour
Plural:         Tours
Icon:           dashicons-palmtree
Supports:       title, editor, thumbnail, excerpt, custom-fields, revisions
Has Archive:    yes
Hierarchical:   no
```

### Stage 3: Taxonomies
```
Primary:        Destination / Destinations (hierarchical)
Additional:     Travel Style (non-hierarchical), Duration (non-hierarchical)
```

### Stage 4: Custom Fields
```
Basic Fields:
  - subtitle (text)
  - price (number)
  - duration_days (number)
  - group_size (number)
  - featured (boolean)
  - booking_url (url)
  - difficulty (select: easy, moderate, challenging)

Media Fields:
  - gallery (gallery)
  - video_url (oembed)

Relationship Fields:
  - related_tours (relationship)
  - destinations (taxonomy)

Repeater Fields:
  - itinerary (repeater)
    - day_number (number)
    - title (text)
    - description (wysiwyg)
    - accommodation (text)
    - meals_included (checkbox)

  - included_items (repeater)
    - item (text)
    - icon (select)

  - price_options (repeater)
    - name (text)
    - price (number)
    - description (textarea)
```

### Stage 5: Blocks
```
[x] tour-operator-card
[x] tour-operator-collection
[x] tour-operator-slider
[x] tour-operator-single
[x] tour-operator-featured
```

### Stage 6: Additional
```
[x] Block templates (single-tour.html, archive-tour.html)
[x] Block patterns (archive grid, featured section)
[x] REST API extensions
[x] Options page (API settings, defaults)
```

---

## Post-Generation Steps

After generating, I'll help you:

1. **Review the generated file structure**
2. **Configure SCF field groups** in `scf-json/`
3. **Customise block.json** for each block
4. **Set up block templates** in `templates/`
5. **Create initial patterns** in `patterns/`
6. **Install dependencies** (`composer install && npm install`)
7. **Start development** (`npm run start`)

---

## Dependencies

This scaffold requires:
- WordPress 6.5+ (for Block Bindings API and Plugin Dependencies)
- Secure Custom Fields plugin
- PHP 8.0+
- Node.js 18+

The plugin will automatically declare SCF as a dependency using the WordPress 6.5+ `Requires Plugins` header.

---

## Related Resources

- [Plugin Generator Agent](../agents/generate-plugin.agent.md)
- [Plugin Generator Instructions](../instructions/generate-plugin.instructions.md)
- [SCF Fields Reference](../instructions/scf-fields.instructions.md)
