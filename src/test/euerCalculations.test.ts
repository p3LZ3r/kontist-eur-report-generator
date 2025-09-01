import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    calculateEuer,
    populatePersonalDataFields,
    calculateVatFields,
    validateMandatoryFields,
    populateAllElsterFields,
    generateElsterOverview
} from '../utils/euerCalculations';
import type { Transaction, UserTaxData, EuerCalculation, ElsterFieldValue } from '../types';

// Mock dependencies
vi.mock('../utils/categoryMappings', () => ({
    skr04Categories: {
        'income_sales': { name: 'Umsatzerlöse', type: 'income', vat: 19 },
        'expense_office': { name: 'Büromaterial', type: 'expense', vat: 19 },
        'private_withdrawal': { name: 'Privatentnahme', type: 'private', vat: 0 }
    },
    elsterMapping: {
        'income_sales': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
        'expense_office': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' }
    }
}));

vi.mock('../utils/constants', () => ({
    ELSTER_FIELDS: {
        '1': { label: 'Name', type: 'personal', required: true },
        '2': { label: 'Vorname', type: 'personal', required: false },
        '3': { label: 'Straße', type: 'personal', required: true },
        '4': { label: 'Hausnummer', type: 'personal', required: true },
        '5': { label: 'PLZ', type: 'personal', required: true },
        '6': { label: 'Ort', type: 'personal', required: true },
        '7': { label: 'Steuernummer', type: 'personal', required: true },
        '8': { label: 'USt-ID', type: 'personal', required: false },
        '9': { label: 'Wirtschaftsjahr von', type: 'personal', required: true },
        '10': { label: 'Wirtschaftsjahr bis', type: 'personal', required: true },
        '11': { label: 'Beruf', type: 'personal', required: true },
        '12': { label: 'Gewinnermittlungsart', type: 'personal', required: true },
        '13': { label: 'Kleinunternehmer', type: 'personal', required: true },
        '14': { label: 'Umsatzsteuerpflichtig', type: 'personal', required: true },
        '15': { label: 'Buchführungspflichtig', type: 'personal', required: true },
        '16': { label: 'Bilanzierungspflichtig', type: 'personal', required: true },
        '17': { label: 'Umsatzerlöse (steuerpflichtig)', type: 'income', required: true },
        '23': { label: 'Umsatzsteuer', type: 'income', required: false },
        '24': { label: 'Vorsteuer', type: 'income', required: false },
        '25': { label: 'Wareneinkauf/Fremdleistungen', type: 'expense', required: true },
        '44': { label: 'Umsatzsteuer-Soll', type: 'tax', required: false },
        '45': { label: 'Umsatzsteuer-Haben', type: 'tax', required: false },
        '46': { label: 'Umsatzsteuer-Saldo', type: 'tax', required: false },
        '52': { label: 'Gesamtbetrag der Einkünfte', type: 'total', required: false },
        '54': { label: 'Zu versteuerndes Einkommen', type: 'total', required: false }
    },
    ELSTER_FIELD_RANGES: {
        PERSONAL_DATA_START: 1,
        PERSONAL_DATA_END: 16,
        INCOME_START: 17,
        INCOME_END: 24,
        EXPENSE_START: 25,
        EXPENSE_END: 36
    }
}));

