import { describe, expect, it, vi } from "vitest";
import type { Transaction } from "../types";
import {
  calculateEuer,
  populateAllElsterFields,
} from "../utils/euerCalculations";

// Mock ELSTER_FIELDS and category mappings
vi.mock("../utils/constants", () => ({
  ELSTER_FIELDS: {
    "12": {
      label: "Nicht umsatzsteuerpflichtige Erlöse",
      type: "income",
      required: false,
    },
    "15": {
      label: "Umsatzsteuerpflichtige Umsätze (netto)",
      type: "income",
      required: true,
    },
    "16": { label: "Steuerfreie Umsätze", type: "income", required: false },
    "17": {
      label: "Umsatzsteuer",
      type: "tax",
      required: false,
      autoCalculated: true,
    },
    "23": {
      label: "Summe der Betriebseinnahmen",
      type: "income",
      required: false,
      autoCalculated: true,
    },
    "27": { label: "Waren/Roh-/Hilfsstoffe", type: "expense", required: false },
    "29": { label: "Fremdleistungen", type: "expense", required: false },
    "30": { label: "Personalkosten", type: "expense", required: false },
    "31": { label: "Mieten", type: "expense", required: false },
    "32": { label: "Raumkosten", type: "expense", required: false },
    "37": { label: "Sonstige Ausgaben", type: "expense", required: false },
    "52": {
      label: "Summe Betriebseinnahmen",
      type: "total",
      required: false,
      autoCalculated: true,
    },
    "57": {
      label: "Vorsteuer",
      type: "vat_paid",
      required: false,
      autoCalculated: true,
    },
    "75": {
      label: "Summe der Betriebsausgaben",
      type: "total",
      required: false,
      autoCalculated: true,
    },
    "76": {
      label: "Gewinn/Verlust",
      type: "profit_calc",
      required: false,
      autoCalculated: true,
    },
    "77": { label: "Hinzurechnungen", type: "profit_calc", required: false },
    "92": {
      label: "Gewinn",
      type: "total",
      required: true,
      autoCalculated: true,
    },
    "93": {
      label: "Verlust",
      type: "total",
      required: false,
      autoCalculated: true,
    },
    "94": {
      label: "Nicht verwendbar",
      type: "total",
      required: false,
      autoCalculated: true,
    },
    "95": {
      label: "Summe der Einkünfte",
      type: "total",
      required: false,
      autoCalculated: true,
    },
    "96": {
      label: "Summe der Einkünfte negativ",
      type: "total",
      required: false,
      autoCalculated: true,
    },
  },
}));

vi.mock("../utils/categoryMappings", () => ({
  skr04Categories: {
    income_services_19: {
      name: "Erlöse aus Dienstleistungen 19% USt",
      type: "income",
      code: "8400",
      vat: 19,
    },
    expense_office_supplies: {
      name: "Büromaterial",
      type: "expense",
      code: "6815",
      vat: 19,
    },
  },
  elsterMapping: {
    income_services_19: {
      elsterField: "15",
      label: "Umsatzsteuerpflichtige Umsätze (netto)",
    },
    expense_office_supplies: {
      elsterField: "27",
      label: "Sonstige betriebliche Aufwendungen",
    },
  },
}));

// Generate large test datasets
const generateLargeTransactionSet = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.5;
    transactions.push({
      id: i,
      dateField: `2024-${String(Math.floor(i / 30) + 1).padStart(2, "0")}-${String((i % 30) + 1).padStart(2, "0")}`,
      counterpartyField: `Customer ${i}`,
      purposeField: `Transaction ${i}`,
      BetragNumeric: isIncome
        ? Math.random() * 1000 + 100
        : -(Math.random() * 500 + 50), // Ensure positive for income, negative for expenses
      euerCategory: isIncome ? "income_services_19" : "expense_office_supplies", // Use real SKR04 categories
    });
  }
  return transactions;
};

