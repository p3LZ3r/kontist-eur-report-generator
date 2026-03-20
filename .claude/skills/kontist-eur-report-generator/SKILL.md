---
name: kontist-eur-report-generator-conventions
description: Development conventions and patterns for kontist-eur-report-generator. TypeScript Vite project with conventional commits.
---

# Kontist Eur Report Generator Conventions

> Generated from [p3LZ3r/kontist-eur-report-generator](https://github.com/p3LZ3r/kontist-eur-report-generator) on 2026-03-20

## Overview

This skill teaches Claude the development patterns and conventions used in kontist-eur-report-generator.

## Tech Stack

- **Primary Language**: TypeScript
- **Framework**: Vite
- **Architecture**: type-based module organization
- **Test Location**: colocated
- **Test Framework**: playwright

## When to Use This Skill

Activate this skill when:
- Making changes to this repository
- Adding new features following established patterns
- Writing tests that match project conventions
- Creating commits with proper message format

## Commit Conventions

Follow these commit message conventions based on 82 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `refactor`
- `ui`
- `chore`
- `fix`

### Message Guidelines

- Average message length: ~76 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
feat: add kontist-eur-report-generator ECC bundle (.claude/commands/feature-development-core-and-ui.md)
```

*Commit message example*

```text
chore: replace Biome/Ultracite with Vite+ Oxlint/Oxfmt, update deps and docs
```

*Commit message example*

```text
test(integration): replace forEach with for-of loops and optimize test logging
```

*Commit message example*

```text
refactor(config): restructure component imports and update local settings
```

*Commit message example*

```text
ui(fields): center field number badge, narrow cell (w-8) and add slight horizontal padding (px-1)
```

*Commit message example*

```text
feat: add kontist-eur-report-generator ECC bundle (.claude/commands/refactoring.md)
```

*Commit message example*

```text
feat: add kontist-eur-report-generator ECC bundle (.claude/commands/feature-development.md)
```

*Commit message example*

```text
feat: add kontist-eur-report-generator ECC bundle (.codex/agents/docs-researcher.toml)
```

## Architecture

### Project Structure: Single Package

This project uses **type-based** module organization.

### Source Layout

```
src/
├── components/
├── data/
├── lib/
├── test/
├── types/
├── utils/
```

### Entry Points

- `src/App.tsx`
- `src/main.tsx`

### Configuration Files

- `.github/workflows/ci.yml`
- `.github/workflows/claude-code-review.yml`
- `.github/workflows/claude.yml`
- `.github/workflows/deploy.yml`
- `package.json`
- `playwright.config.ts`
- `tailwind.config.js`
- `tsconfig.json`
- `vercel.json`
- `vite.config.ts`

### Guidelines

- Group code by type (components, services, utils)
- Keep related functionality in the same type folder
- Avoid circular dependencies between type folders

## Code Style

### Language: TypeScript

### Naming Conventions

| Element | Convention |
|---------|------------|
| Files | camelCase |
| Functions | camelCase |
| Classes | PascalCase |
| Constants | SCREAMING_SNAKE_CASE |

### Import Style: Relative Imports

### Export Style: Default Exports


*Preferred import style*

```typescript
// Use relative imports
import { Button } from '../components/Button'
import { useAuth } from './hooks/useAuth'
```

*Preferred export style*

```typescript
// Use default exports for main component/function
export default function UserProfile() { ... }
```

## Testing

### Test Framework: playwright

### File Pattern: `*.test.ts`

### Test Types

- **Unit tests**: Test individual functions and components in isolation
- **E2e tests**: Test complete user flows through the application

### Mocking: vi.mock

### Coverage

This project has coverage reporting configured. Aim for 80%+ coverage.


## Error Handling

### Error Handling Style: Try-Catch Blocks


*Standard error handling pattern*

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('User-friendly message')
}
```

## Common Workflows

These workflows were detected from analyzing commit patterns.

### Feature Development

Standard feature implementation workflow

**Frequency**: ~23 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/components/*`
- `src/utils/*`
- `src/*`
- `**/*.test.*`

**Example commit sequence**:
```
ui(fields): center field number badge, narrow cell (w-8) and add slight horizontal padding (px-1)
feat(ui): add Ko-fi support widget and refactor legal page layouts
feat(ui): add expandable transaction details and improve UI interactions
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~7 times per month

**Steps**:
1. Ensure tests pass before refactor
2. Refactor code structure
3. Verify tests still pass

**Files typically involved**:
- `src/**/*`

**Example commit sequence**:
```
feat(ui): add demo mode and refactor transaction components
refactor(ui): remove transaction and ELSTER views from EuerGenerator
feat(elster): enhance field handling and demo data
```

### Feature Development Core And Ui

Implements or enhances core calculation logic and associated UI components, often including data mapping, utility updates, and test coverage.

**Frequency**: ~2 times per month

**Steps**:
1. Update or refactor core calculation utilities (e.g., euerCalculations.ts, reportGenerator.ts).
2. Modify or add UI components (e.g., EuerGenerator.tsx, FieldGroups.tsx, TransactionRow.tsx).
3. Update or add supporting data files (e.g., skr03.json, skr04.json, demo-transactions.ts).
4. Update or add tests for new or changed logic (e.g., euerCalculations.test.ts, FieldGroups.test.tsx).
5. Update configuration or type files as needed (e.g., constants.ts, types/index.ts).
6. Update dependencies and build configs if required (e.g., package.json, vite.config.ts).

**Files typically involved**:
- `src/utils/euerCalculations.ts`
- `src/utils/reportGenerator.ts`
- `src/components/EuerGenerator.tsx`
- `src/components/FieldGroups.tsx`
- `src/components/TransactionRow.tsx`
- `src/data/skr03.json`
- `src/data/skr04.json`
- `src/data/demo-transactions.ts`
- `src/test/euerCalculations.test.ts`
- `src/test/FieldGroups.test.tsx`
- `src/utils/constants.ts`
- `src/types/index.ts`
- `package.json`
- `vite.config.ts`

**Example commit sequence**:
```
Update or refactor core calculation utilities (e.g., euerCalculations.ts, reportGenerator.ts).
Modify or add UI components (e.g., EuerGenerator.tsx, FieldGroups.tsx, TransactionRow.tsx).
Update or add supporting data files (e.g., skr03.json, skr04.json, demo-transactions.ts).
Update or add tests for new or changed logic (e.g., euerCalculations.test.ts, FieldGroups.test.tsx).
Update configuration or type files as needed (e.g., constants.ts, types/index.ts).
Update dependencies and build configs if required (e.g., package.json, vite.config.ts).
```

### Ui Component Refinement

Iterative improvement of UI component appearance, layout, and interactivity, often through a series of small, focused commits.

**Frequency**: ~4 times per month

**Steps**:
1. Edit a specific UI component file (e.g., FieldGroups.tsx) to adjust styling or layout.
2. Optionally update related components (e.g., NavigationSidebar.tsx) for consistency.
3. Commit small, descriptive changes (e.g., badge styling, font stack, padding).

**Files typically involved**:
- `src/components/FieldGroups.tsx`
- `src/components/NavigationSidebar.tsx`

**Example commit sequence**:
```
Edit a specific UI component file (e.g., FieldGroups.tsx) to adjust styling or layout.
Optionally update related components (e.g., NavigationSidebar.tsx) for consistency.
Commit small, descriptive changes (e.g., badge styling, font stack, padding).
```

### Toolchain And Config Upgrade

Upgrade or migrate build tools, linters, or project configuration, often with dependency updates and documentation changes.

**Frequency**: ~1 times per month

**Steps**:
1. Update package.json and package-lock.json with new dependencies.
2. Modify or add toolchain config files (e.g., vite.config.ts, biome.jsonc, .oxlintrc.json).
3. Update documentation to reflect toolchain changes (e.g., README.md, CLAUDE.md).
4. Optionally refactor scripts or test configs to match new toolchain.

**Files typically involved**:
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `biome.jsonc`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `README.md`
- `CLAUDE.md`

**Example commit sequence**:
```
Update package.json and package-lock.json with new dependencies.
Modify or add toolchain config files (e.g., vite.config.ts, biome.jsonc, .oxlintrc.json).
Update documentation to reflect toolchain changes (e.g., README.md, CLAUDE.md).
Optionally refactor scripts or test configs to match new toolchain.
```

### Test Enhancement And Maintenance

Improve or refactor test files and test-related utilities, often optimizing performance or updating for new features.

**Frequency**: ~2 times per month

**Steps**:
1. Edit or add test files (e.g., performance.test.ts, FieldGroups.test.tsx, euerCalculations.test.ts).
2. Update test utilities or mock data as needed.
3. Adjust test configuration files (e.g., vitest.config.ts).

**Files typically involved**:
- `src/test/performance.test.ts`
- `src/test/FieldGroups.test.tsx`
- `src/test/NavigationSidebar.test.tsx`
- `src/test/euerCalculations.test.ts`
- `src/test/exportUtils.test.ts`
- `vitest.config.ts`

**Example commit sequence**:
```
Edit or add test files (e.g., performance.test.ts, FieldGroups.test.tsx, euerCalculations.test.ts).
Update test utilities or mock data as needed.
Adjust test configuration files (e.g., vitest.config.ts).
```

### Documentation And Guidelines Update

Update project documentation, coding standards, or agent guidelines for clarity and onboarding.

**Frequency**: ~2 times per month

**Steps**:
1. Edit or add markdown documentation files (e.g., AGENTS.md, CLAUDE.md, SKILL.md).
2. Optionally update configuration or identity files (e.g., identity.json).

**Files typically involved**:
- `AGENTS.md`
- `CLAUDE.md`
- `.claude/skills/kontist-eur-report-generator/SKILL.md`
- `.agents/skills/kontist-eur-report-generator/SKILL.md`
- `.codex/AGENTS.md`
- `.claude/identity.json`

**Example commit sequence**:
```
Edit or add markdown documentation files (e.g., AGENTS.md, CLAUDE.md, SKILL.md).
Optionally update configuration or identity files (e.g., identity.json).
```


## Best Practices

Based on analysis of the codebase, follow these practices:

### Do

- Use conventional commit format (feat:, fix:, etc.)
- Write tests using playwright
- Follow *.test.ts naming pattern
- Use camelCase for file names
- Prefer default exports

### Don't

- Don't write vague commit messages
- Don't skip tests for new features
- Don't deviate from established patterns without discussion

---

*This skill was auto-generated by [ECC Tools](https://ecc.tools). Review and customize as needed for your team.*
