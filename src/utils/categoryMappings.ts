import type { ElsterMapping } from "../types";

export type CategoryInfo = {
  name: string;
  type: "income" | "expense" | "private";
  code: string;
  vat: number;
};

// Mapping from semantic category keys to SKR account codes
// These codes are based on actual SKR04 JSON data from /public/data/skr04.json
const SEMANTIC_TO_SKR04_CODE: Record<string, string> = {
  // Income (Ertrag) - codes starting with 4
  income_services_19: "4000", // Umsatzerlöse (main revenue)
  income_services_7: "4300", // Umsatzerlöse 7% USt
  income_services_0: "4110", // Sonstige steuerfreie Umsätze
  income_goods_19: "4000", // Same as services - main revenue
  income_goods_7: "4300", // Umsatzerlöse 7% USt
  income_eu: "4125", // Steuerfreie EG-Lieferungen
  income_export: "4135", // Steuerfreie EG-Lief. von Neufahrzeugen
  income_prepayments: "4185", // Erlöse Kleinunternehmer (for prepayments)
  income_other: "4200", // Erlöse (sonstige)
  income_refunds: "4200", // Erlöse (sonstige)
  income_interest: "4900", // Sonstige Erträge
  income_partnership_share: "4900",

  // Purchases (Aufwand) - codes starting with 5
  purchase_goods_19: "5000", // Aufwendungen für Roh-, Hilfs- und Betriebsstoffe
  purchase_goods_7: "5300", // Wareneingang 7% Vorsteuer
  purchase_materials: "5000", // Same as goods
  purchase_packaging: "6700", // Kosten der Warenabgabe

  // Personnel (Aufwand) - codes starting with 6
  expense_wages: "6000", // Löhne und Gehälter
  expense_social_employer: "6100", // Soziale Abgaben
  expense_pension: "6140", // Aufwendungen für Altersversorgung
  expense_freelancer: "5900", // Fremdleistungen
  expense_training: "6495", // Wartungskosten für Hard- und Software

  // Rent & Space (Aufwand) - codes in 6300 range
  expense_rent_business: "6310", // Miete
  expense_rent_storage: "6310",
  expense_utilities: "6305", // Raumkosten
  expense_heating: "6310",
  expense_cleaning: "6310",
  expense_security: "6305",

  // Vehicle (Aufwand) - codes in 6500 range
  expense_vehicle_fuel: "6530", // Laufende Kfz-Betriebskosten
  expense_vehicle_repairs: "6530",
  expense_vehicle_insurance: "6520", // Kfz-Versicherungen
  expense_vehicle_tax: "6530",
  expense_vehicle_leasing: "6540", // Kfz-Leasing (if exists)
  expense_vehicle_parking: "6530",

  // Advertising (Aufwand) - codes in 6600 range
  expense_advertising_print: "6600", // Werbekosten
  expense_advertising_online: "6600",
  expense_advertising_radio: "6600",
  expense_trade_shows: "6600",
  expense_promotional: "6610", // Geschenke bis 40€

  // Travel
  expense_travel_domestic: "6650", // Reisekosten
  expense_travel_foreign: "6650",
  expense_accommodation: "6650",
  expense_meals_business: "6630", // Bewirtungskosten
  expense_meals_travel: "6650",

  // Communication (Aufwand) - codes in 6800 range
  expense_phone: "6805", // Telefon
  expense_mobile: "6805",
  expense_internet: "6810", // Telefax und Internetkosten
  expense_postage: "6800", // Porto

  // Office (Aufwand)
  expense_office_supplies: "6815", // Bürobedarf
  expense_office_equipment: "6815",
  expense_software: "6495", // Wartungskosten für Hard- und Software
  expense_books: "6820", // Fachzeitschriften
  expense_subscriptions: "6820",

  // Consulting (Aufwand)
  expense_legal: "6800", // Sonstige betriebliche Aufwendungen
  expense_tax_advisor: "6800",
  expense_consulting: "5900", // Fremdleistungen
  expense_auditing: "5900",

  // Insurance (Aufwand) - codes in 6400 range
  expense_insurance_business: "6400", // Versicherungen
  expense_insurance_legal: "6400",
  expense_insurance_cyber: "6400",
  expense_insurance_property: "6400",

  // Fees & Memberships
  expense_chamber: "6800",
  expense_associations: "6800",
  expense_banking: "6800", // Bankgebühren under sonstige
  expense_payment_fees: "6800",
  expense_licenses: "6800",

  // Maintenance
  expense_maintenance_building: "6305", // Raumkosten
  expense_maintenance_equipment: "6495",
  expense_maintenance_software: "6495",
  expense_maintenance_website: "6600", // Werbekosten

  // Taxes
  expense_taxes_trade: "7600", // Körperschaftsteuer / Gewerbesteuer
  expense_taxes_other: "7600",
  expense_trade_tax_prepayments: "7600",
  expense_corporate_tax_prepayments: "7600",
  expense_income_tax_prepayments: "7600",
  expense_solidarity_surcharge: "7608",
  expense_church_tax: "7600",

  // Finance
  expense_interest: "7300", // Zinsen
  expense_fees_financing: "7300",

  // Depreciation
  expense_depreciation_movable: "6200", // Abschreibungen
  expense_depreciation_building: "6200",
  expense_special_depreciation: "6200",
  expense_low_value_assets: "6815", // Bürobedarf (GWG)

  // Home Office
  expense_home_office: "6305", // Raumkosten
  expense_home_office_flat_rate: "6305",

  // Other
  expense_continuing_education: "6495",
  expense_memberships: "6800",
  expense_other: "6900", // Sonstige betriebliche Aufwendungen
  expense_non_deductible: "6900",
  expense_loss_carryforward: "6900",
  expense_tax_free_income: "4200",
  expense_non_deductible_tax: "6900",
  expense_investment_deduction: "6900",
  expense_investment_deduction_claimed: "6900",
  expense_investment_deduction_added: "6900",

  // Private - these need to be looked up in Eigenkapital section
  private_withdrawal: "1900", // Privatentnahmen
  private_withdrawal_taxes: "1900",
  private_deposit: "1800", // Privateinlagen
};

