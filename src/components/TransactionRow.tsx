import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatDate, formatAmount } from '../utils/formatters';
import type { Transaction } from '../types';

interface TransactionRowProps {
    transaction: Transaction;
    categoryKey: string;
    skrCategories: Record<string, { code: string; name: string; type: string; vat: number; elsterField?: string }>;
    incomeCategories: Array<[string, { code: string; name: string; type: string; vat: number; elsterField?: string }]>;
    expenseCategories: Array<[string, { code: string; name: string; type: string; vat: number; elsterField?: string }]>;
    currentSkr: 'SKR03' | 'SKR04' | 'SKR49';
    onCategoryChange: (transactionId: number, categoryKey: string) => void;
}

const TransactionRow = React.memo<TransactionRowProps>(({
    transaction,
    categoryKey,
    skrCategories,
    incomeCategories,
    expenseCategories,
    currentSkr,
    onCategoryChange
}) => {
    const category = skrCategories[categoryKey];
    const isPrivate = category?.type === 'private';
    const isIncome = transaction.BetragNumeric > 0;

    // Pre-calculate formatted values for performance
    const formattedDate = formatDate(transaction.dateField);
    const formattedAmount = formatAmount(transaction.BetragNumeric);
    const amountColorClass = isIncome
        ? 'text-income'
        : isPrivate
            ? 'text-private'
            : 'text-expense';

    // Pre-calculate category options based on transaction type
    const categoryOptions = isIncome ? incomeCategories : expenseCategories;

    return (
        <tr className={`border-b border-border ${isPrivate ? 'bg-private/5' : ''}`}>
            <td className="p-3 text-foreground text-sm whitespace-nowrap text-left font-mono text-center">
                {formattedDate}
            </td>
            <td className="p-3 text-foreground truncate max-w-0 text-left" title={transaction.counterpartyField}>
                <div className="truncate text-sm">{transaction.counterpartyField}</div>
            </td>
            <td className={`p-3 whitespace-nowrap text-right text-sm font-mono ${amountColorClass}`}>
                {formattedAmount} €
            </td>
            <td className="p-3 text-muted-foreground truncate max-w-0 text-left" title={transaction.purposeField}>
                <div className="truncate text-sm">{transaction.purposeField}</div>
            </td>
            <td className="p-3 text-left">
                <Select
                    aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                    value={categoryKey}
                    onValueChange={(value) => onCategoryChange(transaction.id, value)}
                >
                    <SelectTrigger className={`w-full min-w-0 focus-ring data-[state=open]:ring-2 data-[state=open]:ring-ring text-sm cursor-pointer hover:cursor-pointer ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                        {categoryOptions.map(([key, category]) => (
                            <SelectItem key={key} value={key}>
                                {category.code} - {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
        </tr>
    );
});

TransactionRow.displayName = 'TransactionRow';

export default TransactionRow;
