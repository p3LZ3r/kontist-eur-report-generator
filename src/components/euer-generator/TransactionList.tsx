import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DataTable } from "../ui/data-table";
import { useTransactionTable } from "./hooks/useTransactionTable";
import type { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
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
  onCategoryChange: (transactionId: number, categoryKey: string) => void;
  onResetAndUploadNew: () => void;
  onNavigateToElster: () => void;
}

export function TransactionList({
  transactions,
  categories,
  skrCategories,
  incomeCategories,
  expenseCategories,
  currentSkr,
  isKleinunternehmer,
  bankType,
  isDemoMode,
  onCategoryChange,
  onResetAndUploadNew,
  onNavigateToElster,
}: TransactionListProps) {
  const tableState = useTransactionTable({
    transactions,
    categories,
    skrCategories,
    incomeCategories,
    expenseCategories,
    currentSkr,
    onCategoryChange,
  });

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
                {isKleinunternehmer ? "Kleinunternehmer §19 UStG" : "Regelbesteuerung"}
              </span>
            </div>
          </div>

          <Button
            className="focus-ring flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={onResetAndUploadNew}
            size="sm"
            title="Neue CSV-Datei hochladen (aktueller Fortschritt geht verloren)"
            variant="outline"
            type="button"
          >
            <RotateCcw aria-hidden="true" size={16} />
            Neue Datei
          </Button>
        </div>

        <DataTable
          table={tableState.table}
          searchValue={tableState.globalFilter}
          onSearchChange={tableState.setGlobalFilter}
          searchPlaceholder="Transaktionen suchen..."
          skrHeader={`${currentSkr}-Konto`}
        />

        <div className="mt-8 flex justify-center">
          <Button
            className="focus-ring flex items-center gap-2"
            onClick={onNavigateToElster}
            size="sm"
            variant="default"
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="rotate-90" size={16} />
            Zu den Elsterfeldern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
