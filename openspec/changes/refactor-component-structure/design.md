# Design: Component Refactoring Architecture

## Overview

This design document outlines the architectural approach for refactoring the monolithic `EuerGenerator.tsx` component (1002 lines) into a maintainable, modular structure following React best practices.

## Architecture Principles

### 1. Feature-Based Organization
Components are organized by feature rather than type, keeping related code together:

```
src/components/euer-generator/
├── EuerGenerator.tsx          # Feature orchestrator
├── HeroSection.tsx           # Feature component
├── FileUploadSection.tsx     # Feature component
└── hooks/                    # Feature hooks
    ├── useFileUpload.ts
    └── useDemoData.ts
```

**Benefits:**
- Easier to locate related functionality
- Clearer feature boundaries
- Better code cohesion

### 2. Container/Presentational Pattern

**Container (EuerGenerator.tsx):**
- Manages application state
- Handles business logic coordination
- Orchestrates data flow between components
- ~200-250 lines

**Presentational Components:**
- Receive data via props
- Focus on UI rendering
- Minimal internal state
- Highly reusable

### 3. Custom Hooks for Business Logic

Extract stateful logic into reusable, testable hooks:

```typescript
// useFileUpload.ts - Encapsulates file upload logic
const useFileUpload = () => {
  const handleFileUpload = async (file: File) => { /* ... */ }
  const validateCSV = (content: string) => { /* ... */ }
  return { handleFileUpload, validateCSV, isLoading, error }
}

// useEuerState.ts - Consolidates main state
const useEuerState = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<CategoryMapping[]>([])
  // ... 8 more state variables
  return { transactions, setTransactions, categories, setCategories, /* ... */ }
}
```

**Benefits:**
- Business logic separated from UI
- Hooks can be tested independently
- Logic can be reused across components

## Component Breakdown

### 1. EuerGenerator.tsx (Main Orchestrator)
**Responsibility:** Application state management and layout orchestration

**Before:** 1002 lines with everything mixed together
**After:** ~200-250 lines

**Structure:**
```typescript
export default function EuerGenerator() {
  // Custom hooks for state and business logic
  const state = useEuerState()
  const fileUpload = useFileUpload()
  const demoData = useDemoData()
  const pagination = usePagination(state.transactions)

  // Minimal orchestration logic
  const handleReset = () => { /* ... */ }

  // Render sub-components
  return (
    <div>
      <HeroSection />
      <FileUploadSection
        onUpload={fileUpload.handleFileUpload}
        onLoadDemo={demoData.loadDemo}
      />
      <PrivacyInfoSection />
      {state.transactions.length > 0 && (
        <>
          <TransactionList
            transactions={pagination.currentItems}
            pagination={pagination}
          />
          <ElsterView calculation={state.calculation} />
        </>
      )}
      <Footer />
    </div>
  )
}
```

### 2. HeroSection.tsx (~54 lines)
**Responsibility:** Display marketing hero with Kontist/Holvi logos

**Props:** None (pure presentational)

**Structure:**
```typescript
export function HeroSection() {
  return (
    <div className="hero-section">
      <h1>EÜR Report Generator</h1>
      <div className="logos">
        <img src="kontist-logo.svg" alt="Kontist" />
        <img src="holvi-logo.svg" alt="Holvi" />
      </div>
    </div>
  )
}
```

### 3. FileUploadSection.tsx (~135 lines)
**Responsibility:** File upload UI with 3-step guide and dropzone

**Props:**
```typescript
interface FileUploadSectionProps {
  onUpload: (file: File) => Promise<void>
  onLoadDemo: () => void
  isLoading?: boolean
  error?: string
}
```

**Structure:**
- 3-step instructions
- Drag-and-drop file upload
- Demo data button
- Error display

### 4. PrivacyInfoSection.tsx (~50 lines)
**Responsibility:** Privacy feature cards explaining data handling

**Props:** None (pure presentational)

**Structure:**
- Card grid layout
- Privacy feature highlights (client-side processing, no data storage, etc.)

### 5. TransactionList.tsx (~210 lines)
**Responsibility:** Transaction display with table/list view and pagination

**Props:**
```typescript
interface TransactionListProps {
  transactions: Transaction[]
  categories: CategoryMapping[]
  onCategoryChange: (transactionId: string, categoryId: string) => void
  pagination: {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    onPageChange: (page: number) => void
  }
  viewMode: 'table' | 'list'
  onViewModeChange: (mode: 'table' | 'list') => void
}
```

**Structure:**
- View mode toggle (table/list)
- Transaction rows with category dropdowns
- Pagination controls
- Transaction summary

### 6. ElsterView.tsx (~55 lines)
**Responsibility:** ELSTER guidance system wrapper

**Props:**
```typescript
interface ElsterViewProps {
  calculation: EuerCalculation
  onFieldClick: (fieldId: string) => void
}
```

**Structure:**
- Navigation sidebar integration
- Field groups display
- Field detail modal integration

