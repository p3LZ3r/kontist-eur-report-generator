import type { ElsterMapping } from '../types';

export type CategoryInfo = {
    name: string;
    type: 'income' | 'expense' | 'private';
    code: string;
    vat: number;
};

// Elster EÜR-Feldmapping (extended for all fields 1-60+)
export const elsterMapping: ElsterMapping = {
    // PERSONAL DATA FIELDS (1-16) - Populated from user tax data, not transactions
    // These fields are handled separately in automatic population functions

    // INCOME FIELDS (17-24)
    'income_services_19': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_services_7': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_services_0': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_goods_19': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_goods_7': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_eu': { elsterField: '19', label: 'Erlöse aus EU-Lieferungen' },
    'income_export': { elsterField: '19', label: 'Erlöse aus EU-Lieferungen' },
    'income_prepayments': { elsterField: '17', label: 'Umsatzerlöse (steuerpflichtig)' },
    'income_other': { elsterField: '18', label: 'Sonstige Leistungen' },
    'income_refunds': { elsterField: '18', label: 'Sonstige Leistungen' },
    'income_interest': { elsterField: '20', label: 'Einnahmen aus Kapitalvermögen' },

    // AUSGABEN - Betriebsausgaben
    'purchase_goods_19': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' },
    'purchase_goods_7': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' },
    'purchase_materials': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' },
    'purchase_packaging': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' },

    // Personalkosten
    'expense_wages': { elsterField: '26', label: 'Löhne und Gehälter' },
    'expense_social_employer': { elsterField: '27', label: 'Gesetzliche soziale Aufwendungen' },
    'expense_pension': { elsterField: '28', label: 'Altersversorgung' },
    'expense_freelancer': { elsterField: '25', label: 'Wareneinkauf/Fremdleistungen' },
    'expense_training': { elsterField: '30', label: 'Fortbildungskosten' },

    // Raumkosten
    'expense_rent_business': { elsterField: '29', label: 'Mieten und Pachten' },
    'expense_rent_storage': { elsterField: '29', label: 'Mieten und Pachten' },
    'expense_utilities': { elsterField: '29', label: 'Mieten und Pachten' },
    'expense_heating': { elsterField: '29', label: 'Mieten und Pachten' },
    'expense_cleaning': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_security': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Fahrzeugkosten
    'expense_vehicle_fuel': { elsterField: '31', label: 'Kraftfahrzeugkosten' },
    'expense_vehicle_repairs': { elsterField: '31', label: 'Kraftfahrzeugkosten' },
    'expense_vehicle_insurance': { elsterField: '31', label: 'Kraftfahrzeugkosten' },
    'expense_vehicle_tax': { elsterField: '31', label: 'Kraftfahrzeugkosten' },
    'expense_vehicle_leasing': { elsterField: '31', label: 'Kraftfahrzeugkosten' },
    'expense_vehicle_parking': { elsterField: '31', label: 'Kraftfahrzeugkosten' },

    // Werbekosten
    'expense_advertising_print': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_advertising_online': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_advertising_radio': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_trade_shows': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_promotional': { elsterField: '32', label: 'Werbe- und Reisekosten' },

    // Reisekosten
    'expense_travel_domestic': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_travel_foreign': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_accommodation': { elsterField: '32', label: 'Werbe- und Reisekosten' },
    'expense_meals_business': { elsterField: '33', label: 'Bewirtungskosten (70%)' },
    'expense_meals_travel': { elsterField: '32', label: 'Werbe- und Reisekosten' },

    // Kommunikation & Büro
    'expense_phone': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_mobile': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_internet': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_postage': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_office_supplies': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_office_equipment': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_software': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_books': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_subscriptions': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Beratung
    'expense_legal': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_tax_advisor': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_consulting': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_auditing': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Versicherungen & Beiträge
    'expense_insurance_business': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_insurance_legal': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_insurance_cyber': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_insurance_property': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_chamber': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_associations': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_licenses': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Finanzkosten
    'expense_banking': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_payment_fees': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_interest': { elsterField: '34', label: 'Schuldzinsen und ähnliche Entgelte' },
    'expense_fees_financing': { elsterField: '34', label: 'Schuldzinsen und ähnliche Entgelte' },

    // Instandhaltung
    'expense_maintenance_building': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_maintenance_equipment': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_maintenance_software': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_maintenance_website': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Steuern (nur Gewerbesteuer ist Betriebsausgabe)
    'expense_taxes_trade': { elsterField: '35', label: 'Gewerbesteuer' },
    'expense_taxes_other': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },

    // Andere
    'expense_other': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_non_deductible': { elsterField: '36', label: 'Beschränkt abziehbare Betriebsausgaben' },

    // EXTENDED EXPENSE FIELDS (37-60+)
    // Depreciation and amortization
    'expense_depreciation_movable': { elsterField: '37', label: 'AfA bewegliche Wirtschaftsgüter' },
    'expense_depreciation_building': { elsterField: '38', label: 'AfA Gebäude' },
    'expense_special_depreciation': { elsterField: '39', label: 'Sonderabschreibungen' },

    // Tax-related expenses
    'expense_trade_tax_prepayments': { elsterField: '47', label: 'Gewerbesteuer-Vorauszahlungen' },
    'expense_corporate_tax_prepayments': { elsterField: '48', label: 'Körperschaftsteuer-Vorauszahlungen' },
    'expense_income_tax_prepayments': { elsterField: '49', label: 'Einkommensteuer-Vorauszahlungen' },
    'expense_solidarity_surcharge': { elsterField: '50', label: 'Solidaritätszuschlag' },
    'expense_church_tax': { elsterField: '51', label: 'Kirchensteuer' },

    // Loss carryforward and other tax items
    'expense_loss_carryforward': { elsterField: '40', label: 'Verlustvortrag' },
    'expense_tax_free_income': { elsterField: '42', label: 'Steuerfreie Einnahmen' },
    'expense_non_deductible_tax': { elsterField: '43', label: 'Nicht abzugsfähige Ausgaben' },

    // Additional business expenses
    'expense_low_value_assets': { elsterField: '37', label: 'AfA bewegliche Wirtschaftsgüter' },
    'expense_home_office': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_continuing_education': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' },
    'expense_memberships': { elsterField: '30', label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben' }
};

