import { describe, expect, it, vi } from "vite-plus/test";
import type { ElsterFieldValue, EuerCalculation, Transaction } from "../types";
import {
  calculateEuer,
  calculateTotalFields,
  calculateVatFields,
  generateElsterOverview,
  populateAllElsterFields,
  populateElsterFieldsFromCalculation,
  validateMandatoryFields,
} from "../utils/euerCalculations";

// Mock categoryMappings with realistic SKR04 categories (using SKR codes as keys)
vi.mock("../utils/categoryMappings", () => ({
  skr04Categories: {
    "4000": {
      name: "Umsatzerlöse 19%",
      type: "income",
      code: "4000",
      vat: 19,
    },
    "4300": {
      name: "Umsatzerlöse 7% USt",
      type: "income",
      code: "4300",
      vat: 7,
    },
    "4110": {
      name: "Steuerfreie Erlöse",
      type: "income",
      code: "4110",
      vat: 0,
    },
    "6815": {
      name: "Büromaterial",
      type: "expense",
      code: "6815",
      vat: 19,
    },
    "5900": {
      name: "Fremdleistungen",
      type: "expense",
      code: "5900",
      vat: 19,
    },
    "6310": {
      name: "Mieten Geschäftsräume",
      type: "expense",
      code: "6310",
      vat: 19,
    },
    "1900": {
      name: "Privatentnahmen",
      type: "private",
      code: "1900",
      vat: 0,
    },
    "1800": {
      name: "Privateinlagen",
      type: "private",
      code: "1800",
      vat: 0,
    },
  },
  elsterMapping: {
    income_services_19: {
      elsterField: "15",
      label: "Umsatzsteuerpflichtige Umsätze (netto)",
    },
    income_services_7: {
      elsterField: "15",
      label: "Umsatzsteuerpflichtige Umsätze (netto)",
    },
    income_services_0: {
      elsterField: "16",
      label: "Steuerfreie und nicht steuerbare Umsätze",
    },
    expense_freelancer: { elsterField: "29", label: "Fremdleistungen" },
    expense_office_supplies: { elsterField: "37", label: "Sonstige Ausgaben" },
    expense_rent_business: { elsterField: "34", label: "Mieten" },
  },
  skrCodeToSemanticKey: (code: string) => {
    const mapping: Record<string, string> = {
      "4000": "income_services_19",
      "4300": "income_services_7",
      "4110": "income_services_0",
      "6815": "expense_office_supplies",
      "5900": "expense_freelancer",
      "6310": "expense_rent_business",
      "1900": "private_withdrawal",
      "1800": "private_deposit",
    };
    return mapping[code];
  },
}));

// Mock ELSTER_FIELDS with complete field definitions
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

