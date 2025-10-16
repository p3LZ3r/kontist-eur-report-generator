import {
  AlertCircle,
  Building,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  FileText,
  Github,
  RotateCcw,
  Sheet,
  ShieldOff,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types";
import {
  getCategoriesForSkr,
  skr04Categories,
} from "../utils/categoryMappings";
import { PAGINATION } from "../utils/constants";
import { loadDemoData } from "../utils/demoUtils";
import { calculateEuer } from "../utils/euerCalculations";
import { prepareGuidanceData } from "../utils/guidanceUtils";
import { validateCSVContent } from "../utils/sanitization";
import {
  categorizeTransaction,
  detectBankFormat,
  parseHolviCSV,
  parseKontistCSV,
} from "../utils/transactionUtils";
import Datenschutz from "./Datenschutz";
import FAQ from "./FAQ";
import FieldGroups from "./FieldGroups";
import HelpTooltip from "./HelpTooltip";
import Impressum from "./Impressum";
import NavigationSidebar from "./NavigationSidebar";
import SettingsBar from "./SettingsBar";
import TransactionRow from "./TransactionRow";
import TransactionRowMobile from "./TransactionRowMobile";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const EuerGenerator = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [bankType, setBankType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
  const [currentSkr, setCurrentSkr] = useState<"SKR03" | "SKR04" | "SKR49">(
    "SKR04"
  );
  const [skrCategories, setSkrCategories] =
    useState<
      Record<
        string,
        {
          code: string;
          name: string;
          type: string;
          vat: number;
          elsterField?: string;
        }
      >
    >(skr04Categories);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [currentView, setCurrentView] = useState<
    "transactions" | "elster" | "impressum" | "datenschutz"
  >("transactions");
  const [currentSection, setCurrentSection] = useState("income");

  // Load SKR categories dynamically
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await getCategoriesForSkr(currentSkr);
        setSkrCategories(loadedCategories);
      } catch (error) {
        console.warn(
          `Failed to load ${currentSkr} categories, using fallback:`,
          error
        );
        setSkrCategories(skr04Categories);
      }
    };

    loadCategories();
  }, [currentSkr]);

  // CSV-Datei einlesen
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessingFile(true);
      setErrorMessage(null);

      try {
        // Validate file type
        if (
          !file.name.toLowerCase().endsWith(".csv") &&
          file.type !== "text/csv"
        ) {
          throw new Error(
            "Ungültiger Dateityp. Bitte laden Sie eine CSV-Datei (.csv) hoch."
          );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          throw new Error("Datei ist zu groß. Maximale Dateigröße: 10MB.");
        }

        // Validate file is not empty
        if (file.size === 0) {
          throw new Error(
            "Die hochgeladene Datei ist leer. Bitte wählen Sie eine gültige CSV-Datei."
          );
        }

        let text: string;
        try {
          text = await file.text();
        } catch {
          throw new Error(
            "Fehler beim Lesen der Datei. Die Datei könnte beschädigt sein."
          );
        }

        // Validate file content is not empty
        if (text.trim().length === 0) {
          throw new Error(
            "Die CSV-Datei ist leer oder enthält keine gültigen Daten."
          );
        }

        // Validate CSV structure (basic check for commas/semicolons)
        const lines = text.split("\n").filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          throw new Error(
            "Die CSV-Datei enthält zu wenig Daten. Mindestens eine Kopfzeile und eine Datenzeile sind erforderlich."
          );
        }

        // Validate CSV content for security issues
        validateCSVContent(text);

        const detectedBankType = detectBankFormat(text);
        setBankType(detectedBankType);

        let parsedTransactions: Transaction[];

        if (detectedBankType === "kontist") {
          parsedTransactions = parseKontistCSV(text);
        } else if (detectedBankType === "holvi") {
          parsedTransactions = parseHolviCSV(text);
        } else {
          throw new Error(
            "Unbekanntes CSV-Format. Unterstützt werden nur Kontist und Holvi Exporte. Bitte stellen Sie sicher, dass Sie die CSV-Datei direkt aus Ihrem Banking-Portal exportiert haben."
          );
        }

        // Validate that transactions were successfully parsed
        if (!parsedTransactions || parsedTransactions.length === 0) {
          throw new Error(
            "Keine Transaktionen in der CSV-Datei gefunden. Bitte überprüfen Sie, ob die Datei Transaktionsdaten enthält."
          );
        }

        // EÜR-Kategorien zuweisen (alle Transaktionen, auch Privatentnahmen)
        parsedTransactions.forEach((t) => {
          t.euerCategory = categorizeTransaction(t);
        });

        setTransactions(parsedTransactions);

        // Automatische Kategorisierung
        const autoCategories: Record<number, string> = {};
        parsedTransactions.forEach((t) => {
          autoCategories[t.id] = t.euerCategory || "";
        });
        setCategories(autoCategories);
        setCurrentPage(1); // Zurück zur ersten Seite
      } catch (error) {
        let errorMsg = "Unbekannter Fehler beim Verarbeiten der Datei.";

        if (error instanceof Error) {
          errorMsg = error.message;
        } else if (typeof error === "string") {
          errorMsg = error;
        }

        setErrorMessage(errorMsg);
      } finally {
        setIsProcessingFile(false);
        // Reset file input to allow re-uploading the same file
        event.target.value = "";
      }
    },
    []
  );

  // Demo-Daten laden
  const handleDemoLoad = useCallback(() => {
    setIsProcessingFile(true);
    setErrorMessage(null);

    try {
      // Load demo transactions
      const demoTransactions = loadDemoData();

      // Set bank type to kontist for demo
      setBankType("kontist");

      // Categorize all demo transactions
      demoTransactions.forEach((t) => {
        t.euerCategory = categorizeTransaction(t);
      });

      setTransactions(demoTransactions);

      // Set auto-categories
      const autoCategories: Record<number, string> = {};
      demoTransactions.forEach((t) => {
        autoCategories[t.id] = t.euerCategory || "";
      });
      setCategories(autoCategories);
      setCurrentPage(1);
      setIsDemoMode(true);
    } catch (error) {
      let errorMsg = "Fehler beim Laden der Demo-Daten.";
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
      "Achtung: Alle aktuellen Transaktionen und manuellen Kategorisierungen gehen verloren.\n\nMöchten Sie wirklich eine neue CSV-Datei hochladen?"
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
      const fileInput = document.getElementById(
        "csvUpload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, []);

  // Memoized category lists for performance
  const incomeCategories = useMemo(
    () =>
      Object.entries(skrCategories)
        .filter(([, cat]) => cat.type === "income")
        .sort((a, b) => a[1].name.localeCompare(b[1].name)),
    [skrCategories]
  );

  const expenseCategories = useMemo(
    () =>
      Object.entries(skrCategories)
        .filter(([, cat]) => cat.type === "expense" || cat.type === "private")
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
  const updateCategory = useCallback(
    (transactionId: number, categoryKey: string) => {
      setCategories((prev) => ({
        ...prev,
        [transactionId]: categoryKey,
      }));
    },
    []
  );

  // Pagination-Berechnungen
  const indexOfLastTransaction = currentPage * PAGINATION.TRANSACTIONS_PER_PAGE;
  const indexOfFirstTransaction =
    indexOfLastTransaction - PAGINATION.TRANSACTIONS_PER_PAGE;
  const totalPages = Math.ceil(
    transactions.length / PAGINATION.TRANSACTIONS_PER_PAGE
  );

  // EÜR berechnen mit/ohne USt (used by guidance system for field calculations)
  const euerCalculation = useMemo(
    () =>
      calculateEuer(
        transactions,
        categories,
        isKleinunternehmer,
        skrCategories
      ),
    [transactions, categories, isKleinunternehmer, skrCategories]
  );

  // Elster Übersicht generieren - enhanced with complete field set
  // const elsterSummary = useMemo(() => {
  //     return generateElsterOverview(euerCalculation, isKleinunternehmer);
  // }, [euerCalculation, isKleinunternehmer]);

  // Guidance system data - use pre-computed euerCalculation
  const guidanceData = useMemo(() => {
    if (transactions.length === 0) return null;
    return prepareGuidanceData(
      transactions,
      categories,
      isKleinunternehmer,
      euerCalculation
    );
  }, [transactions, categories, isKleinunternehmer, euerCalculation]);

  // Guidance system callbacks
  const handleSectionChange = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
  }, []);

  // Show Impressum or Datenschutz if selected
  if (currentView === "impressum") {
    return (
      <Impressum
        onBack={() => {
          setCurrentView("transactions");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  if (currentView === "datenschutz") {
    return (
      <Datenschutz
        onBack={() => {
          setCurrentView("transactions");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Error Display */}
      {errorMessage && (
        <div className="animate-fade-in rounded-lg border border-destructive/20 bg-destructive/10 p-5">
          <div className="flex items-start gap-4">
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 flex-shrink-0 text-destructive"
              size={20}
            />
            <div className="flex-1 space-y-3">
              <div className="font-semibold text-destructive">
                Fehler beim Verarbeiten der Datei
              </div>
              <div className="text-destructive/90 text-sm leading-relaxed">
                {errorMessage}
              </div>

              {/* Help section for common issues */}
              <div className="rounded-md border border-border/30 bg-background/50 p-3">
                <div className="mb-2 text-foreground/70 text-xs">
                  Häufige Lösungsansätze:
                </div>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>
                    • Stellen Sie sicher, dass die Datei eine .csv-Datei ist
                  </li>
                  <li>
                    • Exportieren Sie die CSV direkt aus Kontist oder Holvi
                  </li>
                  <li>
                    • Überprüfen Sie, ob die Datei Transaktionsdaten enthält
                  </li>
                  <li>• Maximale Dateigröße: 10MB</li>
                </ul>
              </div>
            </div>
            <Button
              aria-label="Fehlermeldung schließen"
              className="focus-ring h-8 w-8 flex-shrink-0 p-0"
              onClick={() => setErrorMessage(null)}
              size="sm"
              variant="ghost"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="animate-fade-in py-12">
        <div className="flex-1">
          <h1 className="mb-4 text-left text-5xl text-foreground leading-tight">
            ELSTER EÜR Generator für{" "}
            <a
              aria-label="Kontist Website besuchen"
              className="inline-block translate-y-2 rotate-[-2deg] transform cursor-pointer rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:rotate-[-0.5deg] hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              href="https://kontist.com/r/torsten7HU"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Kontist Logo"
                className="h-6 w-auto md:h-8"
                loading="lazy"
                src="/assets/logos/kontist-wordmark.svg"
              />
            </a>{" "}
            und{" "}
            <a
              aria-label="Holvi Website besuchen"
              className="inline-block translate-y-2 rotate-[3deg] transform cursor-pointer rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:rotate-[1deg] hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              href="https://holvi.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Holvi Logo"
                className="h-6 w-auto md:h-8"
                loading="lazy"
                src="/assets/logos/holvi-wordmark.svg"
              />
            </a>
          </h1>
          <p className="mb-2 text-left text-muted-foreground leading-relaxed">
            Automatische Kategorisierung und ELSTER-konforme EÜR-Berechnung
          </p>
          <p className="max-w-3xl text-left text-muted-foreground leading-relaxed">
            Laden Sie Ihre CSV-Exporte von Kontist oder Holvi hoch und erhalten
            Sie automatisch kategorisierte Transaktionen nach {currentSkr}
            -Standard. Das Tool erstellt ELSTER-konforme Übersichten für Ihre
            Einnahmen-Überschuss-Rechnung und unterstützt sowohl
            Kleinunternehmer als auch umsatzsteuerpflichtige Unternehmen.
          </p>
        </div>
      </div>

      {/* Settings Bar - nur anzeigen wenn keine Transaktionen geladen sind */}
      {transactions.length === 0 && (
        <SettingsBar
          currentSkr={currentSkr}
          isKleinunternehmer={isKleinunternehmer}
          onKleinunternehmerChange={setIsKleinunternehmer}
          onSkrChange={setCurrentSkr}
        />
      )}

      {/* File Upload - nur anzeigen wenn keine Transaktionen geladen sind */}
      {transactions.length === 0 && (
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            {/* 3-Schritt Anleitung */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                  <Upload aria-hidden="true" size={32} />
                </div>
                <h3 className="mb-2 text-foreground">1. CSV-Datei hochladen</h3>
                <p className="text-muted-foreground text-sm">
                  Exportieren Sie Ihre Transaktionen aus Kontist oder Holvi als
                  CSV-Datei und laden Sie diese hier hoch.
                </p>
              </div>
              <div className="rounded-lg border border-muted-foreground/25 bg-muted/20 p-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                  <FileText aria-hidden="true" size={32} />
                </div>
                <h3 className="mb-2 text-foreground">
                  2. Kategorien überprüfen
                </h3>
                <p className="text-muted-foreground text-sm">
                  Prüfen und korrigieren Sie die automatische {currentSkr}
                  -Kategorisierung Ihrer Transaktionen.
                </p>
              </div>
              <div className="rounded-lg border border-muted-foreground/25 bg-muted/20 p-4 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                  <Building aria-hidden="true" size={32} />
                </div>
                <h3 className="mb-2 text-foreground">3. ELSTER-Export</h3>
                <p className="text-muted-foreground text-sm">
                  Nutzen Sie die ELSTER-Übersicht für eine einfache Übertragung
                  in Ihre Steuererklärung.
                </p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-muted-foreground/25 border-dashed bg-muted/20 p-8 text-center transition-colors hover:bg-muted/30">
              {isProcessingFile ? (
                <>
                  <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                  <h3 className="mb-2 text-foreground text-lg">
                    CSV-Datei wird verarbeitet...
                  </h3>
                  <p className="text-muted-foreground">
                    Transaktionen werden analysiert und kategorisiert.
                  </p>
                </>
              ) : (
                <>
                  <Upload
                    aria-hidden="true"
                    className="mx-auto mb-4 text-primary"
                    size={32}
                  />
                  <h3 className="mb-2 text-foreground">
                    Bank-Export hochladen
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                    Laden Sie Ihre Kontist oder Holvi CSV-Datei hoch, um
                    automatisch Transaktionen zu kategorisieren und Ihre EÜR zu
                    erstellen.
                  </p>
                  <input
                    accept=".csv"
                    aria-describedby="file-upload-description"
                    className="hidden"
                    disabled={isProcessingFile}
                    id="csvUpload"
                    onChange={handleFileUpload}
                    type="file"
                  />
                  <Button
                    asChild
                    className="focus-ring"
                    disabled={isProcessingFile}
                    size="lg"
                  >
                    <label className="cursor-pointer" htmlFor="csvUpload">
                      <Upload aria-hidden="true" className="mr-2" size={18} />
                      CSV-Datei auswählen
                    </label>
                  </Button>
                  <div
                    className="mt-3 flex items-center justify-center gap-2 text-muted-foreground text-sm"
                    id="file-upload-description"
                  >
                    <span>Unterstützt: Kontist</span>
                    <HelpTooltip
                      content="So erstellen Sie einen CSV-Export in Kontist:"
                      examples={[
                        "Öffnen Sie das Kontist Online Banking oder die mobile App",
                        "Klicken Sie auf den Download-Bereich im Online Banking oder gehen Sie in der App zu Profil (oben links) > Downloads",
                        "Wählen Sie 'CSV-Export' aus den verfügbaren Dokumenten",
                        "Laden Sie die CSV-Datei mit all Ihren Transaktionen herunter",
                        "Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung",
                      ]}
                      position="top"
                      title="Kontist CSV-Export erstellen"
                    />
                    <span>und Holvi</span>
                    <HelpTooltip
                      content="So erstellen Sie einen CSV-Export in Holvi:"
                      examples={[
                        "Öffnen Sie das Holvi Online Banking oder die mobile App",
                        "Navigieren Sie zum Menüpunkt 'Transaktionen' oder 'Kontobewegungen'",
                        "Wählen Sie den gewünschten Zeitraum für den Export",
                        "Klicken Sie auf 'Exportieren' oder 'CSV herunterladen'",
                        "Laden Sie die CSV-Datei mit Ihren Transaktionen herunter",
                        "Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung",
                      ]}
                      position="top"
                      title="Holvi CSV-Export erstellen"
                    />
                    <span>CSV-Formate</span>
                  </div>

                  {/* Demo-Link */}
                  <div className="mt-4 border-border/30 border-t pt-3">
                    <button
                      className="cursor-pointer text-muted-foreground text-sm underline transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isProcessingFile}
                      onClick={handleDemoLoad}
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
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                <Cpu aria-hidden="true" size={32} />
              </div>
              <h3 className="mb-2 font-medium text-foreground">
                Lokale Verarbeitung
              </h3>
              <p className="text-muted-foreground text-sm">
                Alle Berechnungen erfolgen in Ihrem Browser
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                <ShieldOff aria-hidden="true" size={32} />
              </div>
              <h3 className="mb-2 font-medium text-foreground">
                Keine Datenübertragung
              </h3>
              <p className="text-muted-foreground text-sm">
                CSV-Inhalte verlassen nie Ihren Computer
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                <Database aria-hidden="true" size={32} />
              </div>
              <h3 className="mb-2 font-medium text-foreground">
                Keine Speicherung
              </h3>
              <p className="text-muted-foreground text-sm">
                Daten werden nicht dauerhaft gespeichert
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-primary">
                <Github aria-hidden="true" size={32} />
              </div>
              <h3 className="mb-2 font-medium text-foreground">Open Source</h3>
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
          <div className="mb-6 flex justify-center">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                  currentView === "transactions"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setCurrentView("transactions")}
              >
                <Sheet size={16} />
                Transaktionen
              </button>
              <button
                className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                  currentView === "elster"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setCurrentView("elster")}
              >
                <Calculator size={16} />
                Elsterfelder
              </button>
            </div>
          </div>

          {/* Transaktionsübersicht mit Pagination */}
          {currentView === "transactions" && (
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <h2 className="flex items-center gap-2 text-2xl text-foreground">
                    Transaktionen kategorisieren
                  </h2>

                  <div className="flex flex-1 flex-wrap justify-center gap-2">
                    <div className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-green-800">
                      <span className="font-medium text-xs">
                        {bankType === "kontist" ? "Kontist" : "Holvi"} CSV
                        erkannt
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
                        {isKleinunternehmer
                          ? "Kleinunternehmer §19 UStG"
                          : "Regelbesteuerung"}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="focus-ring flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={resetAndUploadNew}
                    size="sm"
                    title="Neue CSV-Datei hochladen (aktueller Fortschritt geht verloren)"
                    variant="outline"
                  >
                    <RotateCcw aria-hidden="true" size={16} />
                    Neue Datei
                  </Button>
                </div>

                {/* Pagination Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-muted-foreground text-sm">
                    Zeige {indexOfFirstTransaction + 1}-
                    {Math.min(indexOfLastTransaction, transactions.length)} von{" "}
                    {transactions.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="focus-ring flex items-center gap-1"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      size="sm"
                      variant="outline"
                    >
                      <ChevronLeft aria-hidden="true" size={16} />
                      Zurück
                    </Button>
                    <div className="flex h-8 items-center rounded-md border bg-muted px-3 py-1.5 text-muted-foreground text-sm">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      className="focus-ring flex items-center gap-1"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      size="sm"
                      variant="outline"
                    >
                      Weiter
                      <ChevronRight aria-hidden="true" size={16} />
                    </Button>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-border border-b bg-muted/50">
                        <th className="w-24 p-3 text-left font-normal text-muted-foreground">
                          Datum
                        </th>
                        <th className="w-1/5 min-w-32 p-3 text-left font-normal text-muted-foreground">
                          Gegenpartei
                        </th>
                        <th className="w-20 p-3 text-right font-normal text-muted-foreground">
                          Betrag
                        </th>
                        <th className="w-1/4 min-w-40 p-3 text-left font-normal text-muted-foreground">
                          Verwendungszweck
                        </th>
                        <th className="w-1/3 min-w-48 p-3 text-left font-normal text-muted-foreground">
                          {currentSkr}-Konto
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransactions.map((transaction) => {
                        const categoryKey =
                          categories[transaction.id] ||
                          transaction.euerCategory ||
                          "";

                        return (
                          <TransactionRow
                            categoryKey={categoryKey}
                            currentSkr={currentSkr}
                            expenseCategories={expenseCategories}
                            incomeCategories={incomeCategories}
                            key={transaction.id}
                            onCategoryChange={updateCategory}
                            skrCategories={skrCategories}
                            transaction={transaction}
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
                      const categoryKey =
                        categories[transaction.id] ||
                        transaction.euerCategory ||
                        "";

                      return (
                        <TransactionRowMobile
                          categoryKey={categoryKey}
                          currentSkr={currentSkr}
                          expenseCategories={expenseCategories}
                          incomeCategories={incomeCategories}
                          key={transaction.id}
                          onCategoryChange={updateCategory}
                          skrCategories={skrCategories}
                          transaction={transaction}
                        />
                      );
                    })}
                  </ul>
                </div>

                {/* Pagination Controls unten */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center text-muted-foreground text-sm sm:text-left">
                    Zeige {indexOfFirstTransaction + 1}-
                    {Math.min(indexOfLastTransaction, transactions.length)} von{" "}
                    {transactions.length}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      className="focus-ring flex items-center gap-1"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      size="sm"
                      variant="outline"
                    >
                      <ChevronLeft aria-hidden="true" size={16} />
                      Zurück
                    </Button>
                    <div className="flex h-8 items-center rounded-md border bg-muted px-3 py-1.5 text-muted-foreground text-sm">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      className="focus-ring flex items-center gap-1"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      size="sm"
                      variant="outline"
                    >
                      Weiter
                      <ChevronRight aria-hidden="true" size={16} />
                    </Button>
                  </div>
                  <Button
                    className="focus-ring flex items-center gap-2"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => setCurrentView("elster"), 300);
                    }}
                    size="sm"
                    variant="default"
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      className="rotate-90"
                      size={16}
                    />
                    Zu den Elsterfeldern
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ELSTER Guidance System */}
          {currentView === "elster" && guidanceData && (
            <Card className="animate-fade-in">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Navigation Sidebar */}
                  <div className="border-border border-b bg-muted/30 lg:w-80 lg:border-r lg:border-b-0">
                    <div className="flex h-full flex-col p-6">
                      <NavigationSidebar
                        currentSection={currentSection}
                        currentSkr={currentSkr}
                        euerCalculation={euerCalculation}
                        isKleinunternehmer={isKleinunternehmer}
                        onSectionChange={handleSectionChange}
                        sections={guidanceData.sections}
                      />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="min-h-[600px] flex-1">
                    <div className="space-y-6 p-6">
                      <FieldGroups
                        categories={categories}
                        currentSkr={currentSkr}
                        groups={guidanceData.groups.filter((group) => {
                          if (currentSection === "income")
                            return group.category === "income";
                          if (currentSection === "expenses")
                            return group.category === "expense";
                          if (currentSection === "profit")
                            return (
                              group.category === "total" ||
                              group.category === "tax"
                            );
                          return group.category === "income";
                        })}
                        isKleinunternehmer={isKleinunternehmer}
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
      <footer className="mt-12 border-border border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
          <div className="flex gap-4">
            <button
              className="cursor-pointer underline-offset-4 transition-colors hover:text-foreground hover:underline"
              onClick={() => {
                setCurrentView("impressum");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Impressum
            </button>
            <button
              className="cursor-pointer underline-offset-4 transition-colors hover:text-foreground hover:underline"
              onClick={() => {
                setCurrentView("datenschutz");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Datenschutz
            </button>
          </div>
          <a
            className="inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            href="https://github.com/torstendngh/kontist-eur-report-generator"
            rel="noopener noreferrer"
            target="_blank"
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
