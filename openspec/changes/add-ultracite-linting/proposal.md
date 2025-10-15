# Proposal: Add Ultracite as Linting Solution

## Why

The project currently uses ESLint 9 with TypeScript ESLint for code quality, but lacks automated code formatting. Adding Ultracite (built on Biome) will provide:

1. **Faster linting and formatting** - Biome is written in Rust and significantly faster than ESLint/Prettier
2. **Zero configuration** - Ultracite provides 300+ pre-configured rules optimized for React/TypeScript
3. **Unified tooling** - Single tool replaces both ESLint and Prettier
4. **AI-ready** - Optimized for AI code generation tools (Claude Code, GitHub Copilot, Cursor)
5. **Better developer experience** - Instant formatting on save without interrupting workflow

## What Changes

- **Add** `ultracite` package as dev dependency
- **Remove** existing ESLint packages: `@eslint/js`, `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint`, `globals`
- **Remove** `eslint.config.js` configuration file
- **Update** npm scripts: Replace `lint` command with Ultracite commands
- **Add** npm scripts for `format` and `format:check`
- **Update** `.gitignore` to exclude Biome cache
- **Add** GitHub Actions workflow integration (optional)

**Migration Strategy:** ESLint → Ultracite is a complete replacement, no gradual migration needed.

## Impact

### Affected Files
- `package.json` - Remove ESLint deps, add Ultracite, update scripts
- `eslint.config.js` - **REMOVE** (replaced by Ultracite's zero-config)
- `.gitignore` - Add Biome cache exclusion
- `CLAUDE.md` - Update linting command documentation

### Affected Specs
- `code-quality` (new capability) - Linting and formatting standards

### Developer Impact
- **Positive:** Faster linting (10-100x faster than ESLint), unified formatting/linting
- **Neutral:** New CLI commands to learn (`npx ultracite`)
- **Breaking:** Existing ESLint custom rules must be migrated (none currently)

### CI/CD Impact
- Linting will be significantly faster in GitHub Actions
- Potential to remove separate Prettier step if added in future

### Code Style Changes
Ultracite may reformat existing code to match its opinionated rules:
- 2-space indentation (already matches project)
- No semicolons (matches modern JS/TS style)
- Single quotes for strings
- Trailing commas
- Consistent import sorting
