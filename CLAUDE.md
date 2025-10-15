<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## EXTREMELY IMPORTANT: Code Quality Checks

**ALWAYS run the following commands before completing any task:**

Automatically use the IDE's built-in diagnostics tool to check for linting and type errors:
   - Run `mcp__ide__getDiagnostics` to check all files for diagnostics
   - Fix any linting or type errors before considering the task complete
   - Do this for any file you create or modify

This is a CRITICAL step that must NEVER be skipped when working on any code-related task.

## Look up documentation with Context7

When code examples, setup or configuration steps, or library/API documentation are requested, use the Context7 mcp server to get the information.

## Rule Improvement Triggers

- New code patterns not covered by existing rules
- Repeated similar implementations across files
- Common error patterns that could be prevented
- New libraries or tools being used consistently
- Emerging best practices in the codebase

# Analysis Process:
- Compare new code with existing rules
- Identify patterns that should be standardized
- Look for references to external documentation
- Check for consistent error handling patterns
- Monitor test patterns and coverage

# Rule Updates:

- **Add New Rules When:**
  - A new technology/pattern is used in 3+ files
  - Common bugs could be prevented by a rule
  - Code reviews repeatedly mention the same feedback
  - New security or performance patterns emerge

- **Modify Existing Rules When:**
  - Better examples exist in the codebase
  - Additional edge cases are discovered
  - Related rules have been updated
  - Implementation details have changed

- **Example Pattern Recognition:**

  ```typescript
  // If you see repeated patterns like:
  const data = await prisma.user.findMany({
    select: { id: true, email: true },
    where: { status: 'ACTIVE' }
  });

  // Consider adding to [prisma.mdc](mdc:shipixen/.cursor/rules/prisma.mdc):
  // - Standard select fields
  // - Common where conditions
  // - Performance optimization patterns
  ```

- **Rule Quality Checks:**
- Rules should be actionable and specific
- Examples should come from actual code
- References should be up to date
- Patterns should be consistently enforced

## Continuous Improvement:

- Monitor code review comments
- Track common development questions
- Update rules after major refactors
- Add links to relevant documentation
- Cross-reference related rules

## Rule Deprecation

- Mark outdated patterns as deprecated
- Remove rules that no longer apply
- Update references to deprecated rules
- Document migration paths for old patterns

## Documentation Updates:

- Keep examples synchronized with code
- Update references to external docs
- Maintain links between related rules
- Document breaking changes

## Development Commands

### Core Development
```bash
npm run dev          # Start Vite development server at localhost:5173
npm run build        # Build for production (runs TypeScript compiler and Vite build)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality checks
```

### Testing
```bash
npm run test         # Run Vitest unit tests
npm run test:ui      # Run Vitest with interactive UI
npm run test:e2e     # Run Playwright end-to-end tests
npm run test:e2e:ui  # Run Playwright tests with UI
```

## Project Architecture

This is a React/TypeScript application for generating German EÜR (Einnahmen-Überschuss-Rechnung) reports from Kontist and Holvi bank transaction data. The application processes CSV exports, categorizes transactions according to SKR accounting standards, and generates ELSTER-compliant tax reports.

### Core Domain Logic

**EÜR Calculations** (`src/utils/euerCalculations.ts`)
- Main calculation engine with VAT separation logic
- Kleinunternehmer vs regular business handling
- ELSTER field mapping and validation
- Functions: `calculateEuer()`, `generateElsterOverview()`, `populateAllElsterFields()`

**Category Mappings** (`src/utils/categoryMappings.ts`) 
- SKR03/SKR04/SKR49 chart of accounts mappings
- ELSTER field assignments for each category
- Dynamic category loading from JSON files
- VAT rate configuration per category

**Transaction Processing** (`src/utils/transactionUtils.ts`)
- CSV parsing for Kontist and Holvi formats
- Automatic transaction categorization using keyword detection
- Bank format detection

### Data Flow Architecture

