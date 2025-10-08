import React, { useState } from 'react';
import { ChevronDown, Sigma, Lock } from 'lucide-react';
import type { FieldGroup } from '../types';
import TransactionDetails from './TransactionDetails';

interface FieldGroupsProps {
    groups: FieldGroup[];
    isKleinunternehmer: boolean;
    categories: { [key: number]: string };
    skrCategories: Record<string, { code: string; name: string; type: string; vat: number; elsterField?: string }>;
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
    groups,
    isKleinunternehmer,
    categories,
    skrCategories
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
        if (typeof value === 'number') {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(value);
        }
        return value || '---';
    };

    return (
        <div className="space-y-1">
            {groups.map((group) => (
                <div key={group.id}>
                    {/* Section Header - Only show if has title */}
                    {group.title && (
                        <div className="py-3 px-4 bg-slate-50 border-l-4 border-primary text-left">
                            <h3 className="text-base md:text-lg font-normal text-gray-900">{group.title}</h3>
                            {group.description && group.description !== group.title && (
                                <p
                                    className="text-xs md:text-sm text-gray-600 mt-1 font-mono"
                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
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
                                        key={field.field}
                                        className={`border-b border-gray-200 ${isEven ? 'bg-white' : 'bg-gray-50'
                                            } ${field.transactions && field.transactions.length > 0
                                                ? 'cursor-pointer hover:bg-muted/20 transition-colors'
                                                : ''
                                            }`}
                                        onClick={() => {
                                            if (field.transactions && field.transactions.length > 0) {
                                                toggleFieldExpansion(field.field);
                                            }
                                        }}
                                    >
                                        {/* Field Number - Left */}
                                        <td className="w-24 p-2">  {/* Erweiterte Breite für Bereiche */}
                                            <div className="flex items-center justify-center h-full">
                                                <span
                                                    className="inline-flex items-center justify-center min-w-8 px-2 h-6 rounded-sm bg-muted/50 border border-border/50 font-mono text-xs text-muted-foreground"
                                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace' }}
                                                >
                                                    {field.field}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Field Label - Left */}
                                        <td className="px-4 py-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-800 font-mono" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                                                    {field.label}
                                                </span>
                                                {field.readOnlyCalculated && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm bg-muted/40 border border-border/40 text-muted-foreground">
                                                        <Lock size={10} /> berechnet
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Amount - Right */}
                                        <td className="w-32 px-3 py-2 text-right">  {/* Erweiterte Breite und mehr Padding */}
                                            <div className="flex items-center justify-end gap-2">
                                                {field.transactions && field.transactions.length > 0 && (
                                                    <>
                                                        <div className="flex items-center gap-1">
                                                            <Sigma size={10} className="text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                {field.transactions.length}
                                                            </span>
                                                        </div>
                                                        <ChevronDown
                                                            size={16}
                                                            className={`text-muted-foreground transition-transform duration-200 flex-shrink-0 ${expandedFields.has(field.field) ? 'rotate-180' : 'rotate-0'
                                                                }`}
                                                            style={{ minWidth: '16px', minHeight: '16px' }}
                                                            aria-label="Details anzeigen/ausblenden"
                                                        />
                                                    </>
                                                )}
                                                <span className={`font-mono text-sm ${isEmpty ? 'text-gray-400' : 'text-gray-900'
                                                    }`}>
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
                                            key={`details-${field.field}`}
                                            transactions={field.transactions}
                                            categoryBreakdown={field.categoryBreakdown}
                                            isExpanded={expandedFields.has(field.field)}
                                            onToggle={() => toggleFieldExpansion(field.field)}
                                            fieldLabel={field.label}
                                            isKleinunternehmer={isKleinunternehmer}
                                            categories={categories}
                                            skrCategories={skrCategories}
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