// SKR03 mapping - uses different code ranges
const SEMANTIC_TO_SKR03_CODE: Record<string, string> = {
  // Income (SKR03 uses 4000-4999)
  income_services_19: "4000",
  income_services_7: "4300",
  income_services_0: "4110",
  income_goods_19: "4000",
  income_goods_7: "4300",
  income_eu: "4125",
  income_export: "4135",
  income_prepayments: "4185",
  income_other: "4200",
  income_refunds: "4200",
  income_interest: "4900",
  income_partnership_share: "4900",

  // Purchases
  purchase_goods_19: "5000",
  purchase_goods_7: "5300",
  purchase_materials: "5000",
  purchase_packaging: "6700",

  // Personnel
  expense_wages: "6000",
  expense_social_employer: "6100",
  expense_pension: "6140",
  expense_freelancer: "5900",
  expense_training: "6495",

  // Rent & Space
  expense_rent_business: "6310",
  expense_rent_storage: "6310",
  expense_utilities: "6305",
  expense_heating: "6310",
  expense_cleaning: "6310",
  expense_security: "6305",

  // Vehicle
  expense_vehicle_fuel: "6530",
  expense_vehicle_repairs: "6530",
  expense_vehicle_insurance: "6520",
  expense_vehicle_tax: "6530",
  expense_vehicle_leasing: "6540",
  expense_vehicle_parking: "6530",

  // Advertising
  expense_advertising_print: "6600",
  expense_advertising_online: "6600",
  expense_advertising_radio: "6600",
  expense_trade_shows: "6600",
  expense_promotional: "6610",

  // Travel
  expense_travel_domestic: "6650",
  expense_travel_foreign: "6650",
  expense_accommodation: "6650",
  expense_meals_business: "6630",
  expense_meals_travel: "6650",

  // Communication
  expense_phone: "6805",
  expense_mobile: "6805",
  expense_internet: "6810",
  expense_postage: "6800",

  // Office
  expense_office_supplies: "6815",
  expense_office_equipment: "6815",
  expense_software: "6495",
  expense_books: "6820",
  expense_subscriptions: "6820",

  // Consulting
  expense_legal: "6800",
  expense_tax_advisor: "6800",
  expense_consulting: "5900",
  expense_auditing: "5900",

  // Insurance
  expense_insurance_business: "6400",
  expense_insurance_legal: "6400",
  expense_insurance_cyber: "6400",
  expense_insurance_property: "6400",

  // Fees & Memberships
  expense_chamber: "6800",
  expense_associations: "6800",
  expense_banking: "6800",
  expense_payment_fees: "6800",
  expense_licenses: "6800",

  // Maintenance
  expense_maintenance_building: "6305",
  expense_maintenance_equipment: "6495",
  expense_maintenance_software: "6495",
  expense_maintenance_website: "6600",

  // Taxes
  expense_taxes_trade: "7600",
  expense_taxes_other: "7600",
  expense_trade_tax_prepayments: "7600",
  expense_corporate_tax_prepayments: "7600",
  expense_income_tax_prepayments: "7600",
  expense_solidarity_surcharge: "7608",
  expense_church_tax: "7600",

  // Finance
  expense_interest: "7300",
  expense_fees_financing: "7300",

  // Depreciation
  expense_depreciation_movable: "6200",
  expense_depreciation_building: "6200",
  expense_special_depreciation: "6200",
  expense_low_value_assets: "6815",

  // Home Office
  expense_home_office: "6305",
  expense_home_office_flat_rate: "6305",

  // Other
  expense_continuing_education: "6495",
  expense_memberships: "6800",
  expense_other: "6900",
  expense_non_deductible: "6900",
  expense_loss_carryforward: "6900",
  expense_tax_free_income: "4200",
  expense_non_deductible_tax: "6900",
  expense_investment_deduction: "6900",
  expense_investment_deduction_claimed: "6900",
  expense_investment_deduction_added: "6900",

  // Private
  private_withdrawal: "1900",
  private_withdrawal_taxes: "1900",
  private_deposit: "1800",
};

