import { test, expect } from '@playwright/test';

test.describe('EÜR Generator E2E Workflow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('http://localhost:5173');

        // Wait for the app to load
        await page.waitForSelector('h1:has-text("SKR04 EÜR Generator")');
    });

    test('complete workflow from CSV upload to ELSTER export', async ({ page }) => {
        // Step 1: Fill in company information
        await page.fill('input[id="companyName"]', 'Test Company GmbH');
        await page.fill('input[id="companyAddress"]', 'Teststraße 123, 12345 Teststadt');
        await page.fill('input[id="taxNumber"]', '12/345/67890');
        await page.fill('input[id="vatNumber"]', 'DE123456789');

        // Step 2: Fill in personal tax data
        await page.fill('input[id="taxName"]', 'Mustermann');
        await page.fill('input[id="taxFirstName"]', 'Max');
        await page.fill('input[id="taxStreet"]', 'Hauptstraße');
        await page.fill('input[id="taxHouseNumber"]', '123');
        await page.fill('input[id="taxPostalCode"]', '12345');
        await page.fill('input[id="taxCity"]', 'Berlin');
        await page.fill('input[id="taxTaxNumber"]', '12/345/67890');
        await page.fill('input[id="taxProfession"]', 'Softwareentwickler');

        // Step 3: Upload CSV file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('./test-data/sample-transactions.csv');

        // Wait for file processing
        await page.waitForSelector('text=Transaktionen insgesamt');

        // Verify transactions were loaded
        await expect(page.locator('text=Transaktionen insgesamt')).toBeVisible();

        // Step 4: Categorize transactions (if needed)
        // The app should auto-categorize, but we might need to verify

        // Step 5: Navigate to ELSTER guidance
        await page.click('text=ELSTER Navigation starten');

        // Wait for navigation sidebar to appear
        await page.waitForSelector('text=ELSTER Navigation');

        // Step 6: Navigate through sections
        await page.click('text=Einnahmen');
        await page.click('text=Ausgaben');
        await page.click('text=Persönliche Daten');

        // Step 7: Validate and export
        // Click CSV export button
        const csvExportButton = page.locator('button:has-text("ELSTER CSV Export")').first();
        await csvExportButton.click();

        // Verify export was successful (no error message)
        await expect(page.locator('text=Fehler')).not.toBeVisible();

        // Click JSON export button
        const jsonExportButton = page.locator('button:has-text("ELSTER JSON Export")').first();
        await jsonExportButton.click();

        // Verify export was successful
        await expect(page.locator('text=Fehler')).not.toBeVisible();
    });

    test('handles Kleinunternehmer workflow correctly', async ({ page }) => {
        // Fill in basic information
        await page.fill('input[id="companyName"]', 'Kleinunternehmer GmbH');
        await page.fill('input[id="taxName"]', 'Klein');
        await page.fill('input[id="taxStreet"]', 'Kleinstraße');
        await page.fill('input[id="taxHouseNumber"]', '1');
        await page.fill('input[id="taxPostalCode"]', '12345');
        await page.fill('input[id="taxCity"]', 'Berlin');
        await page.fill('input[id="taxTaxNumber"]', '12/345/67890');
        await page.fill('input[id="taxProfession"]', 'Kleinunternehmer');

        // Enable Kleinunternehmer mode
        await page.check('input[id="kleinunternehmer"]');

        // Upload CSV
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('./test-data/kleinunternehmer-transactions.csv');

        // Wait for processing
        await page.waitForSelector('text=Transaktionen insgesamt');

        // Start ELSTER navigation
        await page.click('text=ELSTER Navigation starten');

        // Verify Kleinunternehmer settings are applied
        await expect(page.locator('text=§ 19 UStG - Bruttobeträge')).toBeVisible();

        // Export should work without VAT fields
        const csvExportButton = page.locator('button:has-text("ELSTER CSV Export")').first();
        await csvExportButton.click();

        await expect(page.locator('text=Fehler')).not.toBeVisible();
    });

    test('validates mandatory fields before export', async ({ page }) => {
        // Fill in minimal data but miss required fields
        await page.fill('input[id="taxName"]', 'Test');
        // Don't fill tax number (required)

        // Upload CSV
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('./test-data/sample-transactions.csv');

        await page.waitForSelector('text=Transaktionen insgesamt');

        // Start ELSTER navigation
        await page.click('text=ELSTER Navigation starten');

        // Try to export - should show validation error
        const csvExportButton = page.locator('button:has-text("ELSTER CSV Export")').first();
        await csvExportButton.click();

        // Should show error message
        await expect(page.locator('text=Fehler')).toBeVisible();
        await expect(page.locator('text=Steuernummer')).toBeVisible();
    });

    test('handles large transaction datasets', async ({ page }) => {
        // Fill in basic information
        await page.fill('input[id="companyName"]', 'Large Company GmbH');
        await page.fill('input[id="taxName"]', 'Large');
        await page.fill('input[id="taxStreet"]', 'Largestraße');
        await page.fill('input[id="taxHouseNumber"]', '100');
        await page.fill('input[id="taxPostalCode"]', '12345');
        await page.fill('input[id="taxCity"]', 'Berlin');
        await page.fill('input[id="taxTaxNumber"]', '12/345/67890');
        await page.fill('input[id="taxProfession"]', 'Geschäftsführer');

        // Upload large CSV file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('./test-data/large-transactions.csv');

        // Wait for processing with longer timeout
        await page.waitForSelector('text=Transaktionen insgesamt', { timeout: 10000 });

        // Verify large number of transactions
        await expect(page.locator('text=500 Transaktionen')).toBeVisible();

        // Start ELSTER navigation
        await page.click('text=ELSTER Navigation starten');

        // Should handle large dataset without performance issues
        await page.waitForSelector('text=ELSTER Felder', { timeout: 5000 });

        // Export should work
        const csvExportButton = page.locator('button:has-text("ELSTER CSV Export")').first();
        await csvExportButton.click();

        await expect(page.locator('text=Fehler')).not.toBeVisible();
    });

    test('responsive design across screen sizes', async ({ page }) => {
        // Fill in basic data
        await page.fill('input[id="companyName"]', 'Responsive Test GmbH');
        await page.fill('input[id="taxName"]', 'Responsive');
        await page.fill('input[id="taxStreet"]', 'Responsive Straße');
        await page.fill('input[id="taxHouseNumber"]', '42');
        await page.fill('input[id="taxPostalCode"]', '12345');
        await page.fill('input[id="taxCity"]', 'Berlin');
        await page.fill('input[id="taxTaxNumber"]', '12/345/67890');
        await page.fill('input[id="taxProfession"]', 'Tester');

        // Upload CSV
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('./test-data/sample-transactions.csv');

        await page.waitForSelector('text=Transaktionen insgesamt');

        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('text=SKR04 EÜR Generator')).toBeVisible();

        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('text=SKR04 EÜR Generator')).toBeVisible();

        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        await expect(page.locator('text=SKR04 EÜR Generator')).toBeVisible();

        // Start ELSTER navigation and test responsive layout
        await page.click('text=ELSTER Navigation starten');
        await page.waitForSelector('text=ELSTER Navigation');

        // Test mobile navigation
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('text=ELSTER Navigation')).toBeVisible();

        // Test tablet navigation
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('text=ELSTER Navigation')).toBeVisible();
    });

    test('accessibility features work correctly', async ({ page }) => {
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        await expect(page.locator('input[id="companyName"]')).toBeFocused();

        // Fill form using keyboard
        await page.keyboard.type('Accessible Company GmbH');
        await page.keyboard.press('Tab');
        await page.keyboard.type('Accessible Straße 123');

        // Test ARIA labels
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toHaveAttribute('aria-describedby', 'file-upload-description');

        // Test help button
        const helpButton = page.locator('button[aria-label="Hilfe umschalten"]');
        await expect(helpButton).toBeVisible();

        // Test form labels
        const nameLabel = page.locator('label[for="taxName"]');
        await expect(nameLabel).toHaveText('Name *');

        // Test error announcements (if any)
        // This would require setting up error states
    });
});