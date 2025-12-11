---
description: Secure Custom Fields (SCF) field types reference and best practices
applyTo:
  - "**/inc/**/*.php"
  - "**/scf-json/**/*.json"
version: 1.0
lastUpdated: 2025-12-11
---

# Secure Custom Fields (SCF) Field Types Reference

You are a Secure Custom Fields integration assistant. Follow our SCF usage patterns to model fields, dependencies, and rendering for multi-block plugins. Avoid hard-coding values, bypassing dependency declarations, or mixing SCF logic into unrelated templates.

## Overview

Use this reference when adding or updating SCF field groups, field usage, or dependencies. It covers field types, naming, and dependency management. It does not replace SCF or ACF core documentation.

## General Rules

- Declare SCF as a plugin dependency; never assume it is globally present.
- Keep field keys and namespaced slugs unique and consistent.
- Store JSON definitions under `scf-json/`; avoid embedding configuration in PHP templates.
- Escape and sanitise values on output; validate inputs on save.
- Keep UI text translatable and aligned with plugin text domain.

## Detailed Guidance

This document provides a comprehensive reference for all Secure Custom Fields (SCF) field types, including usage examples and best practices.

## Overview

Secure Custom Fields is the WordPress fork of Advanced Custom Fields (ACF), providing a robust API for creating custom fields in WordPress. All ACF functions and filters work identically in SCF.

## Plugin Dependency

WordPress 6.5+ supports Plugin Dependencies. Declare SCF as a dependency:

```php
/**
 * Plugin Name: My Plugin
 * Requires Plugins: secure-custom-fields
 */
```

Always include defensive coding:

```php
if ( ! function_exists( 'acf_add_local_field_group' ) ) {
    return;
}
```

---

## Basic Fields

### Text Field

Single line text input.

```php
array(
    'key'         => 'field_example_text',
    'label'       => 'Text Field',
    'name'        => 'example_text',
    'type'        => 'text',
    'placeholder' => 'Enter text...',
    'maxlength'   => 100,
    'prepend'     => '',
    'append'      => '',
)
```

**Retrieve value:**

```php
$value = get_field( 'example_text' );
echo esc_html( $value );
```

### Textarea Field

Multi-line text input.

```php
array(
    'key'       => 'field_example_textarea',
    'label'     => 'Description',
    'name'      => 'example_textarea',
    'type'      => 'textarea',
    'rows'      => 4,
    'maxlength' => 500,
    'new_lines' => 'wpautop', // wpautop, br, or empty
)
```

### Number Field

Numeric input with optional min/max/step.

```php
array(
    'key'     => 'field_example_number',
    'label'   => 'Quantity',
    'name'    => 'example_number',
    'type'    => 'number',
    'min'     => 1,
    'max'     => 100,
    'step'    => 1,
    'prepend' => '',
    'append'  => 'items',
)
```

### Range Field

Slider input for numeric values.

```php
array(
    'key'     => 'field_example_range',
    'label'   => 'Volume',
    'name'    => 'example_range',
    'type'    => 'range',
    'min'     => 0,
    'max'     => 100,
    'step'    => 5,
    'prepend' => '',
    'append'  => '%',
)
```

### Email Field

Email input with validation.

```php
array(
    'key'         => 'field_example_email',
    'label'       => 'Email Address',
    'name'        => 'example_email',
    'type'        => 'email',
    'placeholder' => 'email@example.com',
)
```

### URL Field

URL input with validation.

```php
array(
    'key'         => 'field_example_url',
    'label'       => 'Website',
    'name'        => 'example_url',
    'type'        => 'url',
    'placeholder' => 'https://example.com',
)
```

### Password Field

Masked password input.

```php
array(
    'key'   => 'field_example_password',
    'label' => 'API Key',
    'name'  => 'example_password',
    'type'  => 'password',
)
```

---

## Content Fields

### WYSIWYG Editor

Rich text editor with TinyMCE.

```php
array(
    'key'          => 'field_example_wysiwyg',
    'label'        => 'Content',
    'name'         => 'example_wysiwyg',
    'type'         => 'wysiwyg',
    'tabs'         => 'all',     // all, visual, text
    'toolbar'      => 'full',    // full, basic
    'media_upload' => 1,
)
```

