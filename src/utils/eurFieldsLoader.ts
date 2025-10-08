// Loader and normalizer for ELSTER EÜR fields defined in eur-fields-2024.json
// This turns the JSON groups into a normalized structure we can use across the app.

// Vite supports importing JSON directly
// The JSON is located at project root: ../../eur-fields-2024.json from this file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON import without types
import eurFields from '../../eur-fields-2024.json';

export type NormalizedElsterField = {
    field: string; // e.g. "17"
    label: string; // German label
    group: string; // JSON section, e.g. "Betriebseinnahmen"
    type: 'personal' | 'income' | 'expense' | 'tax' | 'total' | 'vat' | 'vat_paid' | 'profit_calc';
    required: boolean;
    isNumeric: boolean;
    autoCalculated?: boolean; // ELSTER-calculated totals or system fields
};

const AUTO_CALC_FIELDS = new Set<string>([
    // Umsatzsteuer und verwandte Summen
    '17', '18',
    // Summenfelder aus JSON-Bereichen
    '23', '75', '76', '77', '92', '93', '94', '95', '96', '97', '98'
]);

const EXCLUDED_GROUPS = new Set<string>([
    'Allgemeine Angaben',
    'Mitwirkung'
]);

function inferTypeFromGroup(group: string, nr: string): NormalizedElsterField['type'] {
    if (group === 'Betriebseinnahmen') return 'income';
    if (group === 'Betriebsausgaben') {
        // Vorsteuer (57-58) liegen im Ausgabenblock, sind aber spezielle VAT-Paid Felder
        const n = parseInt(nr, 10);
        if (n === 57 || n === 58) return 'vat_paid';
        return 'expense';
    }
    if (group === 'Gewinnermittlung') {
        const n = parseInt(nr, 10);
        if (n >= 76 && n <= 77) return 'total';
        if (n >= 78 && n <= 98) return 'profit_calc';
        return 'total';
    }
    if (group === 'Rücklagen, stille Reserven und Ausgleichsposten') return 'expense';
    if (group === 'Entnahmen und Einlagen') return 'income';
    return 'personal';
}

export function loadNormalizedElsterFields(): NormalizedElsterField[] {
    const result: NormalizedElsterField[] = [];

    Object.keys(eurFields as Record<string, Array<{ nr: string; name: string }>>).forEach((groupName) => {
        const entries = (eurFields as Record<string, Array<{ nr: string; name: string }>>)[groupName] || [];

        const isExcluded = EXCLUDED_GROUPS.has(groupName);
        const isNumericGroup = !isExcluded;

        for (const entry of entries) {
            const nr = (entry.nr || '').trim();
            const name = (entry.name || '').trim();
            if (!nr || !name) continue;

            const type = inferTypeFromGroup(groupName, nr);
            const isNumeric = isNumericGroup && type !== 'personal';
            const autoCalculated = AUTO_CALC_FIELDS.has(nr) || type === 'vat' || type === 'total';

            result.push({
                field: nr,
                label: name,
                group: groupName,
                type,
                required: false,
                isNumeric,
                autoCalculated
            });
        }
    });

    // Ensure uniqueness by field number, keep first occurrence
    const seen = new Set<string>();
    const deduped: NormalizedElsterField[] = [];
    for (const f of result) {
        if (seen.has(f.field)) continue;
        seen.add(f.field);
        deduped.push(f);
    }

    // Sort by numeric field number for stable ordering
    deduped.sort((a, b) => parseInt(a.field, 10) - parseInt(b.field, 10));

    return deduped;
}


