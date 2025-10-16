import { AlertCircle, Calculator, Sheet, X } from "lucide-react";
import { useCallback } from "react";
import Datenschutz from "../Datenschutz";
import FAQ from "../FAQ";
import Impressum from "../Impressum";
import SettingsBar from "../SettingsBar";
import { Button } from "../ui/button";
import { ElsterView } from "./ElsterView";
import { FileUploadSection } from "./FileUploadSection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { useDemoData } from "./hooks/useDemoData";
import { useEuerState } from "./hooks/useEuerState";
import { useFileUpload } from "./hooks/useFileUpload";
import { usePagination } from "./hooks/usePagination";
import { PrivacyInfoSection } from "./PrivacyInfoSection";
import { TransactionList } from "./TransactionList";

const EuerGenerator = () => {
  // Custom hooks for state management
  const state = useEuerState();
  const fileUpload = useFileUpload();
  const demoData = useDemoData();
  const pagination = usePagination(state.transactions);

  // File upload handler
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const result = await fileUpload.handleFileUpload(file);
      if (result) {
        state.setTransactions(result.transactions);
        state.setCategories(result.categories);
        state.setBankType(result.bankType);
        pagination.resetToFirstPage();
        state.setIsDemoMode(false);
      }

      // Set error message if there was one
      if (fileUpload.error) {
        state.setErrorMessage(fileUpload.error);
      }

      // Reset file input to allow re-uploading the same file
      event.target.value = "";
    },
    [fileUpload, state, pagination]
  );

  // Demo data handler
  const handleDemoLoad = useCallback(() => {
    const result = demoData.loadDemo();
    if (result) {
      state.setTransactions(result.transactions);
      state.setCategories(result.categories);
      state.setBankType("kontist");
      pagination.resetToFirstPage();
      state.setIsDemoMode(true);
    }

    // Set error message if there was one
    if (demoData.error) {
      state.setErrorMessage(demoData.error);
    }
  }, [demoData, state, pagination]);

  // Reset handler
  const resetAndUploadNew = useCallback(() => {
    const confirmReset = window.confirm(
      "Achtung: Alle aktuellen Transaktionen und manuellen Kategorisierungen gehen verloren.\n\nMöchten Sie wirklich eine neue CSV-Datei hochladen?"
    );

    if (confirmReset) {
      state.resetState();
      pagination.resetToFirstPage();
      // Reset file input
      const fileInput = document.getElementById(
        "csvUpload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [state, pagination]);

  // Navigation handlers
  const handleNavigateToElster = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => state.setCurrentView("elster"), 300);
  }, [state]);

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      state.setCurrentSection(sectionId);
    },
    [state]
  );

  // Show Impressum or Datenschutz if selected
  if (state.currentView === "impressum") {
    return (
      <Impressum
        onBack={() => {
          state.setCurrentView("transactions");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  if (state.currentView === "datenschutz") {
    return (
      <Datenschutz
        onBack={() => {
          state.setCurrentView("transactions");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {state.errorMessage && (
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
                {state.errorMessage}
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
              onClick={() => state.setErrorMessage(null)}
              size="sm"
              variant="ghost"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection currentSkr={state.currentSkr} />

      {/* Settings Bar - only show when no transactions loaded */}
      {state.transactions.length === 0 && (
        <SettingsBar
          currentSkr={state.currentSkr}
          isKleinunternehmer={state.isKleinunternehmer}
          onKleinunternehmerChange={state.setIsKleinunternehmer}
          onSkrChange={state.setCurrentSkr}
        />
      )}

      {/* File Upload - only show when no transactions loaded */}
      {state.transactions.length === 0 && (
        <FileUploadSection
          currentSkr={state.currentSkr}
          isProcessing={fileUpload.isLoading || demoData.isLoading}
          onDemoLoad={handleDemoLoad}
          onFileChange={handleFileUpload}
        />
      )}

      {/* Privacy Information - only show when no transactions loaded */}
      {state.transactions.length === 0 && <PrivacyInfoSection />}

      {/* Main Content with Segmented Control */}
      {state.transactions.length > 0 && (
        <div className="animate-fade-in">
          {/* Segmented Control */}
          <div className="mb-6 flex justify-center">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                  state.currentView === "transactions"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => state.setCurrentView("transactions")}
                type="button"
              >
                <Sheet size={16} />
                Transaktionen
              </button>
              <button
                className={`flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                  state.currentView === "elster"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => state.setCurrentView("elster")}
                type="button"
              >
                <Calculator size={16} />
                Elsterfelder
              </button>
            </div>
          </div>

          {/* Transaction View */}
          {state.currentView === "transactions" && (
            <TransactionList
              bankType={state.bankType}
              categories={state.categories}
              currentPage={pagination.currentPage}
              currentSkr={state.currentSkr}
              currentTransactions={pagination.currentItems}
              expenseCategories={state.expenseCategories}
              incomeCategories={state.incomeCategories}
              indexOfFirstTransaction={pagination.indexOfFirstItem}
              indexOfLastTransaction={pagination.indexOfLastItem}
              isDemoMode={state.isDemoMode}
              isKleinunternehmer={state.isKleinunternehmer}
              onCategoryChange={state.updateCategory}
              onNavigateToElster={handleNavigateToElster}
              onPageChange={pagination.goToPage}
              onResetAndUploadNew={resetAndUploadNew}
              skrCategories={state.skrCategories}
              totalPages={pagination.totalPages}
              transactions={state.transactions}
            />
          )}

          {/* ELSTER Guidance System */}
          {state.currentView === "elster" && state.guidanceData && (
            <ElsterView
              categories={state.categories}
              currentSection={state.currentSection}
              currentSkr={state.currentSkr}
              euerCalculation={state.euerCalculation}
              guidanceData={state.guidanceData}
              isKleinunternehmer={state.isKleinunternehmer}
              onSectionChange={handleSectionChange}
              skrCategories={state.skrCategories}
            />
          )}
        </div>
      )}

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer
        onDatenschutzClick={() => {
          state.setCurrentView("datenschutz");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onImpressumClick={() => {
          state.setCurrentView("impressum");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default EuerGenerator;
