# Babel Configuration

## Overview

Babel is a JavaScript compiler that transforms modern JavaScript (ES2015+) and JSX into backwards-compatible code. This plugin uses the WordPress Babel preset integrated into webpack.

## Configuration

Babel configuration is integrated into the webpack configuration (`webpack.config.js`) rather than a separate `.babelrc` file.

## WordPress Package Used

- `@wordpress/babel-preset-default` - ^8.35.0
- `@wordpress/babel-plugin-makepot` - ^6.35.0

## Webpack Babel Configuration

```javascript
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
}
```

## @wordpress/babel-preset-default Features

### JavaScript Features

The WordPress Babel preset includes support for:

#### ECMAScript 2015+ (ES6+)

- Arrow functions: `() => {}`
- Classes: `class MyComponent {}`
- Template literals: `` `Hello ${name}` ``
- Destructuring: `const { prop } = object`
- Spread operator: `...array`
- Async/await: `async () => await promise`
- Modules: `import/export`
- Default parameters: `function(param = 'default')`
- Rest parameters: `function(...args)`
- Object shorthand: `{ name, value }`

#### JSX Support

```jsx
const Edit = ({ attributes, setAttributes }) => {
  return (
    <div {...useBlockProps()}>
      <RichText
        value={attributes.content}
        onChange={(content) => setAttributes({ content })}
      />
    </div>
  );
};
```

#### React Features

- JSX transforms
- React hooks support
- Fragment shorthand: `<>...</>`

### Polyfills and Runtime

The preset includes:

- **@babel/runtime**: Helpers to avoid code duplication
- **regenerator-runtime**: For async/await and generators
- **core-js**: Polyfills for modern JavaScript features

## @wordpress/babel-plugin-makepot

This plugin extracts translatable strings during build:

### Features

- Extracts `__()`, `_n()`, `_x()`, `_nx()` calls
- Creates `.pot` file for translation
- Integrates with WordPress i18n

### Configuration

```javascript
[
  require.resolve('@wordpress/babel-plugin-makepot'),
  {
    output: 'languages/plugin-slug-js.pot',
  },
]
```

### Usage in Code

```javascript
import { __ } from '@wordpress/i18n';

const title = __('Block Title', 'plugin-slug');
const count = _n('%d item', '%d items', items.length, 'plugin-slug');
const context = _x('Post', 'noun', 'plugin-slug');
```

## Caching

```javascript
cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true
```

Enables caching for faster subsequent builds.

## Browser Targets

Uses `@wordpress/browserslist-config` for browser compatibility:

- Last 2 versions of major browsers
- IE 11+ (with polyfills)
- Safari 12+
- iOS 12+
- Android 4.4+

## Custom Configuration

### Create .babelrc.js

For advanced customization:

```javascript
module.exports = {
  presets: [
    [
      '@wordpress/babel-preset-default',
      {
        modules: false, // Keep ES modules for webpack tree-shaking
        targets: {
          browsers: ['last 2 versions', 'ie >= 11'],
        },
      },
    ],
  ],
  plugins: [
    '@wordpress/babel-plugin-makepot',
    // Add custom plugins here
  ],
};
```

### Common Options

#### modules

```javascript
{
  modules: false // Preserve ES modules for webpack
}
```

#### useBuiltIns

```javascript
{
  useBuiltIns: 'usage', // Automatic polyfills based on code
  corejs: 3
}
```

## Usage in @wordpress/scripts

When using `@wordpress/scripts`, Babel is preconfigured:

```bash
# Build with Babel transpilation
npm run build

# Watch mode
npm run start
```

### Build Process

1. Babel reads JSX and modern JavaScript
2. Transforms code based on preset rules
3. Extracts translatable strings (makepot)
4. Outputs browser-compatible JavaScript
5. Webpack bundles the result

## Custom Babel Plugins

### Popular Plugins

```javascript
plugins: [
  '@wordpress/babel-plugin-makepot',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-optional-chaining',
]
```

Common plugins:

- `@babel/plugin-proposal-class-properties` - Class fields
- `@babel/plugin-proposal-optional-chaining` - `obj?.prop`
- `@babel/plugin-proposal-nullish-coalescing-operator` - `??`
- `@babel/plugin-transform-runtime` - Optimize helpers

## TypeScript Support

For TypeScript, add preset:

```javascript
presets: [
  '@babel/preset-typescript',
  '@wordpress/babel-preset-default',
]
```

## Debugging Babel

### Check Compiled Output

```bash
npm run build
cat build/index.js
```

### Test Specific File

```bash
npx babel src/{{slug}}/edit.js --out-file test.js --presets=@wordpress/babel-preset-default
```

## Environment-Specific Configuration

### Development

```javascript
{
  presets: [
    [
      '@wordpress/babel-preset-default',
      { debug: true, modules: false }
    ]
  ]
}
```

### Production

```javascript
{
  presets: [
    [
      '@wordpress/babel-preset-default',
      { debug: false, modules: false }
    ]
  ]
}
```

## Common Issues

### "regeneratorRuntime is not defined"

**Cause**: Missing async/await polyfill

**Solution**: Ensure `@wordpress/babel-preset-default` is used:

```javascript
presets: ['@wordpress/babel-preset-default']
```

### JSX Not Transforming

**Cause**: Missing preset or wrong file extension

**Solution**:

1. Use `.jsx` extension or configure `.js` files
2. Ensure webpack rule includes `.jsx?$`

```javascript
{
  test: /\.jsx?$/,
  use: 'babel-loader'
}
```

### Large Bundle Size

**Cause**: Unnecessary polyfills

**Solution**: Use `useBuiltIns: 'usage'`:

```javascript
{
  presets: [
    [
      '@wordpress/babel-preset-default',
      { useBuiltIns: 'usage', corejs: 3 }
    ]
  ]
}
```

### Slow Build Times

**Cause**: Not caching or transpiling node_modules

**Solution**:

1. Enable caching:

```javascript
{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
  }
}
```

2. Exclude node_modules:

```javascript
{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

## Block Development

### Typical Block Structure

```javascript
// edit.js
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <RichText
        tagName="h2"
        value={attributes.title}
        onChange={(title) => setAttributes({ title })}
        placeholder={__('Enter title…', 'plugin-slug')}
      />
    </div>
  );
}
```

### Babel Transforms

```javascript
// Before Babel (modern JS + JSX)
const Edit = ({ attributes }) => (
  <div {...useBlockProps()}>
    <p>{attributes?.content ?? 'Default'}</p>
  </div>
);

// After Babel (ES5 compatible)
var Edit = function Edit(_ref) {
  var attributes = _ref.attributes;
  return React.createElement(
    "div",
    useBlockProps(),
    React.createElement("p", null,
      (attributes === null || attributes === void 0 ? void 0 : attributes.content) || 'Default'
    )
  );
};
```

## Best Practices

1. **Use WordPress Preset**: Maintains consistency with WordPress core
2. **Don't Transpile node_modules**: Exclude for performance
3. **Enable Caching**: Speeds up subsequent builds
4. **Use Tree Shaking**: Set `modules: false` for webpack
5. **Extract Translations**: Use makepot plugin for i18n
6. **Modern JavaScript**: Write modern code, let Babel handle compatibility
7. **Test Compiled Output**: Verify transpilation works
8. **Update Regularly**: Keep Babel preset current

## Resources

- [Babel Official Documentation](https://babeljs.io/docs/)
- [WordPress Babel Preset Default](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-babel-preset-default/)
- [WordPress Babel Plugin Makepot](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-babel-plugin-makepot/)
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
