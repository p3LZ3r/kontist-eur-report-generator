import type { Transaction, CompanyInfo, EuerCalculation, KontenrahmenType } from '../types';
import { skr04Categories } from './categoryMappings';

export const generateReport = (
    euerCalculation: EuerCalculation,
    companyInfo: CompanyInfo | undefined,
    selectedKontenrahmen: KontenrahmenType,
    bankType: string | null,
    isKleinunternehmer: boolean,
    transactions: Transaction[]
): string => {
        const currentYear = new Date().getFullYear();
    const defaultCompanyInfo = { name: 'Ihr Unternehmen', address: 'Ihre Adresse', taxNumber: 'Ihre Steuernummer', vatNumber: 'Ihre USt-IdNr.' };
    const info = companyInfo || defaultCompanyInfo;
    return `EINNAHMEN-ÜBERSCHUSS-RECHNUNG ${currentYear} (${selectedKontenrahmen})</search>
</search_and_replace>
====================================================

UNTERNEHMENSDATEN:
${info.name}
${info.address}
Steuernummer: ${info.taxNumber}
${!isKleinunternehmer ? `USt-IdNr.: ${info.vatNumber}` : 'Kleinunternehmerregelung § 19 UStG'}
Bank: ${bankType === 'kontist' ? 'Kontist' : bankType === 'holvi' ? 'Holvi' : 'Unbekannt'}
Kontenrahmen: ${selectedKontenrahmen} (Prozessgliederungsprinzip)
Berechnungsmethode: ${isKleinunternehmer ? 'Bruttobeträge (keine USt-Trennung)' : 'Nettobeträge (USt separat)'}

BETRIEBSEINNAHMEN:
================
${Object.entries(euerCalculation.income).map(([key, amount]) =>
        `${skr04Categories[key]?.code || key} - ${skr04Categories[key]?.name || key}: ${amount.toFixed(2)}€`
    ).join('\n')}

Gesamtbetriebseinnahmen: ${euerCalculation.totalIncome.toFixed(2)}€

BETRIEBSAUSGABEN:
===============
${Object.entries(euerCalculation.expenses).map(([key, amount]) =>
        `${skr04Categories[key]?.code || key} - ${skr04Categories[key]?.name || key}: ${amount.toFixed(2)}€`
    ).join('\n')}

Gesamtbetriebsausgaben: ${euerCalculation.totalExpenses.toFixed(2)}€

ERGEBNIS:
=========
Gewinn/Verlust (steuerpflichtig): ${euerCalculation.profit.toFixed(2)}€

${!isKleinunternehmer ? `UMSATZSTEUER-BERECHNUNG:
=======================
Umsatzsteuer (schuldig): ${euerCalculation.vatOwed.toFixed(2)}€
Vorsteuer (bezahlt): ${euerCalculation.vatPaid.toFixed(2)}€
USt-Saldo: ${euerCalculation.vatBalance.toFixed(2)}€ ${euerCalculation.vatBalance > 0 ? '(nachzahlen)' : '(Erstattung)'}

BERECHNUNGSHINWEIS:
==================
Die EÜR-Beträge sind NETTOBETRÄGE (ohne USt).
Die Umsatzsteuer wird separat ausgewiesen.
Beispiel: 119€ Rechnung = 100€ EÜR-Einnahme + 19€ USt
` : `KLEINUNTERNEHMERREGELUNG:
========================
Keine Umsatzsteuer-Berechnung nach § 19 UStG

BERECHNUNGSHINWEIS:
==================
Die EÜR-Beträge sind BRUTTOBETRÄGE (inkl. USt).
Keine USt-Trennung bei Kleinunternehmern.
Beispiel: 119€ Rechnung = 119€ EÜR-Einnahme (komplett)
`}
PRIVATBEREICH:
=============
(nicht steuerrelevant, bereits aus versteuertem Gewinn)
${Object.entries(euerCalculation.privateTransactions).map(([key, amount]) =>
        `${skr04Categories[key]?.code || key} - ${skr04Categories[key]?.name || key}: ${amount.toFixed(2)}€`
    ).join('\n')}

ZUSAMMENFASSUNG:
===============
Steuerpflichtiger Gewinn: ${euerCalculation.profit.toFixed(2)}€
Private Entnahmen: ${euerCalculation.privateWithdrawals.toFixed(2)}€
Private Einlagen: ${euerCalculation.privateDeposits.toFixed(2)}€
Verbleibt im Betrieb: ${(euerCalculation.profit - euerCalculation.privateWithdrawals + euerCalculation.privateDeposits).toFixed(2)}€

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
Anzahl Transaktionen gesamt: ${transactions.length}
Kleinunternehmerregelung: ${isKleinunternehmer ? 'Ja' : 'Nein'}
`;
};

export const openReportInNewWindow = (
    currentYear: number,
    selectedKontenrahmen: KontenrahmenType,
    companyInfo: CompanyInfo | undefined,
    isKleinunternehmer: boolean,
    bankType: string | null,
    euerCalculation: EuerCalculation,
    transactions: Transaction[]
) => {
    const reportContent = generateReport(euerCalculation, companyInfo, selectedKontenrahmen, bankType, isKleinunternehmer, transactions);
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>EÜR Report ${currentYear}</title>
            <style>
                body { font-family: monospace; white-space: pre; padding: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
                h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>EÜR Report ${currentYear}</h1>
                ${reportContent.replace(/\n/g, '<br>')}
            </div>
        </body>
        </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
};