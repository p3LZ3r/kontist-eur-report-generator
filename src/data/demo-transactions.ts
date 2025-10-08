// Demo transaction data for testing the EÜR generator
// These are realistic business transactions distributed over 2024

export interface DemoTransaction {
  Buchungsdatum: string;
  Betrag: string;
  Verwendungszweck: string;
  Empfänger: string;
}

export const demoTransactions: DemoTransaction[] = [
  // January 2024
  { Buchungsdatum: "2024-01-03", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-01-05", Betrag: "2850,00", Verwendungszweck: "RG 001 - Webentwicklung Projekt Alpha", Empfänger: "TechStart GmbH" },
  { Buchungsdatum: "2024-01-08", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-01-12", Betrag: "-1250,00", Verwendungszweck: "Büromiete Januar", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-01-15", Betrag: "1420,00", Verwendungszweck: "RG 002 - Beratungsleistungen", Empfänger: "ConsultingPro AG" },
  { Buchungsdatum: "2024-01-18", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Adobe Creative Suite", Empfänger: "Adobe Systems" },
  { Buchungsdatum: "2024-01-22", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Januar", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-01-25", Betrag: "1980,00", Verwendungszweck: "RG 003 - App-Entwicklung", Empfänger: "MobileApps Ltd" },
  { Buchungsdatum: "2024-01-28", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-01-30", Betrag: "-67,80", Verwendungszweck: "Büromaterial - Ordner und Hefter", Empfänger: "Schreibwaren Klein" },

  // February 2024
  { Buchungsdatum: "2024-02-02", Betrag: "-156,00", Verwendungszweck: "Betriebshaftpflichtversicherung", Empfänger: "Allianz Versicherung" },
  { Buchungsdatum: "2024-02-05", Betrag: "3200,00", Verwendungszweck: "RG 004 - E-Commerce Plattform", Empfänger: "OnlineShop Solutions" },
  { Buchungsdatum: "2024-02-08", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-02-12", Betrag: "-1250,00", Verwendungszweck: "Büromiete Februar", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-02-14", Betrag: "-245,00", Verwendungszweck: "Google Ads Werbekampagne", Empfänger: "Google Ireland" },
  { Buchungsdatum: "2024-02-16", Betrag: "1850,00", Verwendungszweck: "RG 005 - Datenbankentwicklung", Empfänger: "DataTech GmbH" },
  { Buchungsdatum: "2024-02-20", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Februar", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-02-22", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Microsoft Office", Empfänger: "Microsoft Deutschland" },
  { Buchungsdatum: "2024-02-26", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Shell Tankstelle" },
  { Buchungsdatum: "2024-02-28", Betrag: "2650,00", Verwendungszweck: "RG 006 - Website-Redesign", Empfänger: "WebDesign Pro" },

  // March 2024
  { Buchungsdatum: "2024-03-01", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-03-05", Betrag: "2100,00", Verwendungszweck: "RG 007 - SEO-Optimierung", Empfänger: "DigitalMarketing AG" },
  { Buchungsdatum: "2024-03-08", Betrag: "-1250,00", Verwendungszweck: "Büromiete März", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-03-12", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-03-15", Betrag: "-320,00", Verwendungszweck: "Fachbuch - Programmierung", Empfänger: "O'Reilly Verlag" },
  { Buchungsdatum: "2024-03-18", Betrag: "3450,00", Verwendungszweck: "RG 008 - CRM-System Entwicklung", Empfänger: "BusinessTech Solutions" },
  { Buchungsdatum: "2024-03-22", Betrag: "-35,50", Verwendungszweck: "Telefonkosten März", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-03-25", Betrag: "-156,00", Verwendungszweck: "Cyber-Versicherung", Empfänger: "Hiscox Versicherung" },
  { Buchungsdatum: "2024-03-28", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Slack Pro", Empfänger: "Slack Technologies" },
  { Buchungsdatum: "2024-03-30", Betrag: "1780,00", Verwendungszweck: "RG 009 - API-Entwicklung", Empfänger: "APITech GmbH" },

  // April 2024
  { Buchungsdatum: "2024-04-02", Betrag: "-1250,00", Verwendungszweck: "Büromiete April", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-04-05", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-04-08", Betrag: "4200,00", Verwendungszweck: "RG 010 - Mobile App Entwicklung", Empfänger: "MobileFirst AG" },
  { Buchungsdatum: "2024-04-12", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-04-15", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-04-18", Betrag: "-245,00", Verwendungszweck: "Facebook Ads Werbekampagne", Empfänger: "Meta Platforms" },
  { Buchungsdatum: "2024-04-22", Betrag: "-35,50", Verwendungszweck: "Telefonkosten April", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-04-25", Betrag: "2980,00", Verwendungszweck: "RG 011 - Cloud-Migration", Empfänger: "CloudTech Solutions" },
  { Buchungsdatum: "2024-04-28", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Aral Tankstelle" },
  { Buchungsdatum: "2024-04-30", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Figma Professional", Empfänger: "Figma Inc" },

  // May 2024
  { Buchungsdatum: "2024-05-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete Mai", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-05-06", Betrag: "2350,00", Verwendungszweck: "RG 012 - Datenanalyse Projekt", Empfänger: "AnalyticsPro GmbH" },
  { Buchungsdatum: "2024-05-09", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-05-12", Betrag: "-156,00", Verwendungszweck: "Rechtsschutzversicherung", Empfänger: "Allianz Versicherung" },
  { Buchungsdatum: "2024-05-15", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Mai", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-05-18", Betrag: "3650,00", Verwendungszweck: "RG 013 - ERP-System Integration", Empfänger: "EnterpriseTech AG" },
  { Buchungsdatum: "2024-05-22", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-05-25", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz GitHub Pro", Empfänger: "GitHub Inc" },
  { Buchungsdatum: "2024-05-28", Betrag: "-320,00", Verwendungszweck: "Fachbuch - Datenbanken", Empfänger: "dpunkt.verlag" },
  { Buchungsdatum: "2024-05-30", Betrag: "1890,00", Verwendungszweck: "RG 014 - Performance-Optimierung", Empfänger: "SpeedTech Solutions" },

  // June 2024
  { Buchungsdatum: "2024-06-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete Juni", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-06-06", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-06-09", Betrag: "4100,00", Verwendungszweck: "RG 015 - E-Learning Plattform", Empfänger: "EduTech GmbH" },
  { Buchungsdatum: "2024-06-12", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Juni", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-06-15", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-06-18", Betrag: "-245,00", Verwendungszweck: "Google Ads Werbekampagne", Empfänger: "Google Ireland" },
  { Buchungsdatum: "2024-06-22", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Notion Pro", Empfänger: "Notion Labs" },
  { Buchungsdatum: "2024-06-25", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Shell Tankstelle" },
  { Buchungsdatum: "2024-06-28", Betrag: "2750,00", Verwendungszweck: "RG 016 - IoT-System Entwicklung", Empfänger: "IoTInnovations AG" },
  { Buchungsdatum: "2024-06-30", Betrag: "-156,00", Verwendungszweck: "Betriebshaftpflichtversicherung", Empfänger: "Allianz Versicherung" },

  // July 2024
  { Buchungsdatum: "2024-07-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete Juli", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-07-06", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-07-09", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-07-12", Betrag: "3250,00", Verwendungszweck: "RG 017 - Blockchain Integration", Empfänger: "BlockchainTech Ltd" },
  { Buchungsdatum: "2024-07-15", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Juli", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-07-18", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz JetBrains", Empfänger: "JetBrains s.r.o" },
  { Buchungsdatum: "2024-07-22", Betrag: "-320,00", Verwendungszweck: "Fachbuch - Machine Learning", Empfänger: "O'Reilly Verlag" },
  { Buchungsdatum: "2024-07-25", Betrag: "1980,00", Verwendungszweck: "RG 018 - Chatbot Entwicklung", Empfänger: "AITech Solutions" },
  { Buchungsdatum: "2024-07-28", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Aral Tankstelle" },
  { Buchungsdatum: "2024-07-30", Betrag: "-156,00", Verwendungszweck: "Cyber-Versicherung", Empfänger: "Hiscox Versicherung" },

  // August 2024
  { Buchungsdatum: "2024-08-02", Betrag: "-1250,00", Verwendungszweck: "Büromiete August", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-08-05", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-08-08", Betrag: "4450,00", Verwendungszweck: "RG 019 - AI-System Entwicklung", Empfänger: "AIInnovations GmbH" },
  { Buchungsdatum: "2024-08-12", Betrag: "-35,50", Verwendungszweck: "Telefonkosten August", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-08-15", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-08-18", Betrag: "-245,00", Verwendungszweck: "Facebook Ads Werbekampagne", Empfänger: "Meta Platforms" },
  { Buchungsdatum: "2024-08-22", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-08-25", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz VS Code Pro", Empfänger: "Microsoft Deutschland" },
  { Buchungsdatum: "2024-08-28", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Shell Tankstelle" },
  { Buchungsdatum: "2024-08-30", Betrag: "2850,00", Verwendungszweck: "RG 020 - Microservices Architektur", Empfänger: "CloudArchitecture AG" },

  // September 2024
  { Buchungsdatum: "2024-09-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete September", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-09-06", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-09-09", Betrag: "-35,50", Verwendungszweck: "Telefonkosten September", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-09-12", Betrag: "3650,00", Verwendungszweck: "RG 021 - DevOps Implementation", Empfänger: "DevOpsPro GmbH" },
  { Buchungsdatum: "2024-09-15", Betrag: "-156,00", Verwendungszweck: "Betriebshaftpflichtversicherung", Empfänger: "Allianz Versicherung" },
  { Buchungsdatum: "2024-09-18", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Docker", Empfänger: "Docker Inc" },
  { Buchungsdatum: "2024-09-22", Betrag: "-320,00", Verwendungszweck: "Fachbuch - Cloud Computing", Empfänger: "dpunkt.verlag" },
  { Buchungsdatum: "2024-09-25", Betrag: "2250,00", Verwendungszweck: "RG 022 - Security Audit", Empfänger: "SecurityExperts AG" },
  { Buchungsdatum: "2024-09-28", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Aral Tankstelle" },
  { Buchungsdatum: "2024-09-30", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },

  // October 2024
  { Buchungsdatum: "2024-10-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete Oktober", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-10-06", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-10-09", Betrag: "3950,00", Verwendungszweck: "RG 023 - Mobile App Store Optimization", Empfänger: "AppStorePro Ltd" },
  { Buchungsdatum: "2024-10-12", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Oktober", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-10-15", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-10-18", Betrag: "-245,00", Verwendungszweck: "Google Ads Werbekampagne", Empfänger: "Google Ireland" },
  { Buchungsdatum: "2024-10-22", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz AWS", Empfänger: "Amazon Web Services" },
  { Buchungsdatum: "2024-10-25", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Shell Tankstelle" },
  { Buchungsdatum: "2024-10-28", Betrag: "2850,00", Verwendungszweck: "RG 024 - API Gateway Implementation", Empfänger: "GatewayTech Solutions" },
  { Buchungsdatum: "2024-10-30", Betrag: "-156,00", Verwendungszweck: "Cyber-Versicherung", Empfänger: "Hiscox Versicherung" },

  // November 2024
  { Buchungsdatum: "2024-11-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete November", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-11-06", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-11-09", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-11-12", Betrag: "-35,50", Verwendungszweck: "Telefonkosten November", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-11-15", Betrag: "3150,00", Verwendungszweck: "RG 025 - Data Pipeline Development", Empfänger: "DataFlow AG" },
  { Buchungsdatum: "2024-11-18", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz Kubernetes", Empfänger: "CNCF" },
  { Buchungsdatum: "2024-11-22", Betrag: "-320,00", Verwendungszweck: "Fachbuch - Software Architecture", Empfänger: "O'Reilly Verlag" },
  { Buchungsdatum: "2024-11-25", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Aral Tankstelle" },
  { Buchungsdatum: "2024-11-28", Betrag: "2450,00", Verwendungszweck: "RG 026 - Performance Monitoring", Empfänger: "MonitoringTech GmbH" },
  { Buchungsdatum: "2024-11-30", Betrag: "-156,00", Verwendungszweck: "Betriebshaftpflichtversicherung", Empfänger: "Allianz Versicherung" },

  // December 2024
  { Buchungsdatum: "2024-12-03", Betrag: "-1250,00", Verwendungszweck: "Büromiete Dezember", Empfänger: "Immobilien Schmidt" },
  { Buchungsdatum: "2024-12-06", Betrag: "-89,50", Verwendungszweck: "Büromaterial - Druckerpapier und Stifte", Empfänger: "Bürobedarf Müller" },
  { Buchungsdatum: "2024-12-09", Betrag: "-35,50", Verwendungszweck: "Telefonkosten Dezember", Empfänger: "Vodafone" },
  { Buchungsdatum: "2024-12-12", Betrag: "4750,00", Verwendungszweck: "RG 027 - Jahresabschluss Projekt", Empfänger: "YearEndSolutions AG" },
  { Buchungsdatum: "2024-12-15", Betrag: "-450,00", Verwendungszweck: "Steuerberater-Honorar", Empfänger: "Steuerkanzlei Weber" },
  { Buchungsdatum: "2024-12-18", Betrag: "-245,00", Verwendungszweck: "Facebook Ads Werbekampagne", Empfänger: "Meta Platforms" },
  { Buchungsdatum: "2024-12-20", Betrag: "-45,90", Verwendungszweck: "Monatliche Internetgebühr", Empfänger: "Telekom Deutschland" },
  { Buchungsdatum: "2024-12-23", Betrag: "-89,90", Verwendungszweck: "Software-Lizenz GitLab", Empfänger: "GitLab Inc" },
  { Buchungsdatum: "2024-12-28", Betrag: "-178,00", Verwendungszweck: "Treibstoff Tankstelle", Empfänger: "Shell Tankstelle" },
  { Buchungsdatum: "2024-12-30", Betrag: "3550,00", Verwendungszweck: "RG 028 - System Migration", Empfänger: "MigrationTech Solutions" },

  // Additional diverse transactions for more ELSTER field coverage
  { Buchungsdatum: "2024-06-10", Betrag: "-2500,00", Verwendungszweck: "Laptop Dell XPS 15 - Anschaffung", Empfänger: "Dell Deutschland" },
  { Buchungsdatum: "2024-08-15", Betrag: "-850,00", Verwendungszweck: "Monitor Samsung 32\" - Anschaffung", Empfänger: "Samsung Electronics" },
  { Buchungsdatum: "2024-03-20", Betrag: "-1200,00", Verwendungszweck: "Ergonomischer Bürostuhl", Empfänger: "Herman Miller" },
  { Buchungsdatum: "2024-09-10", Betrag: "-450,00", Verwendungszweck: "Standing Desk elektrisch", Empfänger: "FlexiSpot" },
  { Buchungsdatum: "2024-11-05", Betrag: "-180,00", Verwendungszweck: "Externe Festplatte 2TB", Empfänger: "Western Digital" },
  { Buchungsdatum: "2024-04-25", Betrag: "-320,00", Verwendungszweck: "Mechanische Tastatur", Empfänger: "Keychron" },
  { Buchungsdatum: "2024-07-08", Betrag: "-150,00", Verwendungszweck: "Gaming Maus Logitech", Empfänger: "Logitech Deutschland" },
  { Buchungsdatum: "2024-10-12", Betrag: "-95,00", Verwendungszweck: "USB-C Hub mit 4 Ports", Empfänger: "Anker" },
  { Buchungsdatum: "2024-02-28", Betrag: "-75,00", Verwendungszweck: "Bluetooth Kopfhörer", Empfänger: "Sony Deutschland" },
  { Buchungsdatum: "2024-05-18", Betrag: "-120,00", Verwendungszweck: "Webcam HD 1080p", Empfänger: "Logitech Deutschland" },

  // Personnel costs (field 30)
  { Buchungsdatum: "2024-01-31", Betrag: "-2800,00", Verwendungszweck: "Freelancer Honorar - UI/UX Designer", Empfänger: "Sarah Weber" },
  { Buchungsdatum: "2024-02-29", Betrag: "-3200,00", Verwendungszweck: "Freelancer Honorar - Frontend Entwickler", Empfänger: "Max Müller" },
  { Buchungsdatum: "2024-03-31", Betrag: "-2400,00", Verwendungszweck: "Freelancer Honorar - Backend Entwickler", Empfänger: "Lisa Schmidt" },
  { Buchungsdatum: "2024-04-30", Betrag: "-1800,00", Verwendungszweck: "Freelancer Honorar - QA Tester", Empfänger: "Tom Becker" },
  { Buchungsdatum: "2024-05-31", Betrag: "-2100,00", Verwendungszweck: "Freelancer Honorar - DevOps Engineer", Empfänger: "Anna Klein" },

  // Travel and vehicle costs (field 44)
  { Buchungsdatum: "2024-03-15", Betrag: "-45,00", Verwendungszweck: "Bahnfahrt Berlin - Geschäftsreise", Empfänger: "Deutsche Bahn" },
  { Buchungsdatum: "2024-06-22", Betrag: "-85,00", Verwendungszweck: "Bahnfahrt Hamburg - Kundentermin", Empfänger: "Deutsche Bahn" },
  { Buchungsdatum: "2024-09-18", Betrag: "-120,00", Verwendungszweck: "Bahnfahrt Frankfurt - Messe", Empfänger: "Deutsche Bahn" },
  { Buchungsdatum: "2024-11-08", Betrag: "-65,00", Verwendungszweck: "Bahnfahrt München - Workshop", Empfänger: "Deutsche Bahn" },
  { Buchungsdatum: "2024-12-12", Betrag: "-95,00", Verwendungszweck: "Bahnfahrt Köln - Konferenz", Empfänger: "Deutsche Bahn" },

  // VAT payments (field 58)
  { Buchungsdatum: "2024-03-10", Betrag: "-1250,00", Verwendungszweck: "Umsatzsteuer Q1 2024", Empfänger: "Finanzamt München" },
  { Buchungsdatum: "2024-06-10", Betrag: "-1680,00", Verwendungszweck: "Umsatzsteuer Q2 2024", Empfänger: "Finanzamt München" },
  { Buchungsdatum: "2024-09-10", Betrag: "-1420,00", Verwendungszweck: "Umsatzsteuer Q3 2024", Empfänger: "Finanzamt München" },
  { Buchungsdatum: "2024-12-10", Betrag: "-1950,00", Verwendungszweck: "Umsatzsteuer Q4 2024", Empfänger: "Finanzamt München" },

  // VAT refunds (field 18)
  { Buchungsdatum: "2024-04-15", Betrag: "450,00", Verwendungszweck: "Umsatzsteuer-Erstattung März", Empfänger: "Finanzamt München" },
  { Buchungsdatum: "2024-07-20", Betrag: "320,00", Verwendungszweck: "Umsatzsteuer-Erstattung Juni", Empfänger: "Finanzamt München" },

  // Other business expenses
  { Buchungsdatum: "2024-01-15", Betrag: "-180,00", Verwendungszweck: "Rechtsschutzversicherung", Empfänger: "Allianz Versicherung" },
  { Buchungsdatum: "2024-04-20", Betrag: "-95,00", Verwendungszweck: "Berufshaftpflichtversicherung", Empfänger: "Hiscox Versicherung" },
  { Buchungsdatum: "2024-08-10", Betrag: "-250,00", Verwendungszweck: "Gewerbeversicherung", Empfänger: "AXA Versicherung" },
  { Buchungsdatum: "2024-11-25", Betrag: "-120,00", Verwendungszweck: "Cyber-Versicherung", Empfänger: "Hiscox Versicherung" },
  { Buchungsdatum: "2024-02-10", Betrag: "-75,00", Verwendungszweck: "Gewerbeanmeldung", Empfänger: "Stadt München" },
  { Buchungsdatum: "2024-05-15", Betrag: "-45,00", Verwendungszweck: "Handelsregistereintrag", Empfänger: "Amtsgericht München" },
  { Buchungsdatum: "2024-09-05", Betrag: "-85,00", Verwendungszweck: "Notarkosten Vertragsprüfung", Empfänger: "Notar Dr. Weber" },
  { Buchungsdatum: "2024-12-20", Betrag: "-150,00", Verwendungszweck: "Anwaltskosten Beratung", Empfänger: "Rechtsanwaltskanzlei Müller" },

  // Private transactions (not EÜR relevant)
  { Buchungsdatum: "2024-01-20", Betrag: "-89,90", Verwendungszweck: "Amazon Prime Jahresabo", Empfänger: "Amazon Deutschland" },
  { Buchungsdatum: "2024-03-10", Betrag: "-156,00", Verwendungszweck: "Netflix Jahresabo", Empfänger: "Netflix International" },
  { Buchungsdatum: "2024-05-20", Betrag: "-45,90", Verwendungszweck: "Spotify Premium", Empfänger: "Spotify AB" },
  { Buchungsdatum: "2024-07-15", Betrag: "-89,90", Verwendungszweck: "Apple iCloud Storage", Empfänger: "Apple Distribution" },
  { Buchungsdatum: "2024-09-25", Betrag: "-67,80", Verwendungszweck: "Disney+ Jahresabo", Empfänger: "Disney Streaming Services" },
  { Buchungsdatum: "2024-11-15", Betrag: "-234,50", Verwendungszweck: "Einkommensteuer Vorauszahlung", Empfänger: "Finanzamt München" },
  { Buchungsdatum: "2024-12-10", Betrag: "-178,00", Verwendungszweck: "Solidaritätszuschlag", Empfänger: "Finanzamt München" }
];