describe('calculateEuer', () => {
    it('should calculate EÜR correctly for regular business', () => {
        const transactions: Transaction[] = [
            {
                id: 1,
                dateField: '2024-01-01',
                counterpartyField: 'Customer A',
                purposeField: 'Sale',
                BetragNumeric: 119.00,
                euerCategory: 'income_sales'
            },
            {
                id: 2,
                dateField: '2024-01-02',
                counterpartyField: 'Supplier B',
                purposeField: 'Office supplies',
                BetragNumeric: -119.00,
                euerCategory: 'expense_office'
            }
        ];

        const categories = { 1: 'income_sales', 2: 'expense_office' };
        const isKleinunternehmer = false;

        const result = calculateEuer(transactions, categories, isKleinunternehmer);

        expect(result.totalIncome).toBe(100); // 119 / 1.19
        expect(result.totalExpenses).toBe(100); // 119 / 1.19
        expect(result.profit).toBe(0);
        expect(result.vatOwed).toBe(19); // 119 - 100
        expect(result.vatPaid).toBe(19); // 119 - 100
        expect(result.vatBalance).toBe(0);
    });

    it('should handle Kleinunternehmer correctly (no VAT separation)', () => {
        const transactions: Transaction[] = [
            {
                id: 1,
                dateField: '2024-01-01',
                counterpartyField: 'Customer A',
                purposeField: 'Sale',
                BetragNumeric: 119.00,
                euerCategory: 'income_sales'
            },
            {
                id: 2,
                dateField: '2024-01-02',
                counterpartyField: 'Supplier B',
                purposeField: 'Office supplies',
                BetragNumeric: -119.00,
                euerCategory: 'expense_office'
            }
        ];

        const categories = { 1: 'income_sales', 2: 'expense_office' };
        const isKleinunternehmer = true;

        const result = calculateEuer(transactions, categories, isKleinunternehmer);

        expect(result.totalIncome).toBe(119); // Gross amount
        expect(result.vatOwed).toBe(0); // No VAT separation
        expect(result.vatPaid).toBe(0);
    });

    it('should handle private transactions correctly', () => {
        const transactions: Transaction[] = [
            {
                id: 1,
                dateField: '2024-01-01',
                counterpartyField: 'Owner',
                purposeField: 'Private withdrawal',
                BetragNumeric: -500.00,
                euerCategory: 'private_withdrawal'
            }
        ];

        const categories = { 1: 'private_withdrawal' };
        const isKleinunternehmer = false;

        const result = calculateEuer(transactions, categories, isKleinunternehmer);

        expect(result.privateWithdrawals).toBe(500);
        expect(result.totalIncome).toBe(0);
        expect(result.totalExpenses).toBe(0);
    });
});

