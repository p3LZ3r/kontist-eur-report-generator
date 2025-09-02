import type { Transaction, EuerCalculation, ElsterFieldValue } from '../types';
import { skr04Categories, elsterMapping } from './categoryMappings';
import { ELSTER_FIELDS } from './constants';

// EÜR berechnen mit/ohne USt
/**
 * Calculates EÜR (Einnahmen-Überschuss-Rechnung) from categorized transactions.
 *
 * VAT Separation Logic:
 * - Kleinunternehmer: No VAT separation - amounts remain gross
 * - Regular businesses: VAT is separated from gross amounts using category VAT rates
 * - Income: Net amount = gross / (1 + VAT rate), VAT owed = gross - net
 * - Expenses: Net amount = gross / (1 + VAT rate), VAT paid = gross - net
 * - Private transactions: Always gross amounts (no VAT separation)
 *
 * @param transactions - Array of bank transactions
 * @param categories - Transaction category mappings
 * @param isKleinunternehmer - Whether business is Kleinunternehmer
 * @param skrCategories - SKR categories to use for calculation
 * @returns Complete EÜR calculation results
 */
export const calculateEuer = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    isKleinunternehmer: boolean,
    skrCategories: Record<string, any> = skr04Categories
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
        const category = skrCategories[categoryKey];
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

// Generate Elster summary - enhanced with complete field set
export const generateElsterOverview = (
    euerCalculation: EuerCalculation,
    isKleinunternehmer?: boolean
) => {
    const elsterSummary: { [key: string]: { amount: number; label: string; categories: { name: string; amount: number }[] } } = {};

    // Add transaction-based income and expense fields
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

    // Add calculated fields if isKleinunternehmer is provided
    if (isKleinunternehmer !== undefined) {
        // Add VAT fields if not Kleinunternehmer
        if (!isKleinunternehmer) {
            // Umsatzsteuer (field 23)
            if (!elsterSummary['23']) {
                elsterSummary['23'] = {
                    amount: euerCalculation.vatOwed,
                    label: ELSTER_FIELDS['23'].label,
                    categories: []
                };
            }

            // Vorsteuer (field 24)
            if (!elsterSummary['24']) {
                elsterSummary['24'] = {
                    amount: euerCalculation.vatPaid,
                    label: ELSTER_FIELDS['24'].label,
                    categories: []
                };
            }

            // Umsatzsteuer-Soll (field 44)
            if (!elsterSummary['44']) {
                elsterSummary['44'] = {
                    amount: euerCalculation.vatOwed,
                    label: ELSTER_FIELDS['44'].label,
                    categories: []
                };
            }

            // Umsatzsteuer-Haben (field 45)
            if (!elsterSummary['45']) {
                elsterSummary['45'] = {
                    amount: euerCalculation.vatPaid,
                    label: ELSTER_FIELDS['45'].label,
                    categories: []
                };
            }

            // Umsatzsteuer-Saldo (field 46)
            if (!elsterSummary['46']) {
                elsterSummary['46'] = {
                    amount: euerCalculation.vatBalance,
                    label: ELSTER_FIELDS['46'].label,
                    categories: []
                };
            }
        }

        // Add total fields
        // Gesamtbetrag der Einkünfte (field 52)
        if (!elsterSummary['52']) {
            elsterSummary['52'] = {
                amount: euerCalculation.totalIncome,
                label: ELSTER_FIELDS['52'].label,
                categories: []
            };
        }

        // Zu versteuerndes Einkommen (field 54)
        if (!elsterSummary['54']) {
            elsterSummary['54'] = {
                amount: euerCalculation.profit,
                label: ELSTER_FIELDS['54'].label,
                categories: []
            };
        }
    }

    return elsterSummary;
};

// Calculate VAT-related fields based on Kleinunternehmer status
/**
 * Calculates and populates VAT-related ELSTER fields (23-24, 44-46).
 *
 * Automatic Population Rules for VAT Fields:
 * - Kleinunternehmer: No VAT fields populated (exempt from VAT)
 * - Regular businesses: All VAT fields calculated from transaction data
 * - Field 23 (Umsatzsteuer): Total VAT owed from sales (calculated)
 * - Field 24 (Vorsteuer): Total VAT paid on purchases (calculated)
 * - Field 44 (Umsatzsteuer-Soll): Same as field 23
 * - Field 45 (Umsatzsteuer-Haben): Same as field 24
 * - Field 46 (Umsatzsteuer-Saldo): VAT balance (owed - paid)
 *
 * @param euerCalculation - EÜR calculation results
 * @param isKleinunternehmer - Whether business is Kleinunternehmer
 * @returns Array of populated VAT field values
 */
