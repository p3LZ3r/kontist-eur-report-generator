import React, { useState } from 'react';
import { Download, FileText, Database, Code } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import PaymentModal from './PaymentModal';
import type { FieldGroup, Transaction } from '../types';

interface FieldGroupsProps {
    groups: FieldGroup[];
    transactions?: Transaction[];
    categories?: { [key: number]: string };
    isKleinunternehmer?: boolean;
    currentYear?: number;
    currentSkr?: string;
    onExport?: (type: 'txt' | 'csv' | 'json' | 'pdf') => void;
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
    groups,
    transactions = [],
    categories = {},
    isKleinunternehmer = false,
    currentYear = new Date().getFullYear(),
    currentSkr = 'SKR04',
    onExport
}) => {
    const [paymentModal, setPaymentModal] = useState<{
        isOpen: boolean;
        exportType: 'txt' | 'csv' | 'json' | 'pdf' | null;
    }>({ isOpen: false, exportType: null });

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

    const handleExportClick = (type: 'txt' | 'csv' | 'json' | 'pdf') => {
        setPaymentModal({ isOpen: true, exportType: type });
    };

    const handleSkipPayment = () => {
        const { exportType } = paymentModal;
        setPaymentModal({ isOpen: false, exportType: null });
        if (exportType && onExport) {
            onExport(exportType);
        }
    };

    const handlePaymentSuccess = () => {
        const { exportType } = paymentModal;
        setPaymentModal({ isOpen: false, exportType: null });
        if (exportType && onExport) {
            onExport(exportType);
        }
    };

    const closeModal = () => {
        setPaymentModal({ isOpen: false, exportType: null });
    };

    return (
        <div className="space-y-1">
            {groups.map((group) => (
                <div key={group.id}>
                    {/* Section Header - Only show if has title */}
                    {group.title && (
                        <div className="py-3 px-4 bg-slate-50 border-l-4 border-primary">
                            <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
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
                                            isEmpty ? 'text-gray-400' : 'text-gray-900 font-medium'
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

            {/* Export Section */}
            {transactions.length > 0 && (
                <Card className="mt-6">
                    <CardContent className="p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                ELSTER Export
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Laden Sie Ihre EÜR-Daten in verschiedenen Formaten herunter
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <Button
                                onClick={() => handleExportClick('txt')}
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5"
                            >
                                <FileText className="text-primary" size={24} />
                                <span className="font-medium">EÜR Bericht</span>
                                <span className="text-xs text-muted-foreground">Textformat (.txt)</span>
                            </Button>

                            <Button
                                onClick={() => handleExportClick('csv')}
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5"
                            >
                                <Database className="text-primary" size={24} />
                                <span className="font-medium">ELSTER CSV</span>
                                <span className="text-xs text-muted-foreground">Für ELSTER Import</span>
                            </Button>

                            <Button
                                onClick={() => handleExportClick('json')}
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5"
                            >
                                <Code className="text-primary" size={24} />
                                <span className="font-medium">ELSTER JSON</span>
                                <span className="text-xs text-muted-foreground">Strukturierte Daten</span>
                            </Button>

                            <Button
                                onClick={() => handleExportClick('pdf')}
                                variant="outline"
                                className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary/5"
                            >
                                <Download className="text-primary" size={24} />
                                <span className="font-medium">PDF Bericht</span>
                                <span className="text-xs text-muted-foreground">Detailliert (.pdf)</span>
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-xs text-muted-foreground">
                                Jahr: {currentYear} • Kontenrahmen: {currentSkr} • 
                                {isKleinunternehmer ? ' Kleinunternehmer (Brutto)' : ' Umsatzsteuerpflichtig (Netto)'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Modal */}
            <PaymentModal
                isOpen={paymentModal.isOpen}
                onClose={closeModal}
                onSkip={handleSkipPayment}
                onPaymentSuccess={handlePaymentSuccess}
                exportType={paymentModal.exportType || 'txt'}
            />
        </div>
    );
};

export default FieldGroups;