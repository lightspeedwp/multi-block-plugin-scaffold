# npm-package-json-lint Configuration

## Overview

npm-package-json-lint is a linter for `package.json` files that helps enforce standards and catch errors in your npm configuration.

## Configuration File

Location: `.npmpackagejsonlintrc.cjs`

## WordPress Package Used

- `@wordpress/npm-package-json-lint-config` (recommended but not currently used in scaffold)

## Current Configuration

```javascript
module.exports = {
 rules: {
  'name-format': 'error',
  'valid-values-name-scope': [ 'error', [ '@lightspeedwp' ] ],
  'version-format': 'error',
  'require-author': 'warning',
  'prefer-repository': 'error',
  'require-license': 'error',
 },
};
```

## Rules Explained

### name-format

- **Level**: `error`
- **Purpose**: Validates package name follows npm naming rules
- **Rules**:
  - Lowercase only
  - No spaces
  - Hyphens and underscores allowed
  - Max 214 characters
  - Cannot start with dot or underscore

### valid-values-name-scope

- **Level**: `error`
- **Allowed Scopes**: `@lightspeedwp`
- **Purpose**: Enforces organization scope for scoped packages
- **Example**: `@lightspeedwp/my-block-plugin`

### version-format

- **Level**: `error`
- **Purpose**: Validates version follows SemVer (Semantic Versioning)
- **Format**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)

### require-author

- **Level**: `warning`
- **Purpose**: Ensures package has author information
- **Formats**:

  ```json
  "author": "Name <email@example.com> (https://example.com)"
  ```

  or

  ```json
  "author": {
    "name": "Name",
    "email": "email@example.com",
    "url": "https://example.com"
  }
  ```

### prefer-repository

- **Level**: `error`
- **Purpose**: Encourages adding repository URL
- **Format**:

  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
  ```

### require-license

- **Level**: `error`
- **Purpose**: Requires a license field
- **Common Values**: `GPL-2.0-or-later`, `MIT`, `Apache-2.0`

## Available Scripts

```bash
# Lint package.json
npm run lint:pkg-json

# Lint specific package.json file
npx npmPkgJsonLint ./package.json
```

## Extending with WordPress Config

To use WordPress standards:

```json
{
    "extends": "@wordpress/npm-package-json-lint-config",
    "rules": {
        "valid-values-name-scope": [
            "error",
            [
                "@lightspeedwp",
                "@wordpress"
            ]
        ]
    }
}
```

## WordPress Config Rules

The `@wordpress/npm-package-json-lint-config` includes:

### Required Fields

- `name` - Package name
- `version` - Package version
- `description` - Package description
- `license` - License identifier
- `engines` - Node.js and npm version requirements

### Recommended Fields

- `author` - Package author
- `repository` - Source code repository
- `bugs` - Issue tracker URL
- `homepage` - Project homepage
- `keywords` - Search keywords

### Dependencies

- `require-dependencies` - Must have dependencies
- `require-devDependencies` - Must have devDependencies (for dev packages)
- `prefer-absolute-version-dependencies` - Use exact versions where appropriate

### Scripts

- `valid-values-author` - Validates author format
- `prefer-no-version-zero-dependencies` - Avoid 0.x.x versions in production

## Common Rules

### Package Naming

```json
{
  "name-format": "error",
  "name-type": "error",
  "no-duplicate-properties": "error"
}
```

### Versioning

```json
{
  "version-format": "error",
  "version-type": "error",
  "prefer-property-order": ["error", ["name", "version", "description"]]
}
```

### Dependencies

```json
{
  "no-duplicate-dependencies": "error",
  "prefer-absolute-version-devDependencies": "warning",
  "prefer-caret-version-dependencies": "warning"
}
```

### Scripts

```json
{
  "scripts-type": "error",
  "require-scripts": ["error", ["test", "build"]]
}
```

## Block Plugin Specific

### Scoped Package Name

```json
{
  "name": "@organization/block-name",
  "version": "1.0.0"
}
```

### Required Scripts

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style",
    "test:js": "wp-scripts test-unit-js"
  }
}
```

### WordPress Dependencies

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@wordpress/scripts": "^31.0.0"
  }
}
```

## Customization

### Custom Organization Scope

```json
{
  "extends": "@wordpress/npm-package-json-lint-config",
  "rules": {
    "valid-values-name-scope": [
      "error",
      [
        "@your-org",
        "@your-other-org"
      ]
    ]
  }
}
```

### Required Scripts

```json
{
  "rules": {
    "require-scripts": [
      "error",
      [
        "build",
        "start",
        "test:js",
        "lint:js"
      ]
    ]
  }
}
```

### Property Order

```json
{
  "rules": {
    "prefer-property-order": [
      "error",
      [
        "name",
        "version",
        "description",
        "author",
        "license",
        "keywords",
        "homepage",
        "repository",
        "bugs",
        "main",
        "scripts",
        "peerDependencies",
        "dependencies",
        "devDependencies"
      ]
    ]
  }
}
```

## Usage

### Command Line

```bash
# Lint package.json
npx npmPkgJsonLint .

# Lint specific file
npx npmPkgJsonLint ./package.json

# Auto-fix (limited)
npx npmPkgJsonLint . --fix
```

### VS Code Integration

Install the extension: "npm-package-json-lint"

Add to `.vscode/settings.json`:

```json
{
  "npm-package-json-lint.enable": true
}
```

## Integration with CI/CD

### GitHub Actions

```yaml
- name: Lint package.json
  run: npm run lint:pkg-json
```

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:pkg-json"
    }
  }
}
```

## Common Issues

### Scope Not Allowed

**Error**: `Package name scope is not allowed`

**Solution**: Add your scope to `valid-values-name-scope`:

```json
{
  "valid-values-name-scope": [
    "error",
    [
      "@lightspeedwp",
      "@your-scope"
    ]
  ]
}
```

### Version Format

**Error**: `Version format is invalid`

**Solution**: Use semantic versioning (MAJOR.MINOR.PATCH):

```json
{
  "version": "1.0.0"
}
```

### Missing Required Field

**Error**: `Missing required property: license`

**Solution**: Add the missing field:

```json
{
  "license": "GPL-2.0-or-later"
}
```

## Disable Rules

### Specific Rule

```json
{
  "rules": {
    "require-author": "off"
  }
}
```

### All Rules

```json
{
  "rules": {}
}
```

## Best Practices

1. **Use WordPress Config**: Start with `@wordpress/npm-package-json-lint-config`
2. **Customize Minimally**: Only override rules you need
3. **Scoped Packages**: Use organization scope for private plugins
4. **Semantic Versioning**: Follow SemVer for versions
5. **Document Exceptions**: Comment why rules are disabled
6. **Run in CI**: Catch errors before merge
7. **Keep Updated**: Update config package regularly
8. **Consistent Metadata**: Maintain complete package information

## Resources

- [npm-package-json-lint Official Documentation](https://npmpackagejsonlint.org/)
- [WordPress npm-package-json-lint Config](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-npm-package-json-lint-config/)
- [npm package.json Specification](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Semantic Versioning](https://semver.org/)
- [WordPress Block Plugin Guidelines](https://developer.wordpress.org/block-editor/getting-started/create-block/)