describe('populatePersonalDataFields', () => {
    it('should populate required personal data fields correctly', () => {
        const userTaxData: UserTaxData = {
            name: 'Mustermann',
            firstName: 'Max',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            vatId: 'DE123456789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Software Developer',
            profitDeterminationMethod: 'Einnahmen-Überschuss-Rechnung',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const result = populatePersonalDataFields(userTaxData);

        expect(result).toHaveLength(16); // All personal fields

        // Check required fields
        const nameField = result.find(f => f.field === '1');
        expect(nameField?.value).toBe('Mustermann');
        expect(nameField?.required).toBe(true);

        const taxNumberField = result.find(f => f.field === '7');
        expect(taxNumberField?.value).toBe('123/456/789');

        // Check optional fields
        const firstNameField = result.find(f => f.field === '2');
        expect(firstNameField?.value).toBe('Max');

        const vatIdField = result.find(f => f.field === '8');
        expect(vatIdField?.value).toBe('DE123456789');

        // Check boolean fields
        const kleinunternehmerField = result.find(f => f.field === '13');
        expect(kleinunternehmerField?.value).toBe('Nein');
    });

    it('should handle missing optional fields', () => {
        const userTaxData: UserTaxData = {
            name: 'Mustermann',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Software Developer',
            profitDeterminationMethod: 'Einnahmen-Überschuss-Rechnung',
            isKleinunternehmer: true,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const result = populatePersonalDataFields(userTaxData);

        // Should not include firstName field if not provided
        const firstNameField = result.find(f => f.field === '2');
        expect(firstNameField).toBeUndefined();

        // Should not include VAT ID field if not provided
        const vatIdField = result.find(f => f.field === '8');
        expect(vatIdField).toBeUndefined();
    });
});

describe('calculateVatFields', () => {
    it('should calculate VAT fields for regular business', () => {
        const euerCalculation: EuerCalculation = {
            income: {},
            expenses: {},
            privateTransactions: {},
            totalIncome: 1000,
            totalExpenses: 500,
            profit: 500,
            vatOwed: 190,
            vatPaid: 95,
            vatBalance: 95,
            privateWithdrawals: 0,
            privateDeposits: 0
        };

        const result = calculateVatFields(euerCalculation, false);

        expect(result).toHaveLength(5);

        const vatOwedField = result.find(f => f.field === '23');
        expect(vatOwedField?.value).toBe(190);

        const vatPaidField = result.find(f => f.field === '24');
        expect(vatPaidField?.value).toBe(95);

        const vatBalanceField = result.find(f => f.field === '46');
        expect(vatBalanceField?.value).toBe(95);
    });

    it('should return empty array for Kleinunternehmer', () => {
        const euerCalculation: EuerCalculation = {
            income: {},
            expenses: {},
            privateTransactions: {},
            totalIncome: 1000,
            totalExpenses: 500,
            profit: 500,
            vatOwed: 0,
            vatPaid: 0,
            vatBalance: 0,
            privateWithdrawals: 0,
            privateDeposits: 0
        };

        const result = calculateVatFields(euerCalculation, true);

        expect(result).toHaveLength(0);
    });
});

describe('validateMandatoryFields', () => {
    it('should validate mandatory fields correctly', () => {
        const fieldValues: ElsterFieldValue[] = [
            { field: '1', value: 'Mustermann', label: 'Name', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '3', value: 'Hauptstraße', label: 'Straße', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '4', value: '123', label: 'Hausnummer', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '5', value: '12345', label: 'PLZ', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '6', value: 'Berlin', label: 'Ort', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '7', value: '123/456/789', label: 'Steuernummer', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '9', value: '2024', label: 'Wirtschaftsjahr von', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '10', value: '2024', label: 'Wirtschaftsjahr bis', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '11', value: 'Developer', label: 'Beruf', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '12', value: 'EÜR', label: 'Gewinnermittlungsart', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '13', value: 'Nein', label: 'Kleinunternehmer', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '14', value: 'Ja', label: 'Umsatzsteuerpflichtig', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '15', value: 'Nein', label: 'Buchführungspflichtig', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '16', value: 'Nein', label: 'Bilanzierungspflichtig', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '17', value: 1000, label: 'Umsatzerlöse (steuerpflichtig)', type: 'income' as const, required: true, source: 'transaction' as const },
            { field: '25', value: 500, label: 'Wareneinkauf/Fremdleistungen', type: 'expense' as const, required: true, source: 'transaction' as const }
        ];

        const result = validateMandatoryFields(fieldValues);

        expect(result.isValid).toBe(true);
        expect(result.missingFields).toHaveLength(0);
    });

    it('should identify missing mandatory fields', () => {
        const fieldValues: ElsterFieldValue[] = [
            { field: '1', value: 'Mustermann', label: 'Name', type: 'personal' as const, required: true, source: 'user_data' as const },
            // Missing tax number (field 7)
            { field: '17', value: 1000, label: 'Umsatzerlöse (steuerpflichtig)', type: 'income' as const, required: true, source: 'transaction' as const },
            // Missing expense field 25
        ];

        const result = validateMandatoryFields(fieldValues);

        expect(result.isValid).toBe(false);
        expect(result.missingFields).toContain('Steuernummer');
        expect(result.missingFields).toContain('Wareneinkauf/Fremdleistungen');
    });

    it('should handle empty values as missing', () => {
        const fieldValues: ElsterFieldValue[] = [
            { field: '1', value: '', label: 'Name', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '7', value: '123/456/789', label: 'Steuernummer', type: 'personal' as const, required: true, source: 'user_data' as const },
            { field: '17', value: 0, label: 'Umsatzerlöse (steuerpflichtig)', type: 'income' as const, required: true, source: 'transaction' as const }
        ];

        const result = validateMandatoryFields(fieldValues);

        expect(result.isValid).toBe(false);
        expect(result.missingFields).toContain('Name');
        expect(result.missingFields).toContain('Umsatzerlöse (steuerpflichtig)');
    });
});

describe('populateAllElsterFields', () => {
    it('should populate all ELSTER fields correctly', () => {
        const transactions: Transaction[] = [
            {
                id: 1,
                dateField: '2024-01-01',
                counterpartyField: 'Customer A',
                purposeField: 'Sale',
                BetragNumeric: 119.00,
                euerCategory: 'income_sales'
            }
        ];

        const categories = { 1: 'income_sales' };

        const userTaxData: UserTaxData = {
            name: 'Mustermann',
            firstName: 'Max',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            vatId: 'DE123456789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Software Developer',
            profitDeterminationMethod: 'Einnahmen-Überschuss-Rechnung',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const result = populateAllElsterFields(transactions, categories, userTaxData, false);

        expect(result.fieldValues.length).toBeGreaterThan(16); // Personal + transaction + VAT + total fields
        expect(result.validation.isValid).toBe(true);

        // Check personal data
        const nameField = result.fieldValues.find(f => f.field === '1');
        expect(nameField?.value).toBe('Mustermann');

        // Check transaction data
        const incomeField = result.fieldValues.find(f => f.field === '17');
        expect(incomeField?.value).toBe(100); // Net amount

        // Check VAT fields
        const vatOwedField = result.fieldValues.find(f => f.field === '23');
        expect(vatOwedField?.value).toBe(19);
    });

    it('should handle validation failures', () => {
        const transactions: Transaction[] = [];

        const categories = {};

        const userTaxData: UserTaxData = {
            name: '', // Missing required field
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '', // Missing required field
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Software Developer',
            profitDeterminationMethod: 'Einnahmen-Überschuss-Rechnung',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const result = populateAllElsterFields(transactions, categories, userTaxData, false);

        expect(result.validation.isValid).toBe(false);
        expect(result.validation.missingFields).toContain('Name');
        expect(result.validation.missingFields).toContain('Steuernummer');
    });
});

describe('Error Handling and Edge Cases', () => {
    describe('calculateEuer edge cases', () => {
        it('should handle empty transaction array', () => {
            const result = calculateEuer([], {}, false);

            expect(result.totalIncome).toBe(0);
            expect(result.totalExpenses).toBe(0);
            expect(result.profit).toBe(0);
            expect(result.vatOwed).toBe(0);
            expect(result.vatPaid).toBe(0);
            expect(result.vatBalance).toBe(0);
        });

        it('should handle transactions with invalid categories', () => {
            const transactions: Transaction[] = [
                {
                    id: 1,
                    dateField: '2024-01-01',
                    counterpartyField: 'Test',
                    purposeField: 'Test',
                    BetragNumeric: 100,
                    euerCategory: 'invalid_category'
                }
            ];

            const categories = { 1: 'invalid_category' };

            const result = calculateEuer(transactions, categories, false);

            // Should skip invalid categories
            expect(result.totalIncome).toBe(0);
            expect(result.totalExpenses).toBe(0);
        });

        it('should handle transactions with zero amounts', () => {
            const transactions: Transaction[] = [
                {
                    id: 1,
                    dateField: '2024-01-01',
                    counterpartyField: 'Test',
                    purposeField: 'Test',
                    BetragNumeric: 0,
                    euerCategory: 'income_sales'
                }
            ];

            const categories = { 1: 'income_sales' };

            const result = calculateEuer(transactions, categories, false);

            expect(result.totalIncome).toBe(0);
            expect(result.totalExpenses).toBe(0);
        });

        it('should handle very large amounts', () => {
            const transactions: Transaction[] = [
                {
                    id: 1,
                    dateField: '2024-01-01',
                    counterpartyField: 'Test',
                    purposeField: 'Test',
                    BetragNumeric: 1000000, // 1 million
                    euerCategory: 'income_sales'
                }
            ];

            const categories = { 1: 'income_sales' };

            const result = calculateEuer(transactions, categories, false);

            expect(result.totalIncome).toBe(1000000);
            expect(result.vatOwed).toBe(190000); // 19% of 1M net
        });

        it('should handle negative amounts correctly', () => {
            const transactions: Transaction[] = [
                {
                    id: 1,
                    dateField: '2024-01-01',
                    counterpartyField: 'Test',
                    purposeField: 'Test',
                    BetragNumeric: -100,
                    euerCategory: 'income_sales'
                }
            ];

            const categories = { 1: 'income_sales' };

            const result = calculateEuer(transactions, categories, false);

            // Negative income should be treated as positive income
            expect(result.totalIncome).toBe(100);
        });
    });

    describe('populatePersonalDataFields edge cases', () => {
        it('should handle missing optional fields', () => {
            const userTaxData: UserTaxData = {
                name: 'Test',
                street: 'Test Street',
                houseNumber: '123',
                postalCode: '12345',
                city: 'Test City',
                taxNumber: '12/345/678',
                fiscalYearStart: '2024',
                fiscalYearEnd: '2024',
                profession: 'Tester',
                profitDeterminationMethod: 'EÜR',
                isKleinunternehmer: false,
                isVatLiable: true,
                isBookkeepingRequired: false,
                isBalanceSheetRequired: false
                // firstName and vatId are optional and missing
            };

            const result = populatePersonalDataFields(userTaxData);

            expect(result.length).toBe(14); // Should not include optional fields that are missing
            expect(result.find(f => f.field === '2')).toBeUndefined(); // First name field should not be present
            expect(result.find(f => f.field === '8')).toBeUndefined(); // VAT ID field should not be present
        });

        it('should handle empty strings in required fields', () => {
            const userTaxData: UserTaxData = {
                name: '',
                street: '',
                houseNumber: '',
                postalCode: '',
                city: '',
                taxNumber: '',
                fiscalYearStart: '',
                fiscalYearEnd: '',
                profession: '',
                profitDeterminationMethod: '',
                isKleinunternehmer: false,
                isVatLiable: true,
                isBookkeepingRequired: false,
                isBalanceSheetRequired: false
            };

            const result = populatePersonalDataFields(userTaxData);

            expect(result.length).toBe(16); // All fields should be present even if empty
            expect(result.find(f => f.field === '1')?.value).toBe('');
        });
    });

    describe('validateMandatoryFields edge cases', () => {
        it('should handle empty field values array', () => {
            const result = validateMandatoryFields([]);

            expect(result.isValid).toBe(false);
            expect(result.missingFields.length).toBeGreaterThan(0);
        });

        it('should handle fields with null/undefined values', () => {
            const fieldValues: ElsterFieldValue[] = [
                { field: '1', value: '', required: true, type: 'personal', label: 'Name', source: 'user_data' },
                { field: '7', value: '', required: true, type: 'personal', label: 'Steuernummer', source: 'user_data' }
            ];

            const result = validateMandatoryFields(fieldValues);

            expect(result.isValid).toBe(false);
            expect(result.missingFields).toContain('Name');
            expect(result.missingFields).toContain('Steuernummer');
        });

        it('should handle non-required fields correctly', () => {
            const fieldValues: ElsterFieldValue[] = [
                { field: '1', value: 'Test', required: true, type: 'personal', label: 'Name', source: 'user_data' },
                { field: '2', value: '', required: false, type: 'personal', label: 'Vorname', source: 'user_data' },
                { field: '7', value: '12/345/678', required: true, type: 'personal', label: 'Steuernummer', source: 'user_data' }
            ];

            const result = validateMandatoryFields(fieldValues);

            expect(result.isValid).toBe(true); // Required fields are present, optional can be empty
            expect(result.missingFields).not.toContain('Vorname');
        });
    });

    describe('populateAllElsterFields edge cases', () => {
        it('should handle empty transactions array', () => {
            const userTaxData: UserTaxData = {
                name: 'Test',
                street: 'Test Street',
                houseNumber: '123',
                postalCode: '12345',
                city: 'Test City',
                taxNumber: '12/345/678',
                fiscalYearStart: '2024',
                fiscalYearEnd: '2024',
                profession: 'Tester',
                profitDeterminationMethod: 'EÜR',
                isKleinunternehmer: false,
                isVatLiable: true,
                isBookkeepingRequired: false,
                isBalanceSheetRequired: false
            };

            const result = populateAllElsterFields([], {}, userTaxData, false);

            expect(result.fieldValues.length).toBeGreaterThan(16); // Should still have personal + VAT + total fields
            expect(result.validation.isValid).toBe(true);
        });

        it('should handle invalid category mappings', () => {
            const transactions: Transaction[] = [
                {
                    id: 1,
                    dateField: '2024-01-01',
                    counterpartyField: 'Test',
                    purposeField: 'Test',
                    BetragNumeric: 100,
                    euerCategory: 'nonexistent_category'
                }
            ];

            const categories = { 1: 'nonexistent_category' };

            const userTaxData: UserTaxData = {
                name: 'Test',
                street: 'Test Street',
                houseNumber: '123',
                postalCode: '12345',
                city: 'Test City',
                taxNumber: '12/345/678',
                fiscalYearStart: '2024',
                fiscalYearEnd: '2024',
                profession: 'Tester',
                profitDeterminationMethod: 'EÜR',
                isKleinunternehmer: false,
                isVatLiable: true,
                isBookkeepingRequired: false,
                isBalanceSheetRequired: false
            };

            const result = populateAllElsterFields(transactions, categories, userTaxData, false);

            expect(result.fieldValues.length).toBeGreaterThan(16); // Personal fields should still be present
            // Transaction fields might not be populated due to invalid category
        });
    });
});