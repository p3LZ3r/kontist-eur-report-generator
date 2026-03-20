import type {
  DrillDownData,
  ElsterFieldValue,
  EuerCalculation,
  FieldGroup,
  NavigationSection,
  ProgressState,
  Transaction,
} from "../types";
import { populateAllElsterFields, populateElsterFieldsFromCalculation } from "./euerCalculations";
import { getElsterFieldForSkrCode } from "./elsterSkrMapping";

type SkrCategoryData = {
  code: string;
  name: string;
  type: string;
  vat: number;
  elsterField?: string;
};

type SkrCategories = Record<string, SkrCategoryData>;

export const createNavigationSections = (): NavigationSection[] => [
  {
    id: "income",
    title: "Betriebseinnahmen",
    description: "Einnahmen und Umsatzsteuer",
    icon: "trending-up",
    fields: ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
    completed: false,
    required: true,
  },
  {
    id: "expenses",
    title: "Betriebsausgaben",
    description: "Ausgaben und Vorsteuer",
    icon: "trending-down",
    fields: Array.from({ length: 75 - 24 + 1 }, (_, i) => (24 + i).toString()),
    completed: false,
    required: true,
  },
  {
    id: "profit",
    title: "Gewinnermittlung",
    description: "Gewinn/Verlust Berechnung",
    icon: "calculator",
    fields: Array.from({ length: 98 - 76 + 1 }, (_, i) => (76 + i).toString()),
    completed: false,
    required: true,
  },
];

export const createFieldGroups = (fieldValues: ElsterFieldValue[]): FieldGroup[] => {
  const income = fieldValues
    .filter((f) => f.type === "income")
    .sort((a, b) => Number.parseInt(a.field, 10) - Number.parseInt(b.field, 10));
  const expenses = fieldValues
    .filter((f) => f.type === "expense")
    .sort((a, b) => Number.parseInt(a.field, 10) - Number.parseInt(b.field, 10));
  const vat = fieldValues
    .filter((f) => f.type === "vat" || f.type === "vat_paid")
    .sort((a, b) => Number.parseInt(a.field, 10) - Number.parseInt(b.field, 10));
  const totals = fieldValues
    .filter((f) => f.type === "total" || f.type === "profit_calc")
    .sort((a, b) => Number.parseInt(a.field, 10) - Number.parseInt(b.field, 10));

  const groups: FieldGroup[] = [];
  if (income.length) {
    groups.push({
      id: "einnahmen",
      title: "Betriebseinnahmen",
      description: "",
      fields: income,
      expanded: true,
      category: "income",
    });
  }
  if (expenses.length) {
    groups.push({
      id: "ausgaben",
      title: "Betriebsausgaben",
      description: "",
      fields: expenses,
      expanded: true,
      category: "expense",
    });
  }
  if (vat.length) {
    groups.push({
      id: "umsatzsteuer",
      title: "Umsatzsteuer",
      description: "",
      fields: vat,
      expanded: true,
      category: "tax",
    });
  }
  if (totals.length) {
    groups.push({
      id: "gewinnermittlung",
      title: "Gewinnermittlung",
      description: "",
      fields: totals,
      expanded: true,
      category: "total",
    });
  }

  return groups;
};

export const calculateProgressState = (
  sections: NavigationSection[],
  fieldValues: ElsterFieldValue[],
): ProgressState => {
  const totalSections = sections.length;
  const completedSections = sections.filter((s) => s.completed).length;

  const totalFields = fieldValues.length;
  const completedFields = fieldValues.filter(
    (f) => f.value !== undefined && f.value !== null && f.value !== "",
  ).length;

  const mandatoryFields = fieldValues.filter((f) => f.required).length;
  const completedMandatoryFields = fieldValues.filter(
    (f) => f.required && f.value !== undefined && f.value !== null && f.value !== "",
  ).length;

  return {
    totalSections,
    completedSections,
    totalFields,
    completedFields,
    mandatoryFields,
    completedMandatoryFields,
  };
};

export const generateDrillDownData = (
  field: ElsterFieldValue,
  transactions: Transaction[],
  categories: { [key: number]: string },
  skrCategories: SkrCategories,
): DrillDownData | undefined => {
  if (field.source === "user_data") {
    return;
  }

  const relevantTransactions: Transaction[] = [];
  const categoryBreakdown: { [category: string]: number } = {};
  const vatBreakdown: { [rate: number]: number } = {};

  for (const transaction of transactions) {
    const categoryKey = categories[transaction.id] || transaction.euerCategory;
    if (!categoryKey) continue;

    const skrCategory = skrCategories[categoryKey];
    if (!skrCategory) continue;

    const elsterField = getElsterFieldForSkrCode(categoryKey);
    if (elsterField !== field.field) continue;

    relevantTransactions.push(transaction);

    categoryBreakdown[skrCategory.name] =
      (categoryBreakdown[skrCategory.name] || 0) + Math.abs(transaction.BetragNumeric);

    if (skrCategory.vat > 0) {
      vatBreakdown[skrCategory.vat] =
        (vatBreakdown[skrCategory.vat] || 0) + Math.abs(transaction.BetragNumeric);
    }
  }

  return {
    field: field.field,
    transactions: relevantTransactions,
    totalAmount: relevantTransactions.reduce((sum, t) => sum + Math.abs(t.BetragNumeric), 0),
    categoryBreakdown,
    vatBreakdown: Object.keys(vatBreakdown).length > 0 ? vatBreakdown : undefined,
  };
};

export const prepareGuidanceData = (
  transactions: Transaction[],
  categories: { [key: number]: string },
  isKleinunternehmer: boolean,
  skrCategories: SkrCategories,
  euerCalculation?: EuerCalculation,
) => {
  const { fieldValues } = euerCalculation
    ? populateElsterFieldsFromCalculation(euerCalculation, isKleinunternehmer, skrCategories)
    : populateAllElsterFields(transactions, categories, isKleinunternehmer, skrCategories);

  const sections = createNavigationSections();

  const groups = createFieldGroups(fieldValues);

  const progress = calculateProgressState(sections, fieldValues);

  for (const section of sections) {
    const sectionFields = fieldValues.filter((f) => section.fields.includes(f.field));
    const requiredFields = sectionFields.filter((f) => f.required);
    const completedRequiredFields = requiredFields.filter(
      (f) => f.value !== undefined && f.value !== null && f.value !== "",
    );

    section.completed =
      requiredFields.length > 0 && completedRequiredFields.length === requiredFields.length;
  }

  return {
    fieldValues,
    sections,
    groups,
    progress,
  };
};

export const getFieldTransactions = (
  field: ElsterFieldValue,
  transactions: Transaction[],
  categories: { [key: number]: string },
  _skrCategories: SkrCategories,
): Transaction[] => {
  if (field.source === "user_data") {
    return [];
  }

  const relevantTransactions: Transaction[] = [];

  for (const transaction of transactions) {
    const categoryKey = categories[transaction.id] || transaction.euerCategory;
    if (!categoryKey) continue;

    const elsterField = getElsterFieldForSkrCode(categoryKey);
    if (elsterField === field.field) {
      relevantTransactions.push(transaction);
    }
  }

  return relevantTransactions;
};
