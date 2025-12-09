---
title: Security Guide
description: Security best practices including headers, nonces, and request validation
category: Development
type: Guide
audience: Developers
date: 2025-12-07
---

# Security Guide

Comprehensive security documentation for the {{name}} multi-block plugin scaffold, covering security headers, nonce verification, and secure request handling.

## Overview

This guide covers:

- **Security Headers** - HTTP headers for hardening your plugin
- **Nonce Verification** - CSRF protection and request validation utilities
- **Best Practices** - Secure coding patterns and validation strategies

For testing security, see [TESTING.md](./TESTING.md).
For code quality standards, see [LINTING.md](./LINTING.md).

---

## Security Headers

Harden your plugin by setting modern security headers at the server or via WordPress. Prefer server configuration for performance and global coverage; use WordPress only when you must scope headers or cannot change server config.

### Recommended Headers

- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains`
- **Content-Security-Policy (CSP):** Start strict and relax as needed; prefer nonces for scripts.
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** Disable unused APIs: `geolocation=(), camera=(), microphone=()`
- **X-Frame-Options / frame-ancestors:** `SAMEORIGIN` (or CSP `frame-ancestors 'self'`)
- **Cross-Origin-Opener-Policy:** `same-origin`
- **Cross-Origin-Resource-Policy:** `same-origin`

### Apache (httpd) Configuration

```apacheconf
<IfModule mod_headers.c>
  # Only on HTTPS
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS

  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), camera=(), microphone=()"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Cross-Origin-Opener-Policy "same-origin"
  Header set Cross-Origin-Resource-Policy "same-origin"

  # Baseline CSP — adjust for your plugin assets and third-parties
  Header set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:"
</IfModule>
```

### NGINX Configuration

```nginx
# Add to server/location blocks
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
# Baseline CSP — adjust for your plugin assets and third-parties
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:" always;
```

### WordPress PHP Headers

Use when you must scope headers or cannot modify the server. Test thoroughly.

```php
add_action('send_headers', function () {
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: geolocation=(), camera=(), microphone=()');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Resource-Policy: same-origin');

    // Optional CSP with nonce (advanced):
    // Generate a per-request nonce and attach to enqueued <script> tags.
    $nonce = base64_encode(random_bytes(18));
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$nonce'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:");

    add_filter('script_loader_tag', function ($tag, $handle, $src) use ($nonce) {
        // Inject nonce attribute into script tag.
        return str_replace('<script ', '<script nonce="' . esc_attr($nonce) . '" ', $tag);
    }, 10, 3);
});
```

### Header Implementation Notes

- Inline styles are common in WordPress; `'unsafe-inline'` for CSS may be necessary. Avoid for scripts — use nonces or hashes.
- Tighten CSP over time: list CDN domains you rely on (e.g., `https://cdn.example`) and remove `'unsafe-inline'` where feasible.
- Scope WordPress-level headers to frontend only if needed: wrap in `!is_admin()` checks.

### Verification

**Browser DevTools:**

- Open DevTools → Network tab
- Click on any request
- Check Response Headers section

**Command Line:**

```bash
curl -I https://example.com/wp-content/plugins/your-plugin/
```

**External Tools:**

