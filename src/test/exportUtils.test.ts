import { describe, expect, it, vi } from "vite-plus/test";
import type { Transaction } from "../types";
import { populateAllElsterFields } from "../utils/euerCalculations";
import { validateElsterData } from "../utils/exportUtils";

vi.mock("../utils/euerCalculations", () => ({
  populateAllElsterFields: vi.fn(),
}));

global.URL.createObjectURL = vi.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = vi.fn();

Object.defineProperty(document, "createElement", {
  value: vi.fn(() => ({
    href: "",
    download: "",
    click: vi.fn(),
  })),
  writable: true,
});

const mockSkrCategories = {
  "4000": { name: "Umsatzerlöse 19%", type: "income" as const, code: "4000", vat: 19 },
};

describe("validateElsterData", () => {
  it("should return validation results", () => {
    const mockTransactions: Transaction[] = [];
    const mockCategories = {};

    const mockFieldValues = [
      {
        field: "1",
        value: "Mustermann",
        label: "Name",
        type: "personal" as const,
        required: true,
        source: "user_data" as const,
      },
    ];

    const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
    mockedPopulateAllElsterFields.mockReturnValue({
      fieldValues: mockFieldValues,
      validation: { isValid: true, missingFields: [] },
    });

    const result = validateElsterData(mockTransactions, mockCategories, false, mockSkrCategories);

    expect(result).toHaveProperty("isValid");
    expect(result).toHaveProperty("missingFields");
    expect(result).toHaveProperty("fieldValues");
    expect(result.isValid).toBe(true);
    expect(result.missingFields).toEqual([]);
    expect(result.fieldValues).toEqual(mockFieldValues);
  });
});