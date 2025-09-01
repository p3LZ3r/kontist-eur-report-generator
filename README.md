# kontist-eur-report-generator

## Project Overview

This React/TypeScript application is a specialized tool for generating EUR (European Accounting) reports from Kontist bank transactions. Built with Vite for fast development and Tailwind CSS for responsive UI, it processes transaction data, performs EUR-specific calculations, and ensures compliance with German SKR accounting standards (SKR03, SKR04, SKR49).

**Target Users:** Accountants, financial professionals, and small-to-medium businesses using Kontist banking services who need automated, standards-compliant EUR reporting for tax and accounting purposes.

**Key Features:**
- Transaction data import and processing utilities
- EUR calculation engine with category mappings
- Support for multiple SKR standards (03, 04, 49) via structured data files
- Report generation and export functionality
- Modern React components with shadcn/ui for intuitive user interface
- TypeScript for type safety and maintainability

## Installation Instructions

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kontist-eur-generator.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd kontist-eur-generator
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Usage Examples

Once the application is running, users can interact with it as follows:

1. **Upload Transaction Data:** Use the file upload interface to import Kontist transaction data (typically in CSV or JSON format).

2. **Select SKR Standard:** Choose from SKR03, SKR04, or SKR49 standards based on your accounting requirements.

3. **Process and Calculate:** The application will automatically process the transactions, apply EUR calculations, and map categories according to the selected SKR standard.

4. **Generate Reports:** View the generated EUR reports in the UI, which include categorized transactions, totals, and compliance checks.

5. **Export Reports:** Export the reports in various formats (e.g., PDF, Excel) for use in accounting software or tax filings.

For command-line usage, you can run the development server as described in the installation steps. The application provides a web-based interface for all interactions.

## Contributing Guidelines

We welcome contributions to improve the kontist-eur-report-generator project! To contribute:

1. **Fork the repository** on GitHub.

2. **Create a feature branch** from the main branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and ensure they follow the project's coding standards (TypeScript, ESLint rules).

4. **Test your changes** thoroughly.

5. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of changes"
   ```

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a pull request** to the main repository with a detailed description of your changes.

Please ensure your code is well-documented and includes tests where appropriate. For major changes, consider opening an issue first to discuss the proposed changes.

## License Information

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full license details.
