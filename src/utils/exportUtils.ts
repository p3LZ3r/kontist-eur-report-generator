import type {
  ElsterFieldValue,
  EuerCalculation,
  KontenrahmenType,
  Transaction,
} from "../types";
import { populateAllElsterFields } from "./euerCalculations";
import { generateReport as generateReportFromGenerator } from "./reportGenerator";

export const generateReport = (
  euerCalculation: EuerCalculation,
  selectedKontenrahmen: KontenrahmenType,
  bankType: string | null,
  isKleinunternehmer: boolean,
  transactions: Transaction[]
): string => {
  // Use default company info for report generation
  const defaultCompanyInfo = {
    name: "",
    address: "",
    taxNumber: "",
    vatNumber: "",
    taxRate: "19",
  };
  return generateReportFromGenerator(
    euerCalculation,
    defaultCompanyInfo,
    selectedKontenrahmen,
    bankType,
    isKleinunternehmer,
    transactions
  );
};

export const downloadReport = (
  reportContent: string,
  currentYear: number,
  selectedKontenrahmen: KontenrahmenType,
  isKleinunternehmer: boolean
): void => {
  const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `EÜR_${currentYear}_${selectedKontenrahmen}_${isKleinunternehmer ? "KU_Brutto" : "USt_Netto"}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

// Validate ELSTER data before export
export const validateElsterData = (
  transactions: Transaction[],
  categories: { [key: number]: string },
  isKleinunternehmer: boolean
): {
  isValid: boolean;
  missingFields: string[];
  fieldValues: ElsterFieldValue[];
} => {
  const { fieldValues, validation } = populateAllElsterFields(
    transactions,
    categories,
    isKleinunternehmer
  );
  return {
    isValid: validation.isValid,
    missingFields: validation.missingFields,
    fieldValues,
  };
};
