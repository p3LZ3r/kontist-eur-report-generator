import { Building, FileText, Upload } from "lucide-react";
import HelpTooltip from "../HelpTooltip";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface FileUploadSectionProps {
	onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
	onDemoLoad: () => void;
	isProcessing: boolean;
	currentSkr: "SKR03" | "SKR04" | "SKR49";
}

/**
 * FileUploadSection displays a 3-step guide and drag-and-drop interface
 * for uploading Kontist or Holvi CSV transaction files.
 *
 * @param props.onFileChange - Handler for file input change
 * @param props.onDemoLoad - Handler to load demo data
 * @param props.isProcessing - Loading state indicator
 * @param props.currentSkr - Current SKR standard
 */
export function FileUploadSection({
	onFileChange,
	onDemoLoad,
	isProcessing,
	currentSkr,
}: FileUploadSectionProps) {
	return (
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
							Exportieren Sie Ihre Transaktionen aus Kontist oder Holvi als
							CSV-Datei und laden Sie diese hier hoch.
						</p>
					</div>
					<div className="text-center p-4 bg-muted/20 rounded-lg border border-muted-foreground/25">
						<div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
							<FileText size={32} aria-hidden="true" />
						</div>
						<h3 className="text-foreground mb-2">2. Kategorien überprüfen</h3>
						<p className="text-muted-foreground text-sm">
							Prüfen und korrigieren Sie die automatische {currentSkr}
							-Kategorisierung Ihrer Transaktionen.
						</p>
					</div>
					<div className="text-center p-4 bg-muted/20 rounded-lg border border-muted-foreground/25">
						<div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary">
							<Building size={32} aria-hidden="true" />
						</div>
						<h3 className="text-foreground mb-2">3. ELSTER-Export</h3>
						<p className="text-muted-foreground text-sm">
							Nutzen Sie die ELSTER-Übersicht für eine einfache Übertragung in
							Ihre Steuererklärung.
						</p>
					</div>
				</div>
				<div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
					{isProcessing ? (
						<>
							<div className="mx-auto mb-4 w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
							<h3 className="text-lg text-foreground mb-2">
								CSV-Datei wird verarbeitet...
							</h3>
							<p className="text-muted-foreground">
								Transaktionen werden analysiert und kategorisiert.
							</p>
						</>
					) : (
						<>
							<Upload
								className="mx-auto text-primary mb-4"
								size={32}
								aria-hidden="true"
							/>
							<h3 className="text-foreground mb-2">Bank-Export hochladen</h3>
							<p className="text-muted-foreground mb-6 max-w-md mx-auto">
								Laden Sie Ihre Kontist oder Holvi CSV-Datei hoch, um automatisch
								Transaktionen zu kategorisieren und Ihre EÜR zu erstellen.
							</p>
							<input
								type="file"
								accept=".csv"
								onChange={onFileChange}
								className="hidden"
								id="csvUpload"
								aria-describedby="file-upload-description"
								disabled={isProcessing}
							/>
							<Button
								asChild
								size="lg"
								className="focus-ring"
								disabled={isProcessing}
							>
								<label htmlFor="csvUpload" className="cursor-pointer">
									<Upload size={18} className="mr-2" aria-hidden="true" />
									CSV-Datei auswählen
								</label>
							</Button>
							<div
								id="file-upload-description"
								className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2"
							>
								<span>Unterstützt: Kontist</span>
								<HelpTooltip
									title="Kontist CSV-Export erstellen"
									content="So erstellen Sie einen CSV-Export in Kontist:"
									examples={[
										"Öffnen Sie das Kontist Online Banking oder die mobile App",
										"Klicken Sie auf den Download-Bereich im Online Banking oder gehen Sie in der App zu Profil (oben links) > Downloads",
										"Wählen Sie 'CSV-Export' aus den verfügbaren Dokumenten",
										"Laden Sie die CSV-Datei mit all Ihren Transaktionen herunter",
										"Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung",
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
										"Verwenden Sie diese Datei hier im Tool für die automatische Kategorisierung",
									]}
									position="top"
								/>
								<span>CSV-Formate</span>
							</div>

							{/* Demo-Link */}
							<div className="mt-4 pt-3 border-t border-border/30">
								<button
									type="button"
									onClick={onDemoLoad}
									disabled={isProcessing}
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
	);
}
