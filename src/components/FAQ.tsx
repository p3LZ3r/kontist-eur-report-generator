import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItem {
	question: string;
	answer: string;
}

const faqData: FAQItem[] = [
	{
		question: "Was ist eine Einnahmen-Überschuss-Rechnung (EÜR)?",
		answer:
			"Die Einnahmen-Überschuss-Rechnung (EÜR) ist eine vereinfachte Form der Gewinnermittlung für Kleinunternehmer, Freiberufler und Selbstständige. Sie ist in § 4 Abs. 3 EStG geregelt und ermöglicht es, den Gewinn durch Gegenüberstellung der Betriebseinnahmen und Betriebsausgaben zu ermitteln.",
	},
	{
		question: "Welche CSV-Formate werden unterstützt?",
		answer:
			"Der EÜR Generator unterstützt CSV-Exporte von Kontist und Holvi. Beide Formate werden automatisch erkannt. Exportieren Sie einfach Ihre Transaktionen aus Ihrem Banking-Portal als CSV-Datei und laden Sie diese hoch.",
	},
	{
		question: "Werden meine Finanzdaten hochgeladen oder gespeichert?",
		answer:
			"Nein! Alle Berechnungen erfolgen ausschließlich lokal in Ihrem Browser. Ihre CSV-Dateien und Transaktionsdaten verlassen niemals Ihr Gerät und werden nirgendwo hochgeladen oder gespeichert. Dies gewährleistet maximale Datensicherheit und Privatsphäre.",
	},
	{
		question: "Was ist der Unterschied zwischen SKR03, SKR04 und SKR49?",
		answer:
			"SKR03, SKR04 und SKR49 sind verschiedene Kontenrahmen für die Buchhaltung: SKR03 ist für Industrie- und Handelsbetriebe (Prozessgliederung), SKR04 für Dienstleistungsunternehmen (Abschlussgliederung) und SKR49 speziell für Freiberufler und Selbstständige. Der Generator unterstützt alle drei Standards.",
	},
	{
		question: "Was bedeutet Kleinunternehmerregelung (§19 UStG)?",
		answer:
			"Die Kleinunternehmerregelung nach § 19 UStG befreit Sie von der Umsatzsteuerpflicht, wenn Ihr Jahresumsatz im Vorjahr unter 22.000 € lag und im laufenden Jahr 50.000 € voraussichtlich nicht übersteigt. Als Kleinunternehmer weisen Sie keine Umsatzsteuer aus und können keine Vorsteuer geltend machen.",
	},
	{
		question: "Wie funktioniert die automatische Kategorisierung?",
		answer:
			"Der Generator analysiert Verwendungszweck und Empfänger jeder Transaktion und ordnet sie automatisch passenden Konten zu. Sie können jede Kategorisierung manuell überprüfen und bei Bedarf anpassen. Die Kategorisierung basiert auf häufigen Geschäftsvorfällen und Schlüsselwörtern.",
	},
	{
		question: "Welche Export-Formate sind verfügbar?",
		answer:
			"Der Generator bietet mehrere Export-Optionen: ELSTER CSV (direkt importierbar), ELSTER JSON (strukturierte Daten), klassische EÜR-Übersicht (Textformat) und detaillierte PDF-Berichte mit allen Transaktionen. Alle Formate sind ELSTER-kompatibel.",
	},
	{
		question: "Kann ich die EÜR direkt bei ELSTER einreichen?",
		answer:
			"Der Generator erstellt ELSTER-konforme Übersichten, die Sie als Grundlage für Ihre Steuererklärung verwenden können. Die tatsächliche Übermittlung an das Finanzamt erfolgt über das offizielle ELSTER-Portal oder Ihre Steuersoftware. Sie können die generierten CSV/JSON-Dateien dort importieren.",
	},
	{
		question: "Ist der EÜR Generator kostenlos?",
		answer:
			"Ja, der EÜR Generator ist vollständig kostenlos und Open Source. Sie können ihn unbegrenzt nutzen, ohne Registrierung oder versteckte Kosten. Der Quellcode ist auf GitHub verfügbar.",
	},
	{
		question: "Ersetzt der Generator einen Steuerberater?",
		answer:
			"Nein. Der Generator ist ein Hilfswerkzeug zur Vorbereitung Ihrer EÜR, ersetzt aber keine steuerliche Beratung. Bei komplexen steuerlichen Fragen oder Unsicherheiten sollten Sie immer einen Steuerberater oder das Finanzamt konsultieren.",
	},
];

const FAQ = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	// Generate Schema.org FAQPage structured data
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqData.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<section className="space-y-6 mt-12">
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>

			<div>
				<div className="mb-6">
					<h2 className="text-3xl text-left">Häufig gestellte Fragen (FAQ)</h2>
					<p className="text-muted-foreground text-left">
						Antworten auf die wichtigsten Fragen zum EÜR Generator
					</p>
				</div>
				<div className="space-y-4">
					{faqData.map((item, index) => (
						<div
							key={index}
							className="border border-border rounded-lg overflow-hidden bg-card"
						>
							<button
								onClick={() => toggleFAQ(index)}
								className="w-full flex justify-between items-center p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
								aria-expanded={openIndex === index}
							>
								<span className="text-foreground pr-4">{item.question}</span>
								{openIndex === index ? (
									<ChevronUp
										size={20}
										className="flex-shrink-0 text-muted-foreground"
									/>
								) : (
									<ChevronDown
										size={20}
										className="flex-shrink-0 text-muted-foreground"
									/>
								)}
							</button>
							{openIndex === index && (
								<div className="p-4 pt-0 text-muted-foreground leading-relaxed animate-fade-in text-left">
									{item.answer}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQ;
