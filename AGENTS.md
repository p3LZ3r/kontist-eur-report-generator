# AGENTS.md: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** This is a React/TypeScript web application for generating EUR (European Accounting) reports from Kontist and Holvi bank transactions. It processes CSV transaction data, performs automated categorization according to German SKR accounting standards (SKR03, SKR04, SKR49), calculates EÜR (Einnahmen-Überschuss-Rechnung), and enables export to ELSTER tax filing system.
* **Business Domain:** Financial accounting and tax compliance for German small businesses and freelancers using Kontist banking services.

## 2. Core Technologies & Stack

* **Languages:** TypeScript (primary), JavaScript (build tools)
* **Frameworks & Runtimes:** React 19.1.1 with functional components and hooks, Vite for build tooling
* **Databases:** None (client-side processing only, uses JSON data files for SKR mappings)
* **Key Libraries/Dependencies:** Radix UI components (@radix-ui/*), Tailwind CSS for styling, Lucide React for icons, class-variance-authority for component variants
* **Platforms:** Web browsers (modern browsers supporting ES2020+)
* **Package Manager:** npm

## 3. Architectural Patterns

* **Overall Architecture:** Component-based React single-page application with utility-driven calculations. The app follows a data-flow pattern: CSV upload → transaction parsing → automated categorization → EÜR calculation → ELSTER export.
* **Directory Structure Philosophy:**
    * `/src`: Contains all primary TypeScript/React source code
    * `/src/components`: React components organized by feature (EuerGenerator main component, UI components in /ui)
    * `/src/utils`: Pure utility functions for calculations, data processing, and exports
    * `/src/types`: TypeScript type definitions and interfaces
    * `/src/data`: Static JSON data files for SKR accounting standards
    * `/src/test`: Unit and integration tests
    * `/e2e-tests`: End-to-end tests with Playwright
* **Module Organization:** Modular utility functions in separate files (euerCalculations.ts, categoryMappings.ts, exportUtils.ts), component-based UI with shared UI components from shadcn/ui

## 4. Coding Conventions & Style Guide

* **Formatting:** 2-space indentation, ESLint configuration for code quality, Prettier-compatible formatting
* **Naming Conventions:**
    * Variables, functions: camelCase (e.g., `calculateEuer`, `transactionData`)
    * Components, Types: PascalCase (e.g., `EuerGenerator`, `Transaction`)
    * Files: camelCase with descriptive names (e.g., `euerCalculations.ts`, `categoryMappings.ts`)
    * Constants: SCREAMING_SNAKE_CASE (e.g., `VAT_RATES`, `ELSTER_FIELDS`)
* **API Design:**
    * **Style:** Functional programming with React hooks, utility functions for pure calculations
    * **Abstraction:** High abstraction through utility functions that handle complex EÜR calculations and ELSTER mappings
    * **Extensibility:** Modular design allows adding new SKR standards, bank formats, and export targets
    * **Trade-offs:** Prioritizes type safety and developer ergonomics over performance (client-side processing)
* **Common Patterns & Idioms:**
    * **State Management:** React useState/useMemo for local component state
    * **Data Processing:** Pure functions for calculations, immutable data patterns
    * **Error Handling:** Try-catch blocks with user-friendly error messages
    * **Type Safety:** Strict TypeScript with comprehensive interfaces
* **Error Handling:** User-facing error messages in German, console logging for debugging

## 5. Key Files & Entrypoints

* **Main Entrypoint:** `src/main.tsx` (React app entry point), `src/App.tsx` (main app component)
* **Configuration:** `tsconfig.json` (TypeScript config), `vite.config.ts` (build config), `tailwind.config.js` (styling)
* **CI/CD Pipeline:** None configured (local development only)

## 6. Development & Testing Workflow

* **Local Development Environment:**
    * **Setup:** Clone repository, run `npm install`
    * **Development:** Run `npm run dev` to start Vite dev server on localhost:5173
    * **Build:** Run `npm run build` to create production build
    * **Preview:** Run `npm run preview` to test production build locally
* **Task Configuration:**
    * **npm scripts:** All tasks defined in package.json scripts section
    * **Development:** `npm run dev` (Vite dev server with hot reload)
    * **Building:** `npm run build` (TypeScript compilation + Vite build)
    * **Linting:** `npm run lint` (ESLint code quality checks)
* **Testing:** Unit tests with Vitest (`npm run test`), E2E tests with Playwright (`npm run test:e2e`)
* **CI/CD Process:** No automated CI/CD pipeline configured

## 7. Specific Instructions for AI Collaboration

* **Contribution Guidelines:** Follow existing TypeScript/React patterns, maintain German language for user-facing text, ensure type safety, add tests for new functionality
* **Security:** Handle user-uploaded CSV files securely, validate file formats, avoid storing sensitive financial data
* **Dependencies:** Use npm for package management, prefer established libraries, check compatibility with React 19 and TypeScript 5.8
* **Commit Messages:** Use descriptive English commit messages following conventional format (feat:, fix:, docs:)