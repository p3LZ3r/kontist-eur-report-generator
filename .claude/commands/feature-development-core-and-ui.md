---
name: feature-development-core-and-ui
description: Workflow command scaffold for feature-development-core-and-ui in kontist-eur-report-generator.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-core-and-ui

Use this workflow when working on **feature-development-core-and-ui** in `kontist-eur-report-generator`.

## Goal

Implements or enhances core calculation logic and/or UI components, often together, including updates to calculation utilities, UI components, and types. Frequently includes test updates and data file changes.

## Common Files

- `src/utils/euerCalculations.ts`
- `src/utils/eurFieldsLoader.ts`
- `src/utils/constants.ts`
- `src/components/EuerGenerator.tsx`
- `src/components/FieldGroups.tsx`
- `src/components/TransactionRow.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update or refactor calculation utilities (e.g., src/utils/euerCalculations.ts, src/utils/eurFieldsLoader.ts, src/utils/constants.ts)
- Update or add UI components (e.g., src/components/EuerGenerator.tsx, src/components/FieldGroups.tsx, src/components/TransactionRow.tsx, src/components/TransactionRowMobile.tsx, src/components/NavigationSidebar.tsx)
- Update or add data files (e.g., src/data/demo-transactions.ts, src/data/skr03.json, src/data/skr04.json, src/data/skr49.json)
- Update or add type definitions (src/types/index.ts)
- Update or add tests (src/test/*.test.tsx, src/test/*.test.ts)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.