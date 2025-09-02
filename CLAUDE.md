# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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