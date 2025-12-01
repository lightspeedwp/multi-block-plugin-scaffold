---
title: Webpack Configuration
description: Module bundler configuration and build pipeline
category: Configuration
type: Reference
audience: Developers
date: 2025-12-01
---

## Overview

Webpack is the module bundler that processes JavaScript, CSS, and assets. This plugin extends `@wordpress/scripts` webpack configuration with custom settings for internationalization, path aliases, SVG handling, and optimized bundling.

## Configuration File

Location: `webpack.config.cjs`

## WordPress Package Used

- `@wordpress/scripts` - ^31.0.0
- `@wordpress/babel-preset-default` - ^8.35.0
- `@wordpress/babel-plugin-makepot` - ^6.35.0

## Configuration

```javascript
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,

  entry: {
    index: path.resolve(process.cwd(), 'src', 'index.js'),
    '{{slug}}': path.resolve(process.cwd(), 'src', '{{slug}}', 'index.js'),
  },

  output: {
    filename: '[name].js',
    path: path.resolve(process.cwd(), 'build'),
  },

  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@blocks': path.resolve(process.cwd(), 'src', '{{slug}}'),
      '@utils': path.resolve(process.cwd(), 'src', 'utils'),
      '@components': path.resolve(process.cwd(), 'src', 'components'),
    },
  },

  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules.filter(
        (rule) => rule.test && !rule.test.toString().includes('\\.(j|t)sx?$')
      ),
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
              babelrc: false,
              configFile: false,
              presets: [
                require.resolve('@wordpress/babel-preset-default'),
              ],
              plugins: [
                [
                  require.resolve('@wordpress/babel-plugin-makepot'),
                  {
                    output: 'languages/{{slug}}-js.pot',
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
        issuer: /\.(js|jsx|ts|tsx)$/,
      },
    ],
  },

  optimization: {
    ...defaultConfig.optimization,
    splitChunks: {
      cacheGroups: {
        style: {
          name: 'style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        editor: {
          name: 'editor',
          test: /editor\.scss$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  performance: {
    ...defaultConfig.performance,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
};
```

## Key Configuration Sections

### Entry Points

```javascript
entry: {
  index: path.resolve(process.cwd(), 'src', 'index.js'),           // Main plugin entry
  '{{slug}}': path.resolve(process.cwd(), 'src', '{{slug}}', 'index.js'),  // Block entry
}
```

#### Purpose

- **index.js**: Main plugin registration and setup
- **{{slug}}/index.js**: Block definition, edit, and save components

### Output Configuration

```javascript
output: {
  filename: '[name].js',                    // Output filename pattern
  path: path.resolve(process.cwd(), 'build'), // Output directory
}
```

#### Output Structure

```
build/
├── index.js                 // Plugin main file
├── {{slug}}.js             // Block JavaScript
├── index.asset.php         // Dependencies for index
├── {{slug}}.asset.php      // Dependencies for block
└── style-index.css         // Block styles
```

### Path Aliases

```javascript
resolve: {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
    '@blocks': path.resolve(process.cwd(), 'src', '{{slug}}'),
    '@utils': path.resolve(process.cwd(), 'src', 'utils'),
    '@components': path.resolve(process.cwd(), 'src', 'components'),
  },
}
```

#### Usage in Code

```javascript
// Instead of relative paths
import Helper from '../../../utils/helper';

// Use aliases
import Helper from '@utils/helper';
import Edit from '@blocks/edit';
import Button from '@components/Button';
```

### Custom Babel Loader

```javascript
{
  test: /\.(j|t)sx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        cacheDirectory: true,  // Enable caching
        presets: [require.resolve('@wordpress/babel-preset-default')],
        plugins: [
          [
            require.resolve('@wordpress/babel-plugin-makepot'),
            { output: 'languages/plugin-slug-js.pot' },
          ],
        ],
      },
    },
  ],
}
```

#### Features

- Transpiles ES6+, JSX, and TypeScript
- Extracts translatable strings to `.pot` file
- Caching for faster builds
- Excludes node_modules for performance

### SVG Handling

```javascript
{
  test: /\.svg$/,
  use: ['@svgr/webpack', 'url-loader'],
  issuer: /\.(js|jsx|ts|tsx)$/,
}
```

#### Usage

```javascript
// Import SVG as React component
import { ReactComponent as Icon } from './icon.svg';

// Or as URL
import iconUrl from './icon.svg';

// Use in JSX
<Icon width="24" height="24" />
```

### Code Splitting

```javascript
optimization: {
  splitChunks: {
    cacheGroups: {
      style: {
        name: 'style',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      },
      editor: {
        name: 'editor',
        test: /editor\.scss$/,
        chunks: 'all',
        enforce: true,
      },
    },
  },
}
```

Separates frontend and editor styles automatically.

### Performance Budgets

