import type { ElsterFieldValue, EuerCalculation, Transaction } from "../types";
import { ELSTER_FIELDS } from "./constants";
import { getElsterFieldForSkrCode, getElsterFieldInfo } from "./elsterSkrMapping";

type SkrCategoryData = {
  code: string;
  name: string;
  type: string;
  vat: number;
  elsterField?: string;
};

type SkrCategories = Record<string, SkrCategoryData>;

export const calculateEuer = (
  transactions: Transaction[],
  categories: { [key: number]: string },
  isKleinunternehmer: boolean,
  skrCategories: SkrCategories,
): EuerCalculation => {
  const result: EuerCalculation = {
    income: {},
    expenses: {},
    privateTransactions: {},
    totalIncome: 0,
    totalIncomeGross: 0,
    totalExpenses: 0,
    profit: 0,
    vatOwed: 0,
    vatPaid: 0,
    vatBalance: 0,
    privateWithdrawals: 0,
    privateDeposits: 0,
    incomeTransactions: {},
    expenseTransactions: {},
    privateTransactionDetails: {},
  };

  for (const transaction of transactions) {
    const categoryKey = categories[transaction.id] || transaction.euerCategory;
    if (!categoryKey) continue;
    const category = skrCategories[categoryKey];
    if (!category) continue;

    const grossAmount = Math.abs(transaction.BetragNumeric);

    let netAmount = grossAmount;
    let vatAmount = 0;

    if (!isKleinunternehmer && category.vat > 0) {
      netAmount = grossAmount / (1 + category.vat / 100);
      vatAmount = grossAmount - netAmount;
    }

    if (category.type === "income") {
      result.income[categoryKey] = (result.income[categoryKey] || 0) + netAmount;
      result.totalIncome += netAmount;
      result.totalIncomeGross += grossAmount;

      if (!result.incomeTransactions[categoryKey]) {
        result.incomeTransactions[categoryKey] = [];
      }
      result.incomeTransactions[categoryKey].push(transaction);

      if (!isKleinunternehmer) {
        result.vatOwed += vatAmount;
      }
    } else if (category.type === "expense") {
      result.expenses[categoryKey] = (result.expenses[categoryKey] || 0) + netAmount;
      result.totalExpenses += netAmount;

      if (!result.expenseTransactions[categoryKey]) {
        result.expenseTransactions[categoryKey] = [];
      }
      result.expenseTransactions[categoryKey].push(transaction);

      if (!isKleinunternehmer) {
        result.vatPaid += vatAmount;
      }
    } else if (category.type === "private") {
      result.privateTransactions[categoryKey] =
        (result.privateTransactions[categoryKey] || 0) + grossAmount;

      if (!result.privateTransactionDetails[categoryKey]) {
        result.privateTransactionDetails[categoryKey] = [];
      }
      result.privateTransactionDetails[categoryKey].push(transaction);

      if (categoryKey === "1900") {
        result.privateWithdrawals += grossAmount;
      } else if (categoryKey === "1800") {
        result.privateDeposits += grossAmount;
      }
    }
  }

  result.profit = result.totalIncome - result.totalExpenses;
  result.vatBalance = result.vatOwed - result.vatPaid;

  return result;
};

