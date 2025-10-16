import React from "react";
import type { Transaction } from "../types";
import { formatAmount, formatDate } from "../utils/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TransactionRowProps {
  transaction: Transaction;
  categoryKey: string;
  skrCategories: Record<
    string,
    {
      code: string;
      name: string;
      type: string;
      vat: number;
      elsterField?: string;
    }
  >;
  incomeCategories: Array<
    [
      string,
      {
        code: string;
        name: string;
        type: string;
        vat: number;
        elsterField?: string;
      },
    ]
  >;
  expenseCategories: Array<
    [
      string,
      {
        code: string;
        name: string;
        type: string;
        vat: number;
        elsterField?: string;
      },
    ]
  >;
  currentSkr: "SKR03" | "SKR04" | "SKR49";
  onCategoryChange: (transactionId: number, categoryKey: string) => void;
}

const TransactionRow = React.memo<TransactionRowProps>(
  ({
    transaction,
    categoryKey,
    skrCategories,
    incomeCategories,
    expenseCategories,
    currentSkr,
    onCategoryChange,
  }) => {
    const category = skrCategories[categoryKey];
    const isPrivate = category?.type === "private";
    const isIncome = transaction.BetragNumeric > 0;

    // Pre-calculate formatted values for performance
    const formattedDate = formatDate(transaction.dateField);
    const formattedAmount = formatAmount(transaction.BetragNumeric);
    const amountColorClass = isIncome
      ? "text-income"
      : isPrivate
        ? "text-private"
        : "text-expense";

    // Pre-calculate category options based on transaction type
    const categoryOptions = isIncome ? incomeCategories : expenseCategories;

    return (
      <tr
        className={`border-border border-b ${isPrivate ? "bg-private/5" : ""}`}
      >
        <td className="whitespace-nowrap p-3 text-left text-center font-mono text-foreground text-sm">
          {formattedDate}
        </td>
        <td
          className="max-w-0 truncate p-3 text-left text-foreground"
          title={transaction.counterpartyField}
        >
          <div className="truncate text-sm">
            {transaction.counterpartyField}
          </div>
        </td>
        <td
          className={`whitespace-nowrap p-3 text-right font-mono text-sm ${amountColorClass}`}
        >
          {formattedAmount} €
        </td>
        <td
          className="max-w-0 truncate p-3 text-left text-muted-foreground"
          title={transaction.purposeField}
        >
          <div className="truncate text-sm">{transaction.purposeField}</div>
        </td>
        <td className="p-3 text-left">
          <Select
            aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
            onValueChange={(value) => onCategoryChange(transaction.id, value)}
            value={categoryKey || undefined}
          >
            <SelectTrigger
              className={`focus-ring w-full min-w-0 cursor-pointer text-sm hover:cursor-pointer data-[state=open]:ring-2 data-[state=open]:ring-ring ${isPrivate ? "border-private/30 bg-private/5" : ""}`}
            >
              <SelectValue placeholder="Konto wählen..." />
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
  }
);

TransactionRow.displayName = "TransactionRow";

export default TransactionRow;
