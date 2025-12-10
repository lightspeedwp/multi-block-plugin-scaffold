# Block Style Variations

This directory can contain theme.json-like style fragments for use with `register_block_style()`.

## Overview

WordPress allows plugins to register block style variations using the `register_block_style()` function with a `style_data` parameter. This directory provides a place to store JSON files with style definitions.

## How It Works

Block style variations are registered in `inc/class-block-styles.php`:

```php
register_block_style(
    array( 'core/group', 'core/columns' ),
    array(
        'name'       => 'my-plugin-highlight',
        'label'      => __( 'Highlight Section', 'my-plugin' ),
        'style_data' => array(
            'color' => array(
                'background' => 'var:preset|color|contrast',
                'text'       => 'var:preset|color|base',
            ),
            'spacing' => array(
                'padding' => array(
                    'top'    => '2rem',
                    'bottom' => '2rem',
                ),
            ),
        ),
    )
);
```

## Using JSON Files (Optional)

You can optionally store style definitions in JSON files and load them:

### Example: `styles/section-highlight.json`

```json
{
    "version": 2,
    "styles": {
        "color": {
            "background": "var:preset|color|contrast",
            "text": "var:preset|color|base"
        },
        "spacing": {
            "padding": {
                "top": "2rem",
                "bottom": "2rem"
            }
        }
    }
}
```

### Loading JSON in PHP

```php
public function register_block_styles() {
    if ( ! function_exists( 'register_block_style' ) ) {
        return;
    }

    $styles_dir = EXAMPLE_PLUGIN_PLUGIN_DIR . 'styles/';
    $style_file = $styles_dir . 'section-highlight.json';

    if ( file_exists( $style_file ) ) {
        $style_json = json_decode( file_get_contents( $style_file ), true );

        if ( isset( $style_json['styles'] ) ) {
            register_block_style(
                array( 'core/group', 'core/columns' ),
                array(
                    'name'       => 'my-plugin-section-highlight',
                    'label'      => __( 'Section Highlight', 'my-plugin' ),
                    'style_data' => $style_json['styles'],
                )
            );
        }
    }
}
```

## Style Data Format

The `style_data` array follows the same structure as `theme.json`:

```php
array(
    'color' => array(
        'background' => 'var:preset|color|primary',
        'text'       => 'var:preset|color|contrast',
    ),
    'typography' => array(
        'fontSize'   => 'var:preset|font-size|large',
        'lineHeight' => '1.6',
    ),
    'spacing' => array(
        'padding' => array(
            'top'    => '1.5rem',
            'right'  => '1.5rem',
            'bottom' => '1.5rem',
            'left'   => '1.5rem',
        ),
    ),
    'border' => array(
        'radius' => '8px',
        'width'  => '1px',
        'color'  => 'var:preset|color|primary',
    ),
)
```

## References

- [Block Style Variations](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/)
- [Theme.json Styles Reference](https://developer.wordpress.org/themes/global-settings-and-styles/)
- [WP 6.6+ Style Data Parameter](https://make.wordpress.org/core/2024/06/18/introducing-style-variations-in-wordpress-6-6/)
