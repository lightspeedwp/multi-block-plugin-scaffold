# Release Process

This document describes the release process for the multi-block-plugin-scaffold repository.

## Git Flow Workflow

This repository uses **Git Flow** for managing releases:

- **`develop`** - Active development branch where all features are merged
- **`main`** - Stable branch updated only via releases
- **Feature branches** - Created from and merged back to `develop`

## Creating a Release

### 1. Prepare on Develop Branch

Ensure you're on the develop branch with a clean working directory:

```bash
git checkout develop
git pull origin develop
git status  # Should show clean working directory
```

### 2. Run the Release Agent

```bash
# Dry run to preview changes
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z --dry-run

# Execute the release
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z
```

The agent will:
- ✅ Validate git status is clean
- ✅ Validate version format (semantic versioning)
- ✅ Run all tests
- ✅ Run linting (JS + CSS)
- ✅ Update CHANGELOG.md (move Unreleased → vX.Y.Z with date)
- ✅ Update package.json version
- ✅ Create commit: `chore: Release vX.Y.Z`
- ✅ Create git tag: `vX.Y.Z`

### 3. Push to Develop

```bash
git push origin develop
```

### 4. Merge to Main

You have two options:

#### Option A: Direct Merge (Recommended for patch releases)

```bash
git checkout main
git pull origin main
git merge develop --no-ff -m "Release vX.Y.Z"
git push origin main
git push origin vX.Y.Z
git checkout develop
```

#### Option B: Pull Request (Recommended for major/minor releases)

```bash
# Create PR from develop → main via GitHub UI or CLI
gh pr create --base main --head develop --title "Release vX.Y.Z"

# After PR is merged:
git push origin vX.Y.Z
```

### 5. Verify Release

GitHub will automatically:
- Create a release from the vX.Y.Z tag
- Build and attach assets (if configured)
- Publish to npm (if configured)

Visit: `https://github.com/lightspeedwp/multi-block-plugin-scaffold/releases/tag/vX.Y.Z`

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (0.X.0) - New features, backward compatible
- **PATCH** (0.0.X) - Bug fixes, backward compatible

### Examples

- `1.0.0` → `1.0.1` - Bug fix release
- `1.0.1` → `1.1.0` - New feature release
- `1.1.0` → `2.0.0` - Breaking change release

## Troubleshooting

### "Working directory is not clean"

Commit or stash your changes before releasing:

```bash
git status
git add .
git commit -m "Your commit message"
```

### "Tests failed"

Fix failing tests before releasing:

```bash
npm test
npm run lint:js
npm run lint:css
```

### "Version already exists"

The version tag already exists. Either:
- Use a different version number
- Delete the existing tag (not recommended)

## Post-Release

After a successful release:

1. **Announce** - Share the release notes with your team
2. **Monitor** - Watch for issues in the new version
3. **Document** - Update any external documentation
4. **Plan** - Start planning the next release

## Emergency Hotfix

For urgent fixes to production (main):

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/X.Y.Z

# Make fixes and commit
git add .
git commit -m "fix: Emergency fix description"

# Run release process
node scripts/agents/release-scaffold.agent.js --version=X.Y.Z

# Merge to main
git checkout main
git merge hotfix/X.Y.Z --no-ff
git push origin main
git push origin vX.Y.Z

# Merge back to develop
git checkout develop
git merge hotfix/X.Y.Z --no-ff
git push origin develop

# Delete hotfix branch
git branch -d hotfix/X.Y.Z
```

## References

- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