// Fallback hardcoded data for SKR04
export const skr04Categories: Record<string, CategoryInfo> = {
    // ERLÖSE (8000-8999)
    'income_services_19': { name: 'Erlöse aus Dienstleistungen 19% USt', type: 'income', code: '8400', vat: 19 },
    'income_services_7': { name: 'Erlöse aus Dienstleistungen 7% USt', type: 'income', code: '8300', vat: 7 },
    'income_services_0': { name: 'Steuerfreie Erlöse', type: 'income', code: '8125', vat: 0 },
    'income_goods_19': { name: 'Erlöse Warenverkauf 19% USt', type: 'income', code: '8200', vat: 19 },
    'income_goods_7': { name: 'Erlöse Warenverkauf 7% USt', type: 'income', code: '8100', vat: 7 },
    'income_eu': { name: 'Innergemeinschaftliche Lieferungen', type: 'income', code: '8310', vat: 0 },
    'income_export': { name: 'Ausfuhrlieferungen Drittland', type: 'income', code: '8315', vat: 0 },
    'income_prepayments': { name: 'Erhaltene Anzahlungen', type: 'income', code: '8736', vat: 19 },
    'income_other': { name: 'Sonstige betriebliche Erträge', type: 'income', code: '8050', vat: 0 },
    'income_refunds': { name: 'Erstattungen/Rückvergütungen', type: 'income', code: '8890', vat: 0 },
    'income_interest': { name: 'Zinserträge', type: 'income', code: '8010', vat: 0 },

    // WARENEINSATZ (5000-5999)
    'purchase_goods_19': { name: 'Wareneinsatz 19% Vorsteuer', type: 'expense', code: '5000', vat: 19 },
    'purchase_goods_7': { name: 'Wareneinsatz 7% Vorsteuer', type: 'expense', code: '5200', vat: 7 },
    'purchase_materials': { name: 'Rohstoffe und Hilfsstoffe', type: 'expense', code: '5400', vat: 19 },
    'purchase_packaging': { name: 'Verpackungsmaterial', type: 'expense', code: '5600', vat: 19 },

    // PERSONALAUFWAND (6000-6999)
    'expense_wages': { name: 'Löhne und Gehälter', type: 'expense', code: '6000', vat: 0 },
    'expense_social_employer': { name: 'Arbeitgeberanteile Sozialversicherung', type: 'expense', code: '6100', vat: 0 },
    'expense_pension': { name: 'Aufwendungen Altersversorgung', type: 'expense', code: '6200', vat: 0 },
    'expense_freelancer': { name: 'Fremdleistungen (Subunternehmer)', type: 'expense', code: '6300', vat: 19 },
    'expense_training': { name: 'Fortbildungskosten', type: 'expense', code: '6500', vat: 19 },

    // RAUMKOSTEN (7000-7099)
    'expense_rent_business': { name: 'Mieten Geschäftsräume', type: 'expense', code: '7000', vat: 19 },
    'expense_rent_storage': { name: 'Mieten Lager/Produktion', type: 'expense', code: '7010', vat: 19 },
    'expense_utilities': { name: 'Strom, Gas, Wasser', type: 'expense', code: '7020', vat: 19 },
    'expense_heating': { name: 'Heizkosten', type: 'expense', code: '7025', vat: 19 },
    'expense_cleaning': { name: 'Reinigungskosten', type: 'expense', code: '7030', vat: 19 },
    'expense_security': { name: 'Überwachung und Sicherheit', type: 'expense', code: '7040', vat: 19 },

    // FAHRZEUGKOSTEN (7100-7199)
    'expense_vehicle_fuel': { name: 'Kraftstoffe', type: 'expense', code: '7100', vat: 19 },
    'expense_vehicle_repairs': { name: 'Kfz-Reparaturen', type: 'expense', code: '7110', vat: 19 },
    'expense_vehicle_insurance': { name: 'Kfz-Versicherungen', type: 'expense', code: '7120', vat: 19 },
    'expense_vehicle_tax': { name: 'Kfz-Steuern', type: 'expense', code: '7130', vat: 0 },
    'expense_vehicle_leasing': { name: 'Kfz-Leasing', type: 'expense', code: '7140', vat: 19 },
    'expense_vehicle_parking': { name: 'Parkgebühren', type: 'expense', code: '7150', vat: 19 },

    // WERBEKOSTEN (7200-7299)
    'expense_advertising_print': { name: 'Printmedien-Werbung', type: 'expense', code: '7200', vat: 19 },
    'expense_advertising_online': { name: 'Online-Marketing', type: 'expense', code: '7210', vat: 19 },
    'expense_advertising_radio': { name: 'Rundfunk/TV-Werbung', type: 'expense', code: '7220', vat: 19 },
    'expense_trade_shows': { name: 'Messen und Ausstellungen', type: 'expense', code: '7230', vat: 19 },
    'expense_promotional': { name: 'Werbemittel und Geschenke', type: 'expense', code: '7240', vat: 19 },

    // REISEKOSTEN (7300-7399)
    'expense_travel_domestic': { name: 'Reisekosten Inland', type: 'expense', code: '7300', vat: 19 },
    'expense_travel_foreign': { name: 'Reisekosten Ausland', type: 'expense', code: '7310', vat: 0 },
    'expense_accommodation': { name: 'Übernachtungskosten', type: 'expense', code: '7320', vat: 7 },
    'expense_meals_business': { name: 'Bewirtungskosten', type: 'expense', code: '7330', vat: 19 },
    'expense_meals_travel': { name: 'Reiseverpflegung', type: 'expense', code: '7340', vat: 19 },

    // KOMMUNIKATION (7400-7499)
    'expense_phone': { name: 'Telefon', type: 'expense', code: '7400', vat: 19 },
    'expense_mobile': { name: 'Mobilfunk', type: 'expense', code: '7410', vat: 19 },
    'expense_internet': { name: 'Internet', type: 'expense', code: '7420', vat: 19 },
    'expense_postage': { name: 'Porto und Kurierdienste', type: 'expense', code: '7430', vat: 19 },

    // BÜROKOSTEN (7500-7599)
    'expense_office_supplies': { name: 'Büromaterial', type: 'expense', code: '7500', vat: 19 },
    'expense_office_equipment': { name: 'Bürogeräte (GWG)', type: 'expense', code: '7510', vat: 19 },
    'expense_software': { name: 'Software und Lizenzen', type: 'expense', code: '7520', vat: 19 },
    'expense_books': { name: 'Fachliteratur', type: 'expense', code: '7530', vat: 7 },
    'expense_subscriptions': { name: 'Zeitschriften und Abonnements', type: 'expense', code: '7540', vat: 7 },

    // BERATUNG UND RECHT (7600-7699)
    'expense_legal': { name: 'Rechtsberatung', type: 'expense', code: '7600', vat: 19 },
    'expense_tax_advisor': { name: 'Steuerberatung', type: 'expense', code: '7610', vat: 19 },
    'expense_consulting': { name: 'Unternehmensberatung', type: 'expense', code: '7620', vat: 19 },
    'expense_auditing': { name: 'Wirtschaftsprüfung', type: 'expense', code: '7630', vat: 19 },

    // VERSICHERUNGEN (7700-7799)
    'expense_insurance_business': { name: 'Betriebshaftpflicht', type: 'expense', code: '7700', vat: 19 },
    'expense_insurance_legal': { name: 'Rechtsschutzversicherung', type: 'expense', code: '7710', vat: 19 },
    'expense_insurance_cyber': { name: 'Cyberversicherung', type: 'expense', code: '7720', vat: 19 },
    'expense_insurance_property': { name: 'Sachversicherungen', type: 'expense', code: '7730', vat: 19 },

    // BEITRÄGE UND GEBÜHREN (7800-7899)
    'expense_chamber': { name: 'Kammerbeiträge', type: 'expense', code: '7800', vat: 0 },
    'expense_associations': { name: 'Verbandsbeiträge', type: 'expense', code: '7810', vat: 0 },
    'expense_banking': { name: 'Bankgebühren', type: 'expense', code: '7820', vat: 0 },
    'expense_payment_fees': { name: 'Zahlungsverkehrsgebühren', type: 'expense', code: '7830', vat: 19 },
    'expense_licenses': { name: 'Konzessionen und Genehmigungen', type: 'expense', code: '7840', vat: 19 },

    // INSTANDHALTUNG (7900-7999)
    'expense_maintenance_building': { name: 'Instandhaltung Gebäude', type: 'expense', code: '7900', vat: 19 },
    'expense_maintenance_equipment': { name: 'Instandhaltung Maschinen', type: 'expense', code: '7910', vat: 19 },
    'expense_maintenance_software': { name: 'Software-Wartung', type: 'expense', code: '7920', vat: 19 },
    'expense_maintenance_website': { name: 'Website-Wartung', type: 'expense', code: '7930', vat: 19 },

    // STEUERN UND ABGABEN
    'expense_taxes_trade': { name: 'Gewerbesteuer-Vorauszahlungen', type: 'expense', code: '3210', vat: 0 },
    'expense_taxes_other': { name: 'Sonstige Steuern', type: 'expense', code: '3220', vat: 0 },

    // ZINSEN UND FINANZAUFWAND
    'expense_interest': { name: 'Zinsaufwendungen', type: 'expense', code: '2100', vat: 0 },
    'expense_fees_financing': { name: 'Finanzierungskosten', type: 'expense', code: '2110', vat: 19 },

    // PRIVATENTNAHMEN UND EINLAGEN
    'private_withdrawal': { name: 'Privatentnahmen (nicht EÜR-relevant)', type: 'private', code: '1890', vat: 0 },
    'private_withdrawal_taxes': { name: 'Entnahme von Steuern vom Einkommen und Ertrag', type: 'private', code: '2150', vat: 0 },
    'private_deposit': { name: 'Privateinlagen', type: 'private', code: '1800', vat: 0 },

    // SONSTIGE AUSGABEN
    'expense_other': { name: 'Sonstige betriebliche Aufwendungen', type: 'expense', code: '7990', vat: 19 },
    'expense_non_deductible': { name: 'Nicht abzugsfähige Ausgaben', type: 'expense', code: '7995', vat: 0 },

    // EXTENDED EXPENSE CATEGORIES (37-60+)
    // Depreciation and amortization
    'expense_depreciation_movable': { name: 'AfA bewegliche Wirtschaftsgüter', type: 'expense', code: '4800', vat: 0 },
    'expense_depreciation_building': { name: 'AfA Gebäude', type: 'expense', code: '4810', vat: 0 },
    'expense_special_depreciation': { name: 'Sonderabschreibungen', type: 'expense', code: '4820', vat: 0 },

    // Tax-related expenses
    'expense_trade_tax_prepayments': { name: 'Gewerbesteuer-Vorauszahlungen', type: 'expense', code: '3210', vat: 0 },
    'expense_corporate_tax_prepayments': { name: 'Körperschaftsteuer-Vorauszahlungen', type: 'expense', code: '3220', vat: 0 },
    'expense_income_tax_prepayments': { name: 'Einkommensteuer-Vorauszahlungen', type: 'expense', code: '3230', vat: 0 },
    'expense_solidarity_surcharge': { name: 'Solidaritätszuschlag', type: 'expense', code: '3240', vat: 0 },
    'expense_church_tax': { name: 'Kirchensteuer', type: 'expense', code: '3250', vat: 0 },

    // Loss carryforward and other tax items
    'expense_loss_carryforward': { name: 'Verlustvortrag', type: 'expense', code: '3260', vat: 0 },
    'expense_tax_free_income': { name: 'Steuerfreie Einnahmen', type: 'income', code: '3270', vat: 0 },
    'expense_non_deductible_tax': { name: 'Nicht abzugsfähige Ausgaben', type: 'expense', code: '3280', vat: 0 },

    // Additional business expenses
    'expense_low_value_assets': { name: 'Geringwertige Wirtschaftsgüter', type: 'expense', code: '4830', vat: 19 },
    'expense_home_office': { name: 'Homeoffice-Pauschale', type: 'expense', code: '4840', vat: 0 },
    'expense_continuing_education': { name: 'Fortbildungskosten', type: 'expense', code: '4850', vat: 19 },
    'expense_memberships': { name: 'Mitgliedsbeiträge', type: 'expense', code: '4860', vat: 19 }
};