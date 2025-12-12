---
description: >-
  Markdown authoring standards for documentation in the multi-block plugin
  scaffold
applyTo: '**/*.md'
version: '1.0'
last_updated: '2025-12-11'
references:
  - ../custom-instructions.md
---

# Markdown Style Guide

You are a Markdown style advisor. Follow our documentation patterns to craft concise, UK English Markdown for the multi-block plugin scaffold. Avoid raw HTML when Markdown suffices and avoid inconsistent heading hierarchies or inaccessible formatting.

## Overview

Use this guide when writing or updating Markdown (docs, READMEs, reports) in this repository. It focuses on clarity, accessibility, and consistency. It does not replace product copy guidance or design documentation.

## General Rules

- Keep headings hierarchical (single H1 per file, then H2-H4 as needed).
- Prefer fenced code blocks with language hints; avoid inline HTML unless necessary.
- Use UK English, short sentences, and scannable lists.
- Include frontmatter where required and keep metadata accurate.
- Provide descriptive link text; avoid bare URLs without context.

## Detailed Guidance

## Headings

```md
# Heading h1
## Heading h2
### Heading h3
#### Heading h4
##### Heading h5
###### Heading h6
```

Note: h1 - h4 items will be automatically added to the Table of Contents.

## Emphasis

### Italics

Wrap text with a single `_` for _Italic_ text:

```md
This is _italic text_.
```

### Bold

Wrap text with double `**` for **Bold** text:

```md
This is **bold text**.
```

### Strikethrough

Wrap text with double `~~` for ~~strikethrough~~ text:

```md
This is ~~strikethrough~~ text.
```

## Links

Wrap the title in square brackets `[title]` immediately followed by the URL in `(https://example.com)`:

```md
[WordPress](https://wordpress.org/)
```

## Blockquotes

Use `>` for blockquotes, double `>>` to further indent:

```md
> Blockquote
>> Indented Blockquote
```

## Lists

### Unordered Lists

Use `-` for unordered lists, and intent two spaces for list subitems:

```md
- List
  - List
- List
- List
```

## Examples

```md
---
title: Feature Overview
description: Summary of the tour booking feature
---

# Feature Overview

- Purpose
- Inputs
- Outputs
```

Avoid mixing heading levels (jumping from H2 to H4) or embedding large HTML blocks.

## Validation

- Run markdownlint or repository lint scripts if configured.
- Preview rendering to confirm lists, code fences, and blockquotes display correctly.
- Check internal links resolve to existing files.

### Ordered Lists

Use numbered items followed by a `.`:

```md
1. One
2. Two
3. Three
```

## Horizontal Rules

Use `---` for a horizontal rules:

```md
---
```

## Tables

```md
| A     | B     |
| ----- | ----- |
| Alpha | Bravo |
```

## Example Code

### Inline Code

Wrap inline code with single <code>`\``</code> backticks:

````md
```
This is `inline code` wrapped with backticks
```
````

When documenting an example, use the markdown <code>`\``</code> code block to demarcate the beginning and end of the code sample:

### Fenced Code Blocks

#### Javascript

````md
```javascript
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```
````

#### JSON

````md
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021-3100"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "office",
      "number": "646 555-4567"
    }
  ],
  "children": [],
  "spouse": null
}
```
````

#### CSS

````md
```css
foo {
  padding: 5px;
  margin-right: 3px;
}

.bar {
  background-color: #f00;
}
```
````

#### SCSS

````md
```scss
foo {
  padding: 5px;
  margin-right: 3px;
}

.bar {
  background-color: #f00;
}
```
````

#### HTML

````md
```html
<span class="my-class">Example</span>
```
````

#### PHP

````md
```php
$array = array(
    "foo" => "bar",
    "bar" => "foo",
);
```
````

#### Markdown

````md
```md
This is _italic text_. This is **bold text**.
```
````

## Linting Rules

### Markdownlint Configuration

This project uses markdownlint to enforce consistent markdown style. Key rules:

**MD001** - Heading levels increment by one
- ❌ `# H1` followed by `### H3`
- ✅ `# H1` followed by `## H2`

**MD003** - Heading style (ATX)
- ✅ `## Heading` (ATX style)
- ❌ `Heading\n-------` (Setext style)

**MD004** - Unordered list style (dash)
- ✅ `- Item`
- ❌ `* Item` or `+ Item`

**MD007** - Unordered list indentation (2 spaces)
```markdown
- Parent
  - Child (2 spaces)
    - Grandchild (4 spaces)
```

