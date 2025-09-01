import React from 'react';
import { CheckCircle, Circle, User, TrendingUp, TrendingDown, Calculator, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import type { NavigationSection, ProgressState } from '../types';

interface NavigationSidebarProps {
    sections: NavigationSection[];
    currentSection: string;
    progress: ProgressState;
    onSectionChange: (sectionId: string) => void;
    onHelpToggle: () => void;
    helpVisible: boolean;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
    sections,
    currentSection,
    progress,
    onSectionChange,
    onHelpToggle,
    helpVisible
}) => {
    const getSectionIcon = (sectionId: string) => {
        switch (sectionId) {
            case 'personal':
                return <User size={20} />;
            case 'income':
                return <TrendingUp size={20} />;
            case 'expenses':
                return <TrendingDown size={20} />;
            case 'totals':
                return <Calculator size={20} />;
            default:
                return <Circle size={20} />;
        }
    };

    const getSectionColor = (sectionId: string) => {
        switch (sectionId) {
            case 'personal':
                return 'text-blue-600';
            case 'income':
                return 'text-green-600';
            case 'expenses':
                return 'text-red-600';
            case 'totals':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card className="w-full lg:w-80 h-fit sticky top-4">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">ELSTER Navigation</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onHelpToggle}
                        className={`p-2 ${helpVisible ? 'bg-primary/10 text-primary' : ''}`}
                        aria-label="Hilfe umschalten"
                    >
                        <HelpCircle size={18} />
                    </Button>
                </div>

                {/* Progress Overview */}
                <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gesamtfortschritt</span>
                        <span className="font-medium">
                            {progress.completedSections}/{progress.totalSections} Abschnitte
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.completedSections / progress.totalSections) * 100}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-muted-foreground">Felder</div>
                            <div className="font-medium">
                                {progress.completedFields}/{progress.totalFields}
                            </div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Pflichtfelder</div>
                            <div className="font-medium text-red-600">
                                {progress.completedMandatoryFields}/{progress.mandatoryFields}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Sections */}
                <div className="space-y-2">
                    {sections.map((section) => (
                        <Button
                            key={section.id}
                            variant={currentSection === section.id ? 'default' : 'ghost'}
                            className={`w-full justify-start p-3 h-auto ${currentSection === section.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                                }`}
                            onClick={() => onSectionChange(section.id)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`flex-shrink-0 ${getSectionColor(section.id)}`}>
                                    {getSectionIcon(section.id)}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm">{section.title}</div>
                                    <div className="text-xs opacity-75 mt-1">
                                        {section.fields.length} Felder
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {section.completed ? (
                                        <CheckCircle size={16} className="text-green-600" />
                                    ) : (
                                        <Circle size={16} className="text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        Navigieren Sie durch die ELSTER-Abschnitte. Pflichtfelder sind mit einem roten Sternchen markiert.
                        Klicken Sie auf Felder für Details und Hilfe.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default NavigationSidebar;