import { useState, useCallback, useMemo } from 'react';
import { Upload, Download, Calculator, FileText, Building, Info, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { skr04Categories } from '../utils/categoryMappings';
import { detectBankFormat, parseKontistCSV, parseHolviCSV, categorizeTransaction } from '../utils/transactionUtils';
import { calculateEuer, generateElsterOverview } from '../utils/euerCalculations';
import { generateReport, downloadReport } from '../utils/exportUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';

import type { Transaction } from '../types';

const EuerGenerator = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Record<number, string>>({});
    const [bankType, setBankType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(25);
    const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        address: '',
        taxNumber: '',
        vatNumber: '',
        taxRate: '19'
    });

    // CSV-Datei einlesen
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const detectedBankType = detectBankFormat(text);
            setBankType(detectedBankType);

            let parsedTransactions: Transaction[];

            if (detectedBankType === 'kontist') {
                parsedTransactions = parseKontistCSV(text);
            } else if (detectedBankType === 'holvi') {
                parsedTransactions = parseHolviCSV(text);
            } else {
                throw new Error('Unbekanntes CSV-Format. Unterstützt werden Kontist und Holvi.');
            }

            // EÜR-Kategorien zuweisen (alle Transaktionen, auch Privatentnahmen)
            parsedTransactions.forEach(t => {
                t.euerCategory = categorizeTransaction(t);
            });

            setTransactions(parsedTransactions);

            // Automatische Kategorisierung
            const autoCategories: Record<number, string> = {};
            parsedTransactions.forEach(t => {
                autoCategories[t.id] = t.euerCategory || '';
            });
            setCategories(autoCategories);
            setCurrentPage(1); // Zurück zur ersten Seite

        } catch (error) {
            alert('Fehler beim Einlesen der CSV-Datei: ' + (error instanceof Error ? error.message : String(error)));
        }
    }, []);

    // Kategorie ändern
    const updateCategory = (transactionId: number, categoryKey: string) => {
        setCategories(prev => ({
            ...prev,
            [transactionId]: categoryKey
        }));
    };

    // Pagination-Berechnungen
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    // EÜR berechnen mit/ohne USt
    const euerCalculation = useMemo(() => {
        return calculateEuer(transactions, categories, isKleinunternehmer);
    }, [transactions, categories, isKleinunternehmer]);

    // Elster Übersicht generieren
    const elsterSummary = useMemo(() => {
        return generateElsterOverview(euerCalculation);
    }, [euerCalculation]);

    // Report generieren
    const generateReportHandler = () => {
        const currentYear = new Date().getFullYear();
        const reportContent = generateReport(
            euerCalculation,
            companyInfo,
            'SKR04',
            bankType,
            isKleinunternehmer,
            transactions
        );
        downloadReport(reportContent, currentYear, 'SKR04', isKleinunternehmer);
    };

    // Elster Übersicht herunterladen
    const downloadElsterOverview = () => {
        const currentYear = new Date().getFullYear();
        const reportContent = generateReport(
            euerCalculation,
            companyInfo,
            'SKR04',
            bankType,
            isKleinunternehmer,
            transactions
        );
        downloadReport(reportContent, currentYear, 'SKR04', isKleinunternehmer);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Calculator className="text-blue-600" aria-hidden="true" />
                                    SKR04 EÜR Generator
                                </h1>
                                <p className="text-gray-600">
                                    Prozessorientierter Kontenrahmen mit Kleinunternehmerregelung
                                </p>
                                {bankType && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Building className="text-green-600" size={16} aria-hidden="true" />
                                        <span className="text-green-600 font-medium">
                                            {bankType === 'kontist' ? 'Kontist' : 'Holvi'} CSV erkannt - {transactions.length} Transaktionen
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => setShowSettings(!showSettings)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Settings size={16} aria-hidden="true" />
                                Einstellungen
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Einstellungen */}
                {showSettings && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Einstellungen</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="kleinunternehmer"
                                    checked={isKleinunternehmer}
                                    onCheckedChange={(checked) => setIsKleinunternehmer(checked as boolean)}
                                />
                                <label htmlFor="kleinunternehmer" className="font-medium">
                                    Kleinunternehmerregelung § 19 UStG
                                </label>
                            </div>
                            <div className="ml-7 space-y-2">
                                <p className="text-sm text-gray-600">
                                    {isKleinunternehmer
                                        ? '✅ Kleinunternehmer: Bruttobeträge = EÜR-Beträge (keine USt-Trennung)'
                                        : '✅ USt-pflichtig: Nettobeträge für EÜR, USt separat für Voranmeldung'
                                    }
                                </p>
                                <div className="text-xs bg-gray-100 p-2 rounded">
                                    <strong>Beispiel 119€ Ausgabe:</strong><br />
                                    {isKleinunternehmer
                                        ? 'Kleinunternehmer: 119€ → 119€ EÜR-Ausgabe'
                                        : 'USt-pflichtig: 119€ → 100€ EÜR-Ausgabe + 19€ Vorsteuer'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Unternehmensdaten */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Unternehmensdaten</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Unternehmensname</label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="Unternehmensname"
                                    value={companyInfo.name}
                                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                <Input
                                    id="companyAddress"
                                    type="text"
                                    placeholder="Adresse"
                                    value={companyInfo.address}
                                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">Steuernummer</label>
                                <Input
                                    id="taxNumber"
                                    type="text"
                                    placeholder="Steuernummer"
                                    value={companyInfo.taxNumber}
                                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, taxNumber: e.target.value }))}
                                />
                            </div>
                            {!isKleinunternehmer && (
                                <div>
                                    <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">USt-IdNr.</label>
                                    <Input
                                        id="vatNumber"
                                        type="text"
                                        placeholder="USt-IdNr."
                                        value={companyInfo.vatNumber}
                                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, vatNumber: e.target.value }))}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* File Upload */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">CSV-Datei hochladen</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto text-gray-400 mb-2" size={48} aria-hidden="true" />
                            <p className="text-gray-600 mb-4">
                                Kontist oder Holvi CSV-Datei hochladen
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="csvUpload"
                            />
                            <Button asChild variant="default">
                                <label htmlFor="csvUpload" className="cursor-pointer">
                                    CSV-Datei auswählen
                                </label>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaktionsübersicht mit Pagination */}
                {transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Alle Transaktionen kategorisieren</h2>
                            <div className="text-sm text-gray-600">
                                {transactions.length} Transaktionen insgesamt
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm text-gray-600">
                                Zeige {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, transactions.length)} von {transactions.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <ChevronLeft size={16} aria-hidden="true" />
                                    Zurück
                                </Button>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    Weiter
                                    <ChevronRight size={16} aria-hidden="true" />
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-2">Datum</th>
                                        <th className="text-left p-2">Gegenpartei</th>
                                        <th className="text-left p-2">Betrag</th>
                                        <th className="text-left p-2">Verwendungszweck</th>
                                        <th className="text-left p-2">SKR04-Konto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction) => {
                                        const categoryKey = categories[transaction.id] || transaction.euerCategory || '';
                                        const category = skr04Categories[categoryKey];
                                        const isPrivate = category?.type === 'private';

                                        return (
                                            <tr key={transaction.id} className={`border-b hover:bg-gray-50 ${isPrivate ? 'bg-orange-50' : ''}`}>
                                                <td className="p-2">{transaction.dateField}</td>
                                                <td className="p-2 max-w-xs truncate">{transaction.counterpartyField}</td>
                                                <td className={`p-2 font-medium ${transaction.BetragNumeric > 0 ? 'text-green-600' :
                                                    isPrivate ? 'text-orange-600' : 'text-red-600'
                                                    }`}>
                                                    {transaction.BetragNumeric.toFixed(2)}€
                                                </td>
                                                <td className="p-2 max-w-xs truncate">{transaction.purposeField}</td>
                                                <td className="p-2">
                                                    <Select
                                                        aria-label="SKR04-Konto auswählen"
                                                        value={categoryKey}
                                                        onValueChange={(value) => updateCategory(transaction.id, value)}
                                                    >
                                                        <SelectTrigger className={`text-xs w-full ${isPrivate ? 'border-orange-300 bg-orange-50' : ''}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(skr04Categories).filter(([_, cat]) => cat.type === 'income').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))}
                                                            {Object.entries(skr04Categories).filter(([_, cat]) => cat.type === 'expense').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))}
                                                            {Object.entries(skr04Categories).filter(([_, cat]) => cat.type === 'private').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls unten */}
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <Button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Erste
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                ‹
                            </Button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                                return (
                                    <Button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        variant={currentPage === pageNum ? 'default' : 'outline'}
                                        size="sm"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                ›
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                Letzte
                            </Button>
                        </div>
                    </div>
                )}

                {/* Elster EÜR-Übertragung */}
                {transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="text-blue-600" aria-hidden="true" />
                            Elster EÜR-Übertragung
                        </h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-2">
                                <Info className="text-blue-600 mt-1" size={20} aria-hidden="true" />
                                <div>
                                    <h3 className="font-medium text-blue-800">Direkte Übertragung in Elster</h3>
                                    <p className="text-blue-700 text-sm mt-1">
                                        Die Beträge sind nach Elster-Zeilennummern gruppiert. Übertragen Sie die Werte direkt in Ihr Elster-Formular.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Einnahmen */}
                            <div>
                                <h3 className="text-lg font-medium text-green-600 mb-4">📋 Elster-Einnahmen</h3>
                                <div className="space-y-3">
                                    {Object.entries(elsterSummary)
                                        .filter(([fieldNumber]) => parseInt(fieldNumber) >= 17 && parseInt(fieldNumber) <= 24)
                                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                        .map(([fieldNumber, fieldData]) => (
                                            <div key={fieldNumber} className="bg-green-50 border border-green-200 rounded p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-medium text-green-800">
                                                        📝 Zeile {fieldNumber}
                                                    </div>
                                                    <div className="text-green-700 font-bold text-lg">
                                                        {fieldData.amount.toFixed(2)} €
                                                    </div>
                                                </div>
                                                <div className="text-sm text-green-700 font-medium mb-2">
                                                    {fieldData.label}
                                                </div>
                                                <div className="text-xs text-green-600">
                                                    {fieldData.categories.map((cat, idx) => (
                                                        <div key={`${fieldNumber}-${idx}`}>• {cat.name}: {cat.amount.toFixed(2)} €</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Ausgaben */}
                            <div>
                                <h3 className="text-lg font-medium text-red-600 mb-4">📋 Elster-Ausgaben</h3>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {Object.entries(elsterSummary)
                                        .filter(([fieldNumber]) => parseInt(fieldNumber) >= 25 && parseInt(fieldNumber) <= 50)
                                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                        .map(([fieldNumber, fieldData]) => (
                                            <div key={fieldNumber} className="bg-red-50 border border-red-200 rounded p-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-medium text-red-800">
                                                        📝 Zeile {fieldNumber}
                                                    </div>
                                                    <div className="text-red-700 font-bold text-lg">
                                                        {fieldData.amount.toFixed(2)} € {(fieldData as any).note || ''}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-red-700 font-medium mb-2">
                                                    {fieldData.label}
                                                </div>
                                                <div className="text-xs text-red-600">
                                                    {fieldData.categories.map((cat, idx) => (
                                                        <div key={`${fieldNumber}-${idx}`}>• {cat.name}: {cat.amount.toFixed(2)} €</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Elster Download */}
                        <div className="mt-6 text-center space-y-3">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">✅ Bereit für Elster-Übertragung</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-600">Einnahmen gesamt:</div>
                                        <div className="font-bold text-green-600">
                                            {Object.entries(elsterSummary)
                                                .filter(([fieldNumber]) => parseInt(fieldNumber) >= 17 && parseInt(fieldNumber) <= 24)
                                                .reduce((sum, [, fieldData]) => sum + fieldData.amount, 0)
                                                .toFixed(2)} €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Ausgaben gesamt:</div>
                                        <div className="font-bold text-red-600">
                                            {Object.entries(elsterSummary)
                                                .filter(([fieldNumber]) => parseInt(fieldNumber) >= 25 && parseInt(fieldNumber) <= 50)
                                                .reduce((sum, [, fieldData]) => sum + fieldData.amount, 0)
                                                .toFixed(2)} €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Gewinn/Verlust:</div>
                                        <div className={`font-bold ${euerCalculation.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {euerCalculation.profit.toFixed(2)} €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Status:</div>
                                        <div className="font-bold text-blue-600">
                                            {isKleinunternehmer ? 'KU §19' : 'USt-pflichtig'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={downloadElsterOverview}
                                    variant="default"
                                    className="flex items-center gap-2"
                                >
                                    <Download size={20} aria-hidden="true" />
                                    Elster-Übertragung herunterladen
                                </Button>

                                <Button
                                    onClick={generateReportHandler}
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Download size={20} aria-hidden="true" />
                                    Detaillierte EÜR exportieren
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                            <strong>💡 Anleitung:</strong> Öffnen Sie Elster → EÜR-Formular → Übertragen Sie die Beträge in die entsprechenden Zeilen.
                            Die Zeilennummern entsprechen exakt den Elster-Formularfeldern.
                        </div>
                    </div>
                )}

                {/* EÜR-Ergebnis */}
                {transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Einnahmen-Überschuss-Rechnung (SKR04)</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Einnahmen */}
                            <div>
                                <h3 className="text-lg font-medium text-green-600 mb-3">Betriebseinnahmen</h3>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {Object.entries(euerCalculation.income).map(([key, amount]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="truncate">{skr04Categories[key]?.code} {skr04Categories[key]?.name}</span>
                                            <span className="font-medium ml-2">{amount.toFixed(2)}€</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-3 pt-2 flex justify-between font-bold text-green-600">
                                    <span>Gesamteinnahmen:</span>
                                    <span>{euerCalculation.totalIncome.toFixed(2)}€</span>
                                </div>
                            </div>

                            {/* Ausgaben */}
                            <div>
                                <h3 className="text-lg font-medium text-red-600 mb-3">Betriebsausgaben</h3>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {Object.entries(euerCalculation.expenses).map(([key, amount]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="truncate">{skr04Categories[key]?.code} {skr04Categories[key]?.name}</span>
                                            <span className="font-medium ml-2">{amount.toFixed(2)}€</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-3 pt-2 flex justify-between font-bold text-red-600">
                                    <span>Gesamtausgaben:</span>
                                    <span>{euerCalculation.totalExpenses.toFixed(2)}€</span>
                                </div>
                            </div>

                            {/* Zusammenfassung */}
                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-lg font-medium mb-1">Zusammenfassung</h3>
                                <div className="text-xs text-blue-600 mb-3">
                                    {isKleinunternehmer ? '§ 19 UStG - Bruttobeträge' : 'USt-pflichtig - Nettobeträge + USt separat'}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="text-xs text-gray-500 mb-2">
                                        {isKleinunternehmer
                                            ? '📊 Beträge: Brutto (inkl. USt)'
                                            : '📊 Beträge: Netto (ohne USt)'
                                        }
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Betriebseinnahmen:</span>
                                        <span className="text-green-600 font-medium">{euerCalculation.totalIncome.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Betriebsausgaben:</span>
                                        <span className="text-red-600 font-medium">-{euerCalculation.totalExpenses.toFixed(2)}€</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold">
                                        <span>Steuerpflichtiger Gewinn:</span>
                                        <span className={euerCalculation.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {euerCalculation.profit.toFixed(2)}€
                                        </span>
                                    </div>

                                    {/* Privatbereich */}
                                    {Object.keys(euerCalculation.privateTransactions).length > 0 && (
                                        <div className="border-t pt-2 mt-2">
                                            <h4 className="font-medium text-orange-600 mb-1">Privatbereich</h4>
                                            {Object.entries(euerCalculation.privateTransactions).map(([key, amount]) => (
                                                <div key={key} className="flex justify-between text-orange-600 text-xs">
                                                    <span>{skr04Categories[key]?.name}:</span>
                                                    <span>{amount.toFixed(2)}€</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between font-medium mt-1">
                                                <span>Verbleibt im Betrieb:</span>
                                                <span>{(euerCalculation.profit - euerCalculation.privateWithdrawals + euerCalculation.privateDeposits).toFixed(2)}€</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* USt-Berechnung */}
                                {!isKleinunternehmer && (
                                    <div className="mt-4 pt-3 border-t">
                                        <h4 className="font-medium text-blue-600 mb-2">Umsatzsteuer-Voranmeldung</h4>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Umsatzsteuer (schuldig):</span>
                                                <span>{euerCalculation.vatOwed.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Vorsteuer (bezahlt):</span>
                                                <span>-{euerCalculation.vatPaid.toFixed(2)}€</span>
                                            </div>
                                            <div className="flex justify-between font-medium">
                                                <span>USt-Saldo:</span>
                                                <span className={euerCalculation.vatBalance >= 0 ? 'text-red-600' : 'text-green-600'}>
                                                    {euerCalculation.vatBalance.toFixed(2)}€
                                                    {euerCalculation.vatBalance >= 0 ? ' (nachzahlen)' : ' (Erstattung)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isKleinunternehmer && (
                                    <div className="mt-4 pt-3 border-t">
                                        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                            <strong>Kleinunternehmerregelung § 19 UStG</strong><br />
                                            Keine Umsatzsteuer-Berechnung
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="mt-6 text-center">
                            <Button
                                onClick={generateReportHandler}
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 mx-auto"
                            >
                                <Download size={20} aria-hidden="true" />
                                SKR04 EÜR exportieren
                            </Button>
                        </div>
                    </div>
                )}

                {transactions.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <FileText className="mx-auto text-gray-400 mb-4" size={64} aria-hidden="true" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                            Keine Daten geladen
                        </h3>
                        <p className="text-gray-500">
                            Laden Sie eine Kontist oder Holvi CSV-Datei hoch, um mit der SKR04 EÜR-Erstellung zu beginnen.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EuerGenerator;