**Retrieve and display:**

```php
$content = get_field( 'example_wysiwyg' );
echo wp_kses_post( $content );
```

### oEmbed Field

Embed videos, tweets, and other oEmbed content.

```php
array(
    'key'    => 'field_example_oembed',
    'label'  => 'Video URL',
    'name'   => 'example_oembed',
    'type'   => 'oembed',
    'width'  => '',
    'height' => '',
)
```

---

## Media Fields

### Image Field

Image upload/selection.

```php
array(
    'key'           => 'field_example_image',
    'label'         => 'Featured Image',
    'name'          => 'example_image',
    'type'          => 'image',
    'return_format' => 'array',  // array, url, id
    'preview_size'  => 'medium',
    'library'       => 'all',    // all, uploadedTo
    'min_width'     => '',
    'min_height'    => '',
    'max_width'     => '',
    'max_height'    => '',
    'mime_types'    => 'jpg, jpeg, png, gif, webp',
)
```

**Retrieve and display:**

```php
$image = get_field( 'example_image' );
if ( $image ) {
    echo wp_get_attachment_image( $image['ID'], 'large' );
}
```

### File Field

File upload/selection.

```php
array(
    'key'           => 'field_example_file',
    'label'         => 'Document',
    'name'          => 'example_file',
    'type'          => 'file',
    'return_format' => 'array',  // array, url, id
    'library'       => 'all',
    'mime_types'    => 'pdf, doc, docx',
)
```

### Gallery Field

Multiple image selection.

```php
array(
    'key'           => 'field_example_gallery',
    'label'         => 'Photo Gallery',
    'name'          => 'example_gallery',
    'type'          => 'gallery',
    'return_format' => 'array',
    'preview_size'  => 'thumbnail',
    'library'       => 'all',
    'min'           => 0,
    'max'           => 20,
)
```

**Loop through gallery:**

```php
$images = get_field( 'example_gallery' );
if ( $images ) {
    foreach ( $images as $image ) {
        echo wp_get_attachment_image( $image['ID'], 'medium' );
    }
}
```

---

## Choice Fields

### Select Field

Dropdown selection.

```php
array(
    'key'           => 'field_example_select',
    'label'         => 'Category',
    'name'          => 'example_select',
    'type'          => 'select',
    'choices'       => array(
        'option_1' => 'Option One',
        'option_2' => 'Option Two',
        'option_3' => 'Option Three',
    ),
    'default_value' => 'option_1',
    'allow_null'    => 0,
    'multiple'      => 0,
    'ui'            => 1,        // Enable Select2
    'ajax'          => 0,
    'return_format' => 'value',  // value, label, array
)
```

### Checkbox Field

Multiple selection checkboxes.

```php
array(
    'key'           => 'field_example_checkbox',
    'label'         => 'Features',
    'name'          => 'example_checkbox',
    'type'          => 'checkbox',
    'choices'       => array(
        'wifi'    => 'WiFi',
        'parking' => 'Parking',
        'pool'    => 'Swimming Pool',
    ),
    'layout'        => 'horizontal',  // vertical, horizontal
    'toggle'        => 0,             // Toggle all option
    'return_format' => 'value',
)
```

### Radio Button Field

Single selection radio buttons.

```php
array(
    'key'           => 'field_example_radio',
    'label'         => 'Size',
    'name'          => 'example_radio',
    'type'          => 'radio',
    'choices'       => array(
        'small'  => 'Small',
        'medium' => 'Medium',
        'large'  => 'Large',
    ),
    'default_value' => 'medium',
    'layout'        => 'horizontal',
    'return_format' => 'value',
)
```

### Button Group Field

Styled button selection.

```php
array(
    'key'           => 'field_example_button_group',
    'label'         => 'Alignment',
    'name'          => 'example_button_group',
    'type'          => 'button_group',
    'choices'       => array(
        'left'   => 'Left',
        'center' => 'Centre',
        'right'  => 'Right',
    ),
    'default_value' => 'center',
    'layout'        => 'horizontal',
    'return_format' => 'value',
)
```

### True/False Field

Boolean toggle.

