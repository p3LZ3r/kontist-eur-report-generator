import type {
    Transaction,
    ElsterFieldValue,
    NavigationSection,
    FieldGroup,
    ProgressState,
    DrillDownData,
    EuerCalculation
} from '../types';
import {
    populateAllElsterFields,
    populateElsterFieldsFromCalculation
} from './euerCalculations';
import { skr04Categories } from './categoryMappings';

// Create navigation sections - Based on official ELSTER EÜR form structure
export const createNavigationSections = (): NavigationSection[] => {
    return [
        {
            id: 'income',
            title: 'Betriebseinnahmen',
            description: 'Einnahmen und Umsatzsteuer',
            icon: 'trending-up',
            fields: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            completed: false,
            required: true
        },
        {
            id: 'expenses',
            title: 'Betriebsausgaben',
            description: 'Ausgaben und Vorsteuer',
            icon: 'trending-down',
            fields: Array.from(
                { length: 75 - 24 + 1 },
                (_, i) => (24 + i).toString()
            ),
            completed: false,
            required: true
        },
        {
            id: 'profit',
            title: 'Gewinnermittlung',
            description: 'Gewinn/Verlust Berechnung',
            icon: 'calculator',
            fields: Array.from(
                { length: 98 - 76 + 1 },
                (_, i) => (76 + i).toString()
            ),
            completed: false,
            required: true
        }
    ];
};

// Create field groups for display - Matching authentic ELSTER EÜR form structure
export const createFieldGroups = (fieldValues: ElsterFieldValue[]): FieldGroup[] => {
    const income = fieldValues.filter(f => f.type === 'income').sort((a, b) => parseInt(a.field) - parseInt(b.field));
    const expenses = fieldValues.filter(f => f.type === 'expense').sort((a, b) => parseInt(a.field) - parseInt(b.field));
    const vat = fieldValues.filter(f => f.type === 'vat' || f.type === 'vat_paid').sort((a, b) => parseInt(a.field) - parseInt(b.field));
    const totals = fieldValues.filter(f => f.type === 'total' || f.type === 'profit_calc').sort((a, b) => parseInt(a.field) - parseInt(b.field));

    const groups: FieldGroup[] = [];
    if (income.length) {
        groups.push({ id: 'einnahmen', title: 'Betriebseinnahmen', description: '', fields: income, expanded: true, category: 'income' });
    }
    if (expenses.length) {
        groups.push({ id: 'ausgaben', title: 'Betriebsausgaben', description: '', fields: expenses, expanded: true, category: 'expense' });
    }
    if (vat.length) {
        groups.push({ id: 'umsatzsteuer', title: 'Umsatzsteuer', description: '', fields: vat, expanded: true, category: 'tax' });
    }
    if (totals.length) {
        groups.push({ id: 'gewinnermittlung', title: 'Gewinnermittlung', description: '', fields: totals, expanded: true, category: 'total' });
    }

    return groups;
};

// Calculate progress state
export const calculateProgressState = (
    sections: NavigationSection[],
    fieldValues: ElsterFieldValue[]
): ProgressState => {
    const totalSections = sections.length;
    const completedSections = sections.filter(s => s.completed).length;

    const totalFields = fieldValues.length;
    const completedFields = fieldValues.filter(f => f.value !== undefined && f.value !== null && f.value !== '').length;

    const mandatoryFields = fieldValues.filter(f => f.required).length;
    const completedMandatoryFields = fieldValues.filter(f => f.required && f.value !== undefined && f.value !== null && f.value !== '').length;

    return {
        totalSections,
        completedSections,
        totalFields,
        completedFields,
        mandatoryFields,
        completedMandatoryFields
    };
};

// Generate drill-down data for a field
export const generateDrillDownData = (
    field: ElsterFieldValue,
    transactions: Transaction[],
    categories: { [key: number]: string }
): DrillDownData | undefined => {
    if (field.source === 'user_data') {
        return undefined; // No drill-down for user data fields
    }

    const relevantTransactions = transactions.filter(t => {
        const categoryKey = categories[t.id] || t.euerCategory;
        if (!categoryKey) return false;

        // Find if this transaction contributes to the field
        // This is a simplified version - in practice, you'd need to trace back
        // from the ELSTER field to the contributing categories
        return true; // Placeholder - implement proper logic based on your mapping
    });

    const categoryBreakdown: { [category: string]: number } = {};
    const vatBreakdown: { [rate: number]: number } = {};

    relevantTransactions.forEach(transaction => {
        const categoryKey = categories[transaction.id] || transaction.euerCategory;
        if (categoryKey) {
            const category = skr04Categories[categoryKey];
            if (category) {
                categoryBreakdown[category.name] = (categoryBreakdown[category.name] || 0) + Math.abs(transaction.BetragNumeric);
                if (category.vat > 0) {
                    vatBreakdown[category.vat] = (vatBreakdown[category.vat] || 0) + Math.abs(transaction.BetragNumeric);
                }
            }
        }
    });

    return {
        field: field.field,
        transactions: relevantTransactions,
        totalAmount: relevantTransactions.reduce((sum, t) => sum + Math.abs(t.BetragNumeric), 0),
        categoryBreakdown,
        vatBreakdown: Object.keys(vatBreakdown).length > 0 ? vatBreakdown : undefined
    };
};

// Main function to prepare guidance data
export const prepareGuidanceData = (
    transactions: Transaction[],
    categories: { [key: number]: string },
    isKleinunternehmer: boolean,
    euerCalculation?: EuerCalculation
) => {
    // Get populated fields - use provided calculation to avoid duplication
    const { fieldValues } = euerCalculation
        ? populateElsterFieldsFromCalculation(euerCalculation, isKleinunternehmer)
        : populateAllElsterFields(transactions, categories, isKleinunternehmer);

    // Create navigation sections
    const sections = createNavigationSections();

    // Create field groups
    const groups = createFieldGroups(fieldValues);

    // Calculate progress
    const progress = calculateProgressState(sections, fieldValues);

    // Update section completion status
    sections.forEach(section => {
        const sectionFields = fieldValues.filter(f => section.fields.includes(f.field));
        const requiredFields = sectionFields.filter(f => f.required);
        const completedRequiredFields = requiredFields.filter(f =>
            f.value !== undefined && f.value !== null && f.value !== ''
        );

        section.completed = requiredFields.length > 0 && completedRequiredFields.length === requiredFields.length;
    });

    return {
        fieldValues,
        sections,
        groups,
        progress
    };
};

// Get transactions contributing to a specific field
export const getFieldTransactions = (
    field: ElsterFieldValue,
    transactions: Transaction[],
    categories: { [key: number]: string }
): Transaction[] => {
    if (field.source === 'user_data') {
        return [];
    }

    // This is a simplified implementation
    // In practice, you'd need to implement proper field-to-transaction mapping
    // based on your ELSTER mapping logic

    return transactions.filter(t => {
        const categoryKey = categories[t.id] || t.euerCategory;
        if (!categoryKey) return false;

        // Check if this category contributes to the field
        // This would need to be implemented based on your specific mapping
        return true; // Placeholder
    });
};