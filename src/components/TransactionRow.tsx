import React from "react";
import type { Transaction } from "../types";
import { formatAmount, formatDate } from "../utils/formatters";
import { CategorySelect } from "./CategorySelect";
import { FREQUENT_INCOME_CATEGORIES, FREQUENT_EXPENSE_CATEGORIES } from "../utils/categoryMappings";

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
    onCategoryChange,
  }) => {
    const category = skrCategories[categoryKey];
    const isPrivate = category?.type === "private";
    const isIncome = transaction.BetragNumeric > 0;

    const formattedDate = formatDate(transaction.dateField);
    const formattedAmount = formatAmount(transaction.BetragNumeric);
    const amountColorClass = isIncome ? "text-income" : isPrivate ? "text-private" : "text-expense";

    const categoryOptions = isIncome ? incomeCategories : expenseCategories;
    const frequentCategories = isIncome ? FREQUENT_INCOME_CATEGORIES : FREQUENT_EXPENSE_CATEGORIES;

    return (
      <tr className={`border-border border-b ${isPrivate ? "bg-private/5" : ""}`}>
        <td className="whitespace-nowrap p-3 text-left text-center font-mono text-foreground text-sm">
          {formattedDate}
        </td>
        <td
          className="max-w-0 truncate p-3 text-left text-foreground"
          title={transaction.counterpartyField}
        >
          <div className="truncate text-sm">{transaction.counterpartyField}</div>
        </td>
        <td className={`whitespace-nowrap p-3 text-right font-mono text-sm ${amountColorClass}`}>
          {formattedAmount} €
        </td>
        <td
          className="min-w-[200px] truncate p-3 text-left text-muted-foreground"
          title={transaction.purposeField}
        >
          <div className="truncate text-sm">{transaction.purposeField}</div>
        </td>
        <td className="min-w-[320px] p-3 text-left">
          <CategorySelect
            value={categoryKey || undefined}
            onChange={(value) => onCategoryChange(transaction.id, value)}
            categories={categoryOptions}
            frequentCategories={frequentCategories}
            placeholder="Konto wählen..."
          />
        </td>
      </tr>
    );
  },
);

TransactionRow.displayName = "TransactionRow";

export default TransactionRow;
