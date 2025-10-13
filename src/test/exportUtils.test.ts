import { describe, it, expect, vi } from 'vitest';
import {
    validateElsterData
} from '../utils/exportUtils';
import { populateAllElsterFields } from '../utils/euerCalculations';
import type { Transaction } from '../types';

// Mock dependencies
vi.mock('../utils/euerCalculations', () => ({
    populateAllElsterFields: vi.fn()
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock DOM methods
Object.defineProperty(document, 'createElement', {
    value: vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn()
    })),
    writable: true
});

describe('validateElsterData', () => {
    it('should return validation results', () => {
        const mockTransactions: Transaction[] = [];
        const mockCategories = {};

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

        const result = validateElsterData(mockTransactions, mockCategories, false);

        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('missingFields');
        expect(result).toHaveProperty('fieldValues');
        expect(result.isValid).toBe(true);
        expect(result.missingFields).toEqual([]);
        expect(result.fieldValues).toEqual(mockFieldValues);
    });
});