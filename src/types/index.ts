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