**MD009** - No trailing spaces
**MD010** - No hard tabs (use spaces)
**MD012** - No multiple consecutive blank lines
**MD013** - Line length limit (120 characters for readability)
**MD022** - Headings surrounded by blank lines
**MD023** - Headings start at beginning of line
**MD025** - Single H1 per document
**MD026** - No trailing punctuation in headings
**MD029** - Ordered list prefix (ordered)
**MD030** - Spaces after list markers (1 space)
**MD031** - Fenced code blocks surrounded by blank lines
**MD032** - Lists surrounded by blank lines
**MD034** - No bare URLs (use link syntax)
**MD040** - Fenced code blocks have language
**MD041** - First line is top-level heading
**MD046** - Code block style (fenced)
**MD047** - Files end with single newline

### Mustache Placeholder Documentation

When documenting scaffold files with `{{mustache}}` placeholders:

**DO:**
- Explain what each placeholder represents
- Provide examples with realistic values
- Document placeholder transformations (e.g., `{{namespace|lowerCase}}`)
- Link to schema definitions

**DON'T:**
- Remove or replace placeholders in documentation
- Use literal values instead of placeholders in examples
- Document placeholders without context

**Example:**

```markdown
### Plugin Namespace Placeholders

- `{{namespace}}` - PHP namespace in snake_case (e.g., `Tour_Operator`)
- `{{namespace|lowerCase}}` - Lowercase namespace for use in paths (e.g., `tour_operator`)
- `{{namespace|upper}}` - Uppercase for constants (e.g., `TOUR_OPERATOR`)

**Usage in PHP:**

\```php
namespace {{namespace|lowerCase}}\classes;

define( '{{namespace|upper}}_VERSION', '{{version}}' );
\```
```

### File Structure Requirements

**Front Matter (for documentation files):**

```yaml
---
title: Document Title
description: Brief description
audience: Developers|Users|Both
date: YYYY-MM-DD
---
```

**Required Sections (for instruction files):**

1. **Title** (H1) - One per document
2. **Overview** (H2) - Brief introduction
3. **Reference Links** (H2) - External documentation
4. **Instructions** (H2+) - Step-by-step guidance
5. **Examples** (H2+) - Code samples
6. **Common Issues** (H2+) - Troubleshooting

### Code Block Best Practices

**Always specify language:**

````markdown
```php
// Good - language specified
<?php echo 'Hello'; ?>
```

```
// Bad - no language
code here
```
````

**Use syntax highlighting for:**
- `php` - PHP code
- `javascript` or `js` - JavaScript
- `json` - JSON configuration
- `bash` or `sh` - Shell commands
- `html` - HTML markup
- `css` - Stylesheets
- `scss` - Sass/SCSS
- `markdown` or `md` - Markdown examples
- `text` - Plain text output

**Command examples:**

```markdown
**Run build:**

\```bash
npm run build
\```

**Expected output:**

\```text
> @wordpress/scripts build

Creating optimized production build...
Compiled successfully.
\```
```

### Link Best Practices

**Internal documentation links:**

```markdown
See [ARCHITECTURE.md](../ARCHITECTURE.md) for system design.
See [Block Development](blocks-development.instructions.md) for block guidelines.
```

**External reference links:**

```markdown
**WordPress Developer Resources:**
- [Plugin Basics](https://developer.wordpress.org/plugins/plugin-basics/)
- [Custom Post Types](https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/)

**Secure Custom Fields Documentation:**
- [First Custom Field](https://github.com/WordPress/secure-custom-fields/blob/trunk/docs/tutorials/first-custom-field.md)
- [SCF API Reference](https://github.com/WordPress/secure-custom-fields/tree/trunk/docs/code-reference)
```

**Anchor links:**

```markdown
Jump to [Installation](#installation) section.
```

### Table Formatting

**Alignment:**

```markdown
| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
```

**Complex tables (use HTML):**

```html
<table>
<thead>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </td>
    <td>Value</td>
  </tr>
</tbody>
</table>
```

### Admonitions (Callouts)

**WordPress.org style (blockquotes with emoji):**

```markdown
> ⚠️ **Warning:** This will delete all data.

> ℹ️ **Note:** Remember to flush rewrite rules.

> ✅ **Best Practice:** Always sanitize user input.

> ❌ **Avoid:** Never use `extract()` on user data.
```

### File-Specific Guidelines

**README.md:**
- Must have single H1 title
- Include badges (version, license, build status)
- Quick start section
- Installation instructions
- Link to full documentation

