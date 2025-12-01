# PostCSS Configuration

## Overview

PostCSS processes CSS with JavaScript plugins for optimization and browser compatibility. This plugin uses PostCSS through `@wordpress/scripts` for autoprefixing and minification.

## Configuration File

Location: `.postcss.config.cjs`

## Configuration

PostCSS is configured with autoprefixer and cssnano for optimization.

## WordPress Packages Used

- `@wordpress/postcss-plugins-preset` - ^5.35.0
- `@wordpress/browserslist-config` - Browser support targets

## Default Configuration

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
```

## Features

### Autoprefixer

Adds vendor prefixes automatically based on browser support:

```css
/* Input */
.block {
  display: flex;
  user-select: none;
}

/* Output */
.block {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

### CSS Optimization (cssnano)

Minifies and optimizes CSS:

- Removes comments and whitespace
- Merges similar rules
- Minifies colors and values
- Removes duplicate rules
- Optimizes calc() expressions

## Browser Support

Uses `@wordpress/browserslist-config`:

```
last 2 versions
>= 0.2%
not dead
IE 11
Safari >= 12
iOS >= 12
Android >= 4.4
```

## Webpack Integration

PostCSS is automatically integrated in webpack via `@wordpress/scripts`:

```javascript
{
  test: /\.s?css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader', // PostCSS processes here
    'sass-loader',
  ],
}
```

## Custom Configuration

### Create postcss.config.js

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-nesting'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    }),
  ],
};
```

### Using WordPress Preset

```javascript
module.exports = {
  plugins: [
    ...require('@wordpress/postcss-plugins-preset'),
  ],
};
```

## Popular Plugins

### postcss-import

```bash
npm install --save-dev postcss-import
```

```css
/* Import other CSS files */
@import "normalize.css";
@import "./variables.css";
```

### postcss-nesting

```bash
npm install --save-dev postcss-nesting
```

```css
/* Nested selectors */
.block {
  color: blue;

  & .title {
    font-size: 2em;
  }

  &:hover {
    color: red;
  }
}
```

### postcss-custom-media

```bash
npm install --save-dev postcss-custom-media
```

```css
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
  /* Styles for small screens */
}
```

## Build Process

PostCSS runs during build:

```bash
# Development build
npm run start

# Production build
npm run build
```

## Advanced Configuration

### Development vs Production

```javascript
module.exports = (api) => {
  const isProduction = api.env() === 'production';

  return {
    plugins: [
      require('autoprefixer'),
      isProduction && require('cssnano')({
        preset: 'default',
      }),
    ].filter(Boolean),
  };
};
```

### Custom Autoprefixer Options

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      grid: 'autoplace', // Enable CSS Grid prefixes
      flexbox: 'no-2009', // Use modern flexbox
    }),
    require('cssnano'),
  ],
};
```

## Debugging

### Check Browser Support

```bash
npx browserslist
```

Output shows which browsers are targeted.

### Disable Minification

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
    // Comment out cssnano for debugging
    // require('cssnano'),
  ],
};
```

## Common Issues

### Vendor Prefixes Not Added

**Cause**: Browserslist not configured

**Solution**: Create `.browserslistrc` or use `@wordpress/browserslist-config`:

```json
{
  "browserslist": [
    "extends @wordpress/browserslist-config"
  ]
}
```

### CSS Breaking After Minification

**Cause**: Aggressive cssnano settings

**Solution**: Use conservative preset:

```javascript
require('cssnano')({
  preset: ['default', {
    calc: false,
    colormin: false,
  }],
})
```

## Block-Specific Styles

### Scoped Block Styles

```css
/* src/{{slug}}/style.scss */
.wp-block-namespace-slug {
  padding: 1rem;

  &__title {
    font-size: 2rem;
  }

  &__content {
    margin-top: 1rem;
  }
}
```

### Editor Styles

```css
/* src/{{slug}}/editor.scss */
.wp-block-namespace-slug {
  /* Editor-specific styles */
  .block-editor-block-list__block & {
    border: 1px dashed #ccc;
  }
}
```

## Best Practices

1. **Use WordPress Defaults**: Start with `@wordpress/scripts` config
2. **Test Browser Support**: Use browserslist to check targets
3. **Minimize Plugins**: Only add plugins you need
4. **Production Optimization**: Enable cssnano for production
5. **Development Speed**: Disable minification in development
6. **Modern CSS**: Use nesting and custom properties
7. **Consistent Prefixing**: Let autoprefixer handle all prefixes

## Resources

- [PostCSS Official Documentation](https://postcss.org/)
- [WordPress PostCSS Plugins Preset](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-postcss-plugins-preset/)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [cssnano](https://cssnano.co/)
- [Browserslist](https://github.com/browserslist/browserslist)
- [WordPress Browserslist Config](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-browserslist-config/)
