import { useCallback, useState } from "react";
import type { Transaction } from "../../../types";
import { semanticKeyToSkrCode } from "../../../utils/categoryMappings";
import { validateCSVContent } from "../../../utils/sanitization";
import {
  categorizeTransaction,
  detectBankFormat,
  parseHolviCSV,
  parseKontistCSV,
} from "../../../utils/transactionUtils";

type SkrType = "SKR03" | "SKR04" | "SKR49";

/**
 * useFileUpload manages CSV file upload, parsing, and validation for
 * Kontist and Holvi transaction formats.
 *
 * @returns Object with handleFileUpload function, loading state, and error state
 *
 * @example
 * const { handleFileUpload, isLoading, error, clearError } = useFileUpload()
 * const result = await handleFileUpload(file, "SKR04")
 * if (result) {
 *   // Handle success
 *   const { transactions, bankType, categories } = result
 * }
 */
export function useFileUpload() {
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (
      file: File,
      currentSkr: SkrType,
    ): Promise<{
      transactions: Transaction[];
      bankType: string;
      categories: Record<number, string>;
    } | null> => {
      setIsProcessingFile(true);
      setErrorMessage(null);

      try {
        if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
          throw new Error("Ungültiger Dateityp. Bitte laden Sie eine CSV-Datei (.csv) hoch.");
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error("Datei ist zu groß. Maximale Dateigröße: 10MB.");
        }

        if (file.size === 0) {
          throw new Error(
            "Die hochgeladene Datei ist leer. Bitte wählen Sie eine gültige CSV-Datei.",
          );
        }

        let text: string;
        try {
          text = await file.text();
        } catch {
          throw new Error("Fehler beim Lesen der Datei. Die Datei könnte beschädigt sein.");
        }

        if (text.trim().length === 0) {
          throw new Error("Die CSV-Datei ist leer oder enthält keine gültigen Daten.");
        }

        const lines = text.split("\n").filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error(
            "Die CSV-Datei enthält zu wenig Daten. Mindestens eine Kopfzeile und eine Datenzeile sind erforderlich.",
          );
        }

        validateCSVContent(text);

        const detectedBankType = detectBankFormat(text);

        let parsedTransactions: Transaction[];

        if (detectedBankType === "kontist") {
          parsedTransactions = parseKontistCSV(text);
        } else if (detectedBankType === "holvi") {
          parsedTransactions = parseHolviCSV(text);
        } else {
          throw new Error(
            "Unbekanntes CSV-Format. Unterstützt werden nur Kontist und Holvi Exporte. Bitte stellen Sie sicher, dass Sie die CSV-Datei direkt aus Ihrem Banking-Portal exportiert haben.",
          );
        }

        if (!parsedTransactions || parsedTransactions.length === 0) {
          throw new Error(
            "Keine Transaktionen in der CSV-Datei gefunden. Bitte überprüfen Sie, ob die Datei Transaktionsdaten enthält.",
          );
        }

        // Categorize transactions and translate semantic keys to SKR codes
        const autoCategories: Record<number, string> = {};
        parsedTransactions.forEach((t) => {
          const semanticKey = categorizeTransaction(t);
          t.euerCategory = semanticKey;
          // Translate semantic key to SKR code for storage
          autoCategories[t.id] = semanticKeyToSkrCode(semanticKey, currentSkr);
        });

        return {
          transactions: parsedTransactions,
          bankType: detectedBankType,
          categories: autoCategories,
        };
      } catch (error) {
        let errorMsg = "Unbekannter Fehler beim Verarbeiten der Datei.";

        if (error instanceof Error) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        setErrorMessage(errorMsg);
        return null;
      } finally {
        setIsProcessingFile(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    handleFileUpload,
    isLoading: isProcessingFile,
    error: errorMessage,
    clearError,
  };
}
