import type {
	EuerCalculation,
	FieldGroup,
	NavigationSection,
} from "../../types";
import FieldGroups from "../FieldGroups";
import NavigationSidebar from "../NavigationSidebar";
import { Card, CardContent } from "../ui/card";

interface ElsterViewProps {
	guidanceData: {
		sections: NavigationSection[];
		groups: FieldGroup[];
	};
	currentSection: string;
	onSectionChange: (sectionId: string) => void;
	currentSkr: "SKR03" | "SKR04" | "SKR49";
	isKleinunternehmer: boolean;
	euerCalculation: EuerCalculation;
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
}

/**
 * ElsterView displays the ELSTER guidance system with navigation sidebar
 * and field groups for tax form completion.
 *
 * @param props - ELSTER view configuration and handlers
 */
export function ElsterView({
	guidanceData,
	currentSection,
	onSectionChange,
	currentSkr,
	isKleinunternehmer,
	euerCalculation,
	categories,
	skrCategories,
}: ElsterViewProps) {
	return (
		<Card className="animate-fade-in">
			<CardContent className="p-0">
				<div className="flex flex-col lg:flex-row">
					{/* Navigation Sidebar */}
					<div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-muted/30">
						<div className="p-6 h-full flex flex-col">
							<NavigationSidebar
								sections={guidanceData.sections}
								currentSection={currentSection}
								onSectionChange={onSectionChange}
								currentSkr={currentSkr}
								isKleinunternehmer={isKleinunternehmer}
								euerCalculation={euerCalculation}
							/>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 min-h-[600px]">
						<div className="p-6 space-y-6">
							<FieldGroups
								groups={guidanceData.groups.filter((group) => {
									if (currentSection === "income")
										return group.category === "income";
									if (currentSection === "expenses")
										return group.category === "expense";
									if (currentSection === "profit")
										return (
											group.category === "total" || group.category === "tax"
										);
									return group.category === "income";
								})}
								isKleinunternehmer={isKleinunternehmer}
								categories={categories}
								skrCategories={skrCategories}
								currentSkr={currentSkr}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
