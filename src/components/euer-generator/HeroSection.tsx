import { memo } from "react";

interface HeroSectionProps {
	currentSkr: "SKR03" | "SKR04" | "SKR49";
}

/**
 * HeroSection displays the marketing hero with Kontist and Holvi logos.
 * This is a pure presentational component with no internal state.
 *
 * @param props.currentSkr - Current SKR standard being used
 */
export const HeroSection = memo(({ currentSkr }: HeroSectionProps) => {
	return (
		<div className="py-12 animate-fade-in">
			<div className="flex-1">
				<h1 className="text-5xl text-foreground mb-4 text-left leading-tight">
					ELSTER EÜR Generator für{" "}
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
					</a>{" "}
					und{" "}
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
					Laden Sie Ihre CSV-Exporte von Kontist oder Holvi hoch und erhalten
					Sie automatisch kategorisierte Transaktionen nach {currentSkr}
					-Standard. Das Tool erstellt ELSTER-konforme Übersichten für Ihre
					Einnahmen-Überschuss-Rechnung und unterstützt sowohl Kleinunternehmer
					als auch umsatzsteuerpflichtige Unternehmen.
				</p>
			</div>
		</div>
	);
});

HeroSection.displayName = "HeroSection";
