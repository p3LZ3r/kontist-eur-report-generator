import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Transaction } from "../../types";
import TransactionRow from "../TransactionRow";
import TransactionRowMobile from "../TransactionRowMobile";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface TransactionListProps {
	transactions: Transaction[];
	currentTransactions: Transaction[];
	categories: Record<number, string>;
	skrCategories: Record<
		string,
		{
			code: string;
			name: string;
			type: string;
			vat: number;
			elsterField?: string;
		}
	>;
	incomeCategories: Array<
		[
			string,
			{
				code: string;
				name: string;
				type: string;
				vat: number;
				elsterField?: string;
			},
		]
	>;
	expenseCategories: Array<
		[
			string,
			{
				code: string;
				name: string;
				type: string;
				vat: number;
				elsterField?: string;
			},
		]
	>;
	currentSkr: "SKR03" | "SKR04" | "SKR49";
	isKleinunternehmer: boolean;
	bankType: string | null;
	isDemoMode: boolean;
	currentPage: number;
	totalPages: number;
	indexOfFirstTransaction: number;
	indexOfLastTransaction: number;
	onCategoryChange: (transactionId: number, categoryKey: string) => void;
	onPageChange: (page: number) => void;
	onResetAndUploadNew: () => void;
	onNavigateToElster: () => void;
}

/**
 * TransactionList displays transaction table/list view with pagination controls.
 *
 * @param props - Transaction list configuration and handlers
 */
export function TransactionList({
	transactions,
	currentTransactions,
	categories,
	skrCategories,
	incomeCategories,
	expenseCategories,
	currentSkr,
	isKleinunternehmer,
	bankType,
	isDemoMode,
	currentPage,
	totalPages,
	indexOfFirstTransaction,
	indexOfLastTransaction,
	onCategoryChange,
	onPageChange,
	onResetAndUploadNew,
	onNavigateToElster,
}: TransactionListProps) {
	return (
		<Card className="animate-fade-in">
			<CardContent className="p-6">
				<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
					<h2 className="text-2xl text-foreground flex items-center gap-2">
						Transaktionen kategorisieren
					</h2>

					<div className="flex-1 flex justify-center gap-2 flex-wrap">
						<div className="px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
							<span className="text-xs font-medium">
								{bankType === "kontist" ? "Kontist" : "Holvi"} CSV erkannt
							</span>
						</div>
						{isDemoMode && (
							<div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-200">
								<span className="text-xs font-medium">Demo-Modus</span>
							</div>
						)}
						<div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
							<span className="text-xs font-medium">{currentSkr}</span>
						</div>
						<div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
							<span className="text-xs font-medium">
								{isKleinunternehmer
									? "Kleinunternehmer §19 UStG"
									: "Regelbesteuerung"}
							</span>
						</div>
					</div>

					<Button
						onClick={onResetAndUploadNew}
						variant="outline"
						size="sm"
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground focus-ring"
						title="Neue CSV-Datei hochladen (aktueller Fortschritt geht verloren)"
					>
						<RotateCcw size={16} aria-hidden="true" />
						Neue Datei
					</Button>
				</div>

				{/* Pagination Controls */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
					<div className="text-sm text-muted-foreground">
						Zeige {indexOfFirstTransaction + 1}-
						{Math.min(indexOfLastTransaction, transactions.length)} von{" "}
						{transactions.length}
					</div>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
							disabled={currentPage === 1}
							variant="outline"
							size="sm"
							className="flex items-center gap-1 focus-ring"
						>
							<ChevronLeft size={16} aria-hidden="true" />
							Zurück
						</Button>
						<div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">
							{currentPage} / {totalPages}
						</div>
						<Button
							onClick={() =>
								onPageChange(Math.min(currentPage + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							variant="outline"
							size="sm"
							className="flex items-center gap-1 focus-ring"
						>
							Weiter
							<ChevronRight size={16} aria-hidden="true" />
						</Button>
					</div>
				</div>

				{/* Desktop Table View */}
				<div className="hidden sm:block overflow-x-auto">
					<table className="w-full min-w-full text-sm border-collapse">
						<thead>
							<tr className="border-b border-border bg-muted/50">
								<th className="text-left p-3 text-muted-foreground font-normal w-24">
									Datum
								</th>
								<th className="text-left p-3 text-muted-foreground font-normal w-1/5 min-w-32">
									Gegenpartei
								</th>
								<th className="text-right p-3 text-muted-foreground font-normal w-20">
									Betrag
								</th>
								<th className="text-left p-3 text-muted-foreground font-normal w-1/4 min-w-40">
									Verwendungszweck
								</th>
								<th className="text-left p-3 text-muted-foreground font-normal w-1/3 min-w-48">
									{currentSkr}-Konto
								</th>
							</tr>
						</thead>
						<tbody>
							{currentTransactions.map((transaction) => {
								const categoryKey =
									categories[transaction.id] || transaction.euerCategory || "";

								return (
									<TransactionRow
										key={transaction.id}
										transaction={transaction}
										categoryKey={categoryKey}
										skrCategories={skrCategories}
										incomeCategories={incomeCategories}
										expenseCategories={expenseCategories}
										currentSkr={currentSkr}
										onCategoryChange={onCategoryChange}
									/>
								);
							})}
						</tbody>
					</table>
				</div>

				{/* Mobile List View */}
				<div className="sm:hidden">
					<ul className="divide-y divide-border">
						{currentTransactions.map((transaction) => {
							const categoryKey =
								categories[transaction.id] || transaction.euerCategory || "";

							return (
								<TransactionRowMobile
									key={transaction.id}
									transaction={transaction}
									categoryKey={categoryKey}
									skrCategories={skrCategories}
									incomeCategories={incomeCategories}
									expenseCategories={expenseCategories}
									currentSkr={currentSkr}
									onCategoryChange={onCategoryChange}
								/>
							);
						})}
					</ul>
				</div>

				{/* Pagination Controls unten */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8">
					<div className="text-sm text-muted-foreground text-center sm:text-left">
						Zeige {indexOfFirstTransaction + 1}-
						{Math.min(indexOfLastTransaction, transactions.length)} von{" "}
						{transactions.length}
					</div>
					<div className="flex items-center gap-2 justify-center">
						<Button
							onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
							disabled={currentPage === 1}
							variant="outline"
							size="sm"
							className="flex items-center gap-1 focus-ring"
						>
							<ChevronLeft size={16} aria-hidden="true" />
							Zurück
						</Button>
						<div className="flex items-center px-3 py-1.5 bg-muted text-muted-foreground rounded-md border text-sm h-8">
							{currentPage} / {totalPages}
						</div>
						<Button
							onClick={() =>
								onPageChange(Math.min(currentPage + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							variant="outline"
							size="sm"
							className="flex items-center gap-1 focus-ring"
						>
							Weiter
							<ChevronRight size={16} aria-hidden="true" />
						</Button>
					</div>
					<Button
						onClick={onNavigateToElster}
						variant="default"
						size="sm"
						className="flex items-center gap-2 focus-ring"
					>
						<ChevronLeft size={16} className="rotate-90" aria-hidden="true" />
						Zu den Elsterfeldern
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
