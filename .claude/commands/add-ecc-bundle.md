---
name: add-ecc-bundle
description: Workflow command scaffold for add-ecc-bundle in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-ecc-bundle

Use this workflow when working on **add-ecc-bundle** in `kontist-eur-report-generator`.

## Goal

Adds or updates an ECC bundle for kontist-eur-report-generator, including skill definitions, identity, commands, and agent configs.

## Common Files

- `.claude/commands/feature-development.md`
- `.claude/commands/feature-development-core-and-ui.md`
- `.claude/commands/refactoring.md`
- `.claude/identity.json`
- `.claude/skills/kontist-eur-report-generator/SKILL.md`
- `.claude/ecc-tools.json`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/feature-development.md
- Add or update .claude/commands/feature-development-core-and-ui.md
- Add or update .claude/commands/refactoring.md
- Add or update .claude/identity.json
- Add or update .claude/skills/kontist-eur-report-generator/SKILL.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.