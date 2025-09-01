import { describe, it, expect, vi } from 'vitest';
import {
    generateElsterCSV,
    generateElsterJSON,
    validateElsterData,
    downloadElsterCSV,
    downloadElsterJSON
} from '../utils/exportUtils';
import { populateAllElsterFields } from '../utils/euerCalculations';
import type { Transaction, UserTaxData } from '../types';

// Mock dependencies
vi.mock('../utils/euerCalculations', () => ({
    populateAllElsterFields: vi.fn()
}));

vi.mock('../utils/categoryMappings', () => ({
    skr04Categories: {
        'income_sales': { name: 'Umsatzerlöse', type: 'income', vat: 19 },
        'expense_office': { name: 'Büromaterial', type: 'expense', vat: 19 }
    },
    elsterMapping: {
        'income_sales': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
        'expense_office': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' }
    }
}));

// Mock URL and document for download functions
Object.defineProperty(window, 'URL', {
    value: {
        createObjectURL: vi.fn(() => 'mock-url'),
        revokeObjectURL: vi.fn()
    },
    writable: true
});

Object.defineProperty(window, 'document', {
    value: {
        createElement: vi.fn(() => ({
            href: '',
            download: '',
            click: vi.fn()
        }))
    },
    writable: true
});

describe('generateElsterCSV', () => {
    const mockTransactions: Transaction[] = [
        {
            id: 1,
            dateField: '2024-01-01',
            counterpartyField: 'Customer A',
            purposeField: 'Sale',
            BetragNumeric: 119.00,
            euerCategory: 'income_sales'
        }
    ];

    const mockCategories = { 1: 'income_sales' };

    const mockUserTaxData: UserTaxData = {
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
        profession: 'Developer',
        profitDeterminationMethod: 'EÜR',
        isKleinunternehmer: false,
        isVatLiable: true,
        isBookkeepingRequired: false,
        isBalanceSheetRequired: false
    };

    it('should generate valid CSV content', () => {
        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            },
            {
                field: '17',
                value: 100,
                label: 'Umsatzerlöse (steuerpflichtig)',
                type: 'income' as const,
                required: true,
                source: 'transaction' as const
            }
        ];

        // Mock the populateAllElsterFields function
        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        const result = generateElsterCSV(mockTransactions, mockCategories, mockUserTaxData, false);

        expect(typeof result).toBe('string');
        expect(result).toContain('Feldnummer');
        expect(result).toContain('Bezeichnung');
        expect(result).toContain('Wert');
        expect(result).toContain('Mustermann');
        expect(result).toContain('100');
    });

    it('should throw error when validation fails', () => {
        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: [],
            validation: { isValid: false, missingFields: ['Name', 'Steuernummer'] }
        });

        expect(() => {
            generateElsterCSV(mockTransactions, mockCategories, mockUserTaxData, false);
        }).toThrow('ELSTER Export fehlgeschlagen: Fehlende Pflichtfelder: Name, Steuernummer');
    });

    it('should handle decimal values correctly', () => {
        const mockFieldValues = [
            {
                field: '17',
                value: 123.45,
                label: 'Umsatzerlöse',
                type: 'income' as const,
                required: true,
                source: 'transaction' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        const result = generateElsterCSV(mockTransactions, mockCategories, mockUserTaxData, false);

        expect(result).toContain('123,45'); // German decimal format
    });
});