```php
array(
    'key'           => 'field_example_true_false',
    'label'         => 'Featured',
    'name'          => 'example_true_false',
    'type'          => 'true_false',
    'default_value' => 0,
    'ui'            => 1,
    'ui_on_text'    => 'Yes',
    'ui_off_text'   => 'No',
)
```

---

## Relational Fields

### Link Field

Internal/external link with title and target.

```php
array(
    'key'           => 'field_example_link',
    'label'         => 'Call to Action',
    'name'          => 'example_link',
    'type'          => 'link',
    'return_format' => 'array',
)
```

**Display link:**

```php
$link = get_field( 'example_link' );
if ( $link ) {
    printf(
        '<a href="%s" target="%s">%s</a>',
        esc_url( $link['url'] ),
        esc_attr( $link['target'] ),
        esc_html( $link['title'] )
    );
}
```

### Post Object Field

Select posts/pages/custom post types.

```php
array(
    'key'           => 'field_example_post_object',
    'label'         => 'Related Post',
    'name'          => 'example_post_object',
    'type'          => 'post_object',
    'post_type'     => array( 'post', 'page' ),
    'taxonomy'      => array(),
    'allow_null'    => 1,
    'multiple'      => 0,
    'return_format' => 'object',  // object, id
    'ui'            => 1,
)
```

### Page Link Field

Select pages and return URL.

```php
array(
    'key'        => 'field_example_page_link',
    'label'      => 'Link to Page',
    'name'       => 'example_page_link',
    'type'       => 'page_link',
    'post_type'  => array( 'page' ),
    'allow_null' => 1,
    'multiple'   => 0,
)
```

### Relationship Field

Select multiple related posts.

```php
array(
    'key'           => 'field_example_relationship',
    'label'         => 'Related Posts',
    'name'          => 'example_relationship',
    'type'          => 'relationship',
    'post_type'     => array( 'post' ),
    'filters'       => array( 'search', 'post_type', 'taxonomy' ),
    'elements'      => array( 'featured_image' ),
    'min'           => 0,
    'max'           => 5,
    'return_format' => 'object',
)
```

**Loop through related posts:**

```php
$posts = get_field( 'example_relationship' );
if ( $posts ) {
    foreach ( $posts as $post ) {
        setup_postdata( $post );
        echo '<h3>' . esc_html( get_the_title() ) . '</h3>';
    }
    wp_reset_postdata();
}
```

### Taxonomy Field

Select taxonomy terms.

```php
array(
    'key'           => 'field_example_taxonomy',
    'label'         => 'Categories',
    'name'          => 'example_taxonomy',
    'type'          => 'taxonomy',
    'taxonomy'      => 'category',
    'field_type'    => 'multi_select',  // checkbox, multi_select, radio, select
    'add_term'      => 1,
    'save_terms'    => 0,
    'load_terms'    => 0,
    'return_format' => 'id',  // id, object
)
```

### User Field

Select WordPress users.

```php
array(
    'key'           => 'field_example_user',
    'label'         => 'Author',
    'name'          => 'example_user',
    'type'          => 'user',
    'role'          => array(),  // Empty for all roles
    'allow_null'    => 1,
    'multiple'      => 0,
    'return_format' => 'array',  // array, id, object
)
```

---

## Date/Time Fields

### Date Picker

Calendar date selection.

```php
array(
    'key'            => 'field_example_date_picker',
    'label'          => 'Event Date',
    'name'           => 'example_date_picker',
    'type'           => 'date_picker',
    'display_format' => 'd/m/Y',
    'return_format'  => 'Y-m-d',
    'first_day'      => 1,  // 0=Sunday, 1=Monday
)
```

### Date Time Picker

Date and time selection.

```php
array(
    'key'            => 'field_example_datetime',
    'label'          => 'Event Start',
    'name'           => 'example_datetime',
    'type'           => 'date_time_picker',
    'display_format' => 'd/m/Y H:i',
    'return_format'  => 'Y-m-d H:i:s',
    'first_day'      => 1,
)
```

### Time Picker

Time-only selection.