// SKR49 mapping (IKR - similar to SKR04)
const SEMANTIC_TO_SKR49_CODE: Record<string, string> = {
  // Income
  income_services_19: "4000",
  income_services_7: "4300",
  income_services_0: "4110",
  income_goods_19: "4000",
  income_goods_7: "4300",
  income_eu: "4125",
  income_export: "4135",
  income_prepayments: "4185",
  income_other: "4200",
  income_refunds: "4200",
  income_interest: "4900",
  income_partnership_share: "4900",

  // Purchases
  purchase_goods_19: "5000",
  purchase_goods_7: "5300",
  purchase_materials: "5000",
  purchase_packaging: "6700",

  // Personnel
  expense_wages: "6000",
  expense_social_employer: "6100",
  expense_pension: "6140",
  expense_freelancer: "5900",
  expense_training: "6495",

  // Rent & Space
  expense_rent_business: "6310",
  expense_rent_storage: "6310",
  expense_utilities: "6305",
  expense_heating: "6310",
  expense_cleaning: "6310",
  expense_security: "6305",

  // Vehicle
  expense_vehicle_fuel: "6530",
  expense_vehicle_repairs: "6530",
  expense_vehicle_insurance: "6520",
  expense_vehicle_tax: "6530",
  expense_vehicle_leasing: "6540",
  expense_vehicle_parking: "6530",

  // Advertising
  expense_advertising_print: "6600",
  expense_advertising_online: "6600",
  expense_advertising_radio: "6600",
  expense_trade_shows: "6600",
  expense_promotional: "6610",

  // Travel
  expense_travel_domestic: "6650",
  expense_travel_foreign: "6650",
  expense_accommodation: "6650",
  expense_meals_business: "6630",
  expense_meals_travel: "6650",

  // Communication
  expense_phone: "6805",
  expense_mobile: "6805",
  expense_internet: "6810",
  expense_postage: "6800",

  // Office
  expense_office_supplies: "6815",
  expense_office_equipment: "6815",
  expense_software: "6495",
  expense_books: "6820",
  expense_subscriptions: "6820",

  // Consulting
  expense_legal: "6800",
  expense_tax_advisor: "6800",
  expense_consulting: "5900",
  expense_auditing: "5900",

  // Insurance
  expense_insurance_business: "6400",
  expense_insurance_legal: "6400",
  expense_insurance_cyber: "6400",
  expense_insurance_property: "6400",

  // Fees & Memberships
  expense_chamber: "6800",
  expense_associations: "6800",
  expense_banking: "6800",
  expense_payment_fees: "6800",
  expense_licenses: "6800",

  // Maintenance
  expense_maintenance_building: "6305",
  expense_maintenance_equipment: "6495",
  expense_maintenance_software: "6495",
  expense_maintenance_website: "6600",

  // Taxes
  expense_taxes_trade: "7600",
  expense_taxes_other: "7600",
  expense_trade_tax_prepayments: "7600",
  expense_corporate_tax_prepayments: "7600",
  expense_income_tax_prepayments: "7600",
  expense_solidarity_surcharge: "7608",
  expense_church_tax: "7600",

  // Finance
  expense_interest: "7300",
  expense_fees_financing: "7300",

  // Depreciation
  expense_depreciation_movable: "6200",
  expense_depreciation_building: "6200",
  expense_special_depreciation: "6200",
  expense_low_value_assets: "6815",

  // Home Office
  expense_home_office: "6305",
  expense_home_office_flat_rate: "6305",

  // Other
  expense_continuing_education: "6495",
  expense_memberships: "6800",
  expense_other: "6900",
  expense_non_deductible: "6900",
  expense_loss_carryforward: "6900",
  expense_tax_free_income: "4200",
  expense_non_deductible_tax: "6900",
  expense_investment_deduction: "6900",
  expense_investment_deduction_claimed: "6900",
  expense_investment_deduction_added: "6900",

  // Private
  private_withdrawal: "1900",
  private_withdrawal_taxes: "1900",
  private_deposit: "1800",
};

