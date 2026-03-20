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

Follow these commit message conventions based on 93 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `refactor`
- `ui`
- `chore`
- `fix`

### Message Guidelines

- Average message length: ~78 characters
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

**Frequency**: ~27 times per month

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
feat: enhance CSV handling and sanitization
Enhance performance tests and mock data setup
feat(config): remove kilo taskmaster rules and update CSP directives
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~5 times per month

**Steps**:
1. Ensure tests pass before refactor
2. Refactor code structure
3. Verify tests still pass

**Files typically involved**:
- `src/**/*`

**Example commit sequence**:
```
feat: enhance CSV handling and sanitization
Enhance performance tests and mock data setup
feat(config): remove kilo taskmaster rules and update CSP directives
```

### Add Or Update Ecc Bundle

Adds or updates the kontist-eur-report-generator ECC bundle, including agent, skill, and command definitions for Claude and Codex systems.

**Frequency**: ~3 times per month

**Steps**:
1. Add or update .claude/commands/feature-development-core-and-ui.md
2. Add or update .claude/commands/feature-development.md
3. Add or update .claude/commands/refactoring.md
4. Add or update .claude/identity.json
5. Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
6. Add or update .claude/ecc-tools.json
7. Add or update .codex/agents/docs-researcher.toml
8. Add or update .codex/agents/reviewer.toml
9. Add or update .codex/agents/explorer.toml
10. Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
11. Add or update .agents/skills/kontist-eur-report-generator/agents/openai.yaml

**Files typically involved**:
- `.claude/commands/feature-development-core-and-ui.md`
- `.claude/commands/feature-development.md`
- `.claude/commands/refactoring.md`
- `.claude/identity.json`
- `.claude/skills/kontist-eur-report-generator/SKILL.md`
- `.claude/ecc-tools.json`
- `.codex/agents/docs-researcher.toml`
- `.codex/agents/reviewer.toml`
- `.codex/agents/explorer.toml`
- `.agents/skills/kontist-eur-report-generator/SKILL.md`
- `.agents/skills/kontist-eur-report-generator/agents/openai.yaml`

**Example commit sequence**:
```
Add or update .claude/commands/feature-development-core-and-ui.md
Add or update .claude/commands/feature-development.md
Add or update .claude/commands/refactoring.md
Add or update .claude/identity.json
Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
Add or update .claude/ecc-tools.json
Add or update .codex/agents/docs-researcher.toml
Add or update .codex/agents/reviewer.toml
Add or update .codex/agents/explorer.toml
Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
Add or update .agents/skills/kontist-eur-report-generator/agents/openai.yaml
```

### Core Feature Development And Refactor

Implements or refactors major core features, updates calculation engines, UI components, data mappings, and improves test coverage.

**Frequency**: ~2 times per month

**Steps**:
1. Update core calculation logic in src/utils/euerCalculations.ts and related utils
2. Update or add UI components in src/components/ and src/components/euer-generator/
3. Update data mapping files in src/data/ and public/data/
4. Update or add tests in src/test/
5. Update configuration files (tsconfig.json, vite.config.ts, tailwind.config.js, etc.)
6. Update dependencies in package.json and package-lock.json
7. Update documentation files (AGENTS.md, CLAUDE.md, etc.)

**Files typically involved**:
- `src/utils/euerCalculations.ts`
- `src/components/`
- `src/components/euer-generator/`
- `src/data/`
- `public/data/`
- `src/test/`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.js`
- `package.json`
- `package-lock.json`
- `AGENTS.md`
- `CLAUDE.md`

**Example commit sequence**:
```
Update core calculation logic in src/utils/euerCalculations.ts and related utils
Update or add UI components in src/components/ and src/components/euer-generator/
Update data mapping files in src/data/ and public/data/
Update or add tests in src/test/
Update configuration files (tsconfig.json, vite.config.ts, tailwind.config.js, etc.)
Update dependencies in package.json and package-lock.json
Update documentation files (AGENTS.md, CLAUDE.md, etc.)
```

### Asset And Favicon Update

Adds or updates favicon and image assets, updates HTML metadata, and enhances image generation scripts for branding and PWA compatibility.

**Frequency**: ~2 times per month

**Steps**:
1. Add or update favicon and image files in public/
2. Update index.html to reference new icons and metadata
3. Update or add scripts for image/favicons generation in scripts/
4. Update or add UI components for app icons (src/components/ui/app-icon.tsx, .md)
5. Update dependencies in package.json and package-lock.json if needed

**Files typically involved**:
- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon-48x48.png`
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/og-image.png`
- `index.html`
- `scripts/generate-favicon.mjs`
- `scripts/generate-images.mjs`
- `src/components/ui/app-icon.tsx`
- `src/components/ui/app-icon.md`
- `package.json`
- `package-lock.json`

**Example commit sequence**:
```
Add or update favicon and image files in public/
Update index.html to reference new icons and metadata
Update or add scripts for image/favicons generation in scripts/
Update or add UI components for app icons (src/components/ui/app-icon.tsx, .md)
Update dependencies in package.json and package-lock.json if needed
```

### Test Suite Enhancement

Enhances or adds tests, updates mock data, and improves test reliability and configuration.

**Frequency**: ~2 times per month

**Steps**:
1. Update or add test files in src/test/
2. Update test configuration files (vitest.config.ts, etc.)
3. Update or add mock data in src/data/ or within test files
4. Refactor test logic for better reliability or performance

**Files typically involved**:
- `src/test/FieldGroups.test.tsx`
- `src/test/NavigationSidebar.test.tsx`
- `src/test/categoryMappings.test.ts`
- `src/test/euerCalculations.test.ts`
- `src/test/exportUtils.test.ts`
- `src/test/performance.test.ts`
- `vitest.config.ts`
- `src/data/`

**Example commit sequence**:
```
Update or add test files in src/test/
Update test configuration files (vitest.config.ts, etc.)
Update or add mock data in src/data/ or within test files
Refactor test logic for better reliability or performance
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