export const calculateVatFields = (
    euerCalculation: EuerCalculation,
    isKleinunternehmer: boolean
): ElsterFieldValue[] => {
    const vatFields: ElsterFieldValue[] = [];

    if (!isKleinunternehmer) {
        // Field 23: Umsatzsteuer (VAT owed)
        vatFields.push({
            field: '23',
            value: euerCalculation.vatOwed,
            label: ELSTER_FIELDS['23'].label,
            type: 'income',
            required: ELSTER_FIELDS['23'].required,
            source: 'calculated'
        });

        // Field 24: Vorsteuer (VAT paid)
        vatFields.push({
            field: '24',
            value: euerCalculation.vatPaid,
            label: ELSTER_FIELDS['24'].label,
            type: 'income',
            required: ELSTER_FIELDS['24'].required,
            source: 'calculated'
        });

        // Field 44: Umsatzsteuer-Soll
        vatFields.push({
            field: '44',
            value: euerCalculation.vatOwed,
            label: ELSTER_FIELDS['44'].label,
            type: 'tax',
            required: ELSTER_FIELDS['44'].required,
            source: 'calculated'
        });

        // Field 45: Umsatzsteuer-Haben
        vatFields.push({
            field: '45',
            value: euerCalculation.vatPaid,
            label: ELSTER_FIELDS['45'].label,
            type: 'tax',
            required: ELSTER_FIELDS['45'].required,
            source: 'calculated'
        });

        // Field 46: Umsatzsteuer-Saldo
        vatFields.push({
            field: '46',
            value: euerCalculation.vatBalance,
            label: ELSTER_FIELDS['46'].label,
            type: 'tax',
            required: ELSTER_FIELDS['46'].required,
            source: 'calculated'
        });
    }

    return vatFields;
};

// Calculate total fields
export const calculateTotalFields = (euerCalculation: EuerCalculation): ElsterFieldValue[] => {
    const totalFields: ElsterFieldValue[] = [];

    // Field 52: Gesamtbetrag der Einkünfte (Total income)
    totalFields.push({
        field: '52',
        value: euerCalculation.totalIncome,
        label: ELSTER_FIELDS['52'].label,
        type: 'total',
        required: ELSTER_FIELDS['52'].required,
        source: 'calculated'
    });

    // Field 54: Zu versteuerndes Einkommen (Taxable income = income - expenses)
    totalFields.push({
        field: '54',
        value: euerCalculation.profit,
        label: ELSTER_FIELDS['54'].label,
        type: 'total',
        required: ELSTER_FIELDS['54'].required,
        source: 'calculated'
    });

    return totalFields;
};

// Validate mandatory fields
/**
 * Validates that all mandatory ELSTER fields are populated.
 *
 * Validation Rules:
 * - Personal data fields (1-16): Name, address, tax number, fiscal year, profession, etc. are required
 * - Income fields: At least field 17 (Umsatzerlöse) must be populated
 * - Expense fields: At least field 25 (Wareneinkauf/Fremdleistungen) must be populated
 * - Optional fields: VAT ID, first name, and other non-critical fields are not validated
 *
 * @param fieldValues - Array of populated field values
 * @returns Validation result with missing fields list
 */
export const validateMandatoryFields = (fieldValues: ElsterFieldValue[]): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    // Check income fields (17-24) - at least field 17 is required
    const incomeField17 = fieldValues.find(fv => fv.field === '17');
    if (!incomeField17 || !incomeField17.value) {
        missingFields.push(ELSTER_FIELDS['17'].label);
    }

    // Check expense fields (25-36) - at least field 25 is required
    const expenseField25 = fieldValues.find(fv => fv.field === '25');
    if (!expenseField25 || !expenseField25.value) {
        missingFields.push(ELSTER_FIELDS['25'].label);
    }

    return {
        isValid: missingFields.length === 0,
        missingFields
    };
};

// Comprehensive automatic field population
/**
 * Main function for automatic population of all ELSTER fields (1-60+).
 *
 * Automatic Population Process:
 * 1. Calculate EÜR from categorized transactions
 * 2. Populate personal data fields (1-16) from user tax data
 * 3. Generate transaction-based fields (17-36) using existing generateElsterOverview
 * 4. Calculate VAT fields (23-24, 44-46) based on Kleinunternehmer status
 * 5. Calculate total fields (52, 54) from EÜR results
 * 6. Validate all mandatory fields are populated
 *
 * Field Population Sources:
 * - Personal data (1-16): User tax data
 * - Income/Expense (17-36): Transaction data via category mappings
 * - VAT fields (23-24, 44-46): Calculated from transactions (only for regular businesses)
 * - Total fields (52, 54): Calculated from EÜR totals
 * - Extended fields (37-60+): Available for future manual entry or additional calculations
 *
 * @param transactions - Array of bank transactions
 * @param categories - Transaction category mappings
 * @param isKleinunternehmer - Kleinunternehmer status
 * @returns Complete field population with validation results
 */
export const populateAllElsterFields = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    isKleinunternehmer: boolean
): { fieldValues: ElsterFieldValue[]; validation: { isValid: boolean; missingFields: string[] } } => {
    const fieldValues: ElsterFieldValue[] = [];

    // 1. Calculate EÜR from transactions
    const euerCalculation = calculateEuer(transactions, categories, isKleinunternehmer);

    // 2. Generate Elster overview from transactions
    const elsterOverview = generateElsterOverview(euerCalculation, isKleinunternehmer);

    // 3. Convert overview to field values
    Object.entries(elsterOverview).forEach(([field, data]) => {
        const fieldDef = ELSTER_FIELDS[field as keyof typeof ELSTER_FIELDS];
        fieldValues.push({
            field,
            value: data.amount,
            label: data.label,
            type: fieldDef?.type || 'expense',
            required: fieldDef?.required || false,
            source: 'transaction'
        });
    });

    // 4. Calculate VAT fields
    const vatFields = calculateVatFields(euerCalculation, isKleinunternehmer);
    fieldValues.push(...vatFields);

    // 5. Calculate total fields
    const totalFields = calculateTotalFields(euerCalculation);
    fieldValues.push(...totalFields);

    // 6. Validate mandatory fields (skip personal data validation)
    const validation = validateMandatoryFields(fieldValues);

    return {
        fieldValues,
        validation
    };
};