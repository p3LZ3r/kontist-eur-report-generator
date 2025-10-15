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
		[fileUpload, state, pagination],
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
			"Achtung: Alle aktuellen Transaktionen und manuellen Kategorisierungen gehen verloren.\n\nMöchten Sie wirklich eine neue CSV-Datei hochladen?",
		);

		if (confirmReset) {
			state.resetState();
			pagination.resetToFirstPage();
			// Reset file input
			const fileInput = document.getElementById(
				"csvUpload",
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
		[state],
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
				<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-5 animate-fade-in">
					<div className="flex items-start gap-4">
						<AlertCircle
							className="text-destructive flex-shrink-0 mt-0.5"
							size={20}
							aria-hidden="true"
						/>
						<div className="flex-1 space-y-3">
							<div className="font-semibold text-destructive">
								Fehler beim Verarbeiten der Datei
							</div>
							<div className="text-destructive/90 text-sm leading-relaxed">
								{state.errorMessage}
							</div>

							{/* Help section for common issues */}
							<div className="bg-background/50 border border-border/30 rounded-md p-3">
								<div className="text-xs text-foreground/70 mb-2">
									Häufige Lösungsansätze:
								</div>
								<ul className="text-xs text-muted-foreground space-y-1">
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
							onClick={() => state.setErrorMessage(null)}
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
			<HeroSection currentSkr={state.currentSkr} />

			{/* Settings Bar - only show when no transactions loaded */}
			{state.transactions.length === 0 && (
				<SettingsBar
					isKleinunternehmer={state.isKleinunternehmer}
					onKleinunternehmerChange={state.setIsKleinunternehmer}
					currentSkr={state.currentSkr}
					onSkrChange={state.setCurrentSkr}
				/>
			)}

			{/* File Upload - only show when no transactions loaded */}
			{state.transactions.length === 0 && (
				<FileUploadSection
					onFileChange={handleFileUpload}
					onDemoLoad={handleDemoLoad}
					isProcessing={fileUpload.isLoading || demoData.isLoading}
					currentSkr={state.currentSkr}
				/>
			)}

			{/* Privacy Information - only show when no transactions loaded */}
			{state.transactions.length === 0 && <PrivacyInfoSection />}

			{/* Main Content with Segmented Control */}
			{state.transactions.length > 0 && (
				<div className="animate-fade-in">
					{/* Segmented Control */}
					<div className="flex justify-center mb-6">
						<div className="flex p-1 bg-muted rounded-lg">
							<button
								type="button"
								onClick={() => state.setCurrentView("transactions")}
								className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${
									state.currentView === "transactions"
										? "bg-background text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Sheet size={16} />
								Transaktionen
							</button>
							<button
								type="button"
								onClick={() => state.setCurrentView("elster")}
								className={`px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${
									state.currentView === "elster"
										? "bg-background text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Calculator size={16} />
								Elsterfelder
							</button>
						</div>
					</div>

					{/* Transaction View */}
					{state.currentView === "transactions" && (
						<TransactionList
							transactions={state.transactions}
							currentTransactions={pagination.currentItems}
							categories={state.categories}
							skrCategories={state.skrCategories}
							incomeCategories={state.incomeCategories}
							expenseCategories={state.expenseCategories}
							currentSkr={state.currentSkr}
							isKleinunternehmer={state.isKleinunternehmer}
							bankType={state.bankType}
							isDemoMode={state.isDemoMode}
							currentPage={pagination.currentPage}
							totalPages={pagination.totalPages}
							indexOfFirstTransaction={pagination.indexOfFirstItem}
							indexOfLastTransaction={pagination.indexOfLastItem}
							onCategoryChange={state.updateCategory}
							onPageChange={pagination.goToPage}
							onResetAndUploadNew={resetAndUploadNew}
							onNavigateToElster={handleNavigateToElster}
						/>
					)}

					{/* ELSTER Guidance System */}
					{state.currentView === "elster" && state.guidanceData && (
						<ElsterView
							guidanceData={state.guidanceData}
							currentSection={state.currentSection}
							onSectionChange={handleSectionChange}
							currentSkr={state.currentSkr}
							isKleinunternehmer={state.isKleinunternehmer}
							euerCalculation={state.euerCalculation}
							categories={state.categories}
							skrCategories={state.skrCategories}
						/>
					)}
				</div>
			)}

			{/* FAQ Section */}
			<FAQ />

			{/* Footer */}
			<Footer
				onImpressumClick={() => {
					state.setCurrentView("impressum");
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
				onDatenschutzClick={() => {
					state.setCurrentView("datenschutz");
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
			/>
		</div>
	);
};

export default EuerGenerator;
