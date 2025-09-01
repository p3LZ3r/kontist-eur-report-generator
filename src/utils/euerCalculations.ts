import type { Transaction, EuerCalculation } from '../types';
import { skr04Categories, elsterMapping } from './categoryMappings';

// EÜR berechnen mit/ohne USt
export const calculateEuer = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    isKleinunternehmer: boolean
): EuerCalculation => {
    const result: EuerCalculation = {
        income: {},
        expenses: {},
        privateTransactions: {},
        totalIncome: 0,
        totalExpenses: 0,
        profit: 0,
        vatOwed: 0,
        vatPaid: 0,
        vatBalance: 0,
        privateWithdrawals: 0,
        privateDeposits: 0
    };

    transactions.forEach(transaction => {
        const categoryKey = categories[transaction.id] || transaction.euerCategory;
        if (!categoryKey) return; // Skip if no category key
        const category = skr04Categories[categoryKey];
        if (!category) return; // Skip if category not found

        const grossAmount = Math.abs(transaction.BetragNumeric);

        // USt-Berechnung nur wenn nicht Kleinunternehmer
        let netAmount = grossAmount;
        let vatAmount = 0;

        if (!isKleinunternehmer && category.vat > 0) {
            netAmount = grossAmount / (1 + category.vat / 100);
            vatAmount = grossAmount - netAmount;
        }

        if (category.type === 'income') {
            result.income[categoryKey] = (result.income[categoryKey] || 0) + netAmount;
            result.totalIncome += netAmount;
            if (!isKleinunternehmer) {
                result.vatOwed += vatAmount;
            }
        } else if (category.type === 'expense') {
            result.expenses[categoryKey] = (result.expenses[categoryKey] || 0) + netAmount;
            result.totalExpenses += netAmount;
            if (!isKleinunternehmer) {
                result.vatPaid += vatAmount;
            }
        } else if (category.type === 'private') {
            result.privateTransactions[categoryKey] = (result.privateTransactions[categoryKey] || 0) + grossAmount;
            if (categoryKey === 'private_withdrawal') {
                result.privateWithdrawals += grossAmount;
            } else if (categoryKey === 'private_deposit') {
                result.privateDeposits += grossAmount;
            }
        }
    });

    result.profit = result.totalIncome - result.totalExpenses;
    result.vatBalance = result.vatOwed - result.vatPaid;

    return result;
};

// Generate Elster summary
export const generateElsterOverview = (euerCalculation: EuerCalculation) => {
    const elsterSummary: { [key: string]: { amount: number; label: string; categories: { name: string; amount: number }[] } } = {};

    Object.entries(euerCalculation.income).forEach(([key, amount]) => {
        const elsterInfo = elsterMapping[key];
        if (elsterInfo) {
            if (!elsterSummary[elsterInfo.elsterField]) {
                elsterSummary[elsterInfo.elsterField] = {
                    amount: 0,
                    label: elsterInfo.label,
                    categories: []
                };
            }
            elsterSummary[elsterInfo.elsterField].amount += amount;
            elsterSummary[elsterInfo.elsterField].categories.push({
                name: skr04Categories[key].name,
                amount
            });
        }
    });

    Object.entries(euerCalculation.expenses).forEach(([key, amount]) => {
        const elsterInfo = elsterMapping[key];
        if (elsterInfo) {
            if (!elsterSummary[elsterInfo.elsterField]) {
                elsterSummary[elsterInfo.elsterField] = {
                    amount: 0,
                    label: elsterInfo.label,
                    categories: []
                };
            }
            elsterSummary[elsterInfo.elsterField].amount += amount;
            elsterSummary[elsterInfo.elsterField].categories.push({
                name: skr04Categories[key].name,
                amount
            });
        }
    });

    return elsterSummary;
};