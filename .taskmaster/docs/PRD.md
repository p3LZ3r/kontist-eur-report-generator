# Overview
This document outlines the requirements for the Minimum Viable Product (MVP) of the EÜR Report Generator. This is a client-side web application designed to solve a key problem for German freelancers and small business owners: the tedious and error-prone process of preparing their annual Einnahmen-Überschuss-Rechnung (EÜR) for tax purposes.

The application is for users of Kontist and Holvi online banks who need to translate their transaction history into a format compatible with the ELSTER tax portal. By automating CSV parsing, transaction categorization, and financial calculations, the tool provides immense value by saving users significant time and increasing the accuracy of their financial reporting. All processing is performed entirely in the user's browser, ensuring that sensitive financial data remains private and secure.

# Core Features
- **CSV Data Ingestion:**
  - **What it does:** Allows a user to upload their annual transaction report as a `.csv` file downloaded from their Kontist or Holvi bank account.
  - **Why it's important:** This is the primary input mechanism for getting user financial data into the application.
  - **How it works at a high level:** The UI will feature a file input. Upon file selection, a client-side parsing library will process the CSV, identify the source (Kontist or Holvi), and transform the data into a standardized internal format.

- **Automated SKR Categorization & EÜR Calculation:**
  - **What it does:** Automatically assigns an official SKR accounting category to each transaction and calculates the final EÜR figures.
  - **Why it's important:** This is the core feature that automates the most labor-intensive part of the EÜR preparation process.
  - **How it works at a high level:** A categorization engine will iterate through the normalized transactions. It will use a ruleset based on keywords and patterns in the transaction description to map it to an SKR03/SKR04 category. Once all transactions are categorized, the engine will sum up all income and expense lines to compute the final profit or loss.

- **ELSTER-mapped Report Display:**
  - **What it does:** Presents the final calculated totals in a clean, read-only view that directly corresponds to the fields on the official EÜR form.
  - **Why it's important:** This makes it trivial for the user to transfer their results into the ELSTER tax portal, eliminating confusion and potential for transcription errors.
  - **How it works at a high level:** A simple UI component will display the key calculated values (e.g., "Betriebseinnahmen," "Wareneinkauf," "Gewinn/Verlust") with labels that match the official EÜR form's terminology and line numbers.

# User Experience
- **User Persona:** A German freelance consultant who is comfortable with technology but is not an accounting expert. Their primary goal is to complete their tax obligations as quickly and accurately as possible without hiring an accountant.
- **Key User Flow:**
  1. User lands on the single-page application.
  2. User is met with a clear call-to-action to upload their CSV file.
  3. User selects their Kontist or Holvi transaction CSV from their local machine.
  4. The application displays a brief loading indicator while processing.
  5. The final EÜR report is displayed on the same page.
  6. User opens the ELSTER portal in another tab and copies the values from the application into the corresponding fields.
- **UI/UX Considerations:** The design must be minimal, clean, and highly intuitive. The entire user journey should exist on a single page. There should be no unnecessary steps, configurations, or distractions from the core workflow.

# Technical Architecture
- **System Components:** 100% client-side Single-Page Application (SPA). No backend server or database is required.
- **Data Models:**
  - `RawTransaction`: Represents a row from the source CSV.
  - `NormalizedTransaction`: A unified internal object for a transaction, e.g., `{ id, date, description, amount, type: '''income''' | '''expense''' }`.
  - `EuerReport`: The final calculated output, containing fields for total income, total expenses, and breakdowns by key SKR categories.
- **APIs and Integrations:** None. All logic is contained within the application.
- **Infrastructure Requirements:** A static web hosting provider (e.g., Vercel, Netlify, GitHub Pages).

# Development Roadmap
- **MVP Requirements:**
  - UI shell with a file upload component and a placeholder report display.
  - CSV parsing and data normalization logic for both Kontist and Holvi formats.
  - The core categorization engine with mapping rules for common SKR03/04 categories.
  - The EÜR calculation engine to sum categorized transactions.
  - Integration of the components to create the end-to-end user flow.
  - Unit tests for the calculation and categorization logic.
- **Future Enhancements:**
  - A UI for users to manually review and correct transaction categories.
  - Support for additional bank CSV formats.
  - Export functionality for the final report (PDF or CSV).
  - Persistence of data in the browser's `localStorage`.

# Logical Dependency Chain
1. **Foundation:** Finalize the basic React project setup with Vite and Tailwind CSS.
2. **Static UI:** Build the static React components for the file upload area and the final report display. This provides a clear visual target.
3. **Data Pipeline:** Implement the CSV parsing and data normalization logic. This is the foundational functional block.
4. **Core Engine:** Develop the categorization and calculation engines. These can be developed and unit-tested independently once the `NormalizedTransaction` data model is finalized.
5. **Integration:** Connect the data pipeline to the core engine and render the results in the report display component to complete the end-to-end workflow.

# Risks and Mitigations
- **Risk:** The automated categorization may not be 100% accurate.
  - **Mitigation (MVP):** We will focus the rules on the most common and clearly identifiable transactions for freelancers. We accept that some items may go uncategorized in the MVP. The goal is to provide a massive improvement over manual processing, not perfection.
- **Risk:** The CSV formats from Kontist or Holvi could change.
  - **Mitigation:** The data normalization layer will be designed as a distinct adapter, making it easier to update if a source format changes without impacting the core application logic.
- **Risk:** Scope creep (e.g., adding manual editing or more banks).
  - **Mitigation:** We will adhere strictly to the MVP roadmap. Any feature not listed under "MVP Requirements" will be deferred to a future version.

# Appendix
- **Data Sources:**
  - SKR03/04 Mappings: `src/data/skr03.json`, `src/data/skr04.json`
  - Example Test Data: `e2e-tests/test-data/`
- **External References:**
  - Official ELSTER EÜR Form for the relevant tax year.
