=== {{name}} ===
Contributors: {{contributors}}
Donate link: {{donate_url}}
Tags: {{tag1}}, {{tag2}}, {{tag3}}, {{tag4}}, {{tag5}}
Requires at least: {{requires_wp}}
Tested up to: {{tested_up_to}}
Stable tag: {{version}}
Requires PHP: {{requires_php}}
License: {{license}}
License URI: {{license_uri}}

{{short_description}}

== Description ==

{{description}}

= Key Features =

* **Modern Block Editor Integration** - Built with the latest WordPress block editor standards
* **Multiple Blocks** - Provides a suite of related blocks for comprehensive functionality
* **Customizable Design** - Flexible styling options to match your theme
* **Performance Optimized** - Lightweight and fast-loading
* **Accessibility Ready** - WCAG 2.1 Level AA compliant
* **Translation Ready** - Fully internationalized and ready for translation
* **Developer Friendly** - Clean, well-documented code following WordPress coding standards

= Use Cases =

{{use_case_1}}

{{use_case_2}}

{{use_case_3}}

= Block Features =

{{block_features}}

= Requirements =

* WordPress {{requires_wp}} or higher
* PHP {{requires_php}} or higher
* Modern browser with JavaScript enabled

=== {{name}} ===
Contributors: {{author}}
Donate link: https://github.com/{{author}}/{{plugin_slug}}/donate
Tags: blocks, gutenberg, {{plugin_slug}}, {{name}}
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

== Description ==

{{name}} is a multi-block plugin scaffold for WordPress. It provides a starting point for building custom blocks, patterns, and templates. All code is namespaced and uses mustache placeholders for code generation.

== Installation ==

1. Download the plugin ZIP from [GitHub](https://github.com/{{author}}/{{plugin_slug}}/releases).
2. Upload to your WordPress site via Plugins > Add New > Upload Plugin.
3. Activate the plugin.

== Frequently Asked Questions ==

= Where can I find documentation? =-

See [USAGE.md](https://github.com/{{author}}/{{plugin_slug}}/blob/main/USAGE.md) for usage instructions.

= How do I report a bug? =-

Open an issue at [GitHub Issues](https://github.com/{{author}}/{{plugin_slug}}/issues).

= How do I contribute? =-

See [CONTRIBUTING.md](https://github.com/{{author}}/{{plugin_slug}}/blob/main/CONTRIBUTING.md).

== Changelog ==

= 1.0.0 =-
* Initial release.
= Configuration =

The plugin works out of the box with default settings. You can customize the blocks' appearance and behavior using the block settings panel in the editor.

== Frequently Asked Questions ==

= Is this plugin free? =

Yes! {{name}} is completely free and open source under the {{license}} license.

= Does this work with any theme? =

Yes! The plugin is designed to work with any properly coded WordPress theme that supports the block editor.

= Can I use this with the Classic Editor? =

This plugin requires the block editor (Gutenberg). It will not work with the Classic Editor plugin.

= Is this plugin translation ready? =

Yes! The plugin is fully internationalized and ready for translation. Translation files can be added to the `/languages` directory.

= How do I customize the blocks' appearance? =

You can customize the blocks using:
1. The block settings panel in the editor sidebar
2. Theme.json settings in your theme
3. Custom CSS in your theme's stylesheet
4. Block styles and variations

= Does this plugin affect my site's performance? =

No! The plugin is lightweight and optimized for performance. It only loads necessary assets when the blocks are used.

= Where can I report bugs or request features? =

Please create an issue on our [GitHub repository]({{github_url}}/issues) or visit our [support forum]({{support_url}}).

= Can I contribute to this plugin? =

Absolutely! We welcome contributions. Please see our [contributing guidelines]({{github_url}}/blob/main/CONTRIBUTING.md).

= Is GDPR compliance required for this plugin? =

The plugin itself does not collect, process, or store any personal data, so no additional GDPR compliance measures are needed for the plugin itself. However, ensure your site's overall GDPR compliance based on your specific use case.

== Screenshots ==

1. Block in the editor - Shows the block interface in the WordPress block editor
2. Block settings panel - Configuration options available in the sidebar
3. Frontend display - How the block appears on your live site
4. Block variations - Different style options available
5. Multiple blocks - Example of using multiple instances together

== Changelog ==

= {{version}} =
Release Date: {{release_date}}

**New Features:**
* {{new_feature_1}}
* {{new_feature_2}}

**Improvements:**
* {{improvement_1}}
* {{improvement_2}}

**Bug Fixes:**
* {{bug_fix_1}}
* {{bug_fix_2}}

**Developer Notes:**
* {{dev_note_1}}
* {{dev_note_2}}

For detailed changelog history, see [CHANGELOG.md]({{github_url}}/blob/main/CHANGELOG.md)

== Upgrade Notice ==

= {{version}} =
{{upgrade_notice}}

== Additional Information ==

= Technical Details =

* **Block Names:** `{{namespace}}/{{block-slug-1}}`, `{{namespace}}/{{block-slug-2}}`
* **Block Category:** {{block_category}}
* **Supports:** {{block_supports}}
* **Text Domain:** {{textdomain}}
* **Domain Path:** /languages

= Links =

* [Plugin Homepage]({{plugin_uri}})
* [Documentation]({{docs_url}})
* [GitHub Repository]({{github_url}})
* [Support Forum]({{support_url}})
* [Changelog]({{github_url}}/blob/main/CHANGELOG.md)
* [Report Issue]({{github_url}}/issues)

= Credits =

Developed and maintained by [{{author}}]({{author_uri}}).

Special thanks to all [contributors]({{github_url}}/graphs/contributors).

== Development ==

= Building from Source =

```bash
# Install dependencies
npm install
composer install

# Start development
npm run start

# Build for production
npm run build

# Run tests
npm run test
composer run test

# Create distribution ZIP
npm run plugin-zip
```

= Developer Hooks =

**Filters:**

* `{{namespace}}_block_attributes` - Modify block attributes
* `{{namespace}}_block_output` - Filter block output HTML
* `{{namespace}}_block_settings` - Modify block settings

**Actions:**

* `{{namespace}}_before_block_render` - Fires before block renders
* `{{namespace}}_after_block_render` - Fires after block renders
* `{{namespace}}_enqueue_assets` - Hook for custom asset enqueuing

For full API documentation, visit our [developer documentation]({{docs_url}}/developers).

= Testing =

We maintain comprehensive test coverage:

* **PHP Tests:** PHPUnit for PHP code
* **JavaScript Tests:** Jest for JavaScript/React code
* **E2E Tests:** Playwright for end-to-end testing
* **Code Quality:** PHPCS, ESLint, and Stylelint

= Browser Compatibility =

* Chrome (latest 2 versions)
* Firefox (latest 2 versions)
* Safari (latest 2 versions)
* Edge (latest 2 versions)

= Accessibility =

This plugin aims to meet WCAG 2.1 Level AA standards. If you encounter any accessibility issues, please [report them]({{github_url}}/issues).
