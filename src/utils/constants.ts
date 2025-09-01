// Application constants for better maintainability

export const PAGINATION = {
    TRANSACTIONS_PER_PAGE: 25,
    MAX_VISIBLE_PAGES: 5
} as const;

export const VAT_RATES = {
    STANDARD: 19,
    REDUCED: 7,
    ZERO: 0
} as const;

export const AMOUNT_THRESHOLDS = {
    OFFICE_SUPPLIES_MAX: 50,
    LOW_VALUE_ASSETS_MIN: 50,
    LOW_VALUE_ASSETS_MAX: 800
} as const;

export const ELSTER_FIELD_RANGES = {
    PERSONAL_DATA_START: 1,
    PERSONAL_DATA_END: 16,
    INCOME_START: 17,
    INCOME_END: 24,
    EXPENSE_START: 25,
    EXPENSE_END: 36,
    EXTENDED_START: 37,
    EXTENDED_END: 60
} as const;

export const DEFAULT_COMPANY_INFO = {
    name: '',
    address: '',
    taxNumber: '',
    vatNumber: '',
    taxRate: '19'
};

// Complete ELSTER EÜR field definitions
export const ELSTER_FIELDS = {
    // Personal Data Fields (1-16)
    '1': { label: 'Name', type: 'personal', required: true },
    '2': { label: 'Vorname', type: 'personal', required: false },
    '3': { label: 'Straße', type: 'personal', required: true },
    '4': { label: 'Hausnummer', type: 'personal', required: true },
    '5': { label: 'PLZ', type: 'personal', required: true },
    '6': { label: 'Ort', type: 'personal', required: true },
    '7': { label: 'Steuernummer', type: 'personal', required: true },
    '8': { label: 'USt-ID', type: 'personal', required: false },
    '9': { label: 'Wirtschaftsjahr von', type: 'personal', required: true },
    '10': { label: 'Wirtschaftsjahr bis', type: 'personal', required: true },
    '11': { label: 'Beruf', type: 'personal', required: true },
    '12': { label: 'Gewinnermittlungsart', type: 'personal', required: true },
    '13': { label: 'Kleinunternehmer', type: 'personal', required: true },
    '14': { label: 'Umsatzsteuerpflichtig', type: 'personal', required: true },
    '15': { label: 'Buchführungspflichtig', type: 'personal', required: true },
    '16': { label: 'Bilanzierungspflichtig', type: 'personal', required: true },

    // Income Fields (17-24)
    '17': { label: 'Umsatzerlöse (steuerpflichtig)', type: 'income', required: true },
    '18': { label: 'Sonstige Leistungen', type: 'income', required: false },
    '19': { label: 'Erlöse aus EU-Lieferungen', type: 'income', required: false },
    '20': { label: 'Einnahmen aus Kapitalvermögen', type: 'income', required: false },
    '21': { label: 'Privateinnahmen', type: 'income', required: false },
    '22': { label: 'Sonstige Einnahmen', type: 'income', required: false },
    '23': { label: 'Umsatzsteuer', type: 'income', required: false },
    '24': { label: 'Vorsteuer', type: 'income', required: false },

    // Expense Fields (25-36)
    '25': { label: 'Wareneinkauf/Fremdleistungen', type: 'expense', required: true },
    '26': { label: 'Löhne und Gehälter', type: 'expense', required: false },
    '27': { label: 'Gesetzliche soziale Aufwendungen', type: 'expense', required: false },
    '28': { label: 'Altersversorgung', type: 'expense', required: false },
    '29': { label: 'Mieten und Pachten', type: 'expense', required: false },
    '30': { label: 'Sonstige unbeschränkt abziehbare Betriebsausgaben', type: 'expense', required: false },
    '31': { label: 'Kraftfahrzeugkosten', type: 'expense', required: false },
    '32': { label: 'Werbe- und Reisekosten', type: 'expense', required: false },
    '33': { label: 'Bewirtungskosten (70%)', type: 'expense', required: false },
    '34': { label: 'Schuldzinsen und ähnliche Entgelte', type: 'expense', required: false },
    '35': { label: 'Gewerbesteuer', type: 'expense', required: false },
    '36': { label: 'Beschränkt abziehbare Betriebsausgaben', type: 'expense', required: false },

    // Extended Fields (37-60+)
    '37': { label: 'AfA bewegliche Wirtschaftsgüter', type: 'expense', required: false },
    '38': { label: 'AfA Gebäude', type: 'expense', required: false },
    '39': { label: 'Sonderabschreibungen', type: 'expense', required: false },
    '40': { label: 'Verlustvortrag', type: 'expense', required: false },
    '41': { label: 'Gewinnvortrag', type: 'income', required: false },
    '42': { label: 'Steuerfreie Einnahmen', type: 'income', required: false },
    '43': { label: 'Nicht abzugsfähige Ausgaben', type: 'expense', required: false },
    '44': { label: 'Umsatzsteuer-Soll', type: 'tax', required: false },
    '45': { label: 'Umsatzsteuer-Haben', type: 'tax', required: false },
    '46': { label: 'Umsatzsteuer-Saldo', type: 'tax', required: false },
    '47': { label: 'Gewerbesteuer-Vorauszahlungen', type: 'tax', required: false },
    '48': { label: 'Körperschaftsteuer-Vorauszahlungen', type: 'tax', required: false },
    '49': { label: 'Einkommensteuer-Vorauszahlungen', type: 'tax', required: false },
    '50': { label: 'Solidaritätszuschlag', type: 'tax', required: false },
    '51': { label: 'Kirchensteuer', type: 'tax', required: false },
    '52': { label: 'Gesamtbetrag der Einkünfte', type: 'total', required: false },
    '53': { label: 'Verlustabzug', type: 'total', required: false },
    '54': { label: 'Zu versteuerndes Einkommen', type: 'total', required: false },
    '55': { label: 'Tarifliche Einkommensteuer', type: 'total', required: false },
    '56': { label: 'Abgeltungsteuer', type: 'total', required: false },
    '57': { label: 'Gesamte Steuerlast', type: 'total', required: false },
    '58': { label: 'Anrechenbare Steuern', type: 'total', required: false },
    '59': { label: 'Erstattungsbetrag', type: 'total', required: false },
    '60': { label: 'Nachzahlungsbetrag', type: 'total', required: false }
} as const;