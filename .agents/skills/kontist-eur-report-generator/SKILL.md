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

Follow these commit message conventions based on 57 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `refactor`
- `ui`
- `chore`
- `fix`

### Message Guidelines

- Average message length: ~70 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
chore: replace Biome/Ultracite with Vite+ Oxlint/Oxfmt, update deps and docs
```

*Commit message example*

```text
feat(ui): add app icon to hero section and enhance image generation scripts
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
chore: migrate to Vite+ toolchain (Vite 8, unified config)
```

*Commit message example*

```text
feat(assets): add favicon support and remove placeholder images
```

*Commit message example*

```text
feat(core): implement major data structure updates and performance enhancements
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

**Frequency**: ~14 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/components/*`
- `src/test/*`
- `src/utils/*`
- `**/*.test.*`

**Example commit sequence**:
```
build(deps): add polar sdk and update taskmaster config
refactor(ui): simplify UI components and align ELSTER integration
"Claude PR Assistant workflow"
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~9 times per month

**Steps**:
1. Ensure tests pass before refactor
2. Refactor code structure
3. Verify tests still pass

**Files typically involved**:
- `src/**/*`

**Example commit sequence**:
```
refactor(ui): simplify UI components and align ELSTER integration
"Claude PR Assistant workflow"
"Claude Code Review workflow"
```

### Feature Development Core And Ui

Implements or enhances core calculation logic and/or UI components, often together, including updates to calculation utilities, UI components, and types. Frequently includes test updates and data file changes.

**Frequency**: ~2 times per month