```php
array(
    'key'            => 'field_example_time',
    'label'          => 'Opening Time',
    'name'           => 'example_time',
    'type'           => 'time_picker',
    'display_format' => 'H:i',
    'return_format'  => 'H:i:s',
)
```

### Color Picker

Colour selection with hex output.

```php
array(
    'key'           => 'field_example_color',
    'label'         => 'Brand Colour',
    'name'          => 'example_color',
    'type'          => 'color_picker',
    'default_value' => '#0073aa',
)
```

---

## Layout Fields

### Message Field

Display information to editors (no data saved).

```php
array(
    'key'       => 'field_example_message',
    'label'     => '',
    'name'      => '',
    'type'      => 'message',
    'message'   => 'This section contains settings for the homepage.',
    'new_lines' => 'wpautop',
    'esc_html'  => 0,
)
```

### Tab Field

Organise fields into tabs.

```php
array(
    'key'       => 'field_example_tab',
    'label'     => 'General',
    'name'      => '',
    'type'      => 'tab',
    'placement' => 'top',  // top, left
    'endpoint'  => 0,
)
```

### Accordion Field

Collapsible field groups.

```php
// Start accordion
array(
    'key'          => 'field_example_accordion_start',
    'label'        => 'Advanced Settings',
    'name'         => '',
    'type'         => 'accordion',
    'open'         => 0,
    'multi_expand' => 0,
    'endpoint'     => 0,
)

// Fields go here...

// End accordion
array(
    'key'          => 'field_example_accordion_end',
    'label'        => '',
    'name'         => '',
    'type'         => 'accordion',
    'endpoint'     => 1,
)
```

### Group Field

Group related fields together.

```php
array(
    'key'        => 'field_example_group',
    'label'      => 'Address',
    'name'       => 'example_group',
    'type'       => 'group',
    'layout'     => 'block',  // block, table, row
    'sub_fields' => array(
        array(
            'key'   => 'field_group_street',
            'label' => 'Street',
            'name'  => 'street',
            'type'  => 'text',
        ),
        array(
            'key'   => 'field_group_city',
            'label' => 'City',
            'name'  => 'city',
            'type'  => 'text',
        ),
        array(
            'key'   => 'field_group_postcode',
            'label' => 'Postcode',
            'name'  => 'postcode',
            'type'  => 'text',
        ),
    ),
)
```

**Access group values:**

```php
$address = get_field( 'example_group' );
echo esc_html( $address['street'] );
echo esc_html( $address['city'] );
echo esc_html( $address['postcode'] );
```

---

## Advanced Fields

### Repeater Field

Repeatable set of sub-fields.

```php
array(
    'key'          => 'field_example_repeater',
    'label'        => 'Features',
    'name'         => 'example_repeater',
    'type'         => 'repeater',
    'layout'       => 'table',  // table, block, row
    'button_label' => 'Add Feature',
    'min'          => 0,
    'max'          => 10,
    'collapsed'    => '',  // Sub-field key to show as title
    'sub_fields'   => array(
        array(
            'key'   => 'field_repeater_icon',
            'label' => 'Icon',
            'name'  => 'icon',
            'type'  => 'image',
        ),
        array(
            'key'   => 'field_repeater_title',
            'label' => 'Title',
            'name'  => 'title',
            'type'  => 'text',
        ),
        array(
            'key'   => 'field_repeater_description',
            'label' => 'Description',
            'name'  => 'description',
            'type'  => 'textarea',
        ),
    ),
)
```

**Loop through repeater:**

```php
if ( have_rows( 'example_repeater' ) ) {
    while ( have_rows( 'example_repeater' ) ) {
        the_row();
        $icon        = get_sub_field( 'icon' );
        $title       = get_sub_field( 'title' );
        $description = get_sub_field( 'description' );
        // Output fields...
    }
}
```

### Flexible Content Field

Dynamic layout builder with multiple layout types.

