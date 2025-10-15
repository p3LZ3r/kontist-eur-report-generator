import type { Account, KontenrahmenData, KontenrahmenType } from "../types";

// Cache for loaded data
const dataCache: { [key in KontenrahmenType]?: Account[] } = {};

export async function loadKontenrahmenData(
	type: KontenrahmenType,
): Promise<Account[]> {
	if (dataCache[type]) {
		return dataCache[type]!;
	}

	try {
		const response = await fetch(`/data/${type.toLowerCase()}.json`);
		if (!response.ok) {
			throw new Error(`Failed to load ${type} data`);
		}
		const data: Account[] = await response.json();
		dataCache[type] = data;
		return data;
	} catch (error) {
		console.error(`Error loading ${type} data:`, error);
		throw error;
	}
}

// Convert hierarchical account data to flat category mapping
export function createCategoryMapping(accounts: Account[]): KontenrahmenData {
	const mapping: KontenrahmenData = {};

	// Find leaf accounts (those that can be used for transactions)
	const leafAccounts = accounts.filter(
		(account) => account.leaf && account.code !== -1,
	);

	leafAccounts.forEach((account) => {
		// Try to match account name to our existing categories
		const categoryKey = mapAccountToCategory(account.name, account.type);
		if (categoryKey) {
			mapping[categoryKey] = {
				name: account.name,
				type:
					account.type === "Ertrag"
						? "income"
						: account.type === "Aufwand"
							? "expense"
							: account.type === "Eigenkapital"
								? "private"
								: "expense",
				code: account.code.toString(),
				vat: getVatRate(account.name),
			};
		}
	});

	return mapping;
}

// Map account names to our existing category keys
function mapAccountToCategory(
	accountName: string,
	accountType: string,
): string | null {
	const name = accountName.toLowerCase();

	// Income categories
	if (accountType === "Ertrag") {
		if (name.includes("erlös") || name.includes("umsatz")) {
			if (name.includes("19%") || name.includes("19"))
				return "income_services_19";
			if (name.includes("7%") || name.includes("7")) return "income_services_7";
			if (name.includes("steuerfrei") || name.includes("0%"))
				return "income_services_0";
			return "income_services_19";
		}
		if (name.includes("zinsen") || name.includes("zinserträge"))
			return "income_interest";
		if (name.includes("sonstige erträge")) return "income_other";
	}

	// Expense categories
	if (accountType === "Aufwand") {
		if (name.includes("wareneinsatz") || name.includes("wareneingang")) {
			if (name.includes("19%")) return "purchase_goods_19";
			if (name.includes("7%")) return "purchase_goods_7";
			return "purchase_goods_19";
		}
		if (name.includes("löhne") || name.includes("gehälter"))
			return "expense_wages";
		if (
			name.includes("soziale aufwendungen") ||
			name.includes("arbeitgeberanteile")
		)
			return "expense_social_employer";
		if (name.includes("altersversorgung")) return "expense_pension";
		if (name.includes("mieten") || name.includes("miete"))
			return "expense_rent_business";
		if (
			name.includes("strom") ||
			name.includes("gas") ||
			name.includes("wasser")
		)
			return "expense_utilities";
		if (name.includes("telefon") || name.includes("telekom"))
			return "expense_phone";
		if (name.includes("büromaterial") || name.includes("bürobedarf"))
			return "expense_office_supplies";
		if (name.includes("werbekosten") || name.includes("werbung"))
			return "expense_advertising_print";
		if (name.includes("reisekosten")) return "expense_travel_domestic";
		if (name.includes("bewirtung")) return "expense_meals_business";
		if (name.includes("versicherungen")) return "expense_insurance_business";
		if (name.includes("beratung") || name.includes("steuerberatung"))
			return "expense_tax_advisor";
		if (name.includes("bankgebühren")) return "expense_banking";
		if (name.includes("zinsaufwendungen")) return "expense_interest";
		if (name.includes("gema")) return "expense_licenses";
	}

	// Private categories
	if (accountType === "Eigenkapital") {
		if (name.includes("privatentnahme") || name.includes("entnahme"))
			return "private_withdrawal";
		if (name.includes("privateinlagen")) return "private_deposit";
	}

	return null;
}

// Get VAT rate from account name
function getVatRate(accountName: string): number {
	const name = accountName.toLowerCase();
	if (name.includes("19%") || name.includes("19")) return 19;
	if (name.includes("7%") || name.includes("7")) return 7;
	if (name.includes("steuerfrei") || name.includes("0%")) return 0;
	return 19; // Default
}

// Get all available Kontenrahmen types
export function getAvailableKontenrahmen(): KontenrahmenType[] {
	return ["SKR03", "SKR04"];
}
