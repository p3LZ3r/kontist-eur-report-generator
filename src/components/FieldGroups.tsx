import { ChevronDown, Lock, Sigma } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { FieldGroup } from "../types";
import TransactionDetails from "./TransactionDetails";

interface FieldGroupsProps {
  groups: FieldGroup[];
  isKleinunternehmer: boolean;
  categories: { [key: number]: string };
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
  currentSkr?: "SKR03" | "SKR04" | "SKR49";
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
  groups,
  isKleinunternehmer,
  categories,
  skrCategories,
}) => {
  // State für aufgeklappte Transaktionsdetails
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const toggleFieldExpansion = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const formatValue = (value: number | string) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(value);
    }
    return value || "---";
  };

  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <div key={group.id}>
          {/* Section Header - Only show if has title */}
          {group.title && (
            <div className="border-primary border-l-4 bg-slate-50 px-4 py-3 text-left">
              <h3 className="font-normal text-base text-gray-900 md:text-lg">
                {group.title}
              </h3>
              {group.description && group.description !== group.title && (
                <p
                  className="mt-1 font-mono text-gray-600 text-xs md:text-sm"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  }}
                >
                  {group.description}
                </p>
              )}
            </div>
          )}

          {/* Fields - Table layout */}
          <table className="w-full table-fixed">
            <tbody>
              {group.fields.map((field, fieldIndex) => {
                const isEmpty = !field.value || field.value === 0;
                const isEven = fieldIndex % 2 === 0;
                const rows = [];

                // Main field row
                rows.push(
                  <tr
                    className={`border-gray-200 border-b ${
                      isEven ? "bg-white" : "bg-gray-50"
                    } ${
                      field.transactions && field.transactions.length > 0
                        ? "cursor-pointer transition-colors hover:bg-muted/20"
                        : ""
                    }`}
                    key={field.field}
                    onClick={() => {
                      if (field.transactions && field.transactions.length > 0) {
                        toggleFieldExpansion(field.field);
                      }
                    }}
                  >
                    {/* Field Number - Left */}
                    <td className="w-24 px-3 py-2">
                      {" "}
                      {/* Etwas breitere Spalte mit mehr Padding */}
                      <div className="flex h-full items-center justify-center">
                        <span
                          className="inline-flex h-6 min-w-10 items-center justify-center whitespace-nowrap rounded-sm border border-border/50 bg-muted/50 px-2 font-mono text-muted-foreground text-xs"
                          style={{
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          }}
                        >
                          {field.field}
                        </span>
                      </div>
                    </td>

                    {/* Field Label - Left */}
                    <td className="px-3 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-gray-800 text-sm"
                          style={{
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          }}
                        >
                          {field.label}
                        </span>
                        {field.readOnlyCalculated && (
                          <span className="inline-flex items-center gap-1 rounded-sm border border-border/40 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <Lock size={10} /> berechnet
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Amount - Right */}
                    <td className="w-32 px-3 py-2 text-right">
                      {" "}
                      {/* Feste Breite mit mehr Padding */}
                      <div className="flex items-center justify-end gap-2">
                        {field.transactions &&
                          field.transactions.length > 0 && (
                            <>
                              <div className="flex items-center gap-1">
                                <Sigma
                                  className="text-muted-foreground"
                                  size={10}
                                />
                                <span className="text-muted-foreground text-xs">
                                  {field.transactions.length}
                                </span>
                              </div>
                              <ChevronDown
                                aria-label="Details anzeigen/ausblenden"
                                className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                                  expandedFields.has(field.field)
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                                size={16}
                                style={{ minWidth: "16px", minHeight: "16px" }}
                              />
                            </>
                          )}
                        <span
                          className={`font-mono text-sm ${
                            isEmpty ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {formatValue(field.value)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );

                // Add transaction detail rows if available
                if (field.transactions && field.transactions.length > 0) {
                  const transactionRows = (
                    <TransactionDetails
                      categories={categories}
                      categoryBreakdown={field.categoryBreakdown}
                      fieldLabel={field.label}
                      isExpanded={expandedFields.has(field.field)}
                      isKleinunternehmer={isKleinunternehmer}
                      key={`details-${field.field}`}
                      onToggle={() => toggleFieldExpansion(field.field)}
                      skrCategories={skrCategories}
                      transactions={field.transactions}
                    />
                  );
                  rows.push(transactionRows);
                }

                return rows;
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default FieldGroups;
