import { useState, useCallback, useMemo, useEffect } from 'react';
import { Upload, FileText, Building, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { getCategoriesForSkr, skr04Categories } from '../utils/categoryMappings';
import { detectBankFormat, parseKontistCSV, parseHolviCSV, categorizeTransaction } from '../utils/transactionUtils';
import { calculateEuer } from '../utils/euerCalculations';
import { PAGINATION } from '../utils/constants';
import { prepareGuidanceData } from '../utils/guidanceUtils';
import { Button } from './ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import NavigationSidebar from './NavigationSidebar';
import FieldGroups from './FieldGroups';
import HelpModal from './HelpModal';
import HelpTooltip from './HelpTooltip';

import type {
    Transaction
} from '../types';

const EuerGenerator = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Record<number, string>>({});
    const [bankType, setBankType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
    const [currentSkr, setCurrentSkr] = useState<'SKR03' | 'SKR04' | 'SKR49'>('SKR04');
    const [skrCategories, setSkrCategories] = useState<Record<string, { code: string; name: string; type: string; vat: number; elsterField?: string }>>(skr04Categories);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [isProcessingFile, setIsProcessingFile] = useState(false);


    const [currentView, setCurrentView] = useState<'transactions' | 'elster'>('transactions');
    const [currentSection, setCurrentSection] = useState('income');
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

    // Alle Daten zurücksetzen und neue Datei hochladen
    const resetAndUploadNew = useCallback(() => {
        const confirmReset = window.confirm(
            'Achtung: Alle aktuellen Transaktionen und manuellen Kategorisierungen gehen verloren.\n\nMöchten Sie wirklich eine neue CSV-Datei hochladen?'
        );
        
        if (confirmReset) {
            setTransactions([]);
            setCategories({});
            setBankType(null);
            setCurrentPage(1);
            // setShowGuidance(false);
            setErrorMessage(null);
            // Reset file input
            const fileInput = document.getElementById('csvUpload') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
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

    // EÜR berechnen mit/ohne USt (used by guidance system for field calculations)
    const euerCalculation = useMemo(() => {
        return calculateEuer(transactions, categories, isKleinunternehmer, skrCategories);
    }, [transactions, categories, isKleinunternehmer, skrCategories]);
    // Reference to prevent TS6133 error - this will be used by guidance system expansion
    void euerCalculation;

    // Elster Übersicht generieren - enhanced with complete field set
    // const elsterSummary = useMemo(() => {
    //     return generateElsterOverview(euerCalculation, isKleinunternehmer);
    // }, [euerCalculation, isKleinunternehmer]);

    // Guidance system data
    const guidanceData = useMemo(() => {
        if (transactions.length === 0) return null;
        return prepareGuidanceData(transactions, categories, isKleinunternehmer);
    }, [transactions, categories, isKleinunternehmer]);


    // Guidance system callbacks
    const handleSectionChange = useCallback((sectionId: string) => {
        setCurrentSection(sectionId);
    }, []);



    const handleHelpToggle = useCallback(() => {
        setHelpModal({ isOpen: !helpModal.isOpen, section: currentSection });
    }, [helpModal.isOpen, currentSection]);


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
            {/* Hero Section */}
            <div className="py-12 animate-fade-in">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                    <div className="flex-1">
                        <h1 className="text-5xl font-bold text-foreground mb-4 text-left">
                            ELSTER EÜR Generator für Kontist und Holvi
                        </h1>
                        <p className="text-muted-foreground text-xl leading-relaxed mb-2 text-left">
                            Automatische Kategorisierung und ELSTER-konforme EÜR-Berechnung
                        </p>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-3xl text-left">
                            Laden Sie Ihre CSV-Exporte von Kontist oder Holvi hoch und erhalten Sie automatisch kategorisierte Transaktionen nach {currentSkr}-Standard. 
                            Das Tool erstellt ELSTER-konforme Übersichten für Ihre Einnahmen-Überschuss-Rechnung und unterstützt sowohl Kleinunternehmer 
                            als auch umsatzsteuerpflichtige Unternehmen.
                        </p>
                    </div>

                    {/* Settings in upper right corner - stacked vertically */}
                    <div className="flex flex-col gap-3 items-end">
                        {/* Kleinunternehmerregelung Setting */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="kleinunternehmer-select" className="text-sm font-medium text-foreground">
                                Kleinunternehmerregelung:
                            </label>
                            <Select value={isKleinunternehmer ? "ja" : "nein"} onValueChange={(value) => setIsKleinunternehmer(value === "ja")}>
                                <SelectTrigger id="kleinunternehmer-select" className="w-16 focus-ring">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nein">Nein</SelectItem>
                                    <SelectItem value="ja">Ja</SelectItem>
                                </SelectContent>
                            </Select>
                            <HelpTooltip
                                title="Kleinunternehmerregelung"
                                content="Bestimmt die Behandlung der Umsatzsteuer in der EÜR-Berechnung."
                                examples={[
                                    "Ja: Bruttobeträge = EÜR-Beträge (keine USt-Trennung)",
                                    "Nein: Nettobeträge für EÜR, USt separat für Voranmeldung",
                                    "Beispiel 119€: Kleinunternehmer → 119€ EÜR | Normal → 100€ EÜR + 19€ USt"
                                ]}
                                position="bottom"
                            />
                        </div>

                        {/* Kontenrahmen Setting */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="skr-select" className="text-sm font-medium text-foreground">
                                Kontenrahmen:
                            </label>
                            <Select value={currentSkr} onValueChange={(value: 'SKR03' | 'SKR04' | 'SKR49') => setCurrentSkr(value)}>
                                <SelectTrigger id="skr-select" className="w-20 focus-ring">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SKR03">SKR03</SelectItem>
                                    <SelectItem value="SKR04">SKR04</SelectItem>
                                    <SelectItem value="SKR49">SKR49</SelectItem>
                                </SelectContent>
                            </Select>
                            <HelpTooltip
                                title="Kontenrahmen (SKR)"
                                content="Bestimmt die verwendeten Kontenkategorien für die EÜR-Kategorisierung."
                                examples={[
                                    "SKR03: Industrie und Handel",
                                    "SKR04: Dienstleistungen (Standard)",
                                    "SKR49: Freiberufler und Selbständige"
                                ]}
                                position="bottom"
                            />
                        </div>
                    </div>
                </div>
            </div>



            {/* File Upload - nur anzeigen wenn keine Transaktionen geladen sind */}
            {transactions.length === 0 && (
                <Card className="animate-fade-in">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                            <Upload className="text-primary" size={24} aria-hidden="true" />
                            CSV-Datei hochladen
                        </h2>
                        
                        {/* 3-Schritt Anleitung */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Upload className="text-primary" size={16} />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-2">1. CSV-Datei hochladen</h3>
                                <p className="text-muted-foreground text-sm">
                                    Exportieren Sie Ihre Transaktionen aus Kontist oder Holvi als CSV-Datei und laden Sie diese hier hoch.
                                </p>
                            </div>
                            <div className="text-center p-4 bg-info/5 rounded-lg border border-info/20">
                                <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileText className="text-info" size={16} />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-2">2. Kategorien überprüfen</h3>
                                <p className="text-muted-foreground text-sm">
                                    Prüfen und korrigieren Sie die automatische {currentSkr}-Kategorisierung Ihrer Transaktionen.
                                </p>
                            </div>
                            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Building className="text-success" size={16} />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-2">3. ELSTER-Export</h3>
                                <p className="text-muted-foreground text-sm">
                                    Nutzen Sie die ELSTER-Übersicht für eine einfache Übertragung in Ihre Steuererklärung.
                                </p>
                            </div>
                        </div>
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
            )}

            {/* Main Content with Segmented Control */}
            {transactions.length > 0 && (
                <div className="animate-fade-in">
                    {/* Segmented Control */}
                    <div className="flex justify-center mb-6">
                        <div className="flex p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => setCurrentView('transactions')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    currentView === 'transactions'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                1. Transaktionen
                            </button>
                            <button
                                onClick={() => setCurrentView('elster')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    currentView === 'elster'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                2. Elsterfelder
                            </button>
                        </div>
                    </div>

            {/* Transaktionsübersicht mit Pagination */}
            {currentView === 'transactions' && (
                <Card className="animate-fade-in">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                                <FileText className="text-primary" size={24} aria-hidden="true" />
                                Transaktionen kategorisieren
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-3 py-1 bg-success/10 rounded-full border border-success/20">
                                    <Building className="text-success" size={16} aria-hidden="true" />
                                    <span className="text-sm text-success font-medium">
                                        {bankType === 'kontist' ? 'Kontist' : 'Holvi'} CSV erkannt - {transactions.length} Transaktionen
                                    </span>
                                </div>
                                <Button
                                    onClick={resetAndUploadNew}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground focus-ring"
                                    title="Neue CSV-Datei hochladen (aktueller Fortschritt geht verloren)"
                                >
                                    <RotateCcw size={16} aria-hidden="true" />
                                    Neue Datei
                                </Button>
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
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full min-w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="text-left p-3 font-semibold text-foreground w-24">Datum</th>
                                        <th className="text-left p-3 font-semibold text-foreground w-1/5 min-w-32">Gegenpartei</th>
                                        <th className="text-right p-3 font-semibold text-foreground w-20">Betrag</th>
                                        <th className="text-left p-3 font-semibold text-foreground w-1/4 min-w-40">Verwendungszweck</th>
                                        <th className="text-left p-3 font-semibold text-foreground w-1/3 min-w-48">{currentSkr}-Konto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction) => {
                                        const categoryKey = categories[transaction.id] || transaction.euerCategory || '';
                                        const category = skrCategories[categoryKey];
                                        const isPrivate = category?.type === 'private';

                                        return (
                                            <tr key={transaction.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${isPrivate ? 'bg-private/5' : ''}`}>
                                                <td className="p-3 text-foreground text-xs whitespace-nowrap text-left">{transaction.dateField}</td>
                                                <td className="p-3 text-foreground truncate max-w-0 text-left" title={transaction.counterpartyField}>
                                                    <div className="truncate">{transaction.counterpartyField}</div>
                                                </td>
                                                <td className={`p-3 font-semibold whitespace-nowrap text-right ${transaction.BetragNumeric > 0 ? 'text-income' :
                                                    isPrivate ? 'text-private' : 'text-expense'
                                                    }`}>
                                                    {transaction.BetragNumeric.toFixed(2)}€
                                                </td>
                                                <td className="p-3 text-muted-foreground truncate max-w-0 text-left" title={transaction.purposeField}>
                                                    <div className="truncate text-xs">{transaction.purposeField}</div>
                                                </td>
                                                <td className="p-3 text-left">
                                                    <Select
                                                        aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                                                        value={categoryKey}
                                                        onValueChange={(value) => updateCategory(transaction.id, value)}
                                                    >
                                                        <SelectTrigger className={`w-full min-w-0 focus-ring data-[state=open]:ring-2 data-[state=open]:ring-ring text-xs ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60 overflow-y-auto">
                                                            {transaction.BetragNumeric > 0 ? (
                                                                // Für Einnahmen: nur Einnahme-Konten anzeigen
                                                                Object.entries(skrCategories).filter(([, cat]) => cat.type === 'income').map(([key, category]) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {category.code} - {category.name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                // Für Ausgaben: Ausgabe- und Privat-Konten anzeigen
                                                                <>
                                                                    {Object.entries(skrCategories).filter(([, cat]) => cat.type === 'expense').map(([key, category]) => (
                                                                        <SelectItem key={key} value={key}>
                                                                            {category.code} - {category.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                    {Object.entries(skrCategories).filter(([, cat]) => cat.type === 'private').map(([key, category]) => (
                                                                        <SelectItem key={key} value={key}>
                                                                            {category.code} - {category.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </>
                                                            )}
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
                                                    <SelectTrigger id={`category-${transaction.id}`} className={`w-full focus-ring data-[state=open]:ring-2 data-[state=open]:ring-ring ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-60 overflow-y-auto">
                                                        {transaction.BetragNumeric > 0 ? (
                                                            // Für Einnahmen: nur Einnahme-Konten anzeigen
                                                            Object.entries(skrCategories).filter(([, cat]) => cat.type === 'income').map(([key, category]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {category.code} - {category.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            // Für Ausgaben: Ausgabe- und Privat-Konten anzeigen
                                                            <>
                                                                {Object.entries(skrCategories).filter(([, cat]) => cat.type === 'expense').map(([key, category]) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {category.code} - {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                                {Object.entries(skrCategories).filter(([, cat]) => cat.type === 'private').map(([key, category]) => (
                                                                    <SelectItem key={key} value={key}>
                                                                        {category.code} - {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </>
                                                        )}
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((pageNum) => {
                                    // Show first page, last page, current page, and pages around current
                                    if (totalPages <= 5) return true;
                                    if (pageNum === 1 || pageNum === totalPages) return true;
                                    return Math.abs(pageNum - currentPage) <= 1;
                                })
                                .map((pageNum, index, visiblePages) => {
                                    // Add ellipsis where needed
                                    const prevPage = visiblePages[index - 1];
                                    const showEllipsis = prevPage && pageNum - prevPage > 1;
                                    
                                    return (
                                        <div key={pageNum} className="flex items-center">
                                            {showEllipsis && (
                                                <span className="px-2 text-muted-foreground">...</span>
                                            )}
                                            <Button
                                                onClick={() => setCurrentPage(pageNum)}
                                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                className="focus-ring"
                                            >
                                                {pageNum}
                                            </Button>
                                        </div>
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
            {currentView === 'elster' && guidanceData && (
                <Card className="animate-fade-in">
                    <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                            {/* Navigation Sidebar */}
                            <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-muted/30">
                                <div className="p-6">
                                    <NavigationSidebar
                                        sections={guidanceData.sections}
                                        currentSection={currentSection}
                                        onSectionChange={handleSectionChange}
                                        onHelpToggle={handleHelpToggle}
                                        helpVisible={helpModal.isOpen}
                                    />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-h-[600px]">
                                <div className="p-6">
                                    <FieldGroups
                                        groups={guidanceData.groups.filter(group => {
                                            if (currentSection === 'income') return group.category === 'income';
                                            if (currentSection === 'expenses') return group.category === 'expense';
                                            if (currentSection === 'totals') return group.category === 'total' || group.category === 'tax';
                                            return true;
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
                </div>
            )}


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