**CHANGELOG.md:**
- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Use [Semantic Versioning](https://semver.org/)
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security

**CONTRIBUTING.md:**
- Code of conduct reference
- Development setup
- Pull request process
- Coding standards links

**Instruction files (.instructions.md):**
- Focused, single-purpose guidance
- Step-by-step format
- Code examples with explanations
- Link to official WordPress/SCF docs
- Troubleshooting section

## Scaffold Repository Guidelines

### Placeholder Preservation

**Critical:** Never remove or replace mustache placeholders in scaffold files.

**Placeholders must remain intact in:**
- All `.php` files in scaffold
- All `.js` files using template strings
- All `block.json` files
- All `.html` template files
- Pattern files in `patterns/`
- Example files

**Exception:** Documentation can show "before/after" with actual values for clarity, but must explain the placeholder mapping.

### Documentation of Mustache Values

**Every instruction file that references scaffold code MUST include a Mustache Placeholder Reference section.**

**Template:**

```markdown
## Mustache Placeholder Reference

### Plugin-Level Placeholders

| Placeholder | Description | Example Value | Used In |
|-------------|-------------|---------------|---------|
| `{{slug}}` | Plugin slug (kebab-case) | `tour-operator` | File names, CSS classes, block namespaces |
| `{{name}}` | Plugin display name | `Tour Operator` | Plugin header, admin labels |
| `{{textdomain}}` | i18n text domain | `tour-operator` | `__()`, `_e()`, `esc_html__()` |
| `{{namespace}}` | PHP namespace | `Tour_Operator` | `namespace` declarations |
| `{{namespace\|lowerCase}}` | Lowercase namespace for use in paths | `tour_operator` | Directory paths, function prefixes |
| `{{namespace\|upper}}` | Uppercase for constants | `TOUR_OPERATOR` | Constants |

[Add complete table for all placeholder categories]
```

### Examples Must Be Runnable

All code examples should:
1. Be syntactically valid
2. Show complete context (not fragments)
3. Include required imports/includes
4. Use proper escaping and sanitization
5. Follow WordPress coding standards

**Bad example:**

```markdown
Update the field:
\```php
update_field('title', $value);
\```
```

**Good example:**

```markdown
Update a custom field value with proper sanitization:

\```php
<?php
// Sanitize user input before saving
$sanitized_title = sanitize_text_field( $_POST['movie_title'] );

// Update the field value
update_field( 'movie_title', $sanitized_title, $post_id );

// Verify update succeeded
if ( get_field( 'movie_title', $post_id ) === $sanitized_title ) {
    // Success
    add_action( 'admin_notices', function() {
        echo '<div class="notice notice-success"><p>' .
             esc_html__( 'Title updated successfully.', '{{textdomain}}' ) .
             '</p></div>';
    } );
}
\```
```

## Accessibility Considerations

### Screen Reader Friendly Structure

- Use semantic headings (H1-H6) in proper hierarchy
- Provide descriptive link text (avoid "click here", "read more")
- Use tables for tabular data only, with proper headers
- Include alt text for images (though rare in documentation)
- Ensure code examples are readable with screen readers

### Keyboard Navigation

- Links and interactive elements should be keyboard accessible
- Avoid relying on color alone for conveying information
- Use sufficient color contrast in any styled elements

### Cognitive Load

- Keep sentences short and clear
- Use consistent terminology
- Break complex information into digestible sections
- Provide examples to illustrate concepts
- Use progressive disclosure for advanced topics

## Integration with Other Standards

### WordPress Coding Standards

When documenting PHP code:

- Follow [WordPress PHP Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Use proper DocBlocks for functions and classes
- Include parameter types and return values
- Document hooks and filters with `@since` tags

### JavaScript Standards

When documenting JavaScript:

- Follow [WordPress JavaScript Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use JSDoc comments for functions
- Document parameters and return types
- Include examples with ES6+ syntax where appropriate

### CSS/SCSS Standards

When documenting styles:

- Follow [WordPress CSS Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- Use BEM naming convention where applicable
- Document CSS custom properties (variables)
- Include responsive design considerations

## File-Specific Guidelines

### README.md

- Must have single H1 title
- Include badges (version, license, build status)
- Quick start section
- Installation instructions
- Link to full documentation

### CHANGELOG.md

- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Use [Semantic Versioning](https://semver.org/)
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security

### CONTRIBUTING.md

- Code of conduct reference
- Development setup
- Pull request process
- Coding standards links

### Instruction Files (.instructions.md)

- Focused, single-purpose guidance
- Step-by-step format
- Code examples with explanations
- Link to official WordPress/SCF docs
- Troubleshooting section

### Report Files (.md in reports/)

- Follow reporting.instructions.md
- Include YAML frontmatter
- Use Executive Summary, Context, Findings, Recommendations structure
- Reference supporting logs and artifacts

## Common Issues and Solutions

### Linting Errors

**MD001/MD002 - Heading levels should increment by one**

```markdown
❌ Bad:
# H1
### H3 (skips H2)

✅ Good:
# H1
## H2
### H3
```

**MD013 - Line length should not exceed 120 characters**

```markdown
❌ Bad:
This is a very long line that exceeds the maximum allowed length of 120 characters and should be broken into multiple lines.

✅ Good:
This is a very long line that exceeds the maximum allowed length
of 120 characters and should be broken into multiple lines.
```

**MD022 - Headings should be surrounded by blank lines**

```markdown
❌ Bad:
Some text
## Heading
More text

✅ Good:
Some text

## Heading

More text
```

**MD025 - Multiple top-level headings**

```markdown
❌ Bad:
# Title 1
# Title 2

✅ Good:
# Title 1
## Title 2
```

**MD032 - Lists should be surrounded by blank lines**

```markdown
❌ Bad:
Some text
- Item 1
- Item 2
More text

✅ Good:
Some text

- Item 1
- Item 2

More text
```

**MD034 - Bare URLs should be avoided**

```markdown
❌ Bad:
See https://wordpress.org for more info.

✅ Good:
See [WordPress](https://wordpress.org) for more info.
```

**MD040 - Fenced code blocks should have language**

```markdown
❌ Bad:
```
code here
```

✅ Good:
```php
code here
```
```

### Mustache Placeholder Issues

**Replaced placeholders in scaffold files**

```markdown
❌ Bad: Scaffold file with replaced placeholders
namespace Tour_Operator\classes;

✅ Good: Scaffold file with preserved placeholders
namespace {{namespace|lowerCase}}\classes;
```

**Missing placeholder documentation**

```markdown
❌ Bad: No explanation of placeholders
\```php
define( '{{namespace|upper}}_VERSION', '{{version}}' );
\```

✅ Good: With explanation
Define the plugin version constant:

\```php
define( '{{namespace|upper}}_VERSION', '{{version}}' );
\```

Where:
- `{{namespace|upper}}` becomes the uppercase namespace (e.g., `TOUR_OPERATOR`)
- `{{version}}` is replaced with the plugin version (e.g., `1.0.0`)
```

### Formatting Issues

**Inconsistent list markers**

```markdown
❌ Bad: Mixed list markers
- Item 1
* Item 2
+ Item 3

✅ Good: Consistent markers
- Item 1
- Item 2
- Item 3
```

**Missing code block language**

```markdown
❌ Bad: No language specified
\```
function example() {
  return true;
}
\```

✅ Good: Language specified
\```javascript
function example() {
  return true;
}
\```
```

**Incorrect table formatting**

```markdown
❌ Bad: Misaligned columns
| Column 1 | Column 2 |
| --- | --- |
| Data | More data |
| Even more data | Final data |

✅ Good: Properly aligned
| Column 1    | Column 2    |
|-------------|-------------|
| Data        | More data   |
| Even more data | Final data |
```

## Validation Checklist

Before committing markdown files:

- [ ] Single H1 heading per document
- [ ] Heading hierarchy increments properly (no skipped levels)
- [ ] All links have descriptive text
- [ ] Code blocks have language specified
- [ ] Tables are properly formatted
- [ ] No bare URLs
- [ ] Lines don't exceed 120 characters
- [ ] Lists are properly indented and surrounded by blank lines
- [ ] Headings are surrounded by blank lines
- [ ] File ends with single newline
- [ ] Mustache placeholders preserved in scaffold files
- [ ] Frontmatter included where required
- [ ] UK English spelling used
- [ ] Consistent terminology throughout

## Tools and Automation

### Linting

Run markdownlint to check for style violations:

```bash
npm run lint:markdown
# or
npx markdownlint "**/*.md"
```

### Formatting

Use Prettier to format markdown files:

```bash
npx prettier --write "**/*.md"
```

### Validation Scripts

Repository includes validation scripts in `scripts/`:

- `validate-mustache-registry.js` - Checks mustache placeholder registry
- `check-markdown-references.js` - Validates internal links
- `fix-instruction-references.js` - Updates cross-references

## References

- [CommonMark Specification](https://commonmark.org/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## See Also

- readme.instructions.md
- reporting.instructions.md
- docs/README.md
