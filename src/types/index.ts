export interface Account {
  id: string;
  name: string;
  type: string;
  code: number | string;
  'sort-code': number;
  description: string;
  categories: string[];
  leaf: boolean;
  parent?: string;
  'hierarchicalCategories.lvl0'?: string;
  'hierarchicalCategories.lvl1'?: string;
  'tax-related'?: boolean;
  placeholder?: boolean;
}

export interface CategoryMapping {
  name: string;
  type: 'income' | 'expense' | 'private';
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
  [key: string]: any;
}

export interface CompanyInfo {
  name: string;
  address: string;
  taxNumber: string;
  vatNumber: string;
  taxRate: string;
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
}

export type KontenrahmenType = 'SKR03' | 'SKR04';

export interface ElsterMapping {
  [categoryKey: string]: {
    elsterField: string;
    label: string;
  };
}

export interface ElsterField {
  label: string;
  type: 'personal' | 'income' | 'expense' | 'tax' | 'total';
  required: boolean;
}

export interface UserTaxData {
  name: string;
  firstName?: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  taxNumber: string;
  vatId?: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  profession: string;
  profitDeterminationMethod: string;
  isKleinunternehmer: boolean;
  isVatLiable: boolean;
  isBookkeepingRequired: boolean;
  isBalanceSheetRequired: boolean;
}

export interface ElsterFieldValue {
  field: string;
  value: number | string;
  label: string;
  type: 'personal' | 'income' | 'expense' | 'tax' | 'total';
  required: boolean;
  source: 'transaction' | 'user_data' | 'calculated';
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
  category: 'personal' | 'income' | 'expense' | 'tax' | 'total';
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