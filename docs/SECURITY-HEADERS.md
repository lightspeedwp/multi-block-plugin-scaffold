# Security Headers for WordPress Plugins

Harden your plugin by setting modern security headers at the server or via WordPress. Prefer server configuration for performance and global coverage; use WordPress only when you must scope headers or cannot change server config.

## Recommended Headers

- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains`
- **Content-Security-Policy (CSP):** Start strict and relax as needed; prefer nonces for scripts.
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** Disable unused APIs: `geolocation=(), camera=(), microphone=()`
- **X-Frame-Options / frame-ancestors:** `SAMEORIGIN` (or CSP `frame-ancestors 'self'`)
- **Cross-Origin-Opener-Policy:** `same-origin`
- **Cross-Origin-Resource-Policy:** `same-origin`

## Apache (httpd) example

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

## NGINX example

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

## WordPress-level headers (PHP)

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

Notes:

- Inline styles are common in WP; `'unsafe-inline'` for CSS may be necessary. Avoid for scripts — use nonces or hashes.
- Tighten CSP over time: list CDN domains you rely on (e.g., `https://cdn.example`) and remove `'unsafe-inline'` where feasible.
- Scope WordPress-level headers to frontend only if needed: wrap in `!is_admin()` checks.

## Verification

- Browser DevTools → Network → Response Headers
- CLI:

```bash
curl -I https://example.com/wp-content/plugins/your-plugin/
```

- External scanners: securityheaders.com, Mozilla Observatory, Lighthouse Best Practices.

## Rollout Tips

- Start on staging; monitor console errors.
- Log CSP violations with a `report-to`/`report-uri` endpoint during rollout.
- Document exceptions (third-party domains, iframes) and revisit periodically.
