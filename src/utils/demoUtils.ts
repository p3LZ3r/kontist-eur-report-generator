import { demoTransactions } from "../data/demo-transactions";
import type { Transaction } from "../types";

/**
 * Converts demo transaction data to the same format as CSV upload
 * This ensures consistency with the existing transaction processing pipeline
 */
export const loadDemoData = (): Transaction[] => {
	return demoTransactions.map((demoTransaction, index) => {
		// Convert the demo transaction to the same format as parseKontistCSV
		const transaction: Record<string, string | number> = {};

		// Map demo fields to transaction object
		transaction.Buchungsdatum = demoTransaction.Buchungsdatum;
		transaction.Betrag = demoTransaction.Betrag;
		transaction.Verwendungszweck = demoTransaction.Verwendungszweck;
		transaction.Empfänger = demoTransaction.Empfänger;

		// Parse amount (convert German decimal format to numeric)
		const betragStr = demoTransaction.Betrag.replace(",", ".");
		transaction.BetragNumeric = parseFloat(betragStr) || 0;

		// Set ID and required fields
		transaction.id = index;
		transaction.dateField = demoTransaction.Buchungsdatum;
		transaction.counterpartyField = demoTransaction.Empfänger;
		transaction.purposeField = demoTransaction.Verwendungszweck;

		return transaction as Transaction;
	});
};

/**
 * Returns information about the demo dataset
 */
export const getDemoInfo = () => {
	const transactions = loadDemoData();
	const incomeCount = transactions.filter((t) => t.BetragNumeric > 0).length;
	const expenseCount = transactions.filter((t) => t.BetragNumeric < 0).length;
	const totalIncome = transactions
		.filter((t) => t.BetragNumeric > 0)
		.reduce((sum, t) => sum + t.BetragNumeric, 0);
	const totalExpenses = Math.abs(
		transactions
			.filter((t) => t.BetragNumeric < 0)
			.reduce((sum, t) => sum + t.BetragNumeric, 0),
	);

	return {
		totalTransactions: transactions.length,
		incomeCount,
		expenseCount,
		totalIncome,
		totalExpenses,
		dateRange: {
			start: "2024-01-03",
			end: "2024-12-30",
		},
		categories: [
			"Einnahmen aus Dienstleistungen (19% USt)",
			"Büromiete",
			"Software-Lizenzen",
			"Telefon/Internet",
			"Büromaterial",
			"Steuerberatung",
			"Versicherungen",
			"Marketing/Werbung",
			"Treibstoff",
			"Fachliteratur",
			"Privatentnahmen",
		],
	};
};
