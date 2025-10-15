import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface DatenschutzProps {
	onBack: () => void;
}

const Datenschutz = ({ onBack }: DatenschutzProps) => {
	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			<div className="flex justify-start">
				<Button
					onClick={onBack}
					variant="ghost"
					className="mb-4 cursor-pointer"
				>
					<ArrowLeft className="mr-2" size={16} />
					Zurück zum Generator
				</Button>
			</div>

			<div>
				<div className="mb-6">
					<h1 className="text-4xl mb-2 text-left">Datenschutzerklärung</h1>
					<p className="text-muted-foreground text-left">
						Informationen zur Datenverarbeitung gemäß DSGVO
					</p>
				</div>
				<div className="space-y-6 text-left">
					<section>
						<h2 className="text-2xl mb-3">1. Verantwortliche Stelle</h2>
						<p className="text-muted-foreground leading-relaxed">
							Verantwortlich für die Datenverarbeitung auf dieser Website:
						</p>
						<address className="not-italic text-muted-foreground leading-relaxed mt-3">
							Torsten Linnecke
							<br />
							Sudenburger Str. 23
							<br />
							39112 Magdeburg
							<br />
							E-Mail: me@torsten-linnecke.de
						</address>
					</section>

					<section>
						<h2 className="text-2xl mb-3">
							2. Wichtiger Hinweis: Lokale Datenverarbeitung
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Der EÜR Generator verarbeitet alle hochgeladenen CSV-Dateien{" "}
							<strong>ausschließlich lokal in Ihrem Browser</strong>. Es werden{" "}
							<strong>keine</strong> Transaktionsdaten, Bankdaten oder
							persönliche Finanzinformationen an unsere Server übertragen oder
							gespeichert.
						</p>
						<p className="text-muted-foreground leading-relaxed mt-3">
							Die gesamte Berechnung und Kategorisierung Ihrer Transaktionen
							erfolgt clientseitig in Ihrem Browser. Ihre sensiblen Finanzdaten
							verlassen niemals Ihr Gerät.
						</p>
					</section>

					<section>
						<h2 className="text-2xl mb-3">
							3. Umami Analytics (anonymisierte Nutzungsstatistiken)
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							Diese Website nutzt Umami Analytics zur anonymen Erfassung von
							Nutzungsstatistiken. Umami ist eine datenschutzfreundliche
							Alternative zu Google Analytics.
						</p>

						<h3 className="text-xl mb-2 mt-4">
							Was macht Umami besonders datenschutzfreundlich?
						</h3>
						<ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3">
							<li>
								<strong>Keine Cookies</strong> – Es werden keine
								Tracking-Cookies gesetzt
							</li>
							<li>
								<strong>Keine IP-Speicherung</strong> – IP-Adressen werden nicht
								gespeichert
							</li>
							<li>
								<strong>Keine personenbezogenen Daten</strong> – Es werden
								ausschließlich aggregierte Statistiken erfasst
							</li>
							<li>
								<strong>Keine Nutzer-Identifikation</strong> – Einzelne Nutzer
								können nicht identifiziert oder verfolgt werden
							</li>
						</ul>

						<h3 className="text-xl mb-2 mt-4">
							Welche Informationen werden erfasst?
						</h3>
						<p className="text-muted-foreground leading-relaxed">
							Folgende technische Informationen werden in anonymisierter,
							aggregierter Form erfasst:
						</p>
						<ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3">
							<li>Seitenaufrufe</li>
							<li>Ungefähre Herkunft (Land, abgeleitet ohne IP-Speicherung)</li>
							<li>Gerätetyp (Desktop, Mobile, Tablet)</li>
							<li>Browsertyp</li>
							<li>Betriebssystem</li>
							<li>Referrer (woher der Besucher kam)</li>
						</ul>

						<h3 className="text-xl mb-2 mt-4">Rechtsgrundlage</h3>
						<p className="text-muted-foreground leading-relaxed">
							Die Nutzung von Umami erfolgt auf Grundlage von Art. 6 Abs. 1 lit.
							f DSGVO (berechtigtes Interesse). Unser berechtigtes Interesse
							liegt in der Optimierung und Verbesserung dieser Website.
						</p>
						<p className="text-muted-foreground leading-relaxed mt-3">
							<strong>Keine Einwilligung erforderlich:</strong> Da Umami keine
							personenbezogenen Daten verarbeitet und keine Cookies verwendet,
							ist keine Einwilligung (Cookie-Banner) erforderlich.
						</p>
					</section>

					<section>
						<h2 className="text-2xl mb-3">4. Ihre Rechte nach DSGVO</h2>
						<p className="text-muted-foreground leading-relaxed mb-3">
							Sie haben grundsätzlich folgende Rechte:
						</p>
						<ul className="list-disc list-inside text-muted-foreground space-y-2">
							<li>Recht auf Auskunft (Art. 15 DSGVO)</li>
							<li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
							<li>Recht auf Löschung (Art. 17 DSGVO)</li>
							<li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
							<li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
							<li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
							<li>
								Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)
							</li>
						</ul>
						<p className="text-muted-foreground leading-relaxed mt-4">
							<strong>Hinweis:</strong> Da wir keine personenbezogenen Daten
							über Sie speichern (weder durch den EÜR Generator noch durch Umami
							Analytics), können die meisten dieser Rechte nicht ausgeübt
							werden, da schlicht keine Daten vorhanden sind.
						</p>
					</section>

					<section>
						<h2 className="text-2xl mb-3">5. Hosting</h2>
						<p className="text-muted-foreground leading-relaxed">
							Diese Website wird extern gehostet. Die dabei vom Hosting-Provider
							verarbeiteten Daten beschränken sich auf technisch notwendige
							Server-Log-Dateien (z.B. IP-Adresse, Browsertyp, Zeitpunkt des
							Zugriffs), die für den technischen Betrieb der Website
							erforderlich sind.
						</p>
						<p className="text-muted-foreground leading-relaxed mt-3">
							Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
							Interesse an sicherer, schneller und effizienter Bereitstellung
							der Website).
						</p>
					</section>

					<section className="pt-6 border-t border-border">
						<p className="text-xs text-muted-foreground">
							Stand:{" "}
							{new Date().toLocaleDateString("de-DE", {
								year: "numeric",
								month: "long",
							})}
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Datenschutz;
