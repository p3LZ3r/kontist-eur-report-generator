// Demo transaction data for testing the EÜR generator
// These are realistic business transactions distributed over 2024

export interface DemoTransaction {
	Buchungsdatum: string;
	Betrag: string;
	Verwendungszweck: string;
	Empfänger: string;
}

export const demoTransactions: DemoTransaction[] = [
	// Q1 2024 - Diversifizierte Einnahmen
	{
		Buchungsdatum: "2024-01-05",
		Betrag: "4850,00",
		Verwendungszweck: "RG 001 - Webentwicklung Projekt Alpha",
		Empfänger: "TechStart GmbH",
	},
	{
		Buchungsdatum: "2024-01-12",
		Betrag: "1200,00",
		Verwendungszweck: "RG 002 - Schulungshonorar JavaScript",
		Empfänger: "CodeAcademy GmbH",
	},
	{
		Buchungsdatum: "2024-01-20",
		Betrag: "3200,00",
		Verwendungszweck: "RG 003 - Warenverkauf Software-Module",
		Empfänger: "SoftwareHouse AG",
	},
	{
		Buchungsdatum: "2024-01-25",
		Betrag: "850,00",
		Verwendungszweck: "RG 004 - Provisionseinnahmen Vermittlung",
		Empfänger: "PartnerNetwork Ltd",
	},
	{
		Buchungsdatum: "2024-02-08",
		Betrag: "2650,00",
		Verwendungszweck: "RG 005 - Lizenzeinnahmen Software-Patent",
		Empfänger: "LicenseTech AG",
	},
	{
		Buchungsdatum: "2024-02-15",
		Betrag: "5200,00",
		Verwendungszweck: "RG 006 - E-Commerce Plattform",
		Empfänger: "OnlineShop Solutions",
	},
	{
		Buchungsdatum: "2024-02-28",
		Betrag: "1950,00",
		Verwendungszweck: "RG 007 - Autorenhonorar Fachbuch",
		Empfänger: "Verlag Schmidt",
	},
	{
		Buchungsdatum: "2024-03-10",
		Betrag: "3800,00",
		Verwendungszweck: "RG 008 - Warenverkauf E-Books und Kurse",
		Empfänger: "DigitalStore GmbH",
	},
	{
		Buchungsdatum: "2024-03-18",
		Betrag: "6450,00",
		Verwendungszweck: "RG 009 - CRM-System Entwicklung",
		Empfänger: "BusinessTech Solutions",
	},
	{
		Buchungsdatum: "2024-03-25",
		Betrag: "1400,00",
		Verwendungszweck: "RG 010 - Schulungshonorar React & TypeScript",
		Empfänger: "WebDev Academy",
	},

	// Q1 2024 - Diversifizierte Ausgaben
	{
		Buchungsdatum: "2024-01-10",
		Betrag: "-3200,00",
		Verwendungszweck: "Wareneinkauf - Elektronikbauteile und Komponenten",
		Empfänger: "Conrad Electronic",
	},
	{
		Buchungsdatum: "2024-01-15",
		Betrag: "-1850,00",
		Verwendungszweck: "Laptop MacBook Pro M3",
		Empfänger: "Apple Store München",
	},
	{
		Buchungsdatum: "2024-01-20",
		Betrag: "-750,00",
		Verwendungszweck: "Monitor Dell UltraSharp 32 4K",
		Empfänger: "Dell Deutschland",
	},
	{
		Buchungsdatum: "2024-01-25",
		Betrag: "-3750,00",
		Verwendungszweck: "Büromiete Q1 2024 (3 Monate)",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-02-05",
		Betrag: "-2400,00",
		Verwendungszweck: "Wareneinkauf Handelswaren für Wiederverkauf",
		Empfänger: "Großhandel Meyer",
	},
	{
		Buchungsdatum: "2024-02-10",
		Betrag: "-890,00",
		Verwendungszweck: "Schreibtisch elektrisch höhenverstellbar",
		Empfänger: "Büromöbel24",
	},
	{
		Buchungsdatum: "2024-02-15",
		Betrag: "-650,00",
		Verwendungszweck: "Bürostuhl ergonomisch Herman Miller",
		Empfänger: "Office Depot",
	},
	{
		Buchungsdatum: "2024-02-20",
		Betrag: "-1350,00",
		Verwendungszweck: "Steuerberater Jahresabschluss 2023",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-02-28",
		Betrag: "-580,00",
		Verwendungszweck: "Google Ads + Meta Ads Kampagnen",
		Empfänger: "Google & Meta Platforms",
	},
	{
		Buchungsdatum: "2024-03-05",
		Betrag: "-2800,00",
		Verwendungszweck: "Wareneinkauf Hardware-Komponenten Lager",
		Empfänger: "TechSupply GmbH",
	},
	{
		Buchungsdatum: "2024-03-10",
		Betrag: "-320,00",
		Verwendungszweck: "Fachbücher - Programmierung und Cloud",
		Empfänger: "O'Reilly Verlag",
	},
	{
		Buchungsdatum: "2024-03-15",
		Betrag: "-285,90",
		Verwendungszweck: "Software-Lizenzen (Adobe, Office 365, GitHub)",
		Empfänger: "Software-Abos",
	},
	{
		Buchungsdatum: "2024-03-20",
		Betrag: "-468,00",
		Verwendungszweck: "Versicherungen (Haftpflicht, Cyber, Rechtsschutz)",
		Empfänger: "Allianz & Hiscox",
	},
	{
		Buchungsdatum: "2024-03-25",
		Betrag: "-390,00",
		Verwendungszweck: "KFZ-Kosten (Treibstoff, Wartung)",
		Empfänger: "Shell & Autowerkstatt",
	},
	{
		Buchungsdatum: "2024-03-28",
		Betrag: "-245,00",
		Verwendungszweck: "Telefon & Internet (3 Monate)",
		Empfänger: "Telekom & Vodafone",
	},
	{
		Buchungsdatum: "2024-03-30",
		Betrag: "-189,50",
		Verwendungszweck: "Büromaterial & Verbrauchsmaterial",
		Empfänger: "Bürobedarf Müller",
	},

	// Private transactions (not business-related)
	{
		Buchungsdatum: "2024-01-15",
		Betrag: "-89,90",
		Verwendungszweck: "Amazon Prime Jahresabo",
		Empfänger: "Amazon Deutschland",
	},
	{
		Buchungsdatum: "2024-02-10",
		Betrag: "-156,00",
		Verwendungszweck: "Netflix Jahresabo",
		Empfänger: "Netflix International",
	},
	{
		Buchungsdatum: "2024-03-20",
		Betrag: "-234,50",
		Verwendungszweck: "Einkommensteuer Vorauszahlung Q1",
		Empfänger: "Finanzamt München",
	},
	{
		Buchungsdatum: "2024-04-08",
		Betrag: "4200,00",
		Verwendungszweck: "RG 010 - Mobile App Entwicklung",
		Empfänger: "MobileFirst AG",
	},
	{
		Buchungsdatum: "2024-04-12",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-04-15",
		Betrag: "-450,00",
		Verwendungszweck: "Steuerberater-Honorar",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-04-18",
		Betrag: "-245,00",
		Verwendungszweck: "Facebook Ads Werbekampagne",
		Empfänger: "Meta Platforms",
	},
	{
		Buchungsdatum: "2024-04-22",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten April",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-04-25",
		Betrag: "2980,00",
		Verwendungszweck: "RG 011 - Cloud-Migration",
		Empfänger: "CloudTech Solutions",
	},
	{
		Buchungsdatum: "2024-04-28",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Aral Tankstelle",
	},
	{
		Buchungsdatum: "2024-04-30",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz Figma Professional",
		Empfänger: "Figma Inc",
	},

	// May 2024
	{
		Buchungsdatum: "2024-05-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete Mai",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-05-06",
		Betrag: "2350,00",
		Verwendungszweck: "RG 012 - Datenanalyse Projekt",
		Empfänger: "AnalyticsPro GmbH",
	},
	{
		Buchungsdatum: "2024-05-09",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-05-12",
		Betrag: "-156,00",
		Verwendungszweck: "Rechtsschutzversicherung",
		Empfänger: "Allianz Versicherung",
	},
	{
		Buchungsdatum: "2024-05-15",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten Mai",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-05-18",
		Betrag: "3650,00",
		Verwendungszweck: "RG 013 - ERP-System Integration",
		Empfänger: "EnterpriseTech AG",
	},
	{
		Buchungsdatum: "2024-05-22",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-05-25",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz GitHub Pro",
		Empfänger: "GitHub Inc",
	},
	{
		Buchungsdatum: "2024-05-28",
		Betrag: "-320,00",
		Verwendungszweck: "Fachbuch - Datenbanken",
		Empfänger: "dpunkt.verlag",
	},
	{
		Buchungsdatum: "2024-05-30",
		Betrag: "1890,00",
		Verwendungszweck: "RG 014 - Performance-Optimierung",
		Empfänger: "SpeedTech Solutions",
	},

	// June 2024
	{
		Buchungsdatum: "2024-06-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete Juni",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-06-06",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-06-09",
		Betrag: "4100,00",
		Verwendungszweck: "RG 015 - E-Learning Plattform",
		Empfänger: "EduTech GmbH",
	},
	{
		Buchungsdatum: "2024-06-12",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten Juni",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-06-15",
		Betrag: "-450,00",
		Verwendungszweck: "Steuerberater-Honorar",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-06-18",
		Betrag: "-245,00",
		Verwendungszweck: "Google Ads Werbekampagne",
		Empfänger: "Google Ireland",
	},
	{
		Buchungsdatum: "2024-06-22",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz Notion Pro",
		Empfänger: "Notion Labs",
	},
	{
		Buchungsdatum: "2024-06-25",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Shell Tankstelle",
	},
	{
		Buchungsdatum: "2024-06-28",
		Betrag: "2750,00",
		Verwendungszweck: "RG 016 - IoT-System Entwicklung",
		Empfänger: "IoTInnovations AG",
	},
	{
		Buchungsdatum: "2024-06-30",
		Betrag: "-156,00",
		Verwendungszweck: "Betriebshaftpflichtversicherung",
		Empfänger: "Allianz Versicherung",
	},

	// July 2024
	{
		Buchungsdatum: "2024-07-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete Juli",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-07-06",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-07-09",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-07-12",
		Betrag: "3250,00",
		Verwendungszweck: "RG 017 - Blockchain Integration",
		Empfänger: "BlockchainTech Ltd",
	},
	{
		Buchungsdatum: "2024-07-15",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten Juli",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-07-18",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz JetBrains",
		Empfänger: "JetBrains s.r.o",
	},
	{
		Buchungsdatum: "2024-07-22",
		Betrag: "-320,00",
		Verwendungszweck: "Fachbuch - Machine Learning",
		Empfänger: "O'Reilly Verlag",
	},
	{
		Buchungsdatum: "2024-07-25",
		Betrag: "1980,00",
		Verwendungszweck: "RG 018 - Chatbot Entwicklung",
		Empfänger: "AITech Solutions",
	},
	{
		Buchungsdatum: "2024-07-28",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Aral Tankstelle",
	},
	{
		Buchungsdatum: "2024-07-30",
		Betrag: "-156,00",
		Verwendungszweck: "Cyber-Versicherung",
		Empfänger: "Hiscox Versicherung",
	},

	// August 2024
	{
		Buchungsdatum: "2024-08-02",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete August",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-08-05",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-08-08",
		Betrag: "4450,00",
		Verwendungszweck: "RG 019 - AI-System Entwicklung",
		Empfänger: "AIInnovations GmbH",
	},
	{
		Buchungsdatum: "2024-08-12",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten August",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-08-15",
		Betrag: "-450,00",
		Verwendungszweck: "Steuerberater-Honorar",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-08-18",
		Betrag: "-245,00",
		Verwendungszweck: "Facebook Ads Werbekampagne",
		Empfänger: "Meta Platforms",
	},
	{
		Buchungsdatum: "2024-08-22",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-08-25",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz VS Code Pro",
		Empfänger: "Microsoft Deutschland",
	},
	{
		Buchungsdatum: "2024-08-28",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Shell Tankstelle",
	},
	{
		Buchungsdatum: "2024-08-30",
		Betrag: "2850,00",
		Verwendungszweck: "RG 020 - Microservices Architektur",
		Empfänger: "CloudArchitecture AG",
	},

	// September 2024
	{
		Buchungsdatum: "2024-09-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete September",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-09-06",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-09-09",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten September",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-09-12",
		Betrag: "3650,00",
		Verwendungszweck: "RG 021 - DevOps Implementation",
		Empfänger: "DevOpsPro GmbH",
	},
	{
		Buchungsdatum: "2024-09-15",
		Betrag: "-156,00",
		Verwendungszweck: "Betriebshaftpflichtversicherung",
		Empfänger: "Allianz Versicherung",
	},
	{
		Buchungsdatum: "2024-09-18",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz Docker",
		Empfänger: "Docker Inc",
	},
	{
		Buchungsdatum: "2024-09-22",
		Betrag: "-320,00",
		Verwendungszweck: "Fachbuch - Cloud Computing",
		Empfänger: "dpunkt.verlag",
	},
	{
		Buchungsdatum: "2024-09-25",
		Betrag: "2250,00",
		Verwendungszweck: "RG 022 - Security Audit",
		Empfänger: "SecurityExperts AG",
	},
	{
		Buchungsdatum: "2024-09-28",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Aral Tankstelle",
	},
	{
		Buchungsdatum: "2024-09-30",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},

	// October 2024
	{
		Buchungsdatum: "2024-10-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete Oktober",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-10-06",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-10-09",
		Betrag: "3950,00",
		Verwendungszweck: "RG 023 - Mobile App Store Optimization",
		Empfänger: "AppStorePro Ltd",
	},
	{
		Buchungsdatum: "2024-10-12",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten Oktober",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-10-15",
		Betrag: "-450,00",
		Verwendungszweck: "Steuerberater-Honorar",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-10-18",
		Betrag: "-245,00",
		Verwendungszweck: "Google Ads Werbekampagne",
		Empfänger: "Google Ireland",
	},
	{
		Buchungsdatum: "2024-10-22",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz AWS",
		Empfänger: "Amazon Web Services",
	},
	{
		Buchungsdatum: "2024-10-25",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Shell Tankstelle",
	},
	{
		Buchungsdatum: "2024-10-28",
		Betrag: "2850,00",
		Verwendungszweck: "RG 024 - API Gateway Implementation",
		Empfänger: "GatewayTech Solutions",
	},
	{
		Buchungsdatum: "2024-10-30",
		Betrag: "-156,00",
		Verwendungszweck: "Cyber-Versicherung",
		Empfänger: "Hiscox Versicherung",
	},

	// November 2024
	{
		Buchungsdatum: "2024-11-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete November",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-11-06",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-11-09",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-11-12",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten November",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-11-15",
		Betrag: "3150,00",
		Verwendungszweck: "RG 025 - Data Pipeline Development",
		Empfänger: "DataFlow AG",
	},
	{
		Buchungsdatum: "2024-11-18",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz Kubernetes",
		Empfänger: "CNCF",
	},
	{
		Buchungsdatum: "2024-11-22",
		Betrag: "-320,00",
		Verwendungszweck: "Fachbuch - Software Architecture",
		Empfänger: "O'Reilly Verlag",
	},
	{
		Buchungsdatum: "2024-11-25",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Aral Tankstelle",
	},
	{
		Buchungsdatum: "2024-11-28",
		Betrag: "2450,00",
		Verwendungszweck: "RG 026 - Performance Monitoring",
		Empfänger: "MonitoringTech GmbH",
	},
	{
		Buchungsdatum: "2024-11-30",
		Betrag: "-156,00",
		Verwendungszweck: "Betriebshaftpflichtversicherung",
		Empfänger: "Allianz Versicherung",
	},

	// December 2024
	{
		Buchungsdatum: "2024-12-03",
		Betrag: "-1250,00",
		Verwendungszweck: "Büromiete Dezember",
		Empfänger: "Immobilien Schmidt",
	},
	{
		Buchungsdatum: "2024-12-06",
		Betrag: "-89,50",
		Verwendungszweck: "Büromaterial - Druckerpapier und Stifte",
		Empfänger: "Bürobedarf Müller",
	},
	{
		Buchungsdatum: "2024-12-09",
		Betrag: "-35,50",
		Verwendungszweck: "Telefonkosten Dezember",
		Empfänger: "Vodafone",
	},
	{
		Buchungsdatum: "2024-12-12",
		Betrag: "4750,00",
		Verwendungszweck: "RG 027 - Jahresabschluss Projekt",
		Empfänger: "YearEndSolutions AG",
	},
	{
		Buchungsdatum: "2024-12-15",
		Betrag: "-450,00",
		Verwendungszweck: "Steuerberater-Honorar",
		Empfänger: "Steuerkanzlei Weber",
	},
	{
		Buchungsdatum: "2024-12-18",
		Betrag: "-245,00",
		Verwendungszweck: "Facebook Ads Werbekampagne",
		Empfänger: "Meta Platforms",
	},
	{
		Buchungsdatum: "2024-12-20",
		Betrag: "-45,90",
		Verwendungszweck: "Monatliche Internetgebühr",
		Empfänger: "Telekom Deutschland",
	},
	{
		Buchungsdatum: "2024-12-23",
		Betrag: "-89,90",
		Verwendungszweck: "Software-Lizenz GitLab",
		Empfänger: "GitLab Inc",
	},
	{
		Buchungsdatum: "2024-12-28",
		Betrag: "-178,00",
		Verwendungszweck: "Treibstoff Tankstelle",
		Empfänger: "Shell Tankstelle",
	},
	{
		Buchungsdatum: "2024-12-30",
		Betrag: "3550,00",
		Verwendungszweck: "RG 028 - System Migration",
		Empfänger: "MigrationTech Solutions",
	},

	// Private transactions (not EÜR relevant)
	{
		Buchungsdatum: "2024-01-20",
		Betrag: "-89,90",
		Verwendungszweck: "Amazon Prime Jahresabo",
		Empfänger: "Amazon Deutschland",
	},
	{
		Buchungsdatum: "2024-03-10",
		Betrag: "-156,00",
		Verwendungszweck: "Netflix Jahresabo",
		Empfänger: "Netflix International",
	},
	{
		Buchungsdatum: "2024-05-20",
		Betrag: "-45,90",
		Verwendungszweck: "Spotify Premium",
		Empfänger: "Spotify AB",
	},
	{
		Buchungsdatum: "2024-07-15",
		Betrag: "-89,90",
		Verwendungszweck: "Apple iCloud Storage",
		Empfänger: "Apple Distribution",
	},
	{
		Buchungsdatum: "2024-09-25",
		Betrag: "-67,80",
		Verwendungszweck: "Disney+ Jahresabo",
		Empfänger: "Disney Streaming Services",
	},
	{
		Buchungsdatum: "2024-11-15",
		Betrag: "-234,50",
		Verwendungszweck: "Einkommensteuer Vorauszahlung",
		Empfänger: "Finanzamt München",
	},
	{
		Buchungsdatum: "2024-12-10",
		Betrag: "-178,00",
		Verwendungszweck: "Solidaritätszuschlag",
		Empfänger: "Finanzamt München",
	},
];
