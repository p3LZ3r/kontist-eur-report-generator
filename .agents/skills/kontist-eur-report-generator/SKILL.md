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

Follow these commit message conventions based on 148 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `refactor`
- `ui`
- `chore`
- `fix`

### Message Guidelines

- Average message length: ~82 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
feat: add kontist-eur-report-generator ECC bundle (.claude/commands/feature-development-command-docs.md)
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
feat: add kontist-eur-report-generator ECC bundle (.claude/commands/add-or-update-ecc-bundle.md)
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

**Frequency**: ~30 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Example commit sequence**:
```
feat: add kontist-eur-report-generator ECC bundle (.codex/agents/reviewer.toml)
feat: add kontist-eur-report-generator ECC bundle (.codex/agents/explorer.toml)
feat: add kontist-eur-report-generator ECC bundle (.codex/agents/docs-researcher.toml)
```

### Add Or Update Ecc Bundle

Adds or updates an ECC bundle for the kontist-eur-report-generator skill, including documentation, identity, tools, and skill metadata.

**Frequency**: ~4 times per month

**Steps**:
1. Add or update .claude/commands/add-or-update-ecc-bundle.md
2. Add or update .claude/identity.json
3. Add or update .claude/ecc-tools.json
4. Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
5. Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
6. Optionally update .agents/skills/kontist-eur-report-generator/agents/openai.yaml

**Files typically involved**:
- `.claude/commands/add-or-update-ecc-bundle.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.agents/skills/kontist-eur-report-generator/SKILL.md`
- `.claude/skills/kontist-eur-report-generator/SKILL.md`
- `.agents/skills/kontist-eur-report-generator/agents/openai.yaml`

**Example commit sequence**:
```
Add or update .claude/commands/add-or-update-ecc-bundle.md
Add or update .claude/identity.json
Add or update .claude/ecc-tools.json
Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
Optionally update .agents/skills/kontist-eur-report-generator/agents/openai.yaml
```

### Add Or Update Feature Development Command

Adds or updates documentation and implementation for the feature development command related to kontist-eur-report-generator.

**Frequency**: ~3 times per month

**Steps**:
1. Add or update .claude/commands/feature-development-command-docs.md
2. Add or update .claude/commands/feature-development.md

**Files typically involved**:
- `.claude/commands/feature-development-command-docs.md`
- `.claude/commands/feature-development.md`

**Example commit sequence**:
```
Add or update .claude/commands/feature-development-command-docs.md
Add or update .claude/commands/feature-development.md
```

### Add Or Update Codex Agents

Adds or updates agent configuration files for docs-researcher, reviewer, and explorer in the .codex/agents directory.

**Frequency**: ~4 times per month

**Steps**:
1. Add or update .codex/agents/docs-researcher.toml
2. Add or update .codex/agents/reviewer.toml
3. Add or update .codex/agents/explorer.toml

**Files typically involved**:
- `.codex/agents/docs-researcher.toml`
- `.codex/agents/reviewer.toml`
- `.codex/agents/explorer.toml`

**Example commit sequence**:
```
Add or update .codex/agents/docs-researcher.toml
Add or update .codex/agents/reviewer.toml
Add or update .codex/agents/explorer.toml
```

### Add Or Update Skill Documentation

Adds or updates the SKILL.md documentation for the kontist-eur-report-generator skill in both .agents and .claude directories.

**Frequency**: ~4 times per month

**Steps**:
1. Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
2. Add or update .claude/skills/kontist-eur-report-generator/SKILL.md

**Files typically involved**:
- `.agents/skills/kontist-eur-report-generator/SKILL.md`
- `.claude/skills/kontist-eur-report-generator/SKILL.md`

**Example commit sequence**:
```
Add or update .agents/skills/kontist-eur-report-generator/SKILL.md
Add or update .claude/skills/kontist-eur-report-generator/SKILL.md
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
