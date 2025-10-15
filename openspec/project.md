# Project Context

## Purpose

This is a React/TypeScript web application for generating **EÜR (Einnahmen-Überschuss-Rechnung)** reports from Kontist and Holvi bank transactions. The application:

- Processes CSV transaction exports from German banking providers (Kontist, Holvi)
- Automatically categorizes transactions according to German SKR accounting standards (SKR03, SKR04, SKR49)
- Calculates EÜR with proper VAT handling for both Kleinunternehmer (§19 UStG) and regular businesses
- Generates ELSTER-compliant tax reports for direct submission to German tax authorities
- Provides multiple export formats: CSV, JSON, and detailed PDF reports

**Primary Goal:** Simplify German tax compliance for small businesses and freelancers by automating transaction categorization and EÜR calculation.

**Business Domain:** Financial accounting and tax compliance for German small businesses and freelancers using Kontist and Holvi banking services.

## Tech Stack

### Core Framework & Runtime
- **React 19.1.1** - Latest stable with concurrent features and improved error boundaries
- **TypeScript 5.8.3** - Latest with improved type inference and performance
- **Vite 7.1.2** - Ultra-fast build tool with native ES modules and HMR
- **Node.js** - Development environment

### UI & Styling
- **Tailwind CSS 4.1.12** - Latest major version with CSS-first architecture
- **@tailwindcss/vite 4.1.12** - Official Vite plugin
- **tailwindcss-animate 1.0.7** - Animation utilities
- **tailwind-merge 3.3.1** - Intelligent class merging

### Component System
- **Radix UI** (@radix-ui/react-*) - Accessible unstyled component primitives:
  - react-checkbox, react-dialog, react-select, react-slot
- **lucide-react 0.542.0** - Modern SVG icon library (1000+ icons)
- **class-variance-authority 0.7.1** - Type-safe variant API
- **clsx 2.1.1** - Conditional className utility

### Testing Infrastructure
- **Vitest 3.2.4** - Vite-native test runner with Jest compatibility
- **@testing-library/react 16.3.0** - React testing utilities
- **@playwright/test 1.55.0** - End-to-end testing framework
- **jsdom 26.1.0** - DOM implementation for Node.js testing

### Code Quality
- **ESLint 9.33.0** - Latest with flat config support
- **typescript-eslint 8.39.1** - TypeScript linting rules
- **eslint-plugin-react-hooks 5.2.0** - React Hooks linting

### Package Manager
- **npm** - Official Node.js package manager

## Project Conventions

### Code Style

- **Indentation:** 2 spaces
- **Formatting:** ESLint configuration with Prettier-compatible rules
- **Naming Conventions:**
  - Variables, functions: `camelCase` (e.g., `calculateEuer`, `transactionData`)
  - Components, Types: `PascalCase` (e.g., `EuerGenerator`, `Transaction`)
  - Files: `camelCase` with descriptive names (e.g., `euerCalculations.ts`, `categoryMappings.ts`)
  - Constants: `SCREAMING_SNAKE_CASE` (e.g., `VAT_RATES`, `ELSTER_FIELDS`)
- **Import Organization:** External imports first, then internal imports, grouped by type
- **User-Facing Text:** Always in German (German tax compliance application)
- **Comments:** English for code comments, German for user-facing documentation

### Architecture Patterns

**Overall Architecture:** Component-based React single-page application with utility-driven calculations following a unidirectional data flow:

```
CSV Upload → Transaction Parsing → Auto-Categorization → EÜR Calculation → ELSTER Export
```

**Directory Structure:**
```
src/
├── assets/           # Static assets (logos, images)
├── components/       # React components
│   └── ui/          # Reusable UI primitives (shadcn/ui)
├── data/            # Static JSON data (SKR categories)
├── lib/             # Shared library utilities
├── test/            # Unit and integration tests
├── types/           # TypeScript type definitions
└── utils/           # Business logic utilities
```

**Key Principles:**
- **Separation of Concerns:** UI components separate from business logic
- **Functional Programming:** Pure functions for calculations
- **Immutable Data:** State updates create new objects
- **Type Safety:** Strict TypeScript with comprehensive interfaces
- **Modular Design:** Utility functions in separate files
- **Component Composition:** Radix UI primitives + custom components

