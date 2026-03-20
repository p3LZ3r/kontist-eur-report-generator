---
name: add-or-update-ecc-bundle
description: Workflow command scaffold for add-or-update-ecc-bundle in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-ecc-bundle

Use this workflow when working on **add-or-update-ecc-bundle** in `kontist-eur-report-generator`.

## Goal

Adds or updates an ECC bundle for kontist-eur-report-generator, including commands, skills, identity, and agent configuration files.

## Common Files

- `.claude/commands/add-ecc-bundle.md`
- `.claude/commands/feature-development.md`
- `.claude/commands/refactoring.md`
- `.claude/commands/feature-development-core-and-ui.md`
- `.claude/commands/add-or-update-ecc-bundle.md`
- `.claude/identity.json`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/*.md files (such as add-ecc-bundle.md, feature-development.md, refactoring.md, feature-development-core-and-ui.md, add-or-update-ecc-bundle.md)
- Add or update .claude/identity.json
- Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
- Add or update .claude/ecc-tools.json
- Add or update .agents/skills/kontist-eur-report-generator/SKILL.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.