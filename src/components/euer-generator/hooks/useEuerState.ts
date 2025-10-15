import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction } from "../../../types";
import {
	getCategoriesForSkr,
	skr04Categories,
} from "../../../utils/categoryMappings";
import { calculateEuer } from "../../../utils/euerCalculations";
import { prepareGuidanceData } from "../../../utils/guidanceUtils";

type SkrType = "SKR03" | "SKR04" | "SKR49";
type ViewType = "transactions" | "elster" | "impressum" | "datenschutz";

/**
 * useEuerState consolidates main application state management for the EÜR generator.
 *
 * @returns Centralized state and setter functions for the entire application
 *
 * @example
 * const state = useEuerState()
 * state.setTransactions(newTransactions)
 * state.updateCategory(transactionId, categoryKey)
 */
export function useEuerState() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [categories, setCategories] = useState<Record<number, string>>({});
	const [bankType, setBankType] = useState<string | null>(null);
	const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
	const [currentSkr, setCurrentSkr] = useState<SkrType>("SKR04");
	const [skrCategories, setSkrCategories] =
		useState<
			Record<
				string,
				{
					code: string;
					name: string;
					type: string;
					vat: number;
					elsterField?: string;
				}
			>
		>(skr04Categories);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isDemoMode, setIsDemoMode] = useState(false);
	const [currentView, setCurrentView] = useState<ViewType>("transactions");
	const [currentSection, setCurrentSection] = useState("income");

	// Load SKR categories dynamically when SKR type changes
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const loadedCategories = await getCategoriesForSkr(currentSkr);
				setSkrCategories(loadedCategories);
			} catch (error) {
				console.warn(
					`Failed to load ${currentSkr} categories, using fallback:`,
					error,
				);
				setSkrCategories(skr04Categories);
			}
		};

		loadCategories();
	}, [currentSkr]);

	// Memoized category lists for performance
	const incomeCategories = useMemo(
		() =>
			Object.entries(skrCategories)
				.filter(([, cat]) => cat.type === "income")
				.sort((a, b) => a[1].name.localeCompare(b[1].name)),
		[skrCategories],
	);

	const expenseCategories = useMemo(
		() =>
			Object.entries(skrCategories)
				.filter(([, cat]) => cat.type === "expense" || cat.type === "private")
				.sort((a, b) => a[1].name.localeCompare(b[1].name)),
		[skrCategories],
	);

	// EÜR calculation memoized
	const euerCalculation = useMemo(() => {
		return calculateEuer(
			transactions,
			categories,
			isKleinunternehmer,
			skrCategories,
		);
	}, [transactions, categories, isKleinunternehmer, skrCategories]);

	// Guidance system data memoized
	const guidanceData = useMemo(() => {
		if (transactions.length === 0) return null;
		return prepareGuidanceData(
			transactions,
			categories,
			isKleinunternehmer,
			euerCalculation,
		);
	}, [transactions, categories, isKleinunternehmer, euerCalculation]);

	// Optimized callback to prevent unnecessary re-renders
	const updateCategory = useCallback(
		(transactionId: number, categoryKey: string) => {
			setCategories((prev) => ({
				...prev,
				[transactionId]: categoryKey,
			}));
		},
		[],
	);

	// Reset all state
	const resetState = useCallback(() => {
		setTransactions([]);
		setCategories({});
		setBankType(null);
		setIsDemoMode(false);
		setErrorMessage(null);
	}, []);

	return {
		// State
		transactions,
		categories,
		bankType,
		isKleinunternehmer,
		currentSkr,
		skrCategories,
		errorMessage,
		isDemoMode,
		currentView,
		currentSection,
		// Setters
		setTransactions,
		setCategories,
		setBankType,
		setIsKleinunternehmer,
		setCurrentSkr,
		setSkrCategories,
		setErrorMessage,
		setIsDemoMode,
		setCurrentView,
		setCurrentSection,
		// Computed values
		incomeCategories,
		expenseCategories,
		euerCalculation,
		guidanceData,
		// Utility functions
		updateCategory,
		resetState,
	};
}
