---
title: Performance Monitoring
description: Performance monitoring tools and best practices
category: Development
type: Guide
audience: Developers
date: 2025-12-01
---

This plugin includes comprehensive performance monitoring tools to ensure optimal performance and user experience.

## Tools

### 1. Lighthouse CI

Lighthouse CI tests performance, accessibility, best practices, and SEO metrics.

**Configuration**: `.lighthouserc.js`

**Run locally**:

```bash
npm run lighthouse
```

**Metrics tracked**:

- Performance score (target: ≥90%)
- Accessibility score (target: ≥90%)
- Best practices score (target: ≥90%)
- SEO score (target: ≥90%)
- First Contentful Paint (FCP): ≤2000ms
- Largest Contentful Paint (LCP): ≤2500ms
- Cumulative Layout Shift (CLS): ≤0.1
- Total Blocking Time (TBT): ≤300ms

**Setup for local testing**:

1. Start WordPress environment: `npm run env:start`
2. Install the plugin in WordPress
3. Update test URLs in `.lighthouserc.js`
4. Run: `npm run lighthouse`

Reports are saved to `./lighthouse-reports/`

### 2. Bundle Size Monitoring

Tracks JavaScript and CSS bundle sizes to prevent bloat.

**Configuration**: `.size-limit.json`

**Run locally**:

```bash
npm run size-limit
```

**Size limits**:

- Block Editor Script: 50 KB (gzipped)
- Block Frontend Style: 10 KB (gzipped)
- Block Editor Style: 5 KB (gzipped)

The build will fail if any bundle exceeds its limit.

### 3. Webpack Bundle Analyzer

Visualizes bundle composition to identify optimization opportunities.

**Run locally**:

```bash
npm run analyze-bundle
```

Opens an interactive treemap showing:

- Module sizes
- Dependencies
- Duplicate code
- Optimization opportunities

### 4. Combined Performance Check

Run all performance tests:

```bash
npm run performance
```

## CI/CD Integration

Performance checks run automatically on:

- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches

**GitHub Actions workflow**: `.github/workflows/performance.yml`

### Jobs

1. **Lighthouse CI**: Tests Core Web Vitals and performance metrics
2. **Bundle Size Analysis**: Checks bundle sizes against limits
3. **Performance Budget Check**: Reports asset sizes in PR summaries

### Artifacts

Performance reports are uploaded as artifacts:

- `lighthouse-reports/`: Lighthouse HTML reports (30-day retention)
- `webpack-bundle-report.html`: Bundle analysis (30-day retention)

## Performance Budgets

### Resource Budgets

- Total scripts: ≤150 KB
- Total stylesheets: ≤50 KB
- Total resources: ≤500 KB

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: ≤2.5s
  - Measures loading performance
  - Should occur within the first 2.5 seconds of page load

- **FID (First Input Delay)**: ≤100ms
  - Measures interactivity
  - Pages should respond to user input within 100ms

- **CLS (Cumulative Layout Shift)**: ≤0.1
  - Measures visual stability
  - Pages should maintain visual stability during loading

## Optimization Tips

### JavaScript

1. Code splitting with dynamic imports
2. Tree shaking unused code
3. Minimize third-party dependencies
4. Use production builds

### CSS

1. Remove unused styles
2. Minimize specificity
3. Use modern CSS features (custom properties, grid)
4. Avoid large font files

### Images

1. Use appropriate formats (WebP, AVIF)
2. Optimize file sizes
3. Implement lazy loading
4. Use responsive images with srcset

### WordPress Specific

1. Enqueue scripts conditionally (only where needed)
2. Use WordPress script dependencies correctly
3. Leverage WordPress script loading strategies (defer, async)
4. Minimize render-blocking resources

## Troubleshooting

### Lighthouse CI fails locally

**Issue**: "Connection refused" or timeout errors

**Solution**:

1. Ensure WordPress is running: `npm run env:start`
2. Check the port (default: 8888)
3. Update URLs in `.lighthouserc.js` to match your environment

### Bundle size limits exceeded

**Issue**: `size-limit` fails during build

**Solution**:

1. Run bundle analyzer: `npm run analyze-bundle`
2. Identify large dependencies
3. Remove unused code or imports
4. Consider code splitting
5. If necessary, adjust limits in `.size-limit.json` (with justification)

### Performance regressions in CI

**Issue**: CI performance checks fail on PR

**Solution**:

1. Download Lighthouse reports from GitHub Actions artifacts
2. Compare metrics with previous runs
3. Identify specific regressions (scripts, styles, metrics)
4. Optimize or adjust budgets as needed

## Related Documentation

- **[README.md](./README.md)** - Documentation index

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Size Limit](https://github.com/ai/size-limit)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [WordPress Performance Best Practices](https://make.wordpress.org/core/handbook/testing/reporting-bugs/performance/)
