import { memo } from "react";
import { AppIcon } from "@/components/ui/app-icon";

interface HeroSectionProps {
  currentSkr: "SKR03" | "SKR04" | "SKR49";
}

/**
 * HeroSection displays the marketing hero with app icon, Kontist and Holvi logos.
 * This is a pure presentational component with no internal state.
 *
 * @param props.currentSkr - Current SKR standard being used
 */
export const HeroSection = memo(({ currentSkr }: HeroSectionProps) => (
  <div className="animate-fade-in py-12">
    <div className="flex-1">
      {/* iOS 26-style App Icon */}
      <div className="mb-8 flex justify-start">
        <AppIcon size="xl" />
      </div>

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
        Laden Sie Ihre CSV-Exporte von Kontist oder Holvi hoch und erhalten Sie
        automatisch kategorisierte Transaktionen nach {currentSkr}
        -Standard. Das Tool erstellt ELSTER-konforme Übersichten für Ihre
        Einnahmen-Überschuss-Rechnung und unterstützt sowohl Kleinunternehmer
        als auch umsatzsteuerpflichtige Unternehmen.
      </p>
    </div>
  </div>
));

HeroSection.displayName = "HeroSection";