### 7. Footer.tsx (~35 lines)
**Responsibility:** Legal links and GitHub link

**Props:** None (pure presentational)

**Structure:**
- Legal links (Impressum, Datenschutz)
- GitHub repository link
- KoFi support widget

## Custom Hooks Design

### 1. useFileUpload.ts
**Purpose:** Encapsulate file upload and CSV parsing logic

**API:**
```typescript
interface UseFileUploadReturn {
  handleFileUpload: (file: File) => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}
```

**Internal Logic:**
- CSV parsing (Kontist/Holvi format detection)
- Transaction validation
- Automatic categorization
- Error handling

### 2. useDemoData.ts
**Purpose:** Handle demo data loading

**API:**
```typescript
interface UseDemoDataReturn {
  loadDemo: () => void
  isLoading: boolean
  error: string | null
}
```

**Internal Logic:**
- Fetch demo CSV from public directory
- Parse and categorize demo transactions
- Error handling

### 3. useEuerState.ts
**Purpose:** Consolidate main application state

**API:**
```typescript
interface UseEuerStateReturn {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  categories: CategoryMapping[]
  setCategories: (categories: CategoryMapping[]) => void
  calculation: EuerCalculation | null
  // ... 6 more state variables
}
```

**Internal Logic:**
- Centralized state management for 10 state variables
- Memoized calculations
- State reset functionality

### 4. usePagination.ts
**Purpose:** Handle pagination calculations

**API:**
```typescript
interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  currentItems: Transaction[]
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setItemsPerPage: (count: number) => void
}
```

**Internal Logic:**
- Calculate page ranges
- Handle page navigation
- Items per page configuration

## Data Flow

```
User Action
    ↓
EuerGenerator (Orchestrator)
    ↓
Custom Hooks (Business Logic)
    ↓
State Updates
    ↓
Sub-Components (UI Rendering)
    ↓
User sees updated UI
```

## State Management Strategy

### Current Issues
- 10 useState hooks scattered throughout component
- State updates mixed with UI rendering logic
- Hard to track state dependencies

### Solution
- Consolidate related state in `useEuerState` hook
- Keep state updates in custom hooks
- Pass only necessary state to sub-components
- Use props drilling for shallow hierarchies (avoid Context for now)

## Performance Considerations

### Existing Optimizations to Preserve
- `useMemo` for expensive calculations (EÜR calculation, field grouping)
- `useCallback` for event handlers passed to child components
- Memoization of transaction filtering and pagination

### New Optimizations
- `React.memo` for pure presentational components (HeroSection, Footer)
- Lazy loading for heavy components if needed
- Code splitting for ELSTER view if bundle size grows

## Testing Strategy

### Unit Tests
- **Custom Hooks:** Test with `@testing-library/react-hooks`
  - `useFileUpload.test.ts` - CSV parsing, validation, error handling
  - `usePagination.test.ts` - Pagination calculations
  - `useEuerState.test.ts` - State management logic

- **Components:** Test with `@testing-library/react`
  - `HeroSection.test.tsx` - Renders correctly
  - `FileUploadSection.test.tsx` - File upload interactions
  - `TransactionList.test.tsx` - Transaction display and pagination

### Integration Tests
- Test data flow between EuerGenerator and sub-components
- Test state updates propagating correctly
- Test user interactions triggering correct state changes

### E2E Tests
- Existing E2E tests should pass without modification
- Add new E2E tests for component interactions if needed

## Migration Strategy

### Phase 1: Extract Custom Hooks
1. Create hooks directory
2. Extract business logic into hooks
3. Update EuerGenerator to use hooks
4. Test thoroughly

### Phase 2: Extract Presentational Components
1. Create component files
2. Copy UI code from EuerGenerator
3. Define props interfaces
4. Update EuerGenerator to use components
5. Test after each extraction

### Phase 3: Cleanup and Optimization
1. Remove extracted code from EuerGenerator
2. Add React.memo where beneficial
3. Update documentation
4. Final testing pass

## Backwards Compatibility

### External API
- No changes to `<EuerGenerator />` component API
- Can be used as drop-in replacement
- All existing props work identically

### Internal Breaking Changes
- None - this is purely internal refactoring
- No changes to data structures or calculations
- No changes to export functionality

## Success Criteria

1. ✅ EuerGenerator.tsx reduced from 1002 to ~200-250 lines
2. ✅ All 6 sub-components created and functional
3. ✅ All 4 custom hooks created and tested
4. ✅ All existing E2E tests pass
5. ✅ No performance regressions
6. ✅ Linter and TypeScript compiler pass
7. ✅ Code is more maintainable and testable

## Future Enhancements

After this refactoring is complete, future improvements could include:

- Add unit tests for new components and hooks
- Implement React Context for deeply nested state if needed
- Add Storybook for component documentation
- Consider code splitting for ELSTER view
- Extract reusable UI components to shared library
