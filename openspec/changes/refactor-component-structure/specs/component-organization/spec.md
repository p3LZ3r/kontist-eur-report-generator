# Component Organization Specification

## ADDED Requirements

### Requirement: Feature-Based Component Structure

The application SHALL organize React components using a feature-based directory structure rather than a type-based structure.

#### Scenario: Feature folder grouping
- **GIVEN** the EuerGenerator feature requires multiple related components
- **WHEN** organizing the component files
- **THEN** all related components SHALL be placed in `src/components/euer-generator/` directory
- **AND** custom hooks specific to the feature SHALL be in `src/components/euer-generator/hooks/` subdirectory
- **AND** the main orchestrator component SHALL be `EuerGenerator.tsx`

#### Scenario: Component discoverability
- **GIVEN** a developer needs to modify the file upload functionality
- **WHEN** navigating the project structure
- **THEN** the developer SHALL find `FileUploadSection.tsx` component in the feature directory
- **AND** the related `useFileUpload.ts` hook SHALL be in the feature's hooks subdirectory
- **AND** all related code SHALL be co-located for easy discovery

### Requirement: Container/Presentational Component Pattern

The application SHALL separate container components (state management) from presentational components (UI rendering).

#### Scenario: Main orchestrator component
- **GIVEN** the EuerGenerator feature requires state coordination
- **WHEN** implementing the main component
- **THEN** `EuerGenerator.tsx` SHALL act as a container component managing state
- **AND** it SHALL not exceed 250 lines of code
- **AND** it SHALL delegate UI rendering to presentational sub-components
- **AND** it SHALL use custom hooks for business logic

#### Scenario: Presentational component design
- **GIVEN** a UI section needs to be rendered (e.g., HeroSection)
- **WHEN** implementing the component
- **THEN** the component SHALL receive all data via props
- **AND** it SHALL not manage complex internal state
- **AND** it SHALL focus solely on UI rendering
- **AND** it SHALL be reusable in different contexts

#### Scenario: Pure presentational components
- **GIVEN** a component has no interactive logic (e.g., HeroSection, Footer)
- **WHEN** the component is implemented
- **THEN** it SHALL accept no props or only styling/content props
- **AND** it SHALL be wrapped with `React.memo` for performance
- **AND** it SHALL have no side effects or state management

### Requirement: Custom Hooks for Business Logic

Complex business logic SHALL be extracted into custom React hooks for reusability and testability.

#### Scenario: File upload logic extraction
- **GIVEN** the file upload functionality requires CSV parsing, validation, and categorization
- **WHEN** implementing the file upload feature
- **THEN** a `useFileUpload` custom hook SHALL encapsulate the logic
- **AND** the hook SHALL return `{ handleFileUpload, isLoading, error, clearError }`
- **AND** the hook SHALL be independently testable
- **AND** the hook SHALL be reusable across components if needed

#### Scenario: State consolidation
- **GIVEN** the main component requires 10 state variables for the EÜR workflow
- **WHEN** organizing state management
- **THEN** a `useEuerState` custom hook SHALL consolidate related state
- **AND** the hook SHALL return state values and setter functions
- **AND** the hook SHALL handle state initialization and reset logic
- **AND** the main component SHALL use the hook to access all state

#### Scenario: Pagination logic extraction
- **GIVEN** transaction lists require pagination functionality
- **WHEN** implementing pagination
- **THEN** a `usePagination` hook SHALL encapsulate pagination calculations
- **AND** the hook SHALL accept items array and configuration as parameters
- **AND** the hook SHALL return `{ currentPage, totalPages, currentItems, goToPage, nextPage, prevPage }`
- **AND** the hook SHALL handle edge cases (empty lists, page bounds)

### Requirement: Component Size Constraints

Individual component files SHALL adhere to size constraints to maintain readability and maintainability.

#### Scenario: Main orchestrator size limit
- **GIVEN** the EuerGenerator main component orchestrates the feature
- **WHEN** the component is fully implemented
- **THEN** the file size SHALL be between 200-250 lines of code
- **AND** any logic exceeding this limit SHALL be extracted to custom hooks or sub-components

