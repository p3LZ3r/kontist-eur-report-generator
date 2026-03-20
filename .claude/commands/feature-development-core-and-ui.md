---
name: feature-development-core-and-ui
description: Workflow command scaffold for feature-development-core-and-ui in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-core-and-ui

Use this workflow when working on **feature-development-core-and-ui** in `kontist-eur-report-generator`.

## Goal

Implements new features or major enhancements affecting both core logic and UI components, often with supporting tests and documentation.

## Common Files

- `src/components/*.tsx`
- `src/components/ui/*.tsx`
- `src/data/*.ts`
- `src/data/*.json`
- `src/utils/*.ts`
- `src/test/*.test.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update or add core logic files (e.g., calculation engines, data mappings, utilities)
- Update or add UI components (e.g., src/components/*, src/components/ui/*)
- Update or add supporting data files (e.g., src/data/*, public/data/*)
- Update or add tests (e.g., src/test/*)
- Update configuration/build files if needed (e.g., package.json, vite.config.ts)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.