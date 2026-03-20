---
name: add-or-update-command-md
description: Workflow command scaffold for add-or-update-command-md in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-command-md

Use this workflow when working on **add-or-update-command-md** in `kontist-eur-report-generator`.

## Goal

Adds or updates a command markdown file under .claude/commands, such as for feature development or refactoring.

## Common Files

- `.claude/commands/feature-development.md`
- `.claude/commands/refactoring.md`
- `.claude/commands/feature-development-core-and-ui.md`
- `.claude/commands/add-ecc-bundle.md`
- `.claude/commands/add-or-update-ecc-bundle.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update a .claude/commands/*.md file (e.g., feature-development.md, refactoring.md, feature-development-core-and-ui.md, add-ecc-bundle.md, add-or-update-ecc-bundle.md)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.