---
description: Prompt template for creating scaffold releases - used by release-scaffold agent
---

# Create Release Scaffold Prompt

This prompt defines the interactive **Release Scaffold Wizard** for the scaffold release creation workflow. All `release-scaffold.*` processes and agents must use this wizard as the central workflow for release scaffolding.

---

## 🚀 Release Scaffold Interactive Wizard

The Release Scaffold Wizard guides you step-by-step through preparing and publishing a new scaffold release. Use this wizard for all release-scaffold.* processes, including automation and manual runs.

### Wizard Steps

1. **Select Release Type**
	- [ ] Major (breaking changes)
	- [ ] Minor (features, no breaking changes)
	- [ ] Patch (bugfixes only)

2. **Set Version**
	- Enter new version (e.g. `v1.1.0`):
	- Validate against semantic versioning

3. **Prepare Changelog**
	- Confirm `CHANGELOG.md` is updated for this version
	- Option to auto-generate or edit changelog

4. **Tag & Push**
	- Check if git tag exists locally and on remote
	- Option to create and push tag if missing

5. **Draft Release Notes**
	- Use mustache values for dynamic content (e.g. `{{version}}`, `{{date}}`)
	- Preview and edit release notes

6. **Configure Release Options**
	- Set as latest release? [Y/n]
	- Mark as pre-release? [y/N]
	- Create discussion? [optional]

7. **Publish Release**
	- Confirm all details
	- Publish via GitHub UI, CLI, or API

8. **Post-Release Tasks**
	- Announce release
	- Monitor issues
	- Plan next version

---

## Usage

- All `release-scaffold.*` files and agents must reference this wizard for release creation.
- The wizard supports both interactive and automated (scripted) flows.
- Mustache values in release notes must be registered in the mustache registry (see `scripts/scan-mustache-variables.js`).

For the full agent specification, see [.github/agents/release-scaffold.agent.md](../agents/release-scaffold.agent.md).
