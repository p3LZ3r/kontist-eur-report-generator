import { expect, test } from "@playwright/test";

test.describe("EÜR Generator E2E Workflow", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the application
		await page.goto("http://localhost:5173");

		// Wait for the app to load
		await page.waitForSelector('h1:has-text("SKR04 EÜR Generator")');
	});

	test("complete workflow from CSV upload to ELSTER export", async ({
		page,
	}) => {
		// Step 1: Upload CSV file
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(
			"e2e-tests/test-data/sample-transactions.csv",
		);

		// Wait for file processing
		await page.waitForSelector("text=Transaktionen insgesamt");

		// Verify transactions were loaded
		await expect(page.locator("text=Transaktionen insgesamt")).toBeVisible();

		// Step 2: Verify auto-categorization worked
		await expect(page.locator("text=SKR04-Konto")).toBeVisible();

		// Step 3: Navigate to ELSTER guidance
		await page.click("text=ELSTER Navigation starten");

		// Wait for navigation sidebar to appear
		await page.waitForSelector("text=ELSTER Navigation");

		// Step 4: Navigate through sections
		await page.click("text=Einnahmen");
		await page.click("text=Ausgaben");

		// Step 5: Validate and export
		// Click CSV export button
		const csvExportButton = page
			.locator('button:has-text("ELSTER CSV Export")')
			.first();
		await csvExportButton.click();

		// Verify export was successful (no error message)
		await expect(page.locator("text=Fehler")).not.toBeVisible();

		// Click JSON export button
		const jsonExportButton = page
			.locator('button:has-text("ELSTER JSON Export")')
			.first();
		await jsonExportButton.click();

		// Verify export was successful
		await expect(page.locator("text=Fehler")).not.toBeVisible();
	});

	test("handles Kleinunternehmer workflow correctly", async ({ page }) => {
		// Enable Kleinunternehmer mode first
		const settingsButton = page.locator("button[aria-expanded]");
		await settingsButton.click();

		await page.check('input[id="kleinunternehmer"]');

		// Upload CSV
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(
			"e2e-tests/test-data/kleinunternehmer-transactions.csv",
		);

		// Wait for processing
		await page.waitForSelector("text=Transaktionen insgesamt");

		// Start ELSTER navigation
		await page.click("text=ELSTER Navigation starten");

		// Verify Kleinunternehmer settings are applied
		await expect(page.locator("text=§ 19 UStG - Bruttobeträge")).toBeVisible();

		// Export should work without VAT fields
		const csvExportButton = page
			.locator('button:has-text("ELSTER CSV Export")')
			.first();
		await csvExportButton.click();

		await expect(page.locator("text=Fehler")).not.toBeVisible();
	});

	test("validates export functionality", async ({ page }) => {
		// Upload CSV
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(
			"e2e-tests/test-data/sample-transactions.csv",
		);

		await page.waitForSelector("text=Transaktionen insgesamt");

		// Start ELSTER navigation
		await page.click("text=ELSTER Navigation starten");

		// Try to export - should work since no validation is required in current implementation
		const csvExportButton = page
			.locator('button:has-text("ELSTER CSV Export")')
			.first();
		await csvExportButton.click();

		// Should not show error message
		await expect(page.locator("text=Fehler")).not.toBeVisible();
	});

	test("handles large transaction datasets", async ({ page }) => {
		// Upload large CSV file
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles("e2e-tests/test-data/large-transactions.csv");

		// Wait for processing with longer timeout
		await page.waitForSelector("text=Transaktionen insgesamt", {
			timeout: 10000,
		});

		// Verify large number of transactions
		await expect(page.locator("text=500 Transaktionen")).toBeVisible();

		// Start ELSTER navigation
		await page.click("text=ELSTER Navigation starten");

		// Should handle large dataset without performance issues
		await page.waitForSelector("text=ELSTER Felder", { timeout: 5000 });

		// Export should work
		const csvExportButton = page
			.locator('button:has-text("ELSTER CSV Export")')
			.first();
		await csvExportButton.click();

		await expect(page.locator("text=Fehler")).not.toBeVisible();
	});

	test("responsive design across screen sizes", async ({ page }) => {
		// Upload CSV
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(
			"e2e-tests/test-data/sample-transactions.csv",
		);

		await page.waitForSelector("text=Transaktionen insgesamt");

		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator("text=SKR04 EÜR Generator")).toBeVisible();

		// Test tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator("text=SKR04 EÜR Generator")).toBeVisible();

		// Test desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });
		await expect(page.locator("text=SKR04 EÜR Generator")).toBeVisible();

		// Start ELSTER navigation and test responsive layout
		await page.click("text=ELSTER Navigation starten");
		await page.waitForSelector("text=ELSTER Navigation");

		// Test mobile navigation
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator("text=ELSTER Navigation")).toBeVisible();

		// Test tablet navigation
		await page.setViewportSize({ width: 768, height: 1024 });
		await expect(page.locator("text=ELSTER Navigation")).toBeVisible();
	});

	test("accessibility features work correctly", async ({ page }) => {
		// Test keyboard navigation to settings button (first focusable element)
		await page.keyboard.press("Tab");
		const settingsButton = page.locator("button[aria-expanded]");
		await expect(settingsButton).toBeFocused();

		// Test settings button accessibility
		await expect(settingsButton).toBeVisible();
		await expect(settingsButton).toHaveAttribute("aria-expanded");

		// Test file upload button label
		const uploadButtonLabel = page.locator('label[for="csvUpload"]');
		await expect(uploadButtonLabel).toHaveText("CSV-Datei auswählen");

		// Test focus management
		await page.keyboard.press("Tab");
		const fileInput = page.locator('input[type="file"]');
		await expect(fileInput).toBeFocused();

		// Test ARIA labels for file upload
		await expect(fileInput).toHaveAttribute(
			"aria-describedby",
			"file-upload-description",
		);

		// Test settings panel toggle
		await settingsButton.click();
		await expect(page.locator("#settings-panel")).toBeVisible();

		// Test Kleinunternehmer checkbox
		const kleinunternehmerCheckbox = page.locator(
			'input[id="kleinunternehmer"]',
		);
		await expect(kleinunternehmerCheckbox).toBeVisible();
		const kleinunternehmerLabel = page.locator('label[for="kleinunternehmer"]');
		await expect(kleinunternehmerLabel).toHaveText(
			"Kleinunternehmerregelung § 19 UStG",
		);
	});
});
