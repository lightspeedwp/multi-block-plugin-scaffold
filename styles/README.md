# Block Style Variations

Optional block style variations registered by the plugin (via `inc/class-block-styles.php`). Useful for surfacing predefined visual treatments without shipping a full theme.

## Flow

```mermaid
flowchart LR
    Styles[styles/*.json (optional)] --> PHP[inc/class-block-styles.php]
    PHP --> Register[register_block_style]
    Register --> Editor[Block Editor style picker]

    classDef node fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    class Styles,PHP,Register,Editor node;
```

## Current state

- Placeholder directory only; no JSON style fragments are tracked yet.
- Registration logic exists in `inc/class-block-styles.php` and can consume inline arrays or JSON loaded from this directory.

## Adding a style variation

1. Create a JSON fragment (e.g. `section-highlight.json`) following the `theme.json` style structure.
2. Load and register it in `inc/class-block-styles.php` using `register_block_style()` with the `style_data` parameter.
3. Keep namespaced style names (e.g. `{{slug}}-section-highlight`).
4. Test in the block editor and document the new style here.

## References

- [Block Style Variations](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/)
- [Theme.json Styles Reference](https://developer.wordpress.org/themes/global-settings-and-styles/)
