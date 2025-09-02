import type {
    Transaction,
    ElsterFieldValue,
    NavigationSection,
    FieldGroup,
    ProgressState,
    DrillDownData
} from '../types';
import {
    populateAllElsterFields
} from './euerCalculations';
import { ELSTER_FIELD_RANGES } from './constants';
import { skr04Categories } from './categoryMappings';

// Create navigation sections
export const createNavigationSections = (): NavigationSection[] => {
    return [
        {
            id: 'personal',
            title: 'Persönliche Daten',
            description: 'Ihre persönlichen Angaben für die Steuererklärung',
            icon: 'user',
            fields: Array.from(
                { length: ELSTER_FIELD_RANGES.PERSONAL_DATA_END - ELSTER_FIELD_RANGES.PERSONAL_DATA_START + 1 },
                (_, i) => (ELSTER_FIELD_RANGES.PERSONAL_DATA_START + i).toString()
            ),
            completed: false,
            required: true
        },
        {
            id: 'income',
            title: 'Einnahmen',
            description: 'Betriebliche Einnahmen und Erlöse',
            icon: 'trending-up',
            fields: Array.from(
                { length: ELSTER_FIELD_RANGES.INCOME_END - ELSTER_FIELD_RANGES.INCOME_START + 1 },
                (_, i) => (ELSTER_FIELD_RANGES.INCOME_START + i).toString()
            ),
            completed: false,
            required: true
        },
        {
            id: 'expenses',
            title: 'Ausgaben',
            description: 'Betriebsausgaben und Aufwendungen',
            icon: 'trending-down',
            fields: Array.from(
                { length: ELSTER_FIELD_RANGES.EXPENSE_END - ELSTER_FIELD_RANGES.EXPENSE_START + 1 },
                (_, i) => (ELSTER_FIELD_RANGES.EXPENSE_START + i).toString()
            ),
            completed: false,
            required: true
        },
        {
            id: 'totals',
            title: 'Zusammenfassung',
            description: 'Gesamtbeträge und steuerpflichtiger Gewinn',
            icon: 'calculator',
            fields: ['52', '54'], // Main total fields
            completed: false,
            required: true
        }
    ];
};

// Create field groups for display
export const createFieldGroups = (fieldValues: ElsterFieldValue[]): FieldGroup[] => {
    const groups: FieldGroup[] = [
        {
            id: 'personal',
            title: 'Persönliche Daten',
            description: 'Ihre persönlichen Angaben für die Steuererklärung',
            fields: fieldValues.filter(f => f.type === 'personal'),
            expanded: true,
            category: 'personal'
        },
        {
            id: 'income',
            title: 'Einnahmen',
            description: 'Betriebliche Einnahmen und Erlöse',
            fields: fieldValues.filter(f => f.type === 'income'),
            expanded: false,
            category: 'income'
        },
        {
            id: 'expenses',
            title: 'Ausgaben',
            description: 'Betriebsausgaben und Aufwendungen',
            fields: fieldValues.filter(f => f.type === 'expense'),
            expanded: false,
            category: 'expense'
        },
        {
            id: 'tax',
            title: 'Steuerliche Angaben',
            description: 'Umsatzsteuer und steuerliche Berechnungen',
            fields: fieldValues.filter(f => f.type === 'tax'),
            expanded: false,
            category: 'tax'
        },
        {
            id: 'totals',
            title: 'Gesamtbeträge',
            description: 'Zusammenfassung und steuerpflichtiger Gewinn',
            fields: fieldValues.filter(f => f.type === 'total'),
            expanded: false,
            category: 'total'
        }
    ];

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
    isKleinunternehmer: boolean
) => {
    // Get populated fields
    const { fieldValues } = populateAllElsterFields(
        transactions,
        categories,
        isKleinunternehmer
    );

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