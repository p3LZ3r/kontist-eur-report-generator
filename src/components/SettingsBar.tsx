import type React from "react";
import HelpTooltip from "./HelpTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SettingsBarProps {
  isKleinunternehmer: boolean;
  onKleinunternehmerChange: (value: boolean) => void;
  currentSkr: "SKR03" | "SKR04" | "SKR49";
  onSkrChange: (value: "SKR03" | "SKR04" | "SKR49") => void;
}

const SettingsBar: React.FC<SettingsBarProps> = ({
  isKleinunternehmer,
  onKleinunternehmerChange,
  currentSkr,
  onSkrChange,
}) => {
  return (
    <div className="mb-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      {/* Kleinunternehmerregelung Setting */}
      <div className="flex items-center gap-2">
        <label
          className="whitespace-nowrap text-foreground text-sm"
          htmlFor="kleinunternehmer-select"
        >
          Kleinunternehmerregelung:
        </label>
        <Select
          onValueChange={(value) => onKleinunternehmerChange(value === "ja")}
          value={isKleinunternehmer ? "ja" : "nein"}
        >
          <SelectTrigger
            className="focus-ring w-24 bg-white"
            id="kleinunternehmer-select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nein">Nein</SelectItem>
            <SelectItem value="ja">Ja</SelectItem>
          </SelectContent>
        </Select>
        <HelpTooltip
          content="Diese Einstellung bestimmt, wie Ihre Umsatzsteuer behandelt wird. Falls Sie unsicher sind, fragen Sie Ihren Steuerberater oder schauen Sie in Ihre letzte Steuererklärung."
          examples={[
            "JA wählen wenn: Sie haben weniger als 22.000€ Umsatz im Vorjahr oder erwarten unter 50.000€ dieses Jahr",
            "NEIN wählen wenn: Sie sind regulär umsatzsteuerpflichtig und geben Voranmeldungen ab",
            "Beispiel: Bei 119€ Rechnung → Kleinunternehmer: 119€ Umsatz | Normal: 100€ Umsatz + 19€ Umsatzsteuer",
          ]}
          position="bottom"
          title="Kleinunternehmerregelung (§19 UStG)"
        />
      </div>

      {/* Kontenrahmen Setting */}
      <div className="flex items-center gap-2">
        <label
          className="whitespace-nowrap text-foreground text-sm"
          htmlFor="skr-select"
        >
          Kontenrahmen:
        </label>
        <Select
          onValueChange={(value: "SKR03" | "SKR04" | "SKR49") =>
            onSkrChange(value)
          }
          value={currentSkr}
        >
          <SelectTrigger className="focus-ring w-24 bg-white" id="skr-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SKR03">SKR03</SelectItem>
            <SelectItem value="SKR04">SKR04</SelectItem>
            <SelectItem value="SKR49">SKR49</SelectItem>
          </SelectContent>
        </Select>
        <HelpTooltip
          content="Der Kontenrahmen bestimmt, nach welchem System Ihre Ausgaben und Einnahmen kategorisiert werden. SKR04 ist für die meisten Selbständigen der richtige Kontenrahmen."
          examples={[
            "SKR03: Wenn Sie Waren verkaufen (Handel, Produktion, E-Commerce)",
            "SKR04: Wenn Sie Dienstleistungen anbieten (Beratung, IT, Design)",
            "SKR49: Wenn Sie Freiberufler sind (Arzt, Anwalt, Architekt, Steuerberater)",
          ]}
          position="bottom"
          title="Kontenrahmen (SKR)"
        />
      </div>
    </div>
  );
};

export default SettingsBar;
