import { useCallback, useState } from "react";
import type { Transaction } from "../../../types";
import { semanticKeyToSkrCode } from "../../../utils/categoryMappings";
import { loadDemoData } from "../../../utils/demoUtils";
import { categorizeTransaction } from "../../../utils/transactionUtils";

type SkrType = "SKR03" | "SKR04" | "SKR49";

/**
 * useDemoData handles loading and processing of demo transaction data.
 *
 * @returns Object with loadDemo function, loading state, and error state
 *
 * @example
 * const { loadDemo, isLoading, error } = useDemoData()
 * const result = loadDemo("SKR04")
 * if (result) {
 *   const { transactions, categories } = result
 * }
 */
export function useDemoData() {
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDemo = useCallback(
    (
      currentSkr: SkrType,
    ): {
      transactions: Transaction[];
      categories: Record<number, string>;
    } | null => {
      setIsProcessingFile(true);
      setErrorMessage(null);

      try {
        const demoTransactions = loadDemoData();

        // Categorize transactions and translate semantic keys to SKR codes
        const autoCategories: Record<number, string> = {};
        demoTransactions.forEach((t) => {
          const semanticKey = categorizeTransaction(t);
          t.euerCategory = semanticKey;
          // Translate semantic key to SKR code for storage
          autoCategories[t.id] = semanticKeyToSkrCode(semanticKey, currentSkr);
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
    },
    [],
  );

  return {
    loadDemo,
    isLoading: isProcessingFile,
    error: errorMessage,
  };
}
