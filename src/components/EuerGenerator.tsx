import { useState, useCallback, useMemo, useEffect } from 'react';
import { Upload, FileText, Building, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, X, Cpu, ShieldOff, Database, Github, Calculator, Sheet } from 'lucide-react';
import { getCategoriesForSkr, skr04Categories } from '../utils/categoryMappings';
import { detectBankFormat, parseKontistCSV, parseHolviCSV, categorizeTransaction } from '../utils/transactionUtils';
import { calculateEuer } from '../utils/euerCalculations';
import { PAGINATION } from '../utils/constants';
import { prepareGuidanceData } from '../utils/guidanceUtils';
import { loadDemoData } from '../utils/demoUtils';
import TransactionRow from './TransactionRow';
import TransactionRowMobile from './TransactionRowMobile';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import NavigationSidebar from './NavigationSidebar';
import FieldGroups from './FieldGroups';
import SettingsBar from './SettingsBar';
import HelpTooltip from './HelpTooltip';
import Impressum from './Impressum';
import Datenschutz from './Datenschutz';
import FAQ from './FAQ';

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
    const [isDemoMode, setIsDemoMode] = useState(false);

    const [currentView, setCurrentView] = useState<'transactions' | 'elster' | 'impressum' | 'datenschutz'>('transactions');
    const [currentSection, setCurrentSection] = useState('income');

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
            // Validate file type
            if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
                throw new Error('Ungültiger Dateityp. Bitte laden Sie eine CSV-Datei (.csv) hoch.');
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                throw new Error('Datei ist zu groß. Maximale Dateigröße: 10MB.');
            }

            // Validate file is not empty
            if (file.size === 0) {
                throw new Error('Die hochgeladene Datei ist leer. Bitte wählen Sie eine gültige CSV-Datei.');
            }

            let text: string;
            try {
                text = await file.text();
            } catch {
                throw new Error('Fehler beim Lesen der Datei. Die Datei könnte beschädigt sein.');
            }

            // Validate file content is not empty
            if (text.trim().length === 0) {
                throw new Error('Die CSV-Datei ist leer oder enthält keine gültigen Daten.');
            }

            // Validate CSV structure (basic check for commas/semicolons)
            const lines = text.split('\n').filter(line => line.trim().length > 0);
            if (lines.length < 2) {
                throw new Error('Die CSV-Datei enthält zu wenig Daten. Mindestens eine Kopfzeile und eine Datenzeile sind erforderlich.');
            }

            const detectedBankType = detectBankFormat(text);
            setBankType(detectedBankType);

            let parsedTransactions: Transaction[];

            if (detectedBankType === 'kontist') {
                parsedTransactions = parseKontistCSV(text);
            } else if (detectedBankType === 'holvi') {
                parsedTransactions = parseHolviCSV(text);
            } else {
                throw new Error('Unbekanntes CSV-Format. Unterstützt werden nur Kontist und Holvi Exporte. Bitte stellen Sie sicher, dass Sie die CSV-Datei direkt aus Ihrem Banking-Portal exportiert haben.');
            }

            // Validate that transactions were successfully parsed
            if (!parsedTransactions || parsedTransactions.length === 0) {
                throw new Error('Keine Transaktionen in der CSV-Datei gefunden. Bitte überprüfen Sie, ob die Datei Transaktionsdaten enthält.');
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
            let errorMsg = 'Unbekannter Fehler beim Verarbeiten der Datei.';

            if (error instanceof Error) {
                errorMsg = error.message;
            } else if (typeof error === 'string') {
                errorMsg = error;
            }

            setErrorMessage(errorMsg);
        } finally {
            setIsProcessingFile(false);
            // Reset file input to allow re-uploading the same file
            event.target.value = '';
        }
    }, []);

    // Demo-Daten laden
    const handleDemoLoad = useCallback(() => {
        setIsProcessingFile(true);
        setErrorMessage(null);

        try {
            // Load demo transactions
            const demoTransactions = loadDemoData();

            // Set bank type to kontist for demo
            setBankType('kontist');

            // Categorize all demo transactions
            demoTransactions.forEach(t => {
                t.euerCategory = categorizeTransaction(t);
            });

            setTransactions(demoTransactions);

            // Set auto-categories
            const autoCategories: Record<number, string> = {};
            demoTransactions.forEach(t => {
                autoCategories[t.id] = t.euerCategory || '';
            });
            setCategories(autoCategories);
            setCurrentPage(1);
            setIsDemoMode(true);

        } catch (error) {
            let errorMsg = 'Fehler beim Laden der Demo-Daten.';
            if (error instanceof Error) {
                errorMsg = error.message;
            }
            setErrorMessage(errorMsg);
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
            setIsDemoMode(false);
            // setShowGuidance(false);
            setErrorMessage(null);
            // Reset file input
            const fileInput = document.getElementById('csvUpload') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }, []);

    // Memoized category lists for performance
    const incomeCategories = useMemo(() =>
        Object.entries(skrCategories)
            .filter(([, cat]) => cat.type === 'income')
            .sort((a, b) => a[1].name.localeCompare(b[1].name)),
        [skrCategories]
    );

    const expenseCategories = useMemo(() =>
        Object.entries(skrCategories)
            .filter(([, cat]) => cat.type === 'expense' || cat.type === 'private')
            .sort((a, b) => a[1].name.localeCompare(b[1].name)),
        [skrCategories]
    );

    // Memoized current transactions
    const currentTransactions = useMemo(() => {
        const start = (currentPage - 1) * PAGINATION.TRANSACTIONS_PER_PAGE;
        const end = start + PAGINATION.TRANSACTIONS_PER_PAGE;
        return transactions.slice(start, end);
    }, [transactions, currentPage]);

    // Optimized callback to prevent unnecessary re-renders
    const updateCategory = useCallback((transactionId: number, categoryKey: string) => {
        setCategories(prev => ({
            ...prev,
            [transactionId]: categoryKey
        }));
    }, []);

    // Pagination-Berechnungen
    const indexOfLastTransaction = currentPage * PAGINATION.TRANSACTIONS_PER_PAGE;
    const indexOfFirstTransaction = indexOfLastTransaction - PAGINATION.TRANSACTIONS_PER_PAGE;
    const totalPages = Math.ceil(transactions.length / PAGINATION.TRANSACTIONS_PER_PAGE);

    // EÜR berechnen mit/ohne USt (used by guidance system for field calculations)
    const euerCalculation = useMemo(() => {
        return calculateEuer(transactions, categories, isKleinunternehmer, skrCategories);
    }, [transactions, categories, isKleinunternehmer, skrCategories]);

    // Elster Übersicht generieren - enhanced with complete field set
    // const elsterSummary = useMemo(() => {
    //     return generateElsterOverview(euerCalculation, isKleinunternehmer);
    // }, [euerCalculation, isKleinunternehmer]);

    // Guidance system data - use pre-computed euerCalculation
    const guidanceData = useMemo(() => {
        if (transactions.length === 0) return null;
        return prepareGuidanceData(transactions, categories, isKleinunternehmer, euerCalculation);
    }, [transactions, categories, isKleinunternehmer, euerCalculation]);


    // Guidance system callbacks
    const handleSectionChange = useCallback((sectionId: string) => {
        setCurrentSection(sectionId);
    }, []);





    // Show Impressum or Datenschutz if selected
    if (currentView === 'impressum') {
        return <Impressum onBack={() => {
            setCurrentView('transactions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />;
    }

    if (currentView === 'datenschutz') {
        return <Datenschutz onBack={() => {
            setCurrentView('transactions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />;
    }

    return (
        <div className="space-y-6">
            {/* Enhanced Error Display */}
            {errorMessage && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-5 animate-fade-in">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                        <div className="flex-1 space-y-3">
                            <div className="font-semibold text-destructive">
                                Fehler beim Verarbeiten der Datei
                            </div>
                            <div className="text-destructive/90 text-sm leading-relaxed">
                                {errorMessage}
                            </div>

                            {/* Help section for common issues */}
                            <div className="bg-background/50 border border-border/30 rounded-md p-3">
                                <div className="text-xs text-foreground/70 mb-2">
                                    Häufige Lösungsansätze:
                                </div>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>• Stellen Sie sicher, dass die Datei eine .csv-Datei ist</li>
                                    <li>• Exportieren Sie die CSV direkt aus Kontist oder Holvi</li>
                                    <li>• Überprüfen Sie, ob die Datei Transaktionsdaten enthält</li>
                                    <li>• Maximale Dateigröße: 10MB</li>
                                </ul>
                            </div>
                        </div>
                        <Button
                            onClick={() => setErrorMessage(null)}
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0 focus-ring h-8 w-8 p-0"
                            aria-label="Fehlermeldung schließen"
                        >
                            <X size={14} />
                        </Button>
                    </div>
                </div>
            )}
            {/* Hero Section */}
            <div className="py-12 animate-fade-in">
                <div className="flex-1">
                    <h1 className="text-5xl text-foreground mb-4 text-left leading-tight">
                        ELSTER EÜR Generator für{' '}
                        <a
                            href="https://kontist.com/r/torsten7HU"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white p-2 rounded-lg transform rotate-[-2deg] translate-y-2 transition-all duration-300 hover:rotate-[-0.5deg] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm hover:shadow-md cursor-pointer"
                            aria-label="Kontist Website besuchen"
                        >
                            <img
                                src="/assets/logos/kontist-wordmark.svg"
                                alt="Kontist Logo"
                                loading="lazy"
                                className="h-6 md:h-8 w-auto"
                            />
                        </a>{' '}
                        und{' '}
                        <a
                            href="https://holvi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white p-2 rounded-lg transform rotate-[3deg] translate-y-2 transition-all duration-300 hover:rotate-[1deg] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm hover:shadow-md cursor-pointer"
                            aria-label="Holvi Website besuchen"
                        >
                            <img
                                src="/assets/logos/holvi-wordmark.svg"
                                alt="Holvi Logo"
                                loading="lazy"
                                className="h-6 md:h-8 w-auto"
                            />
                        </a>
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-2 text-left">
                        Automatische Kategorisierung und ELSTER-konforme EÜR-Berechnung
                    </p>
                    <p className="text-muted-foreground leading-relaxed max-w-3xl text-left">
                        Laden Sie Ihre CSV-Exporte von Kontist oder Holvi hoch und erhalten Sie automatisch kategorisierte Transaktionen nach {currentSkr}-Standard.
                        Das Tool erstellt ELSTER-konforme Übersichten für Ihre Einnahmen-Überschuss-Rechnung und unterstützt sowohl Kleinunternehmer
                        als auch umsatzsteuerpflichtige Unternehmen.
                    </p>
                </div>
            </div>

            {/* Settings Bar - nur anzeigen wenn keine Transaktionen geladen sind */}
            {transactions.length === 0 && (
                <SettingsBar
                    isKleinunternehmer={isKleinunternehmer}
                    onKleinunternehmerChange={setIsKleinunternehmer}
                    currentSkr={currentSkr}
                    onSkrChange={setCurrentSkr}
                />
            )}

            {/* File Upload - nur anzeigen wenn keine Transaktionen geladen sind */}
            {transactions.length === 0 && (
                <Card className="animate-fade-in">
                    <CardContent className="p-6">
                        {/* 3-Schritt Anleitung */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                    <Upload size={32} aria-hidden="true" />
                                </div>
                                <h3 className="text-foreground mb-2">1. CSV-Datei hochladen</h3>
                                <p className="text-muted-foreground text-sm">
                                    Exportieren Sie Ihre Transaktionen aus Kontist oder Holvi als CSV-Datei und laden Sie diese hier hoch.
                                </p>
                            </div>
                            <div className="text-center p-4 bg-muted/20 rounded-lg border border-muted-foreground/25">
                                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                    <FileText size={32} aria-hidden="true" />
                                </div>
                                <h3 className="text-foreground mb-2">2. Kategorien überprüfen</h3>
                                <p className="text-muted-foreground text-sm">
                                    Prüfen und korrigieren Sie die automatische {currentSkr}-Kategorisierung Ihrer Transaktionen.
                                </p>
                            </div>
                            <div className="text-center p-4 bg-muted/20 rounded-lg border border-muted-foreground/25">
                                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                    <Building size={32} aria-hidden="true" />
                                </div>
                                <h3 className="text-foreground mb-2">3. ELSTER-Export</h3>
                                <p className="text-muted-foreground text-sm">
                                    Nutzen Sie die ELSTER-Übersicht für eine einfache Übertragung in Ihre Steuererklärung.
                                </p>
                            </div>
                        </div>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                            {isProcessingFile ? (
                                <>
                                    <div className="mx-auto mb-4 w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    <h3 className="text-lg text-foreground mb-2">
                                        CSV-Datei wird verarbeitet...
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Transaktionen werden analysiert und kategorisiert.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload className="mx-auto text-primary mb-4" size={32} aria-hidden="true" />
                                    <h3 className="text-foreground mb-2">
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
                                    <div id="file-upload-description" className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
                                        <span>Unterstützt: Kontist</span>
                                        <HelpTooltip
                                            title="Kontist CSV-Export erstellen"
                                            content="So erstellen Sie einen CSV-Export in Kontist:"
                                            examples={[
                                                "Öffnen Sie das Kontist Online Banking oder die mobile App",
                                                "Klicken Sie auf den Download-Bereich im Online Banking oder gehen Sie in der App zu Profil (oben links) > Downloads",
                                                "Wählen Sie 'CSV-Export' aus den verfügbaren Dokumenten",
                                                "Laden Sie die CSV-Datei mit all Ihren Transaktionen herunter",
                                                "Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung"
                                            ]}
                                            position="top"
                                        />
                                        <span>und Holvi</span>
                                        <HelpTooltip
                                            title="Holvi CSV-Export erstellen"
                                            content="So erstellen Sie einen CSV-Export in Holvi:"
                                            examples={[
                                                "Öffnen Sie das Holvi Online Banking oder die mobile App",
                                                "Navigieren Sie zum Menüpunkt 'Transaktionen' oder 'Kontobewegungen'",
                                                "Wählen Sie den gewünschten Zeitraum für den Export",
                                                "Klicken Sie auf 'Exportieren' oder 'CSV herunterladen'",
                                                "Laden Sie die CSV-Datei mit Ihren Transaktionen herunter",
                                                "Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung"
                                            ]}
                                            position="top"
                                        />
                                        <span>CSV-Formate</span>
                                    </div>

                                    {/* Demo-Link */}
                                    <div className="mt-4 pt-3 border-t border-border/30">
                                        <button
                                            onClick={handleDemoLoad}
                                            disabled={isProcessingFile}
                                            className="text-sm text-muted-foreground hover:text-foreground underline cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Keine CSV-Datei? Demo-Daten laden
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Privacy Information - only show when no transactions loaded */}
            {transactions.length === 0 && (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                <Cpu size={32} aria-hidden="true" />
                            </div>
                            <h3 className="text-foreground mb-2 font-medium">
                                Lokale Verarbeitung
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Alle Berechnungen erfolgen in Ihrem Browser
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                <ShieldOff size={32} aria-hidden="true" />
                            </div>
                            <h3 className="text-foreground mb-2 font-medium">
                                Keine Datenübertragung
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                CSV-Inhalte verlassen nie Ihren Computer
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                <Database size={32} aria-hidden="true" />
                            </div>
                            <h3 className="text-foreground mb-2 font-medium">
                                Keine Speicherung
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Daten werden nicht dauerhaft gespeichert
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
                                <Github size={32} aria-hidden="true" />
                            </div>
                            <h3 className="text-foreground mb-2 font-medium">
                                Open Source
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Der gesamte Code ist transparent einsehbar
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content with Segmented Control */}
            {transactions.length > 0 && (
                <div className="animate-fade-in">
                    {/* Segmented Control */}
                    <div className="flex justify-center mb-6">
                        <div className="flex p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => setCurrentView('transactions')}
                                className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${currentView === 'transactions'
                                    ? 'bg-background text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Sheet size={16} />
                                Transaktionen
                            </button>
                            <button
                                onClick={() => setCurrentView('elster')}
                                className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${currentView === 'elster'
                                    ? 'bg-background text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Calculator size={16} />
                                Elsterfelder
                            </button>
                        </div>
                    </div>

                    {/* Transaktionsübersicht mit Pagination */}
                    {currentView === 'transactions' && (
                        <Card className="animate-fade-in">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
                                    <h2 className="text-2xl text-foreground flex items-center gap-2">
                                        Transaktionen kategorisieren
                                    </h2>

                                    <div className="flex-1 flex justify-center gap-2">
                                        <div className="px-4 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                                            <span className="text-xs font-medium">
                                                {bankType === 'kontist' ? 'Kontist' : 'Holvi'} CSV erkannt
                                            </span>
                                        </div>
                                        {isDemoMode && (
                                            <div className="px-4 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-200">
                                                <span className="text-xs font-medium">
                                                    Demo-Modus
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* SKR/Kleinunternehmer badge matching demo/CSV style */}
                                    <div className="hidden lg:flex items-center gap-2">
                                        <div className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                                            <span className="text-xs font-medium">
                                                {currentSkr} · {isKleinunternehmer ? 'Kleinunternehmer' : 'USt-pflichtig'}
                                            </span>
                                        </div>
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
                                        <div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">
                                            {currentPage} / {totalPages}
                                        </div>
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
                                                <th className="text-left p-3 text-muted-foreground font-normal w-24">Datum</th>
                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/5 min-w-32">Gegenpartei</th>
                                                <th className="text-right p-3 text-muted-foreground font-normal w-20">Betrag</th>
                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/4 min-w-40">Verwendungszweck</th>
                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/3 min-w-48">{currentSkr}-Konto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTransactions.map((transaction) => {
                                                const categoryKey = categories[transaction.id] || transaction.euerCategory || '';

                                                return (
                                                    <TransactionRow
                                                        key={transaction.id}
                                                        transaction={transaction}
                                                        categoryKey={categoryKey}
                                                        skrCategories={skrCategories}
                                                        incomeCategories={incomeCategories}
                                                        expenseCategories={expenseCategories}
                                                        currentSkr={currentSkr}
                                                        onCategoryChange={updateCategory}
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
                                            const categoryKey = categories[transaction.id] || transaction.euerCategory || '';

                                            return (
                                                <TransactionRowMobile
                                                    key={transaction.id}
                                                    transaction={transaction}
                                                    categoryKey={categoryKey}
                                                    skrCategories={skrCategories}
                                                    incomeCategories={incomeCategories}
                                                    expenseCategories={expenseCategories}
                                                    currentSkr={currentSkr}
                                                    onCategoryChange={updateCategory}
                                                />
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Pagination Controls unten */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8">
                                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                                        Zeige {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, transactions.length)} von {transactions.length}
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
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
                                        <div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">
                                            {currentPage} / {totalPages}
                                        </div>
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
                                    <Button
                                        onClick={() => {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            setTimeout(() => setCurrentView('elster'), 300);
                                        }}
                                        variant="default"
                                        size="sm"
                                        className="flex items-center gap-2 focus-ring"
                                    >
                                        <ChevronLeft size={16} className="rotate-90" aria-hidden="true" />
                                        Zu den Elsterfeldern
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
                                        <div className="p-6 h-full flex flex-col">
                                            <NavigationSidebar
                                                sections={guidanceData.sections}
                                                currentSection={currentSection}
                                                onSectionChange={handleSectionChange}
                                                currentSkr={currentSkr}
                                                isKleinunternehmer={isKleinunternehmer}
                                                euerCalculation={euerCalculation}
                                            />
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 min-h-[600px]">
                                        <div className="p-6 space-y-6">

                                            <FieldGroups
                                                groups={guidanceData.groups.filter(group => {
                                                    if (currentSection === 'income') return group.category === 'income';
                                                    if (currentSection === 'expenses') return group.category === 'expense';
                                                    if (currentSection === 'profit') return group.category === 'total' || group.category === 'tax';
                                                    return group.category === 'income';
                                                })}
                                                isKleinunternehmer={isKleinunternehmer}
                                                categories={categories}
                                                skrCategories={skrCategories}
                                                currentSkr={currentSkr}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* FAQ Section */}
            <FAQ />

            {/* Footer with Legal Links */}
            <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setCurrentView('impressum');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"
                        >
                            Impressum
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView('datenschutz');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"
                        >
                            Datenschutz
                        </button>
                    </div>
                    <a
                        href="https://github.com/torstendngh/kontist-eur-report-generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1"
                    >
                        <Github size={14} />
                        GitHub
                    </a>
                    <span className="text-xs">
                        © {new Date().getFullYear()} Torsten Linnecke
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default EuerGenerator;

                                <ShieldOff size={32} aria-hidden="true" />

                            </div>

                            <h3 className="text-foreground mb-2 font-medium">

                                Keine Datenübertragung

                            </h3>

                            <p className="text-muted-foreground text-sm">

                                CSV-Inhalte verlassen nie Ihren Computer

                            </p>

                        </div>



                        <div className="text-center p-6">

                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">

                                <Database size={32} aria-hidden="true" />

                            </div>

                            <h3 className="text-foreground mb-2 font-medium">

                                Keine Speicherung

                            </h3>

                            <p className="text-muted-foreground text-sm">

                                Daten werden nicht dauerhaft gespeichert

                            </p>

                        </div>



                        <div className="text-center p-6">

                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">

                                <Github size={32} aria-hidden="true" />

                            </div>

                            <h3 className="text-foreground mb-2 font-medium">

                                Open Source

                            </h3>

                            <p className="text-muted-foreground text-sm">

                                Der gesamte Code ist transparent einsehbar

                            </p>

                        </div>

                    </div>

                </div>

            )}



            {/* Main Content with Segmented Control */}

            {transactions.length > 0 && (

                <div className="animate-fade-in">

                    {/* Segmented Control */}

                    <div className="flex justify-center mb-6">

                        <div className="flex p-1 bg-muted rounded-lg">

                            <button

                                onClick={() => setCurrentView('transactions')}

                                className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${currentView === 'transactions'

                                    ? 'bg-background text-foreground'

                                    : 'text-muted-foreground hover:text-foreground'

                                    }`}

                            >

                                <Sheet size={16} />

                                Transaktionen

                            </button>

                            <button

                                onClick={() => setCurrentView('elster')}

                                className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${currentView === 'elster'

                                    ? 'bg-background text-foreground'

                                    : 'text-muted-foreground hover:text-foreground'

                                    }`}

                            >

                                <Calculator size={16} />

                                Elsterfelder

                            </button>

                        </div>

                    </div>



                    {/* Transaktionsübersicht mit Pagination */}

                    {currentView === 'transactions' && (

                        <Card className="animate-fade-in">

                            <CardContent className="p-6">

                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">

                                    <h2 className="text-2xl text-foreground flex items-center gap-2">

                                        Transaktionen kategorisieren

                                    </h2>



                                    <div className="flex-1 flex justify-center">
                                        <div className="px-4 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">

                                            <span className="text-sm font-medium">

                                                {bankType === 'kontist' ? 'Kontist' : 'Holvi'} CSV erkannt

                                            </span>

                                        </div>

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

                                        <div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">

                                            {currentPage} / {totalPages}

                                        </div>

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

                                                <th className="text-left p-3 text-muted-foreground font-normal w-24">Datum</th>

                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/5 min-w-32">Gegenpartei</th>

                                                <th className="text-right p-3 text-muted-foreground font-normal w-20">Betrag</th>

                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/4 min-w-40">Verwendungszweck</th>

                                                <th className="text-left p-3 text-muted-foreground font-normal w-1/3 min-w-48">{currentSkr}-Konto</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {currentTransactions.map((transaction) => {

                                                const categoryKey = categories[transaction.id] || transaction.euerCategory || '';

                                                const category = skrCategories[categoryKey];
                                                const isPrivate = category?.type === 'private';


                                                return (

                                                    <tr key={transaction.id} className={`border-b border-border ${isPrivate ? 'bg-private/5' : ''}`}>
                                                        <td className="p-3 text-foreground text-sm whitespace-nowrap text-left font-mono text-center">
                                                            {(() => {
                                                                try {
                                                                    const date = new Date(transaction.dateField);
                                                                    const day = date.getDate().toString().padStart(2, '0');
                                                                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                                                    const year = date.getFullYear();
                                                                    return `${day}.${month}.${year}`;
                                                                } catch {
                                                                    return transaction.dateField;
                                                                }
                                                            })()}
                                                        </td>
                                                        <td className="p-3 text-foreground truncate max-w-0 text-left" title={transaction.counterpartyField}>
                                                            <div className="truncate text-sm">{transaction.counterpartyField}</div>
                                                        </td>
                                                        <td className={`p-3 whitespace-nowrap text-right text-sm font-mono ${transaction.BetragNumeric > 0 ? 'text-income' :
                                                            isPrivate ? 'text-private' : 'text-expense'
                                                            }`}>
                                                            {transaction.BetragNumeric.toLocaleString('de-DE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })} €
                                                        </td>
                                                        <td className="p-3 text-muted-foreground truncate max-w-0 text-left" title={transaction.purposeField}>
                                                            <div className="truncate text-sm">{transaction.purposeField}</div>
                                                        </td>
                                                        <td className="p-3 text-left">
                                                            <Select
                                                                aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                                                                value={categoryKey}
                                                                onValueChange={(value) => updateCategory(transaction.id, value)}
                                                            >
                                                                <SelectTrigger className={`w-full min-w-0 focus-ring data-[state=open]:ring-2 data-[state=open]:ring-ring text-sm cursor-pointer hover:cursor-pointer ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
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



                                {/* Mobile List View */}

                                <div className="sm:hidden">

                                    <ul className="divide-y divide-border">

                                        {currentTransactions.map((transaction) => {

                                            const categoryKey = categories[transaction.id] || transaction.euerCategory || '';

                                            const category = skrCategories[categoryKey];
                                            const isPrivate = category?.type === 'private';


                                            return (

                                                <li key={transaction.id} className={`animate-fade-in py-4 px-2 ${isPrivate ? 'bg-private/5' : ''}`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <div className="text-sm text-muted-foreground mb-1 font-mono">
                                                                {(() => {
                                                                    try {
                                                                        const date = new Date(transaction.dateField);
                                                                        const day = date.getDate().toString().padStart(2, '0');
                                                                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                                                        const year = date.getFullYear();
                                                                        return `${day}.${month}.${year}`;
                                                                    } catch {
                                                                        return transaction.dateField;
                                                                    }
                                                                })()}
                                                            </div>
                                                            <div className="text-foreground truncate" title={transaction.counterpartyField}>
                                                                {transaction.counterpartyField}
                                                            </div>
                                                        </div>
                                                        <div className={`text-lg font-mono ${transaction.BetragNumeric > 0 ? 'text-income' :
                                                            isPrivate ? 'text-private' : 'text-expense'
                                                            }`}>
                                                            {transaction.BetragNumeric.toLocaleString('de-DE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })} €
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-muted-foreground mb-3 line-clamp-2" title={transaction.purposeField}>
                                                        {transaction.purposeField}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm text-foreground" htmlFor={`category-${transaction.id}`}>{currentSkr}-Konto:</label>
                                                        <Select
                                                            aria-label={`${currentSkr}-Konto für Transaktion ${transaction.id} auswählen`}
                                                            value={categoryKey}
                                                            onValueChange={(value) => updateCategory(transaction.id, value)}
                                                        >
                                                            <SelectTrigger id={`category-${transaction.id}`} className={`w-full focus-ring data-[state=open]:ring-2 data-[state=open]:ring-ring cursor-pointer hover:cursor-pointer ${isPrivate ? 'border-private/30 bg-private/5' : ''}`}>
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
                                                </li>
                                            );

                                        })}

                                    </ul>

                                </div>



                                {/* Pagination Controls unten */}

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8">

                                    <div className="text-sm text-muted-foreground text-center sm:text-left">

                                        Zeige {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, transactions.length)} von {transactions.length}

                                    </div>

                                    <div className="flex items-center gap-2 justify-center">

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

                                        <div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">

                                            {currentPage} / {totalPages}

                                        </div>

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

                                    <Button

                                        onClick={() => {

                                            window.scrollTo({ top: 0, behavior: 'smooth' });

                                            setTimeout(() => setCurrentView('elster'), 300);

                                        }}

                                        variant="default"

                                        size="sm"

                                        className="flex items-center gap-2 focus-ring"

                                    >

                                        <ChevronLeft size={16} className="rotate-90" aria-hidden="true" />

                                        Zu den Elsterfeldern

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

                                        <div className="p-6 h-full flex flex-col">

                                            <NavigationSidebar

                                                sections={guidanceData.sections}

                                                currentSection={currentSection}

                                                onSectionChange={handleSectionChange}

                                                currentSkr={currentSkr}

                                                isKleinunternehmer={isKleinunternehmer}

                                                euerCalculation={euerCalculation}

                                            />

                                        </div>

                                    </div>



                                    {/* Main Content */}

                                    <div className="flex-1 min-h-[600px]">

                                        <div className="p-6 space-y-6">



                                            <FieldGroups

                                                groups={guidanceData.groups.filter(group => {

                                                    if (currentSection === 'income') return group.category === 'income';

                                                    if (currentSection === 'expenses') return group.category === 'expense';

                                                    if (currentSection === 'profit') return group.category === 'total' || group.category === 'tax';

                                                    return group.category === 'income';

                                                })}

                                                isKleinunternehmer={isKleinunternehmer}

                                                categories={categories}

                                                skrCategories={skrCategories}

                                            />

                                        </div>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                    )}

                </div>

            )}



            {/* FAQ Section */}

            <FAQ />



            {/* Footer with Legal Links */}

            <footer className="mt-12 pt-8 border-t border-border">

                <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">

                    <div className="flex gap-4">

                        <button

                            onClick={() => {

                                setCurrentView('impressum');

                                window.scrollTo({ top: 0, behavior: 'smooth' });

                            }}

                            className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"

                        >

                            Impressum

                        </button>

                        <button

                            onClick={() => {

                                setCurrentView('datenschutz');

                                window.scrollTo({ top: 0, behavior: 'smooth' });

                            }}

                            className="hover:text-foreground transition-colors underline-offset-4 hover:underline cursor-pointer"

                        >

                            Datenschutz

                        </button>

                    </div>

                    <a

                        href="https://github.com/torstendngh/kontist-eur-report-generator"

                        target="_blank"

                        rel="noopener noreferrer"

                        className="hover:text-foreground transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1"

                    >

                        <Github size={14} />

                        GitHub

                    </a>

                    <span className="text-xs">

                        © {new Date().getFullYear()} Torsten Linnecke

                    </span>

                </div>

            </footer>

        </div>

    );

};



export default EuerGenerator;


