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
          <div className="border-border border-b bg-muted/30 lg:w-80 lg:border-r lg:border-b-0">
            <div className="flex h-full flex-col p-6">
              <NavigationSidebar
                currentSection={currentSection}
                currentSkr={currentSkr}
                euerCalculation={euerCalculation}
                isKleinunternehmer={isKleinunternehmer}
                onSectionChange={onSectionChange}
                sections={guidanceData.sections}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[600px] flex-1">
            <div className="space-y-6 p-6">
              <FieldGroups
                categories={categories}
                currentSkr={currentSkr}
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
                skrCategories={skrCategories}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