#### Scenario: Sub-component size guidelines
- **GIVEN** a sub-component is being implemented (e.g., TransactionList)
- **WHEN** the component exceeds 250 lines
- **THEN** the component SHOULD be further broken down into smaller components
- **OR** complex logic SHOULD be extracted to custom hooks
- **AND** the component SHALL remain focused on a single responsibility

### Requirement: Props Interface Design

Components SHALL define clear, typed props interfaces for type safety and documentation.

#### Scenario: Required props definition
- **GIVEN** a component requires specific data to function (e.g., FileUploadSection)
- **WHEN** defining the component interface
- **THEN** an interface SHALL be defined with all required props
- **AND** the interface SHALL use TypeScript for type safety
- **AND** callback props SHALL be properly typed with parameter and return types

```typescript
interface FileUploadSectionProps {
  onUpload: (file: File) => Promise<void>
  onLoadDemo: () => void
  isLoading?: boolean
  error?: string | null
}
```

#### Scenario: Optional props with defaults
- **GIVEN** a component has optional configuration (e.g., pagination itemsPerPage)
- **WHEN** defining the component interface
- **THEN** optional props SHALL be marked with `?` in the interface
- **AND** default values SHALL be provided in the component implementation
- **AND** the default behavior SHALL be documented in JSDoc comments

### Requirement: Performance Optimization Preservation

Refactored components SHALL maintain or improve existing performance optimizations.

#### Scenario: Memoization preservation
- **GIVEN** the original component used `useMemo` for expensive calculations
- **WHEN** refactoring into sub-components
- **THEN** the memoization SHALL be preserved in the appropriate component/hook
- **AND** no unnecessary recalculations SHALL occur on re-renders
- **AND** performance metrics SHALL not regress

#### Scenario: Pure component memoization
- **GIVEN** a presentational component receives props but has no internal state (e.g., HeroSection)
- **WHEN** the component is implemented
- **THEN** the component export SHALL be wrapped with `React.memo`
- **AND** the component SHALL only re-render when props change
- **AND** unnecessary re-renders SHALL be prevented

#### Scenario: Callback stability
- **GIVEN** event handlers are passed to child components as props
- **WHEN** defining the handlers in the parent
- **THEN** handlers SHALL be wrapped with `useCallback` when appropriate
- **AND** the dependency array SHALL be correctly specified
- **AND** child components SHALL not re-render unnecessarily

### Requirement: Backwards Compatibility

Refactored components SHALL maintain identical external API and behavior.

#### Scenario: Component API preservation
- **GIVEN** the original `EuerGenerator` component has a specific API
- **WHEN** the refactoring is complete
- **THEN** the component SHALL accept the same props (if any)
- **AND** the component SHALL export with the same name
- **AND** the component SHALL be a drop-in replacement
- **AND** no breaking changes SHALL be introduced

#### Scenario: Functionality preservation
- **GIVEN** the original component supports CSV upload, categorization, and export
- **WHEN** the refactored components are used
- **THEN** all original functionality SHALL work identically
- **AND** user workflows SHALL be unchanged
- **AND** exported data formats SHALL match exactly
- **AND** ELSTER calculations SHALL produce identical results

#### Scenario: E2E test compatibility
- **GIVEN** existing E2E tests cover the EuerGenerator workflow
- **WHEN** running tests after refactoring
- **THEN** all existing E2E tests SHALL pass without modification
- **AND** no test changes SHALL be required
- **AND** test assertions SHALL continue to validate correctly

### Requirement: Code Quality Standards

Refactored components SHALL meet project code quality standards and linting rules.

#### Scenario: Linting compliance
- **GIVEN** the project uses Ultracite for code quality
- **WHEN** refactored components are created
- **THEN** all components SHALL pass `npm run lint` without errors
- **AND** all components SHALL follow Ultracite formatting rules
- **AND** no linting warnings SHALL be introduced

#### Scenario: TypeScript compilation
- **GIVEN** the project uses TypeScript with strict mode
- **WHEN** refactored components are implemented
- **THEN** all files SHALL compile without errors
- **AND** no `@ts-ignore` or `@ts-expect-error` directives SHALL be added
- **AND** all types SHALL be properly inferred or explicitly declared

#### Scenario: Import organization
- **GIVEN** components import dependencies from various sources
- **WHEN** organizing imports
- **THEN** imports SHALL be grouped by type (React, external libs, internal modules)
- **AND** imports SHALL be sorted alphabetically within groups
- **AND** unused imports SHALL be removed

