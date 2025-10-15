import { useCallback, useState } from "react";
import type { Transaction } from "../../../types";
import { validateCSVContent } from "../../../utils/sanitization";
import {
	categorizeTransaction,
	detectBankFormat,
	parseHolviCSV,
	parseKontistCSV,
} from "../../../utils/transactionUtils";

/**
 * useFileUpload manages CSV file upload, parsing, and validation for
 * Kontist and Holvi transaction formats.
 *
 * @returns Object with handleFileUpload function, loading state, and error state
 *
 * @example
 * const { handleFileUpload, isLoading, error, clearError } = useFileUpload()
 * const result = await handleFileUpload(file)
 * if (result) {
 *   // Handle success
 *   const { transactions, bankType } = result
 * }
 */
export function useFileUpload() {
	const [isProcessingFile, setIsProcessingFile] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleFileUpload = useCallback(
		async (
			file: File,
		): Promise<{
			transactions: Transaction[];
			bankType: string;
			categories: Record<number, string>;
		} | null> => {
			setIsProcessingFile(true);
			setErrorMessage(null);

			try {
				// Validate file type
				if (
					!file.name.toLowerCase().endsWith(".csv") &&
					file.type !== "text/csv"
				) {
					throw new Error(
						"Ungültiger Dateityp. Bitte laden Sie eine CSV-Datei (.csv) hoch.",
					);
				}

				// Validate file size (max 10MB)
				const maxSize = 10 * 1024 * 1024; // 10MB
				if (file.size > maxSize) {
					throw new Error("Datei ist zu groß. Maximale Dateigröße: 10MB.");
				}

				// Validate file is not empty
				if (file.size === 0) {
					throw new Error(
						"Die hochgeladene Datei ist leer. Bitte wählen Sie eine gültige CSV-Datei.",
					);
				}

				let text: string;
				try {
					text = await file.text();
				} catch {
					throw new Error(
						"Fehler beim Lesen der Datei. Die Datei könnte beschädigt sein.",
					);
				}

				// Validate file content is not empty
				if (text.trim().length === 0) {
					throw new Error(
						"Die CSV-Datei ist leer oder enthält keine gültigen Daten.",
					);
				}

				// Validate CSV structure (basic check for commas/semicolons)
				const lines = text.split("\n").filter((line) => line.trim().length > 0);
				if (lines.length < 2) {
					throw new Error(
						"Die CSV-Datei enthält zu wenig Daten. Mindestens eine Kopfzeile und eine Datenzeile sind erforderlich.",
					);
				}

				// Validate CSV content for security issues
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

				// Validate that transactions were successfully parsed
				if (!parsedTransactions || parsedTransactions.length === 0) {
					throw new Error(
						"Keine Transaktionen in der CSV-Datei gefunden. Bitte überprüfen Sie, ob die Datei Transaktionsdaten enthält.",
					);
				}

				// EÜR-Kategorien zuweisen (alle Transaktionen, auch Privatentnahmen)
				parsedTransactions.forEach((t) => {
					t.euerCategory = categorizeTransaction(t);
				});

				// Automatische Kategorisierung
				const autoCategories: Record<number, string> = {};
				parsedTransactions.forEach((t) => {
					autoCategories[t.id] = t.euerCategory || "";
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
