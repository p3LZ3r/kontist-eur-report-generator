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
    PERSONAL_DATA_END: 11,
    INCOME_START: 12,
    INCOME_END: 20,
    VAT_START: 17,
    VAT_END: 18,
    EXPENSE_START: 27,
    EXPENSE_END: 66,
    VAT_PAID_START: 57,
    VAT_PAID_END: 58,
    PROFIT_CALC_START: 78,
    PROFIT_CALC_END: 91
} as const;



// Complete ELSTER EÜR field definitions (based on official documentation)
export const ELSTER_FIELDS = {
    // Personal Data Fields (1-11)
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

    // Income Fields (12, 15-16, 19-20)
    '12': { label: 'Umsatzerlöse für Kleinunternehmer (brutto)', type: 'income', required: false },
    '15': { label: 'Umsatzsteuerpflichtige Umsätze (netto)', type: 'income', required: true },
    '16': { label: 'Steuerfreie und nicht steuerbare Umsätze', type: 'income', required: false },
    '19': { label: 'Veräußerung/Entnahme Anlagevermögen', type: 'income', required: false },
    '20': { label: 'Private Kfz-Nutzung (Wert)', type: 'income', required: false },

    // VAT Fields (17-18) - Automatisch berechnet von ELSTER
    '17': { label: 'Umsatzsteuer', type: 'vat', required: false, autoCalculated: true },
    '18': { label: 'Umsatzsteuer-Erstattung vom Finanzamt', type: 'vat', required: false, autoCalculated: true },

    // Expense Fields (27, 29-37, 44, 55-56, 62-66)
    '27': { label: 'Waren, Rohstoffe und Hilfsstoffe', type: 'expense', required: false },
    '29': { label: 'Fremdleistungen', type: 'expense', required: false },
    '30': { label: 'Personalkosten', type: 'expense', required: false },
    '31': { label: 'AfA auf unbewegliche Wirtschaftsgüter des Anlagevermögens', type: 'expense', required: false },
    '32': { label: 'AfA auf bewegliche Wirtschaftsgüter des Anlagevermögens', type: 'expense', required: false },
    '33': { label: 'Andere AfA', type: 'expense', required: false },
    '34': { label: 'Miet- und Leasingaufwendungen für unbewegliche Wirtschaftsgüter', type: 'expense', required: false },
    '35': { label: 'Miet- und Leasingaufwendungen für bewegliche Wirtschaftsgüter', type: 'expense', required: false },
    '36': { label: 'Sofort abziehbare GWG', type: 'expense', required: false },
    '37': { label: 'Andere sofort abzugsfähige Betriebsausgaben', type: 'expense', required: false },
    '44': { label: 'Reise- und Fahrtkosten', type: 'expense', required: false },
    '55': { label: 'Schuldzinsen und ähnliche Entgelte', type: 'expense', required: false },
    '56': { label: 'Andere Finanzierungskosten', type: 'expense', required: false },
    '62': { label: 'Geschenke', type: 'expense', required: false },
    '63': { label: 'Bewirtungskosten', type: 'expense', required: false },
    '64': { label: 'Reiseverpflegungsmehraufwand', type: 'expense', required: false },
    '65': { label: 'Häusliches Arbeitszimmer', type: 'expense', required: false },
    '66': { label: 'Homeoffice-Pauschale', type: 'expense', required: false },

    // VAT Paid Fields (57-58)
    '57': { label: 'Vorsteuer', type: 'vat_paid', required: false },
    '58': { label: 'Vorsteuer-Erstattung an das Finanzamt', type: 'vat_paid', required: false },

    // Profit Calculation Fields (78-91)
    '78': { label: 'Steuerfreie Betriebseinnahmen', type: 'profit_calc', required: false },
    '79': { label: 'Absetzungsbeträge', type: 'profit_calc', required: false },
    '80': { label: 'Investitionsabzugsbeträge', type: 'profit_calc', required: false },
    '81': { label: 'Nicht abziehbare Betriebsausgaben', type: 'profit_calc', required: false },
    '82': { label: 'Hinzurechnungsbeträge', type: 'profit_calc', required: false },
    '83': { label: 'Entnahmen und andere nicht steuerbare Vorgänge', type: 'profit_calc', required: false },
    '84': { label: 'Investitionsabzugsbetrag in Anspruch genommen', type: 'profit_calc', required: false },
    '85': { label: 'Investitionsabzugsbetrag hinzugerechnet', type: 'profit_calc', required: false },
    '86': { label: 'Sonderabschreibung nach § 7g Abs. 5 EStG', type: 'profit_calc', required: false },
    '87': { label: 'Nachholung Sonderabschreibung nach § 7g Abs. 2 EStG', type: 'profit_calc', required: false },
    '88': { label: 'Ansparabschreibung nach § 7g Abs. 3 EStG', type: 'profit_calc', required: false },
    '91': { label: 'Gewinnanteil aus Personengesellschaften', type: 'profit_calc', required: false },

    // Total and Summary Fields - Automatisch berechnet von ELSTER
    '92': { label: 'Gewinn/Verlust', type: 'total', required: false, autoCalculated: true },
    '93': { label: 'Hinzurechnungen', type: 'total', required: false, autoCalculated: true },
    '94': { label: 'Kürzungen', type: 'total', required: false, autoCalculated: true },
    '95': { label: 'Summe der Einkünfte', type: 'total', required: false, autoCalculated: true }
} as const;