1. **CSV Upload & Parsing**: CSV files → Transaction objects with automatic categorization
2. **Category Assignment**: User can override automatic categories via dropdowns  
3. **EÜR Calculation**: Transactions + categories → EÜR calculation with VAT separation
4. **ELSTER Export**: EÜR data → Multiple export formats (CSV, JSON, PDF reports)

### Key Data Types (`src/types/index.ts`)

- `Transaction`: Bank transaction with categorization
- `EuerCalculation`: Complete EÜR results including VAT breakdown
- `ElsterFieldValue`: ELSTER form field with validation metadata
- `CategoryMapping`: SKR category with type and VAT rate

### UI Architecture

**Main Component**: `EuerGenerator.tsx` - Orchestrates the entire workflow
- File upload and processing
- Transaction categorization interface with pagination
- ELSTER guidance system with navigation
- Multiple export options

**ELSTER Guidance System**:
- `NavigationSidebar.tsx`: Progress tracking and section navigation
- `FieldGroups.tsx`: Organized display of ELSTER fields
- `FieldDetailModal.tsx`: Drill-down into transaction details

### Export Capabilities

- **Legacy Text Export**: Traditional EÜR summary format
- **ELSTER CSV**: Direct import into ELSTER software  
- **ELSTER JSON**: Structured data for integration
- **Detailed PDF Reports**: Complete transaction listings with calculations

### SKR Standards Support

The application supports multiple German accounting standards:
- **SKR03**: Industry and trade businesses
- **SKR04**: Service businesses (default)
- **SKR49**: Freelancers and professionals

Categories are loaded dynamically from `/public/data/{skr}.json` files with fallback to hardcoded SKR04 definitions.

### VAT Handling

Critical business logic for German tax compliance:
- **Kleinunternehmer (§19 UStG)**: No VAT separation, gross amounts used
- **Regular businesses**: VAT separated using category-specific rates
- Automatic ELSTER VAT field population (fields 23, 24, 44-46)

### Testing Strategy

- **Unit Tests**: Core calculation and utility functions
- **E2E Tests**: Complete user workflow from upload to export
- **Performance Tests**: Large transaction file processing

## Technology Stack Overview

### Core Framework & Runtime
- **React 19.1.1** - Latest stable React with concurrent features, improved error boundaries, and new hooks. Excellent choice for modern development.
- **TypeScript 5.8.3** - Latest TypeScript with improved type inference, better performance, and enhanced developer experience.
- **Vite 7.1.2** - Ultra-fast build tool with native ES modules, excellent HMR, and optimized production builds.

### UI & Styling Architecture
- **Tailwind CSS 4.1.12** - Latest major version with improved performance, better IntelliSense, and new features. Excellent for utility-first styling.
- **@tailwindcss/vite 4.1.12** - Official Vite plugin for optimal Tailwind integration.
- **tailwindcss-animate 1.0.7** - Animation utilities for smooth UI transitions.
- **tailwind-merge 3.3.1** - Intelligent Tailwind class merging for dynamic styling.

### Component System
- **@radix-ui/react-*** - Comprehensive unstyled component library:
  - `react-checkbox 1.3.3` - Accessible checkbox components
  - `react-dialog 1.1.15` - Modal and dialog primitives
  - `react-select 2.2.6` - Advanced select/dropdown components
  - `react-slot 1.2.3` - Composition utilities for flexible components
- **lucide-react 0.542.0** - Modern icon library with 1000+ SVG icons, tree-shakeable and customizable.
- **class-variance-authority 0.7.1** - Type-safe variant API for component styling.
- **clsx 2.1.1** - Lightweight utility for conditionally joining classNames.

### Development & Build Tools
- **@vitejs/plugin-react 5.0.0** - Official React plugin for Vite with Fast Refresh support.
- **Autoprefixer 10.4.21** - PostCSS plugin for vendor prefix automation.
- **PostCSS 8.5.6** - CSS transformation toolkit.

### Testing Infrastructure
- **Vitest 3.2.4** - Vite-native test runner with Jest compatibility and excellent performance.
- **@testing-library/react 16.3.0** - React testing utilities following best practices.
- **@testing-library/jest-dom 6.8.0** - Custom Jest matchers for DOM elements.
- **@testing-library/user-event 14.6.1** - Advanced user interaction simulation.
- **@playwright/test 1.55.0** - End-to-end testing framework for reliable cross-browser testing.
- **jsdom 26.1.0** - DOM implementation for Node.js testing environment.

