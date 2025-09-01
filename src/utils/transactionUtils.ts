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
        const transaction: any = {};

        headers.forEach((header, i) => {
            transaction[header] = values[i] || '';
        });

        const betragStr = transaction.Betrag.replace(',', '.');
        transaction.BetragNumeric = parseFloat(betragStr) || 0;
        transaction.id = index;
        transaction.dateField = transaction.Buchungsdatum;
        transaction.counterpartyField = transaction.Empfänger;
        transaction.purposeField = transaction.Verwendungszweck;

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

        const transaction: any = {};
        headers.forEach((header, i) => {
            transaction[header] = values[i] || '';
        });

        const betragStr = transaction.Betrag.replace(',', '.');
        transaction.BetragNumeric = parseFloat(betragStr) || 0;
        transaction.id = index;
        transaction.dateField = transaction.Valutadatum;
        transaction.counterpartyField = transaction.Gegenpartei;
        transaction.purposeField = transaction.Bezeichnung || transaction.Nachricht;

        result.push(transaction as Transaction);
    });

    return result;
};

// Erweiterte automatische Kategorisierung für SKR04
export const categorizeTransaction = (transaction: Transaction): string => {
    const verwendungszweck = (transaction.purposeField || '').toLowerCase();
    const empfänger = (transaction.counterpartyField || '').toLowerCase();
    const betrag = Math.abs(transaction.BetragNumeric);

    if (transaction.BetragNumeric > 0) {
        // Einnahmen kategorisieren
        if (verwendungszweck.includes('erstattung') || verwendungszweck.includes('rückerstattung') ||
            verwendungszweck.includes('refund') || verwendungszweck.includes('rückvergütung')) {
            return 'income_refunds';
        }
        if (verwendungszweck.includes('rg ') || verwendungszweck.includes('rechnung') ||
            verwendungszweck.includes('invoice')) {
            return 'income_services_19';
        }
        if (verwendungszweck.includes('anzahlung') || verwendungszweck.includes('prepayment')) {
            return 'income_prepayments';
        }
        if (verwendungszweck.includes('waren') || verwendungszweck.includes('verkauf')) {
            return 'income_goods_19';
        }
        return 'income_services_19';
    }

    // Ausgaben kategorisieren

    // Privatentnahmen vorschlagen aber zuordbar lassen
    if (empfänger.includes('nike') || empfänger.includes('intersport') ||
        empfänger.includes('vivobarefoot') || empfänger.includes('amazon') ||
        verwendungszweck.includes('privat') || verwendungszweck.includes('privatentnahme')) {
        return 'private_withdrawal';
    }

    // Bankgebühren
    if (empfänger.includes('kontist') || empfänger.includes('holvi') ||
        empfänger.includes('payment services') || verwendungszweck.includes('bank')) {
        return 'expense_banking';
    }

    // Steuern differenzieren
    if (empfänger.includes('finanzamt') || verwendungszweck.includes('steuer')) {
        if (verwendungszweck.includes('einkommensteuer') || verwendungszweck.includes('est') ||
            verwendungszweck.includes('vorauszahlung') || verwendungszweck.includes('steuernummer')) {
            return 'private_withdrawal_taxes'; // Einkommensteuer = Privatentnahme
        }
        if (verwendungszweck.includes('gewerbesteuer') || verwendungszweck.includes('gst')) {
            return 'expense_taxes_trade';
        }
        return 'expense_taxes_other';
    }

    // Software & IT
    if (verwendungszweck.includes('software') || verwendungszweck.includes('lizenz') ||
        verwendungszweck.includes('adobe') || verwendungszweck.includes('microsoft')) {
        return 'expense_software';
    }

    // Fahrzeugkosten
    if (verwendungszweck.includes('tank') || verwendungszweck.includes('sprit') ||
        verwendungszweck.includes('kfz') || empfänger.includes('shell') ||
        empfänger.includes('esso') || empfänger.includes('aral')) {
        return 'expense_vehicle_fuel';
    }

    // Telefon/Internet
    if (empfänger.includes('telekom') || empfänger.includes('vodafone') ||
        empfänger.includes('1&1') || verwendungszweck.includes('telefon')) {
        return 'expense_phone';
    }
    if (verwendungszweck.includes('internet')) {
        return 'expense_internet';
    }

    // Website-Wartung
    if (verwendungszweck.includes('website') || verwendungszweck.includes('wartung')) {
        return 'expense_maintenance_website';
    }

    // Online-Marketing
    if (empfänger.includes('google') || empfänger.includes('facebook') ||
        empfänger.includes('meta') || empfänger.includes('instagram')) {
        return 'expense_advertising_online';
    }

    // Werbung allgemein
    if (verwendungszweck.includes('werbung') || verwendungszweck.includes('marketing')) {
        return 'expense_advertising_print';
    }

    // Büromaterial (kleine Beträge)
    if (betrag < 50 && (verwendungszweck.includes('büro') || empfänger.includes('office'))) {
        return 'expense_office_supplies';
    }

    // Geringwertige Wirtschaftsgüter
    if (betrag >= 50 && betrag <= 800) {
        return 'expense_office_equipment';
    }

    return 'expense_other';
};