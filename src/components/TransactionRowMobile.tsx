import React from "react";
import type { Transaction } from "../types";
import { formatAmount, formatDate } from "../utils/formatters";
import { CategorySelect } from "./CategorySelect";
import { FREQUENT_INCOME_CATEGORIES, FREQUENT_EXPENSE_CATEGORIES } from "../utils/categoryMappings";

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

    const formattedDate = formatDate(transaction.dateField);
    const formattedAmount = formatAmount(transaction.BetragNumeric);
    const amountColorClass = isIncome ? "text-income" : isPrivate ? "text-private" : "text-expense";

    const categoryOptions = isIncome ? incomeCategories : expenseCategories;
    const frequentCategories = isIncome ? FREQUENT_INCOME_CATEGORIES : FREQUENT_EXPENSE_CATEGORIES;

    return (
      <li className={`animate-fade-in px-2 py-4 ${isPrivate ? "bg-private/5" : ""}`}>
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 font-mono text-muted-foreground text-sm">{formattedDate}</div>
            <div className="truncate text-foreground" title={transaction.counterpartyField}>
              {transaction.counterpartyField}
            </div>
          </div>
          <div className={`font-mono text-lg ${amountColorClass}`}>{formattedAmount} €</div>
        </div>

        <div
          className="mb-3 line-clamp-2 text-muted-foreground text-sm"
          title={transaction.purposeField}
        >
          {transaction.purposeField}
        </div>

        <div className="space-y-2">
          <label className="text-foreground text-sm" htmlFor={`category-${transaction.id}`}>
            {currentSkr}-Konto:
          </label>
          <CategorySelect
            value={categoryKey || undefined}
            onChange={(value) => onCategoryChange(transaction.id, value)}
            categories={categoryOptions}
            frequentCategories={frequentCategories}
            placeholder="Konto wählen..."
          />
        </div>
      </li>
    );
  },
);

TransactionRowMobile.displayName = "TransactionRowMobile";

export default TransactionRowMobile;
