// Application constants for better maintainability
import { loadNormalizedElsterFields } from "./eurFieldsLoader";

export const PAGINATION = {
  TRANSACTIONS_PER_PAGE: 25,
  MAX_VISIBLE_PAGES: 5,
} as const;

export const VAT_RATES = {
  STANDARD: 19,
  REDUCED: 7,
  ZERO: 0,
} as const;

export const AMOUNT_THRESHOLDS = {
  OFFICE_SUPPLIES_MAX: 50,
  LOW_VALUE_ASSETS_MIN: 50,
  LOW_VALUE_ASSETS_MAX: 800,
} as const;

export const ELSTER_FIELD_RANGES = {
  PERSONAL_DATA_START: 1,
  PERSONAL_DATA_END: 11,
  INCOME_START: 12,
  INCOME_END: 20,
  VAT_START: 17,
  VAT_END: 18,
  EXPENSE_START: 27,
  EXPENSE_END: 66,
  VAT_PAID_START: 57,
  VAT_PAID_END: 58,
  PROFIT_CALC_START: 78,
  PROFIT_CALC_END: 91,
} as const;

// Complete ELSTER EÜR field definitions (based on official documentation)
// Build ELSTER_FIELDS from normalized fields to ensure full coverage
export const ELSTER_FIELDS = (() => {
  const map: {
    [key: string]: {
      label: string;
      type: string;
      required: boolean;
      autoCalculated?: boolean;
    };
  } = {};

  // Load fields from eurFieldsLoader
  const normalized = loadNormalizedElsterFields();

  for (const f of normalized) {
    map[f.field] = {
      label: f.label,
      type: f.type,
      required: f.required,
      autoCalculated: f.autoCalculated,
    };
  }
  return map;
})();