- [Security Headers (securityheaders.com)](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Lighthouse Best Practices](https://developers.google.com/web/tools/lighthouse)

### Rollout Tips

- Start on staging environment and monitor console errors
- Log CSP violations with a `report-to` or `report-uri` endpoint during rollout
- Document exceptions for third-party domains and iframes
- Revisit and tighten security settings periodically

---

## Nonce Verification

Nonces are cryptographic tokens used to prevent Cross-Site Request Forgery (CSRF) attacks. This scaffold includes generic nonce utilities with the `lswp_` prefix.

### Nonce Utilities

The scaffold includes generic nonce helpers in `inc/nonce.php`:

- **`lswp_nonce_action($suffix)`**: Builds a namespaced nonce action like `{{slug}}:frontend`
- **`lswp_create_nonce($action)`**: Creates a nonce for the given action
- **`lswp_verify_request_nonce($action, $param)`**: Verifies `_wpnonce` from `GET`/`POST`
- **`lswp_verify_rest_nonce($request, $action)`**: Verifies `X-WP-Nonce` for REST requests

### Loading Nonce Utilities

```php
// In your plugin bootstrap
require_once __DIR__ . '/inc/nonce.php';
```

### Nonce Usage Examples

#### AJAX Request with Nonce

```javascript
// enqueue-scripts.js - Enqueue the nonce for frontend use
wp.hooks.addAction('enqueueScripts.complete', 'myPlugin', () => {
    const nonce = document.querySelector('meta[name="{{slug}}-nonce"]')?.content;
    window.{{slug}}_nonce = nonce;
});

// components/MyComponent.js - Use nonce in AJAX
async function handleClick() {
    const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: '{{slug}}_example',
            _wpnonce: window.{{slug}}_nonce,
            data: JSON.stringify({ /* ... */ }),
        }),
    });

    const result = await response.json();
    console.log(result);
}
```

#### Server-Side Nonce Verification

```php
// inc/class-ajax-handlers.php
add_action('wp_ajax_{{slug}}_example', function() {
    // Verify nonce using utility function
    if (!lswp_verify_request_nonce('frontend', '_wpnonce')) {
        wp_send_json_error('Nonce verification failed', 403);
    }

    // Process the request
    $data = isset($_POST['data']) ? json_decode(stripslashes($_POST['data']), true) : [];

    // Your logic here
    wp_send_json_success(['message' => 'Success']);
});
```

#### Output Nonce in Template

```php
// In your theme or plugin template
<?php
// Create and output the nonce
$nonce = lswp_create_nonce('frontend');
?>
<meta name="{{slug}}-nonce" content="<?php echo esc_attr($nonce); ?>">
```

### REST API Nonce Verification

```php
// Verify REST request nonce
add_rest_api_init(function() {
    register_rest_route('{{slug}}/v1', '/example', array(
        'methods'             => 'POST',
        'callback'            => function($request) {
            if (!lswp_verify_rest_nonce($request, 'edit_posts')) {
                return new WP_Error('nonce_failed', 'Nonce verification failed', ['status' => 403]);
            }

            // Process REST request
            return rest_ensure_response(['success' => true]);
        },
        'permission_callback' => '__return_true',
    ));
});
```

For REST, enqueue `wpApiSettings` or add inline script exposing `X-WP-Nonce` via `wp_create_nonce('wp_rest')`.

---

## Secure Request Validation

### Input Validation

Always validate and sanitize user input:

```php
// Text input
$user_text = isset($_POST['user_text']) ? sanitize_text_field($_POST['user_text']) : '';

// HTML content
$user_html = isset($_POST['content']) ? wp_kses_post($_POST['content']) : '';

// Email
$email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';

// URL
$url = isset($_POST['url']) ? esc_url_raw($_POST['url']) : '';

// Integer
$count = isset($_POST['count']) ? absint($_POST['count']) : 0;
```

### Output Escaping

Always escape output:

```php
// Text
echo esc_html($text);

// Attribute
echo esc_attr($attribute);

// URL
echo esc_url($url);

// JavaScript
echo esc_js($javascript_string);

// HTML (careful with this)
echo wp_kses_post($html_content);
```

### Capability Checks

Always verify user capabilities:

```php
// Check if user can edit posts
if (!current_user_can('edit_posts')) {
    wp_die('You do not have permission to do this.');
}

// Check if user is logged in
if (!is_user_logged_in()) {
    wp_die('You must be logged in to do this.');
}
```

---

## Related Documentation

- **[README.md](./README.md)** - Documentation index

## WordPress Security Resources

- [WordPress Security Handbook](https://developer.wordpress.org/plugins/security/)
- [Data Validation](https://developer.wordpress.org/plugins/security/data-validation/)
- [Data Sanitization](https://developer.wordpress.org/plugins/security/sanitizing-input/)
- [Escaping Output](https://developer.wordpress.org/plugins/security/escaping-output/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Security Best Practices Checklist

- ✅ All user input is validated and sanitized
- ✅ All output is properly escaped
- ✅ Nonces are used for form submissions and AJAX
- ✅ User capabilities are checked before sensitive operations
- ✅ Security headers are configured
- ✅ Sensitive data is not logged in plain text
- ✅ Dependencies are kept up-to-date
- ✅ Code follows OWASP security guidelines
- ✅ Database queries use prepared statements
- ✅ File uploads are validated and restricted