### Requirement: Testing Coverage

New components and hooks SHALL have appropriate test coverage.

#### Scenario: Custom hook testing
- **GIVEN** a custom hook like `useFileUpload` is created
- **WHEN** writing tests for the hook
- **THEN** a test file SHALL be created at `src/components/euer-generator/hooks/useFileUpload.test.ts`
- **AND** tests SHALL cover all public functions and state changes
- **AND** tests SHALL verify error handling scenarios
- **AND** tests SHALL use `@testing-library/react-hooks` or equivalent

#### Scenario: Component rendering tests
- **GIVEN** a presentational component like `HeroSection` is created
- **WHEN** writing tests for the component
- **THEN** a test file SHALL be created at `src/components/euer-generator/HeroSection.test.tsx`
- **AND** tests SHALL verify the component renders correctly
- **AND** tests SHALL verify props are handled correctly
- **AND** tests SHALL use `@testing-library/react`

#### Scenario: Integration testing
- **GIVEN** the main orchestrator component coordinates multiple sub-components
- **WHEN** writing integration tests
- **THEN** tests SHALL verify data flow between components
- **AND** tests SHALL verify state updates propagate correctly
- **AND** tests SHALL verify user interactions trigger expected behaviors

### Requirement: Documentation Standards

Components and hooks SHALL be documented with JSDoc comments explaining purpose and usage.

#### Scenario: Component documentation
- **GIVEN** a new component is created
- **WHEN** writing the component
- **THEN** a JSDoc comment SHALL be added above the component definition
- **AND** the comment SHALL describe the component's purpose
- **AND** the comment SHALL document props if complex
- **AND** the comment SHALL include usage examples if non-obvious

```typescript
/**
 * FileUploadSection displays a 3-step guide and drag-and-drop interface
 * for uploading Kontist or Holvi CSV transaction files.
 *
 * @param props.onUpload - Async handler for file upload
 * @param props.onLoadDemo - Handler to load demo data
 * @param props.isLoading - Optional loading state indicator
 * @param props.error - Optional error message to display
 */
export function FileUploadSection(props: FileUploadSectionProps) {
  // ...
}
```

#### Scenario: Hook documentation
- **GIVEN** a custom hook is created
- **WHEN** writing the hook
- **THEN** a JSDoc comment SHALL be added above the hook function
- **AND** the comment SHALL explain what the hook does
- **AND** the comment SHALL document return values
- **AND** the comment SHALL include usage examples

```typescript
/**
 * useFileUpload manages CSV file upload, parsing, and validation for
 * Kontist and Holvi transaction formats.
 *
 * @returns Object with handleFileUpload function, loading state, and error state
 *
 * @example
 * const { handleFileUpload, isLoading, error } = useFileUpload()
 * await handleFileUpload(file)
 */
export function useFileUpload(): UseFileUploadReturn {
  // ...
}
```

### Requirement: File Naming Conventions

Component files SHALL follow consistent naming conventions for clarity and predictability.

#### Scenario: Component file naming
- **GIVEN** a new React component is created
- **WHEN** naming the file
- **THEN** the file SHALL use PascalCase matching the component name
- **AND** the file SHALL have `.tsx` extension
- **AND** the file name SHALL be descriptive of the component's purpose

Examples:
- `EuerGenerator.tsx` (main component)
- `FileUploadSection.tsx` (section component)
- `HeroSection.tsx` (section component)

#### Scenario: Hook file naming
- **GIVEN** a custom hook is created
- **WHEN** naming the file
- **THEN** the file name SHALL start with `use` prefix
- **AND** the file SHALL use camelCase
- **AND** the file SHALL have `.ts` extension (not `.tsx` unless it renders)

Examples:
- `useFileUpload.ts`
- `useDemoData.ts`
- `useEuerState.ts`
- `usePagination.ts`

#### Scenario: Test file naming
- **GIVEN** a test file is created for a component or hook
- **WHEN** naming the test file
- **THEN** the test file name SHALL match the source file name
- **AND** the test file SHALL have `.test.tsx` or `.test.ts` extension
- **AND** the test file SHALL be co-located with the source file

Examples:
- `HeroSection.test.tsx` (component test)
- `useFileUpload.test.ts` (hook test)
