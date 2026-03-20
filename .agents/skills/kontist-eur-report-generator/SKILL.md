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

Follow these commit message conventions based on 71 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `refactor`
- `ui`
- `chore`
- `fix`

### Message Guidelines

- Average message length: ~74 characters
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

**Frequency**: ~20 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/components/*`
- `src/components/ui/*`
- `src/test/*`
- `**/*.test.*`

**Example commit sequence**:
```
feat(payment): implement compliant purchase flow for ELSTER access
refactor(payment): remove Polar.sh payment integration and gating
fix: remove unused imports Shield and Info from EuerGenerator.tsx
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
refactor(components): remove help modal functionality
feat(payment): implement compliant purchase flow for ELSTER access
refactor(payment): remove Polar.sh payment integration and gating
```

### Feature Development Core And Ui

Implements new features or major enhancements affecting both core logic and UI components, often with supporting tests and documentation.

**Frequency**: ~2 times per month

**Steps**:
1. Update or add core logic files (e.g., calculation engines, data mappings, utilities)
2. Update or add UI components (e.g., src/components/*, src/components/ui/*)
3. Update or add supporting data files (e.g., src/data/*, public/data/*)
4. Update or add tests (e.g., src/test/*)
5. Update configuration/build files if needed (e.g., package.json, vite.config.ts)
6. Optionally update documentation (e.g., AGENTS.md, CLAUDE.md)

**Files typically involved**:
- `src/components/*.tsx`
- `src/components/ui/*.tsx`
- `src/data/*.ts`
- `src/data/*.json`
- `src/utils/*.ts`
- `src/test/*.test.tsx`
- `src/test/*.test.ts`
- `package.json`
- `vite.config.ts`
- `AGENTS.md`
- `CLAUDE.md`

**Example commit sequence**:
```
Update or add core logic files (e.g., calculation engines, data mappings, utilities)
Update or add UI components (e.g., src/components/*, src/components/ui/*)
Update or add supporting data files (e.g., src/data/*, public/data/*)
Update or add tests (e.g., src/test/*)
Update configuration/build files if needed (e.g., package.json, vite.config.ts)
Optionally update documentation (e.g., AGENTS.md, CLAUDE.md)
```

### Ui Component Refactor Or Enhancement

Refactors or enhances UI components for improved layout, styling, or modularity without major changes to business logic.

**Frequency**: ~3 times per month

**Steps**:
1. Modify one or more UI component files (e.g., src/components/*.tsx, src/components/ui/*.tsx)
2. Update related utility or style files if necessary (e.g., src/index.css, tailwind.config.js)
3. Optionally update related documentation or feature description files

**Files typically involved**:
- `src/components/*.tsx`
- `src/components/ui/*.tsx`
- `src/index.css`
- `tailwind.config.js`

**Example commit sequence**:
```
Modify one or more UI component files (e.g., src/components/*.tsx, src/components/ui/*.tsx)
Update related utility or style files if necessary (e.g., src/index.css, tailwind.config.js)
Optionally update related documentation or feature description files
```

### Test Enhancement Or Coverage Increase

Improves or expands test coverage, optimizes test logic, or updates mock data for reliability.

**Frequency**: ~2 times per month

**Steps**:
1. Update or add test files (e.g., src/test/*.test.tsx, src/test/*.test.ts)
2. Update or add supporting mock data or utility files
3. Optionally update test configuration (e.g., vitest.config.ts)

**Files typically involved**:
- `src/test/*.test.tsx`
- `src/test/*.test.ts`
- `vitest.config.ts`

**Example commit sequence**:
```
Update or add test files (e.g., src/test/*.test.tsx, src/test/*.test.ts)
Update or add supporting mock data or utility files
Optionally update test configuration (e.g., vitest.config.ts)
```

### Dependency And Toolchain Upgrade

Upgrades build tools, dependencies, or configuration files to newer versions or alternative toolchains.

**Frequency**: ~1 times per month

**Steps**:
1. Update package.json and package-lock.json
2. Update or add configuration files for new tools (e.g., vite.config.ts, vitest.config.ts, biome.jsonc, .oxlintrc.json)
3. Update or refactor scripts or build-related files
4. Update documentation to reflect new toolchain

**Files typically involved**:
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `vitest.config.ts`
- `biome.jsonc`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `README.md`
- `CLAUDE.md`

**Example commit sequence**:
```
Update package.json and package-lock.json
Update or add configuration files for new tools (e.g., vite.config.ts, vitest.config.ts, biome.jsonc, .oxlintrc.json)
Update or refactor scripts or build-related files
Update documentation to reflect new toolchain
```

### Legal And Compliance Pages Update

Adds or updates legal compliance pages (Impressum, Datenschutz, FAQ) and related SEO or manifest files.

**Frequency**: ~1 times per month

**Steps**:
1. Add or update legal page components (e.g., src/components/Impressum.tsx, Datenschutz.tsx, FAQ.tsx)
2. Update index.html with SEO meta tags and analytics
3. Update manifest and robots.txt/sitemap.xml as needed
4. Optionally update documentation

**Files typically involved**:
- `src/components/Impressum.tsx`
- `src/components/Datenschutz.tsx`
- `src/components/FAQ.tsx`
- `index.html`
- `public/manifest.json`
- `public/robots.txt`
- `public/sitemap.xml`

**Example commit sequence**:
```
Add or update legal page components (e.g., src/components/Impressum.tsx, Datenschutz.tsx, FAQ.tsx)
Update index.html with SEO meta tags and analytics
Update manifest and robots.txt/sitemap.xml as needed
Optionally update documentation
```

### Payment Or Access Gating Refactor

Implements, refactors, or removes payment gating logic for premium features (e.g., ELSTER export), including UI and state management updates.

**Frequency**: ~1 times per month

**Steps**:
1. Add, update, or remove payment modal/component (e.g., PaymentModal.tsx)
2. Update EuerGenerator and related components to handle payment state and gating
3. Update or remove export functionality as needed
4. Update UI components for new access logic
5. Update dependencies if payment SDKs are added/removed

**Files typically involved**:
- `src/components/PaymentModal.tsx`
- `src/components/EuerGenerator.tsx`
- `src/components/FieldGroups.tsx`
- `src/components/NavigationSidebar.tsx`
- `src/components/ui/card.tsx`
- `src/utils/exportUtils.ts`
- `package.json`

**Example commit sequence**:
```
Add, update, or remove payment modal/component (e.g., PaymentModal.tsx)
Update EuerGenerator and related components to handle payment state and gating
Update or remove export functionality as needed
Update UI components for new access logic
Update dependencies if payment SDKs are added/removed
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
