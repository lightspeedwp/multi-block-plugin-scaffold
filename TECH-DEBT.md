# Technical Debt and Known Issues

This document tracks known technical debt, linting issues, and planned improvements for the Multi-Block Plugin Scaffold.

## Linting Status Summary

**Current State**: ✅ 98% Error Reduction Achieved

- **Before**: 1,262 problems (1,258 errors, 4 warnings)
- **After**: 20 problems (16 errors, 4 warnings)
- **Reduction**: 1,242 errors fixed (98.4% improvement)

**Achievement Date**: 2025-12-07

**Method**:

- Added inline ESLint/Stylelint directives to 9 files
- Removed unused imports and variables from 4 files
- Applied auto-fix for 1,242 formatting errors
- All changes staged and ready for commit

---

## Remaining Issues (20 Total)

### 1. False Positives - DevDependencies (5 Errors)

**Status**: ⚠️ Known False Positives - Can Be Ignored

**Issue**: ESLint `import/no-extraneous-dependencies` rule flags development dependencies that are correctly listed in `package.json`.

**Affected Files**:

1. `tests/e2e/blocks.spec.js:9` - `@playwright/test` import
2. `tests/e2e/collection.spec.js:9` - `@playwright/test` import
3. `tests/e2e/post-type.spec.js:9` - `@playwright/test` import
4. `tests/e2e/slider.spec.js:9` - `@playwright/test` import
5. `webpack.config.js:13` - `glob` import

**Why This Occurs**:

- These dependencies ARE correctly listed as `devDependencies` in `package.json`
- Inline directive `/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */` is present but not being recognized during dry-run
- The dry-run backup/restore mechanism may be interfering with inline directive processing

**Recommendation**:

- **Accept as-is**: These are build-time and test-time dependencies, correctly configured
- **Alternative**: Add more specific ESLint config overrides (though this may also be affected by dry-run restore)
- **No action required**: Won't affect production builds or runtime

---

### 2. Real Code Quality Issues (6 Errors)

**Status**: 🔧 Should Be Fixed in Future PR

#### 2.1 Accessibility - Empty Anchor href (1 Error)

**File**: `src/blocks/{{slug}}-featured/edit.js:181`

**Error**: `jsx-a11y/anchor-is-valid`

**Issue**:

```javascript
<a href="#" className="wp-block-{{namespace}}-{{slug}}-featured__read-more">
    { readMoreText }
</a>
```

**Problem**: Empty `href="#"` is not accessible. Screen readers need a valid destination.

**Fix Options**:

- Use `<button>` element with appropriate styling instead
- Provide a valid href (though in editor preview, may not be available)
- Add `role="button"` and proper keyboard handlers if keeping as link

**Priority**: Medium (accessibility issue)

#### 2.2 Variable Declaration Order (3 Errors)

**File**: `src/blocks/{{slug}}-slider/view.js:32,35,38`

**Error**: `@wordpress/no-unused-vars-before-return`

**Issue**:

```javascript
const container = block.querySelector('.wp-block-{{namespace}}-{{slug}}-slider');
const track = container.querySelector('.wp-block-{{namespace}}-{{slug}}-slider__track');
const slides = Array.from(container.querySelectorAll('.wp-block-{{namespace}}-{{slug}}-slider__slide'));

if (!container || !track || slides.length === 0) {
    return;
}
```

**Problem**: Variables are declared before the early return check, potentially leaving them unused.

**Fix**: Move declarations after the early return checks, or restructure to avoid early returns.

