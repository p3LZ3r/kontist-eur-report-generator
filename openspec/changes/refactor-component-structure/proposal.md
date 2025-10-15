# Proposal: Refactor Component Structure

## Why

The `EuerGenerator.tsx` component has grown to **1002 lines**, making it difficult to maintain, test, and reason about. This monolithic component violates the Single Responsibility Principle and contains multiple concerns that should be separated:

1. **State management** (10 useState hooks, multiple useEffect/useMemo)
2. **File upload logic** (CSV parsing, validation, error handling)
3. **Demo data loading**
4. **Hero section** with marketing content
5. **File upload UI** with instructions
6. **Privacy information section**
7. **Transaction list view** with pagination
8. **ELSTER guidance system view**
9. **Footer with legal links**

This refactoring will improve:
- **Maintainability**: Smaller, focused components are easier to understand and modify
- **Testability**: Isolated components can be tested independently
- **Reusability**: Extracted components can be reused in other contexts
- **Performance**: Smaller component trees reduce unnecessary re-renders
- **Developer experience**: Easier to navigate and locate specific functionality

## What Changes

### File Structure Changes

**Create new component directory structure:**
```
src/components/
├── euer-generator/              # Feature folder
│   ├── EuerGenerator.tsx        # Main orchestrator (state + layout)
│   ├── HeroSection.tsx          # Marketing hero with logos
│   ├── FileUploadSection.tsx    # Upload UI with instructions
│   ├── PrivacyInfoSection.tsx   # Privacy feature cards
│   ├── TransactionList.tsx      # Transaction view with pagination
│   ├── ElsterView.tsx           # ELSTER guidance view
│   └── Footer.tsx               # Legal links footer
├── euer-generator/hooks/        # Custom hooks
│   ├── useFileUpload.ts         # File upload & validation logic
│   ├── useDemoData.ts           # Demo data loading
│   ├── useEuerState.ts          # Main app state management
│   └── usePagination.ts         # Pagination logic
```

**Extract logical sections into sub-components:**
1. `HeroSection.tsx` (~54 lines) - Hero with Kontist/Holvi logos
2. `FileUploadSection.tsx` (~135 lines) - 3-step guide + upload dropzone
3. `PrivacyInfoSection.tsx` (~50 lines) - Privacy feature cards
4. `TransactionList.tsx` (~210 lines) - Table/list view with pagination
5. `ElsterView.tsx` (~55 lines) - ELSTER guidance system wrapper
6. `Footer.tsx` (~35 lines) - Legal links and GitHub link

**Extract business logic into custom hooks:**
1. `useFileUpload.ts` - CSV validation, parsing, categorization
2. `useDemoData.ts` - Demo data loading logic
3. `useEuerState.ts` - Consolidated state management
4. `usePagination.ts` - Pagination calculations

**Final EuerGenerator.tsx**: ~200-250 lines (down from 1002)

### Code Organization Principles

- **Feature-based folder structure**: Group related components together
- **Container/Presentational pattern**: Separate logic from UI
- **Custom hooks for business logic**: Extract stateful logic into reusable hooks
- **Props drilling prevention**: Pass only necessary props
- **Memoization preservation**: Keep existing useMemo/useCallback optimizations

## Impact

### Affected Files
- `src/components/EuerGenerator.tsx` - **REFACTOR** into smaller orchestrator
- **NEW**: 6 new component files in `src/components/euer-generator/`
- **NEW**: 4 new custom hook files in `src/components/euer-generator/hooks/`
- `src/App.tsx` - Import path update (if needed)

### Affected Specs
- `component-organization` (new capability) - Component architecture standards

### Developer Impact
- **Positive**: Easier to navigate, test, and maintain codebase
- **Positive**: Better code organization following React best practices
- **Neutral**: Need to update imports if working on EuerGenerator features
- **No breaking changes**: External API remains the same

### Testing Impact
- Existing E2E tests should pass without modification
- Opportunity to add unit tests for extracted components
- Custom hooks can be tested in isolation

### Performance Impact
- **Neutral/Positive**: Same memoization strategy, potentially better re-render isolation
- No additional network requests or computations
