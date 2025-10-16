import type { ElsterMapping } from "../types";

export type CategoryInfo = {
  name: string;
  type: "income" | "expense" | "private";
  code: string;
  vat: number;
};

// Elster EÜR-Feldmapping (based on official ELSTER documentation)
export const elsterMapping: ElsterMapping = {
  // PERSONAL DATA FIELDS (1-11) - Populated from user tax data, not transactions
  // These fields are handled separately in automatic population functions

  // INCOME FIELDS (12, 15-16, 19-20)
  // Field 12: For Kleinunternehmer (gross amounts)
  income_services_19: {
    elsterField: "15",
    label: "Umsatzsteuerpflichtige Umsätze (netto)",
  },
  income_services_7: {
    elsterField: "15",
    label: "Umsatzsteuerpflichtige Umsätze (netto)",
  },
  income_services_0: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },
  income_goods_19: {
    elsterField: "15",
    label: "Umsatzsteuerpflichtige Umsätze (netto)",
  },
  income_goods_7: {
    elsterField: "15",
    label: "Umsatzsteuerpflichtige Umsätze (netto)",
  },
  income_eu: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },
  income_export: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },
  income_prepayments: {
    elsterField: "15",
    label: "Umsatzsteuerpflichtige Umsätze (netto)",
  },
  income_other: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },
  income_refunds: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },
  income_interest: {
    elsterField: "16",
    label: "Steuerfreie und nicht steuerbare Umsätze",
  },

  // EXPENSE FIELDS (27, 29-37, 44, 55-56, 62-66)
  // Waren und Material
  purchase_goods_19: {
    elsterField: "27",
    label: "Waren, Rohstoffe und Hilfsstoffe",
  },
  purchase_goods_7: {
    elsterField: "27",
    label: "Waren, Rohstoffe und Hilfsstoffe",
  },
  purchase_materials: {
    elsterField: "27",
    label: "Waren, Rohstoffe und Hilfsstoffe",
  },
  purchase_packaging: {
    elsterField: "27",
    label: "Waren, Rohstoffe und Hilfsstoffe",
  },

  // Personalkosten und Fremdleistungen
  expense_wages: { elsterField: "30", label: "Personalkosten" },
  expense_social_employer: { elsterField: "30", label: "Personalkosten" },
  expense_pension: { elsterField: "30", label: "Personalkosten" },
  expense_freelancer: { elsterField: "29", label: "Fremdleistungen" },
  expense_training: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Raumkosten
  expense_rent_business: {
    elsterField: "34",
    label: "Miet- und Leasingaufwendungen für unbewegliche Wirtschaftsgüter",
  },
  expense_rent_storage: {
    elsterField: "34",
    label: "Miet- und Leasingaufwendungen für unbewegliche Wirtschaftsgüter",
  },
  expense_utilities: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_heating: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_cleaning: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_security: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Fahrzeugkosten
  expense_vehicle_fuel: {
    elsterField: "35",
    label: "Miet- und Leasingaufwendungen für bewegliche Wirtschaftsgüter",
  },
  expense_vehicle_repairs: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_vehicle_insurance: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_vehicle_tax: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_vehicle_leasing: {
    elsterField: "35",
    label: "Miet- und Leasingaufwendungen für bewegliche Wirtschaftsgüter",
  },
  expense_vehicle_parking: {
    elsterField: "44",
    label: "Reise- und Fahrtkosten",
  },

  // Werbekosten
  expense_advertising_print: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_advertising_online: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_advertising_radio: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_trade_shows: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_promotional: { elsterField: "62", label: "Geschenke" },

  // Reisekosten
  expense_travel_domestic: {
    elsterField: "44",
    label: "Reise- und Fahrtkosten",
  },
  expense_travel_foreign: {
    elsterField: "44",
    label: "Reise- und Fahrtkosten",
  },
  expense_accommodation: { elsterField: "44", label: "Reise- und Fahrtkosten" },
  expense_meals_business: { elsterField: "63", label: "Bewirtungskosten" },
  expense_meals_travel: {
    elsterField: "64",
    label: "Reiseverpflegungsmehraufwand",
  },

  // Kommunikation & Büro
  expense_phone: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_mobile: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_internet: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_postage: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_office_supplies: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_office_equipment: {
    elsterField: "36",
    label: "Sofort abziehbare GWG",
  },
  expense_software: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_books: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_subscriptions: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Beratung
  expense_legal: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_tax_advisor: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_consulting: { elsterField: "29", label: "Fremdleistungen" },
  expense_auditing: { elsterField: "29", label: "Fremdleistungen" },

  // Versicherungen & Beiträge
  expense_insurance_business: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_insurance_legal: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_insurance_cyber: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_insurance_property: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_chamber: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_associations: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_licenses: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Finanzkosten
  expense_banking: { elsterField: "56", label: "Andere Finanzierungskosten" },
  expense_payment_fees: {
    elsterField: "56",
    label: "Andere Finanzierungskosten",
  },
  expense_interest: {
    elsterField: "55",
    label: "Schuldzinsen und ähnliche Entgelte",
  },
  expense_fees_financing: {
    elsterField: "56",
    label: "Andere Finanzierungskosten",
  },

  // Instandhaltung
  expense_maintenance_building: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_maintenance_equipment: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_maintenance_software: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_maintenance_website: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Steuern und sonstige Ausgaben
  expense_taxes_trade: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_taxes_other: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Andere und Home Office
  expense_other: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_non_deductible: {
    elsterField: "81",
    label: "Nicht abziehbare Betriebsausgaben",
  },

  // Depreciation and amortization
  expense_depreciation_movable: {
    elsterField: "32",
    label: "AfA auf bewegliche Wirtschaftsgüter des Anlagevermögens",
  },
  expense_depreciation_building: {
    elsterField: "31",
    label: "AfA auf unbewegliche Wirtschaftsgüter des Anlagevermögens",
  },
  expense_special_depreciation: { elsterField: "33", label: "Andere AfA" },

  // Additional business expenses from official fields
  expense_low_value_assets: {
    elsterField: "36",
    label: "Sofort abziehbare GWG",
  },
  expense_home_office: { elsterField: "65", label: "Häusliches Arbeitszimmer" },
  expense_home_office_flat_rate: {
    elsterField: "66",
    label: "Homeoffice-Pauschale",
  },
  expense_continuing_education: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },
  expense_memberships: {
    elsterField: "37",
    label: "Andere sofort abzugsfähige Betriebsausgaben",
  },

  // Tax-free income and non-deductible expenses (profit calculation fields)
  expense_tax_free_income: {
    elsterField: "78",
    label: "Steuerfreie Betriebseinnahmen",
  },
  expense_non_deductible_tax: {
    elsterField: "81",
    label: "Nicht abziehbare Betriebsausgaben",
  },
  expense_loss_carryforward: { elsterField: "79", label: "Absetzungsbeträge" },

  // Investment-related fields
  expense_investment_deduction: {
    elsterField: "80",
    label: "Investitionsabzugsbeträge",
  },
  expense_investment_deduction_claimed: {
    elsterField: "84",
    label: "Investitionsabzugsbetrag in Anspruch genommen",
  },
  expense_investment_deduction_added: {
    elsterField: "85",
    label: "Investitionsabzugsbetrag hinzugerechnet",
  },

  // Partnership income
  income_partnership_share: {
    elsterField: "91",
    label: "Gewinnanteil aus Personengesellschaften",
  },
};

// Function to load categories based on SKR
export const getCategoriesForSkr = async (
  skr: "SKR03" | "SKR04" | "SKR49"
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
          let vat = 19; // Default
          if (item.name.includes("7%")) vat = 7;
          else if (item.name.includes("0%") || item.name.includes("steuerfrei"))
            vat = 0;

          categories[item.code.toString()] = {
            name: item.name,
            type,
            code: item.code.toString(),
            vat,
          };
        }
      }
    );

    return categories;
  } catch (error) {
    console.error(`Failed to load ${skr} categories:`, error);
    throw new Error(
      `Unable to load SKR categories from /data/${skr.toLowerCase()}.json. ` +
        "Please ensure the file exists and is accessible."
    );
  }
};

// Minimal fallback for legacy code and tests
// @deprecated Use getCategoriesForSkr() instead
export const skr04Categories: Record<string, CategoryInfo> = {};
