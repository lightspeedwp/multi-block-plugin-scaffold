# Nonce Verification Utilities

This scaffold includes generic nonce helpers in `inc/nonce.php` with the `lswp_` prefix.

- **`lswp_nonce_action($suffix)`**: Builds a namespaced nonce action like `single-block-plugin:frontend`.
- **`lswp_create_nonce($action)`**: Creates a nonce for the given action.
- **`lswp_verify_request_nonce($action, $param)`**: Verifies `_wpnonce` from `GET`/`POST`.
- **`lswp_verify_rest_nonce($request, $action)`**: Verifies `X-WP-Nonce` for REST requests.

Example AJAX handler (already registered) uses `{{slug}}_example` and checks the `frontend` nonce.

To load utilities in your plugin:

```php
// In your plugin bootstrap.
require_once __DIR__ . '/inc/nonce.php';
```

For REST, enqueue `wpApiSettings` or add inline script exposing `X-WP-Nonce` via `wp_create_nonce('wp_rest')`.