```php
array(
    'key'          => 'field_example_flexible',
    'label'        => 'Page Sections',
    'name'         => 'example_flexible',
    'type'         => 'flexible_content',
    'button_label' => 'Add Section',
    'min'          => 0,
    'max'          => 20,
    'layouts'      => array(
        array(
            'key'        => 'layout_hero',
            'name'       => 'hero',
            'label'      => 'Hero Section',
            'display'    => 'block',
            'sub_fields' => array(
                array(
                    'key'   => 'field_hero_title',
                    'label' => 'Title',
                    'name'  => 'title',
                    'type'  => 'text',
                ),
                array(
                    'key'   => 'field_hero_image',
                    'label' => 'Background',
                    'name'  => 'image',
                    'type'  => 'image',
                ),
            ),
        ),
        array(
            'key'        => 'layout_content',
            'name'       => 'content',
            'label'      => 'Content Block',
            'display'    => 'block',
            'sub_fields' => array(
                array(
                    'key'   => 'field_content_text',
                    'label' => 'Content',
                    'name'  => 'text',
                    'type'  => 'wysiwyg',
                ),
            ),
        ),
    ),
)
```

**Loop through flexible content:**

```php
if ( have_rows( 'example_flexible' ) ) {
    while ( have_rows( 'example_flexible' ) ) {
        the_row();

        switch ( get_row_layout() ) {
            case 'hero':
                $title = get_sub_field( 'title' );
                $image = get_sub_field( 'image' );
                // Output hero section...
                break;

            case 'content':
                $text = get_sub_field( 'text' );
                // Output content block...
                break;
        }
    }
}
```

### Clone Field

Clone fields or groups from other field groups.

```php
array(
    'key'          => 'field_example_clone',
    'label'        => 'Cloned Fields',
    'name'         => 'example_clone',
    'type'         => 'clone',
    'clone'        => array( 'group_example', 'field_example_text' ),
    'display'      => 'seamless',  // seamless, group
    'prefix_label' => 0,
    'prefix_name'  => 0,
)
```

---

## Options Pages

Retrieve values from options pages:

```php
$logo = get_field( 'site_logo', 'option' );
```

---

## Validation

### Custom Validation

```php
add_filter( 'acf/validate_value/name=example_email', function( $valid, $value, $field, $input ) {
    if ( ! $valid ) {
        return $valid;
    }

    if ( ! is_email( $value ) ) {
        $valid = 'Please enter a valid email address.';
    }

    return $valid;
}, 10, 4 );
```

---

## Conditional Logic

```php
array(
    'key'   => 'field_conditional_example',
    'label' => 'Show When Featured',
    'name'  => 'conditional_example',
    'type'  => 'text',
    'conditional_logic' => array(
        array(
            array(
                'field'    => 'field_example_true_false',
                'operator' => '==',
                'value'    => '1',
            ),
        ),
    ),
)
```

---

## Best Practices

1. **Unique Keys**: Always prefix field keys with your plugin/theme slug
2. **Defensive Coding**: Check for SCF functions before using them
3. **Escape Output**: Always escape field values when outputting
4. **Return Formats**: Choose appropriate return formats for your use case
5. **Instructions**: Provide clear instructions for content editors
6. **Field Organisation**: Use tabs/accordions to organise complex field groups
7. **Validation**: Add validation for required and formatted fields
8. **Performance**: Use specific post types in location rules

---

## Examples

- JSON definition: `scf-json/group_{{slug}}_hero.json` with prefixed field keys.
- Rendering: `the_field( 'tour_duration', $post_id );` wrapped with escaping and defaults.
- Dependency declaration: add SCF to plugin header `Requires Plugins: secure-custom-fields`.

## Validation

- Run `php -l` on SCF integration files in `inc/`.
- Confirm JSON sync by reloading field groups in SCF admin; ensure no missing keys.
- Verify output with automated or manual tests to ensure escaping and defaults work.

## External resources

- [SCF GitHub Repository](https://github.com/WordPress/secure-custom-fields)
- [SCF API Reference](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/code-reference/api/index.md)
- [SCF Field Types](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/field-types)
- [WordPress Plugin Dependencies](https://make.wordpress.org/core/2024/03/05/introducing-plugin-dependencies-in-wordpress-6-5/)

## References

- [generate-plugin.instructions.md](./generate-plugin.instructions.md)
- [schema-files.instructions.md](./schema-files.instructions.md)
- [instructions.instructions.md](./instructions.instructions.md)
- [_index.instructions.md](./_index.instructions.md)