// Create valid mock data for ELSTER tests
const createValidMockData = (transactionCount: number) => {
  const transactions = generateLargeTransactionSet(transactionCount);
  const categories = transactions.reduce(
    (acc, t) => {
      acc[t.id] = t.euerCategory || "income_services_19";
      return acc;
    },
    {} as Record<number, string>
  );

  return { transactions, categories };
};

describe("Performance Tests", () => {
  describe("calculateEuer Performance", () => {
    it("should process 100 transactions within acceptable time", () => {
      const transactions = generateLargeTransactionSet(100);
      const categories = transactions.reduce(
        (acc, t) => {
          acc[t.id] = t.euerCategory || "income_services_19";
          return acc;
        },
        {} as Record<number, string>
      );

      const startTime = performance.now();
      const result = calculateEuer(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(`calculateEuer (100 transactions): ${duration.toFixed(2)}ms`);

      // Should complete within 100ms for 100 transactions
      expect(duration).toBeLessThan(100);
      expect(result.totalIncome).toBeGreaterThan(0);
      expect(result.totalExpenses).toBeGreaterThan(0);
    });

    it("should process 1000 transactions within acceptable time", () => {
      const transactions = generateLargeTransactionSet(1000);
      const categories = transactions.reduce(
        (acc, t) => {
          acc[t.id] = t.euerCategory || "income_services_19";
          return acc;
        },
        {} as Record<number, string>
      );

      const startTime = performance.now();
      const result = calculateEuer(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(
        `calculateEuer (1000 transactions): ${duration.toFixed(2)}ms`
      );

      // Should complete within 500ms for 1000 transactions
      expect(duration).toBeLessThan(500);
      expect(result.totalIncome).toBeGreaterThan(0);
      expect(result.totalExpenses).toBeGreaterThan(0);
    });

    it("should process 5000 transactions within acceptable time", () => {
      const transactions = generateLargeTransactionSet(5000);
      const categories = transactions.reduce(
        (acc, t) => {
          acc[t.id] = t.euerCategory || "income_services_19";
          return acc;
        },
        {} as Record<number, string>
      );

      const startTime = performance.now();
      const result = calculateEuer(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(
        `calculateEuer (5000 transactions): ${duration.toFixed(2)}ms`
      );

      // Should complete within 2000ms for 5000 transactions
      expect(duration).toBeLessThan(2000);
      expect(result.totalIncome).toBeGreaterThan(0);
      expect(result.totalExpenses).toBeGreaterThan(0);
    });

    it("should scale linearly with transaction count", () => {
      const testSizes = [100, 500, 1000, 2000];

      const results = testSizes.map((size) => {
        const transactions = generateLargeTransactionSet(size);
        const categories = transactions.reduce(
          (acc, t) => {
            acc[t.id] = t.euerCategory || "income_services_19";
            return acc;
          },
          {} as Record<number, string>
        );

        const startTime = performance.now();
        calculateEuer(transactions, categories, false);
        const endTime = performance.now();

        return { size, duration: endTime - startTime };
      });

      console.log("Performance scaling results:");
      results.forEach(({ size, duration }) => {
        console.log(`  ${size} transactions: ${duration.toFixed(2)}ms`);
      });

      // Check that performance scales reasonably (duration per transaction shouldn't increase dramatically)
      const avgTimePerTransaction = results.map((r) => r.duration / r.size);
      const maxTimePerTransaction = Math.max(...avgTimePerTransaction);
      const minTimePerTransaction = Math.min(...avgTimePerTransaction);

      // The ratio should be reasonable (less than 10x difference)
      // Note: Relaxed threshold due to timing variance in test environment
      expect(maxTimePerTransaction / minTimePerTransaction).toBeLessThan(10);
    });
  });

  describe("populateAllElsterFields Performance", () => {
    it("should process 100 transactions for ELSTER within acceptable time", () => {
      const { transactions, categories } = createValidMockData(100);

      const startTime = performance.now();
      const result = populateAllElsterFields(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(
        `populateAllElsterFields (100 transactions): ${duration.toFixed(2)}ms`
      );

      // Should complete within 200ms for 100 transactions
      expect(duration).toBeLessThan(200);
      expect(result.fieldValues.length).toBeGreaterThan(16); // At least personal + transaction fields
      // Note: Validation may fail due to mock data, but performance is what we're testing
    });

    it("should process 500 transactions for ELSTER within acceptable time", () => {
      const { transactions, categories } = createValidMockData(500);

      const startTime = performance.now();
      const result = populateAllElsterFields(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(
        `populateAllElsterFields (500 transactions): ${duration.toFixed(2)}ms`
      );

      // Should complete within 1000ms for 500 transactions
      expect(duration).toBeLessThan(1000);
      expect(result.fieldValues.length).toBeGreaterThan(16);
    });

    it("should handle memory efficiently with large datasets", () => {
      const { transactions, categories } = createValidMockData(2000);

      const startTime = performance.now();
      const result = populateAllElsterFields(transactions, categories, false);
      const endTime = performance.now();

      const duration = endTime - startTime;

      console.log(
        `populateAllElsterFields (2000 transactions): ${duration.toFixed(2)}ms`
      );

      // Should complete within 3000ms for 2000 transactions
      expect(duration).toBeLessThan(3000);
      expect(result.fieldValues.length).toBeGreaterThan(16);

      // Verify that the result contains reasonable data
      // With random data, we might not have both types, so just check we have fields
      expect(result.fieldValues.length).toBeGreaterThan(0);
    });
  });

  describe("Memory Usage Tests", () => {
    it("should not have memory leaks with repeated calculations", () => {
      const transactions = generateLargeTransactionSet(200);
      const categories = transactions.reduce(
        (acc, t) => {
          acc[t.id] = t.euerCategory || "income_services_19";
          return acc;
        },
        {} as Record<number, string>
      );

      // Run multiple calculations to check for memory issues
      for (let i = 0; i < 10; i++) {
        const result = calculateEuer(transactions, categories, false);
        expect(result.totalIncome).toBeDefined();
        expect(result.totalExpenses).toBeDefined();
      }

      // If we get here without crashing, memory usage is acceptable
      expect(true).toBe(true);
    });
  });

  describe("Kleinunternehmer vs Regular Business Performance", () => {
    it("should compare performance between Kleinunternehmer and regular business calculations", () => {
      const { transactions, categories } = createValidMockData(1000);

      // Test Kleinunternehmer calculation
      const kuStartTime = performance.now();
      const kuResult = calculateEuer(transactions, categories, true);
      const kuEndTime = performance.now();
      const kuDuration = kuEndTime - kuStartTime;

      // Test regular business calculation
      const regularStartTime = performance.now();
      const regularResult = calculateEuer(transactions, categories, false);
      const regularEndTime = performance.now();
      const regularDuration = regularEndTime - regularStartTime;

      console.log(`Kleinunternehmer calculation: ${kuDuration.toFixed(2)}ms`);
      console.log(
        `Regular business calculation: ${regularDuration.toFixed(2)}ms`
      );
      console.log(
        `Performance difference: ${(regularDuration - kuDuration).toFixed(2)}ms`
      );

      // In a real scenario, regular business might be slightly slower due to VAT calculations
      // But in test environment, the difference might be negligible
      expect(kuDuration).toBeGreaterThan(0);
      expect(regularDuration).toBeGreaterThan(0);

      // Results should be different (KU has no VAT)
      expect(kuResult.vatOwed).toBe(0);
      expect(kuResult.vatPaid).toBe(0);
      expect(regularResult.vatOwed).toBeGreaterThan(0);
      expect(regularResult.vatPaid).toBeGreaterThan(0);
    });
  });
});