// Helper to get the correct semantic-to-SKR mapping
export const getSemanticToSkrMapping = (
  skr: "SKR03" | "SKR04" | "SKR49",
): Record<string, string> => {
  switch (skr) {
    case "SKR03":
      return SEMANTIC_TO_SKR03_CODE;
    case "SKR04":
      return SEMANTIC_TO_SKR04_CODE;
    case "SKR49":
      return SEMANTIC_TO_SKR49_CODE;
  }
};

// Reverse mapping: SKR code to semantic key (for SKR04)
// Used to look up elsterMapping which uses semantic keys
const SKR04_CODE_TO_SEMANTIC_KEY: Record<string, string> = {
  "4000": "income_services_19",
  "4300": "income_services_7",
  "4110": "income_services_0",
  "4125": "income_eu",
  "4135": "income_export",
  "4185": "income_prepayments",
  "4200": "income_other",
  "4900": "income_interest",

  "5000": "purchase_goods_19",
  "5300": "purchase_goods_7",
  "5900": "expense_freelancer",
  "6000": "expense_wages",
  "6100": "expense_social_employer",
  "6140": "expense_pension",
  "6200": "expense_depreciation_movable",
  "6305": "expense_utilities",
  "6310": "expense_rent_business",
  "6400": "expense_insurance_business",
  "6495": "expense_software",
  "6520": "expense_vehicle_insurance",
  "6530": "expense_vehicle_fuel",
  "6540": "expense_vehicle_leasing",
  "6600": "expense_advertising_print",
  "6610": "expense_promotional",
  "6630": "expense_meals_business",
  "6650": "expense_travel_domestic",
  "6670": "expense_accommodation",
  "6700": "purchase_packaging",
  "6800": "expense_legal",
  "6805": "expense_phone",
  "6810": "expense_internet",
  "6815": "expense_office_supplies",
  "6820": "expense_books",
  "6900": "expense_other",
  "7300": "expense_interest",
  "7600": "expense_taxes_trade",
  "7608": "expense_solidarity_surcharge",
  "1900": "private_withdrawal",
  "1800": "private_deposit",
};

const SKR03_CODE_TO_SEMANTIC_KEY: Record<string, string> = { ...SKR04_CODE_TO_SEMANTIC_KEY };

const SKR49_CODE_TO_SEMANTIC_KEY: Record<string, string> = { ...SKR04_CODE_TO_SEMANTIC_KEY };

export const getSkrCodeToSemanticMapping = (
  skr: "SKR03" | "SKR04" | "SKR49",
): Record<string, string> => {
  switch (skr) {
    case "SKR03":
      return SKR03_CODE_TO_SEMANTIC_KEY;
    case "SKR04":
      return SKR04_CODE_TO_SEMANTIC_KEY;
    case "SKR49":
      return SKR49_CODE_TO_SEMANTIC_KEY;
  }
};

