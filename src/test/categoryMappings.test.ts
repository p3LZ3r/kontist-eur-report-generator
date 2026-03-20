import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import {
  elsterMapping,
  getCategoriesForSkr,
  skr04Categories,
  skrCodeToSemanticKey,
} from "../utils/categoryMappings";

describe("Category Mappings - SKR Categorization Engine", () => {
  describe("getCategoriesForSkr", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should return SKR04 categories by default", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Test environment - no fetch"));

      const categories = await getCategoriesForSkr("SKR04");

      expect(categories).toBeDefined();
      expect(Object.keys(categories).length).toBeGreaterThan(0);

      expect(categories["4000"]).toBeDefined();
      expect(categories["6815"]).toBeDefined();
      expect(categories["6650"]).toBeDefined();
    });

    it("should handle SKR03 categories", async () => {
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
      expect(categories["8400"]).toBeDefined();
      expect(categories["8400"].name).toBe("Fertigerzeugnisse");
      expect(categories["8400"].type).toBe("income");
    });

    it("should handle SKR49 categories for freelancers", async () => {
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
      expect(categories["8590"]).toBeDefined();
      expect(categories["8590"].name).toBe("Beratungsleistungen");
      expect(categories["6805"]).toBeDefined();
      expect(categories["6805"].name).toBe("Häusliches Arbeitszimmer");
    });

    it("should fallback to SKR04 when fetch fails", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const categories = await getCategoriesForSkr("SKR03");

      expect(categories).toEqual(skr04Categories);
    });
  });

  describe("SKR04 Default Categories", () => {
    it("should contain essential income categories with correct VAT rates", () => {
      expect(skr04Categories["4000"]).toEqual({
        name: "Umsatzerlöse",
        type: "income",
        code: "4000",
        vat: 19,
      });

      expect(skr04Categories["4300"]).toEqual({
        name: "Umsatzerlöse 7% USt",
        type: "income",
        code: "4300",
        vat: 7,
      });

      expect(skr04Categories["4110"]).toEqual({
        name: "Sonstige steuerfreie Umsätze",
        type: "income",
        code: "4110",
        vat: 0,
      });
    });

    it("should contain essential expense categories", () => {
      expect(skr04Categories["6000"]).toEqual({
        name: "Löhne und Gehälter",
        type: "expense",
        code: "6000",
        vat: 0,
      });

      expect(skr04Categories["5900"]).toEqual({
        name: "Fremdleistungen",
        type: "expense",
        code: "5900",
        vat: 19,
      });

      expect(skr04Categories["6310"]).toEqual({
        name: "Miete",
        type: "expense",
        code: "6310",
        vat: 19,
      });
    });

    it("should contain private transaction categories", () => {
      expect(skr04Categories["1900"]).toEqual({
        name: "Privatentnahmen",
        type: "private",
        code: "1900",
        vat: 0,
      });

      expect(skr04Categories["1800"]).toEqual({
        name: "Privateinlagen",
        type: "private",
        code: "1800",
        vat: 0,
      });
    });
  });

  describe("ELSTER Mapping", () => {
    it("should map income categories to correct ELSTER fields", () => {
      expect(elsterMapping.income_services_19).toEqual({
        elsterField: "15",
        label: "Umsatzsteuerpflichtige Umsätze (netto)",
      });

      expect(elsterMapping.income_services_0).toEqual({
        elsterField: "16",
        label: "Steuerfreie und nicht steuerbare Umsätze",
      });
    });

    it("should map expense categories to correct ELSTER fields", () => {
      expect(elsterMapping.expense_freelancer).toEqual({
        elsterField: "29",
        label: "Fremdleistungen",
      });

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

  describe("SKR Code to Semantic Key Mapping", () => {
    it("should map SKR codes to semantic keys for ELSTER lookup", () => {
      expect(skrCodeToSemanticKey("4000")).toBe("income_services_19");
      expect(skrCodeToSemanticKey("4300")).toBe("income_services_7");
      expect(skrCodeToSemanticKey("6000")).toBe("expense_wages");
      expect(skrCodeToSemanticKey("5900")).toBe("expense_freelancer");
      expect(skrCodeToSemanticKey("1900")).toBe("private_withdrawal");
    });

    it("should return undefined for unknown SKR codes", () => {
      expect(skrCodeToSemanticKey("9999")).toBeUndefined();
    });
  });

  describe("Category Edge Cases", () => {
    it("should handle categories with different VAT rates correctly", () => {
      const vatRates = Object.values(skr04Categories).map((cat) => cat.vat);
      const uniqueVatRates = [...new Set(vatRates)].sort();

      expect(uniqueVatRates).toContain(0);
      expect(uniqueVatRates).toContain(7);
      expect(uniqueVatRates).toContain(19);
    });

    it('should ensure income categories (4xxx) have type "income"', () => {
      const incomeCategories = Object.entries(skr04Categories).filter(([code]) =>
        code.startsWith("4"),
      );

      incomeCategories.forEach(([, category]) => {
        expect(category.type).toBe("income");
      });
    });

    it('should ensure expense categories (5xxx-6xxx) have type "expense"', () => {
      const expenseCategories = Object.entries(skr04Categories).filter(
        ([code]) => code.startsWith("5") || code.startsWith("6"),
      );

      expenseCategories.forEach(([, category]) => {
        expect(category.type).toBe("expense");
      });
    });

    it('should allow 7xxx accounts to be income or expense', () => {
      const categories7xxx = Object.entries(skr04Categories).filter(
        ([code]) => code.startsWith("7"),
      );

      categories7xxx.forEach(([, category]) => {
        expect(["income", "expense"]).toContain(category.type);
      });
    });

    it('should ensure private categories have type "private" and VAT 0', () => {
      const privateCategories = Object.entries(skr04Categories).filter(
        ([, cat]) => cat.type === "private",
      );

      privateCategories.forEach(([, category]) => {
        expect(category.type).toBe("private");
        expect(category.vat).toBe(0);
      });
    });
  });

  describe("ELSTER Field Mapping Completeness", () => {
    it("should have ELSTER mappings for essential categories", () => {
      const essentialSemanticKeys = [
        "income_services_19",
        "income_services_7",
        "expense_wages",
        "expense_freelancer",
        "expense_rent_business",
      ];

      essentialSemanticKeys.forEach((key) => {
        expect(elsterMapping[key]).toBeDefined();
      });
    });

    it("should map to valid ELSTER field numbers", () => {
      const validElsterFields = [
        "12",
        "15",
        "16",
        "19",
        "20",
        "27",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "44",
        "55",
        "56",
        "62",
        "63",
        "64",
        "65",
        "66",
        "78",
        "79",
        "80",
        "81",
        "84",
        "85",
        "91",
      ];

      Object.values(elsterMapping).forEach((mapping) => {
        expect(validElsterFields).toContain(mapping.elsterField);
      });
    });
  });
});
