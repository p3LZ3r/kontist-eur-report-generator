import React from 'react';
import { Minus, Percent } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionDetailsProps {
    transactions: Transaction[];
    categoryBreakdown?: { [category: string]: { amount: number; transactions: Transaction[] } };
    isExpanded: boolean;
    onToggle: () => void;
    fieldLabel: string;
    isKleinunternehmer: boolean;
    categories: { [key: number]: string };
    skrCategories: Record<string, { code: string; name: string; type: string; vat: number; elsterField?: string }>;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    transactions,
    categoryBreakdown: _categoryBreakdown,
    isExpanded,
    onToggle: _onToggle,
    fieldLabel: _fieldLabel,
    isKleinunternehmer,
    categories,
    skrCategories
}) => {
    if (!transactions || transactions.length === 0 || !isExpanded) {
        return null;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        } catch {
            return dateString;
        }
    };

    // Berechne Gesamtsummen
    const grossTotal = transactions.reduce((sum, t) => sum + Math.abs(t.BetragNumeric), 0);
    let netTotal = grossTotal;
    let vatTotal = 0;
    let hasVat = false;
    let vatRates: { [rate: number]: number } = {}; // Rate -> Betrag

    // USt-Berechnung nur wenn nicht Kleinunternehmer
    if (!isKleinunternehmer) {
        // Berechne USt pro Transaktion basierend auf der tatsächlichen Kategorie
        netTotal = 0;
        vatTotal = 0;

        transactions.forEach(transaction => {
            const categoryKey = categories[transaction.id] || transaction.euerCategory;
            if (!categoryKey) return;

            const category = skrCategories[categoryKey];
            if (!category) return;

            const grossAmount = Math.abs(transaction.BetragNumeric);

            if (category.vat > 0) {
                hasVat = true;
                const netAmount = grossAmount / (1 + category.vat / 100);
                const vatAmount = grossAmount - netAmount;

                netTotal += netAmount;
                vatTotal += vatAmount;

                // Sammle USt-Sätze für die Anzeige
                if (!vatRates[category.vat]) {
                    vatRates[category.vat] = 0;
                }
                vatRates[category.vat] += vatAmount;
            } else {
                // Steuerfreie Transaktionen
                netTotal += grossAmount;
            }
        });

        // Wenn keine USt vorhanden ist, setze Netto = Brutto
        if (!hasVat) {
            netTotal = grossTotal;
            vatTotal = 0;
        }
    }

    const rows = [];

    // Zusammenfassungszeile mit Gesamtsumme und USt-Info inkl. pro-Satz-Aufschlüsselung
    rows.push(
        <tr key="summary" className="border-b border-gray-200 bg-gray-50">
            <td className="px-2 py-2 text-left w-20">  {/* Feste Breite wie bei Transaktionen */}
                {/* Leer lassen - Transaktionsanzahl ist jetzt neben dem Chevron */}
            </td>
            <td className="px-2 py-2 text-left">
                {/* Leer lassen - Netto/USt-Info ist jetzt neben dem Betrag */}
            </td>
            <td className="px-2 py-2 text-right w-28">  {/* Feste Breite wie bei Transaktionen */}
                <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-mono font-medium text-gray-900">
                        {formatCurrency(grossTotal)}
                    </span>
                    {!isKleinunternehmer && hasVat && vatTotal > 0 && (
                        <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Minus size={10} />
                                <span className="font-mono">{formatCurrency(netTotal)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Percent size={10} />
                                <span className="font-mono">
                                    {formatCurrency(vatTotal)}
                                </span>
                            </div>
                            {/* Pro-Satz-Aufschlüsselung nur wenn mehrere USt-Sätze vorhanden */}
                            {Object.keys(vatRates).length > 1 && (
                                <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 mt-0.5">
                                    {Object.entries(vatRates)
                                        .sort((a, b) => Number(b[0]) - Number(a[0]))
                                        .map(([rate, amount]) => (
                                            <span key={rate} className="font-mono text-[10px]">
                                                {Number(rate).toFixed(0)}%: {formatCurrency(amount)}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );

    // Transaction detail rows
    transactions.forEach((transaction, index) => {
        rows.push(
            <tr
                key={`transaction-${transaction.id}-${index}`}
                className="border-b border-gray-100 hover:bg-muted/10 transition-colors"
            >
                <td className="px-2 py-1 text-center w-20">
                    <div className="text-xs text-muted-foreground font-mono">
                        {formatDate(transaction.dateField)}
                    </div>
                </td>
                <td className="px-2 py-1 text-left">
                    <div className="text-xs text-foreground truncate" title={transaction.counterpartyField}>
                        {transaction.counterpartyField}
                    </div>
                    {transaction.purposeField && (
                        <div className="text-xs text-muted-foreground truncate" title={transaction.purposeField}>
                            {transaction.purposeField}
                        </div>
                    )}
                </td>
                <td className="px-2 py-1 text-right w-28">
                    <span className={`text-xs font-mono ${transaction.BetragNumeric > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                        {formatCurrency(transaction.BetragNumeric)}
                    </span>
                </td>
            </tr>
        );
    });

    return <>{rows}</>;
};

export default TransactionDetails;