# Plugin Block Templates

This directory contains **plugin-registered block templates** using WordPress 6.7+ `register_block_template()` API.

## Important: Plugin vs Theme Templates

**This is a plugin**, not a block theme. Templates here are registered via PHP, not automatically loaded like theme templates.

- **Theme templates**: Automatically discovered from `themes/{theme}/templates/`
- **Plugin templates**: Must be registered via `register_block_template()` in PHP

## How It Works

Templates in this directory are registered by `inc/class-block-templates.php`:

```php
register_block_template(
    'example-plugin//example-archive',
    array(
        'title'       => __( 'Example Archive', 'example-plugin' ),
        'description' => __( 'Archive template registered by plugin', 'example-plugin' ),
        'post_types'  => array( 'post' ),
        'content'     => file_get_contents( $template_file ),
    )
);
```

## File Format

Templates are HTML files containing block markup:

```html
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:heading {"level":1} -->
    <h1>Archive Title</h1>
    <!-- /wp:heading -->

    <!-- wp:post-template -->
        <!-- wp:post-title {"isLink":true} /-->
    <!-- /wp:post-template -->
</div>
<!-- /wp:group -->
```

## Adding New Templates

1. Create an `.html` file in this directory with block markup
2. Register it in `inc/class-block-templates.php` using `register_block_template()`
3. Specify the template slug, title, and which post types it applies to

## References

- [WordPress 6.7+ Template Registration](https://make.wordpress.org/core/2024/10/01/plugin-template-registration/)
- [Block Template Format](https://developer.wordpress.org/themes/templates/)
