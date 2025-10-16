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
            <h3 className="mb-2 text-foreground">2. Kategorien überprüfen</h3>
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
              Nutzen Sie die ELSTER-Übersicht für eine einfache Übertragung in
              Ihre Steuererklärung.
            </p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-muted-foreground/25 border-dashed bg-muted/20 p-8 text-center transition-colors hover:bg-muted/30">
          {isProcessing ? (
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
              <h3 className="mb-2 text-foreground">Bank-Export hochladen</h3>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                Laden Sie Ihre Kontist oder Holvi CSV-Datei hoch, um automatisch
                Transaktionen zu kategorisieren und Ihre EÜR zu erstellen.
              </p>
              <input
                accept=".csv"
                aria-describedby="file-upload-description"
                className="hidden"
                disabled={isProcessing}
                id="csvUpload"
                onChange={onFileChange}
                type="file"
              />
              <Button
                asChild
                className="focus-ring"
                disabled={isProcessing}
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
                  disabled={isProcessing}
                  onClick={onDemoLoad}
                  type="button"
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
