import { Cpu, Database, Github, ShieldOff } from "lucide-react";
import { memo } from "react";

/**
 * PrivacyInfoSection displays privacy feature cards explaining data handling.
 * This is a pure presentational component with no props or state.
 */
export const PrivacyInfoSection = memo(() => (
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
        <h3 className="mb-2 font-medium text-foreground">Keine Speicherung</h3>
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
));

PrivacyInfoSection.displayName = "PrivacyInfoSection";
