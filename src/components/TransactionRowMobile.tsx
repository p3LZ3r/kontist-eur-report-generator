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

interface TransactionRowMobileProps {
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

const TransactionRowMobile = React.memo<TransactionRowMobileProps>(
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
      <li
        className={`animate-fade-in px-2 py-4 ${isPrivate ? "bg-private/5" : ""}`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 font-mono text-muted-foreground text-sm">
              {formattedDate}
            </div>
            <div
              className="truncate text-foreground"
              title={transaction.counterpartyField}
            >
              {transaction.counterpartyField}
            </div>
          </div>
          <div className={`font-mono text-lg ${amountColorClass}`}>
            {formattedAmount} €
          </div>
        </div>

        <div
          className="mb-3 line-clamp-2 text-muted-foreground text-sm"
          title={transaction.purposeField}
        >
          {transaction.purposeField}
        </div>

        <div className="space-y-2">
          <label
            className="text-foreground text-sm"
            htmlFor={`category-${transaction.id}`}
          >
            {currentSkr}-Konto:
          </label>
          <Select
            aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
            onValueChange={(value) => onCategoryChange(transaction.id, value)}
            value={categoryKey || undefined}
          >
            <SelectTrigger
              className={`focus-ring w-full cursor-pointer hover:cursor-pointer data-[state=open]:ring-2 data-[state=open]:ring-ring ${isPrivate ? "border-private/30 bg-private/5" : ""}`}
              id={`category-${transaction.id}`}
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
        </div>
      </li>
    );
  }
);

TransactionRowMobile.displayName = "TransactionRowMobile";

export default TransactionRowMobile;
