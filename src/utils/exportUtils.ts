import type { EuerCalculation, CompanyInfo, KontenrahmenType } from '../types';
import { skr04Categories } from './categoryMappings';

export const generateReport = (
    euerCalculation: EuerCalculation,
    companyInfo: CompanyInfo,
    selectedKontenrahmen: KontenrahmenType,
    bankType: string | null,
    isKleinunternehmer: boolean,
    transactions: any[]
): string => {
    const currentYear = new Date().getFullYear();
    const reportContent = `EINNAHMEN-ÜBERSCHUSS-RECHNUNG ${currentYear} (${selectedKontenrahmen})
=====================================================

UNTERNEHMENSDATEN:
${companyInfo.name || 'Ihr Unternehmen'}
${companyInfo.address || 'Ihre Adresse'}
Steuernummer: ${companyInfo.taxNumber || 'Ihre Steuernummer'}
${!isKleinunternehmer ? `USt-IdNr.: ${companyInfo.vatNumber || 'Ihre USt-IdNr.'}` : 'Kleinunternehmerregelung § 19 UStG'}
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
========================
Umsatzsteuer (schuldig): ${euerCalculation.vatOwed.toFixed(2)}€
Vorsteuer (bezahlt): ${euerCalculation.vatPaid.toFixed(2)}€
USt-Saldo: ${euerCalculation.vatBalance.toFixed(2)}€ ${euerCalculation.vatBalance > 0 ? '(nachzahlen)' : '(Erstattung)'}

BERECHNUNGSHINWEIS:
===================
Die EÜR-Beträge sind NETTOBETRÄGE (ohne USt).
Die Umsatzsteuer wird separat ausgewiesen.
Beispiel: 119€ Rechnung = 100€ EÜR-Einnahme + 19€ USt
` : `KLEINUNTERNEHMERREGELUNG:
=========================
Keine Umsatzsteuer-Berechnung nach § 19 UStG

BERECHNUNGSHINWEIS:
===================
Die EÜR-Beträge sind BRUTTOBETRÄGE (inkl. USt).
Keine USt-Trennung bei Kleinunternehmern.
Beispiel: 119€ Rechnung = 119€ EÜR-Einnahme (komplett)
`}
PRIVATBEREICH:
==============
(nicht steuerrelevant, bereits aus versteuertem Gewinn)
${Object.entries(euerCalculation.privateTransactions).map(([key, amount]) =>
    `${skr04Categories[key]?.code || key} - ${skr04Categories[key]?.name || key}: ${amount.toFixed(2)}€`
).join('\n')}

ZUSAMMENFASSUNG:
================
Steuerpflichtiger Gewinn: ${euerCalculation.profit.toFixed(2)}€
Private Entnahmen: ${euerCalculation.privateWithdrawals.toFixed(2)}€
Private Einlagen: ${euerCalculation.privateDeposits.toFixed(2)}€
Verbleibt im Betrieb: ${(euerCalculation.profit - euerCalculation.privateWithdrawals + euerCalculation.privateDeposits).toFixed(2)}€

Erstellt am: ${new Date().toLocaleDateString('de-DE')}
Anzahl Transaktionen gesamt: ${transactions.length}
Kleinunternehmerregelung: ${isKleinunternehmer ? 'Ja' : 'Nein'}
`;

    return reportContent;
};

export const downloadReport = (reportContent: string, currentYear: number, selectedKontenrahmen: KontenrahmenType, isKleinunternehmer: boolean): void => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EÜR_${currentYear}_${selectedKontenrahmen}_${isKleinunternehmer ? 'KU_Brutto' : 'USt_Netto'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
};