describe("calculateEuer", () => {
  describe("Regular Business (with VAT separation)", () => {
    it("should calculate EÜR correctly with VAT separation", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Customer A",
          purposeField: "Invoice #001",
          BetragNumeric: 119.0,
          euerCategory: "4000",
        },
        {
          id: 2,
          dateField: "2024-01-02",
          counterpartyField: "Supplier B",
          purposeField: "Office supplies",
          BetragNumeric: -59.5,
          euerCategory: "6815",
        },
      ];

      const categories = {
        1: "4000",
        2: "6815",
      };
      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBeCloseTo(100, 2);
      expect(result.totalExpenses).toBeCloseTo(50, 2);
      expect(result.profit).toBeCloseTo(50, 2);

      expect(result.vatOwed).toBeCloseTo(19, 2);
      expect(result.vatPaid).toBeCloseTo(9.5, 2);
      expect(result.vatBalance).toBeCloseTo(9.5, 2);

      expect(result.incomeTransactions["4000"]).toHaveLength(1);
      expect(result.expenseTransactions["6815"]).toHaveLength(1);
    });

    it("should handle multiple transactions with different VAT rates", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Customer A",
          purposeField: "Services 19%",
          BetragNumeric: 119.0,
          euerCategory: "4000",
        },
        {
          id: 2,
          dateField: "2024-01-02",
          counterpartyField: "Customer B",
          purposeField: "Services 7%",
          BetragNumeric: 107.0,
          euerCategory: "4300",
        },
        {
          id: 3,
          dateField: "2024-01-03",
          counterpartyField: "Customer C",
          purposeField: "Tax-free services",
          BetragNumeric: 100.0,
          euerCategory: "4110",
        },
      ];

      const categories = {
        1: "4000",
        2: "4300",
        3: "4110",
      };

      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBeCloseTo(300, 2);
      expect(result.vatOwed).toBeCloseTo(26, 2);
    });

    it("should handle negative income amounts correctly", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Customer",
          purposeField: "Refund",
          BetragNumeric: -119.0,
          euerCategory: "4000",
        },
      ];

      const categories = { 1: "4000" };
      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBeCloseTo(100, 2);
      expect(result.vatOwed).toBeCloseTo(19, 2);
    });
  });

  describe("Kleinunternehmer (no VAT separation)", () => {
    it("should not separate VAT for Kleinunternehmer", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Customer A",
          purposeField: "Sale",
          BetragNumeric: 119.0,
          euerCategory: "4000",
        },
        {
          id: 2,
          dateField: "2024-01-02",
          counterpartyField: "Supplier B",
          purposeField: "Purchase",
          BetragNumeric: -59.5,
          euerCategory: "6815",
        },
      ];

      const categories = {
        1: "4000",
        2: "6815",
      };
      const result = calculateEuer(transactions, categories, true);

      expect(result.totalIncome).toBe(119.0);
      expect(result.totalExpenses).toBe(59.5);
      expect(result.profit).toBe(59.5);

      expect(result.vatOwed).toBe(0);
      expect(result.vatPaid).toBe(0);
      expect(result.vatBalance).toBe(0);
    });
  });

  describe("Private Transactions", () => {
    it("should handle private withdrawals correctly", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Owner",
          purposeField: "Private withdrawal",
          BetragNumeric: -500.0,
          euerCategory: "1900",
        },
      ];

      const categories = { 1: "1900" };
      const result = calculateEuer(transactions, categories, false);

      expect(result.privateWithdrawals).toBe(500.0);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.profit).toBe(0);
      expect(result.privateTransactionDetails["1900"]).toHaveLength(1);
    });

    it("should handle private deposits correctly", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Owner",
          purposeField: "Private deposit",
          BetragNumeric: 1000.0,
          euerCategory: "1800",
        },
      ];

      const categories = { 1: "1800" };
      const result = calculateEuer(transactions, categories, false);

      expect(result.privateDeposits).toBe(1000.0);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty transaction array", () => {
      const result = calculateEuer([], {}, false);

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.profit).toBe(0);
      expect(result.vatOwed).toBe(0);
      expect(result.vatPaid).toBe(0);
    });

    it("should handle transactions with invalid categories", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Test",
          purposeField: "Test",
          BetragNumeric: 100,
          euerCategory: "9999",
        },
      ];

      const categories = { 1: "9999" };
      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
    });

    it("should handle transactions without category assignment", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Test",
          purposeField: "Test",
          BetragNumeric: 100,
        },
      ];

      const categories = {};
      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
    });

    it("should handle zero amounts", () => {
      const transactions: Transaction[] = [
        {
          id: 1,
          dateField: "2024-01-01",
          counterpartyField: "Test",
          purposeField: "Test",
          BetragNumeric: 0,
          euerCategory: "4000",
        },
      ];

      const categories = { 1: "4000" };
      const result = calculateEuer(transactions, categories, false);

      expect(result.totalIncome).toBe(0);
      expect(result.vatOwed).toBe(0);
    });
  });
});

