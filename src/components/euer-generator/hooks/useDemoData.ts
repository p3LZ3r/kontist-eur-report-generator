import { useCallback, useState } from "react";
import type { Transaction } from "../../../types";
import { loadDemoData } from "../../../utils/demoUtils";
import { categorizeTransaction } from "../../../utils/transactionUtils";

/**
 * useDemoData handles loading and processing of demo transaction data.
 *
 * @returns Object with loadDemo function, loading state, and error state
 *
 * @example
 * const { loadDemo, isLoading, error } = useDemoData()
 * const result = loadDemo()
 * if (result) {
 *   const { transactions, categories } = result
 * }
 */
export function useDemoData() {
	const [isProcessingFile, setIsProcessingFile] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const loadDemo = useCallback((): {
		transactions: Transaction[];
		categories: Record<number, string>;
	} | null => {
		setIsProcessingFile(true);
		setErrorMessage(null);

		try {
			// Load demo transactions
			const demoTransactions = loadDemoData();

			// Categorize all demo transactions
			demoTransactions.forEach((t) => {
				t.euerCategory = categorizeTransaction(t);
			});

			// Set auto-categories
			const autoCategories: Record<number, string> = {};
			demoTransactions.forEach((t) => {
				autoCategories[t.id] = t.euerCategory || "";
			});

			return {
				transactions: demoTransactions,
				categories: autoCategories,
			};
		} catch (error) {
			let errorMsg = "Fehler beim Laden der Demo-Daten.";
			if (error instanceof Error) {
				errorMsg = error.message;
			}
			setErrorMessage(errorMsg);
			return null;
		} finally {
			setIsProcessingFile(false);
		}
	}, []);

	return {
		loadDemo,
		isLoading: isProcessingFile,
		error: errorMessage,
	};
}
