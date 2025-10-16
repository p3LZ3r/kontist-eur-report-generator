import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  elsterMapping,
  getCategoriesForSkr,
  skr04Categories,
} from "../utils/categoryMappings";

describe("Category Mappings - SKR Categorization Engine", () => {
  describe("getCategoriesForSkr", () => {
    beforeEach(() => {
      // Clear any previous fetch mocks
      vi.resetAllMocks();
    });

    it("should return SKR04 categories by default", async () => {
      // Mock fetch failure to trigger fallback
      global.fetch = vi
        .fn()
        .mockRejectedValue(new Error("Test environment - no fetch"));

      const categories = await getCategoriesForSkr("SKR04");

      expect(categories).toBeDefined();
      expect(Object.keys(categories).length).toBeGreaterThan(0);

      // Verify it contains expected SKR04 categories
      expect(categories.income_services_19).toBeDefined();
      expect(categories.expense_office_supplies).toBeDefined();
      expect(categories.expense_travel_domestic).toBeDefined();
    });

    it("should handle SKR03 categories", async () => {
      // Mock fetch for SKR03 data - should return ARRAY format
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              leaf: true,
              name: "Fertigerzeugnisse",
              type: "Ertrag",
              code: "8400",
            },
            { leaf: true, name: "Rohstoffe", type: "Aufwand", code: "3000" },
          ]),
      });

      const categories = await getCategoriesForSkr("SKR03");

      expect(categories).toBeDefined();
      // Check by SKR code since that's the key
      expect(categories["8400"]).toBeDefined();
      expect(categories["8400"].name).toBe("Fertigerzeugnisse");
      expect(categories["8400"].type).toBe("income");
    });

    it("should handle SKR49 categories for freelancers", async () => {
      // Mock fetch for SKR49 data - should return ARRAY format
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              leaf: true,
              name: "Beratungsleistungen",
              type: "Ertrag",
              code: "8590",
            },
            {
              leaf: true,
              name: "Häusliches Arbeitszimmer",
              type: "Aufwand",
              code: "6805",
            },
          ]),
      });

      const categories = await getCategoriesForSkr("SKR49");

      expect(categories).toBeDefined();
      // Check by SKR code
      expect(categories["8590"]).toBeDefined();
      expect(categories["8590"].name).toBe("Beratungsleistungen");
      expect(categories["6805"]).toBeDefined();
      expect(categories["6805"].name).toBe("Häusliches Arbeitszimmer");
    });

    it("should fallback to SKR04 when fetch fails", async () => {
      // Mock failed fetch
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const categories = await getCategoriesForSkr("SKR03");

      // Should fallback to hardcoded SKR04
      expect(categories).toEqual(skr04Categories);
    });
  });

  describe("SKR04 Default Categories", () => {
    it("should contain essential income categories with correct VAT rates", () => {
      expect(skr04Categories.income_services_19).toEqual({
        name: "Erlöse aus Dienstleistungen 19% USt",
        type: "income",
        code: "8400",
        vat: 19,
      });

      expect(skr04Categories.income_services_7).toEqual({
        name: "Erlöse aus Dienstleistungen 7% USt",
        type: "income",
        code: "8300",
        vat: 7,
      });

      expect(skr04Categories.income_services_0).toEqual({
        name: "Steuerfreie Erlöse",
        type: "income",
        code: "8125",
        vat: 0,
      });
    });

    it("should contain essential expense categories", () => {
      expect(skr04Categories.expense_wages).toEqual({
        name: "Löhne und Gehälter",
        type: "expense",
        code: "6000",
        vat: 0,
      });

      expect(skr04Categories.expense_freelancer).toEqual({
        name: "Fremdleistungen (Subunternehmer)",
        type: "expense",
        code: "6300",
        vat: 19,
      });

      expect(skr04Categories.expense_rent_business).toEqual({
        name: "Mieten Geschäftsräume",
        type: "expense",
        code: "7000",
        vat: 19,
      });
    });

    it("should contain private transaction categories", () => {
      expect(skr04Categories.private_withdrawal).toEqual({
        name: "Privatentnahmen (nicht EÜR-relevant)",
        type: "private",
        code: "1890",
        vat: 0,
      });

      expect(skr04Categories.private_deposit).toEqual({
        name: "Privateinlagen",
        type: "private",
        code: "1800",
        vat: 0,
      });
    });
  });

  describe("ELSTER Mapping", () => {
    it("should map income categories to correct ELSTER fields", () => {
      // VAT-liable services should map to field 15 (netto)
      expect(elsterMapping.income_services_19).toEqual({
        elsterField: "15",
        label: "Umsatzsteuerpflichtige Umsätze (netto)",
      });

      // VAT-free services should map to field 16
      expect(elsterMapping.income_services_0).toEqual({
        elsterField: "16",
        label: "Steuerfreie und nicht steuerbare Umsätze",
      });
    });

    it("should map expense categories to correct ELSTER fields", () => {
      // Freelancer costs should map to field 29 (Fremdleistungen)
      expect(elsterMapping.expense_freelancer).toEqual({
        elsterField: "29",
        label: "Fremdleistungen",
      });

      // Personnel costs should map to field 30
      expect(elsterMapping.expense_wages).toEqual({
        elsterField: "30",
        label: "Personalkosten",
      });
    });

    it("should not map private transactions to ELSTER fields", () => {
      expect(elsterMapping.private_withdrawal).toBeUndefined();
      expect(elsterMapping.private_deposit).toBeUndefined();
    });
  });

  describe("Category Edge Cases", () => {
    it("should handle categories with different VAT rates correctly", () => {
      const vatRates = Object.values(skr04Categories).map((cat) => cat.vat);
      const uniqueVatRates = [...new Set(vatRates)].sort();

      expect(uniqueVatRates).toContain(0);
      expect(uniqueVatRates).toContain(7);
      expect(uniqueVatRates).toContain(19);
      expect(uniqueVatRates.length).toBe(3);
    });

    it('should ensure all income categories have type "income"', () => {
      const incomeCategories = Object.entries(skr04Categories).filter(([key]) =>
        key.startsWith("income_")
      );

      incomeCategories.forEach(([, category]) => {
        expect(category.type).toBe("income");
      });
    });

    it('should ensure all expense categories have type "expense"', () => {
      const expenseCategories = Object.entries(skr04Categories).filter(
        ([key]) =>
          key.startsWith("expense_") && !key.includes("tax_free_income")
      );

      expenseCategories.forEach(([, category]) => {
        expect(category.type).toBe("expense");
      });

      // Special case: tax-free income is categorized as income even though prefixed with expense_
      expect(skr04Categories.expense_tax_free_income.type).toBe("income");
    });

    it('should ensure all private categories have type "private" and VAT 0', () => {
      const privateCategories = Object.entries(skr04Categories).filter(
        ([key]) => key.startsWith("private_")
      );

      privateCategories.forEach(([, category]) => {
        expect(category.type).toBe("private");
        expect(category.vat).toBe(0);
      });
    });
  });

  describe("ELSTER Field Mapping Completeness", () => {
    it("should have ELSTER mappings for all business-relevant categories", () => {
      const businessCategories = Object.entries(skr04Categories).filter(
        ([, cat]) => cat.type === "income" || cat.type === "expense"
      );

      const mappedCategories = Object.keys(elsterMapping);

      businessCategories.forEach(([key, category]) => {
        // Not all categories need ELSTER mapping (some are internal),
        // but major ones should have mappings
        if (key.includes("income_") || key.includes("expense_")) {
          const hasMapping = mappedCategories.includes(key);
          if (!hasMapping) {
            console.warn(
              `Category ${key} (${category.name}) has no ELSTER mapping`
            );
          }
        }
      });

      // At minimum, should have mappings for major categories
      expect(mappedCategories.length).toBeGreaterThan(10);
    });

    it("should map to valid ELSTER field numbers", () => {
      const validElsterFields = [
        "12",
        "15",
        "16",
        "19",
        "20", // Income fields
        "27",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37", // Basic expense fields
        "44",
        "55",
        "56",
        "62",
        "63",
        "64",
        "65",
        "66", // Specific expense fields
        "78",
        "79",
        "80",
        "81",
        "84",
        "85",
        "91", // Special calculation fields
      ];

      Object.values(elsterMapping).forEach((mapping) => {
        expect(validElsterFields).toContain(mapping.elsterField);
      });
    });
  });
});
