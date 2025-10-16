import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Transaction } from "../../types";
import TransactionRow from "../TransactionRow";
import TransactionRowMobile from "../TransactionRowMobile";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface TransactionListProps {
  transactions: Transaction[];
  currentTransactions: Transaction[];
  categories: Record<number, string>;
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
  isKleinunternehmer: boolean;
  bankType: string | null;
  isDemoMode: boolean;
  currentPage: number;
  totalPages: number;
  indexOfFirstTransaction: number;
  indexOfLastTransaction: number;
  onCategoryChange: (transactionId: number, categoryKey: string) => void;
  onPageChange: (page: number) => void;
  onResetAndUploadNew: () => void;
  onNavigateToElster: () => void;
}

/**
 * TransactionList displays transaction table/list view with pagination controls.
 *
 * @param props - Transaction list configuration and handlers
 */
export function TransactionList({
  transactions,
  currentTransactions,
  categories,
  skrCategories,
  incomeCategories,
  expenseCategories,
  currentSkr,
  isKleinunternehmer,
  bankType,
  isDemoMode,
  currentPage,
  totalPages,
  indexOfFirstTransaction,
  indexOfLastTransaction,
  onCategoryChange,
  onPageChange,
  onResetAndUploadNew,
  onNavigateToElster,
}: TransactionListProps) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="flex items-center gap-2 text-2xl text-foreground">
            Transaktionen kategorisieren
          </h2>

          <div className="flex flex-1 flex-wrap justify-center gap-2">
            <div className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-green-800">
              <span className="font-medium text-xs">
                {bankType === "kontist" ? "Kontist" : "Holvi"} CSV erkannt
              </span>
            </div>
            {isDemoMode && (
              <div className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-orange-800">
                <span className="font-medium text-xs">Demo-Modus</span>
              </div>
            )}
            <div className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-blue-800">
              <span className="font-medium text-xs">{currentSkr}</span>
            </div>
            <div className="rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-purple-800">
              <span className="font-medium text-xs">
                {isKleinunternehmer
                  ? "Kleinunternehmer §19 UStG"
                  : "Regelbesteuerung"}
              </span>
            </div>
          </div>

          <Button
            className="focus-ring flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={onResetAndUploadNew}
            size="sm"
            title="Neue CSV-Datei hochladen (aktueller Fortschritt geht verloren)"
            variant="outline"
          >
            <RotateCcw aria-hidden="true" size={16} />
            Neue Datei
          </Button>
        </div>

        {/* Pagination Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            Zeige {indexOfFirstTransaction + 1}-
            {Math.min(indexOfLastTransaction, transactions.length)} von{" "}
            {transactions.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="focus-ring flex items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              size="sm"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" size={16} />
              Zurück
            </Button>
            <div className="flex h-8 items-center rounded-md border bg-muted px-3 py-1.5 text-muted-foreground text-sm">
              {currentPage} / {totalPages}
            </div>
            <Button
              className="focus-ring flex items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              size="sm"
              variant="outline"
            >
              Weiter
              <ChevronRight aria-hidden="true" size={16} />
            </Button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-border border-b bg-muted/50">
                <th className="w-24 p-3 text-left font-normal text-muted-foreground">
                  Datum
                </th>
                <th className="w-1/5 min-w-32 p-3 text-left font-normal text-muted-foreground">
                  Gegenpartei
                </th>
                <th className="w-20 p-3 text-right font-normal text-muted-foreground">
                  Betrag
                </th>
                <th className="w-1/4 min-w-40 p-3 text-left font-normal text-muted-foreground">
                  Verwendungszweck
                </th>
                <th className="w-1/3 min-w-48 p-3 text-left font-normal text-muted-foreground">
                  {currentSkr}-Konto
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => {
                const categoryKey =
                  categories[transaction.id] || transaction.euerCategory || "";

                return (
                  <TransactionRow
                    categoryKey={categoryKey}
                    currentSkr={currentSkr}
                    expenseCategories={expenseCategories}
                    incomeCategories={incomeCategories}
                    key={transaction.id}
                    onCategoryChange={onCategoryChange}
                    skrCategories={skrCategories}
                    transaction={transaction}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="sm:hidden">
          <ul className="divide-y divide-border">
            {currentTransactions.map((transaction) => {
              const categoryKey =
                categories[transaction.id] || transaction.euerCategory || "";

              return (
                <TransactionRowMobile
                  categoryKey={categoryKey}
                  currentSkr={currentSkr}
                  expenseCategories={expenseCategories}
                  incomeCategories={incomeCategories}
                  key={transaction.id}
                  onCategoryChange={onCategoryChange}
                  skrCategories={skrCategories}
                  transaction={transaction}
                />
              );
            })}
          </ul>
        </div>

        {/* Pagination Controls unten */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center text-muted-foreground text-sm sm:text-left">
            Zeige {indexOfFirstTransaction + 1}-
            {Math.min(indexOfLastTransaction, transactions.length)} von{" "}
            {transactions.length}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              className="focus-ring flex items-center gap-1"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              size="sm"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" size={16} />
              Zurück
            </Button>
            <div className="flex h-8 items-center rounded-md border bg-muted px-3 py-1.5 text-muted-foreground text-sm">
              {currentPage} / {totalPages}
            </div>
            <Button
              className="focus-ring flex items-center gap-1"
              disabled={currentPage === totalPages}
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              size="sm"
              variant="outline"
            >
              Weiter
              <ChevronRight aria-hidden="true" size={16} />
            </Button>
          </div>
          <Button
            className="focus-ring flex items-center gap-2"
            onClick={onNavigateToElster}
            size="sm"
            variant="default"
          >
            <ChevronLeft aria-hidden="true" className="rotate-90" size={16} />
            Zu den Elsterfeldern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