describe("calculateVatFields", () => {
  it("should calculate VAT fields for regular business", () => {
    const euerCalculation: EuerCalculation = {
      income: {},
      expenses: {},
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 500,
      profit: 500,
      vatOwed: 190,
      vatPaid: 95,
      vatBalance: 95,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = calculateVatFields(euerCalculation, false);

    expect(result).toHaveLength(2);

    // Field 17: Umsatzsteuer (VAT owed)
    const vatOwedField = result.find((f) => f.field === "17");
    expect(vatOwedField).toBeDefined();
    expect(vatOwedField?.value).toBe(190);
    expect(vatOwedField?.type).toBe("tax");
    expect(vatOwedField?.source).toBe("calculated");

    // Field 57: Vorsteuer (VAT paid)
    const vatPaidField = result.find((f) => f.field === "57");
    expect(vatPaidField).toBeDefined();
    expect(vatPaidField?.value).toBe(95);
    expect(vatPaidField?.type).toBe("tax");
  });

  it("should return empty array for Kleinunternehmer", () => {
    const euerCalculation: EuerCalculation = {
      income: {},
      expenses: {},
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 500,
      profit: 500,
      vatOwed: 0,
      vatPaid: 0,
      vatBalance: 0,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = calculateVatFields(euerCalculation, true);

    expect(result).toHaveLength(0);
  });
});

describe("calculateTotalFields", () => {
  it("should calculate total fields correctly for profit", () => {
    const euerCalculation: EuerCalculation = {
      income: {},
      expenses: {},
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 400,
      profit: 600,
      vatOwed: 0,
      vatPaid: 0,
      vatBalance: 0,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = calculateTotalFields(euerCalculation);

    expect(result).toHaveLength(2);

    // Field 92: Gewinn/Verlust
    const profitField = result.find((f) => f.field === "92");
    expect(profitField?.value).toBe(600);
    expect(profitField?.type).toBe("total");

    // Field 95: Summe der Einkünfte
    const totalIncomeField = result.find((f) => f.field === "95");
    expect(totalIncomeField?.value).toBe(1000);
  });

  it("should calculate total fields correctly for loss", () => {
    const euerCalculation: EuerCalculation = {
      income: {},
      expenses: {},
      privateTransactions: {},
      totalIncome: 400,
      totalExpenses: 600,
      profit: -200,
      vatOwed: 0,
      vatPaid: 0,
      vatBalance: 0,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = calculateTotalFields(euerCalculation);

    const profitField = result.find((f) => f.field === "92");
    expect(profitField?.value).toBe(-200);

    const totalIncomeField = result.find((f) => f.field === "95");
    expect(totalIncomeField?.value).toBe(400);
  });
});

describe("validateMandatoryFields", () => {
  it("should validate when field 15 is present", () => {
    const fieldValues: ElsterFieldValue[] = [
      {
        field: "15",
        value: 1000,
        label: "Umsatzsteuerpflichtige Umsätze (netto)",
        type: "income",
        required: true,
        source: "transaction",
      },
      {
        field: "29",
        value: 500,
        label: "Fremdleistungen",
        type: "expense",
        required: false,
        source: "transaction",
      },
    ];

    const result = validateMandatoryFields(fieldValues);

    expect(result.isValid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it("should validate when field 12 is present (Kleinunternehmer)", () => {
    const fieldValues: ElsterFieldValue[] = [
      {
        field: "12",
        value: 1000,
        label: "Nicht umsatzsteuerpflichtige Erlöse",
        type: "income",
        required: false,
        source: "transaction",
      },
      {
        field: "29",
        value: 500,
        label: "Fremdleistungen",
        type: "expense",
        required: false,
        source: "transaction",
      },
    ];

    const result = validateMandatoryFields(fieldValues);

    expect(result.isValid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it("should identify missing income fields", () => {
    const fieldValues: ElsterFieldValue[] = [
      {
        field: "29",
        value: 500,
        label: "Fremdleistungen",
        type: "expense",
        required: false,
        source: "transaction",
      },
    ];

    const result = validateMandatoryFields(fieldValues);

    expect(result.isValid).toBe(false);
    expect(result.missingFields.length).toBeGreaterThan(0);
  });

  it("should identify missing expense fields", () => {
    const fieldValues: ElsterFieldValue[] = [
      {
        field: "15",
        value: 1000,
        label: "Umsatzsteuerpflichtige Umsätze (netto)",
        type: "income",
        required: true,
        source: "transaction",
      },
      // No expense fields
    ];

    const result = validateMandatoryFields(fieldValues);

    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain(
      "Mindestens eine Ausgabenkategorie (Waren/Fremdleistungen/Personal/Sonstige)",
    );
  });

  it("should handle empty field values array", () => {
    const result = validateMandatoryFields([]);

    expect(result.isValid).toBe(false);
    expect(result.missingFields.length).toBeGreaterThan(0);
  });
});

describe("generateElsterOverview", () => {
  it("should generate overview from EÜR calculation", () => {
    const euerCalculation: EuerCalculation = {
      income: {
        "4000": 1000,
      },
      expenses: {
        "5900": 500,
      },
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 500,
      profit: 500,
      vatOwed: 190,
      vatPaid: 95,
      vatBalance: 95,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const overview = generateElsterOverview(euerCalculation, false);

    expect(overview["15"]).toBeDefined();
    expect(overview["15"].amount).toBe(1000);

    expect(overview["29"]).toBeDefined();
    expect(overview["29"].amount).toBe(500);

    expect(overview["17"]).toBeDefined();
    expect(overview["17"].amount).toBe(190);

    expect(overview["92"]).toBeDefined();
    expect(overview["92"].amount).toBe(500);
  });

  it("should not include VAT fields for Kleinunternehmer", () => {
    const euerCalculation: EuerCalculation = {
      income: {
        "4000": 1000,
      },
      expenses: {},
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 0,
      profit: 1000,
      vatOwed: 0,
      vatPaid: 0,
      vatBalance: 0,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const overview = generateElsterOverview(euerCalculation, true);

    expect(overview["17"]).toBeUndefined();
    expect(overview["57"]).toBeUndefined();

    expect(overview["92"]).toBeDefined();
    expect(overview["92"].amount).toBe(1000);
  });
});

describe("populateElsterFieldsFromCalculation", () => {
  it("should populate fields from EÜR calculation", () => {
    const euerCalculation: EuerCalculation = {
      income: {
        "4000": 1000,
      },
      expenses: {
        "5900": 500,
      },
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 500,
      profit: 500,
      vatOwed: 190,
      vatPaid: 95,
      vatBalance: 95,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = populateElsterFieldsFromCalculation(euerCalculation, false);

    expect(result.fieldValues.length).toBeGreaterThan(0);

    const vatField = result.fieldValues.find((f) => f.field === "17");
    expect(vatField?.value).toBe(190);

    const vatPaidField = result.fieldValues.find((f) => f.field === "57");
    expect(vatPaidField?.value).toBe(95);

    const profitField = result.fieldValues.find((f) => f.field === "92");
    expect(profitField?.value).toBe(500);

    const totalIncomeField = result.fieldValues.find((f) => f.field === "23");
    expect(totalIncomeField?.value).toBe(1000);
  });

  it("should not populate VAT fields for Kleinunternehmer", () => {
    const euerCalculation: EuerCalculation = {
      income: {
        "4000": 1000,
      },
      expenses: {},
      privateTransactions: {},
      totalIncome: 1000,
      totalExpenses: 0,
      profit: 1000,
      vatOwed: 0,
      vatPaid: 0,
      vatBalance: 0,
      privateWithdrawals: 0,
      privateDeposits: 0,
      incomeTransactions: {},
      expenseTransactions: {},
      privateTransactionDetails: {},
    };

    const result = populateElsterFieldsFromCalculation(euerCalculation, true);

    const vatField = result.fieldValues.find((f) => f.field === "17");
    expect(vatField?.value).toBe(0);

    const vatPaidField = result.fieldValues.find((f) => f.field === "57");
    expect(vatPaidField?.value).toBe(0);
  });
});

describe("populateAllElsterFields", () => {
  it("should populate all fields from transactions", () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        dateField: "2024-01-01",
        counterpartyField: "Customer A",
        purposeField: "Invoice",
        BetragNumeric: 119.0,
        euerCategory: "4000",
      },
    ];

    const categories = { 1: "4000" };
    const result = populateAllElsterFields(transactions, categories, false);

    expect(result.fieldValues.length).toBeGreaterThan(0);

    const vatField = result.fieldValues.find((f) => f.field === "17");
    expect(vatField).toBeDefined();
    expect(vatField?.value).toBeCloseTo(19, 2);

    const profitField = result.fieldValues.find((f) => f.field === "92");
    expect(profitField).toBeDefined();
    expect(profitField?.value).toBeCloseTo(100, 2);
  });

  it("should handle empty transactions", () => {
    const result = populateAllElsterFields([], {}, false);

    expect(result.fieldValues.length).toBeGreaterThan(0);

    const profitField = result.fieldValues.find((f) => f.field === "92");
    expect(profitField?.value).toBe(0);
  });
});