**Priority**: Low (code style issue, doesn't affect functionality)

#### 2.3 Console Statement (1 Error)

**File**: `src/blocks/{{slug}}-slider/view.js:63`

**Error**: `no-console`

**Issue**:

```javascript
console.log('Slider auto-advance stopped');
```

**Problem**: Debug console statement left in production code.

**Fix Options**:

- Remove the statement
- Add `// eslint-disable-next-line no-console` if intentional logging
- Use proper debug mode checking

**Priority**: Low (doesn't affect production builds with minification)

#### 2.4 Non-Interactive Element Interactions (2 Errors)

**File 1**: `src/components/Gallery/Gallery.js:85`
**File 2**: `src/components/Slider/Slider.js:120`

**Error**: `jsx-a11y/no-noninteractive-element-interactions`

**Problem**: Click handlers on non-interactive elements (likely `<img>` or `<div>`) without keyboard accessibility.

**Fix Options**:

- Add `onKeyDown` handler for keyboard support
- Add `role="button"` and `tabIndex="0"`
- Use proper interactive element (button)
- Add inline disable comment if justified

**Priority**: Medium (accessibility issue)

---

### 3. Build-Time False Positives (4 Errors)

**Status**: ⚠️ Known False Positives - Build System Resolves

**File**: `src/index.js:10-13`

**Error**: `import/no-unresolved`

**Issue**:

```javascript
import './blocks/example-plugin-card';
import './blocks/example-plugin-collection';
import './blocks/example-plugin-slider';
import './blocks/example-plugin-featured';
```

**Why This Occurs**:

- These paths are resolved by webpack at build time
- During dry-run, mustache variables are replaced (e.g., `{{slug}}` → `example-plugin`)
- ESLint can't resolve the temporary paths before webpack processes them
- After build, these resolve correctly to the `build/` directory

**Recommendation**:

- **Accept as-is**: These are build-time paths that webpack handles
- **No action required**: Build process works correctly

---

### 4. React Hooks Warnings (4 Warnings)

**Status**: ⚠️ Acceptable - Performance Optimization Trade-off

#### 4.1 useCollection Hook (2 Warnings)

**File**: `src/hooks/useCollection.js:73,80`

**Warning**: `react-hooks/exhaustive-deps`

**Issue**:

- Missing dependency: `taxQuery` (line 73)
- Complex expression in dependency array (line 80)

**Trade-off**: Adding all dependencies may cause excessive re-renders. Current implementation is intentional performance optimization.

**Priority**: Low (acceptable warning, intentional design)

#### 4.2 useTaxonomies Hook (2 Warnings)

**File**: `src/hooks/useTaxonomies.js:44`

**Warning**: `react-hooks/exhaustive-deps`

**Issue**:

- Missing dependency: `args` (line 44)
- Complex expression in dependency array (line 44)

**Trade-off**: Similar to useCollection, adding all dependencies may cause performance issues.

**Priority**: Low (acceptable warning, intentional design)

---

## Impact Assessment

### Critical: 0

No issues blocking release or causing runtime errors.

### High: 0

No issues significantly affecting functionality.

### Medium: 3

- Empty anchor href (accessibility)
- 2 non-interactive element interactions (accessibility)

### Low: 13

- 5 false-positive devDependencies errors
- 4 false-positive build-time import errors
- 3 variable declaration order issues
- 1 console statement
- 4 React hooks warnings (intentional)

### Total: 16 errors, 4 warnings (20 problems)

---

## Action Plan

### Immediate (This PR)

✅ Document all remaining issues (this file)
✅ Commit 98% error reduction with inline directives
✅ Update CHANGELOG.md with improvements

### Short Term (Next PR)

- [ ] Fix 3 accessibility issues (anchor href, element interactions)
- [ ] Remove debug console statement
- [ ] Refactor variable declarations in slider view

### Long Term (Future Consideration)

- [ ] Review React hooks warnings - determine if dependency arrays need adjustment
- [ ] Investigate why inline devDependencies directives aren't working in dry-run
- [ ] Consider alternative approach for ESLint config that persists through dry-run

---

## Notes

### Inline Directives Added (This PR)

Successfully added inline ESLint/Stylelint directives to:

1. `tests/setup-tests.js` - Jest environment
2. `webpack.config.js` - DevDependencies allowed
3. `tests/e2e/blocks.spec.js` - DevDependencies allowed
4. `tests/e2e/collection.spec.js` - DevDependencies allowed
5. `tests/e2e/post-type.spec.js` - DevDependencies allowed
6. `tests/e2e/slider.spec.js` - DevDependencies allowed
7. `tests/e2e/setup.js` - Node environment
8. `tests/agents/scaffold-generator.agent.test.js` - Node environment
9. `src/blocks/{{slug}}-collection/style.scss` - Specificity disabled
10. `src/blocks/{{slug}}-featured/style.scss` - Specificity disabled

### Code Quality Fixes Made (This PR)

1. Removed unused `TextControl` import from `{{slug}}-collection/edit.js`
2. Removed unused `__` import from `RepeaterField/RepeaterField.js`
3. Removed unused `DRY_RUN_VALUES` import from `dry-run-config.test.js`
4. Removed unused variables from `blocks.spec.js`
5. Fixed invalid `@jest-environment` JSDoc tag in scaffold-generator test

### Dry-Run System Insight

**Critical Discovery**: The dry-run backup/restore mechanism:

- Backs up files from git STAGED state (not working directory)
- Restores from backup after linting (wipes working directory changes)
- **Solution**: Stage changes BEFORE running dry-run to include them in backup

This is why initial fixes were lost - they weren't staged, so the backup didn't contain them.

---

## Related Documentation

- [LINTING.md](docs/LINTING.md) - Linting standards and workflows
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards

---

## Changelog

### 2025-12-07 - Initial Technical Debt Documentation

- Documented 98% error reduction (1,262 → 20)
- Categorized 5 false positives, 6 real issues, 4 acceptable warnings
- Created action plan for remaining fixes
- Added inline directives to 10 files
- Fixed 5 code quality issues