### Code Quality & Linting
- **ESLint 9.33.0** - Latest ESLint with flat config support and improved performance.
- **typescript-eslint 8.39.1** - TypeScript-specific linting rules and parser.
- **eslint-plugin-react-hooks 5.2.0** - React Hooks linting rules.
- **eslint-plugin-react-refresh 0.4.20** - Fast Refresh compatibility checks.

### Development Utilities
- **@types/node 24.3.0** - Node.js type definitions.
- **@types/react 19.1.10** - React type definitions matching the runtime version.
- **@types/react-dom 19.1.7** - React DOM type definitions.
- **globals 16.3.0** - Global identifier definitions for ESLint.

### Version Analysis & Best Practices

#### ✅ Excellent Version Choices
- **React 19.1.1**: Latest stable with cutting-edge features like concurrent rendering improvements
- **TypeScript 5.8.3**: Latest with excellent tooling support and performance improvements
- **Vite 7.1.2**: Latest major version with significant performance improvements
- **Tailwind CSS 4.1.12**: Latest major version with CSS-first architecture

#### ⚠️ Considerations
- **Radix UI**: All versions are current and stable, excellent for accessibility
- **Testing Library**: Versions are well-aligned and follow current best practices
- **ESLint 9.x**: Using the latest major version with flat config (modern approach)

#### 🔧 Recommended Practices
1. **React 19**: Take advantage of concurrent features and improved error boundaries
2. **TypeScript**: Utilize strict mode for better type safety
3. **Tailwind 4**: Leverage the new CSS-first architecture for better performance
4. **Vite**: Use the built-in optimizations for dependency pre-bundling
5. **Testing**: Maintain the comprehensive testing setup with unit + E2E coverage

#### 📦 Dependency Management
- All dependencies are pinned to specific versions (good for reproducibility)
- No major version conflicts detected
- Development and runtime dependencies are properly separated
- Modern toolchain with excellent TypeScript integration throughout

This stack represents a modern, performant, and maintainable architecture suitable for production applications.

## Project Directory Structure & File Organization

### 📁 Source Directory Overview
```
src/
├── assets/           # Static assets
├── components/       # React components
│   └── ui/          # Reusable UI primitives
├── data/            # Static data files
├── lib/             # Shared library utilities
├── test/            # Test files
├── types/           # TypeScript type definitions
└── utils/           # Business logic utilities
```

### 🎯 Core Application Files
- **`main.tsx`** - Application entry point and React root mounting
- **`App.tsx`** - Main application wrapper with routing and layout
- **`App.css`** - Application-specific styles
- **`index.css`** - Global styles, Tailwind imports, and CSS custom properties
- **`vite-env.d.ts`** - Vite environment type declarations

### 🧩 Components Architecture

#### **Main Application Components** (`/components/`)
- **`EuerGenerator.tsx`** - 🏗️ **CORE COMPONENT** - Main application orchestrator handling:
  - CSV file upload and processing
  - Transaction categorization interface
  - ELSTER guidance system
  - Export functionality
- **`FieldGroups.tsx`** - ELSTER field display with collapsible sections (matches real ELSTER design)
- **`NavigationSidebar.tsx`** - Progress tracking and section navigation for ELSTER guidance
- **`FieldDetailModal.tsx`** - Detailed view for individual ELSTER fields with transaction drill-down
- **`HelpModal.tsx`** - Contextual help system for user guidance
- **`HelpTooltip.tsx`** - Inline help tooltips for form elements

#### **UI Primitives** (`/components/ui/`)
Built on Radix UI for accessibility and customizability:
- **`button.tsx`** - Button component with variants
- **`card.tsx`** - Card layout components (Card, CardHeader, CardContent)
- **`select.tsx`** - Dropdown select components
- **`checkbox.tsx`** - Form checkbox components
- **`input.tsx`** - Text input components
- **`badge.tsx`** - Status and category badges
- **`alert.tsx`** - Alert and notification components
- **`sheet.tsx`** - Side panel/drawer components
- **`table.tsx`** - Data table components

