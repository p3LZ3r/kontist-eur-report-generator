import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { flexRender, type Table } from "@tanstack/react-table";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface DataTableProps<TData> {
  table: Table<TData>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
  skrHeader?: string;
}

interface SortIndicatorProps {
  isSorted: false | "asc" | "desc";
}

function SortIndicator({ isSorted }: SortIndicatorProps) {
  if (isSorted === "asc") {
    return <ArrowUp className="ml-1 h-4 w-4" aria-hidden="true" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown className="ml-1 h-4 w-4" aria-hidden="true" />;
  }
  return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" aria-hidden="true" />;
}

export function DataTable<TData>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Suchen...",
  className,
  skrHeader,
}: DataTableProps<TData>) {
  const paginationState = table.getState().pagination;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className={cn("space-y-4", className)}>
      {onSearchChange && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const headerText = header.column.columnDef.header as string;

                  const headerDisplayText =
                    header.id === "category" && skrHeader ? skrHeader : headerText;

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "p-3 text-left font-normal text-muted-foreground whitespace-nowrap",
                        canSort && "cursor-pointer select-none hover:bg-muted/80",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e as unknown as MouseEvent);
                        }
                      }}
                      tabIndex={canSort ? 0 : undefined}
                      role={canSort ? "button" : undefined}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      <div className="flex items-center gap-1">
                        <span className="truncate" title={headerDisplayText}>
                          {headerDisplayText}
                        </span>
                        {canSort && <SortIndicator isSorted={header.column.getIsSorted()} />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                  {row.getAllCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                    return (
                      <td key={cell.id} className={cn("p-3", meta?.className)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Keine Transaktionen gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">
          Zeige {paginationState.pageIndex * paginationState.pageSize + 1}-
          {Math.min(
            (paginationState.pageIndex + 1) * paginationState.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          von {table.getFilteredRowModel().rows.length}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            className="focus-ring hidden h-8 w-8 p-0 lg:flex"
            disabled={!canPreviousPage}
            onClick={() => table.firstPage()}
            size="sm"
            variant="outline"
            aria-label="Erste Seite"
          >
            <ChevronsLeft aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            className="focus-ring h-8 w-8 p-0"
            disabled={!canPreviousPage}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
            aria-label="Vorherige Seite"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </Button>
          <div className="flex h-8 items-center rounded-md border bg-muted px-3 py-1.5 text-muted-foreground text-sm">
            {paginationState.pageIndex + 1} / {pageCount || 1}
          </div>
          <Button
            type="button"
            className="focus-ring h-8 w-8 p-0"
            disabled={!canNextPage}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
            aria-label="Nächste Seite"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            className="focus-ring hidden h-8 w-8 p-0 lg:flex"
            disabled={!canNextPage}
            onClick={() => table.lastPage()}
            size="sm"
            variant="outline"
            aria-label="Letzte Seite"
          >
            <ChevronsRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>

        <select
          value={paginationState.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-8 rounded-md border bg-background px-2 text-sm"
          aria-label="Einträge pro Seite"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} pro Seite
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