export const generateElsterOverview = (
  euerCalculation: EuerCalculation,
  isKleinunternehmer: boolean | undefined,
  skrCategories: SkrCategories,
) => {
  const elsterSummary: {
    [key: string]: {
      amount: number;
      label: string;
      categories: { name: string; amount: number; skrCode: string }[];
    };
  } = {};

  const addCategoryToSummary = (skrCode: string, amount: number, category: SkrCategoryData) => {
    const elsterField = getElsterFieldForSkrCode(skrCode);
    const elsterInfo = getElsterFieldInfo(elsterField);

    if (elsterInfo) {
      if (!elsterSummary[elsterField]) {
        elsterSummary[elsterField] = {
          amount: 0,
          label: elsterInfo.label,
          categories: [],
        };
      }
      elsterSummary[elsterField].amount += amount;
      elsterSummary[elsterField].categories.push({
        name: category.name,
        amount,
        skrCode,
      });
    }
  };

  for (const [skrCode, amount] of Object.entries(euerCalculation.income)) {
    const category = skrCategories[skrCode];
    if (category) {
      addCategoryToSummary(skrCode, amount, category);
    }
  }

  for (const [skrCode, amount] of Object.entries(euerCalculation.expenses)) {
    const category = skrCategories[skrCode];
    if (category) {
      addCategoryToSummary(skrCode, amount, category);
    }
  }

  if (isKleinunternehmer !== undefined) {
    if (!isKleinunternehmer) {
      if (!elsterSummary["17"]) {
        elsterSummary["17"] = {
          amount: euerCalculation.vatOwed,
          label: ELSTER_FIELDS["17"].label,
          categories: [],
        };
      }

      if (!elsterSummary["57"]) {
        elsterSummary["57"] = {
          amount: euerCalculation.vatPaid,
          label: ELSTER_FIELDS["57"].label,
          categories: [],
        };
      }
    }

    if (!elsterSummary["92"]) {
      elsterSummary["92"] = {
        amount: euerCalculation.profit,
        label: ELSTER_FIELDS["92"].label,
        categories: [],
      };
    }

    if (!elsterSummary["95"]) {
      elsterSummary["95"] = {
        amount: euerCalculation.totalIncome,
        label: ELSTER_FIELDS["95"].label,
        categories: [],
      };
    }
  }

  return elsterSummary;
};

export const calculateVatFields = (
  euerCalculation: EuerCalculation,
  isKleinunternehmer: boolean,
): ElsterFieldValue[] => {
  const vatFields: ElsterFieldValue[] = [];

  if (!isKleinunternehmer) {
    vatFields.push({
      field: "17",
      value: euerCalculation.vatOwed,
      label: ELSTER_FIELDS["17"].label,
      type: "vat",
      required: ELSTER_FIELDS["17"].required,
      source: "calculated",
    });

    vatFields.push({
      field: "57",
      value: euerCalculation.vatPaid,
      label: ELSTER_FIELDS["57"].label,
      type: "vat_paid",
      required: ELSTER_FIELDS["57"].required,
      source: "calculated",
    });
  }

  return vatFields;
};

export const calculateTotalFields = (euerCalculation: EuerCalculation): ElsterFieldValue[] => {
  const totalFields: ElsterFieldValue[] = [];

  totalFields.push({
    field: "92",
    value: euerCalculation.profit,
    label: ELSTER_FIELDS["92"].label,
    type: "total",
    required: ELSTER_FIELDS["92"].required,
    source: "calculated",
  });

  totalFields.push({
    field: "95",
    value: euerCalculation.totalIncome,
    label: ELSTER_FIELDS["95"].label,
    type: "total",
    required: ELSTER_FIELDS["95"].required,
    source: "calculated",
  });

  return totalFields;
};