**Core Architecture Components:**
- **Input Layer:** CSV parsing (`transactionUtils.ts`)
- **Processing Layer:** Category assignment (`categoryMappings.ts`)
- **Business Logic:** EÜR calculation (`euerCalculations.ts`)
- **UI Layer:** ELSTER guidance (`guidanceUtils.ts` + components)
- **Output Layer:** Export generation (`exportUtils.ts`)

### Testing Strategy

**Unit Tests (Vitest):**
- Core calculation functions (`euerCalculations.test.ts`)
- Export utilities (`exportUtils.test.ts`)
- Component rendering tests (`FieldGroups.test.tsx`, `NavigationSidebar.test.tsx`)
- Performance tests (`performance.test.ts`)

**E2E Tests (Playwright):**
- Complete user workflow from CSV upload to export
- Cross-browser testing
- Real user interaction simulation

**Test Commands:**
```bash
npm run test         # Run Vitest unit tests
npm run test:ui      # Run Vitest with interactive UI
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright tests with UI
```

**Coverage Requirements:**
- Core business logic functions must have unit tests
- New features require E2E tests
- Performance tests for large transaction files

### Git Workflow

**Branching Strategy:**
- `main` - Production-ready code
- Feature branches: `feature/description`
- Bugfix branches: `fix/description`

**Commit Conventions:**
- Follow conventional commits format (English)
- Examples: `feat: add ELSTER CSV export`, `fix: VAT calculation for Kleinunternehmer`, `docs: update README`

**Development Workflow:**
```bash
# Standard workflow
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature
# Create PR to main
```

## Domain Context

### German Tax Compliance
This application deals with **German tax law and accounting standards**. Key concepts:

**EÜR (Einnahmen-Überschuss-Rechnung):**
- Income-surplus calculation for German small businesses
- Alternative to full double-entry bookkeeping
- Required annual submission to tax authorities via ELSTER

**SKR Standards (Standardkontenrahmen):**
- **SKR03:** For industry and trade businesses
- **SKR04:** For service businesses (default in this app)
- **SKR49:** For freelancers and professionals

**VAT Handling:**
- **Kleinunternehmer (§19 UStG):** Small business VAT exemption - no VAT separation, gross amounts used
- **Regular businesses:** VAT separated using category-specific rates (19%, 7%, 0%)

**ELSTER System:**
- Official German tax filing system
- Requires specific field mappings and data formats
- Application generates ELSTER-compatible CSV/JSON exports

### Banking Integration
- **Kontist:** German digital bank for freelancers and SMEs
- **Holvi:** Finnish digital banking for European businesses
- Application parses CSV exports from both providers with different formats

## Important Constraints

### Technical Constraints
- **Client-side only:** All processing happens in the browser (no backend)
- **Browser compatibility:** Modern browsers supporting ES2020+
- **File size limits:** Performance tested up to 10,000+ transactions
- **No data persistence:** No database or cloud storage (privacy by design)

### Business Constraints
- **German market focus:** UI and documentation in German
- **Tax compliance:** Must match official ELSTER field definitions
- **Accounting standards:** Must support official SKR03, SKR04, SKR49 mappings

### Regulatory Constraints
- **Privacy:** No user data leaves the browser (GDPR compliant by design)
- **Tax accuracy:** Calculations must match German tax law requirements
- **ELSTER compatibility:** Exports must be directly importable into ELSTER software

### Performance Constraints
- CSV parsing must handle 10,000+ transactions smoothly
- UI must remain responsive during calculations
- Export generation should complete within seconds

## External Dependencies

### Banking Providers
- **Kontist Bank CSV format:** Primary transaction data source
- **Holvi Bank CSV format:** Alternative transaction data source

### German Tax System
- **ELSTER:** Official electronic tax filing system (no direct API, file-based export)
- **SKR Standards:** Official German accounting chart of accounts

### Development Services
- **npm registry:** Package distribution
- **GitHub:** Source code hosting (if applicable)

### Browser APIs
- **File API:** For CSV upload handling
- **Blob API:** For export file generation
- **LocalStorage:** For user preferences (optional)
