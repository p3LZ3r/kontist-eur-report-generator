import type { Transaction } from '../types';

// Bank-Format erkennen
export const detectBankFormat = (csvContent: string): string => {
    const lines = csvContent.split('\n');

    if (lines[0] && lines[0].includes('Buchungsdatum') && lines[0].includes('Transaktionstyp')) {
        return 'kontist';
    }

    const holviHeaderLine = lines.findIndex(line => line.includes('Valutadatum'));
    if (holviHeaderLine >= 0) {
        return 'holvi';
    }

    return 'unknown';
};

// Kontist CSV parsen
export const parseKontistCSV = (csvContent: string): Transaction[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';').map(h => h.replace(/"/g, '').trim());

    return lines.slice(1).map((line, index) => {
        const values = line.split(';').map(v => v.replace(/"/g, '').trim());
        const transaction: Record<string, string | number> = {};

        headers.forEach((header, i) => {
            transaction[header] = values[i] || '';
        });

        const betragStr = String(transaction.Betrag || '').replace(',', '.');
        transaction.BetragNumeric = parseFloat(betragStr) || 0;
        transaction.id = index;
        transaction.dateField = String(transaction.Buchungsdatum || '');
        transaction.counterpartyField = String(transaction.Empfänger || '');
        transaction.purposeField = String(transaction.Verwendungszweck || '');

        return transaction as Transaction;
    });
};

// Holvi CSV parsen
export const parseHolviCSV = (csvContent: string): Transaction[] => {
    const lines = csvContent.split('\n');
    const headerLineIndex = lines.findIndex(line => line.includes('Valutadatum'));

    if (headerLineIndex < 0) {
        throw new Error('Holvi CSV-Format nicht erkannt');
    }

    const csvDataFromHeader = lines.slice(headerLineIndex).join('\n');
    const result: Transaction[] = [];
    const dataLines = csvDataFromHeader.split('\n').filter(line => line.trim());
    const headers = dataLines[0].split(',').map(h => h.replace(/"/g, '').trim());

    dataLines.slice(1).forEach((line, index) => {
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim());

        const transaction: Record<string, string | number> = {};
        headers.forEach((header, i) => {
            transaction[header] = values[i] || '';
        });

        const betragStr = String(transaction.Betrag || '').replace(',', '.');
        transaction.BetragNumeric = parseFloat(betragStr) || 0;
        transaction.id = index;
        transaction.dateField = String(transaction.Valutadatum || '');
        transaction.counterpartyField = String(transaction.Gegenpartei || '');
        transaction.purposeField = String(transaction.Bezeichnung || transaction.Nachricht || '');

        result.push(transaction as Transaction);
    });

    return result;
};

// Categorization rules for automatic transaction classification
const CATEGORIZATION_RULES = [
    // Income rules
    { type: 'income', patterns: ['erstattung', 'rückerstattung', 'refund', 'rückvergütung'], category: 'income_refunds' },
    { type: 'income', patterns: ['rg ', 'rechnung', 'invoice'], category: 'income_services_19' },
    { type: 'income', patterns: ['anzahlung', 'prepayment'], category: 'income_prepayments' },
    { type: 'income', patterns: ['waren', 'verkauf'], category: 'income_goods_19' },

    // Private withdrawal rules
    { type: 'private', patterns: ['nike', 'intersport', 'vivobarefoot', 'amazon', 'privat', 'privatentnahme'], category: 'private_withdrawal' },

    // Banking fees
    { type: 'expense', patterns: ['kontist', 'holvi', 'payment services'], category: 'expense_banking', field: 'counterparty' },
    { type: 'expense', patterns: ['bank'], category: 'expense_banking' },

    // Tax rules
    { type: 'private', patterns: ['finanzamt', 'einkommensteuer', 'est', 'vorauszahlung', 'steuernummer'], category: 'private_withdrawal_taxes' },
    { type: 'expense', patterns: ['gewerbesteuer', 'gst'], category: 'expense_taxes_trade' },
    { type: 'expense', patterns: ['steuer'], category: 'expense_taxes_other' },

    // Software & IT
    { type: 'expense', patterns: ['software', 'lizenz', 'adobe', 'microsoft'], category: 'expense_software' },

    // Vehicle costs
    { type: 'expense', patterns: ['tank', 'sprit', 'kfz'], category: 'expense_vehicle_fuel' },
    { type: 'expense', patterns: ['shell', 'esso', 'aral'], category: 'expense_vehicle_fuel', field: 'counterparty' },

    // Communication
    { type: 'expense', patterns: ['telekom', 'vodafone', '1&1'], category: 'expense_phone', field: 'counterparty' },
    { type: 'expense', patterns: ['telefon'], category: 'expense_phone' },
    { type: 'expense', patterns: ['internet'], category: 'expense_internet' },

    // Website & Marketing
    { type: 'expense', patterns: ['website', 'wartung'], category: 'expense_maintenance_website' },
    { type: 'expense', patterns: ['google', 'facebook', 'meta', 'instagram'], category: 'expense_advertising_online', field: 'counterparty' },
    { type: 'expense', patterns: ['werbung', 'marketing'], category: 'expense_advertising_print' },

    // Office supplies
    { type: 'expense', patterns: ['büro', 'office'], category: 'expense_office_supplies', field: 'both', condition: (betrag: number) => betrag < 50 },
    { type: 'expense', patterns: [], category: 'expense_office_equipment', condition: (betrag: number) => betrag >= 50 && betrag <= 800 }
];

// Erweiterte automatische Kategorisierung für SKR04
export const categorizeTransaction = (transaction: Transaction): string => {
    const verwendungszweck = (transaction.purposeField || '').toLowerCase();
    const empfänger = (transaction.counterpartyField || '').toLowerCase();
    const betrag = Math.abs(transaction.BetragNumeric);
    const isIncome = transaction.BetragNumeric > 0;

    // Check income default first
    if (isIncome) {
        return 'income_services_19';
    }

    // Apply categorization rules
    for (const rule of CATEGORIZATION_RULES) {
        if (rule.type === 'income' && !isIncome) continue;
        if (rule.type !== 'income' && isIncome) continue;

        const searchText = rule.field === 'counterparty' ? empfänger :
            rule.field === 'both' ? `${verwendungszweck} ${empfänger}` :
                verwendungszweck;

        const matches = rule.patterns.some(pattern => searchText.includes(pattern));

        if (matches && (!rule.condition || rule.condition(betrag))) {
            return rule.category;
        }
    }

    return 'expense_other';
};