export interface Account {
  id: string;
  name: string;
  type: string;
  code: number | string;
  "sort-code": number;
  description: string;
  categories: string[];
  leaf: boolean;
  parent?: string;
  "hierarchicalCategories.lvl0"?: string;
  "hierarchicalCategories.lvl1"?: string;
  "tax-related"?: boolean;
  placeholder?: boolean;
}

export interface CategoryMapping {
  name: string;
  type: "income" | "expense" | "private";
  code: string;
  vat: number;
}

export interface KontenrahmenData {
  [key: string]: CategoryMapping;
}

export interface Transaction {
  id: number;
  dateField: string;
  counterpartyField: string;
  purposeField: string;
  BetragNumeric: number;
  euerCategory?: string;
  [key: string]: unknown;
}

export interface EuerCalculation {
  income: { [key: string]: number };
  expenses: { [key: string]: number };
  privateTransactions: { [key: string]: number };
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  vatOwed: number;
  vatPaid: number;
  vatBalance: number;
  privateWithdrawals: number;
  privateDeposits: number;
  // Transaktionsdetails für aufklappbare Bereiche
  incomeTransactions: { [key: string]: Transaction[] };
  expenseTransactions: { [key: string]: Transaction[] };
  privateTransactionDetails: { [key: string]: Transaction[] };
}

export type KontenrahmenType = "SKR03" | "SKR04" | "SKR49";

export interface ElsterMapping {
  [categoryKey: string]: {
    elsterField: string;
    label: string;
  };
}

export interface ElsterField {
  label: string;
  type:
    | "personal"
    | "income"
    | "expense"
    | "tax"
    | "total"
    | "vat"
    | "vat_paid"
    | "profit_calc";
  required: boolean;
}

export interface ElsterFieldValue {
  field: string;
  value: number | string;
  label: string;
  type:
    | "personal"
    | "income"
    | "expense"
    | "tax"
    | "total"
    | "vat"
    | "vat_paid"
    | "profit_calc";
  required: boolean;
  source: "transaction" | "user_data" | "calculated";
  readOnlyCalculated?: boolean;
  // Transaktionsdetails für aufklappbare Bereiche
  transactions?: Transaction[];
  categoryBreakdown?: {
    [category: string]: { amount: number; transactions: Transaction[] };
  };
}

// Navigation and UI interfaces for ELSTER guidance system
export interface NavigationSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: string[];
  completed: boolean;
  required: boolean;
}

export interface FieldGroup {
  id: string;
  title: string;
  description: string;
  fields: ElsterFieldValue[];
  expanded: boolean;
  category: "personal" | "income" | "expense" | "tax" | "total";
}

export interface ProgressState {
  totalSections: number;
  completedSections: number;
  totalFields: number;
  completedFields: number;
  mandatoryFields: number;
  completedMandatoryFields: number;
}

export interface HelpContent {
  field: string;
  title: string;
  description: string;
  examples: string[];
  requirements: string[];
  relatedFields?: string[];
}

export interface DrillDownData {
  field: string;
  transactions: Transaction[];
  totalAmount: number;
  categoryBreakdown: { [category: string]: number };
  vatBreakdown?: { [rate: number]: number };
}

export interface NavigationState {
  currentSection: string;
  expandedGroups: Set<string>;
  completedFields: Set<string>;
  helpVisible: boolean;
  modalOpen: boolean;
  selectedField?: string;
}

export interface CompanyInfo {
  name?: string;
  address?: string;
  taxNumber?: string;
  vatNumber?: string;
}
