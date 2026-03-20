import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { Transaction } from "../../../types";
import { PAGINATION } from "../../../utils/constants";
import { formatAmount, formatDate } from "../../../utils/formatters";
import { CategorySelect } from "../../CategorySelect";
import {
  FREQUENT_EXPENSE_CATEGORIES,
  FREQUENT_INCOME_CATEGORIES,
} from "../../../utils/categoryMappings";

type CategoryData = {
  code: string;
  name: string;
  type: string;
  vat: number;
  elsterField?: string;
};

type CategoryArray = Array<[string, CategoryData]>;

interface UseTransactionTableProps {
  transactions: Transaction[];
  categories: Record<number, string>;
  skrCategories: Record<string, CategoryData>;
  incomeCategories: CategoryArray;
  expenseCategories: CategoryArray;
  currentSkr: "SKR03" | "SKR04" | "SKR49";
  onCategoryChange: (transactionId: number, categoryKey: string) => void;
}

const columnHelper = createColumnHelper<Transaction>();

export function useTransactionTable({
  transactions,
  categories,
  skrCategories,
  incomeCategories,
  expenseCategories,
  onCategoryChange,
}: UseTransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGINATION.TRANSACTIONS_PER_PAGE,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    counterpartyField: true,
    purposeField: true,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("dateField", {
        header: "Datum",
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-mono text-sm">
            {formatDate(row.original.dateField)}
          </span>
        ),
      }),
      columnHelper.accessor("counterpartyField", {
        header: "Gegenpartei",
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate text-sm" title={row.original.counterpartyField}>
            {row.original.counterpartyField}
          </div>
        ),
      }),
      columnHelper.accessor("BetragNumeric", {
        header: "Betrag",
        cell: ({ row }) => {
          const isIncome = row.original.BetragNumeric > 0;
          const categoryKey = categories[row.original.id] || row.original.euerCategory || "";
          const category = skrCategories[categoryKey];
          const isPrivate = category?.type === "private";
          const amountColorClass = isIncome
            ? "text-income"
            : isPrivate
              ? "text-private"
              : "text-expense";

          return (
            <span className={`whitespace-nowrap font-mono text-sm ${amountColorClass}`}>
              {formatAmount(row.original.BetragNumeric)} €
            </span>
          );
        },
      }),
      columnHelper.accessor("purposeField", {
        header: "Verwendungszweck",
        cell: ({ row }) => (
          <div
            className="max-w-[200px] truncate text-muted-foreground text-sm"
            title={row.original.purposeField}
          >
            {row.original.purposeField}
          </div>
        ),
      }),
      columnHelper.display({
        id: "category",
        header: "SKR-Konto",
        cell: ({ row }) => {
          const categoryKey = categories[row.original.id] || row.original.euerCategory || "";
          const isIncome = row.original.BetragNumeric > 0;
          const categoryOptions = isIncome ? incomeCategories : expenseCategories;
          const frequentCategories = isIncome
            ? FREQUENT_INCOME_CATEGORIES
            : FREQUENT_EXPENSE_CATEGORIES;

          return (
            <CategorySelect
              value={categoryKey || undefined}
              onChange={(value) => onCategoryChange(row.original.id, value)}
              categories={categoryOptions}
              frequentCategories={frequentCategories}
              placeholder="Konto wählen..."
            />
          );
        },
      }),
    ],
    [categories, skrCategories, incomeCategories, expenseCategories, onCategoryChange],
  );

  const table = useReactTable({
    columns,
    data: transactions,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
  });

  const totalRowCount = table.getFilteredRowModel().rows.length;

  const rowDisplayInfo = {
    firstRow: pagination.pageIndex * pagination.pageSize + 1,
    lastRow: Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRowCount),
    totalRows: transactions.length,
  };

  return {
    table,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    columnVisibility,
    setColumnVisibility,
    rowDisplayInfo,
    totalRowCount,
  };
}

export { flexRender };