export const skrCodeToSemanticKey = (
  skrCode: string,
  skr: "SKR03" | "SKR04" | "SKR49" = "SKR04",
): string | undefined => {
  const mapping = getSkrCodeToSemanticMapping(skr);
  return mapping[skrCode];
};

// Elster EÜR-Feldmapping (based on official ELSTER documentation)
export const elsterMapping: ElsterMapping = {
  income_services_19: { elsterField: "15", label: "Umsatzsteuerpflichtige Umsätze (netto)" },
  income_services_7: { elsterField: "15", label: "Umsatzsteuerpflichtige Umsätze (netto)" },
  income_services_0: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },
  income_goods_19: { elsterField: "15", label: "Umsatzsteuerpflichtige Umsätze (netto)" },
  income_goods_7: { elsterField: "15", label: "Umsatzsteuerpflichtige Umsätze (netto)" },
  income_eu: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },
  income_export: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },
  income_prepayments: { elsterField: "15", label: "Umsatzsteuerpflichtige Umsätze (netto)" },
  income_other: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },
  income_refunds: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },
  income_interest: { elsterField: "16", label: "Steuerfreie und nicht steuerbare Umsätze" },

  purchase_goods_19: { elsterField: "27", label: "Waren, Rohstoffe und Hilfsstoffe" },
  purchase_goods_7: { elsterField: "27", label: "Waren, Rohstoffe und Hilfsstoffe" },
  purchase_materials: { elsterField: "27", label: "Waren, Rohstoffe und Hilfsstoffe" },
  purchase_packaging: { elsterField: "27", label: "Waren, Rohstoffe und Hilfsstoffe" },

  expense_wages: { elsterField: "30", label: "Personalkosten" },
  expense_social_employer: { elsterField: "30", label: "Personalkosten" },
  expense_pension: { elsterField: "30", label: "Personalkosten" },
  expense_freelancer: { elsterField: "29", label: "Fremdleistungen" },
  expense_training: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_rent_business: { elsterField: "34", label: "Miet- und Leasingaufwendungen für unbewegliche Wirtschaftsgüter" },
  expense_rent_storage: { elsterField: "34", label: "Miet- und Leasingaufwendungen für unbewegliche Wirtschaftsgüter" },
  expense_utilities: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_heating: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_cleaning: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_security: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_vehicle_fuel: { elsterField: "35", label: "Miet- und Leasingaufwendungen für bewegliche Wirtschaftsgüter" },
  expense_vehicle_repairs: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_vehicle_insurance: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_vehicle_tax: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_vehicle_leasing: { elsterField: "35", label: "Miet- und Leasingaufwendungen für bewegliche Wirtschaftsgüter" },
  expense_vehicle_parking: { elsterField: "44", label: "Reise- und Fahrtkosten" },

  expense_advertising_print: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_advertising_online: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_advertising_radio: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_trade_shows: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_promotional: { elsterField: "62", label: "Geschenke" },

  expense_travel_domestic: { elsterField: "44", label: "Reise- und Fahrtkosten" },
  expense_travel_foreign: { elsterField: "44", label: "Reise- und Fahrtkosten" },
  expense_accommodation: { elsterField: "44", label: "Reise- und Fahrtkosten" },
  expense_meals_business: { elsterField: "63", label: "Bewirtungskosten" },
  expense_meals_travel: { elsterField: "64", label: "Reiseverpflegungsmehraufwand" },

  expense_phone: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_mobile: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_internet: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_postage: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_office_supplies: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_office_equipment: { elsterField: "36", label: "Sofort abziehbare GWG" },
  expense_software: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_books: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_subscriptions: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_legal: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_tax_advisor: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_consulting: { elsterField: "29", label: "Fremdleistungen" },
  expense_auditing: { elsterField: "29", label: "Fremdleistungen" },

  expense_insurance_business: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_insurance_legal: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_insurance_cyber: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_insurance_property: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_chamber: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_associations: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_licenses: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_banking: { elsterField: "56", label: "Andere Finanzierungskosten" },
  expense_payment_fees: { elsterField: "56", label: "Andere Finanzierungskosten" },
  expense_interest: { elsterField: "55", label: "Schuldzinsen und ähnliche Entgelte" },
  expense_fees_financing: { elsterField: "56", label: "Andere Finanzierungskosten" },

  expense_maintenance_building: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_maintenance_equipment: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_maintenance_software: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_maintenance_website: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_taxes_trade: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_taxes_other: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_other: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_non_deductible: { elsterField: "81", label: "Nicht abziehbare Betriebsausgaben" },

  expense_depreciation_movable: { elsterField: "32", label: "AfA auf bewegliche Wirtschaftsgüter" },
  expense_depreciation_building: { elsterField: "31", label: "AfA auf unbewegliche Wirtschaftsgüter" },
  expense_special_depreciation: { elsterField: "33", label: "Andere AfA" },

  expense_low_value_assets: { elsterField: "36", label: "Sofort abziehbare GWG" },
  expense_home_office: { elsterField: "65", label: "Häusliches Arbeitszimmer" },
  expense_home_office_flat_rate: { elsterField: "66", label: "Homeoffice-Pauschale" },
  expense_continuing_education: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },
  expense_memberships: { elsterField: "37", label: "Andere sofort abzugsfähige Betriebsausgaben" },

  expense_tax_free_income: { elsterField: "78", label: "Steuerfreie Betriebseinnahmen" },
  expense_non_deductible_tax: { elsterField: "81", label: "Nicht abziehbare Betriebsausgaben" },
  expense_loss_carryforward: { elsterField: "79", label: "Absetzungsbeträge" },

  expense_investment_deduction: { elsterField: "80", label: "Investitionsabzugsbeträge" },
  expense_investment_deduction_claimed: { elsterField: "84", label: "Investitionsabzugsbetrag in Anspruch genommen" },
  expense_investment_deduction_added: { elsterField: "85", label: "Investitionsabzugsbetrag hinzugerechnet" },

  income_partnership_share: { elsterField: "91", label: "Gewinnanteil aus Personengesellschaften" },
};

