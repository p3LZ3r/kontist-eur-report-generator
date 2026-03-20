---
name: feature-development-core-and-ui
description: Workflow command scaffold for feature-development-core-and-ui in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-core-and-ui

Use this workflow when working on **feature-development-core-and-ui** in `kontist-eur-report-generator`.

## Goal

Implements or enhances core calculation logic and associated UI components, often including data mapping, utility updates, and test coverage.

## Common Files

- `src/utils/euerCalculations.ts`
- `src/utils/reportGenerator.ts`
- `src/components/EuerGenerator.tsx`
- `src/components/FieldGroups.tsx`
- `src/components/TransactionRow.tsx`
- `src/data/skr03.json`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update or refactor core calculation utilities (e.g., euerCalculations.ts, reportGenerator.ts).
- Modify or add UI components (e.g., EuerGenerator.tsx, FieldGroups.tsx, TransactionRow.tsx).
- Update or add supporting data files (e.g., skr03.json, skr04.json, demo-transactions.ts).
- Update or add tests for new or changed logic (e.g., euerCalculations.test.ts, FieldGroups.test.tsx).
- Update configuration or type files as needed (e.g., constants.ts, types/index.ts).

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.