```javascript
performance: {
  maxAssetSize: 512000,       // 512 KB max per file
  maxEntrypointSize: 512000,  // 512 KB max entry point
}
```

Warns if bundles exceed size limits.

## Available Scripts

```bash
# Development mode (watch + hot reload)
npm run start

# Production build (optimized)
npm run build

# Build plugin package
npm run plugin-zip
```

### Script Options

```bash
# Custom port for dev server
npm run start -- --port=3000

# Disable source maps
npm run build -- --devtool=false

# Webpack stats
npm run build -- --json > stats.json
```

## @wordpress/scripts Default Config

### Included Features

- **JavaScript**: Babel transpilation with WordPress preset
- **CSS/SCSS**: PostCSS processing, autoprefixer, minification
- **Assets**: Image and font handling
- **Source Maps**: Development debugging
- **Hot Reload**: Fast development feedback
- **Optimization**: Minification and tree-shaking
- **WordPress Integration**: Handles WordPress dependencies
- **Asset Files**: Generates `.asset.php` files with dependencies

## Customization

### Add Custom Entry Point

```javascript
entry: {
  ...defaultConfig.entry,
  admin: path.resolve(process.cwd(), 'src', 'admin.js'),
  frontend: path.resolve(process.cwd(), 'src', 'frontend.js'),
}
```

### Environment Variables

```javascript
const webpack = require('webpack');

module.exports = {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      'process.env.PLUGIN_VERSION': JSON.stringify('1.0.0'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
  ],
};
```

### External Libraries

Exclude libraries from bundle (use WordPress versions):

```javascript
externals: {
  ...defaultConfig.externals,
  jquery: 'jQuery',
  lodash: 'lodash',
  react: 'React',
  'react-dom': 'ReactDOM',
}
```

## Development Mode

### Features

- Source maps for debugging
- Hot module replacement
- Faster builds (no minification)
- Verbose error messages

## Production Mode

### Optimizations

- Minification (JavaScript and CSS)
- Tree shaking (remove unused code)
- Code splitting
- Asset optimization
- Source map generation
- `.asset.php` files with dependencies

### Bundle Analysis

```bash
# Generate stats file
npm run build -- --json > stats.json

# Use webpack-bundle-analyzer
npx webpack-bundle-analyzer stats.json
```

## WordPress Integration

### Enqueuing Block Assets

```php
// {{slug}}.php
function plugin_register_block() {
    register_block_type(
        __DIR__ . '/build/{{slug}}'
    );
}
add_action('init', 'plugin_register_block');
```

The `block.json` file handles asset enqueueing automatically:

```json
{
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

### Manual Enqueueing

```php
function plugin_enqueue_assets() {
    $asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

    wp_enqueue_script(
        'plugin-script',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );
}
add_action('enqueue_block_editor_assets', 'plugin_enqueue_assets');
```

## Performance Optimization

### Code Splitting

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
      },
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  },
}
```

### Lazy Loading

```javascript
// Import on demand
const Component = React.lazy(() => import('./Component'));

// With Suspense
<Suspense fallback={<Spinner />}>
  <Component />
</Suspense>
```

## Debugging

### Enable Verbose Output

```bash
npm run build -- --progress --verbose
```

### Source Maps

Development:

```javascript
devtool: 'eval-source-map' // Fast, detailed
```

Production:

```javascript
devtool: 'source-map' // Slower, accurate
```

## Common Issues

### Module Not Found

**Cause**: Incorrect path or missing alias

**Solution**: Check path aliases:

```javascript
resolve: {
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
}
```

### SVG Import Errors

**Cause**: Missing @svgr/webpack

**Solution**: Install package:

```bash
npm install --save-dev @svgr/webpack
```

### Slow Build Times

**Solutions**:

1. Enable caching:

```javascript
cacheDirectory: true
```

2. Exclude node_modules:

```javascript
{ test: /\.jsx?$/, exclude: /node_modules/ }
```

### Asset Path Issues

**Solution**: Check publicPath:

```javascript
output: {
  publicPath: '/wp-content/plugins/plugin-name/build/',
}
```

## Best Practices

1. **Extend WordPress Config**: Start with `@wordpress/scripts` defaults
2. **Use Path Aliases**: Simplify imports with `@` aliases
3. **Enable Code Splitting**: Separate vendor and app code
4. **Extract Translations**: Use makepot plugin for i18n
5. **Optimize Assets**: Handle SVGs with @svgr/webpack
6. **Cache Aggressively**: Enable caching for faster builds
7. **Monitor Bundle Size**: Use bundle analyzer regularly
8. **Source Maps**: Enable in development
9. **Tree Shaking**: Keep modules ES6 for better optimization
10. **Performance Budgets**: Set asset size limits

## Resources

- [Webpack Official Documentation](https://webpack.js.org/)
- [WordPress Scripts Package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Block Metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [@svgr/webpack](https://react-svgr.com/docs/webpack/)
