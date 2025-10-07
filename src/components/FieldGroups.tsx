import React from 'react';
import type { FieldGroup } from '../types';

interface FieldGroupsProps {
    groups: FieldGroup[];
    currentYear?: number;
    currentSkr?: string;
    isKleinunternehmer?: boolean;
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
    groups,
    isKleinunternehmer = false,
    currentYear = new Date().getFullYear(),
    currentSkr = 'SKR04'
}) => {
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
                        <div className="py-3 px-4 bg-slate-50 border-l-4 border-primary">
                            <h3 className="text-sm text-gray-800">{group.title}</h3>
                            {group.description && (
                                <p className="text-xs text-gray-600 mt-1">{group.description}</p>
                            )}
                        </div>
                    )}
                    
                    {/* Fields - Simple table-like layout */}
                    <div className="space-y-0">
                        {group.fields.map((field, fieldIndex) => {
                            const isEmpty = !field.value || field.value === 0;
                            const isEven = fieldIndex % 2 === 0;
                            
                            return (
                                <div
                                    key={field.field}
                                    className={`flex items-center py-2 px-4 border-b border-gray-200 ${
                                        isEven ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    {/* Field Number - Left */}
                                    <div className="flex-shrink-0 w-8 text-xs font-mono text-gray-500">
                                        {field.field}
                                    </div>

                                    {/* Field Label - Center */}
                                    <div className="flex-1 px-4">
                                        <span className="text-sm text-gray-800">
                                            {field.label}
                                        </span>
                                    </div>

                                    {/* Amount - Right */}
                                    <div className="flex-shrink-0 text-right min-w-28">
                                        <span className={`font-mono text-sm ${
                                            isEmpty ? 'text-gray-400' : 'text-gray-900'
                                        }`}>
                                            {formatValue(field.value)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Information Section */}
            <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-center">
                    <h3 className="text-lg text-foreground mb-2">
                        ELSTER-Felder Übersicht
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Diese Übersicht zeigt Ihnen alle relevanten ELSTER-Felder mit den berechneten Werten für Ihre EÜR.
                    </p>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            Jahr: {currentYear} • Kontenrahmen: {currentSkr} •
                            {isKleinunternehmer ? ' Kleinunternehmer (Brutto)' : ' Umsatzsteuerpflichtig (Netto)'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldGroups;