import type { EuerCalculation, CompanyInfo, KontenrahmenType, Transaction, UserTaxData, ElsterFieldValue } from '../types';
import { generateReport as generateReportFromGenerator } from './reportGenerator';
import { populateAllElsterFields } from './euerCalculations';

export const generateReport = (
    euerCalculation: EuerCalculation,
    companyInfo: CompanyInfo,
    selectedKontenrahmen: KontenrahmenType,
    bankType: string | null,
    isKleinunternehmer: boolean,
    transactions: any[]
): string => {
    return generateReportFromGenerator(euerCalculation, companyInfo, selectedKontenrahmen, bankType, isKleinunternehmer, transactions);
};

export const downloadReport = (reportContent: string, currentYear: number, selectedKontenrahmen: KontenrahmenType, isKleinunternehmer: boolean): void => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EÜR_${currentYear}_${selectedKontenrahmen}_${isKleinunternehmer ? 'KU_Brutto' : 'USt_Netto'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
};

// Generate ELSTER CSV export
export const generateElsterCSV = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    userTaxData: UserTaxData,
    isKleinunternehmer: boolean
): string => {
    const { fieldValues, validation } = populateAllElsterFields(transactions, categories, userTaxData, isKleinunternehmer);

    if (!validation.isValid) {
        throw new Error(`ELSTER Export fehlgeschlagen: Fehlende Pflichtfelder: ${validation.missingFields.join(', ')}`);
    }

    // CSV Header
    const headers = ['Feldnummer', 'Bezeichnung', 'Wert', 'Typ', 'Pflichtfeld', 'Quelle'];
    let csvContent = headers.join(';') + '\n';

    // Add field data
    fieldValues.forEach(field => {
        const row = [
            field.field,
            `"${field.label}"`,
            typeof field.value === 'number' ? field.value.toString().replace('.', ',') : `"${field.value}"`,
            field.type,
            field.required ? 'Ja' : 'Nein',
            field.source
        ];
        csvContent += row.join(';') + '\n';
    });

    return csvContent;
};

// Generate ELSTER JSON export
export const generateElsterJSON = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    userTaxData: UserTaxData,
    isKleinunternehmer: boolean
): string => {
    const { fieldValues, validation } = populateAllElsterFields(transactions, categories, userTaxData, isKleinunternehmer);

    if (!validation.isValid) {
        throw new Error(`ELSTER Export fehlgeschlagen: Fehlende Pflichtfelder: ${validation.missingFields.join(', ')}`);
    }

    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            version: '1.0',
            isKleinunternehmer,
            validation: validation
        },
        personalData: fieldValues.filter(f => f.type === 'personal'),
        incomeData: fieldValues.filter(f => f.type === 'income'),
        expenseData: fieldValues.filter(f => f.type === 'expense'),
        taxData: fieldValues.filter(f => f.type === 'tax'),
        totalData: fieldValues.filter(f => f.type === 'total'),
        allFields: fieldValues
    };

    return JSON.stringify(exportData, null, 2);
};

// Download ELSTER CSV
export const downloadElsterCSV = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    userTaxData: UserTaxData,
    isKleinunternehmer: boolean,
    currentYear: number
): void => {
    try {
        const csvContent = generateElsterCSV(transactions, categories, userTaxData, isKleinunternehmer);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ELSTER_${currentYear}_${isKleinunternehmer ? 'KU' : 'USt'}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Fehler beim ELSTER CSV Export');
    }
};

// Download ELSTER JSON
export const downloadElsterJSON = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    userTaxData: UserTaxData,
    isKleinunternehmer: boolean,
    currentYear: number
): void => {
    try {
        const jsonContent = generateElsterJSON(transactions, categories, userTaxData, isKleinunternehmer);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ELSTER_${currentYear}_${isKleinunternehmer ? 'KU' : 'USt'}.json`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert(error instanceof Error ? error.message : 'Fehler beim ELSTER JSON Export');
    }
};

// Validate ELSTER data before export
export const validateElsterData = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    userTaxData: UserTaxData,
    isKleinunternehmer: boolean
): { isValid: boolean; missingFields: string[]; fieldValues: ElsterFieldValue[] } => {
    const { fieldValues, validation } = populateAllElsterFields(transactions, categories, userTaxData, isKleinunternehmer);
    return {
        isValid: validation.isValid,
        missingFields: validation.missingFields,
        fieldValues
    };
};