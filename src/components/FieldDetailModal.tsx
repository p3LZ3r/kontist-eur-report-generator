import {
  AlertCircle,
  Calculator,
  FileText,
  Info,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import type { DrillDownData, ElsterFieldValue, Transaction } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface FieldDetailModalProps {
  field?: ElsterFieldValue;
  drillDownData?: DrillDownData;
  transactions?: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
  field,
  drillDownData,
  transactions = [],
  isOpen,
  onClose,
}) => {
  if (!(isOpen && field)) return null;

  const formatValue = (value: number | string) => {
    if (typeof value === "number") {
      return `${value.toFixed(2)} €`;
    }
    return value;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "user_data":
        return <FileText className="text-green-600" size={16} />;
      case "calculated":
        return <Calculator className="text-blue-600" size={16} />;
      case "transaction":
        return <TrendingUp className="text-purple-600" size={16} />;
      default:
        return <Info className="text-gray-600" size={16} />;
    }
  };

  const getSourceDescription = (source: string) => {
    switch (source) {
      case "user_data":
        return "Aus Ihren persönlichen Daten automatisch ausgefüllt";
      case "calculated":
        return "Automatisch aus Ihren Transaktionen berechnet";
      case "transaction":
        return "Basierend auf kategorisierten Transaktionen";
      default:
        return "Manueller Eintrag erforderlich";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6">
        <div className="flex items-center justify-between border-b">
          <div>
            <h2 className="text-2xl">
              Feld {field.field}: {field.label}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="flex items-center gap-1" variant="outline">
                {getSourceIcon(field.source)}
                {field.source === "user_data"
                  ? "Persönliche Daten"
                  : field.source === "calculated"
                    ? "Berechnet"
                    : field.source === "transaction"
                      ? "Transaktionen"
                      : "Manuell"}
              </Badge>
              {field.required && (
                <Badge
                  className="flex items-center gap-1"
                  variant="destructive"
                >
                  <AlertCircle size={12} />
                  Pflichtfeld
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X size={20} />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Field Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feld-Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-sm">
                    Aktueller Wert
                  </label>
                  <div className="mt-1 text-lg">
                    {field.value
                      ? formatValue(field.value)
                      : "Nicht ausgefüllt"}
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm">
                    Feldtyp
                  </label>
                  <div className="mt-1 capitalize">{field.type}</div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm">
                    Quelle
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    {getSourceIcon(field.source)}
                    <span>{getSourceDescription(field.source)}</span>
                  </div>
                </div>

                {field.required && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle size={16} />
                      <span className="font-medium">Pflichtfeld</span>
                    </div>
                    <p className="mt-1 text-red-700 text-sm">
                      Dieses Feld muss für die Steuererklärung ausgefüllt
                      werden.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contributing Data */}
            {drillDownData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Beitragende Daten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-sm">
                      Gesamtbetrag
                    </label>
                    <div className="mt-1 text-lg">
                      {drillDownData.totalAmount.toFixed(2)} €
                    </div>
                  </div>

                  <div>
                    <label className="text-muted-foreground text-sm">
                      Kategorie-Aufschlüsselung
                    </label>
                    <div className="mt-2 space-y-2">
                      {Object.entries(drillDownData.categoryBreakdown).map(
                        ([category, amount]) => (
                          <div
                            className="flex justify-between text-sm"
                            key={category}
                          >
                            <span>{category}</span>
                            <span className="font-medium">
                              {amount.toFixed(2)} €
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {drillDownData.vatBreakdown &&
                    Object.keys(drillDownData.vatBreakdown).length > 0 && (
                      <div>
                        <label className="text-muted-foreground text-sm">
                          USt-Aufschlüsselung
                        </label>
                        <div className="mt-2 space-y-2">
                          {Object.entries(drillDownData.vatBreakdown).map(
                            ([rate, amount]) => (
                              <div
                                className="flex justify-between text-sm"
                                key={rate}
                              >
                                <span>{rate}% USt</span>
                                <span className="font-medium">
                                  {amount.toFixed(2)} €
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contributing Transactions */}
          {transactions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Beitragende Transaktionen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Gegenpartei</TableHead>
                        <TableHead>Betrag</TableHead>
                        <TableHead>Verwendungszweck</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.dateField}</TableCell>
                          <TableCell
                            className="max-w-xs truncate"
                            title={transaction.counterpartyField}
                          >
                            {transaction.counterpartyField}
                          </TableCell>
                          <TableCell
                            className={`font-medium ${
                              transaction.BetragNumeric > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.BetragNumeric.toFixed(2)} €
                          </TableCell>
                          <TableCell
                            className="max-w-xs truncate"
                            title={transaction.purposeField}
                          >
                            {transaction.purposeField}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info size={20} />
                Hilfe & Erklärungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">
                    Was bedeutet dieses Feld?
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Feld {field.field} ({field.label}) ist ein {field.type}-Feld
                    in Ihrer EÜR.
                    {field.required
                      ? " Es handelt sich um ein Pflichtfeld, das für die Steuererklärung ausgefüllt werden muss."
                      : " Dieses Feld ist optional."}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">
                    Wie wird der Wert bestimmt?
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {getSourceDescription(field.source)}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-800">💡 Tipp</h4>
                  <p className="text-blue-700 text-sm">
                    Überprüfen Sie alle automatisch ausgefüllten Felder auf
                    Richtigkeit. Bei Abweichungen können Sie die zugrunde
                    liegenden Transaktionen überarbeiten.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailModal;
