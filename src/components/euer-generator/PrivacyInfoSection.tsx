import { Cpu, Database, Github, ShieldOff } from "lucide-react";
import { memo } from "react";

/**
 * PrivacyInfoSection displays privacy feature cards explaining data handling.
 * This is a pure presentational component with no props or state.
 */
export const PrivacyInfoSection = memo(() => {
	return (
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
					<h3 className="text-foreground mb-2 font-medium">Open Source</h3>
					<p className="text-muted-foreground text-sm">
						Der gesamte Code ist transparent einsehbar
					</p>
				</div>
			</div>
		</div>
	);
});

PrivacyInfoSection.displayName = "PrivacyInfoSection";
