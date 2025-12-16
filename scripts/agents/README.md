# Agent Scripts Directory

This directory contains executable agent scripts that implement functionality described in `.github/agents/*.agent.md` specification files.

## Structure

```
scripts/agents/
├── README.md                      # This file
├── template.agent.js              # Template for creating new agents
├── template.agent.test.js         # Template for agent tests
├── generate-plugin.agent.js       # Plugin generation agent
├── release.agent.js               # Generated plugin release agent
└── release-scaffold.agent.js      # Scaffold repository release agent
```

## Agent Types

### 1. **Template Files** (DO NOT EXECUTE)
- `template.agent.js` - Boilerplate for creating new agent scripts
- `template.agent.test.js` - Boilerplate for creating agent tests

These files are templates only and will error if executed directly.

### 2. **Plugin Generation Agents**
- `generate-plugin.agent.js` - Implements the multi-block plugin generator
- Used by: `.github/agents/generate-plugin.agent.md`

### 3. **Release Agents**

#### `release.agent.js` - Generated Plugin Releases
- Handles releases of plugins **created from** the scaffold
- Used when releasing a generated plugin to WordPress.org or npm
- NOT used for releasing the scaffold repository itself

#### `release-scaffold.agent.js` - Scaffold Repository Releases
- Handles releases of **this scaffold repository** (multi-block-plugin-scaffold)
- Used when releasing a new version of the scaffold itself
- Updates CHANGELOG, creates git tags, prepares npm/GitHub releases

## Creating New Agents

1. **Copy the template:**
   ```bash
   cp scripts/agents/template.agent.js scripts/agents/your-agent.agent.js
   cp scripts/agents/template.agent.test.js scripts/agents/your-agent.agent.test.js
   ```

2. **Create agent specification:**
   ```bash
   # Create matching .agent.md file
   cp .github/agents/template.agent.md .github/agents/your-agent.agent.md
   ```

3. **Implement functionality:**
   - Update class name and constructor
   - Implement `run()` method
   - Add validation and helper methods
   - Write tests

4. **Make executable:**
   ```bash
   chmod +x scripts/agents/your-agent.agent.js
   ```

## Usage Examples

### Generate a Plugin
```bash
node scripts/agents/generate-plugin.agent.js --config my-plugin.json
```

### Release the Scaffold
```bash
# Dry run first
node scripts/agents/release-scaffold.agent.js --version=1.1.0 --dry-run

# Then actual release
node scripts/agents/release-scaffold.agent.js --version=1.1.0
```

### Release a Generated Plugin
```bash
node scripts/agents/release.agent.js --version=1.0.0 --plugin-dir=generated-plugins/my-plugin
```

## Testing

All agent scripts should have corresponding test files:

```bash
# Run all agent tests
npm test scripts/agents

# Run specific agent test
npm test scripts/agents/your-agent.agent.test.js
```

## Design Principles

1. **Single Responsibility** - Each agent does one thing well
2. **CLI-First** - Designed to be run from command line
3. **Testable** - All agents export their class for testing
4. **Documented** - Comprehensive JSDoc and help output
5. **Fail-Fast** - Validate inputs before doing work
6. **Dry Run** - Support `--dry-run` where applicable

## Integration with .github/agents/

Agent specifications in `.github/agents/*.agent.md` describe WHAT each agent does (interface, behavior, examples). The implementations in `scripts/agents/*.agent.js` provide HOW it's done (code).

| Specification | Implementation | Purpose |
|---------------|----------------|---------|
| `.github/agents/generate-plugin.agent.md` | `scripts/agents/generate-plugin.agent.js` | Plugin generator |
| `.github/agents/release.agent.md` | `scripts/agents/release.agent.js` | Generated plugin releases |
| `.github/agents/release-scaffold.agent.md` | `scripts/agents/release-scaffold.agent.js` | Scaffold releases |
| `.github/agents/template.agent.md` | `scripts/agents/template.agent.js` | Template for new agents |

## Excluded from Generated Plugins

The following files are **automatically excluded** when generating plugins:

- `scripts/agents/release-scaffold.agent.js` - Only for scaffold repo
- `.github/agents/release-scaffold.agent.md` - Only for scaffold repo
- `.github/workflows/release-scaffold.yml` - Only for scaffold repo

These are scaffold repository management files and should not appear in generated plugins.

## Questions?

See:
- `.github/instructions/agent-spec.instructions.md` - Agent specification format
- `.github/agents/template.agent.md` - Agent template
- `scripts/agents/template.agent.js` - Implementation template
