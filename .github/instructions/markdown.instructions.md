---
description: "Markdown authoring standards for documentation in the multi-block plugin scaffold"
applyTo: "**/*.md"
version: "1.0"
last_updated: "2025-12-11"
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

## References

- readme.instructions.md
- reporting.instructions.md
- docs/README.md

### Ordered Lists

Use numbered items followed by a `.:

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