describe('generateElsterJSON', () => {
    const mockTransactions: Transaction[] = [
        {
            id: 1,
            dateField: '2024-01-01',
            counterpartyField: 'Customer A',
            purposeField: 'Sale',
            BetragNumeric: 119.00,
            euerCategory: 'income_sales'
        }
    ];

    const mockCategories = { 1: 'income_sales' };

    const mockUserTaxData: UserTaxData = {
        name: 'Mustermann',
        street: 'Hauptstraße',
        houseNumber: '123',
        postalCode: '12345',
        city: 'Berlin',
        taxNumber: '123/456/789',
        fiscalYearStart: '2024',
        fiscalYearEnd: '2024',
        profession: 'Developer',
        profitDeterminationMethod: 'EÜR',
        isKleinunternehmer: false,
        isVatLiable: true,
        isBookkeepingRequired: false,
        isBalanceSheetRequired: false
    };

    it('should generate valid JSON content', () => {
        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        const result = generateElsterJSON(mockTransactions, mockCategories, mockUserTaxData, false);

        expect(typeof result).toBe('string');

        const parsed = JSON.parse(result);
        expect(parsed).toHaveProperty('metadata');
        expect(parsed).toHaveProperty('personalData');
        expect(parsed).toHaveProperty('incomeData');
        expect(parsed).toHaveProperty('allFields');
        expect(parsed.metadata.isKleinunternehmer).toBe(false);
        expect(parsed.personalData).toHaveLength(1);
    });

    it('should throw error when validation fails', () => {
        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: [],
            validation: { isValid: false, missingFields: ['Name'] }
        });

        expect(() => {
            generateElsterJSON(mockTransactions, mockCategories, mockUserTaxData, false);
        }).toThrow('ELSTER Export fehlgeschlagen: Fehlende Pflichtfelder: Name');
    });

    it('should include validation results in metadata', () => {
        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        const result = generateElsterJSON(mockTransactions, mockCategories, mockUserTaxData, false);
        const parsed = JSON.parse(result);

        expect(parsed.metadata.validation.isValid).toBe(true);
        expect(parsed.metadata.validation.missingFields).toEqual([]);
    });
});

describe('validateElsterData', () => {
    it('should return validation results', () => {
        const mockTransactions: Transaction[] = [];
        const mockCategories = {};
        const mockUserTaxData: UserTaxData = {
            name: 'Mustermann',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Developer',
            profitDeterminationMethod: 'EÜR',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        const result = validateElsterData(mockTransactions, mockCategories, mockUserTaxData, false);

        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('missingFields');
        expect(result).toHaveProperty('fieldValues');
        expect(result.isValid).toBe(true);
        expect(result.missingFields).toEqual([]);
        expect(result.fieldValues).toEqual(mockFieldValues);
    });
});

describe('downloadElsterCSV', () => {
    it('should create download link and trigger download', () => {
        const mockTransactions: Transaction[] = [];
        const mockCategories = {};
        const mockUserTaxData: UserTaxData = {
            name: 'Mustermann',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Developer',
            profitDeterminationMethod: 'EÜR',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        // Mock console.error to avoid test output pollution
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            downloadElsterCSV(mockTransactions, mockCategories, mockUserTaxData, false, 2024);
        }).not.toThrow();

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(window.document.createElement).toHaveBeenCalledWith('a');

        consoleSpy.mockRestore();
    });

    it('should handle validation errors gracefully', () => {
        const mockTransactions: Transaction[] = [];
        const mockCategories = {};
        const mockUserTaxData: UserTaxData = {
            name: '',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Developer',
            profitDeterminationMethod: 'EÜR',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: [],
            validation: { isValid: false, missingFields: ['Name'] }
        });

        // Mock alert
        window.alert = vi.fn();

        expect(() => {
            downloadElsterCSV(mockTransactions, mockCategories, mockUserTaxData, false, 2024);
        }).not.toThrow();

        expect(window.alert).toHaveBeenCalled();
    });
});

describe('downloadElsterJSON', () => {
    it('should create download link and trigger download', () => {
        const mockTransactions: Transaction[] = [];
        const mockCategories = {};
        const mockUserTaxData: UserTaxData = {
            name: 'Mustermann',
            street: 'Hauptstraße',
            houseNumber: '123',
            postalCode: '12345',
            city: 'Berlin',
            taxNumber: '123/456/789',
            fiscalYearStart: '2024',
            fiscalYearEnd: '2024',
            profession: 'Developer',
            profitDeterminationMethod: 'EÜR',
            isKleinunternehmer: false,
            isVatLiable: true,
            isBookkeepingRequired: false,
            isBalanceSheetRequired: false
        };

        const mockFieldValues = [
            {
                field: '1',
                value: 'Mustermann',
                label: 'Name',
                type: 'personal' as const,
                required: true,
                source: 'user_data' as const
            }
        ];

        const mockedPopulateAllElsterFields = vi.mocked(populateAllElsterFields);
        mockedPopulateAllElsterFields.mockReturnValue({
            fieldValues: mockFieldValues,
            validation: { isValid: true, missingFields: [] }
        });

        expect(() => {
            downloadElsterJSON(mockTransactions, mockCategories, mockUserTaxData, false, 2024);
        }).not.toThrow();

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(window.document.createElement).toHaveBeenCalledWith('a');
    });
});