// Function to load categories based on SKR - returns ONLY SKR codes as keys
export const getCategoriesForSkr = async (
  skr: "SKR03" | "SKR04" | "SKR49",
): Promise<Record<string, CategoryInfo>> => {
  try {
    const response = await fetch(`/data/${skr.toLowerCase()}.json`);
    const data = await response.json();

    const categories: Record<string, CategoryInfo> = {};

    // Convert SKR JSON data to CategoryInfo format
    data.forEach(
      (item: {
        leaf?: boolean;
        code?: string;
        name?: string;
        type?: string;
        "tax-related"?: boolean;
      }) => {
        if (item.leaf && item.code && item.name) {
          // Map SKR types to our category types
          let type: "income" | "expense" | "private" = "expense";
          if (item.type === "Ertrag") type = "income";
          else if (item.name.toLowerCase().includes("privat")) type = "private";

          // Extract VAT rate from name or set default
          let vat = 19;
          if (item.name.includes("7%")) vat = 7;
          else if (item.name.includes("0%") || item.name.includes("steuerfrei")) vat = 0;

          const codeString = item.code.toString();
          categories[codeString] = {
            name: item.name,
            type,
            code: codeString,
            vat,
          };
        }
      },
    );

    return categories;
  } catch (error) {
    console.warn(`Failed to load ${skr} categories, falling back to hardcoded:`, error);
    // Return hardcoded fallback for tests and offline scenarios
    return skr04Categories;
  }
};

// Translate a semantic category key to an SKR code
export const semanticKeyToSkrCode = (
  semanticKey: string,
  skr: "SKR03" | "SKR04" | "SKR49",
): string => {
  const mapping = getSemanticToSkrMapping(skr);
  return mapping[semanticKey] || semanticKey; // Return as-is if not found (might already be a code)
};

