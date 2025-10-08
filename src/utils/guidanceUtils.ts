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
    const groups: FieldGroup[] = [
        // 4 - EINNAHMEN
        {
            id: 'einnahmen',
            title: 'Betriebseinnahmen',
            description: '',
            fields: fieldValues.filter(f => f.type === 'income').sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'income'
        },

        // 4 - BETRIEBSAUSGABEN
        {
            id: 'betriebsausgaben_1',
            title: 'Betriebsausgaben',
            description: '',
            fields: fieldValues.filter(f => f.field === '27'),
            expanded: true,
            category: 'expense'
        },
        {
            id: 'betriebsausgaben_2',
            title: '',
            description: '',
            fields: fieldValues.filter(f => f.field === '29'),
            expanded: true,
            category: 'expense'
        },
        {
            id: 'betriebsausgaben_3',
            title: '',
            description: '',
            fields: fieldValues.filter(f => f.field === '30'),
            expanded: true,
            category: 'expense'
        },

        // ABSCHREIBUNGEN
        {
            id: 'abschreibungen',
            title: '',
            description: '',
            fields: fieldValues.filter(f => ['31', '32', '33'].includes(f.field)).sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'expense'
        },

        // MIETE UND LEASING
        {
            id: 'miete_leasing',
            title: '',
            description: '',
            fields: fieldValues.filter(f => ['34', '35'].includes(f.field)).sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'expense'
        },

        // WEITERE AUSGABEN
        {
            id: 'weitere_ausgaben_1',
            title: '',
            description: '',
            fields: fieldValues.filter(f => ['36', '37'].includes(f.field)).sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'expense'
        },
        {
            id: 'weitere_ausgaben_2',
            title: '',
            description: '',
            fields: fieldValues.filter(f => f.field === '44'),
            expanded: true,
            category: 'expense'
        },
        {
            id: 'weitere_ausgaben_3',
            title: '',
            description: '',
            fields: fieldValues.filter(f => ['55', '56'].includes(f.field)).sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'expense'
        },

        // SONSTIGE AUSGABEN
        {
            id: 'sonstige_ausgaben',
            title: '',
            description: '',
            fields: fieldValues.filter(f => ['62', '63', '64', '65', '66'].includes(f.field)).sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'expense'
        },

        // GEWINNERMITTLUNG
        {
            id: 'gewinnermittlung',
            title: 'Gewinnermittlung',
            description: '',
            fields: fieldValues.filter(f => f.type === 'profit_calc').sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'total'
        },

        // UMSATZSTEUER
        {
            id: 'umsatzsteuer',
            title: '',
            description: '',
            fields: fieldValues.filter(f => f.type === 'vat' || f.type === 'vat_paid').sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'tax'
        },

        // SUMMEN
        {
            id: 'summen',
            title: '',
            description: '',
            fields: fieldValues.filter(f => f.type === 'total').sort((a, b) => parseInt(a.field) - parseInt(b.field)),
            expanded: true,
            category: 'total'
        }
    ];

    // Remove groups with no fields
    return groups.filter(group => group.fields.length > 0);
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