**Steps**:
1. Update or refactor calculation utilities (e.g., src/utils/euerCalculations.ts, src/utils/eurFieldsLoader.ts, src/utils/constants.ts)
2. Update or add UI components (e.g., src/components/EuerGenerator.tsx, src/components/FieldGroups.tsx, src/components/TransactionRow.tsx, src/components/TransactionRowMobile.tsx, src/components/NavigationSidebar.tsx)
3. Update or add data files (e.g., src/data/demo-transactions.ts, src/data/skr03.json, src/data/skr04.json, src/data/skr49.json)
4. Update or add type definitions (src/types/index.ts)
5. Update or add tests (src/test/*.test.tsx, src/test/*.test.ts)
6. Update dependencies or configuration as needed (package.json, package-lock.json, tsconfig.json)

**Files typically involved**:
- `src/utils/euerCalculations.ts`
- `src/utils/eurFieldsLoader.ts`
- `src/utils/constants.ts`
- `src/components/EuerGenerator.tsx`
- `src/components/FieldGroups.tsx`
- `src/components/TransactionRow.tsx`
- `src/components/TransactionRowMobile.tsx`
- `src/components/NavigationSidebar.tsx`
- `src/data/demo-transactions.ts`
- `src/data/skr03.json`
- `src/data/skr04.json`
- `src/data/skr49.json`
- `src/types/index.ts`
- `src/test/*.test.tsx`
- `src/test/*.test.ts`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

**Example commit sequence**:
```
Update or refactor calculation utilities (e.g., src/utils/euerCalculations.ts, src/utils/eurFieldsLoader.ts, src/utils/constants.ts)
Update or add UI components (e.g., src/components/EuerGenerator.tsx, src/components/FieldGroups.tsx, src/components/TransactionRow.tsx, src/components/TransactionRowMobile.tsx, src/components/NavigationSidebar.tsx)
Update or add data files (e.g., src/data/demo-transactions.ts, src/data/skr03.json, src/data/skr04.json, src/data/skr49.json)
Update or add type definitions (src/types/index.ts)
Update or add tests (src/test/*.test.tsx, src/test/*.test.ts)
Update dependencies or configuration as needed (package.json, package-lock.json, tsconfig.json)
```

### Ui Component Refactor Or Enhancement

Refactors, simplifies, or enhances UI components, often focusing on layout, styling, or modularization. May include extraction of components, layout changes, or style tweaks.

**Frequency**: ~2 times per month

**Steps**:
1. Modify or extract UI components (e.g., src/components/FieldGroups.tsx, src/components/NavigationSidebar.tsx, src/components/TransactionRow.tsx, src/components/TransactionRowMobile.tsx)
2. Adjust or add CSS/styles (src/index.css, tailwind.config.js)
3. Update related utility files if needed (src/utils/guidanceUtils.ts)
4. Update or remove related props/types (src/types/index.ts)

**Files typically involved**:
- `src/components/FieldGroups.tsx`
- `src/components/NavigationSidebar.tsx`
- `src/components/TransactionRow.tsx`
- `src/components/TransactionRowMobile.tsx`
- `src/index.css`
- `tailwind.config.js`
- `src/utils/guidanceUtils.ts`
- `src/types/index.ts`

**Example commit sequence**:
```
Modify or extract UI components (e.g., src/components/FieldGroups.tsx, src/components/NavigationSidebar.tsx, src/components/TransactionRow.tsx, src/components/TransactionRowMobile.tsx)
Adjust or add CSS/styles (src/index.css, tailwind.config.js)
Update related utility files if needed (src/utils/guidanceUtils.ts)
Update or remove related props/types (src/types/index.ts)
```

### Test Enhancement And Maintenance

Improves, refactors, or adds tests for calculation logic, UI, or performance. Often includes updating test data and configuration.

**Frequency**: ~1 times per month

**Steps**:
1. Update or add test files (src/test/*.test.tsx, src/test/*.test.ts)
2. Update or mock test data (src/data/demo-transactions.ts, src/data/skr04.json, etc.)
3. Adjust test configuration (vitest.config.ts)
4. Refactor test utilities or logging (integration-test.js)

**Files typically involved**:
- `src/test/*.test.tsx`
- `src/test/*.test.ts`
- `src/data/demo-transactions.ts`
- `src/data/skr03.json`
- `src/data/skr04.json`
- `src/data/skr49.json`
- `vitest.config.ts`
- `integration-test.js`

**Example commit sequence**:
```
Update or add test files (src/test/*.test.tsx, src/test/*.test.ts)
Update or mock test data (src/data/demo-transactions.ts, src/data/skr04.json, etc.)
Adjust test configuration (vitest.config.ts)
Refactor test utilities or logging (integration-test.js)
```

### Dependency And Tooling Upgrade

Upgrades dependencies, build tools, or code quality tools (e.g., switching from Biome/Ultracite to Vite+Oxlint, updating package.json, updating configs). May include related documentation updates.

**Frequency**: ~1 times per month

**Steps**:
1. Update package.json and package-lock.json
2. Update or replace tool configuration files (e.g., vite.config.ts, vitest.config.ts, biome.jsonc, .oxlintrc.json, .oxfmtrc.json)
3. Update related documentation (README.md, AGENTS.md, CLAUDE.md)
4. Update or remove old config files
5. Update scripts or integration files as needed

**Files typically involved**:
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `vitest.config.ts`
- `biome.jsonc`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`

**Example commit sequence**:
```
Update package.json and package-lock.json
Update or replace tool configuration files (e.g., vite.config.ts, vitest.config.ts, biome.jsonc, .oxlintrc.json, .oxfmtrc.json)
Update related documentation (README.md, AGENTS.md, CLAUDE.md)
Update or remove old config files
Update scripts or integration files as needed
```

### Configuration And Deployment Update

Updates deployment configuration (e.g., vercel.json), CI/CD workflows, or project settings. May include security headers, routing, or GitHub Actions.

**Frequency**: ~1 times per month

**Steps**:
1. Update deployment config (vercel.json)
2. Update or add CI/CD workflow files (.github/workflows/*.yml)
3. Update project or tool settings (.claude/settings.local.json, .taskmaster/config.json, .taskmaster/tasks/tasks.json)
4. Update documentation if needed (DEPLOYMENT.md)

**Files typically involved**:
- `vercel.json`
- `.github/workflows/*.yml`
- `.claude/settings.local.json`
- `.taskmaster/config.json`
- `.taskmaster/tasks/tasks.json`
- `DEPLOYMENT.md`

**Example commit sequence**:
```
Update deployment config (vercel.json)
Update or add CI/CD workflow files (.github/workflows/*.yml)
Update project or tool settings (.claude/settings.local.json, .taskmaster/config.json, .taskmaster/tasks/tasks.json)
Update documentation if needed (DEPLOYMENT.md)
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