// Hardcoded fallback for legacy code and tests
// Uses SKR codes as keys to match the JSON data format
export const skr04Categories: Record<string, CategoryInfo> = {
  "4000": { name: "Umsatzerlöse", type: "income", code: "4000", vat: 19 },
  "4300": { name: "Umsatzerlöse 7% USt", type: "income", code: "4300", vat: 7 },
  "4110": { name: "Sonstige steuerfreie Umsätze", type: "income", code: "4110", vat: 0 },
  "4125": { name: "Steuerfreie EG-Lieferungen", type: "income", code: "4125", vat: 0 },
  "4135": { name: "Steuerfreie EG-Lief. v. Neufahrzeugen", type: "income", code: "4135", vat: 0 },
  "4185": { name: "Erlöse Kleinunternehmer", type: "income", code: "4185", vat: 19 },
  "4200": { name: "Erlöse (sonstige)", type: "income", code: "4200", vat: 0 },
  "4900": { name: "Sonstige Erträge", type: "income", code: "4900", vat: 0 },

  "5000": { name: "Aufwendungen für Roh-, Hilfs- und Betriebsstoffe", type: "expense", code: "5000", vat: 19 },
  "5300": { name: "Wareneingang 7% Vorsteuer", type: "expense", code: "5300", vat: 7 },
  "5900": { name: "Fremdleistungen", type: "expense", code: "5900", vat: 19 },
  "6000": { name: "Löhne und Gehälter", type: "expense", code: "6000", vat: 0 },
  "6100": { name: "Soziale Abgaben", type: "expense", code: "6100", vat: 0 },
  "6140": { name: "Aufwendungen für Altersversorgung", type: "expense", code: "6140", vat: 0 },
  "6200": { name: "Abschreibungen auf immaterielle Vermögensgegenstände", type: "expense", code: "6200", vat: 0 },
  "6305": { name: "Raumkosten", type: "expense", code: "6305", vat: 19 },
  "6310": { name: "Miete", type: "expense", code: "6310", vat: 19 },
  "6400": { name: "Versicherungen", type: "expense", code: "6400", vat: 19 },
  "6495": { name: "Wartungskosten für Hard- und Software", type: "expense", code: "6495", vat: 19 },
  "6520": { name: "Kfz-Versicherungen", type: "expense", code: "6520", vat: 19 },
  "6530": { name: "Laufende Kfz-Betriebskosten", type: "expense", code: "6530", vat: 19 },
  "6540": { name: "Kfz-Leasing", type: "expense", code: "6540", vat: 19 },
  "6600": { name: "Werbekosten", type: "expense", code: "6600", vat: 19 },
  "6610": { name: "Geschenke bis 40€", type: "expense", code: "6610", vat: 19 },
  "6630": { name: "Bewirtungskosten", type: "expense", code: "6630", vat: 19 },
  "6650": { name: "Reisekosten", type: "expense", code: "6650", vat: 19 },
  "6700": { name: "Kosten der Warenabgabe", type: "expense", code: "6700", vat: 19 },
  "6800": { name: "Sonstige betriebliche Aufwendungen", type: "expense", code: "6800", vat: 19 },
  "6805": { name: "Telefon", type: "expense", code: "6805", vat: 19 },
  "6810": { name: "Telefax und Internetkosten", type: "expense", code: "6810", vat: 19 },
  "6815": { name: "Bürobedarf", type: "expense", code: "6815", vat: 19 },
  "6820": { name: "Fachzeitschriften", type: "expense", code: "6820", vat: 7 },
  "6900": { name: "Sonstige betriebliche Aufwendungen", type: "expense", code: "6900", vat: 19 },
  "7300": { name: "Zinsen", type: "expense", code: "7300", vat: 0 },
  "7600": { name: "Körperschaftsteuer", type: "expense", code: "7600", vat: 0 },
  "7608": { name: "Solidaritätszuschlag", type: "expense", code: "7608", vat: 0 },
  "1800": { name: "Privateinlagen", type: "private", code: "1800", vat: 0 },
  "1900": { name: "Privatentnahmen", type: "private", code: "1900", vat: 0 },
};

export const FREQUENT_INCOME_CATEGORIES = ["4000", "4300", "4110", "4200", "4900"];

export const FREQUENT_EXPENSE_CATEGORIES = [
  "6815",
  "6800",
  "6310",
  "6805",
  "6495",
  "6600",
  "5900",
  "6650",
  "6305",
  "6400",
  "7600",
  "7300",
  "6630",
  "6530",
  "6810",
  "6820",
  "6610",
  "6520",
  "6540",
  "4125",
];