export const validateMandatoryFields = (
  fieldValues: ElsterFieldValue[],
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  const incomeField15 = fieldValues.find((fv) => fv.field === "15");
  if (!(incomeField15 && incomeField15.value)) {
    const incomeField12 = fieldValues.find((fv) => fv.field === "12");
    if (!(incomeField12 && incomeField12.value)) {
      missingFields.push(`${ELSTER_FIELDS["15"].label} oder ${ELSTER_FIELDS["12"].label}`);
    }
  }

  const mainExpenseFields = ["27", "29", "30", "37"];
  const hasExpenses = mainExpenseFields.some((fieldNum) => {
    const expenseField = fieldValues.find((fv) => fv.field === fieldNum);
    return expenseField && Number(expenseField.value) > 0;
  });

  if (!hasExpenses) {
    missingFields.push(
      "Mindestens eine Ausgabenkategorie (Waren/Fremdleistungen/Personal/Sonstige)",
    );
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const populateElsterFieldsFromCalculation = (
  euerCalculation: EuerCalculation,
  isKleinunternehmer: boolean,
  skrCategories: SkrCategories,
): {
  fieldValues: ElsterFieldValue[];
  validation: { isValid: boolean; missingFields: string[] };
} => {
  const fieldValues: ElsterFieldValue[] = [];

  const elsterOverview = generateElsterOverview(euerCalculation, isKleinunternehmer, skrCategories);

  for (const [fieldNumber, fieldDef] of Object.entries(ELSTER_FIELDS)) {
    if (fieldDef.type === "personal") continue;

    const overviewData = elsterOverview[fieldNumber];
    let value = overviewData?.amount || 0;
    let source: "transaction" | "user_data" | "calculated" = "calculated";
    const transactions: Transaction[] = [];
    const categoryBreakdown: {
      [category: string]: { amount: number; transactions: Transaction[] };
    } = {};

    if (fieldNumber === "17") {
      value = isKleinunternehmer ? 0 : euerCalculation.vatOwed;
      source = "calculated";
    } else if (fieldNumber === "57") {
      value = isKleinunternehmer ? 0 : euerCalculation.vatPaid;
      source = "calculated";
    } else if (fieldNumber === "23") {
      value = euerCalculation.totalIncomeGross || euerCalculation.totalIncome;
      source = "calculated";
      for (const categoryTransactions of Object.values(euerCalculation.incomeTransactions)) {
        transactions.push(...categoryTransactions);
      }
    } else if (fieldNumber === "52") {
      value = euerCalculation.totalIncome;
      source = "calculated";
      for (const categoryTransactions of Object.values(euerCalculation.incomeTransactions)) {
        transactions.push(...categoryTransactions);
      }
    } else if (fieldNumber === "75") {
      value = euerCalculation.totalExpenses;
      source = "calculated";
      for (const categoryTransactions of Object.values(euerCalculation.expenseTransactions)) {
        transactions.push(...categoryTransactions);
      }
    } else if (fieldNumber === "76") {
      value = euerCalculation.profit;
      source = "calculated";
    } else if (fieldNumber === "77") {
      value = 0;
      source = "calculated";
    } else if (fieldNumber === "92") {
      value = euerCalculation.profit > 0 ? euerCalculation.profit : 0;
      source = "calculated";
    } else if (fieldNumber === "93") {
      value = euerCalculation.profit < 0 ? Math.abs(euerCalculation.profit) : 0;
      source = "calculated";
    } else if (fieldNumber === "94") {
      value = 0;
      source = "calculated";
    } else if (fieldNumber === "95") {
      value = euerCalculation.profit > 0 ? euerCalculation.profit : 0;
      source = "calculated";
    } else if (fieldNumber === "96") {
      value = euerCalculation.profit < 0 ? Math.abs(euerCalculation.profit) : 0;
      source = "calculated";
    } else if (overviewData?.categories) {
      for (const categoryData of overviewData.categories) {
        const skrCode = categoryData.skrCode;
        const categoryTransactions =
          euerCalculation.incomeTransactions[skrCode] ||
          euerCalculation.expenseTransactions[skrCode] ||
          [];

        transactions.push(...categoryTransactions);

        categoryBreakdown[categoryData.name] = {
          amount: categoryData.amount,
          transactions: [...categoryTransactions],
        };
      }
    }

    fieldValues.push({
      field: fieldNumber,
      label: fieldDef.label,
      value,
      source,
      required: fieldDef.required,
      type: fieldDef.type as
        | "personal"
        | "income"
        | "expense"
        | "tax"
        | "total"
        | "vat"
        | "vat_paid"
        | "profit_calc",
      readOnlyCalculated: (fieldDef as { autoCalculated?: boolean }).autoCalculated === true,
      transactions: transactions.length > 0 ? transactions : undefined,
      categoryBreakdown: Object.keys(categoryBreakdown).length > 0 ? categoryBreakdown : undefined,
    });
  }

  const requiredFields = fieldValues.filter((f) => f.required);
  const missingFields = requiredFields
    .filter((f) => f.value === undefined || f.value === null || f.value === 0)
    .map((f) => f.field);

  return {
    fieldValues,
    validation: {
      isValid: missingFields.length === 0,
      missingFields,
    },
  };
};

export const populateAllElsterFields = (
  transactions: Transaction[],
  categories: { [key: number]: string },
  isKleinunternehmer: boolean,
  skrCategories: SkrCategories,
): {
  fieldValues: ElsterFieldValue[];
  validation: { isValid: boolean; missingFields: string[] };
} => {
  const euerCalculation = calculateEuer(
    transactions,
    categories,
    isKleinunternehmer,
    skrCategories,
  );

  return populateElsterFieldsFromCalculation(euerCalculation, isKleinunternehmer, skrCategories);
};
