import { useState, useCallback, useMemo, useEffect } from 'react';
import { Upload, Download, Calculator, FileText, Building, Info, ChevronLeft, ChevronRight, Settings, Target } from 'lucide-react';
import { getCategoriesForSkr, skr04Categories } from '../utils/categoryMappings';
import { detectBankFormat, parseKontistCSV, parseHolviCSV, categorizeTransaction } from '../utils/transactionUtils';
import { calculateEuer, generateElsterOverview } from '../utils/euerCalculations';
import { generateReport, downloadReport, downloadElsterCSV, downloadElsterJSON, validateElsterData } from '../utils/exportUtils';
import { PAGINATION, ELSTER_FIELD_RANGES } from '../utils/constants';
import { prepareGuidanceData, generateDrillDownData } from '../utils/guidanceUtils';
import { Button } from './ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import NavigationSidebar from './NavigationSidebar';
import FieldGroups from './FieldGroups';
import FieldDetailModal from './FieldDetailModal';
import HelpModal from './HelpModal';

import type {
    Transaction,
    ElsterFieldValue,
    DrillDownData
} from '../types';

const EuerGenerator = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Record<number, string>>({});
    const [bankType, setBankType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
    const [currentSkr, setCurrentSkr] = useState<'SKR03' | 'SKR04' | 'SKR49'>('SKR04');
    const [skrCategories, setSkrCategories] = useState<Record<string, any>>(skr04Categories);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isProcessingFile, setIsProcessingFile] = useState(false);


    const [currentSection, setCurrentSection] = useState('personal');
    const [showGuidance, setShowGuidance] = useState(false);
    const [fieldDetailModal, setFieldDetailModal] = useState<{
        isOpen: boolean;
        field?: ElsterFieldValue;
        drillDownData?: DrillDownData;
    }>({ isOpen: false });
    const [helpModal, setHelpModal] = useState<{
        isOpen: boolean;
        section?: string;
    }>({ isOpen: false });

    // Load SKR categories dynamically
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const loadedCategories = await getCategoriesForSkr(currentSkr);
                setSkrCategories(loadedCategories);
            } catch (error) {
                console.warn(`Failed to load ${currentSkr} categories, using fallback:`, error);
                setSkrCategories(skr04Categories);
            }
        };

        loadCategories();
    }, [currentSkr]);

    // CSV-Datei einlesen
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessingFile(true);
        setErrorMessage(null);

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
            setErrorMessage('Fehler beim Einlesen der CSV-Datei: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
            setIsProcessingFile(false);
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
    const indexOfLastTransaction = currentPage * PAGINATION.TRANSACTIONS_PER_PAGE;
    const indexOfFirstTransaction = indexOfLastTransaction - PAGINATION.TRANSACTIONS_PER_PAGE;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / PAGINATION.TRANSACTIONS_PER_PAGE);

    // EÜR berechnen mit/ohne USt
    const euerCalculation = useMemo(() => {
        return calculateEuer(transactions, categories, isKleinunternehmer, skrCategories);
    }, [transactions, categories, isKleinunternehmer, skrCategories]);

    // Elster Übersicht generieren - enhanced with complete field set
    const elsterSummary = useMemo(() => {
        return generateElsterOverview(euerCalculation, isKleinunternehmer);
    }, [euerCalculation, isKleinunternehmer]);

    // Guidance system data
    const guidanceData = useMemo(() => {
        if (transactions.length === 0) return null;
        return prepareGuidanceData(transactions, categories, isKleinunternehmer);
    }, [transactions, categories, isKleinunternehmer]);

    // Report generieren
    const generateReportHandler = () => {
        const currentYear = new Date().getFullYear();
        const reportContent = generateReport(
            euerCalculation,
            currentSkr,
            bankType,
            isKleinunternehmer,
            transactions
        );
        downloadReport(reportContent, currentYear, currentSkr, isKleinunternehmer);
    };

    // Elster Übersicht herunterladen (legacy text format)
    const downloadElsterOverview = () => {
        const currentYear = new Date().getFullYear();
        const reportContent = generateReport(
            euerCalculation,
            currentSkr,
            bankType,
            isKleinunternehmer,
            transactions
        );
        downloadReport(reportContent, currentYear, currentSkr, isKleinunternehmer);
    };

    // New ELSTER CSV export
    const handleElsterCSVExport = () => {
        const currentYear = new Date().getFullYear();
        downloadElsterCSV(transactions, categories, isKleinunternehmer, currentYear);
    };

    // New ELSTER JSON export
    const handleElsterJSONExport = () => {
        const currentYear = new Date().getFullYear();
        downloadElsterJSON(transactions, categories, isKleinunternehmer, currentYear);
    };

    // Validate ELSTER data
    const validateElsterExport = () => {
        const validation = validateElsterData(transactions, categories, isKleinunternehmer);
        if (!validation.isValid) {
            alert(`ELSTER Export nicht möglich:\n\nFehlende Pflichtfelder:\n${validation.missingFields.join('\n')}`);
            return false;
        }
        return true;
    };

    // Guidance system callbacks
    const handleSectionChange = useCallback((sectionId: string) => {
        setCurrentSection(sectionId);
    }, []);

    const handleFieldClick = useCallback((field: ElsterFieldValue) => {
        const drillDownData = guidanceData ? generateDrillDownData(field, transactions, categories) : undefined;

        setFieldDetailModal({
            isOpen: true,
            field,
            drillDownData
        });
    }, [guidanceData, transactions, categories]);

    const handleGroupToggle = useCallback((_groupId: string) => {
        if (!guidanceData) return;
        // Note: In a real implementation, you'd update the state properly
    }, [guidanceData]);

    const handleHelpToggle = useCallback(() => {
        setHelpModal({ isOpen: !helpModal.isOpen, section: currentSection });
    }, [helpModal.isOpen, currentSection]);

    const closeFieldDetailModal = useCallback(() => {
        setFieldDetailModal({ isOpen: false });
    }, []);

    const closeHelpModal = useCallback(() => {
        setHelpModal({ isOpen: false });
    }, []);

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {errorMessage && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="text-destructive font-medium flex-shrink-0">Fehler:</div>
                        <div className="text-destructive flex-1">{errorMessage}</div>
                        <Button
                            onClick={() => setErrorMessage(null)}
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 focus-ring"
                            aria-label="Fehlermeldung schließen"
                        >
                            Schließen
                        </Button>
                    </div>
                </div>
            )}
            <Card className="animate-fade-in">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-3">
                                <Calculator className="text-primary" size={32} aria-hidden="true" />
                                {currentSkr} EÜR Generator
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Prozessorientierter Kontenrahmen mit Kleinunternehmerregelung
                            </p>
                            {bankType && (
                                <div className="mt-4 flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                                    <Building className="text-success" size={20} aria-hidden="true" />
                                    <span className="text-success font-medium">
                                        {bankType === 'kontist' ? 'Kontist' : 'Holvi'} CSV erkannt - {transactions.length} Transaktionen
                                    </span>
                                </div>
                            )}
                            {/* Kleinunternehmer-Checkbox */}
                            <div className="mt-4 flex items-start gap-4 p-3 bg-muted/20 rounded-lg border">
                                <Checkbox
                                    id="kleinunternehmer"
                                    checked={isKleinunternehmer}
                                    onCheckedChange={(checked) => setIsKleinunternehmer(checked as boolean)}
                                    className="mt-1 focus-ring"
                                />
                                <div className="flex-1">
                                    <label htmlFor="kleinunternehmer" className="font-medium text-foreground text-base cursor-pointer">
                                        Kleinunternehmerregelung § 19 UStG
                                    </label>
                                    <div className="mt-2 space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            {isKleinunternehmer
                                                ? '✅ Kleinunternehmer: Bruttobeträge = EÜR-Beträge (keine USt-Trennung)'
                                                : '✅ USt-pflichtig: Nettobeträge für EÜR, USt separat für Voranmeldung'
                                            }
                                        </p>
                                        <div className="text-sm bg-muted p-3 rounded-lg border">
                                            <strong className="text-foreground">Beispiel 119€ Ausgabe:</strong><br />
                                            <span className="text-muted-foreground">
                                                {isKleinunternehmer
                                                    ? 'Kleinunternehmer: 119€ → 119€ EÜR-Ausgabe'
                                                    : 'USt-pflichtig: 119€ → 100€ EÜR-Ausgabe + 19€ Vorsteuer'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kontenrahmen-Auswahl */}
                            <div className="mt-4 flex items-center gap-4 p-3 bg-muted/20 rounded-lg border">
                                <label htmlFor="skr-select" className="font-medium text-foreground text-base">
                                    Kontenrahmen:
                                </label>
                                <Select value={currentSkr} onValueChange={(value: 'SKR03' | 'SKR04' | 'SKR49') => setCurrentSkr(value)}>
                                    <SelectTrigger id="skr-select" className="w-32 focus-ring">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SKR03">SKR03</SelectItem>
                                        <SelectItem value="SKR04">SKR04</SelectItem>
                                        <SelectItem value="SKR49">SKR49</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">
                                    {currentSkr === 'SKR03' && 'Datev SKR03 - Industrie und Handel'}
                                    {currentSkr === 'SKR04' && 'Datev SKR04 - Dienstleistungen'}
                                    {currentSkr === 'SKR49' && 'Datev SKR49 - Freiberufler'}
                                </span>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>



            {/* File Upload */}
            <Card className="animate-fade-in">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                        <Upload className="text-primary" size={24} aria-hidden="true" />
                        CSV-Datei hochladen
                    </h2>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                        {isProcessingFile ? (
                            <>
                                <div className="mx-auto mb-4 w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    CSV-Datei wird verarbeitet...
                                </h3>
                                <p className="text-muted-foreground">
                                    Transaktionen werden analysiert und kategorisiert.
                                </p>
                            </>
                        ) : (
                            <>
                                <Upload className="mx-auto text-muted-foreground mb-4" size={64} aria-hidden="true" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    Bank-Export hochladen
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Laden Sie Ihre Kontist oder Holvi CSV-Datei hoch, um automatisch Transaktionen zu kategorisieren und Ihre EÜR zu erstellen.
                                </p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="csvUpload"
                                    aria-describedby="file-upload-description"
                                    disabled={isProcessingFile}
                                />
                                <Button asChild size="lg" className="focus-ring" disabled={isProcessingFile}>
                                    <label htmlFor="csvUpload" className="cursor-pointer">
                                        <Upload size={18} className="mr-2" aria-hidden="true" />
                                        CSV-Datei auswählen
                                    </label>
                                </Button>
                                <p id="file-upload-description" className="text-sm text-muted-foreground mt-3">
                                    Unterstützt: Kontist und Holvi CSV-Formate
                                </p>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Transaktionsübersicht mit Pagination */}
            {transactions.length > 0 && (
                <Card className="animate-fade-in">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <FileText className="text-primary" size={24} aria-hidden="true" />
                                Transaktionen kategorisieren
                            </h2>
                            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {transactions.length} Transaktionen insgesamt
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <div className="text-sm text-muted-foreground">
                                Zeige {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, transactions.length)} von {transactions.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 focus-ring"
                                >
                                    <ChevronLeft size={16} aria-hidden="true" />
                                    Zurück
                                </Button>
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md font-medium">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 focus-ring"
                                >
                                    Weiter
                                    <ChevronRight size={16} aria-hidden="true" />
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block mobile-table">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="text-left p-4 font-semibold text-foreground">Datum</th>
                                        <th className="text-left p-4 font-semibold text-foreground">Gegenpartei</th>
                                        <th className="text-left p-4 font-semibold text-foreground">Betrag</th>
                                        <th className="text-left p-4 font-semibold text-foreground">Verwendungszweck</th>
                                        <th className="text-left p-4 font-semibold text-foreground">{currentSkr}-Konto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction) => {
                                        const categoryKey = categories[transaction.id] || transaction.euerCategory || '';
                                        const category = skrCategories[categoryKey];
                                        const isPrivate = category?.type === 'private';

                                        return (
                                            <tr key={transaction.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${isPrivate ? 'bg-private/5' : ''}`}>
                                                <td className="p-4 text-foreground">{transaction.dateField}</td>
                                                <td className="p-4 text-foreground max-w-xs truncate" title={transaction.counterpartyField}>{transaction.counterpartyField}</td>
                                                <td className={`p-4 font-semibold ${transaction.BetragNumeric > 0 ? 'text-income' :
                                                    isPrivate ? 'text-private' : 'text-expense'
                                                    }`}>
                                                    {transaction.BetragNumeric.toFixed(2)}€
                                                </td>
                                                <td className="p-4 text-muted-foreground max-w-xs truncate" title={transaction.purposeField}>{transaction.purposeField}</td>
                                                <td className="p-4">
                                                    <Select
                                                        aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                                                        value={categoryKey}
                                                        onValueChange={(value) => updateCategory(transaction.id, value)}
                                                    >
                                                        <SelectTrigger className={`w-full focus-ring ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'income').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))}
                                                            {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'expense').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))}
                                                            {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'private').map(([key, category]) => (
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

                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-4">
                            {currentTransactions.map((transaction) => {
                                const categoryKey = categories[transaction.id] || transaction.euerCategory || '';
                                const category = skrCategories[categoryKey];
                                const isPrivate = category?.type === 'private';

                                return (
                                    <Card key={transaction.id} className={`animate-fade-in ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="text-sm text-muted-foreground mb-1">{transaction.dateField}</div>
                                                    <div className="font-medium text-foreground truncate" title={transaction.counterpartyField}>
                                                        {transaction.counterpartyField}
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-bold ${transaction.BetragNumeric > 0 ? 'text-income' :
                                                    isPrivate ? 'text-private' : 'text-expense'
                                                    }`}>
                                                    {transaction.BetragNumeric.toFixed(2)}€
                                                </div>
                                            </div>

                                            <div className="text-sm text-muted-foreground mb-3 line-clamp-2" title={transaction.purposeField}>
                                                {transaction.purposeField}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground" htmlFor={`category-${transaction.id}`}>{currentSkr}-Konto:</label>
                                                <Select
                                                    aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                                                    value={categoryKey}
                                                    onValueChange={(value) => updateCategory(transaction.id, value)}
                                                >
                                                    <SelectTrigger id={`category-${transaction.id}`} className={`w-full focus-ring ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'income').map(([key, category]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {category.code} - {category.name}
                                                            </SelectItem>
                                                        ))}
                                                        {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'expense').map(([key, category]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {category.code} - {category.name}
                                                            </SelectItem>
                                                        ))}
                                                        {Object.entries(skrCategories).filter(([_, cat]) => cat.type === 'private').map(([key, category]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {category.code} - {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination Controls unten */}
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                            <Button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                                className="focus-ring"
                            >
                                Erste
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                                className="focus-ring"
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
                                        className="focus-ring"
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
                                className="focus-ring"
                            >
                                ›
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                                className="focus-ring"
                            >
                                Letzte
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ELSTER Guidance System */}
            {showGuidance && guidanceData && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <NavigationSidebar
                            sections={guidanceData.sections}
                            currentSection={currentSection}
                            progress={guidanceData.progress}
                            onSectionChange={handleSectionChange}
                            onHelpToggle={handleHelpToggle}
                            helpVisible={helpModal.isOpen}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Card className="animate-fade-in">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold text-foreground">
                                        ELSTER Felder - {guidanceData.sections.find(s => s.id === currentSection)?.title}
                                    </h2>
                                    <Button
                                        onClick={() => setShowGuidance(false)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Zurück zur Übersicht
                                    </Button>
                                </div>

                                <FieldGroups
                                    groups={guidanceData.groups.filter(group => {
                                        if (currentSection === 'personal') return group.category === 'personal';
                                        if (currentSection === 'income') return group.category === 'income';
                                        if (currentSection === 'expenses') return group.category === 'expense';
                                        if (currentSection === 'totals') return group.category === 'total' || group.category === 'tax';
                                        return true;
                                    })}
                                    onFieldClick={handleFieldClick}
                                    onGroupToggle={handleGroupToggle}
                                />

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={() => {
                                            if (validateElsterExport()) {
                                                handleElsterCSVExport();
                                            }
                                        }}
                                        variant="default"
                                        className="flex items-center gap-2"
                                    >
                                        <Download size={20} />
                                        ELSTER CSV Export
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            if (validateElsterExport()) {
                                                handleElsterJSONExport();
                                            }
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <Download size={20} />
                                        ELSTER JSON Export
                                    </Button>

                                    <Button
                                        onClick={downloadElsterOverview}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <Download size={20} />
                                        Legacy Text Export
                                    </Button>

                                    <Button
                                        onClick={generateReportHandler}
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                    >
                                        <Download size={20} />
                                        Detaillierte EÜR exportieren
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Legacy Elster Overview (when not in guidance mode) */}
            {!showGuidance && transactions.length > 0 && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="text-blue-600" aria-hidden="true" />
                                Elster EÜR-Übertragung
                            </h2>
                            <Button
                                onClick={() => setShowGuidance(true)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Target size={16} />
                                Interaktive Navigation
                            </Button>
                        </div>

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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Einnahmen */}
                            <div>
                                <h3 className="text-lg font-medium text-green-600 mb-4">📋 Elster-Einnahmen</h3>
                                <div className="space-y-3">
                                    {Object.entries(elsterSummary)
                                        .filter(([fieldNumber]) => parseInt(fieldNumber) >= ELSTER_FIELD_RANGES.INCOME_START && parseInt(fieldNumber) <= ELSTER_FIELD_RANGES.INCOME_END)
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
                                                        <div key={`${fieldNumber}-${cat.name}-${idx}`}>• {cat.name}: {cat.amount.toFixed(2)} €</div>
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
                                        .filter(([fieldNumber]) => parseInt(fieldNumber) >= ELSTER_FIELD_RANGES.EXPENSE_START && parseInt(fieldNumber) <= ELSTER_FIELD_RANGES.EXPENSE_END)
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
                                                        <div key={`${fieldNumber}-${cat.name}-${idx}`}>• {cat.name}: {cat.amount.toFixed(2)} €</div>
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
                                                .filter(([fieldNumber]) => parseInt(fieldNumber) >= ELSTER_FIELD_RANGES.INCOME_START && parseInt(fieldNumber) <= ELSTER_FIELD_RANGES.INCOME_END)
                                                .reduce((sum, [, fieldData]) => sum + fieldData.amount, 0)
                                                .toFixed(2)} €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Ausgaben gesamt:</div>
                                        <div className="font-bold text-red-600">
                                            {Object.entries(elsterSummary)
                                                .filter(([fieldNumber]) => parseInt(fieldNumber) >= ELSTER_FIELD_RANGES.EXPENSE_START && parseInt(fieldNumber) <= ELSTER_FIELD_RANGES.EXPENSE_END)
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
                                    onClick={() => {
                                        if (validateElsterExport()) {
                                            handleElsterCSVExport();
                                        }
                                    }}
                                    variant="default"
                                    className="flex items-center gap-2"
                                >
                                    <Download size={20} aria-hidden="true" />
                                    ELSTER CSV Export
                                </Button>

                                <Button
                                    onClick={() => {
                                        if (validateElsterExport()) {
                                            handleElsterJSONExport();
                                        }
                                    }}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Download size={20} aria-hidden="true" />
                                    ELSTER JSON Export
                                </Button>

                                <Button
                                    onClick={downloadElsterOverview}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Download size={20} aria-hidden="true" />
                                    Legacy Text Export
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
                    </CardContent>
                </Card>
            )}

            {/* EÜR-Ergebnis */}
            {transactions.length > 0 && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Einnahmen-Überschuss-Rechnung ({currentSkr})</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Einnahmen */}
                            <div>
                                <h3 className="text-lg font-medium text-green-600 mb-3">Betriebseinnahmen</h3>
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {Object.entries(euerCalculation.income).map(([key, amount]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="truncate">{skrCategories[key]?.code} {skrCategories[key]?.name}</span>
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
                                            <span className="truncate">{skrCategories[key]?.code} {skrCategories[key]?.name}</span>
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
                                                    <span>{skrCategories[key]?.name}:</span>
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
                                {currentSkr} EÜR exportieren
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {transactions.length === 0 && (
                <Card className="animate-scale-in">
                    <CardContent className="p-6 text-center">
                        <FileText className="mx-auto text-muted-foreground mb-6" size={80} aria-hidden="true" />
                        <h3 className="text-2xl font-medium text-foreground mb-4">
                            Bereit für Ihre EÜR-Berechnung
                        </h3>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                            Laden Sie Ihre Kontist oder Holvi CSV-Datei hoch, um automatisch kategorisierte Transaktionen zu erhalten und Ihre Einnahmen-Überschuss-Rechnung zu generieren.
                        </p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <div className="font-medium text-foreground mb-2">1. CSV hochladen</div>
                                    <div className="text-muted-foreground">Kontist oder Holvi Export</div>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <div className="font-medium text-foreground mb-2">2. Kategorien prüfen</div>
                                    <div className="text-muted-foreground">Automatische {currentSkr}-Zuordnung</div>
                                </div>
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <div className="font-medium text-foreground mb-2">3. EÜR exportieren</div>
                                    <div className="text-muted-foreground">ELSTER-kompatible Ausgabe</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Field Detail Modal */}
            <FieldDetailModal
                isOpen={fieldDetailModal.isOpen}
                field={fieldDetailModal.field}
                drillDownData={fieldDetailModal.drillDownData}
                onClose={closeFieldDetailModal}
            />

            {/* Help Modal */}
            <HelpModal
                isOpen={helpModal.isOpen}
                section={helpModal.section}
                onClose={closeHelpModal}
            />
        </div>
    );
};

export default EuerGenerator;
