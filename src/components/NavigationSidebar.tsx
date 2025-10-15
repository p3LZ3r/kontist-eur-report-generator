import {
	Calculator,
	FileText,
	TrendingDown,
	TrendingUp,
	User,
} from "lucide-react";
import type React from "react";
import type { NavigationSection } from "../types";
import { Button } from "./ui/button";

interface NavigationSidebarProps {
	sections: NavigationSection[];
	currentSection: string;
	onSectionChange: (sectionId: string) => void;
	currentSkr?: string;
	isKleinunternehmer?: boolean;
	euerCalculation?: {
		totalIncome: number;
		totalExpenses: number;
		profit: number;
		privateWithdrawals: number;
		privateDeposits: number;
	};
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
	sections,
	currentSection,
	onSectionChange,
	currentSkr = "SKR04",
	isKleinunternehmer = false,
	euerCalculation,
}) => {
	const getSectionIcon = (sectionId: string) => {
		switch (sectionId) {
			case "general":
				return <FileText size={20} />;
			case "advisor":
				return <User size={20} />;
			case "income":
				return <TrendingUp size={20} />;
			case "expenses":
				return <TrendingDown size={20} />;
			case "profit":
				return <Calculator size={20} />;
			case "reserves":
				return <FileText size={20} />;
			case "withdrawals":
				return <FileText size={20} />;
			default:
				return <FileText size={20} />;
		}
	};

	const getSectionColor = (sectionId: string) => {
		switch (sectionId) {
			case "general":
				return "text-muted-foreground";
			case "advisor":
				return "text-muted-foreground";
			case "income":
				return "text-green-600";
			case "expenses":
				return "text-red-600";
			case "profit":
				return "text-primary";
			case "reserves":
				return "text-muted-foreground";
			case "withdrawals":
				return "text-muted-foreground";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			{/* Navigation Sections */}
			<div className="space-y-2 flex-1">
				{sections.map((section) => (
					<Button
						key={section.id}
						variant={currentSection === section.id ? "default" : "ghost"}
						className={`w-full justify-start p-3 h-auto cursor-pointer ${
							currentSection === section.id
								? "bg-primary text-primary-foreground"
								: "bg-muted/50 hover:bg-muted"
						}`}
						onClick={() => onSectionChange(section.id)}
					>
						<div className="flex items-center gap-3 w-full">
							<div
								className={`flex-shrink-0 ${currentSection === section.id ? "text-primary-foreground" : getSectionColor(section.id)}`}
							>
								{getSectionIcon(section.id)}
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium text-sm">{section.title}</div>
							</div>
						</div>
					</Button>
				))}
			</div>

			{/* Summary Cards */}
			{euerCalculation && (
				<div className="space-y-3 mb-4">
					{/* Gewinnermittlungskarte */}
					<div className="p-3 rounded-lg border border-border bg-background">
						<div className="text-[10px] text-muted-foreground mb-2 text-left uppercase tracking-wide">
							Gewinnermittlung
						</div>
						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="truncate pr-2">Betriebseinnahmen</span>
								<span className="font-mono text-green-600">
									+
									{euerCalculation.totalIncome.toLocaleString("de-DE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									€
								</span>
							</div>
							<div className="flex items-center justify-between text-xs">
								<span className="truncate pr-2">Betriebsausgaben</span>
								<span className="font-mono text-red-600">
									-
									{Math.abs(euerCalculation.totalExpenses).toLocaleString(
										"de-DE",
										{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
									)}
									€
								</span>
							</div>
							<div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/60">
								<span className="font-medium truncate pr-2">
									Gewinn / Verlust
								</span>
								<span
									className={`font-mono font-medium ${
										euerCalculation.profit >= 0
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{euerCalculation.profit >= 0 ? "+" : ""}
									{euerCalculation.profit.toLocaleString("de-DE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									€
								</span>
							</div>
						</div>
					</div>

					{/* Private Geldflüssecard */}
					<div className="p-3 rounded-lg border border-border bg-background">
						<div className="text-[10px] text-muted-foreground mb-2 text-left uppercase tracking-wide">
							Private Geldflüsse
						</div>
						<div className="space-y-1.5">
							<div className="flex items-center justify-between text-xs">
								<span className="truncate pr-2">Privateinlagen</span>
								<span className="font-mono text-green-600">
									{euerCalculation.privateDeposits === 0
										? "0,00€"
										: `+${euerCalculation.privateDeposits.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`}
								</span>
							</div>
							<div className="flex items-center justify-between text-xs">
								<span className="truncate pr-2">Privatentnahmen</span>
								<span className="font-mono text-red-600">
									{euerCalculation.privateWithdrawals === 0
										? "0,00€"
										: `-${Math.abs(euerCalculation.privateWithdrawals).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`}
								</span>
							</div>
							<div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/60">
								<span className="font-medium truncate pr-2">Summe</span>
								<span
									className={`font-mono font-medium ${
										(
											euerCalculation.privateDeposits -
												Math.abs(euerCalculation.privateWithdrawals)
										) >= 0
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{euerCalculation.privateDeposits -
										Math.abs(euerCalculation.privateWithdrawals) >=
									0
										? "+"
										: ""}
									{(
										euerCalculation.privateDeposits -
										Math.abs(euerCalculation.privateWithdrawals)
									).toLocaleString("de-DE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									€
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Sidebar footer with configuration info (subtle, two columns, bottom) */}
			<div className="mt-auto pt-4 grid grid-cols-2 gap-x-4 text-muted-foreground">
				<div className="flex flex-col items-start">
					<div className="text-[10px] uppercase tracking-wide">
						Kontenrahmen
					</div>
					<div className="text-sm font-medium text-foreground leading-tight">
						{currentSkr}
					</div>
				</div>
				<div className="flex flex-col items-end">
					<div className="text-[10px] uppercase tracking-wide">
						Kleinunternehmer
					</div>
					<div className="text-sm font-medium text-foreground leading-tight">
						{isKleinunternehmer ? "Ja" : "Nein"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NavigationSidebar;