### 🗂️ Data & Configuration

#### **Static Data** (`/data/`)
- **`skr03.json`** - SKR03 accounting categories (Industry/Trade)
- **`skr04.json`** - SKR04 accounting categories (Services) - **DEFAULT**
- **`skr49.json`** - SKR49 accounting categories (Freelancers)

#### **Assets** (`/assets/`)
- **`react.svg`** - React logo for UI

### 🔧 Business Logic & Utilities

#### **Core Business Logic** (`/utils/`)
- **`euerCalculations.ts`** - 💰 **CALCULATION ENGINE**
  - Main EÜR calculation logic
  - VAT separation for Kleinunternehmer vs regular businesses
  - ELSTER field population and validation
- **`categoryMappings.ts`** - 📊 **CATEGORY SYSTEM**
  - SKR account mappings
  - ELSTER field assignments
  - VAT rate configurations
- **`transactionUtils.ts`** - 📋 **DATA PROCESSING**
  - CSV parsing (Kontist/Holvi formats)
  - Automatic transaction categorization
  - Bank format detection
- **`guidanceUtils.ts`** - 🧭 **UI GUIDANCE SYSTEM**
  - Navigation section creation
  - Field grouping logic
  - Progress calculation
- **`exportUtils.ts`** - 📄 **EXPORT FUNCTIONALITY**
  - Multiple export formats (CSV, JSON, PDF)
  - ELSTER-compatible file generation
- **`reportGenerator.ts`** - 📈 **REPORT GENERATION**
  - PDF report creation
  - Transaction summaries
- **`constants.ts`** - 🎯 **CONFIGURATION**
  - ELSTER field definitions
  - Field ranges and categories
  - Application constants
- **`dataLoader.ts`** - 📥 **DATA LOADING**
  - Dynamic SKR category loading
  - Fallback handling

#### **Shared Utilities** (`/lib/`)
- **`utils.ts`** - Common utility functions (className merging, etc.)

### 🧪 Testing Infrastructure (`/test/`)
- **`setup.ts`** - Test environment configuration
- **`euerCalculations.test.ts`** - Core calculation logic tests
- **`exportUtils.test.ts`** - Export functionality tests
- **`FieldGroups.test.tsx`** - Component rendering tests
- **`NavigationSidebar.test.tsx`** - Navigation component tests
- **`performance.test.ts`** - Performance and load testing

### 📝 Type Definitions (`/types/`)
- **`index.ts`** - 🎯 **CENTRAL TYPE DEFINITIONS**
  - `Transaction` - Bank transaction with categorization
  - `EuerCalculation` - Complete EÜR calculation results
  - `ElsterFieldValue` - ELSTER form field with metadata
  - `CategoryMapping` - SKR category definitions
  - `FieldGroup` - UI field grouping structure
  - `NavigationSection` - Guidance system structure

### 🏗️ Architecture Principles

#### **Data Flow**
1. **Input Layer**: CSV upload → `transactionUtils.ts`
2. **Processing Layer**: Category assignment → `categoryMappings.ts`
3. **Business Logic**: EÜR calculation → `euerCalculations.ts`
4. **UI Layer**: ELSTER guidance → `guidanceUtils.ts` + components
5. **Output Layer**: Export generation → `exportUtils.ts`

#### **Component Hierarchy**
```
App.tsx
└── EuerGenerator.tsx (Main orchestrator)
    ├── NavigationSidebar.tsx
    ├── FieldGroups.tsx
    ├── FieldDetailModal.tsx
    └── HelpModal.tsx
```

#### **Separation of Concerns**
- **Components**: Pure UI logic and user interaction
- **Utils**: Business logic and data processing
- **Types**: Type safety and contracts
- **Data**: Static configuration and reference data
- **Test**: Quality assurance and regression prevention

This structure ensures maintainability, testability, and clear separation between UI, business logic, and data layers.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
